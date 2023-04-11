/*
  Warnings:

  - You are about to drop the column `isRead` on the `message` table. All the data in the column will be lost.
  - You are about to drop the column `readTime` on the `message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `message` DROP COLUMN `isRead`,
    DROP COLUMN `readTime`;
