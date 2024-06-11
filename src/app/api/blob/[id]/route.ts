import { getBlobById } from "@/app/lib/data";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const searchParams = request.nextUrl.searchParams;
  const blob = await getBlobById(Number(params.id));
  if (blob?.data === undefined) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }
  if (
    searchParams.get("attachment") === "true" &&
    searchParams.has("filename")
  ) {
    return new NextResponse(blob.data, {
      headers: {
        "Content-Disposition": `attachment; filename="${encodeURIComponent(blob.filename)}"`,
      },
    });
  }
  return new Response(blob.data);
}
