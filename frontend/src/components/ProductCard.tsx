import {
  Card,
  CardOverflow,
  AspectRatio,
  Chip,
  CardContent,
  Typography,
  Box,
  Stack,
  Button,
} from "@mui/joy";
import { Product } from "../types";
import noProductImage from "../assets/images/no-product-image.png";
import StarIcon from "@mui/icons-material/Star";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import {
  calculateDiscountedPrice,
  formatRupiah,
  getAverageRating,
} from "../utils";

export const ProductCard = ({ product }: { product: Product }) => {
  const discountedPrice = product.discount
    ? calculateDiscountedPrice(product.retailPrice, {
        type: product.discount.discountType,
        value: product.discount.discountValue,
      })
    : 0;

  const avgRating = getAverageRating(product.reviews || []);

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardOverflow>
        <AspectRatio ratio="1">
          {!product.images || product.images.length === 0 ? (
            noProductImage
          ) : (
            <img
              src={product.images[0].url}
              alt={product.name}
              loading="lazy"
            />
          )}
        </AspectRatio>
        {product.discount && (
          <Chip
            size="sm"
            variant="solid"
            color="danger"
            startDecorator={<LocalOfferIcon fontSize="small" />}
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
            }}
          >
            {product.discount.discountType === "PERCENTAGE"
              ? `-${product.discount.discountValue}%`
              : "DISKON"}
          </Chip>
        )}
      </CardOverflow>
      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Typography level="body-xs" sx={{ mb: 0.5 }}>
          {product.categories?.length
            ? product.categories[0]?.category?.name
            : ""}
        </Typography>
        <Typography
          level="title-md"
          sx={{
            mb: 0.5,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {product.name}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            mb: 1,
          }}
        >
          <StarIcon sx={{ fontSize: "sm", color: "warning.500" }} />
          <Typography level="body-sm">{avgRating.toFixed(1)}</Typography>
          <Typography level="body-sm" sx={{ color: "neutral.500" }}>
            ({product.reviews?.length || 0})
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} sx={{ mt: "auto" }}>
          {product.discount && (
            <Box>
              <Typography
                level="body-sm"
                sx={{
                  textDecoration: "line-through",
                  color: "neutral.500",
                }}
              >
                {formatRupiah(product.retailPrice)}
              </Typography>
              <Typography
                level="title-md"
                sx={{ fontWeight: "bold", color: "primary.600" }}
              >
                {formatRupiah(discountedPrice)}
              </Typography>
            </Box>
          )}
          <Typography
            level="title-md"
            sx={{ fontWeight: "bold", color: "primary.600" }}
          >
            {formatRupiah(product.retailPrice)}
          </Typography>
        </Stack>
      </CardContent>
      <CardOverflow>
        <Button
          variant="solid"
          color="primary"
          size="sm"
          sx={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        >
          Tambah ke Keranjang
        </Button>
      </CardOverflow>
    </Card>
  );
};
