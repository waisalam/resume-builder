// app/api/streamin-api/edit/route.ts

import { NextResponse } from "next/server";
import { model } from "@/lib/gemini";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { resume, prompt } = await req.json();

    const aiPrompt = `
You are an expert resume editor.

The user wants to make this change to their resume:
"${prompt}"

Here is their current resume data:
${JSON.stringify(resume, null, 2)}

Apply the user's requested change and return the updated resume sections.
Return ONLY valid JSON with no markdown, no backticks, no extra text.

Return this exact format:
{
  "summary": "updated summary text here",
  "skills": ["skill1", "skill2", "skill3"],
  "experience": [
    {
      "title": "",
      "company": "",
      "duration": "",
      "bullets": ["bullet 1", "bullet 2", "bullet 3"]
    }
  ],
  "projects": [
    {
      "name": "",
      "description": ""
    }
  ]
}

Only modify what the user asked to change. Keep everything else exactly as it was.
`;

    const result = await model.generateContent(aiPrompt);
    const text = result.response.text();
    const clean = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(clean);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Edit route error:", error);
    return NextResponse.json({ error: "Edit failed", detail: String(error) }, { status: 500 });
  }
}