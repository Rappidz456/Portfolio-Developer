"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useEscape } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { profile } from "@/lib/data";

type Message = { role: "user" | "agent"; text: string };

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
    // Private mode or blocked storage — a per-mount id still gives the agent
    // conversation memory for as long as the panel stays open.
    return crypto.randomUUID();
  }
}

export default function AiAgent() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "agent", text: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);

  const sessionRef = useRef<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEscape(() => setOpen(false));

  useEffect(() => {
    if (!open) return;
    if (!sessionRef.current) sessionRef.current = getSessionId();
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, pending]);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || pending) return;

      setMessages((prev) => [...prev, { role: "user", text }]);
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

        setMessages((prev) => [...prev, { role: "agent", text: reply }]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "agent",
            text: `I couldn't reach the server. Ali is at ${profile.email} if it's urgent.`,
          },
        ]);
      } finally {
        setPending(false);
        inputRef.current?.focus();
      }
    },
    [pending]
  );

  return (
    <div className="pointer-events-none fixed right-0 bottom-0 z-70 flex flex-col items-end p-4 sm:p-6">
      {open && (
        <div
          role="dialog"
          aria-label="Chat with Ali's assistant"
          // Deliberately opaque rather than `.glass`: a chat panel sits over the
          // hero and has to stay readable, and the compiled `.glass` rule ships
          // without its backdrop-filter.
          className="pointer-events-auto mb-3 flex h-[min(32rem,70vh)] w-[min(23rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-cream/10 bg-[linear-gradient(150deg,#241f16,#0e0c09)] shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)]"
        >
          <header className="flex shrink-0 items-center justify-between gap-3 border-b border-cream/8 px-4 py-3">
            <span className="eyebrow flex items-center gap-2 text-cream/70">
              <span className="dot dot-live shrink-0" />
              Ask about Ali
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
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
            // Keeps Lenis from stealing the wheel event and scrolling the page
            // behind the panel.
            data-lenis-prevent
            className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "flex",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <p
                  className={cn(
                    "max-w-[85%] rounded-xl px-3 py-2 text-[13px] leading-relaxed whitespace-pre-wrap",
                    msg.role === "user"
                      ? "bg-cream text-black"
                      : "border border-cream/10 bg-white/4 text-cream/80"
                  )}
                >
                  {msg.text}
                </p>
              </div>
            ))}

            {pending && (
              <div className="flex justify-start">
                <span className="flex gap-1 rounded-xl border border-cream/10 bg-white/4 px-3 py-3">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </span>
              </div>
            )}

            {messages.length === 1 && !pending && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void send(s)}
                    className="rounded-full border border-cream/12 bg-white/4 px-3 py-1.5 text-[11px] text-cream/60 transition-colors hover:bg-white/8 hover:text-cream"
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
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cream text-black transition-opacity disabled:opacity-30"
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
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Chat with Ali's assistant"}
        className="eyebrow pointer-events-auto flex min-h-11 items-center gap-2.5 rounded-full bg-cream px-5 py-3 text-black shadow-[0_0_50px_-8px_rgba(245,239,197,0.5)] transition-transform duration-300 hover:-translate-y-0.5"
      >
        <span className="dot dot-live shrink-0" />
        {open ? "Close" : "Ask AI"}
      </button>
    </div>
  );
}
