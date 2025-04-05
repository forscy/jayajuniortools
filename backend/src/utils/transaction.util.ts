export const calculateUnitPrice = (
  retailPrice: number,
  discount?: { discountType: string; discountValue: number }
): number => {
  // Jika tidak ada diskon, harga unit adalah harga retail
  if (!discount) {
    return retailPrice;
  }

  // Kalkulasi berdasarkan jenis diskon
  switch (discount.discountType) {
    case "PERCENTAGE":
      // Jika diskon berupa persentase (misalnya 10% off)
      return retailPrice * (1 - discount.discountValue / 100);

    case "FIXED":
      // Jika diskon berupa nominal tetap (misalnya diskon 10.000)
      return retailPrice - discount.discountValue;

    case "BUY_X_GET_Y":
      // Implementasi diskon beli X gratis Y
      // Misalnya, beli 2 dapat 1 gratis, harga unit akan dihitung sesuai dengan diskon ini
      // Diskon ini membutuhkan logika lebih lanjut, misalnya melihat jumlah pembelian
      return retailPrice; // Placeholder, karena diskon ini memerlukan kondisi lebih lanjut.

    default:
      return retailPrice; // Jika tidak ada tipe diskon yang valid
  }
};

export const amountChange = (
  amountPaid: number,
  totalAmount: number
): number => {
  return amountPaid - totalAmount;
};
