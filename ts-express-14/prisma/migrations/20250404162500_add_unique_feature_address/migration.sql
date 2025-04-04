/*
  Warnings:

  - A unique constraint covering the columns `[firstLine,city,postcode]` on the table `Address` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Address_firstLine_city_postcode_key" ON "Address"("firstLine", "city", "postcode");
