import { NextRequest } from "next/server";
const GEMINI_MODEL = "gemini-2.5-flash-lite";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Missing API_KEY" }),
        { status: 500 }
      );
    }

    const chatAiRes = await fetch(`https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: message }],
            },
          ],
        }),
      });

    if (!chatAiRes.ok) {
      const errorText = await chatAiRes.text();
      console.error("Chat API error:", errorText);
      return new Response(
        JSON.stringify({ error: "Chat API error" }),
        { status: 500 }
      );
    }

    const chatAiResJson = await chatAiRes.json();
    const chatAiReply = chatAiResJson.candidates?.[0]?.content?.parts?.[0]?.text ?? "No reply";

    return new Response(JSON.stringify({ chatAiReply }), {
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