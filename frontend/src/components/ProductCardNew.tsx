import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Sheet,
  IconButton,
  AspectRatio,
  Chip,
  Stack,
} from "@mui/joy";

import { ProductDTO, ProductStatus } from "../dto/product.dto";
import { calculateDiscountedPrice } from "../utils/price.util";
import noProductImage from "../assets/images/no-product-image.png";

// Icons
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import VerifiedIcon from "@mui/icons-material/Verified";
import { StarRating } from "./StarRating";

export const ProductCard = ({
  product,
  onClickEye,
}: {
  product: ProductDTO;
  onClickEye?: () => void;
}) => {
  // Calculate the discounted price correctly
  const hasDiscount =
    product.discount &&
    product.discount.isActive &&
    product.discount.discountValue > 0;

  const discountedPrice = hasDiscount
    ? product.retailPrice * (1 - product.discount!.discountValue / 100)
    : product.retailPrice;

  const originalPrice = product.retailPrice;

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

  // Check if product is new (for example, added in the last 7 days)
  const isNewProduct = product.id && product.id > 100; // Mock condition - replace with actual logic

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        position: "relative",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: {
            xs: "none", // No transform on mobile (better touch experience)
            sm: "translateY(-4px)",
          },
          boxShadow: "md",
        },
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      {/* Label for discount */}
      {hasDiscount && (
        <Sheet
          color="danger"
          variant="solid"
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            px: 1,
            py: 0.5,
            borderRadius: "sm",
            zIndex: 1,
          }}
        >
          <Typography level="body-xs" textColor="white">
            {product.discount!.discountValue}% OFF
          </Typography>
        </Sheet>
      )}

      {/* New label */}
      {isNewProduct && (
        <Sheet
          color="success"
          variant="solid"
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            px: 1,
            py: 0.5,
            borderRadius: "sm",
            zIndex: 1,
          }}
        >
          <Typography level="body-xs" textColor="white">
            BARU
          </Typography>
        </Sheet>
      )}

      {/* Stock indicator - only show if it's low stock */}
      {product.quantityInStock > 0 && product.quantityInStock < 5 && (
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            py: 0.5,
            bgcolor: "rgba(255, 193, 7, 0.8)",
            textAlign: "center",
            zIndex: 1,
          }}
        >
          <Typography level="body-xs" fontWeight="md">
            Sisa {product.quantityInStock} item
          </Typography>
        </Box>
      )}

      {/* Out of stock overlay */}
      {product.quantityInStock <= 0 && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
          }}
        >
          <Sheet
            color="danger"
            variant="solid"
            sx={{
              px: 2,
              py: 1,
              borderRadius: "md",
              transform: "rotate(-15deg)",
            }}
          >
            <Typography level="title-md" textColor="white">
              Stok Habis
            </Typography>
          </Sheet>
        </Box>
      )}

      {/* Product image */}
      <AspectRatio ratio="1" objectFit="cover" onClick={onClickEye}>
        {!product.imageUrls || product.imageUrls.length === 0 ? (
          <img src={noProductImage} alt="default" loading="lazy" />
        ) : (
          <img src={product.imageUrls[0]} alt={product.name} loading="lazy" />
        )}
      </AspectRatio>

      {/* Quick action buttons that appear on hover */}
      <Box
        sx={{
          position: "absolute",
          right: 8,
          top: "30%",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          opacity: { xs: 1, sm: 0 },
          transform: { xs: "none", sm: "translateX(10px)" },
          transition: "opacity 0.2s, transform 0.2s",
          ".MuiCard-root:hover &": {
            opacity: 1,
            transform: "none",
          },
        }}
      >
        <IconButton
          variant="soft"
          size="sm"
          color="primary"
          aria-label="View product details"
          onClick={onClickEye}
        >
          <VisibilityIcon fontSize="small" />
        </IconButton>
        <IconButton
          variant="soft"
          size="sm"
          color="neutral"
          aria-label="Add to wishlist"
        >
          <FavoriteBorderIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Product info */}
      <CardContent>
        <Stack spacing={1}>
          {/* Product status and category */}
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {product.productStatus && (
              <Chip color={statusColor} size="sm">
                {product.productStatus}
              </Chip>
            )}
            {product.brand?.name && (
              <Chip size="sm" variant="soft" color="primary">
                {product.brand.name}
              </Chip>
            )}
          </Box>

          {/* Category display */}
          {product.categories && product.categories.length > 0 && (
            <Typography level="body-xs" sx={{ color: "text.tertiary" }}>
              {product.categories[0]}
              {product.categories.length > 1 &&
                ` +${product.categories.length - 1}`}
            </Typography>
          )}

          {/* Product name - truncate if too long */}
          <Typography
            level="title-md"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              minHeight: "2.5rem",
            }}
          >
            {product.name}
          </Typography>

          {/* Product rating */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <StarRating rating={4.5} />
            <Typography level="body-sm" color="neutral">
              (12)
            </Typography>
          </Box>

          {/* Features highlight with small icons */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              color: "text.secondary",
              fontSize: "0.75rem",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <LocalShippingIcon fontSize="inherit" />
              <Typography level="body-xs">Gratis</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <VerifiedIcon fontSize="inherit" />
              <Typography level="body-xs">Asli</Typography>
            </Box>
          </Box>

          {/* Product price */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              mt: 0.5,
            }}
          >
            {/* Discounted price shown as main price */}
            <Typography
              level="body-lg"
              fontWeight="bold"
              color={hasDiscount ? "danger" : "primary"}
            >
              Rp {discountedPrice.toLocaleString("id-ID")}
            </Typography>

            {/* Original price shown with strikethrough when discounted */}
            {hasDiscount && (
              <Typography
                level="body-xs"
                sx={{ textDecoration: "line-through", color: "text.tertiary" }}
              >
                Rp {originalPrice.toLocaleString("id-ID")}
              </Typography>
            )}
          </Box>

          {/* Wholesale price indication */}
          {/* {product.wholesalePrice && product.minWholesaleQty && (
            <Typography level="body-xs" sx={{ color: "success.600" }}>
              Grosir: Rp {product.wholesalePrice.toLocaleString("id-ID")} (min.{" "}
              {product.minWholesaleQty})
            </Typography>
          )} */}

          {/* Action buttons */}
          <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
            <Button
              variant="soft"
              color="primary"
              sx={{ flex: 1 }}
              startDecorator={<AddShoppingCartIcon />}
              disabled={product.quantityInStock <= 0}
            >
              {product.quantityInStock <= 0 ? "Habis" : "Tambah"}
            </Button>
            <IconButton
              variant="soft"
              color="neutral"
              aria-label="Add to wishlist"
            >
              <FavoriteBorderIcon />
            </IconButton>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};
