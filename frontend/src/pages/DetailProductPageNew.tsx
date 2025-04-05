import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  AspectRatio,
  Sheet,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Breadcrumbs,
  Link,
  IconButton,
  Alert,
  Stack,
  Input,
  Skeleton,
} from "@mui/joy";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { DiscountType, ProductDTO, ProductStatus } from "../dto/product.dto";

// Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import StorefrontIcon from "@mui/icons-material/Storefront";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import VerifiedIcon from "@mui/icons-material/Verified";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import HomeIcon from "@mui/icons-material/Home";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductById } from "../redux/slices/productSlice";
import { ProductCard } from "../components/ProductCardNew";
import { calculateDiscountedPrice } from "../utils/price.util";

const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <Box sx={{ display: "flex", alignItems: "center", color: "warning.500" }}>
      {Array(5)
        .fill(0)
        .map((_, index) => {
          if (index < fullStars) {
            return <StarIcon key={index} fontSize="small" />;
          } else if (index === fullStars && hasHalfStar) {
            return <StarHalfIcon key={index} fontSize="small" />;
          } else {
            return <StarOutlineIcon key={index} fontSize="small" />;
          }
        })}
    </Box>
  );
};

const ProductImageGallery = ({ images }: { images: string[] }) => {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <Box sx={{ mb: { xs: 2, md: 0 } }}>
      <AspectRatio
        ratio="1"
        sx={{
          borderRadius: "md",
          overflow: "hidden",
          mb: 2,
          boxShadow: "sm",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <img src={mainImage} alt={"product"} />
      </AspectRatio>

      <Grid container spacing={1}>
        {images.map((image, index) => (
          <Grid key={index} xs={3}>
            <Box
              onClick={() => setMainImage(image)}
              sx={{
                cursor: "pointer",
                borderRadius: "sm",
                overflow: "hidden",
                border: "2px solid",
                borderColor: mainImage === image ? "primary.500" : "divider",
                transition: "0.2s",
                "&:hover": {
                  borderColor: "primary.300",
                },
              }}
            >
              <AspectRatio ratio="1">
                <img src={image} alt={`Product view ${index + 1}`} />
              </AspectRatio>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const ProductInfo = ({ product }: { product: ProductDTO }) => {
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState(false);

  const discountedPrice = calculateDiscountedPrice(
    product.retailPrice,
    product.discount
  );
  // product.discount !== null
  //   ? product.retailPrice * (1 - product.discount.discountValue / 100)
  //   : product.retailPrice;

  const isWholesale = quantity >= (product.minWholesaleQty || 5);
  const finalPrice = isWholesale
    ? product.wholesalePrice || discountedPrice
    : discountedPrice;

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  const toggleWishlist = () => setWishlist((prev) => !prev);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const stockStatus = () => {
    if (product.quantityInStock > 20) {
      return { color: "success", text: "Stok Tersedia" };
    } else if (product.quantityInStock > 10) {
      return { color: "success", text: "Stok Tersedia" };
    } else if (product.quantityInStock > 0) {
      return { color: "warning", text: "Stok Terbatas" };
    } else {
      return { color: "danger", text: "Stok Habis" };
    }
  };

  return (
    <Stack spacing={2}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {product.brand && (
          <Chip variant="soft" color="primary" size="sm">
            {product.brand.name}
          </Chip>
        )}
        {product.discount && product.discount.isActive && (
          <Chip variant="soft" color="danger" size="sm">
            {product.discount.discountValue}% OFF
          </Chip>
        )}
        <Chip
          variant="soft"
          color={stockStatus().color as any}
          size="sm"
          startDecorator={
            product.quantityInStock > 0 ? (
              <CheckIcon fontSize="small" />
            ) : undefined
          }
        >
          {stockStatus().text}
        </Chip>
      </Box>

      <Typography
        level="h2"
        sx={{
          fontSize: { xs: "1.5rem", sm: "1.875rem", md: "2.25rem" },
          lineHeight: 1.2,
        }}
      >
        {product.name}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <StarRating rating={4.8} />
        <Typography level="body-sm" sx={{ color: "text.tertiary" }}>
          (120 Reviews)
        </Typography>
        <Divider orientation="vertical" />
        <Typography level="body-sm" sx={{ color: "text.tertiary" }}>
          Terjual 350+
        </Typography>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography
          level="h3"
          sx={{
            color: "primary.600",
            fontSize: { xs: "1.5rem", sm: "1.75rem" },
          }}
        >
          Rp {finalPrice.toLocaleString("id-ID")}
        </Typography>

        {product.discount && product.discount.isActive && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
            <Typography
              level="body-sm"
              sx={{ textDecoration: "line-through", color: "text.tertiary" }}
            >
              Rp {product.retailPrice.toLocaleString("id-ID")}
            </Typography>
            <Chip size="sm" color="danger" variant="soft">
              Hemat Rp{" "}
              {(product.retailPrice - discountedPrice).toLocaleString("id-ID")}
            </Chip>
          </Box>
        )}

        {product.wholesalePrice && product.minWholesaleQty && (
          <Alert
            size="sm"
            color="success"
            variant="soft"
            sx={{ mt: 1 }}
            startDecorator={<InfoOutlinedIcon />}
          >
            Harga grosir Rp {product.wholesalePrice.toLocaleString("id-ID")}{" "}
            untuk pembelian min. {product.minWholesaleQty} item
          </Alert>
        )}
      </Box>

      {product.discount && product.discount.isActive && (
        <Box
          sx={{
            border: "1px dashed",
            borderColor: "danger.300",
            p: 1.5,
            borderRadius: "md",
            bgcolor: "danger.50",
          }}
        >
          <Typography
            level="body-sm"
            fontWeight="bold"
            color="danger"
            sx={{ mb: 0.5 }}
          >
            {product.discount.name}
          </Typography>
          <Typography level="body-sm">
            {product.discount.description}
          </Typography>
          <Typography level="body-sm" sx={{ mt: 0.5 }}>
            Berlaku hingga: {formatDate(product.discount.endDate)}
          </Typography>
        </Box>
      )}

      <Divider />

      <Box>
        <Typography level="title-md" sx={{ mb: 1.5 }}>
          Pilih Jumlah
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "md",
              overflow: "hidden",
            }}
          >
            <IconButton
              size="sm"
              variant="plain"
              disabled={quantity <= 1}
              onClick={decrementQuantity}
            >
              <RemoveIcon />
            </IconButton>
            <Input
              value={quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value) && value > 0) {
                  setQuantity(value);
                }
              }}
              slotProps={{
                input: {
                  min: 1,
                  max: product.quantityInStock,
                  type: "number",
                  sx: {
                    textAlign: "center",
                    width: "60px",
                    border: "none",
                    "&:focus": {
                      outline: "none",
                    },
                  },
                },
              }}
              variant="plain"
              sx={{ width: "60px" }}
            />
            <IconButton
              size="sm"
              variant="plain"
              disabled={quantity >= product.quantityInStock}
              onClick={incrementQuantity}
            >
              <AddIcon />
            </IconButton>
          </Box>

          <Typography level="body-sm" sx={{ color: "text.secondary" }}>
            Tersedia {product.quantityInStock} item
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          mt: 1,
          flexWrap: { xs: "wrap", sm: "nowrap" },
        }}
      >
        <Button
          startDecorator={<AddShoppingCartIcon />}
          variant="outlined"
          color="primary"
          sx={{
            flex: { xs: "1 0 100%", sm: 1 },
            order: { xs: 2, sm: 1 },
            mt: { xs: 1, sm: 0 },
          }}
        >
          Tambah ke Keranjang
        </Button>

        <Button
          startDecorator={<ShoppingBagIcon />}
          variant="solid"
          color="primary"
          sx={{
            flex: { xs: "1 0 100%", sm: 2 },
            order: { xs: 1, sm: 2 },
          }}
        >
          Beli Sekarang
        </Button>

        <IconButton
          variant="soft"
          color={wishlist ? "danger" : "neutral"}
          onClick={toggleWishlist}
          sx={{ order: 3 }}
        >
          {wishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>

        <IconButton variant="soft" color="neutral" sx={{ order: 4 }}>
          <ShareIcon />
        </IconButton>
      </Box>

      <Divider />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Sheet
            variant="soft"
            color="neutral"
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LocalShippingIcon />
          </Sheet>
          <Box>
            <Typography level="body-sm" fontWeight="bold">
              Pengiriman Cepat
            </Typography>
            <Typography level="body-xs" sx={{ color: "text.tertiary" }}>
              Estimasi tiba 1-3 hari kerja
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Sheet
            variant="soft"
            color="neutral"
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <StorefrontIcon />
          </Sheet>
          <Box>
            <Typography level="body-sm" fontWeight="bold">
              Garansi Produk
            </Typography>
            <Typography level="body-xs" sx={{ color: "text.tertiary" }}>
              Garansi resmi 1 tahun dari {product.brand?.name}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Sheet
            variant="soft"
            color="neutral"
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <HeadsetMicIcon />
          </Sheet>
          <Box>
            <Typography level="body-sm" fontWeight="bold">
              Layanan Pelanggan
            </Typography>
            <Typography level="body-xs" sx={{ color: "text.tertiary" }}>
              Bantuan 7 hari seminggu
            </Typography>
          </Box>
        </Box>
      </Box>
    </Stack>
  );
};

