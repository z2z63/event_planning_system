import { createBlob } from "@/app/lib/data";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const data = Buffer.from(new Uint8Array(await file.arrayBuffer()));
  const id = await createBlob(data);
  return Response.json({ id });
}
