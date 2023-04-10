/*
  Warnings:

  - You are about to drop the column `name` on the `conversation` table. All the data in the column will be lost.
  - You are about to drop the column `theme` on the `conversation` table. All the data in the column will be lost.
  - The primary key for the `message` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `theme` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `_members` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_members` DROP FOREIGN KEY `_members_A_fkey`;

-- DropForeignKey
ALTER TABLE `_members` DROP FOREIGN KEY `_members_B_fkey`;

-- AlterTable
ALTER TABLE `conversation` DROP COLUMN `name`,
    DROP COLUMN `theme`;

-- AlterTable
ALTER TABLE `message` DROP PRIMARY KEY,
    MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `user` DROP COLUMN `theme`,
    ADD COLUMN `Theme` ENUM('light', 'dark') NOT NULL DEFAULT 'light';

-- DropTable
DROP TABLE `_members`;
