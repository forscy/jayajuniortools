import * as React from "react";
import { useNavigate } from "react-router-dom";

// MUI Joy Components
import {
  Box,
  Typography,
  Sheet,
  Table,
  Input,
  Button,
  IconButton,
  Chip,
  Tooltip,
  Avatar,
  AspectRatio,
  Modal,
  ModalDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  Option,
  FormControl,
  FormLabel,
  Divider,
  Alert,
  LinearProgress,
  Checkbox,
} from "@mui/joy";

// Icons
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FilterListIcon from "@mui/icons-material/FilterList";
import WarningIcon from "@mui/icons-material/Warning";
import InventoryIcon from "@mui/icons-material/Inventory";
import ErrorIcon from "@mui/icons-material/Error";
import DownloadIcon from "@mui/icons-material/Download";
import RefreshIcon from "@mui/icons-material/Refresh";
import SortIcon from "@mui/icons-material/Sort";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";
// Additional imports for custom pagination
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

// Components and Types
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  deleteProduct,
  fetchAllProducts,
} from "../../redux/slices/productSlice";
import { useAppDispatch } from "../../redux/hooks";
import {
  ProductDTO,
  ProductFilters,
  ProductStatus,
} from "../../dto/product.dto";
import { fetchCategories } from "../../redux/slices/categorySlice";

// Custom Pagination implementation with JoyUI components
function CustomPagination({
  count,
  page,
  onChange,
  size = "sm",
}: {
  count: number;
  page: number;
  onChange: (event: React.MouseEvent<HTMLButtonElement>, value: number) => void;
  size?: "sm" | "md" | "lg";
}) {
  // Display a reasonable number of page buttons
  const getVisiblePages = () => {
    if (count <= 7) {
      // Display all pages if total is 7 or less
      return Array.from({ length: count }, (_, i) => i + 1);
    }

    // More sophisticated logic for many pages
    if (page <= 4) {
      return [1, 2, 3, 4, 5, "...", count];
    } else if (page >= count - 3) {
      return [1, "...", count - 4, count - 3, count - 2, count - 1, count];
    } else {
      return [1, "...", page - 1, page, page + 1, "...", count];
    }
  };

  const visiblePages = getVisiblePages();

  const handlePageClick =
    (newPage: number) => (event: React.MouseEvent<HTMLButtonElement>) => {
      if (newPage !== page && newPage >= 1 && newPage <= count) {
        onChange(event, newPage);
      }
    };

  return (
    <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
      {/* First Page Button */}
      <IconButton
        size={size}
        variant="plain"
        color="neutral"
        disabled={page === 1}
        onClick={handlePageClick(1)}
        aria-label="First Page"
      >
        <KeyboardDoubleArrowLeftIcon
          fontSize={size === "sm" ? "small" : "medium"}
        />
      </IconButton>

      {/* Previous Page Button */}
      <IconButton
        size={size}
        variant="plain"
        color="neutral"
        disabled={page === 1}
        onClick={handlePageClick(page - 1)}
        aria-label="Previous Page"
      >
        <KeyboardArrowLeftIcon fontSize={size === "sm" ? "small" : "medium"} />
      </IconButton>

      {/* Page Numbers */}
      <Box sx={{ display: "flex", gap: 0.5 }}>
        {visiblePages.map((pageNumber, index) =>
          pageNumber === "..." ? (
            <Typography
              key={`ellipsis-${index}`}
              level="body-sm"
              sx={{ alignSelf: "center", px: 0.5 }}
            >
              ...
            </Typography>
          ) : (
            <Button
              key={`page-${pageNumber}`}
              size={size}
              variant={page === pageNumber ? "solid" : "plain"}
              color={page === pageNumber ? "primary" : "neutral"}
              onClick={handlePageClick(pageNumber as number)}
              sx={{
                minWidth: size === "sm" ? 30 : 36,
                fontWeight: page === pageNumber ? "bold" : "normal",
              }}
            >
              {pageNumber}
            </Button>
          )
        )}
      </Box>

      {/* Next Page Button */}
      <IconButton
        size={size}
        variant="plain"
        color="neutral"
        disabled={page === count}
        onClick={handlePageClick(page + 1)}
        aria-label="Next Page"
      >
        <KeyboardArrowRightIcon fontSize={size === "sm" ? "small" : "medium"} />
      </IconButton>

      {/* Last Page Button */}
      <IconButton
        size={size}
        variant="plain"
        color="neutral"
        disabled={page === count}
        onClick={handlePageClick(count)}
        aria-label="Last Page"
      >
        <KeyboardDoubleArrowRightIcon
          fontSize={size === "sm" ? "small" : "medium"}
        />
      </IconButton>
    </Box>
  );
}

