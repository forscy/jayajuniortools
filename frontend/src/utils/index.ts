import { DiscountType } from "../types";

// Fungsi bantuan
export const formatRupiah = (price: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};


export const calculateDiscountedPrice = (
  price: number,
  discount?: { type: DiscountType; value: number }
): number => {
  if (!discount) return price;

  if (discount.type === DiscountType.PERCENTAGE) {
    return price - (price * discount.value) / 100;
  }
  return price - discount.value;
};

export const getAverageRating = (reviews: { rating: number }[]): number => {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / reviews.length;
};