import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Body = {
  question?: unknown;
};

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

function summarizeUpstreamBody(bodyText: string) {
  const trimmed = bodyText.trim();
  if (!trimmed) return "";
  // If HTML, avoid returning a whole page.
  if (
    trimmed.startsWith("<!DOCTYPE") ||
    trimmed.startsWith("<html") ||
    trimmed.includes("<html")
  ) {
    const titleMatch = trimmed.match(/<title>([^<]+)<\/title>/i);
    const title = titleMatch?.[1]?.trim();
    return title
      ? `Upstream returned HTML (${title}). Check OPENAI_BASE_URL/model/key.`
      : "Upstream returned HTML. Check OPENAI_BASE_URL/model/key.";
  }
  return trimmed.slice(0, 500);
}

function requireString(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const trimmed = v.trim();
  if (!trimmed) return null;
  return trimmed;
}

function sseToTextStream(sseStream: ReadableStream<Uint8Array>) {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  let buf = "";

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = sseStream.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buf += decoder.decode(value, { stream: true });
          // Normalize CRLF so split logic works across providers.
          buf = buf.replace(/\r\n/g, "\n");

          // SSE events are separated by blank lines.
          const parts = buf.split("\n\n");
          buf = parts.pop() ?? "";

          for (const chunk of parts) {
            const lines = chunk.split("\n");
            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith("data:")) continue;
              const data = trimmed.slice("data:".length).trim();
              if (!data || data === "[DONE]") continue;

              let json: any;
              try {
                json = JSON.parse(data);
              } catch {
                continue;
              }

              // OpenAI Responses API streaming event (preferred)
              const type = json?.type;
              if (type === "response.output_text.delta") {
                const delta = json?.delta;
                if (typeof delta === "string" && delta) {
                  controller.enqueue(encoder.encode(delta));
                }
                continue;
              }

              // Chat Completions streaming (fallback for OpenAI-compatible providers)
              const chatDelta = json?.choices?.[0]?.delta?.content;
              if (typeof chatDelta === "string" && chatDelta) {
                controller.enqueue(encoder.encode(chatDelta));
                continue;
              }

              // Some providers stream plain `text` fields
              const textDelta = json?.text;
              if (typeof textDelta === "string" && textDelta) {
                controller.enqueue(encoder.encode(textDelta));
              }
            }
          }
        }
      } finally {
        controller.close();
        reader.releaseLock();
      }
    },
  });
}

export async function POST(req: Request) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "Missing OPENAI_API_KEY on server." },
      { status: 500 },
    );
  }

  const baseUrlRaw = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
  const baseUrl = baseUrlRaw.replace(/\/+$/, "");
  const forceNonStreaming = process.env.OPENAI_FORCE_NONSTREAM === "1";

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return badRequest("Invalid JSON body.");
  }

  const question = requireString(body.question);
  if (!question) return badRequest("Missing `question`.");
  if (question.length > 2000) return badRequest("Question too long.");

  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

  const portfolioFacts = [
    "Owner/alias: R43AP3R editz (also known as Anish Kumar).",
    "This is a personal portfolio site with a desktop-OS style interface.",
    "Routes include: /, /about, /projects, /experience, /activity, /contact, /donate.",
    "Key projects include: Xibe AI, Xibe Chat, Xibe Chat CLI, PR Review Bot, Sub.MegaVault, Video-Gen, Pollin-Coder, AniSurge, and more.",
    "The Terminal supports allowlisted commands: help, clear, whoami, stack, repo, open <appId>, about/projects/activity/experience/contact/donate, ai <question>.",
  ].join("\n");

  const system = [
    "You are the AI inside a portfolio's simulated Terminal app.",
    "Be concise, helpful, and grounded in the portfolio context only.",
    "Never claim you executed real commands or accessed files or the network.",
    "If the user asks for anything unrelated to the portfolio, say so and redirect to relevant commands/pages.",
    "You may request safe actions by emitting a single marker on its own line exactly like: [[OPEN_APP:appId]] where appId is one of overview, projects, activity, experience, about, contact, donate, terminal.",
    "",
    "Portfolio facts:",
    portfolioFacts,
    "",
    "If suggesting actions, phrase them as terminal commands the user can run (e.g. `projects`, `open contact`).",
  ].join("\n");

  const headers = {
    authorization: `Bearer ${key}`,
    "content-type": "application/json",
    accept: "text/event-stream",
  };

  if (forceNonStreaming) {
    const upstream = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: { ...headers, accept: "application/json" },
      body: JSON.stringify({
        model,
        stream: false,
        messages: [
          { role: "system", content: system },
          { role: "user", content: question },
        ],
      }),
    });

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => "");
      const summary = summarizeUpstreamBody(text);
      return NextResponse.json(
        {
          error: `Upstream error (${upstream.status}): ${summary || upstream.statusText}`,
        },
        { status: 502 },
      );
    }

    const text = await upstream.text().catch(() => "");
    try {
      const json: any = JSON.parse(text);
      const content = json?.choices?.[0]?.message?.content;
      if (typeof content === "string") {
        return new NextResponse(content, {
          status: 200,
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "no-store",
          },
        });
      }
    } catch {
      // ignore
    }
    return new NextResponse(text, {
      status: 200,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  }

  // Prefer Responses API streaming when available, fallback to Chat Completions streaming.
  let upstream = await fetch(`${baseUrl}/responses`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model,
      stream: true,
      input: [
        { role: "system", content: system },
        { role: "user", content: question },
      ],
    }),
  });

  if (!upstream.ok) {
    upstream = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        stream: true,
        messages: [
          { role: "system", content: system },
          { role: "user", content: question },
        ],
      }),
    });
  }

  if (!upstream.ok) {
    const text = await upstream.text().catch(() => "");
    const summary = summarizeUpstreamBody(text);
    return NextResponse.json(
      {
        error: `Upstream error (${upstream.status}): ${summary || upstream.statusText}`,
      },
      { status: 502 },
    );
  }

  const bodyStream = upstream.body;
  if (!bodyStream) {
    const text = await upstream.text().catch(() => "");
    return new NextResponse(text, { status: 200 });
  }

  const contentType = upstream.headers.get("content-type") || "";
  const isSse = contentType.includes("text/event-stream");

  if (!isSse) {
    // Provider didn’t stream SSE. Try to extract text from a non-streaming JSON response.
    const text = await upstream.text().catch(() => "");
    try {
      const json: any = JSON.parse(text);
      const fromChat = json?.choices?.[0]?.message?.content;
      if (typeof fromChat === "string" && fromChat) {
        return new NextResponse(fromChat, {
          status: 200,
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "no-store",
          },
        });
      }
      const fromResponses =
        json?.output_text ||
        json?.output
          ?.map?.((o: any) => o?.content?.map?.((c: any) => c?.text).join(""))
          .join("") ||
        null;
      if (typeof fromResponses === "string" && fromResponses) {
        return new NextResponse(fromResponses, {
          status: 200,
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "no-store",
          },
        });
      }
    } catch {
      // If it isn't JSON, just pass through whatever we got.
    }

    return new NextResponse(text, {
      status: 200,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  }

  // SSE stream → plain text stream for the terminal.
  const textStream = sseToTextStream(bodyStream);

  return new NextResponse(textStream, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