const ProductDescription = ({ product }: { product: ProductDTO }) => {
  return (
    <Box>
      <Typography level="body-md" sx={{ whiteSpace: "pre-line" }}>
        {product.description}
      </Typography>

      <Box sx={{ mt: 3 }}>
        <Typography level="title-md" sx={{ mb: 1.5 }}>
          Spesifikasi Produk
        </Typography>

        <Grid container spacing={2}>
          <Grid xs={12} sm={6}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Typography
                  level="body-sm"
                  component="dl"
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr 1fr", sm: "2fr 3fr" },
                    columnGap: 2,
                    rowGap: 1.5,
                  }}
                >
                  <Typography level="body-sm" component="dt" fontWeight="bold">
                    SKU
                  </Typography>
                  <Typography level="body-sm" component="dd">
                    {product.sku}
                  </Typography>

                  <Typography level="body-sm" component="dt" fontWeight="bold">
                    Brand
                  </Typography>
                  <Typography level="body-sm" component="dd">
                    {product.brand?.name}
                  </Typography>

                  <Typography level="body-sm" component="dt" fontWeight="bold">
                    Kategori
                  </Typography>
                  <Typography level="body-sm" component="dd">
                    {product.categories?.join(", ")}
                  </Typography>

                  <Typography level="body-sm" component="dt" fontWeight="bold">
                    Status
                  </Typography>
                  <Typography level="body-sm" component="dd">
                    <Chip
                      size="sm"
                      color={
                        product.productStatus === ProductStatus.AVAILABLE
                          ? "success"
                          : "warning"
                      }
                    >
                      {product.productStatus}
                    </Chip>
                  </Typography>
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid xs={12} sm={6}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Typography
                  level="body-sm"
                  component="dl"
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr 1fr", sm: "2fr 3fr" },
                    columnGap: 2,
                    rowGap: 1.5,
                  }}
                >
                  <Typography level="body-sm" component="dt" fontWeight="bold">
                    Stok Tersedia
                  </Typography>
                  <Typography level="body-sm" component="dd">
                    {product.quantityInStock} item
                  </Typography>

                  <Typography level="body-sm" component="dt" fontWeight="bold">
                    Harga Retail
                  </Typography>
                  <Typography level="body-sm" component="dd">
                    Rp {product.retailPrice.toLocaleString("id-ID")}
                  </Typography>

                  <Typography level="body-sm" component="dt" fontWeight="bold">
                    Harga Grosir
                  </Typography>
                  <Typography level="body-sm" component="dd">
                    Rp {product.wholesalePrice?.toLocaleString("id-ID")}
                    <Typography level="body-xs" sx={{ color: "text.tertiary" }}>
                      (min. {product.minWholesaleQty} item)
                    </Typography>
                  </Typography>

                  <Typography level="body-sm" component="dt" fontWeight="bold">
                    Diskon
                  </Typography>
                  <Typography level="body-sm" component="dd">
                    {product.discount && product.discount.isActive
                      ? `${product.discount.discountValue}% (${formatPrice(
                          (product.discount.discountValue / 100) *
                            product.retailPrice
                        )})`
                      : "Tidak ada diskon"}
                  </Typography>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

