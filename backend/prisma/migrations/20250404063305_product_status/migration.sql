/*
  Warnings:

  - You are about to drop the column `status` on the `product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `product` DROP COLUMN `status`,
    ADD COLUMN `productStatus` ENUM('AVAILABLE', 'COMMING_SOON', 'DELETED', 'ARCHIVED', 'SUSPENDED') NULL DEFAULT 'AVAILABLE';
