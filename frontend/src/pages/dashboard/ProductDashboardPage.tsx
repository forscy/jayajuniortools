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

// Components and Types
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Product } from "../../types";
import { mockProducts } from "../../mock/mockData";


function ProductsTable({ products }: { products: Product[] }) {
  const navigate = useNavigate();
  
  const handleEdit = (productId: number) => {
    navigate(`/products/edit/${productId}`);
  };
  
  const handleDelete = (productId: number) => {
    console.log("Delete product:", productId);
    // Implement delete functionality here
  };

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
                  <Typography>{product.inventory?.quantityInStock}</Typography>
                  {product.inventory &&
                    product.inventory.quantityInStock <=
                      product.inventory.minimumStock && (
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
                  <Tooltip title="Edit">
                    <IconButton 
                      size="sm" 
                      variant="soft" 
                      color="neutral"
                      onClick={() => handleEdit(product.id)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton 
                      size="sm" 
                      variant="soft" 
                      color="danger"
                      onClick={() => handleDelete(product.id)}
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
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();

  const filteredProducts = mockProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

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
          onClick={() => navigate("/products/add")}
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
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <ProductsTable products={filteredProducts} />
        )}
      </Sheet>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Typography level="body-sm">
          Showing {filteredProducts.length} of {mockProducts.length} products
        </Typography>
      </Box>
    </DashboardLayout>
  );
}