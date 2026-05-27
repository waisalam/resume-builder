export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { model } from "@/lib/gemini";
import { extractText } from "unpdf";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File;

    console.log("📁 File received:", file?.name, file?.type, file?.size);

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // ✅ Step 1 - Parse PDF (unpdf works natively in Next.js, no canvas needed)
    let extractedText = "";
    try {
      const buffer = await file.arrayBuffer();
 const { text } = await extractText(new Uint8Array(buffer));
extractedText = text.join(" "); // joins all pages into one string
      console.log("✅ PDF parsed, text length:", extractedText.length);
    } catch (pdfError) {
      console.error("❌ PDF parse failed:", pdfError);
      return NextResponse.json(
        { error: "PDF parsing failed", detail: String(pdfError) },
        { status: 500 }
      );
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json({ error: "No text found in PDF" }, { status: 400 });
    }

    // ✅ Step 2 - Send to Gemini
    let parsedJson: any;
    try {
      const prompt = `
Convert this resume into JSON.
Return ONLY valid JSON with no extra text, no markdown, no backticks.

Format:
{
  "name": "",
  "summary": "",
  "skills": [],
  "experience": [],
  "projects": [],
  "education": []
}

Resume:
${extractedText}
`;
      const geminiResult = await model.generateContent(prompt);
      const responseText = geminiResult.response.text();
      console.log("✅ Gemini responded, length:", responseText.length);

      const cleanedResponse = responseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      parsedJson = JSON.parse(cleanedResponse);
      console.log("✅ JSON parsed successfully");
    } catch (geminiError) {
      console.error("❌ Gemini/JSON failed:", geminiError);
      return NextResponse.json(
        { error: "Gemini processing failed", detail: String(geminiError) },
        { status: 500 }
      );
    }

    // ✅ Step 3 - Save to DB
    try {
      const savedResume = await prisma.resume.create({
        data: {
          title: parsedJson.name ? `${parsedJson.name}'s Resume` : "My Resume",
          resumeJson: parsedJson,
        },
      });
      console.log("✅ Saved to DB:", savedResume.id);

      return NextResponse.json({ success: true, data: savedResume });
    } catch (dbError) {
      console.error("❌ DB save failed:", dbError);
      return NextResponse.json(
        { error: "Database save failed", detail: String(dbError) },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("❌ Unexpected error:", error);
    return NextResponse.json(
      { error: "Unexpected error", detail: String(error) },
      { status: 500 }
    );
  }
}