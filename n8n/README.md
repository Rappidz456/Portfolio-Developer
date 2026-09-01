# Portfolio AI agent — n8n setup

The chat widget in the bottom-right of the site talks to `/api/chat`, which forwards
to an n8n workflow. n8n holds the LLM and Gmail credentials; the site never sees them.

```
AiAgent.tsx  →  /api/chat  →  n8n Webhook → AI Agent (Groq) → Respond
                                                  ├── Simple Memory
                                                  └── send_lead_email (Gmail)
```

## 1. Import the workflow

n8n → **Workflows** → **Import from File** → `portfolio-agent.workflow.json`.

## 2. Add the Groq credential

Get a free key at <https://console.groq.com/keys>.

Open the **Groq Chat Model** node → **Credential to connect with** → **Create new** →
paste the key. The model is preset to `llama-3.3-70b-versatile`. If that name has been
retired, pick any current model from the dropdown — the free tier covers all of them.

## 3. Add the Gmail credential

Open the **send_lead_email** node → **Create new credential** → *Gmail OAuth2*.
n8n's own guide walks through the Google Cloud consent screen:
<https://docs.n8n.io/integrations/builtin/credentials/google/oauth-single-service/>

The recipient is hardcoded to `mohammadali6918773@gmail.com` on purpose — the agent
can compose the message but cannot change who it goes to, so the widget can't be
turned into a spam relay.

**If the Google OAuth setup is more hassle than it's worth:** delete the node and add
a **Send Email** node instead (`Send Email Tool`), pointed at any SMTP account. Wire
it to the AI Agent's `Tool` connector and give it the same description. Everything
else stays the same.

## 4. Set the shared secret

Generate one:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Open the **Verify Secret** node and replace `REPLACE_WITH_YOUR_SHARED_SECRET` with it.
Put the same value in `.env.local` as `N8N_SHARED_SECRET`.

Requests without a matching `x-portfolio-secret` header get a 401 from the **Reject**
branch, so a leaked webhook URL alone can't burn your Groq quota.

## 5. Activate and wire up the site

Toggle the workflow **Active**, then copy the **Production URL** from the Webhook node
(the test URL only fires while you're watching an execution).

`.env.local` in the project root:

```
N8N_WEBHOOK_URL=https://your-instance.app.n8n.cloud/webhook/portfolio-agent
N8N_SHARED_SECRET=the-value-from-step-4
```

Restart `npm run dev`, then add both variables to your Vercel project settings before
deploying.

## Notes

- **The agent's knowledge is generated from `src/lib/data.ts`** by
  `src/lib/agent-context.ts` and sent with every request. Add a project to `data.ts`
  and the agent knows about it on the next deploy — there is no copy of your bio to
  maintain inside n8n.
- **Memory** is keyed on a `sessionId` the browser generates per tab, so the agent
  follows a conversation but different visitors never share history.
- **Rate limit** is 15 messages per IP per hour, enforced in `/api/chat`. It lives in
  process memory, so it resets when a serverless instance recycles. Move it to Upstash
  Redis if the site ever gets real traffic.
- **Latency**: a standard webhook response returns one blob after the agent finishes,
  so expect 1–3 seconds on Groq. The widget shows a typing indicator meanwhile.
