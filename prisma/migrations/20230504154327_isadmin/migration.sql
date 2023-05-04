-- AlterTable
ALTER TABLE `ConversationsUsers` ADD COLUMN `isAdmin` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `username` VARCHAR(191) NULL;
