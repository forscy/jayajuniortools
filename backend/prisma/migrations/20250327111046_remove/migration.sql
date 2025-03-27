/*
  Warnings:

  - You are about to drop the `inventory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `inventory` DROP FOREIGN KEY `Inventory_productId_fkey`;

-- DropForeignKey
ALTER TABLE `inventorysupplier` DROP FOREIGN KEY `InventorySupplier_inventoryId_fkey`;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `locationName` VARCHAR(191) NOT NULL DEFAULT 'Main Warehouse',
    ADD COLUMN `minimumStock` INTEGER NOT NULL DEFAULT 5,
    ADD COLUMN `quantityInStock` INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE `inventory`;
