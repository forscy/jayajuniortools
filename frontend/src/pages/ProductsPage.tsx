import React, { useState, useEffect } from "react";
import { Search } from "@mui/icons-material";
import {
  Box,
  Typography,
  Grid,
  Input,
  Select,
  Option,
  Button,
  Sheet,
  Divider,
  Stack,
  CircularProgress,
  CssVarsProvider,
} from "@mui/joy";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchProducts } from "../redux/slices/productSlice";
import Header from "../components/Header";
// Di bagian atas file, tambahkan import untuk gambar default
import { ProductCard } from "../components/ProductCardNew";
import Footer from "../components/Footer";
import { ProductDTO } from "../dto/product.dto";

// Custom Pagination Component with Joy UI
const CustomPagination: React.FC<{
  count: number;
  page: number;
  onChange: (page: number) => void;
}> = ({ count, page, onChange }) => {
  // Tampilkan halaman: current, prev/next, first/last, dan beberapa di sekitar current
  const getVisiblePages = () => {
    const delta = 1; // Jumlah halaman yang ditampilkan di sekitar halaman aktif
    const pages = [];

    for (
      let i = Math.max(1, page - delta);
      i <= Math.min(count, page + delta);
      i++
    ) {
      pages.push(i);
    }

    // Tambahkan halaman pertama jika tidak termasuk
    if (pages[0] > 1) {
      if (pages[0] > 2) pages.unshift(-1); // Tambahkan ellipsis
      pages.unshift(1);
    }

    // Tambahkan halaman terakhir jika tidak termasuk
    if (pages[pages.length - 1] < count) {
      if (pages[pages.length - 1] < count - 1) pages.push(-1); // Tambahkan ellipsis
      pages.push(count);
    }

    return pages;
  };

  return (
    <Stack direction="row" spacing={1}>
      <Button
        size="sm"
        variant="outlined"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        Previous
      </Button>

      {getVisiblePages().map((pageNum, index) =>
        pageNum === -1 ? (
          <Typography key={`ellipsis-${index}`} sx={{ alignSelf: "center" }}>
            ...
          </Typography>
        ) : (
          <Button
            key={pageNum}
            size="sm"
            variant={pageNum === page ? "solid" : "outlined"}
            color={pageNum === page ? "primary" : "neutral"}
            onClick={() => onChange(pageNum)}
          >
            {pageNum}
          </Button>
        )
      )}

      <Button
        size="sm"
        variant="outlined"
        disabled={page >= count}
        onClick={() => onChange(page + 1)}
      >
        Next
      </Button>
    </Stack>
  );
};

// Updated Product interface to match the Redux store and backend schema

// Reusable Components
// const ProductCard: React.FC<{
//   product: Product;
//   onAddToCart: (productId: number) => void;
//   onToggleFavorite: (productId: number) => void;
//   isFavorite: boolean;
// }> = ({ product, onAddToCart, onToggleFavorite, isFavorite }) => {
//   const imageUrl =
//     product.images && product.images.length > 0
//       ? product.images[0].url
//       : noProductImage;

//   const inStock = product.inventory && product.inventory.quantityInStock > 0;

//   return (
//     <Card
//       variant="outlined"
//       sx={{ height: "100%", display: "flex", flexDirection: "column" }}
//     >
//       <AspectRatio ratio="4/3">
//         <CardMedia
//           component="img"
//           image={imageUrl}
//           alt={product.name}
//           sx={{ objectFit: "cover" }}
//         />
//       </AspectRatio>
//       <CardContent
//         sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 1 }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "flex-start",
//           }}
//         >
//           <Typography level="title-md">{product.name}</Typography>
//           <IconButton
//             variant="plain"
//             color={isFavorite ? "danger" : "neutral"}
//             onClick={() => onToggleFavorite(product.id)}
//           >
//             {isFavorite ? <Favorite /> : <FavoriteBorder />}
//           </IconButton>
//         </Box>

//         <Chip size="sm" variant="soft" color={inStock ? "success" : "danger"}>
//           {inStock ? "In Stock" : "Out of Stock"}
//         </Chip>

//         <Typography level="body-sm" noWrap>
//           {product.description || "No description available"}
//         </Typography>

