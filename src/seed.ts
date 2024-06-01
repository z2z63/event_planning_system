import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  prisma.user.createMany({
    data: [
      // {
      //   username:'李四',
      //
      // }
    ],
  });
}
