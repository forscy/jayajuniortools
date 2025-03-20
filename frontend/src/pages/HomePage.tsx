import {
  CssVarsProvider,
  CssBaseline,
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardOverflow,
  AspectRatio,
  Button,
  Sheet,
  Chip,
  Stack,
} from "@mui/joy";
import StarIcon from "@mui/icons-material/Star";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Tipe data berdasarkan skema Prisma
interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  categories: { categoryId: number; category: { name: string } }[];
  images: { url: string }[];
  reviews: { rating: number }[];
  discount?: { type: "PERCENTAGE" | "FIXED"; value: number };
}

interface Category {
  id: number;
  name: string;
}

// Data hardcode untuk simulasi
const featuredProducts: Product[] = [
  {
    id: 1,
    name: "Sepatu Sneakers Premium",
    description:
      "Sepatu sneakers dengan kualitas premium, nyaman dipakai sehari-hari",
    price: 899000,
    stock: 25,
    categories: [{ categoryId: 1, category: { name: "Sepatu" } }],
    images: [
      { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff" },
    ],
    reviews: Array(23).fill({ rating: 5 }),
    discount: { type: "PERCENTAGE", value: 15 },
  },
  {
    id: 2,
    name: "Tas Ransel Waterproof",
    description: "Tas ransel anti air dengan kompartemen laptop",
    price: 450000,
    stock: 42,
    categories: [{ categoryId: 2, category: { name: "Tas" } }],
    images: [
      { url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62" },
    ],
    reviews: Array(15).fill({ rating: 4 }),
  },
  {
    id: 3,
    name: "Kemeja Formal Pria",
    description: "Kemeja formal pria dengan bahan premium dan nyaman",
    price: 299000,
    stock: 30,
    categories: [{ categoryId: 3, category: { name: "Pakaian" } }],
    images: [
      { url: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10" },
    ],
    reviews: Array(8).fill({ rating: 4 }),
    discount: { type: "PERCENTAGE", value: 10 },
  },
  {
    id: 4,
    name: "Jam Tangan Digital",
    description: "Jam tangan digital tahan air dengan berbagai fitur",
    price: 550000,
    stock: 18,
    categories: [{ categoryId: 4, category: { name: "Aksesoris" } }],
    images: [
      { url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30" },
    ],
    reviews: Array(12).fill({ rating: 5 }),
  },
  {
    id: 5,
    name: "Headphone Bluetooth",
    description: "Headphone bluetooth dengan kualitas suara premium",
    price: 799000,
    stock: 15,
    categories: [{ categoryId: 5, category: { name: "Elektronik" } }],
    images: [
      { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e" },
    ],
    reviews: Array(35).fill({ rating: 5 }),
    discount: { type: "FIXED", value: 100000 },
  },
  {
    id: 6,
    name: "Dompet Kulit Asli",
    description: "Dompet pria berbahan kulit asli dengan kualitas premium",
    price: 350000,
    stock: 22,
    categories: [{ categoryId: 4, category: { name: "Aksesoris" } }],
    images: [
      { url: "https://images.unsplash.com/photo-1627123424574-724758594e93" },
    ],
    reviews: Array(17).fill({ rating: 4 }),
  },
];

const categories: Category[] = [
  { id: 1, name: "Sepatu" },
  { id: 2, name: "Tas" },
  { id: 3, name: "Pakaian" },
  { id: 4, name: "Aksesoris" },
  { id: 5, name: "Elektronik" },
  { id: 6, name: "Kecantikan" },
  { id: 7, name: "Rumah Tangga" },
  { id: 8, name: "Olahraga" },
];

// Fungsi bantuan
const formatRupiah = (price: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

const calculateDiscountedPrice = (
  price: number,
  discount?: { type: "PERCENTAGE" | "FIXED"; value: number }
): number => {
  if (!discount) return price;

  if (discount.type === "PERCENTAGE") {
    return price - (price * discount.value) / 100;
  }
  return price - discount.value;
};

const getAverageRating = (reviews: { rating: number }[]): number => {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / reviews.length;
};

export default function HomePage() {
  return (
    <CssVarsProvider>
      <CssBaseline />

      {/* Header Component */}
      <Header categories={categories} />

      {/* Hero Banner */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: "35vh", sm: "45vh", md: "55vh" },
          backgroundColor: "primary.softActive",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundImage:
              "url(https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.7,
          }}
        />
        <Box
          sx={{
            position: "relative",
            textAlign: "center",
            p: 4,
            maxWidth: "sm",
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            borderRadius: "lg",
          }}
        >
          <Typography
            level="h1"
            sx={{ mb: 2, textShadow: "1px 1px 3px rgba(0,0,0,0.8)" }}
          >
            Belanja Mudah di Jaya Junior Tools
          </Typography>
          <Typography
            level="body-lg"
            sx={{ mb: 3, textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}
          >
            Temukan produk berkualitas dengan harga terbaik
          </Typography>
          <Button size="lg" color="primary" variant="solid">
            Belanja Sekarang
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ my: 4 }}>
        {/* Featured Section */}
        <Box sx={{ mb: 6 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography level="h4" component="h2">
              Produk Unggulan
            </Typography>
            <Button
              variant="plain"
              color="primary"
              sx={{
                display: { xs: "none", sm: "flex" },
                "&:hover": {
                  backgroundColor: "transparent",
                  textDecoration: "underline",
                },
              }}
            >
              Lihat Semua
            </Button>
          </Box>

          <Grid container spacing={2}>
            {featuredProducts.map((product) => {
              const discountedPrice = calculateDiscountedPrice(
                product.price,
                product.discount
              );
              const avgRating = getAverageRating(product.reviews);

              return (
                <Grid key={product.id} xs={6} sm={4} md={3}>
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
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          loading="lazy"
                        />
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
                          {product.discount.type === "PERCENTAGE"
                            ? `-${product.discount.value}%`
                            : "DISKON"}
                        </Chip>
                      )}
                    </CardOverflow>
                    <CardContent
                      sx={{ flex: 1, display: "flex", flexDirection: "column" }}
                    >
                      <Typography level="body-xs" sx={{ mb: 0.5 }}>
                        {product.categories[0].category.name}
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
                        <StarIcon
                          sx={{ fontSize: "sm", color: "warning.500" }}
                        />
                        <Typography level="body-sm">
                          {avgRating.toFixed(1)}
                        </Typography>
                        <Typography
                          level="body-sm"
                          sx={{ color: "neutral.500" }}
                        >
                          ({product.reviews.length})
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={1} sx={{ mt: "auto" }}>
                        {product.discount && (
                          <Typography
                            level="body-sm"
                            sx={{
                              textDecoration: "line-through",
                              color: "neutral.500",
                            }}
                          >
                            {formatRupiah(product.price)}
                          </Typography>
                        )}
                        <Typography
                          level="title-md"
                          sx={{ fontWeight: "bold", color: "primary.600" }}
                        >
                          {formatRupiah(discountedPrice)}
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
                </Grid>
              );
            })}
          </Grid>

          {/* Mobile-only "View All" button */}
          <Box
            sx={{
              display: { xs: "flex", sm: "none" },
              justifyContent: "center",
              mt: 2,
            }}
          >
            <Button variant="outlined" color="primary">
              Lihat Semua Produk
            </Button>
          </Box>
        </Box>

        {/* Category Highlights */}
        <Box sx={{ mb: 6 }}>
          <Typography level="h4" component="h2" sx={{ mb: 3 }}>
            Kategori Populer
          </Typography>
          <Grid container spacing={2}>
            {categories.slice(0, 4).map((category) => (
              <Grid key={category.id} xs={6} sm={3}>
                <Card
                  variant="soft"
                  color="primary"
                  invertedColors
                  sx={{
                    textAlign: "center",
                    height: "100%",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      transition: "transform 0.3s",
                    },
                  }}
                >
                  <CardContent>
                    <Typography level="title-lg">{category.name}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Benefits Section */}
        <Box sx={{ mb: 6 }}>
          <Card variant="outlined">
            <CardContent>
              <Grid container spacing={2}>
                <Grid xs={12} sm={4}>
                  <Box sx={{ textAlign: "center", p: 2 }}>
                    <Sheet
                      variant="soft"
                      color="primary"
                      sx={{
                        width: 48,
                        height: 48,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        mx: "auto",
                        mb: 2,
                      }}
                    >
                      <i className="material-icons">local_shipping</i>
                    </Sheet>
                    <Typography level="title-md" sx={{ mb: 1 }}>
                      Pengiriman Cepat
                    </Typography>
                    <Typography level="body-sm">
                      Barang sampai tepat waktu ke tujuan Anda
                    </Typography>
                  </Box>
                </Grid>
                <Grid xs={12} sm={4}>
                  <Box sx={{ textAlign: "center", p: 2 }}>
                    <Sheet
                      variant="soft"
                      color="primary"
                      sx={{
                        width: 48,
                        height: 48,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        mx: "auto",
                        mb: 2,
                      }}
                    >
                      <i className="material-icons">security</i>
                    </Sheet>
                    <Typography level="title-md" sx={{ mb: 1 }}>
                      Garansi Produk
                    </Typography>
                    <Typography level="body-sm">
                      Jaminan kualitas untuk setiap pembelian
                    </Typography>
                  </Box>
                </Grid>
                <Grid xs={12} sm={4}>
                  <Box sx={{ textAlign: "center", p: 2 }}>
                    <Sheet
                      variant="soft"
                      color="primary"
                      sx={{
                        width: 48,
                        height: 48,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        mx: "auto",
                        mb: 2,
                      }}
                    >
                      <i className="material-icons">payment</i>
                    </Sheet>
                    <Typography level="title-md" sx={{ mb: 1 }}>
                      Pembayaran Aman
                    </Typography>
                    <Typography level="body-sm">
                      Berbagai metode pembayaran yang aman
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Container>

      {/* Footer Component */}
      <Footer categories={categories} />
    </CssVarsProvider>
  );
}
