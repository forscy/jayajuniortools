/*
  Warnings:

  - Added the required column `amountChange` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amountPaid` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `payment` ADD COLUMN `amountChange` DOUBLE NOT NULL,
    ADD COLUMN `amountPaid` DOUBLE NOT NULL,
    ADD COLUMN `paymentDate` DATETIME(3) NULL,
    ADD COLUMN `paymentMethod` ENUM('BANK', 'E_WALLET', 'CASH') NOT NULL;
