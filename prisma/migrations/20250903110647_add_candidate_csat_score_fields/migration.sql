-- AlterTable
ALTER TABLE "public"."candidate_survey_answers" ADD COLUMN     "answer_score" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."candidates" ADD COLUMN     "score" DOUBLE PRECISION;
