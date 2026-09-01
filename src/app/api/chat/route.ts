import { agentContext } from "@/lib/agent-context";

export const runtime = "nodejs";

const MAX_MESSAGE_LENGTH = 800;
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 15;
const N8N_TIMEOUT_MS = 45_000;

/**
 * Per-instance rate limit. On serverless this resets whenever the instance is
 * recycled, so it is a speed bump rather than a guarantee — enough to stop a
 * bored visitor from draining the Groq quota. Swap for Upstash Redis if the
 * site ever gets real traffic.
 */
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }

  recent.push(now);
  hits.set(ip, recent);

  // Keep the map from growing without bound across long-lived instances.
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }

  return false;
}

function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/** n8n's Respond node can hand back an object or a single-item array. */
function extractReply(payload: unknown): string | null {
  const item = Array.isArray(payload) ? payload[0] : payload;
  if (!item || typeof item !== "object") return null;

  const record = item as Record<string, unknown>;
  for (const key of ["output", "reply", "text", "response"]) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

export async function POST(req: Request) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  const sharedSecret = process.env.N8N_SHARED_SECRET;

  if (!webhookUrl || !sharedSecret) {
    console.error("[chat] N8N_WEBHOOK_URL or N8N_SHARED_SECRET is not set");
    return Response.json(
      { error: "The assistant is not configured yet." },
      { status: 503 }
    );
  }

  if (rateLimited(clientIp(req))) {
    return Response.json(
      { error: "That's a lot of questions. Try again in a bit — or just email me." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const { message, sessionId } = (body ?? {}) as {
    message?: unknown;
    sessionId?: unknown;
  };

  if (typeof message !== "string" || !message.trim()) {
    return Response.json({ error: "Message is required." }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return Response.json({ error: "Message is too long." }, { status: 400 });
  }
  if (typeof sessionId !== "string" || !sessionId.trim()) {
    return Response.json({ error: "Session is required." }, { status: 400 });
  }

  try {
    const upstream = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-portfolio-secret": sharedSecret,
      },
      body: JSON.stringify({
        message: message.trim(),
        sessionId: sessionId.slice(0, 64),
        context: agentContext,
      }),
      signal: AbortSignal.timeout(N8N_TIMEOUT_MS),
    });

    if (!upstream.ok) {
      console.error("[chat] n8n responded", upstream.status);
      return Response.json(
        { error: "The assistant is unavailable right now." },
        { status: 502 }
      );
    }

    const reply = extractReply(await upstream.json());
    if (!reply) {
      console.error("[chat] no reply field in n8n response");
      return Response.json(
        { error: "The assistant is unavailable right now." },
        { status: 502 }
      );
    }

    return Response.json({ reply });
  } catch (error) {
    console.error("[chat] request to n8n failed", error);
    return Response.json(
      { error: "The assistant is unavailable right now." },
      { status: 502 }
    );
  }
}
