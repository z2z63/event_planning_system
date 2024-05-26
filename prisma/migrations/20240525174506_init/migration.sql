-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(20) NOT NULL,
    "salt" CHAR(20) NOT NULL,
    "hash" VARCHAR(20) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);
