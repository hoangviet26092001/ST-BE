-- CreateEnum
CREATE TYPE "Status" AS ENUM ('TODO', 'DONE', 'IN_REVIEW', 'BACKLOG');

-- CreateTable
CREATE TABLE "tasks" (
    "id" UUID NOT NULL,
    "status" "Status" NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);
