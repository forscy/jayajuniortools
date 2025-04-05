import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Sheet,
  Input,
  IconButton,
  AspectRatio,
  Divider,
  Stack,
  Chip,
  LinearProgress,
  Tabs,
  TabList,
  Tab,
} from "@mui/joy";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CategoryDTO } from "../dto/category.dto";

// Icons
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import VerifiedIcon from "@mui/icons-material/Verified";
import PaymentsIcon from "@mui/icons-material/Payments";
import InfoIcon from "@mui/icons-material/Info";
import CallIcon from "@mui/icons-material/Call";
import StoreIcon from "@mui/icons-material/Store";
import PeopleIcon from "@mui/icons-material/People";
import LocationOnIcon from "@mui/icons-material/LocationOn";

// Data models
const categories: CategoryDTO[] = [
  { id: 1, name: "Sepatu" },
  { id: 2, name: "Tas" },
  { id: 3, name: "Pakaian" },
  { id: 4, name: "Aksesoris" },
  { id: 5, name: "Elektronik" },
  { id: 6, name: "Kecantikan" },
  { id: 7, name: "Rumah Tangga" },
  { id: 8, name: "Olahraga" },
];

const featuredProducts = [
  {
    id: 1,
    name: "Sepatu Olahraga Premium",
    price: 499000,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    discount: 15,
    rating: 4.8,
    reviewCount: 124,
  },
  {
    id: 2,
    name: "Tas Ransel Multifungsi",
    price: 299000,
    image: "https://images.unsplash.com/photo-1622560480654-d96214fdc887",
    discount: 0,
    rating: 4.5,
    reviewCount: 86,
  },
  {
    id: 3,
    name: "Kemeja Formal Modern",
    price: 249000,
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10",
    discount: 20,
    rating: 4.7,
    reviewCount: 95,
  },
  {
    id: 4,
    name: "Smart Watch Series X",
    price: 1499000,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12",
    discount: 10,
    rating: 4.9,
    reviewCount: 208,
  },
];

const promoOffers = [
  {
    id: 1,
    title: "Flash Sale",
    subtitle: "Diskon hingga 50%",
    image: "https://images.unsplash.com/photo-1607082349566-187342175e2f",
    color: "#ff5252",
  },
  {
    id: 3,
    title: "Voucher Diskon",
    subtitle: "Potongan Rp 50.000",
    image: "https://images.unsplash.com/photo-1556742031-c6961e8560b0",
    color: "#00c853",
  },
];

// Custom hooks
const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrollPosition = window.scrollY;
      const progress = (scrollPosition / totalHeight) * 100;
      setProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return progress;
};

