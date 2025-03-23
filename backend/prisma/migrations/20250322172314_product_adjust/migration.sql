/*
  Warnings:

  - You are about to drop the column `notes` on the `inventory` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `inventory` table. All the data in the column will be lost.
  - You are about to drop the column `supplierContact` on the `inventory` table. All the data in the column will be lost.
  - You are about to drop the column `supplierName` on the `inventory` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[inventoryId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email,productId]` on the table `Wishlist` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `inventoryId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `retailPrice` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `Wishlist` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `inventory` DROP FOREIGN KEY `Inventory_productId_fkey`;

-- DropIndex
DROP INDEX `Inventory_productId_locationName_key` ON `inventory`;

-- AlterTable
ALTER TABLE `inventory` DROP COLUMN `notes`,
    DROP COLUMN `productId`,
    DROP COLUMN `supplierContact`,
    DROP COLUMN `supplierName`;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `price`,
    DROP COLUMN `stock`,
    ADD COLUMN `inventoryId` INTEGER NOT NULL,
    ADD COLUMN `minWholesaleQty` INTEGER NULL,
    ADD COLUMN `retailPrice` DOUBLE NOT NULL,
    ADD COLUMN `wholesalePrice` DOUBLE NULL;

-- AlterTable
ALTER TABLE `wishlist` ADD COLUMN `productId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Review` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `rating` INTEGER NOT NULL,
    `comment` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Review_email_productId_key`(`email`, `productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductDiscount` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `discountType` ENUM('PERCENTAGE', 'FIXED', 'BUY_X_GET_Y') NOT NULL,
    `discountValue` DOUBLE NOT NULL,
    `minPurchase` INTEGER NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Supplier` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `contact` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InventorySupplier` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `inventoryId` INTEGER NOT NULL,
    `supplierId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `InventorySupplier_inventoryId_supplierId_key`(`inventoryId`, `supplierId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Product_inventoryId_key` ON `Product`(`inventoryId`);

-- CreateIndex
CREATE UNIQUE INDEX `Wishlist_email_productId_key` ON `Wishlist`(`email`, `productId`);

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_inventoryId_fkey` FOREIGN KEY (`inventoryId`) REFERENCES `Inventory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_email_fkey` FOREIGN KEY (`email`) REFERENCES `User`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductDiscount` ADD CONSTRAINT `ProductDiscount_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventorySupplier` ADD CONSTRAINT `InventorySupplier_inventoryId_fkey` FOREIGN KEY (`inventoryId`) REFERENCES `Inventory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventorySupplier` ADD CONSTRAINT `InventorySupplier_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `Supplier`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wishlist` ADD CONSTRAINT `Wishlist_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
