/*
  Warnings:

  - The primary key for the `productcategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `categoryId` on the `productcategory` table. All the data in the column will be lost.
  - Added the required column `categoryName` to the `ProductCategory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `productcategory` DROP FOREIGN KEY `ProductCategory_categoryId_fkey`;

-- DropIndex
DROP INDEX `ProductCategory_categoryId_fkey` ON `productcategory`;

-- AlterTable
ALTER TABLE `productcategory` DROP PRIMARY KEY,
    DROP COLUMN `categoryId`,
    ADD COLUMN `categoryName` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`productId`, `categoryName`);

-- AddForeignKey
ALTER TABLE `ProductCategory` ADD CONSTRAINT `ProductCategory_categoryName_fkey` FOREIGN KEY (`categoryName`) REFERENCES `Category`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;
