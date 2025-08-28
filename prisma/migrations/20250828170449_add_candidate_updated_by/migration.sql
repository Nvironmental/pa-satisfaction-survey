-- AlterTable
ALTER TABLE "public"."candidates" ADD COLUMN     "updatedBy" TEXT;

-- AddForeignKey
ALTER TABLE "public"."candidates" ADD CONSTRAINT "candidates_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