// Utility functions for product status and currency formatting
function getProductStatusChip(status: ProductStatus | null | undefined) {
  if (!status) return null;

  const statusConfig = {
    [ProductStatus.AVAILABLE]: { color: "success", label: "Available" },
    [ProductStatus.COMMING_SOON]: { color: "primary", label: "Coming Soon" },
    [ProductStatus.DELETED]: { color: "danger", label: "Deleted" },
    [ProductStatus.ARCHIVED]: { color: "neutral", label: "Archived" },
    [ProductStatus.SUSPENDED]: { color: "warning", label: "Suspended" },
  };

  const config = statusConfig[status] || { color: "neutral", label: status };

  return (
    <Chip
      size="sm"
      variant="soft"
      color={
        config.color as "success" | "primary" | "danger" | "neutral" | "warning"
      }
    >
      {config.label}
    </Chip>
  );
}

function formatCurrency(amount: number | null | undefined) {
  if (amount === null || amount === undefined) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Define filter types interface

function ProductsTable({
  products,
  onRefresh,
  loading,
}: {
  products: ProductDTO[];
  onRefresh: () => void;
  loading: boolean;
}) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentPath = window.location.pathname;
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [productToDelete, setProductToDelete] = React.useState<number | null>(
    null
  );
  const [deleteInProgress, setDeleteInProgress] = React.useState(false);
  const [selectedProducts, setSelectedProducts] = React.useState<number[]>([]);

  const handleEdit = (productId: number) => {
    navigate(currentPath + `/${productId}/edit`);
  };

  const confirmDelete = (productId: number) => {
    setProductToDelete(productId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (productToDelete) {
      setDeleteInProgress(true);
      try {
        await dispatch(deleteProduct(productToDelete)).unwrap();
        // Refresh product list after successful deletion
        onRefresh();
      } catch (error) {
        console.error("Failed to delete product:", error);
      } finally {
        setDeleteInProgress(false);
        setDeleteConfirmOpen(false);
        setProductToDelete(null);
      }
    }
  };

  const handleDetail = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  // Bulk selection handlers
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = products.map((p) => p.id!);
      setSelectedProducts(allIds);
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: number) => {
    setSelectedProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Find product by id
  const getProductById = (id: number | null) => {
    if (!id) return null;
    return products.find((product) => product.id === id) || null;
  };

  const productToDeleteData = getProductById(productToDelete);

  return (
    <React.Fragment>
      {/* Bulk Actions Bar - Shows when items are selected */}
      {selectedProducts.length > 0 && (
        <Box
          sx={{
            p: 2,
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "background.level1",
            borderRadius: "md",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography level="body-sm">
              {selectedProducts.length} products selected
            </Typography>
            <Button
              size="sm"
              variant="plain"
              color="neutral"
              onClick={() => setSelectedProducts([])}
            >
              Clear selection
            </Button>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button size="sm" color="primary" variant="soft">
              Bulk Edit
            </Button>
            <Button size="sm" color="danger" variant="soft">
              Delete Selected
            </Button>
          </Box>
        </Box>
      )}

      <Box
        sx={{
          width: "100%",
          overflow: "auto",
          "&::-webkit-scrollbar": {
            height: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "var(--joy-palette-neutral-300)",
            borderRadius: "8px",
          },
        }}
      >
        <Table
          hoverRow
          stickyHeader
          sx={{
            "--TableCell-headBackground":
              "var(--joy-palette-background-level1)",
            "--Table-headerUnderlineThickness": "1px",
            "--TableRow-hoverBackground":
              "var(--joy-palette-background-level1)",
            "--TableCell-paddingY": "12px",
            minWidth: 1000, // Ensures table can be scrolled horizontally on small screens
          }}
        >
          <thead>
            <tr>
              <th style={{ width: 50 }}>
                <Checkbox
                  size="sm"
                  onChange={handleSelectAll}
                  checked={
                    selectedProducts.length === products.length &&
                    products.length > 0
                  }
                  indeterminate={
                    selectedProducts.length > 0 &&
                    selectedProducts.length < products.length
                  }
                />
              </th>
              <th style={{ width: 240 }}>Product</th>
              <th style={{ width: 120 }}>Categories</th>
              <th style={{ width: 120 }}>SKU</th>
              <th style={{ width: 120 }}>Status</th>
              <th style={{ width: 100 }}>Stock</th>
              <th style={{ width: 120 }}>Retail Price</th>
              <th style={{ width: 150 }}>Wholesale</th>
              <th style={{ width: 100 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9}>
                  <LinearProgress />
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={9}>
                  <Box sx={{ textAlign: "center", py: 3 }}>
                    <Typography level="body-sm" color="neutral">
                      No products found
                    </Typography>
                    <Button
                      variant="plain"
                      color="primary"
                      startDecorator={<RefreshIcon />}
                      onClick={onRefresh}
                      sx={{ mt: 1 }}
                    >
                      Refresh
                    </Button>
                  </Box>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <Checkbox
                      size="sm"
                      checked={selectedProducts.includes(product.id!)}
                      onChange={() => handleSelectProduct(product.id!)}
                    />
                  </td>
                  <td>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      {product.imageUrls && product.imageUrls.length > 0 ? (
                        <AspectRatio
                          ratio="1"
                          sx={{
                            flexBasis: 50,
                            borderRadius: "sm",
                            overflow: "hidden",
                          }}
                        >
                          <img
                            src={product.imageUrls[0]}
                            alt={product.name}
                            loading="lazy"
                          />
                        </AspectRatio>
                      ) : (
                        <Avatar
                          variant="soft"
                          color="neutral"
                          sx={{ width: 50, height: 50 }}
                        >
                          <InventoryIcon />
                        </Avatar>
                      )}
                      <Box>
                        <Typography level="body-sm" fontWeight="md">
                          {product.name}
                        </Typography>
                        {product.description && (
                          <Typography level="body-xs" color="neutral">
                            {product.description.length > 50
                              ? `${product.description.substring(0, 50)}...`
                              : product.description}
                          </Typography>
                        )}
                        <Typography level="body-xs" color="primary">
                          ID: {product.id}
                        </Typography>
                      </Box>
                    </Box>
                  </td>
                  <td>
                    {product.categories && product.categories.length > 0 ? (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {product.categories.slice(0, 2).map((category) => (
                          <Chip
                            key={category}
                            size="sm"
                            variant="outlined"
                            color="neutral"
                          >
                            {category}
                          </Chip>
                        ))}
                        {product.categories.length > 2 && (
                          <Tooltip
                            title={product.categories.slice(2).join(", ")}
                          >
                            <Chip size="sm" variant="outlined" color="neutral">
                              +{product.categories.length - 2}
                            </Chip>
                          </Tooltip>
                        )}
                      </Box>
                    ) : (
                      <Typography level="body-xs" color="neutral">
                        No categories
                      </Typography>
                    )}
                  </td>
                  <td>
                    <Typography level="body-sm" fontWeight="md">
                      {product.sku || "-"}
                    </Typography>
                  </td>
                  <td>{getProductStatusChip(product.productStatus)}</td>
                  <td>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography level="body-sm" fontWeight="md">
                        {product.quantityInStock}
                      </Typography>
                      {product.minimumStock !== null &&
                        product.minimumStock !== undefined &&
                        (product.quantityInStock <= product.minimumStock ? (
                          <Tooltip
                            title={`Low stock alert! Min: ${product.minimumStock}`}
                          >
                            <Chip size="sm" variant="soft" color="danger">
                              Low
                            </Chip>
                          </Tooltip>
                        ) : (
                          product.quantityInStock <=
                            product.minimumStock * 1.2 && (
                            <Tooltip
                              title={`Stock getting low. Min: ${product.minimumStock}`}
                            >
                              <Chip size="sm" variant="soft" color="warning">
                                Alert
                              </Chip>
                            </Tooltip>
                          )
                        ))}
                    </Box>
                  </td>
                  <td>
                    <Typography level="body-sm" fontWeight="md">
                      {formatCurrency(product.retailPrice)}
                    </Typography>
                  </td>
                  <td>
                    {product.wholesalePrice ? (
                      <Box>
                        <Typography level="body-sm" fontWeight="md">
                          {formatCurrency(product.wholesalePrice)}
                        </Typography>
                        {product.minWholesaleQty && (
                          <Tooltip title="Minimum quantity for wholesale price">
                            <Typography level="body-xs" color="neutral">
                              Min qty: {product.minWholesaleQty}
                            </Typography>
                          </Tooltip>
                        )}
                      </Box>
                    ) : (
                      <Typography level="body-xs" color="neutral">
                        Not available
                      </Typography>
                    )}
                  </td>
                  <td>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="View Details">
                        <IconButton
                          size="sm"
                          variant="soft"
                          color="primary"
                          onClick={() => handleDetail(product.id!)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Product">
                        <IconButton
                          size="sm"
                          variant="soft"
                          color="neutral"
                          onClick={() => handleEdit(product.id!)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Product">
                        <IconButton
                          size="sm"
                          variant="soft"
                          color="danger"
                          onClick={() => confirmDelete(product.id!)}
                          disabled={
                            product.productStatus === ProductStatus.DELETED
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Box>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>
            <WarningIcon />
            Confirm Delete
          </DialogTitle>
          <Divider />
          <DialogContent>
            <Typography level="body-sm">
              Are you sure you want to delete this product?
            </Typography>

            {productToDeleteData && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: "background.level1",
                  borderRadius: "sm",
                }}
              >
                <Typography level="body-sm" fontWeight="md">
                  {productToDeleteData.name}
                </Typography>
                {productToDeleteData.sku && (
                  <Typography level="body-xs" color="neutral">
                    SKU: {productToDeleteData.sku}
                  </Typography>
                )}
                <Typography level="body-xs" color="danger" fontWeight="md">
                  This action cannot be undone.
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setDeleteConfirmOpen(false)}
              disabled={deleteInProgress}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              color="danger"
              onClick={handleDeleteConfirmed}
              loading={deleteInProgress}
            >
              Delete
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}

export default function ProductsDashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

  // Redux state
  const { loading, products, pagination, error } = useSelector(
    (state: RootState) => state.product
  );
  const { categories } = useSelector((state: RootState) => state.category);

  // Pagination state
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  // Filter state
  const [filters, setFilters] = React.useState<ProductFilters>({
    page,
    pageSize,
    search: "",
    status: "all",
    stockLevel: "all",
    category: "all",
    priceMin: null,
    priceMax: null,
    sortBy: "id",
    sortOrder: "desc",
  });

  // UI state
  const [showFilters, setShowFilters] = React.useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false);
  const [isDirty, setIsDirty] = React.useState(false);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = React.useState(filters.search);

  // Apply debounce to search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.search]);

  // Handle search change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: event.target.value }));
    setIsDirty(true);
  };

  // Handle filter changes
  const handleFilterChange = (field: keyof ProductFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);

    // If changing filters, go back to page 1
    if (field !== "search") {
      setPage(1);
    }
  };

  // Handle page size change
  const handlePageSizeChange = (
    event: React.SyntheticEvent | null,
    value: string | null
  ) => {
    if (value) {
      setPageSize(parseInt(value));
      setPage(1); // Reset to page 1 when changing page size
    }
  };

  // Apply filters to fetch data
  const applyFilters = () => {
    // Construct API query parameters
    dispatch(
      fetchAllProducts({
        page,
        pageSize,
        search: debouncedSearch,
        status: filters.status !== "all" ? filters.status : undefined,
        category: filters.category !== "all" ? filters.category : undefined,
        stockLevel:
          filters.stockLevel !== "all" ? filters.stockLevel : undefined,
        priceMin: filters.priceMin || undefined,
        priceMax: filters.priceMax || undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      })
    );
    setIsDirty(false);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      page: 1,
      pageSize: 10,
      search: "",
      status: "all",
      stockLevel: "all",
      category: "all",
      priceMin: null,
      priceMax: null,
      sortBy: "id",
      sortOrder: "desc",
    });
    setPage(1);
    setIsDirty(true);
  };

  // Fetch products when page, pageSize or debouncedSearch changes
  React.useEffect(() => {
    applyFilters();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, page, pageSize, debouncedSearch]);

  // Fetch categories on component mount
  React.useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Calculate total pages
  const totalPages = React.useMemo(() => {
    return pagination?.total
      ? Math.ceil(pagination?.total / pageSize)
      : 1;
  }, [pagination?.total, pageSize]);

  return (
    <DashboardLayout title="Product Management">
      {error && (
        <Alert color="danger" startDecorator={<ErrorIcon />} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          mb: 2,
          gap: 2,
        }}
      >
        {/* Search and basic filters */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexGrow: 1,
            flexWrap: { xs: "wrap", md: "nowrap" },
          }}
        >
          <Input
            startDecorator={<SearchRoundedIcon />}
            placeholder="Search products by name, SKU, or description..."
            value={filters.search}
            onChange={handleSearchChange}
            sx={{ flexGrow: 1, minWidth: { xs: "100%", sm: 200 } }}
            endDecorator={
              filters.search ? (
                <IconButton
                  variant="plain"
                  color="neutral"
                  onClick={() => handleFilterChange("search", "")}
                  size="sm"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              ) : null
            }
          />

          <Button
            variant="outlined"
            color="neutral"
            startDecorator={<FilterListIcon />}
            onClick={() => setShowFilters(!showFilters)}
            size="sm"
            sx={{ display: { xs: "flex", md: "none" } }}
          >
            Filters
          </Button>

          {/* Basic filters - always visible on desktop, toggleable on mobile */}
          <Box
            sx={{
              display: { xs: showFilters ? "flex" : "none", md: "flex" },
              gap: 1,
              flexWrap: "wrap",
              width: { xs: "100%", md: "auto" },
            }}
          >
            <FormControl size="sm" sx={{ minWidth: 120 }}>
              <Select
                value={filters.status}
                onChange={(e, val) => handleFilterChange("status", val)}
                size="sm"
                placeholder="Status"
                startDecorator={
                  <Typography level="body-xs" sx={{ mr: 0.5 }}>
                    Status:
                  </Typography>
                }
              >
                <Option value="all">All Statuses</Option>
                {Object.values(ProductStatus).map((status) => (
                  <Option key={status} value={status}>
                    {status.replace(/_/g, " ")}
                  </Option>
                ))}
              </Select>
            </FormControl>

            <FormControl size="sm" sx={{ minWidth: 120 }}>
              <Select
                value={filters.stockLevel}
                onChange={(e, val) => handleFilterChange("stockLevel", val)}
                size="sm"
                placeholder="Stock"
                startDecorator={
                  <Typography level="body-xs" sx={{ mr: 0.5 }}>
                    Stock:
                  </Typography>
                }
              >
                <Option value="all">All Stock</Option>
                <Option value="in">In Stock</Option>
                <Option value="low">Low Stock</Option>
                <Option value="out">Out of Stock</Option>
              </Select>
            </FormControl>

            <FormControl size="sm" sx={{ minWidth: 120 }}>
              <Select
                value={filters.category}
                onChange={(e, val) => handleFilterChange("category", val)}
                size="sm"
                placeholder="Category"
                startDecorator={
                  <Typography level="body-xs" sx={{ mr: 0.5 }}>
                    Category:
                  </Typography>
                }
              >
                <Option value="all">All Categories</Option>
                {categories.map((category) => (
                  <Option key={category.id} value={category.name}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </FormControl>

            {/* Advanced Filters Toggle */}
            <Button
              size="sm"
              variant="plain"
              color="neutral"
              endDecorator={<KeyboardArrowDownIcon />}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              {showAdvancedFilters ? "Less filters" : "More filters"}
            </Button>
          </Box>
        </Box>

        {/* Action buttons */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          {isDirty && (
            <Button
              size="sm"
              variant="soft"
              color="primary"
              onClick={applyFilters}
            >
              Apply Filters
            </Button>
          )}
          <Button
            variant="outlined"
            color="neutral"
            startDecorator={<DownloadIcon />}
            size="sm"
            sx={{ display: { xs: "none", sm: "flex" } }}
          >
            Export
          </Button>

          <Button
            variant="solid"
            startDecorator={<AddIcon />}
            onClick={() => navigate(currentPath + "/add")}
          >
            Add Product
          </Button>
        </Box>
      </Box>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <Sheet
          variant="outlined"
          sx={{
            p: 2,
            mb: 2,
            borderRadius: "md",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Typography level="body-sm" fontWeight="md">
            Advanced Filters
          </Typography>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", flex: 1 }}>
            {/* Price Range */}
            <FormControl size="sm" sx={{ minWidth: 100 }}>
              <FormLabel>Min Price</FormLabel>
              <Input
                type="number"
                value={filters.priceMin || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "priceMin",
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
                placeholder="Min"
                startDecorator="Rp"
                slotProps={{ input: { min: 0 } }}
              />
            </FormControl>

            <FormControl size="sm" sx={{ minWidth: 100 }}>
              <FormLabel>Max Price</FormLabel>
              <Input
                type="number"
                value={filters.priceMax || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "priceMax",
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
                placeholder="Max"
                startDecorator="Rp"
                slotProps={{ input: { min: 0 } }}
              />
            </FormControl>

            {/* Sort By */}
            <FormControl size="sm" sx={{ minWidth: 120 }}>
              <FormLabel>Sort By</FormLabel>
              <Select
                value={filters.sortBy}
                onChange={(e, val) => handleFilterChange("sortBy", val)}
                size="sm"
                startDecorator={<SortIcon />}
              >
                <Option value="id">ID</Option>
                <Option value="name">Name</Option>
                <Option value="retailPrice">Price</Option>
                <Option value="quantityInStock">Stock</Option>
                <Option value="createdAt">Date Added</Option>
              </Select>
            </FormControl>

            <FormControl size="sm" sx={{ minWidth: 120 }}>
              <FormLabel>Sort Order</FormLabel>
              <Select
                value={filters.sortOrder}
                onChange={(e, val) =>
                  handleFilterChange("sortOrder", val as "asc" | "desc")
                }
                size="sm"
              >
                <Option value="asc">Ascending</Option>
                <Option value="desc">Descending</Option>
              </Select>
            </FormControl>
          </Box>

          <Button
            variant="plain"
            color="neutral"
            onClick={resetFilters}
            size="sm"
          >
            Reset All
          </Button>
        </Sheet>
      )}

      <Sheet
        variant="outlined"
        sx={{
          borderRadius: "md",
          overflow: "auto",
          "& tr:last-child td": {
            borderBottom: 0,
          },
        }}
      >
        <ProductsTable
          products={products}
          onRefresh={applyFilters}
          loading={loading}
        />
      </Sheet>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
          flexDirection: { xs: "column", sm: "row" },
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
            flexDirection: { xs: "column", sm: "row" },
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography level="body-sm">
              Showing {products.length} of {pagination?.total || 0}{" "}
              products
            </Typography>

            <FormControl size="sm" sx={{ minWidth: 80 }}>
              <Select
                value={pageSize.toString()}
                onChange={handlePageSizeChange}
                size="sm"
              >
                <Option value="10">10</Option>
                <Option value="25">25</Option>
                <Option value="50">50</Option>
                <Option value="100">100</Option>
              </Select>
            </FormControl>

            <Typography level="body-sm">per page</Typography>
          </Box>

          <CustomPagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            size="sm"
          />
        </Box>
      </Box>
    </DashboardLayout>
  );
}
