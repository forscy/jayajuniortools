import {
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
import { calculateDiscountedPrice, formatRupiah, getAverageRating } from "../utils";
import { Product } from "../types";

// Tipe data berdasarkan skema Prisma
interface Category {
  id: number;
  name: string;
}


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




export default function HomePage() {
  return (
    <>

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
    </>
  );
}
