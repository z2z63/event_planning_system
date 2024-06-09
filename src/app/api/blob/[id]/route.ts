import { getBlobById } from "@/app/lib/data";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const searchParams = request.nextUrl.searchParams;
  const data = await getBlobById(Number(params.id));
  if (data === undefined) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }
  if (
    searchParams.get("attachment") === "true" &&
    searchParams.has("filename")
  ) {
    const filename = searchParams.get("filename")!;
    return new NextResponse(data, {
      headers: {
        "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
      },
    });
  }
  return new Response(data);
}
