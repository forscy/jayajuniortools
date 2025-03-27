// src/pages/products/ProductsDashboard.tsx
import * as React from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import IconButton from "@mui/joy/IconButton";
import Chip from "@mui/joy/Chip";
import Tooltip from "@mui/joy/Tooltip";
import CircularProgress from "@mui/joy/CircularProgress";

// Icons
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from '@mui/icons-material/Visibility';


// Components and Types
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { fetchProducts } from "../../redux/slices/productSlice";
import { useAppDispatch } from "../../redux/hooks";
import { ProductDTO } from "../../dto/ProductDTO";

function ProductsTable({ products }: { products: ProductDTO[] }) {
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

  const handleEdit = (productId: number) => {
    navigate(currentPath + `/edit/${productId}`);
  };

  const handleDelete = (productId: number) => {
    console.log("Delete product:", productId);
    // Implement delete functionality here
  };

  const handleDetail = (productId: number) => {
    navigate(`/products/${productId}`);
  }

  return (
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
          "--TableCell-headBackground": "var(--joy-palette-background-level1)",
          "--Table-headerUnderlineThickness": "1px",
          "--TableRow-hoverBackground": "var(--joy-palette-background-level1)",
          "--TableCell-paddingY": "12px",
          minWidth: 1000, // Ensures table can be scrolled horizontally on small screens
        }}
      >
        <thead>
          <tr>
            <th style={{ width: 50 }}>ID</th>
            <th style={{ width: 250 }}>Product</th>
            <th style={{ width: 120 }}>Brand</th>
            <th style={{ width: 120 }}>SKU</th>
            <th style={{ width: 100 }}>Stock</th>
            <th style={{ width: 120 }}>Price (Retail)</th>
            <th style={{ width: 150 }}>Price (Wholesale)</th>
            <th style={{ width: 100 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
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
                  </Box>
                </Box>
              </td>
              <td>{product.brand?.name}</td>
              <td>{product.sku}</td>
              <td>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography>{product?.quantityInStock}</Typography>
                  {product &&
                    product.quantityInStock <=
                      product.minimumStock! && (
                      <Chip size="sm" variant="soft" color="danger">
                        Low
                      </Chip>
                    )}
                </Box>
              </td>
              <td>${product.retailPrice.toFixed(2)}</td>
              <td>${product.wholesalePrice?.toFixed(2)}</td>
              <td>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Tooltip title="Detail">
                    <IconButton
                      size="sm"
                      variant="soft"
                      color="neutral"
                      onClick={() => handleDetail(product.id!)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton
                      size="sm"
                      variant="soft"
                      color="neutral"
                      onClick={() => handleEdit(product.id!)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="sm"
                      variant="soft"
                      color="danger"
                      onClick={() => handleDelete(product.id!)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Box>
  );
}

export default function ProductsDashboard() {
  const dispatch = useAppDispatch();
  const currentPath = window.location.pathname;

  const { loading, products } = useSelector(
    (state: RootState) => state.product
  );

  const [searchQuery, setSearchQuery] = React.useState("");
  const navigate = useNavigate();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Fetch products
  React.useEffect(() => {
    dispatch(
      fetchProducts({
        page: 1,
        pageSize: 10,
      })
    );
  }, [dispatch]);

  return (
    <DashboardLayout title="Product Management">
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
        <Input
          startDecorator={<SearchRoundedIcon />}
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearch}
          sx={{ width: { xs: "100%", sm: 300 } }}
        />
        <Button
          startDecorator={<AddIcon />}
          onClick={() => navigate(currentPath + "/add")}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          Add Product
        </Button>
      </Box>

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
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <ProductsTable products={products} />
        )}
      </Sheet>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Typography level="body-sm">
          Showing {products.length} of {products.length} products
        </Typography>
      </Box>
    </DashboardLayout>
  );
}