const formatPrice = (price: number) => {
  return `Rp ${price.toLocaleString("id-ID")}`;
};

const ReviewItem = ({ review }: { review: any }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: "flex", gap: 1.5, mb: 1.5 }}>
        <Box
          component="img"
          src={review.user.avatar}
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />

        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography level="title-sm">{review.user.name}</Typography>
            <Typography level="body-xs" sx={{ color: "text.tertiary" }}>
              {new Date(review.date).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
            <StarRating rating={review.rating} />
          </Box>
        </Box>
      </Box>

      <Typography level="body-md" sx={{ ml: 6.5 }}>
        {review.comment}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", mt: 1, ml: 6.5 }}>
        <Button
          variant="plain"
          color="neutral"
          size="sm"
          startDecorator={<ThumbUpIcon fontSize="small" />}
        >
          Helpful ({review.helpful})
        </Button>
      </Box>
    </Box>
  );
};

const ProductReviews = ({ reviews }: { reviews: any[] }) => {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography level="h4" sx={{ mb: 0.5 }}>
            Ulasan Pembeli
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <StarRating rating={4.8} />
            <Typography level="body-sm" fontWeight="bold">
              4.8 dari 5
            </Typography>
            <Typography level="body-sm" sx={{ color: "text.tertiary" }}>
              (120 ulasan)
            </Typography>
          </Box>
        </Box>

        <Button variant="outlined">Tulis Ulasan</Button>
      </Box>

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography level="title-sm" sx={{ mb: 2 }}>
            Filter Ulasan
          </Typography>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Chip
              variant="soft"
              color="primary"
              // checked
            >
              Semua
            </Chip>
            <Chip variant="soft">5 Bintang (92)</Chip>
            <Chip variant="soft">4 Bintang (20)</Chip>
            <Chip variant="soft">3 Bintang (5)</Chip>
            <Chip variant="soft">2 Bintang (2)</Chip>
            <Chip variant="soft">1 Bintang (1)</Chip>
          </Box>
        </CardContent>
      </Card>

      <Divider />

      <Box sx={{ mt: 3 }}>
        {reviews.map((review) => (
          <React.Fragment key={review.id}>
            <ReviewItem review={review} />
            <Divider sx={{ my: 3 }} />
          </React.Fragment>
        ))}

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button variant="outlined">Lihat Semua Ulasan</Button>
        </Box>
      </Box>
    </Box>
  );
};

