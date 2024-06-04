import { getBlobById } from "@/app/lib/data";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const data = await getBlobById(Number(params.id));
  if (data === undefined) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }
  return new Response(data);
}
