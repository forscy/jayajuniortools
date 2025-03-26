/*
  Warnings:

  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `wishlist` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `wishlist` table. All the data in the column will be lost.
  - You are about to drop the `discount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notificationrecipient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `operationalhour` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `orderitem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pricehistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `productunit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `returnpolicy` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `review` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stockhistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `store` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transaction` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `email` to the `Wishlist` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `discount` DROP FOREIGN KEY `Discount_productId_fkey`;

-- DropForeignKey
ALTER TABLE `notificationrecipient` DROP FOREIGN KEY `NotificationRecipient_notificationId_fkey`;

-- DropForeignKey
ALTER TABLE `notificationrecipient` DROP FOREIGN KEY `NotificationRecipient_userId_fkey`;

-- DropForeignKey
ALTER TABLE `operationalhour` DROP FOREIGN KEY `OperationalHour_storeId_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_userId_fkey`;

-- DropForeignKey
ALTER TABLE `orderitem` DROP FOREIGN KEY `OrderItem_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `orderitem` DROP FOREIGN KEY `OrderItem_productId_fkey`;

-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `Payment_transactionId_fkey`;

-- DropForeignKey
ALTER TABLE `pricehistory` DROP FOREIGN KEY `PriceHistory_productId_fkey`;

-- DropForeignKey
ALTER TABLE `productunit` DROP FOREIGN KEY `ProductUnit_productId_fkey`;

-- DropForeignKey
ALTER TABLE `returnpolicy` DROP FOREIGN KEY `ReturnPolicy_storeId_fkey`;

-- DropForeignKey
ALTER TABLE `review` DROP FOREIGN KEY `Review_productId_fkey`;

-- DropForeignKey
ALTER TABLE `review` DROP FOREIGN KEY `Review_userId_fkey`;

-- DropForeignKey
ALTER TABLE `stockhistory` DROP FOREIGN KEY `StockHistory_productId_fkey`;

-- DropForeignKey
ALTER TABLE `transaction` DROP FOREIGN KEY `Transaction_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `wishlist` DROP FOREIGN KEY `Wishlist_productId_fkey`;

-- DropForeignKey
ALTER TABLE `wishlist` DROP FOREIGN KEY `Wishlist_userId_fkey`;

-- DropIndex
DROP INDEX `Wishlist_productId_fkey` ON `wishlist`;

-- DropIndex
DROP INDEX `Wishlist_userId_fkey` ON `wishlist`;

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`email`);

-- AlterTable
ALTER TABLE `wishlist` DROP COLUMN `productId`,
    DROP COLUMN `userId`,
    ADD COLUMN `email` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `discount`;

-- DropTable
DROP TABLE `notification`;

-- DropTable
DROP TABLE `notificationrecipient`;

-- DropTable
DROP TABLE `operationalhour`;

-- DropTable
DROP TABLE `order`;

-- DropTable
DROP TABLE `orderitem`;

-- DropTable
DROP TABLE `payment`;

-- DropTable
DROP TABLE `pricehistory`;

-- DropTable
DROP TABLE `productunit`;

-- DropTable
DROP TABLE `returnpolicy`;

-- DropTable
DROP TABLE `review`;

-- DropTable
DROP TABLE `stockhistory`;

-- DropTable
DROP TABLE `store`;

-- DropTable
DROP TABLE `transaction`;

-- CreateTable
CREATE TABLE `Inventory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NOT NULL,
    `locationName` VARCHAR(191) NOT NULL DEFAULT 'Main Warehouse',
    `quantityInStock` INTEGER NOT NULL DEFAULT 0,
    `minimumStock` INTEGER NOT NULL DEFAULT 5,
    `lastUpdated` DATETIME(3) NOT NULL,
    `supplierName` VARCHAR(191) NULL,
    `supplierContact` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,

    UNIQUE INDEX `Inventory_productId_locationName_key`(`productId`, `locationName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Inventory` ADD CONSTRAINT `Inventory_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wishlist` ADD CONSTRAINT `Wishlist_email_fkey` FOREIGN KEY (`email`) REFERENCES `User`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;