const RelatedProducts = ({ products }: { products: ProductDTO[] }) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography level="h4" sx={{ mb: 2 }}>
        Produk Terkait
      </Typography>

      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid key={product.id} xs={6} sm={6} md={3}>
            <ProductCard product={product}/>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const DetailProductPageNew = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState(0);
  const dispatch = useAppDispatch();
  const { product, loading, error } = useAppSelector((state) => state.product);

  useEffect(() => {
    if (id) {
      console.info(id);
      dispatch(fetchProductById(parseInt(id)));
    }
  }, [dispatch, id]);
  const handleGoBack = () => {
    navigate(-1);
  };
  if (loading) {
    return (
      <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
        <Skeleton variant="rectangular" width="100%" height={400} />
        <Skeleton variant="text" sx={{ mt: 2 }} />
        <Skeleton variant="text" />
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid xs={12} md={6}>
            <Skeleton variant="rectangular" height={300} />
          </Grid>
          <Grid xs={12} md={6}>
            <Skeleton variant="rectangular" height={300} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
        <Typography level="h4" color="danger">
          {error || "Product not found"}
        </Typography>
        <Button
          onClick={handleGoBack}
          startDecorator={<ArrowBackIcon />}
          sx={{ mt: 2 }}
        >
          Back
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Header />

      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 2, sm: 3, md: 4 },
          px: { xs: 1.5, sm: 2, md: 3 },
        }}
      >
        <Breadcrumbs size="sm" sx={{ mb: { xs: 2, sm: 3 } }} separator="›">
          <Link
            underline="hover"
            color="neutral"
            href="/"
            startDecorator={<HomeIcon />}
            fontSize="inherit"
          >
            Home
          </Link>
          <Link
            underline="hover"
            color="neutral"
            href="/category/sepatu"
            fontSize="inherit"
          >
            Sepatu
          </Link>
          <Link
            underline="hover"
            color="neutral"
            href="/category/sepatu/olahraga"
            fontSize="inherit"
          >
            Olahraga
          </Link>
          <Typography color="primary" fontWeight="bold" fontSize="inherit">
            {product?.name.substring(0, 20)}...
          </Typography>
        </Breadcrumbs>

        <Grid container spacing={{ xs: 2, md: 4 }} sx={{ mb: 4 }}>
          <Grid xs={12} md={5} lg={5}>
            <ProductImageGallery images={product?.imageUrls || []} />
          </Grid>

          <Grid xs={12} md={7} lg={7}>
            {product && <ProductInfo product={product} />}
          </Grid>
        </Grid>

        <Card variant="outlined" sx={{ mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={(_, value) => setActiveTab(value as number)}
            sx={{ borderRadius: 0 }}
          >
            <TabList
              variant="plain"
              sx={{
                p: 1.5,
                gap: 2,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Tab sx={{ fontWeight: 600 }}>Deskripsi</Tab>
              <Tab sx={{ fontWeight: 600 }}>Ulasan (120)</Tab>
              <Tab sx={{ fontWeight: 600 }}>Pengiriman</Tab>
            </TabList>
            <TabPanel value={0} sx={{ p: 3 }}>
              <ProductDescription product={product!} />
            </TabPanel>
            <TabPanel value={1} sx={{ p: 3 }}>
              {/* <ProductReviews reviews={reviews} /> */}
            </TabPanel>
            <TabPanel value={2} sx={{ p: 3 }}>
              <Typography level="h4" sx={{ mb: 2 }}>
                Informasi Pengiriman
              </Typography>
              <Typography level="body-md">
                Produk ini dikirim dari Jakarta Selatan dan akan sampai ke
                alamat Anda dalam 1-3 hari kerja.
              </Typography>

              <Box sx={{ mt: 3 }}>
                <Typography level="title-md" sx={{ mb: 1.5 }}>
                  Metode Pengiriman
                </Typography>

                <Card variant="outlined">
                  <CardContent>
                    <Stack spacing={2}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Box
                            component="img"
                            src="https://via.placeholder.com/40"
                            alt="JNE"
                            width={40}
                            height={40}
                          />
                          <Box>
                            <Typography level="title-sm">
                              JNE Regular
                            </Typography>
                            <Typography
                              level="body-xs"
                              sx={{ color: "text.tertiary" }}
                            >
                              Estimasi tiba 2-3 hari
                            </Typography>
                          </Box>
                        </Box>
                        <Typography level="body-md" fontWeight="bold">
                          Rp 12.000
                        </Typography>
                      </Box>

                      <Divider />

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Box
                            component="img"
                            src="https://via.placeholder.com/40"
                            alt="J&T"
                            width={40}
                            height={40}
                          />
                          <Box>
                            <Typography level="title-sm">
                              J&T Express
                            </Typography>
                            <Typography
                              level="body-xs"
                              sx={{ color: "text.tertiary" }}
                            >
                              Estimasi tiba 1-2 hari
                            </Typography>
                          </Box>
                        </Box>
                        <Typography level="body-md" fontWeight="bold">
                          Rp 15.000
                        </Typography>
                      </Box>

                      <Divider />

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Box
                            component="img"
                            src="https://via.placeholder.com/40"
                            alt="SiCepat"
                            width={40}
                            height={40}
                          />
                          <Box>
                            <Typography level="title-sm">
                              SiCepat REG
                            </Typography>
                            <Typography
                              level="body-xs"
                              sx={{ color: "text.tertiary" }}
                            >
                              Estimasi tiba 1-2 hari
                            </Typography>
                          </Box>
                        </Box>
                        <Typography level="body-md" fontWeight="bold">
                          Rp 13.000
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            </TabPanel>
          </Tabs>
        </Card>

        {/* <RelatedProducts products={relatedProducts} /> */}
      </Container>

      <Footer />
    </>
  );
};

export default DetailProductPageNew;
