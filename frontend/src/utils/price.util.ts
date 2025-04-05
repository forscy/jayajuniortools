import { DiscountDTO, DiscountType } from "../dto/product.dto";

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
  discount?: DiscountDTO | null
): number => {
  // If no discount is provided, return the original price
  if (!discount || discount.discountValue <= 0) return price;

  switch (discount.discountType) {
    case DiscountType.PERCENTAGE:
      return price - (price * discount.discountValue) / 100;
    case DiscountType.FIXED:
      return price - discount.discountValue;
    default:
      return price; // fallback in case of an unexpected discount type
  }
};

export const getAverageRating = (reviews: { rating: number }[]): number => {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / reviews.length;
};