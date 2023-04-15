-- AlterTable
ALTER TABLE `conversationsusers` ADD COLUMN `acceptedTime` DATETIME(3) NULL,
    ADD COLUMN `addedById` INTEGER NULL,
    ADD COLUMN `addedTime` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `isAccepted` BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE `ConversationsUsers` ADD CONSTRAINT `ConversationsUsers_addedById_fkey` FOREIGN KEY (`addedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
