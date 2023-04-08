/*
  Warnings:

  - Made the column `group_id` on table `Album` required. This step will fail if there are existing NULL values in that column.
  - Made the column `group_id` on table `Track` required. This step will fail if there are existing NULL values in that column.
  - Made the column `album_id` on table `Track` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Album" DROP CONSTRAINT "Album_group_id_fkey";

-- DropForeignKey
ALTER TABLE "Track" DROP CONSTRAINT "Track_album_id_fkey";

-- DropForeignKey
ALTER TABLE "Track" DROP CONSTRAINT "Track_group_id_fkey";

-- AlterTable
ALTER TABLE "Album" ALTER COLUMN "group_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "Track" ALTER COLUMN "group_id" SET NOT NULL,
ALTER COLUMN "album_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
