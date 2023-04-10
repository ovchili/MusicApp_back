/*
  Warnings:

  - You are about to drop the `FavoriteAlbum` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FavoriteGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FavoriteTrack` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GenresOnTracks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FavoriteAlbum" DROP CONSTRAINT "FavoriteAlbum_album_id_fkey";

-- DropForeignKey
ALTER TABLE "FavoriteAlbum" DROP CONSTRAINT "FavoriteAlbum_user_id_fkey";

-- DropForeignKey
ALTER TABLE "FavoriteGroup" DROP CONSTRAINT "FavoriteGroup_group_id_fkey";

-- DropForeignKey
ALTER TABLE "FavoriteGroup" DROP CONSTRAINT "FavoriteGroup_user_id_fkey";

-- DropForeignKey
ALTER TABLE "FavoriteTrack" DROP CONSTRAINT "FavoriteTrack_track_id_fkey";

-- DropForeignKey
ALTER TABLE "FavoriteTrack" DROP CONSTRAINT "FavoriteTrack_user_id_fkey";

-- DropForeignKey
ALTER TABLE "GenresOnTracks" DROP CONSTRAINT "GenresOnTracks_genre_id_fkey";

-- DropForeignKey
ALTER TABLE "GenresOnTracks" DROP CONSTRAINT "GenresOnTracks_track_id_fkey";

-- DropTable
DROP TABLE "FavoriteAlbum";

-- DropTable
DROP TABLE "FavoriteGroup";

-- DropTable
DROP TABLE "FavoriteTrack";

-- DropTable
DROP TABLE "GenresOnTracks";

-- CreateTable
CREATE TABLE "_GenreToTrack" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_GroupToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_AlbumToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_TrackToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GenreToTrack_AB_unique" ON "_GenreToTrack"("A", "B");

-- CreateIndex
CREATE INDEX "_GenreToTrack_B_index" ON "_GenreToTrack"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GroupToUser_AB_unique" ON "_GroupToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_GroupToUser_B_index" ON "_GroupToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AlbumToUser_AB_unique" ON "_AlbumToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_AlbumToUser_B_index" ON "_AlbumToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TrackToUser_AB_unique" ON "_TrackToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_TrackToUser_B_index" ON "_TrackToUser"("B");

-- AddForeignKey
ALTER TABLE "_GenreToTrack" ADD CONSTRAINT "_GenreToTrack_A_fkey" FOREIGN KEY ("A") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenreToTrack" ADD CONSTRAINT "_GenreToTrack_B_fkey" FOREIGN KEY ("B") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToUser" ADD CONSTRAINT "_GroupToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToUser" ADD CONSTRAINT "_GroupToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlbumToUser" ADD CONSTRAINT "_AlbumToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlbumToUser" ADD CONSTRAINT "_AlbumToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TrackToUser" ADD CONSTRAINT "_TrackToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TrackToUser" ADD CONSTRAINT "_TrackToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
