/*
  Warnings:

  - You are about to alter the column `day` on the `OperationalHour` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.
  - A unique constraint covering the columns `[name]` on the table `Store` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `OperationalHour` MODIFY `day` ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY') NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Store_name_key` ON `Store`(`name`);
