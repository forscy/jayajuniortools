import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  AspectRatio, 
  Box, 
  Breadcrumbs, 
  Button, 
  Card, 
  Chip, 
  Divider, 
  Grid, 
  Sheet, 
  Stack, 
  Typography, 
  Table, 
  Avatar,
  IconButton,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Skeleton
} from '@mui/joy';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InventoryIcon from '@mui/icons-material/Inventory';
// import StarRoundedIcon from '@mui/icons-material/StarRounded';
// import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded';
import CategoryIcon from '@mui/icons-material/Category';
import DiscountIcon from '@mui/icons-material/Discount';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchProductById } from '../redux/slices/productSlice';
import { DiscountDTO } from '../dto/ProductDTO';

const DetailProductPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { product, loading, error } = useAppSelector((state) => state.product);

  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(parseInt(id)));
    }
  }, [dispatch, id]);

  const handleAddToCart = () => {
    // Implement cart functionality
    console.log(`Added ${quantity} of product ${product?.name} to cart`);
  };

  const calculateDiscountedPrice = (price: number, discount?: DiscountDTO): number => {
    if (!discount || !discount.isActive) return price;
    
    if (discount.discountType === 'PERCENTAGE') {
      return price - (price * (discount.discountValue / 100));
    } else if (discount.discountType === 'FIXED') {
      return price - discount.discountValue;
    }
    return price;
  };

  // const renderStarRating = (rating: number) => {
  //   const stars = [];
  //   for (let i = 1; i <= 5; i++) {
  //     stars.push(
  //       i <= rating ? 
  //         <StarRoundedIcon key={i} color="warning" /> : 
  //         <StarOutlineRoundedIcon key={i} color="warning" />
  //     );
  //   }
  //   return stars;
  // };

  const handleGoBack = () => {
    navigate(-1);
  }


  if (loading) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
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
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Typography level="h4" color="danger">
          {error || 'Product not found'}
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

  // Updated to handle the new imageUrls structure
  const imageUrls = product.imageUrls || [];
  const mainImageUrl = imageUrls.length > 0 
    ? imageUrls[selectedImageIndex]
    : 'http://localhost:3003/uploads/products/no-product-image.png';
  
  const discountedRetailPrice = calculateDiscountedPrice(product.retailPrice, product.discount);
  const discountedWholesalePrice = product.wholesalePrice 
    ? calculateDiscountedPrice(product.wholesalePrice, product.discount) 
    : 0;

  // Stock information from the adapted DTO
  const inStock = product.quantityInStock > 0;
  const stockQuantity = product.quantityInStock;
  const locationName = product.locationName || 'Main Warehouse';

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 3 } }}>
      {/* Breadcrumbs */}
      <Breadcrumbs
        size="sm"
        sx={{ px: 0, py: 1, mb: 2 }}
        separator="›"
      >
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Typography 
            startDecorator={<HomeRoundedIcon />}
            color="neutral"
          >
            Home
          </Typography>
        </Link>
        <Link to="/products" style={{ textDecoration: 'none' }}>
          <Typography color="neutral">Products</Typography>
        </Link>
        <Typography>{product.name}</Typography>
      </Breadcrumbs>

      {/* Back Button */}
      <Button 
        onClick={handleGoBack}
        startDecorator={<ArrowBackIcon />}
        variant="soft"
        size="sm"
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      <Grid container spacing={3}>
        {/* Product Images */}
        <Grid xs={12} md={6}>
          <Card variant="outlined">
            <AspectRatio ratio="1" objectFit="contain">
              <img
                src={mainImageUrl}
                alt={product.name}
                loading="lazy"
              />
            </AspectRatio>
            {imageUrls.length > 1 && (
              <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                {imageUrls.map((imageUrl, index) => (
                  <Sheet
                    key={index}
                    variant="outlined"
                    sx={{
                      borderRadius: 'md',
                      width: 60,
                      height: 60,
                      cursor: 'pointer',
                      borderColor: selectedImageIndex === index ? 'primary.500' : 'neutral.outlinedBorder',
                      borderWidth: selectedImageIndex === index ? 2 : 1,
                    }}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <AspectRatio ratio="1" objectFit="cover">
                      <img 
                        src={imageUrl}
                        alt={`${product.name} ${index + 1}`} 
                        loading="lazy"
                      />
                    </AspectRatio>
                  </Sheet>
                ))}
              </Box>
            )}
          </Card>
        </Grid>

        {/* Product Info */}
        <Grid xs={12} md={6}>
          <Stack spacing={2}>
            <Box>
              <Typography level="h2">{product.name}</Typography>
            </Box>

            {product.sku && <Typography level="body-sm">SKU: {product.sku}</Typography>}

            <Divider />

            {/* Categories */}
            {product.categories && product.categories.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Typography level="body-sm" startDecorator={<CategoryIcon />}>
                  Categories:
                </Typography>
                {product.categories.map((category, index) => (
                  <Chip key={index} size="sm" variant="soft" color="primary">
                    {category}
                  </Chip>
                ))}
              </Box>
            )}

            {/* Price Information */}
            <Box>
              {product.discount && product.discount.isActive ? (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography level="h3" color="success">
                      Rp {Math.round(discountedRetailPrice).toLocaleString('id-ID')}
                    </Typography>
                    <Typography 
                      level="body-md" 
                      sx={{ textDecoration: 'line-through' }}
                      color="neutral"
                    >
                      Rp {product.retailPrice.toLocaleString('id-ID')}
                    </Typography>
                    <Chip 
                      size="sm" 
                      color="danger" 
                      startDecorator={<DiscountIcon />}
                      variant="soft"
                    >
                      {product.discount.discountType === 'PERCENTAGE' 
                        ? `${product.discount.discountValue}% OFF`
                        : `Rp ${product.discount.discountValue.toLocaleString('id-ID')} OFF`}
                    </Chip>
                  </Box>
                  <Typography level="body-sm" color="danger">
                    Sale ends on {new Date(product.discount.endDate).toLocaleDateString()}
                  </Typography>
                </>
              ) : (
                <Typography level="h3" color="success">
                  Rp {product.retailPrice.toLocaleString('id-ID')}
                </Typography>
              )}
              
              {/* Wholesale Price */}
              {product.wholesalePrice && product.wholesalePrice > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography level="body-sm">
                    Wholesale: Rp {Math.round(product.discount && product.discount.isActive 
                      ? discountedWholesalePrice 
                      : product.wholesalePrice).toLocaleString('id-ID')} 
                    {product.minWholesaleQty && product.minWholesaleQty > 0 && 
                      ` (min. ${product.minWholesaleQty} units)`}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Inventory Status */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InventoryIcon color={inStock ? "success" : "error"} />
              <Typography 
                level="body-md" 
                color={inStock ? "success" : "danger"}
              >
                {inStock 
                  ? `In Stock (${stockQuantity} available)` 
                  : 'Out of Stock'}
              </Typography>
            </Box>

            {/* Quantity Selector and Add to Cart */}
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton
                  variant="outlined"
                  color="neutral"
                  disabled={quantity <= 1 || !inStock}
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                >
                  -
                </IconButton>
                <Typography sx={{ width: 40, textAlign: 'center' }}>
                  {quantity}
                </Typography>
                <IconButton
                  variant="outlined"
                  color="neutral"
                  disabled={quantity >= stockQuantity || !inStock}
                  onClick={() => setQuantity(q => Math.min(stockQuantity, q + 1))}
                >
                  +
                </IconButton>
              </Box>
              
              <Button
                fullWidth
                startDecorator={<ShoppingCartIcon />}
                disabled={!inStock}
                onClick={handleAddToCart}
                color="primary"
              >
                Add to Cart
              </Button>
            </Stack>

            {/* Brand Information */}
            {product.brand && (
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography level="body-sm">Brand:</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {product.brand.logoUrl && (
                    <Avatar src={product.brand.logoUrl} size="sm" />
                  )}
                  <Typography>{product.brand.name}</Typography>
                </Box>
              </Box>
            )}
          </Stack>
        </Grid>
      </Grid>

      {/* Product Details Tabs */}
      <Box sx={{ mt: 4 }}>
        <Tabs 
          value={activeTab}
          onChange={(event, value) => setActiveTab(value as number)}
          sx={{ bgcolor: 'background.body' }}
        >
          <TabList>
            <Tab>Description</Tab>
            <Tab>Specifications</Tab>
          </TabList>
          <TabPanel value={0}>
            <Typography>
              {product.description || 'No description available.'}
            </Typography>
          </TabPanel>
          <TabPanel value={1}>
            <Table>
              <tbody>
                {product.sku && (
                  <tr>
                    <td>
                      <Typography level="body-sm" fontWeight="lg">SKU</Typography>
                    </td>
                    <td>
                      <Typography level="body-sm">{product.sku}</Typography>
                    </td>
                  </tr>
                )}
                {product.categories && product.categories.length > 0 && (
                  <tr>
                    <td>
                      <Typography level="body-sm" fontWeight="lg">Categories</Typography>
                    </td>
                    <td>
                      <Typography level="body-sm">
                        {product.categories.join(', ')}
                      </Typography>
                    </td>
                  </tr>
                )}
                <tr>
                  <td>
                    <Typography level="body-sm" fontWeight="lg">Retail Price</Typography>
                  </td>
                  <td>
                    <Typography level="body-sm">
                      Rp {product.retailPrice.toLocaleString('id-ID')}
                    </Typography>
                  </td>
                </tr>
                {product.wholesalePrice && product.wholesalePrice > 0 && (
                  <tr>
                    <td>
                      <Typography level="body-sm" fontWeight="lg">Wholesale Price</Typography>
                    </td>
                    <td>
                      <Typography level="body-sm">
                        Rp {product.wholesalePrice.toLocaleString('id-ID')}
                        {product.minWholesaleQty && product.minWholesaleQty > 0 && 
                          ` (min. ${product.minWholesaleQty} units)`}
                      </Typography>
                    </td>
                  </tr>
                )}
                <tr>
                  <td>
                    <Typography level="body-sm" fontWeight="lg">Stock</Typography>
                  </td>
                  <td>
                    <Typography level="body-sm">
                      {stockQuantity} units
                    </Typography>
                  </td>
                </tr>
                <tr>
                  <td>
                    <Typography level="body-sm" fontWeight="lg">Location</Typography>
                  </td>
                  <td>
                    <Typography level="body-sm">
                      {locationName}
                    </Typography>
                  </td>
                </tr>
                {product.minimumStock !== undefined && (
                  <tr>
                    <td>
                      <Typography level="body-sm" fontWeight="lg">Minimum Stock Level</Typography>
                    </td>
                    <td>
                      <Typography level="body-sm">
                        {product.minimumStock} units
                      </Typography>
                    </td>
                  </tr>
                )}
                {product.brand && (
                  <tr>
                    <td>
                      <Typography level="body-sm" fontWeight="lg">Brand</Typography>
                    </td>
                    <td>
                      <Typography level="body-sm">
                        {product.brand.name}
                      </Typography>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </TabPanel>
        </Tabs>
      </Box>
    </Box>
  );
};

export default DetailProductPage;