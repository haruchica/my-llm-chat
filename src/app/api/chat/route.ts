import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Missing OPENAI_API_KEY" }),
        { status: 500 }
      );
    }

    const openAiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: message },
        ],
      }),
    });

    if (!openAiRes.ok) {
      const errorText = await openAiRes.text();
      console.error("OpenAI API error:", errorText);
      return new Response(
        JSON.stringify({ error: "OpenAI API error" }),
        { status: 500 }
      );
    }

    const data = await openAiRes.json();
    const reply = data.choices?.[0]?.message?.content ?? "No reply";

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}