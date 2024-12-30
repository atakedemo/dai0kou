import { NextResponse } from "next/server";
import { generateContent } from "@/lib/VertexAi";

export async function POST(req: Request) {
  const { message } = await req.json();

  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  try {
    const aiResponse = await generateContent(message);
    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error("Error communicating with Vertex AI:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}