"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useEscape } from "@/lib/hooks";
import { cn, prefersReducedMotion } from "@/lib/utils";
import { scrollToSection, type AgentSection } from "@/lib/agent-nav";
import { profile } from "@/lib/data";

type Message = { id: number; role: "user" | "agent"; text: string };

const GREETING =
  "Hey — I'm Ali's assistant. Ask me about his work, his stack, or the projects he's shipped. If you'd like to reach him, tell me who you are and what you need and I'll pass it straight to his inbox.";

const SUGGESTIONS = [
  "What has he built recently?",
  "Is he available for work?",
  "What's his experience with AI?",
];

const SESSION_KEY = "portfolio-agent-session";

function getSessionId(): string {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const fresh = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, fresh);
    return fresh;
  } catch {
    return crypto.randomUUID();
  }
}

function Typewriter({
  text,
  onTick,
}: {
  text: string;
  onTick?: () => void;
}) {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setShown(text);
      setDone(true);
      return;
    }

    setShown("");
    setDone(false);
    let i = 0;
    let timer = 0;

    const tick = () => {
      i = Math.min(text.length, i + (text.length > 180 ? 3 : 2));
      setShown(text.slice(0, i));
      onTick?.();
      if (i >= text.length) {
        setDone(true);
        return;
      }
      timer = window.setTimeout(tick, 16);
    };

    timer = window.setTimeout(tick, 40);
    return () => window.clearTimeout(timer);
  }, [text, onTick]);

  return (
    <span>
      {shown}
      {!done && <span className="agent-caret" aria-hidden />}
    </span>
  );
}

function TypingDots() {
  return (
    <div className="agent-bubble flex justify-start">
      <span className="flex items-center gap-1.5 rounded-xl border border-cream/10 bg-white/4 px-3.5 py-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="agent-typing-dot h-1.5 w-1.5 rounded-full bg-amber"
            style={{ animationDelay: `${i * 0.16}s` }}
          />
        ))}
        <span className="micro ml-1.5 text-cream/40">Typing</span>
      </span>
    </div>
  );
}

export default function AiAgent() {
  const [phase, setPhase] = useState<"closed" | "open" | "closing">("closed");
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "agent", text: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [nextId, setNextId] = useState(1);

  const sessionRef = useRef<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const open = phase === "open";

  const close = useCallback(() => {
    setPhase((current) => (current === "open" ? "closing" : current));
  }, []);

  const toggle = useCallback(() => {
    setPhase((current) => (current === "open" ? "closing" : "open"));
  }, []);

  useEscape(close);

  useEffect(() => {
    if (phase !== "open") return;
    if (!sessionRef.current) sessionRef.current = getSessionId();
    const id = window.setTimeout(() => inputRef.current?.focus(), 280);
    return () => window.clearTimeout(id);
  }, [phase]);

  const scrollToEnd = useCallback(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    scrollToEnd();
  }, [messages, pending, scrollToEnd]);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || pending) return;

      const userId = nextId;
      setNextId((n) => n + 2);
      setMessages((prev) => [...prev, { id: userId, role: "user", text }]);
      setInput("");
      setPending(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ message: text, sessionId: sessionRef.current }),
        });
        const data = await res.json().catch(() => null);

        const reply =
          typeof data?.reply === "string"
            ? data.reply
            : typeof data?.error === "string"
              ? data.error
              : `Something went wrong on my end. You can always reach Ali at ${profile.email}.`;

        setMessages((prev) => [
          ...prev,
          { id: userId + 1, role: "agent", text: reply },
        ]);

        const dest = data?.navigate;
        if (
          dest === "#work" ||
          dest === "#experience" ||
          dest === "#skills" ||
          dest === "#about" ||
          dest === "#contact"
        ) {
          window.setTimeout(() => scrollToSection(dest as AgentSection), 350);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: userId + 1,
            role: "agent",
            text: `I couldn't reach the server. Ali is at ${profile.email} if it's urgent.`,
          },
        ]);
      } finally {
        setPending(false);
        inputRef.current?.focus();
      }
    },
    [pending, nextId]
  );

  return (
    <div className="pointer-events-none fixed right-0 bottom-0 z-70 flex flex-col items-end p-4 sm:p-6">
      {phase !== "closed" && (
        <div
          role="dialog"
          aria-label="Chat with Ali's assistant"
          onAnimationEnd={() => {
            if (phase === "closing") setPhase("closed");
          }}
          className={cn(
            "pointer-events-auto mb-3 flex h-[min(32rem,70vh)] w-[min(23rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-cream/10 bg-[linear-gradient(150deg,#241f16,#0e0c09)] shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)]",
            phase === "closing" ? "agent-panel-out" : "agent-panel-in"
          )}
        >
          <header className="flex shrink-0 items-center justify-between gap-3 border-b border-cream/8 px-4 py-3">
            <span className="eyebrow flex items-center gap-2 text-cream/70">
              <span className="dot dot-live shrink-0" />
              Ask about Ali
            </span>
            <button
              type="button"
              onClick={close}
              aria-label="Close chat"
              className="flex h-7 w-7 items-center justify-center rounded-md text-cream/50 transition-colors hover:bg-white/8 hover:text-cream"
            >
              <svg viewBox="0 0 14 14" className="h-3 w-3" aria-hidden>
                <path
                  d="M1 1l12 12M13 1L1 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </header>

          <div
            ref={scrollRef}
            data-lenis-prevent
            className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
          >
            {messages.map((msg, i) => (
              <div
                key={msg.id}
                className={cn(
                  "agent-bubble flex",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
                style={{ animationDelay: `${Math.min(i, 4) * 40}ms` }}
              >
                <p
                  className={cn(
                    "max-w-[85%] rounded-xl px-3 py-2 text-[13px] leading-relaxed whitespace-pre-wrap",
                    msg.role === "user"
                      ? "bg-cream text-black"
                      : "border border-cream/10 bg-white/4 text-cream/80"
                  )}
                >
                  {msg.role === "agent" ? (
                    <Typewriter text={msg.text} onTick={scrollToEnd} />
                  ) : (
                    msg.text
                  )}
                </p>
              </div>
            ))}

            {pending && <TypingDots />}

            {messages.length === 1 && !pending && (
              <div className="agent-bubble flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void send(s)}
                    className="rounded-full border border-cream/12 bg-white/4 px-3 py-1.5 text-[11px] text-cream/60 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/8 hover:text-cream"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
            className="flex shrink-0 items-center gap-2 border-t border-cream/8 p-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={800}
              placeholder="Ask something…"
              aria-label="Your message"
              className="min-w-0 flex-1 rounded-lg border border-cream/10 bg-white/4 px-3 py-2.5 text-[13px] text-cream placeholder:text-cream/35 focus:border-cream/25 focus:outline-none"
            />
            <button
              type="submit"
              disabled={pending || !input.trim()}
              aria-label="Send message"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cream text-black transition-transform duration-200 hover:scale-105 disabled:opacity-30 disabled:hover:scale-100"
            >
              <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
                <path
                  d="M2 8h11M8.5 3.5L13 8l-4.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Chat with Ali's assistant"}
        className={cn(
          "eyebrow pointer-events-auto flex min-h-11 items-center gap-2.5 rounded-full bg-cream px-5 py-3 text-black transition-transform duration-300 hover:-translate-y-0.5",
          open ? "shadow-[0_0_50px_-8px_rgba(245,239,197,0.5)]" : "agent-launch"
        )}
      >
        <span className="dot dot-live shrink-0" />
        {open ? "Close" : "Ask AI"}
      </button>
    </div>
  );
}
