-- CreateTable
CREATE TABLE "GenresOnTracks" (
    "track_id" TEXT NOT NULL,
    "genre_id" TEXT NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assigned_by" TEXT NOT NULL,

    CONSTRAINT "GenresOnTracks_pkey" PRIMARY KEY ("track_id","genre_id")
);

-- AddForeignKey
ALTER TABLE "GenresOnTracks" ADD CONSTRAINT "GenresOnTracks_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenresOnTracks" ADD CONSTRAINT "GenresOnTracks_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "Genre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
