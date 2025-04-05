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
import { ProductDTO, ProductStatus } from "../dto/product.dto";
import noProductImage from "../assets/images/no-product-image.png";
import StarIcon from "@mui/icons-material/Star";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { calculateDiscountedPrice, formatRupiah } from "../utils";
import { useNavigate } from "react-router-dom";

export const ProductCard = ({ product }: { product: ProductDTO }) => {
  const navigate = useNavigate();

  // navigate to product detail page when click the card
  const handleClick = () => {
    navigate(`/products/${product.id}`);
  };

  const discountedPrice = product.discount
    ? calculateDiscountedPrice(product.retailPrice, {
        type: product.discount.discountType,
        value: product.discount.discountValue,
      })
    : 0;

  // Since we don't have reviews in ProductDTO, we can set a default or remove this feature
  // For now, I'll keep it with a default of 0
  const avgRating = 0;
  // Perbaikan logic penentuan warna status
  const getStatusColor = (status?: ProductStatus | null) => {
    if (!status) return "neutral";

    switch (status) {
      case ProductStatus.AVAILABLE:
        return "success";
      case ProductStatus.COMMING_SOON:
        return "primary";
      case ProductStatus.SUSPENDED:
        return "warning";
      case ProductStatus.DELETED:
      case ProductStatus.ARCHIVED:
        return "danger";
      default:
        return "neutral";
    }
  };

  const statusColor = getStatusColor(product.productStatus);

  // ...
  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardOverflow onClick={handleClick} sx={{ cursor: "pointer" }}>
        <CardOverflow>
          <AspectRatio ratio="1">
            {!product.imageUrls || product.imageUrls.length === 0 ? (
              <img src={noProductImage} alt="default" />
            ) : (
              <img
                src={product.imageUrls[0]}
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
          {product.productStatus && (
            <Chip color={statusColor}>{product.productStatus}</Chip>
          )}
          <Typography level="body-xs" sx={{ mb: 0.5 }}>
            {product.categories?.length ? product.categories[0] : ""}
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
              (0)
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
      </CardOverflow>

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
