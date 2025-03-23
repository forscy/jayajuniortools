/*
  Warnings:

  - A unique constraint covering the columns `[productId]` on the table `ProductDiscount` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `ProductDiscount_productId_key` ON `ProductDiscount`(`productId`);