// Modular components
const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da",
      title: "Belanja Mudah di Jaya Junior Tools",
      subtitle:
        "Temukan produk berkualitas dengan harga terbaik untuk gaya hidup modern Anda",
    },
    {
      image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db",
      title: "Koleksi Terbaru 2025",
      subtitle:
        "Jelajahi pilihan produk terbaru dengan desain modern dan fungsional",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: "70vh", sm: "60vh", md: "70vh" },
        overflow: "hidden",
      }}
    >
      {slides.map((slide, index) => (
        <Box
          key={index}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: currentSlide === index ? 1 : 0,
            transition: "opacity 1s ease-in-out",
            zIndex: currentSlide === index ? 1 : 0,
          }}
        >
          <AspectRatio
            ratio="16/9"
            objectFit="cover"
            sx={{ minHeight: "100%", filter: "brightness(0.7)" }}
          >
            <img
              src={slide.image}
              alt={`Jaya Junior Tools slide ${index + 1}`}
            />
          </AspectRatio>

          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: { xs: 2, sm: 3 },
            }}
          >
            <Sheet
              sx={{
                maxWidth: 600,
                width: "100%",
                borderRadius: { xs: "lg", sm: "xl" },
                p: { xs: 2, sm: 3, md: 4 },
                backdropFilter: "blur(8px)",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                boxShadow: "lg",
              }}
            >
              <Typography
                level="h1"
                sx={{
                  mb: 2,
                  textAlign: "center",
                  fontSize: { xs: "1.75rem", md: "2.5rem" },
                }}
              >
                {slide.title}
              </Typography>

              <Typography level="body-lg" sx={{ mb: 3, textAlign: "center" }}>
                {slide.subtitle}
              </Typography>
              <Button size="lg" fullWidth variant="solid" sx={{ mt: 1 }}>
                Belanja Sekarang
              </Button>
            </Sheet>
          </Box>
        </Box>
      ))}

      <Box
        sx={{
          position: "absolute",
          bottom: 16,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 1,
          zIndex: 2,
        }}
      >
        {slides.map((_, index) => (
          <Box
            key={index}
            onClick={() => setCurrentSlide(index)}
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              bgcolor: currentSlide === index ? "primary.500" : "white",
              opacity: currentSlide === index ? 1 : 0.5,
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": {
                opacity: 0.8,
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

const SectionHeader = ({
  title,
  subtitle,
  actionButton = null,
}: {
  title?: string;
  subtitle?: string;
  actionButton?: any;
}) => (
  <Box sx={{ mb: 4 }}>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 1,
      }}
    >
      <Typography level="h3" component="h2">
        {title}
      </Typography>
      {actionButton}
    </Box>
    {subtitle && (
      <Typography level="body-md" sx={{ color: "text.secondary" }}>
        {subtitle}
      </Typography>
    )}
  </Box>
);

const PromoOfferSection = () => (
  <Box component="section" sx={{ my: 6 }}>
    <SectionHeader
      title="Promo Spesial"
      subtitle="Jangan lewatkan penawaran terbatas dari kami"
    />

    <Grid container spacing={2} sx={{ mt: 2 }}>
      {promoOffers.map((promo) => (
        <Grid key={promo.id} xs={12} sm={4}>
          <Card
            variant="outlined"
            sx={{
              height: "100%",
              overflow: "hidden",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "md",
              },
              cursor: "pointer",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: `linear-gradient(to top, ${promo.color}99, transparent)`,
                zIndex: 1,
              }}
            />

            <AspectRatio ratio="21/9" objectFit="cover">
              <img src={promo.image} alt={promo.title} loading="lazy" />
            </AspectRatio>

            <CardContent
              sx={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                zIndex: 2,
                color: "white",
              }}
            >
              <Typography
                level="h4"
                sx={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}
              >
                {promo.title}
              </Typography>
              <Typography
                level="body-md"
                sx={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}
              >
                {promo.subtitle}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);

const CategorySection = () => (
  <Box component="section" sx={{ my: 6 }}>
    <SectionHeader
      title="Kategori Populer"
      subtitle="Jelajahi berbagai kategori produk kami untuk menemukan yang Anda butuhkan"
      actionButton={
        <Button variant="plain" endDecorator={<ArrowForwardIcon />}>
          Lihat Semua
        </Button>
      }
    />

    <Grid container spacing={2} sx={{ mt: 2 }}>
      {categories.slice(0, 8).map((category) => (
        <Grid key={category.id} xs={6} sm={3}>
          <Card
            variant="outlined"
            sx={{
              height: "100%",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "md",
                borderColor: "primary.300",
              },
              cursor: "pointer",
            }}
          >
            <CardContent sx={{ textAlign: "center", padding: 2 }}>
              <Sheet
                variant="soft"
                color="primary"
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 1.5,
                }}
              >
                <i className="material-icons" style={{ fontSize: "24px" }}>
                  {category.id! % 8 === 0
                    ? "sports"
                    : category.id! % 7 === 0
                    ? "home"
                    : category.id! % 6 === 0
                    ? "spa"
                    : category.id! % 5 === 0
                    ? "devices"
                    : category.id! % 4 === 0
                    ? "watch"
                    : category.id! % 3 === 0
                    ? "checkroom"
                    : category.id! % 2 === 0
                    ? "shopping_bag"
                    : "footprint"}
                </i>
              </Sheet>
              <Typography level="title-md">{category.name}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);

const StarRating = ({ rating }: { rating: any }) => {
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

const ProductCard = ({ product }: { product: any }) => (
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
    {product.discount > 0 && (
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
          {product.discount}% OFF
        </Typography>
      </Sheet>
    )}

    <AspectRatio ratio="1" objectFit="cover">
      <img src={product.image} alt={product.name} loading="lazy" />
    </AspectRatio>

    <CardContent>
      <Typography level="title-md" sx={{ mb: 0.5 }}>
        {product.name}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <StarRating rating={product.rating} />
        <Typography level="body-sm" color="neutral">
          ({product.reviewCount})
        </Typography>
      </Box>

      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}
      >
        <Typography level="body-lg" fontWeight="bold">
          Rp{" "}
          {(product.price * (1 - product.discount / 100)).toLocaleString(
            "id-ID"
          )}
        </Typography>

        {product.discount > 0 && (
          <Typography
            level="body-sm"
            sx={{ textDecoration: "line-through", color: "text.tertiary" }}
          >
            Rp {product.price.toLocaleString("id-ID")}
          </Typography>
        )}
      </Box>

      <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
        <Button
          variant="soft"
          color="primary"
          sx={{ flex: 1 }}
          startDecorator={<AddShoppingCartIcon />}
        >
          Tambah
        </Button>
        <IconButton variant="soft" color="neutral" aria-label="Add to wishlist">
          <FavoriteBorderIcon />
        </IconButton>
      </Box>
    </CardContent>
  </Card>
);

const FeaturedProductsSection = () => {
  const [activeTab, setActiveTab] = useState(0);

  const productTabs = [
    { label: "Semua", products: featuredProducts },
    {
      label: "Terlaris",
      products: featuredProducts.filter((p) => p.rating >= 4.7),
    },
    {
      label: "Diskon",
      products: featuredProducts.filter((p) => p.discount > 0),
    },
    {
      label: "Terbaru",
      products: [...featuredProducts].sort((a, b) => b.id - a.id),
    },
  ];

  return (
    <Box component="section" sx={{ my: { xs: 4, sm: 6 } }}>
      <SectionHeader
        title="Produk Unggulan"
        subtitle="Koleksi produk terbaik pilihan untuk Anda"
        actionButton={
          <Button
            variant="plain"
            endDecorator={<ArrowForwardIcon />}
            sx={{ display: { xs: "none", sm: "flex" } }} // Hide on mobile
          >
            Lihat Semua
          </Button>
        }
      />

      <Tabs
        value={activeTab}
        onChange={(_, value) => setActiveTab(value as number)}
        sx={{ mb: 3 }}
      >
        <TabList
          variant="soft"
          color="primary"
          sx={{
            borderRadius: "lg",
            mx: { xs: "auto", sm: 0 },
            width: { xs: "100%", sm: "auto" },
            overflow: "auto", // Enable horizontal scrolling on small screens
            flexWrap: { xs: "nowrap", sm: "wrap" },
          }}
        >
          {productTabs.map((tab, index) => (
            <Tab key={index} sx={{ minWidth: { xs: "auto", sm: "initial" } }}>
              {tab.label}
              {tab.label === "Diskon" && (
                <Chip size="sm" color="danger" sx={{ ml: 1 }}>
                  Promo
                </Chip>
              )}
            </Tab>
          ))}
        </TabList>
      </Tabs>

      <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ mt: 2 }}>
        {productTabs[activeTab].products.map((product) => (
          <Grid key={product.id} xs={6} sm={6} md={3}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>

      {/* Add a "See All" button visible only on mobile at the bottom */}
      <Box
        sx={{
          display: { xs: "flex", sm: "none" },
          justifyContent: "center",
          mt: 3,
        }}
      >
        <Button
          variant="outlined"
          endDecorator={<ArrowForwardIcon />}
          fullWidth
        >
          Lihat Semua Produk
        </Button>
      </Box>
    </Box>
  );
};

const BenefitItem = ({
  icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) => (
  <Card variant="soft" sx={{ height: "100%" }}>
    <CardContent sx={{ textAlign: "center" }}>
      <Sheet
        variant="solid"
        color="primary"
        sx={{
          width: 56,
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          mx: "auto",
          mb: 2,
        }}
      >
        {icon}
      </Sheet>
      <Typography level="title-lg" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Typography level="body-md">{description}</Typography>
    </CardContent>
  </Card>
);

const BenefitsSection = () => (
  <Box component="section" sx={{ my: 6 }}>
    <SectionHeader
      title="Mengapa Memilih Kami"
      subtitle="Keunggulan layanan yang kami tawarkan untuk Anda"
    />

    <Grid container spacing={3} sx={{ mt: 2 }}>
      <Grid xs={12} sm={4}>
        <BenefitItem
          icon={<LocalShippingIcon />}
          title="Pengiriman Cepat"
          description="Barang sampai tepat waktu dengan sistem logistik modern dan terpercaya"
        />
      </Grid>
      <Grid xs={12} sm={4}>
        <BenefitItem
          icon={<VerifiedIcon />}
          title="Kualitas Terjamin"
          description="Seluruh produk melewati quality control ketat dengan garansi resmi"
        />
      </Grid>
      <Grid xs={12} sm={4}>
        <BenefitItem
          icon={<PaymentsIcon />}
          title="Pembayaran Aman"
          description="Transaksi dilindungi dengan sistem keamanan berlapis dan terenkripsi"
        />
      </Grid>
    </Grid>
  </Box>
);

const TestimonialSection = () => (
  <Box component="section" sx={{ my: { xs: 4, sm: 6 } }}>
    <SectionHeader
      title="Testimoni Pelanggan"
      subtitle="Apa kata pelanggan tentang pengalaman berbelanja di Jaya Junior Tools"
    />

    <Grid
      container
      spacing={{ xs: 2, sm: 2 }}
      sx={{
        mt: 2,
        flexDirection: { xs: "column", sm: "row" },
      }}
    >
      {[
        {
          name: "Budi Santoso",
          role: "Pelanggan Setia",
          avatar: "B",
          content:
            "Saya sangat puas dengan kualitas produk dan kecepatan pengiriman. Customer service juga sangat responsif dan membantu.",
          rating: 5,
        },
        {
          name: "Siti Rahayu",
          role: "Pelanggan Baru",
          avatar: "S",
          content:
            "Baru pertama kali belanja dan langsung terkesan. Produk sesuai gambar dan deskripsi. Pasti akan belanja lagi!",
          rating: 4.5,
        },
        {
          name: "Agus Wijaya",
          role: "Pelanggan Premium",
          avatar: "A",
          content:
            "Sudah berlangganan selama 2 tahun dan tidak pernah mengecewakan. Selalu jadi pilihan utama untuk belanja online.",
          rating: 5,
        },
      ].map((testimonial, index) => (
        <Grid key={index} xs={12} sm={4}>
          <Card variant="outlined" sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Sheet
                  variant="solid"
                  color="primary"
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 1.5,
                  }}
                >
                  {testimonial.avatar}
                </Sheet>
                <Box sx={{ flex: 1 }}>
                  <Typography level="title-sm">{testimonial.name}</Typography>
                  <Typography level="body-xs" color="neutral">
                    {testimonial.role}
                  </Typography>
                </Box>
                <StarRating rating={testimonial.rating} />
              </Box>
              <Typography level="body-md" sx={{ fontStyle: "italic" }}>
                "{testimonial.content}"
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);

const AboutSection = () => (
  <Box component="section" sx={{ my: 6 }}>
    <Card
      variant="outlined"
      sx={{
        p: { xs: 2, sm: 4 },
        borderRadius: "lg",
      }}
    >
      <CardContent>
        <Grid container spacing={4} alignItems="center">
          <Grid xs={12} md={6}>
            <Typography level="h2" component="h2" sx={{ mb: 2 }}>
              Tentang Jaya Junior Tools
            </Typography>
            <Typography level="body-lg" sx={{ mb: 3, color: "text.secondary" }}>
              Didirikan pada tahun 2018, Jaya Junior Tools hadir untuk
              memberikan solusi belanja online yang terpercaya dan nyaman. Kami
              berkomitmen menyediakan produk berkualitas dengan harga kompetitif
              dan layanan pelanggan terbaik.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="solid"
                color="primary"
                startDecorator={<InfoIcon />}
              >
                Selengkapnya
              </Button>
              <Button
                variant="outlined"
                color="neutral"
                startDecorator={<CallIcon />}
              >
                Hubungi Kami
              </Button>
            </Stack>
          </Grid>
          <Grid xs={12} md={6}>
            <AspectRatio
              ratio="16/9"
              sx={{ borderRadius: "md", overflow: "hidden" }}
            >
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
                alt="Tentang Jaya Junior Tools"
                loading="lazy"
              />
            </AspectRatio>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  </Box>
);

const NewsletterSection = () => (
  <Box component="section" sx={{ my: 6 }}>
    <Card
      variant="solid"
      color="primary"
      invertedColors
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: "lg",
        boxShadow: "lg",
        background: "linear-gradient(to right, #4527a0, #7b1fa2)",
      }}
    >
      <CardContent sx={{ textAlign: "center" }}>
        <Typography level="h3" component="h2" sx={{ mb: 2 }}>
          Dapatkan Update Terbaru
        </Typography>
        <Typography
          level="body-lg"
          sx={{ mb: 3, maxWidth: "700px", mx: "auto" }}
        >
          Berlangganan newsletter kami untuk mendapatkan informasi terbaru
          tentang promo, produk baru, dan tips belanja
        </Typography>
        <Box
          component="form"
          sx={{
            display: "flex",
            gap: 1,
            maxWidth: "500px",
            mx: "auto",
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Input
            size="lg"
            placeholder="Email Anda"
            sx={{ flexGrow: 1 }}
            type="email"
            name="email"
            required
          />
          <Button size="lg" variant="solid" color="warning">
            Langganan
          </Button>
        </Box>
      </CardContent>
    </Card>
  </Box>
);

const FooterCTA = () => (
  <Box component="section" sx={{ my: 6 }}>
    <Grid container spacing={2}>
      <Grid xs={12} sm={4}>
        <Card
          variant="soft"
          color="success"
          sx={{ height: "100%", textAlign: "center" }}
        >
          <CardContent>
            <StoreIcon />
            <Typography level="h4" sx={{ mb: 1 }}>
              1000+
            </Typography>
            <Typography level="body-md">Produk Tersedia</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid xs={12} sm={4}>
        <Card
          variant="soft"
          color="primary"
          sx={{ height: "100%", textAlign: "center" }}
        >
          <CardContent>
            <PeopleIcon />
            <Typography level="h4" sx={{ mb: 1 }}>
              25.000+
            </Typography>
            <Typography level="body-md">Pelanggan Puas</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid xs={12} sm={4}>
        <Card
          variant="soft"
          color="warning"
          sx={{ height: "100%", textAlign: "center" }}
        >
          <CardContent>
            <LocationOnIcon />
            <Typography level="h4" sx={{ mb: 1 }}>
              34
            </Typography>
            <Typography level="body-md">Provinsi Terjangkau</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Box>
);

// Main component
export default function HomePage() {
  const scrollProgress = useScrollProgress();
  const isSmallScreen = window.innerWidth < 600;

  return (
    <>
      <LinearProgress
        determinate
        value={scrollProgress}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: isSmallScreen ? 2 : 3,
          zIndex: 9999,
          "& .MuiLinearProgress-bar": {
            transition: "transform 0.1s linear",
          },
        }}
      />

      <Header />

      <main>
        <HeroBanner />

        <Container
          maxWidth="lg"
          sx={{
            px: { xs: 1.5, sm: 2, md: 3 }, // Adjusted padding for different screen sizes
          }}
        >
          <PromoOfferSection />
          <Divider />
          <CategorySection />
          <Divider />
          <FeaturedProductsSection />
          <Divider />
          <BenefitsSection />
          <Divider />
          <TestimonialSection />
          <Divider />
          <AboutSection />
          <Divider />
          <FooterCTA />
          <NewsletterSection />
        </Container>
      </main>

      <Box
        sx={{
          position: "fixed",
          bottom: { xs: 12, sm: 16 },
          right: { xs: 12, sm: 16 },
          zIndex: 10,
        }}
      >
        <IconButton
          variant="solid"
          color="primary"
          size={isSmallScreen ? "md" : "lg"}
          aria-label="scroll to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          sx={{
            borderRadius: "50%",
            boxShadow: "lg",
          }}
        >
          <ArrowUpwardIcon fontSize={isSmallScreen ? "small" : "medium"} />
        </IconButton>
      </Box>

      <Footer />
    </>
  );
}
