-- AlterTable
ALTER TABLE `User` ADD COLUMN `isVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `tempId` VARCHAR(191) NULL;
