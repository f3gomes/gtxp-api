/*
  Warnings:

  - A unique constraint covering the columns `[resetToken]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expiresAt` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resetToken` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "resetToken" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_resetToken_key" ON "users"("resetToken");
