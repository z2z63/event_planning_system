import getActivityById from "@/app/lib/data";

export default async function Page({ params }: { params: { id: string } }) {
  const data = await getActivityById(Number(params.id));
  console.dir(data, { depth: null });
  return <h1>{params.id}</h1>;
}
