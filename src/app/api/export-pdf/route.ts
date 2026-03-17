import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { PDFDocument, rgb } from "pdf-lib";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Check plan
    const { data: profile } = await supabase.from("users").select("plan").eq("id", user.id).single();
    if (profile?.plan !== "premium") {
      return NextResponse.json({ error: "PDF export is a Premium feature. Please upgrade." }, { status: 403 });
    }

    const { title, content, flashcards } = await req.json();
    if (!content) return NextResponse.json({ error: "Content required" }, { status: 400 });

    // Create PDF
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    let yPosition = height - 50;

    // Title
    page.drawText(title || "Study Notes", {
      x: 50,
      y: yPosition,
      size: 20,
      color: rgb(0.2, 0.2, 0.2),
    });
    yPosition -= 40;

    // Content
    const lines = content.split('\n');
    for (const line of lines) {
      if (yPosition < 50) {
        page = pdfDoc.addPage();
        yPosition = height - 50;
      }

      // Handle markdown formatting
      let fontSize = 12;
      let color = rgb(0.2, 0.2, 0.2);
      let text = line;

      if (line.startsWith('# ')) {
        fontSize = 16;
        color = rgb(0.1, 0.1, 0.1);
        text = line.substring(2);
      } else if (line.startsWith('## ')) {
        fontSize = 14;
        color = rgb(0.15, 0.15, 0.15);
        text = line.substring(3);
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        text = '• ' + line.substring(2);
      }

      page.drawText(text, {
        x: 50,
        y: yPosition,
        size: fontSize,
        color,
        maxWidth: width - 100,
      });
      yPosition -= fontSize + 4;
    }

    // Flashcards section
    if (flashcards && flashcards.length > 0) {
      if (yPosition < 100) {
        page = pdfDoc.addPage();
        yPosition = height - 50;
      }

      yPosition -= 20;
      page.drawText("Flashcards", {
        x: 50,
        y: yPosition,
        size: 16,
        color: rgb(0.1, 0.1, 0.1),
      });
      yPosition -= 30;

      flashcards.forEach((card: { question: string; answer: string }, index: number) => {
        if (yPosition < 100) {
          page = pdfDoc.addPage();
          yPosition = height - 50;
        }

        page.drawText(`Q${index + 1}: ${card.question}`, {
          x: 50,
          y: yPosition,
          size: 12,
          color: rgb(0.2, 0.2, 0.2),
          maxWidth: width - 100,
        });
        yPosition -= 16;

        page.drawText(`A: ${card.answer}`, {
          x: 70,
          y: yPosition,
          size: 11,
          color: rgb(0.4, 0.4, 0.4),
          maxWidth: width - 120,
        });
        yPosition -= 25;
      });
    }


    const pdfBytes = await pdfDoc.save();

return new NextResponse(new Uint8Array(pdfBytes), {
  status: 200,
  headers: {
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="${title || "study-notes"}.pdf`,
  },
});
  } catch (err: unknown) {
    console.error("Export PDF error:", err);
    const message = err instanceof Error ? err.message : "Failed to export PDF";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}