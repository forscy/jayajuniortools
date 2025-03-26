import {
  Sheet,
  Container,
  Grid,
  Typography,
  Stack,
  Link,
  Box,
  IconButton,
  Divider,
} from "@mui/joy";

interface Category {
  id: number;
  name: string;
}

interface FooterProps {
  categories?: Category[];
}

export default function Footer({ categories }: FooterProps) {
  return (
    <Sheet
      component="footer"
      variant="soft"
      color="neutral"
      sx={{
        p: { xs: 2, sm: 4 },
        mt: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid xs={12} sm={6} md={3}>
            <Typography level="title-lg" sx={{ mb: 2 }}>
              Jaya Junior Tools
            </Typography>
            <Typography level="body-sm" sx={{ mb: 2 }}>
              Jaya Junior Tools adalah platform belanja online terpercaya dengan
              berbagai produk berkualitas dan harga terbaik untuk kebutuhan
              Anda.
            </Typography>
          </Grid>
          {/* Tampilkan kategori jika ada */}
          {categories && (
            <Grid xs={12} sm={6} md={3}>
              <Typography level="title-md" sx={{ mb: 2 }}>
                Kategori
              </Typography>
              <Stack spacing={1}>
                {categories.map((category) => (
                  <Link key={category.id} level="body-sm" color="neutral">
                    {category.name}
                  </Link>
                ))}
              </Stack>
            </Grid>
          )}
          <Grid xs={12} sm={6} md={3}>
            <Typography level="title-md" sx={{ mb: 2 }}>
              Bantuan
            </Typography>
            <Stack spacing={1}>
              <Link level="body-sm" color="neutral">
                Cara Berbelanja
              </Link>
              <Link level="body-sm" color="neutral">
                Pengiriman
              </Link>
              <Link level="body-sm" color="neutral">
                Pengembalian
              </Link>
              <Link level="body-sm" color="neutral">
                Pembayaran
              </Link>
              <Link level="body-sm" color="neutral">
                FAQ
              </Link>
            </Stack>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <Typography level="title-md" sx={{ mb: 2 }}>
              Hubungi Kami
            </Typography>
            <Stack spacing={1}>
              <Typography level="body-sm">
                Email: info@JayaJuniorTools.com
              </Typography>
              <Typography level="body-sm">Telepon: (021) 1234-5678</Typography>
              <Typography level="body-sm">
                Alamat: Jalan Raya No. 123, Jakarta
              </Typography>
              <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                <IconButton variant="plain" color="neutral">
                  <i className="material-icons">facebook</i>
                </IconButton>
                <IconButton variant="plain" color="neutral">
                  <i className="material-icons">instagram</i>
                </IconButton>
                <IconButton variant="plain" color="neutral">
                  <i className="material-icons">twitter</i>
                </IconButton>
              </Box>
            </Stack>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Typography level="body-sm" textAlign="center">
          © {new Date().getFullYear()} Jaya Junior Tools. Hak Cipta Dilindungi.
        </Typography>
      </Container>
    </Sheet>
  );
}
