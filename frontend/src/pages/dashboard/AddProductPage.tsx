import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { addProduct } from "../../redux/slices/productSlice";
import { fetchCategories } from "../../redux/slices/categorySlice";
import imageController from "../../controllers/ImageController";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  Input,
  Sheet,
  Stack,
  Textarea,
  Typography,
  Select,
  Option,
  AspectRatio,
  Alert,
  CircularProgress,
  LinearProgress,
} from "@mui/joy";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import InventoryIcon from "@mui/icons-material/Inventory";
import QrCodeIcon from "@mui/icons-material/QrCode";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

const AddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.product);
  const { categories } = useAppSelector((state) => state.category);

  // Form state
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    retailPrice: 0,
    wholesalePrice: 0,
    minWholesaleQty: 0,
    sku: "",
    quantityInStock: 0,
    minimumStock: 5,
    categories: [] as string[], // Changed from number[] to string[] to match API
    imageUrls: [] as string[], // Changed from images to imageUrls to match API
  });

  // Form validation
  const [errors, setErrors] = useState({
    name: "",
    retailPrice: "",
    quantityInStock: "",
  });

  // Success state
  const [success, setSuccess] = useState(false);

  // For image uploads
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagesPreviews, setImagesPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]:
        name.includes("Price") || name.includes("Qty") || name.includes("Stock")
          ? parseFloat(value) || 0
          : value,
    });

    // Clear error when user types
    if (name in errors) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Handle category selection
  const handleCategoryChange = (
    event: React.SyntheticEvent | null,
    newValue: Array<string> | null
  ) => {
    setProductData({
      ...productData,
      categories: newValue || [],
    });
  };

  // Handle image file selection
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    // Check if adding more would exceed the limit
    const newFiles = Array.from(e.target.files);
    if (imageFiles.length + newFiles.length > 5) {
      setUploadError("Maximum 5 images allowed");
      return;
    }

    setUploadError(null);

    // Store files for later upload
    setImageFiles([...imageFiles, ...newFiles]);

    // Create preview URLs
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setImagesPreviews([...imagesPreviews, ...newPreviews]);
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    // If the image was already uploaded, we'll need to update productData.imageUrls
    const wasUploaded = index < productData.imageUrls.length;

    if (wasUploaded) {
      // Remove from the uploaded URLs
      const newImageUrls = [...productData.imageUrls];
      newImageUrls.splice(index, 1);
      setProductData({
        ...productData,
        imageUrls: newImageUrls,
      });
    }

    // Clean up the preview
    if (index < imagesPreviews.length) {
      const newPreviews = [...imagesPreviews];
      // Release object URL to prevent memory leaks
      URL.revokeObjectURL(newPreviews[index]);
      newPreviews.splice(index, 1);
      setImagesPreviews(newPreviews);
    }

    // Remove from files array
    if (index < imageFiles.length) {
      const newFiles = [...imageFiles];
      newFiles.splice(index, 1);
      setImageFiles(newFiles);
    }
  };

  // Upload images to server using the ImageController
  const uploadImages = async (): Promise<string[]> => {
    if (imageFiles.length === 0) return [];

    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      const uploadedUrls: string[] = [];

      // Upload each image one by one
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];

        // Update progress
        setUploadProgress(Math.floor((i / imageFiles.length) * 100));

        // Upload the image
        const response = await imageController.uploadImage(file, true);
        if (response.status === "success" && response.data.imageUrl) {
          uploadedUrls.push(response.data.imageUrl);
        } else {
          throw new Error(`Failed to upload image: ${response.message}`);
        }
      }

      setUploadProgress(100);
      return uploadedUrls;
    } catch (error: any) {
      setUploadError(`Image upload failed: ${error.message}`);
      console.error("Image upload error:", error);
      return [];
    } finally {
      setUploading(false);
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors = {
      name: "",
      retailPrice: "",
      quantityInStock: "",
    };

    let isValid = true;

    if (!productData.name.trim()) {
      newErrors.name = "Product name is required";
      isValid = false;
    }

    if (productData.retailPrice <= 0) {
      newErrors.retailPrice = "Price must be greater than 0";
      isValid = false;
    }

    if (productData.quantityInStock < 0) {
      newErrors.quantityInStock = "Stock cannot be negative";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      let imageUrls: string[] = [...productData.imageUrls]; // Start with any already uploaded images
      // Upload any new images
      if (imageFiles.length > 0) {
        const newUrls = await uploadImages();
        if (newUrls.length > 0) {
          imageUrls = [...imageUrls, ...newUrls];
        }
      }

      // Create the product data to match the API's expected format
      const productToAdd = {
        name: productData.name,
        description: productData.description,
        retailPrice: productData.retailPrice,
        wholesalePrice: productData.wholesalePrice || undefined,
        minWholesaleQty: productData.minWholesaleQty || undefined,
        sku: productData.sku || undefined,
        quantityInStock: productData.quantityInStock,
        minimumStock: productData.minimumStock,
        categories:
          productData.categories.length > 0
            ? productData.categories
            : undefined,
        imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
      };

      console.info("Adding product:", productToAdd);

      const resultAction = await dispatch(addProduct(productToAdd));

      if (addProduct.fulfilled.match(resultAction)) {
        setSuccess(true);
        // Reset form after successful submission
        setTimeout(() => {
          navigate("/dashboard/products");
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  // Generate a random SKU (for demo purposes)
  const generateSKU = () => {
    const prefix = "PRD";
    const randomPart = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    const sku = `${prefix}-${randomPart}`;

    setProductData({
      ...productData,
      sku,
    });
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 2, md: 3 } }}>
      <Button
        variant="soft"
        startDecorator={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      <Typography level="h2" sx={{ mb: 3 }}>
        Add New Product
      </Typography>

      {error && (
        <Alert color="danger" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          color="success"
          startDecorator={<CheckCircleIcon />}
          sx={{ mb: 3 }}
        >
          Product added successfully! Redirecting...
        </Alert>
      )}

      <Card variant="outlined">
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Left Column - Basic Info */}
              <Grid xs={12} md={8}>
                <Stack spacing={3}>
                  {/* Product Name */}
                  <FormControl error={!!errors.name}>
                    <FormLabel>Product Name *</FormLabel>
                    <Input
                      name="name"
                      value={productData.name}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                    />
                    {errors.name && (
                      <FormHelperText>{errors.name}</FormHelperText>
                    )}
                  </FormControl>

                  {/* Description */}
                  <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                      name="description"
                      value={productData.description}
                      onChange={handleInputChange}
                      minRows={4}
                      placeholder="Enter product description"
                    />
                  </FormControl>

                  {/* Categories */}
                  <FormControl>
                    <FormLabel>Categories</FormLabel>
                    <Select
                      multiple
                      placeholder="Select categories"
                      value={productData.categories}
                      onChange={handleCategoryChange}
                      renderValue={(selected) => (
                        <Box
                          sx={{
                            display: "flex",
                            gap: "0.25rem",
                            flexWrap: "wrap",
                          }}
                        >
                          {selected.map((categoryName, index) => (
                            <Chip
                              variant="soft"
                              key={categoryName.value || index}
                            >
                              {categoryName.value}
                            </Chip>
                          ))}
                        </Box>
                      )}
                    >
                      {categories.map((category) => (
                        <Option key={category.id} value={category.name}>
                          {category.name}
                        </Option>
                      ))}
                    </Select>
                    <FormHelperText>
                      Select one or more categories
                    </FormHelperText>
                  </FormControl>

                  <Divider />

                  {/* Price Information */}
                  <Typography
                    level="title-md"
                    startDecorator={<AttachMoneyIcon />}
                  >
                    Pricing Information
                  </Typography>

                  <Grid container spacing={2}>
                    {/* Retail Price */}
                    <Grid xs={12} sm={6}>
                      <FormControl error={!!errors.retailPrice}>
                        <FormLabel>Retail Price (Rp) *</FormLabel>
                        <Input
                          name="retailPrice"
                          type="number"
                          value={productData.retailPrice}
                          onChange={handleInputChange}
                          slotProps={{
                            input: {
                              min: 0,
                              step: 1000,
                            },
                          }}
                          startDecorator="Rp"
                        />
                        {errors.retailPrice && (
                          <FormHelperText>{errors.retailPrice}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    {/* Wholesale Price */}
                    <Grid xs={12} sm={6}>
                      <FormControl>
                        <FormLabel>Wholesale Price (Rp)</FormLabel>
                        <Input
                          name="wholesalePrice"
                          type="number"
                          value={productData.wholesalePrice}
                          onChange={handleInputChange}
                          slotProps={{
                            input: {
                              min: 0,
                              step: 1000,
                            },
                          }}
                          startDecorator="Rp"
                        />
                        <FormHelperText>
                          Leave at 0 if not applicable
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    {/* Min Wholesale Quantity */}
                    <Grid xs={12} sm={6}>
                      <FormControl>
                        <FormLabel>Min. Wholesale Quantity</FormLabel>
                        <Input
                          name="minWholesaleQty"
                          type="number"
                          value={productData.minWholesaleQty}
                          onChange={handleInputChange}
                          slotProps={{
                            input: {
                              min: 0,
                            },
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Divider />

                  {/* Inventory Information */}
                  <Typography
                    level="title-md"
                    startDecorator={<InventoryIcon />}
                  >
                    Inventory Information
                  </Typography>

                  <Grid container spacing={2}>
                    {/* SKU */}
                    <Grid xs={12} sm={6}>
                      <FormControl>
                        <FormLabel>SKU</FormLabel>
                        <Input
                          name="sku"
                          value={productData.sku}
                          onChange={handleInputChange}
                          placeholder="Product SKU"
                          endDecorator={
                            <IconButton
                              variant="plain"
                              onClick={generateSKU}
                              title="Generate SKU"
                            >
                              <QrCodeIcon />
                            </IconButton>
                          }
                        />
                        <FormHelperText>
                          Leave blank to auto-generate or click icon to generate
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    {/* Stock Quantity */}
                    <Grid xs={12} sm={6}>
                      <FormControl error={!!errors.quantityInStock}>
                        <FormLabel>Initial Stock *</FormLabel>
                        <Input
                          name="quantityInStock"
                          type="number"
                          value={productData.quantityInStock}
                          onChange={handleInputChange}
                          slotProps={{
                            input: {
                              min: 0,
                            },
                          }}
                        />
                        {errors.quantityInStock && (
                          <FormHelperText>
                            {errors.quantityInStock}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    {/* Minimum Stock */}
                    <Grid xs={12} sm={6}>
                      <FormControl>
                        <FormLabel>Minimum Stock Level</FormLabel>
                        <Input
                          name="minimumStock"
                          type="number"
                          value={productData.minimumStock}
                          onChange={handleInputChange}
                          slotProps={{
                            input: {
                              min: 0,
                            },
                          }}
                        />
                        <FormHelperText>
                          Stock level at which to reorder
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Stack>
              </Grid>

              {/* Right Column - Images */}
              <Grid xs={12} md={4}>
                <Card variant="outlined">
                  <Box sx={{ p: 2 }}>
                    <Typography level="title-md">Product Images</Typography>
                    <Typography level="body-sm">
                      Upload images of your product (max 5)
                    </Typography>
                  </Box>

                  <Divider />

                  <Stack spacing={2} sx={{ p: 2 }}>
                    {/* Upload progress */}
                    {uploading && (
                      <Box sx={{ width: "100%" }}>
                        <Typography level="body-sm" sx={{ mb: 1 }}>
                          Uploading images: {uploadProgress}%
                        </Typography>
                        <LinearProgress
                          determinate
                          value={uploadProgress}
                          sx={{ my: 1 }}
                        />
                      </Box>
                    )}

                    {/* Upload error */}
                    {uploadError && (
                      <Alert
                        color="danger"
                        startDecorator={<ErrorIcon />}
                        sx={{ mt: 1, mb: 2 }}
                        size="sm"
                      >
                        {uploadError}
                      </Alert>
                    )}

                    {/* Image previews */}
                    {imagesPreviews.length > 0 ? (
                      <Stack spacing={2}>
                        {imagesPreviews.map((preview, index) => (
                          <Card key={index} variant="outlined">
                            <AspectRatio ratio="1" objectFit="contain">
                              <img
                                src={preview}
                                alt={`Product preview ${index + 1}`}
                                loading="lazy"
                              />
                            </AspectRatio>
                            <Box
                              sx={{
                                p: 1,
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                            >
                              <IconButton
                                color="danger"
                                variant="plain"
                                onClick={() => handleRemoveImage(index)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </Card>
                        ))}
                      </Stack>
                    ) : (
                      <Sheet
                        variant="outlined"
                        sx={{
                          borderRadius: "md",
                          p: 3,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <AddPhotoAlternateIcon
                          sx={{ fontSize: 48, color: "neutral.500" }}
                        />
                        <Typography level="body-sm" textAlign="center">
                          Drag and drop images here or click to browse
                        </Typography>
                      </Sheet>
                    )}

                    {/* Image upload button */}
                    <Button
                      variant="soft"
                      component="label"
                      startDecorator={<AddPhotoAlternateIcon />}
                      disabled={imageFiles.length >= 5 || uploading}
                    >
                      {imageFiles.length > 0
                        ? "Add More Images"
                        : "Upload Images"}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageSelect}
                        style={{ display: "none" }}
                        disabled={imageFiles.length >= 5}
                      />
                    </Button>

                    <FormHelperText>
                      Supported formats: JPG, PNG. Max size: 5MB per image.
                    </FormHelperText>
                  </Stack>
                </Card>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Submit Buttons */}
            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button
                variant="soft"
                color="neutral"
                onClick={() => navigate("/dashboard/products")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                startDecorator={
                  loading || uploading ? (
                    <CircularProgress size="sm" />
                  ) : (
                    <SaveIcon />
                  )
                }
                disabled={loading || uploading}
              >
                {loading || uploading ? "Saving..." : "Save Product"}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddProductPage;
