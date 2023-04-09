-- CreateTable
CREATE TABLE "FavoriteTrack" (
    "user_id" TEXT NOT NULL,
    "track_id" TEXT NOT NULL,

    CONSTRAINT "FavoriteTrack_pkey" PRIMARY KEY ("track_id","user_id")
);

-- CreateTable
CREATE TABLE "FavoriteAlbum" (
    "user_id" TEXT NOT NULL,
    "album_id" TEXT NOT NULL,

    CONSTRAINT "FavoriteAlbum_pkey" PRIMARY KEY ("user_id","album_id")
);

-- CreateTable
CREATE TABLE "FavoriteGroup" (
    "user_id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,

    CONSTRAINT "FavoriteGroup_pkey" PRIMARY KEY ("group_id","user_id")
);

-- AddForeignKey
ALTER TABLE "FavoriteTrack" ADD CONSTRAINT "FavoriteTrack_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteTrack" ADD CONSTRAINT "FavoriteTrack_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteAlbum" ADD CONSTRAINT "FavoriteAlbum_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteAlbum" ADD CONSTRAINT "FavoriteAlbum_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteGroup" ADD CONSTRAINT "FavoriteGroup_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteGroup" ADD CONSTRAINT "FavoriteGroup_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
