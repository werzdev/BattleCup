/*
  Warnings:

  - You are about to drop the column `email` on the `Player` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Player_email_key";

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "email",
ADD COLUMN     "beer" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "bombHits" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "bombMisses" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "bounceHits" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "bounceMisses" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "hits" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "misses" INTEGER NOT NULL DEFAULT 0;