//         <Box
//           sx={{
//             mt: "auto",
//             pt: 2,
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <Typography level="title-lg" fontWeight="bold">
//             ${product.retailPrice.toFixed(2)}
//           </Typography>
//           <Button
//             size="sm"
//             variant="solid"
//             color="primary"
//             onClick={() => onAddToCart(product.id)}
//             disabled={!inStock}
//             startDecorator={<ShoppingCart />}
//           >
//             Add
//           </Button>
//         </Box>
//       </CardContent>
//     </Card>
//   );
// };

const FilterBar: React.FC<{
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <Sheet variant="outlined" sx={{ p: 2, mb: 3, borderRadius: "sm" }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems="center"
      >
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <Typography level="body-sm" sx={{ whiteSpace: "nowrap" }}>
            Category:
          </Typography>
          <Select
            value={selectedCategory}
            onChange={(_, value) => onCategoryChange(value as string)}
            size="sm"
            sx={{ minWidth: 120, width: { xs: "100%", sm: "auto" } }}
          >
            <Option value="all">All Categories</Option>
            {categories.map((category) => (
              <Option key={category} value={category}>
                {category}
              </Option>
            ))}
          </Select>
        </Box>

        <Divider
          orientation="vertical"
          sx={{ display: { xs: "none", sm: "block" } }}
        />
        <Divider sx={{ display: { xs: "block", sm: "none" }, width: "100%" }} />

        <Input
          startDecorator={<Search />}
          placeholder="Search products"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          size="sm"
          sx={{ flexGrow: 1 }}
        />
      </Stack>
    </Sheet>
  );
};

// Main Page Component
const ProductsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector((state) => state.product);

  const [filteredProducts, setFilteredProducts] = useState<ProductDTO[]>([]);
  // const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const productsPerPage = 8;

  // Fetch products from API using Redux
  useEffect(() => {
    dispatch(
      fetchProducts(
        { page: 1, pageSize: 100 } // Fetch all products for now
      )
    );
  }, [dispatch]);

  // Filter products based on category and search query
  useEffect(() => {
    if (!products) return;

    let result = [...products];

    if (selectedCategory !== "all") {
      result = result.filter((product) =>
        product.categories?.some((cat) => cat === selectedCategory)
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          (product.description &&
            product.description.toLowerCase().includes(query))
      );
    }

    setFilteredProducts(result);
    setPage(1); // Reset to first page when filters change
  }, [products, selectedCategory, searchQuery]);

  // Get unique categories from products
  const categories = products
    ? Array.from(
        new Set(
          products.flatMap(
            (product) => product.categories?.filter(Boolean) || []
          )
        )
      )
    : [];

  // Get current page products
  const currentProducts = filteredProducts.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // const handleAddToCart = (productId: number) => {
  //   // Implement cart functionality
  //   console.log(`Added product ${productId} to cart`);
  // };

  // const handleToggleFavorite = (productId: number) => {
  //   setFavorites((prev) =>
  //     prev.includes(productId)
  //       ? prev.filter((id) => id !== productId)
  //       : [...prev, productId]
  //   );
  // };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
          <Sheet
            variant="outlined"
            color="danger"
            sx={{ p: 3, borderRadius: "sm" }}
          >
            <Typography level="h4">Error</Typography>
            <Typography>{error}</Typography>
          </Sheet>
        </Box>
      </>
    );
  }

  return (
    <CssVarsProvider>
      <Header />
      <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
        <Typography level="h2" sx={{ mb: 2 }}>
          Our Products
        </Typography>

        <FilterBar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {filteredProducts.length === 0 ? (
          <Sheet sx={{ p: 4, textAlign: "center", borderRadius: "sm" }}>
            <Typography level="body-lg">
              No products found matching your criteria.
            </Typography>
          </Sheet>
        ) : (
          <>
            <Grid container spacing={2}>
              {currentProducts.map((product) => (
                <Grid key={product.id} xs={6} sm={4} md={3}>
                  <ProductCard
                    product={product}
                    // onAddToCart={handleAddToCart}
                    // onToggleFavorite={handleToggleFavorite}
                    // isFavorite={favorites.includes(product.id)}
                  />
                </Grid>
              ))}
            </Grid>
            {/* Dan gunakan di bagian pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CustomPagination
                  count={totalPages}
                  page={page}
                  onChange={(value) => setPage(value)}
                />
              </Box>
            )}
          </>
        )}
      </Box>
      <Footer />
    </CssVarsProvider>
  );
};

export default ProductsPage;
