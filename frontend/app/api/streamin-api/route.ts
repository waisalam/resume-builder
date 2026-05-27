import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export interface EnhanceRequest {
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  targetRole: string;
  summary: string;
  skills: string[];
  experience: Array<{ title: string; company: string; duration: string; description: string }>;
  education: Array<{ degree: string; school: string; year: string }>;
  projects?: Array<{ name: string; description: string }>;
}

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: EnhanceRequest;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // ✅ Log what we received so we can debug
  console.log("📥 Received body:", JSON.stringify(body, null, 2));

  const sections = [
    {
      key: "summary",
      prompt: `You are an expert resume writer.
Enhance this professional summary for someone targeting the role of "${body.targetRole}".
Make it punchy, ATS-friendly, and 3-4 sentences max.
Return ONLY the enhanced summary text. No labels, no JSON, no extra text.

Original summary:
${body.summary}`,
    },
    {
      key: "skills",
      prompt: `You are an expert resume writer.
Given this person is targeting "${body.targetRole}", enhance and expand this skills list.
Add relevant missing skills. Return as comma-separated values only.
No labels, no JSON, no bullet points. Just: Skill1, Skill2, Skill3

Current skills: ${Array.isArray(body.skills) ? body.skills.join(", ") : body.skills}
Their experience: ${body.experience.map((e) => `${e.title} at ${e.company}`).join(", ")}`,
    },
    {
      key: "experience",
      prompt: `You are an expert resume writer.
Rewrite these job descriptions to be impactful, quantified where possible, and ATS-optimized for "${body.targetRole}".
Return ONLY a JSON array, no markdown, no backticks.

Format exactly:
[
  {
    "title": "",
    "company": "",
    "duration": "",
    "bullets": ["bullet 1", "bullet 2", "bullet 3"]
  }
]

Experience to enhance:
${JSON.stringify(body.experience, null, 2)}`,
    },
    {
      key: "projects",
      prompt: `You are an expert resume writer.
Rewrite these project descriptions to highlight technical impact and skills relevant to "${body.targetRole}".
Return ONLY a JSON array, no markdown, no backticks.

Format exactly:
[
  {
    "name": "",
    "description": ""
  }
]

Projects:
${JSON.stringify(body.projects || [], null, 2)}`,
    },
  ];

  const stream = new ReadableStream({
    async start(controller) {
      const encode = (data: object) =>
        new TextEncoder().encode(JSON.stringify(data) + "\n");

      for (const section of sections) {
        controller.enqueue(encode({ event: "section_start", key: section.key }));

        try {
          const result = await model.generateContentStream(section.prompt);
          let fullText = "";

          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            fullText += chunkText;
            controller.enqueue(encode({ event: "chunk", key: section.key, text: chunkText }));
          }

          // ✅ These logs are now correctly inside the try block
          console.log(`✅ ${section.key} length:`, fullText.length);
          console.log(`✅ ${section.key} preview:`, fullText.slice(0, 150));

          controller.enqueue(encode({ event: "section_done", key: section.key, fullText }));

        } catch (err) {
          // ✅ This catch is inside the ReadableStream where controller exists
          console.error(`❌ ${section.key} failed:`, String(err));
          controller.enqueue(encode({ event: "section_error", key: section.key, error: String(err) }));
        }
      }

      controller.enqueue(encode({ event: "done" }));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}