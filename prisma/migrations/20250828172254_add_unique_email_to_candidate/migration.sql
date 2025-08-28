/*
  Warnings:

  - A unique constraint covering the columns `[candidateEmail]` on the table `candidates` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "candidates_candidateEmail_key" ON "public"."candidates"("candidateEmail");
