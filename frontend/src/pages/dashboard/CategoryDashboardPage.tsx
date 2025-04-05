import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Sheet,
  Table,
  Tooltip,
  Typography,
  Modal,
  ModalDialog,
  ModalClose,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Stack,
  Alert,
} from "@mui/joy";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
// Icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { CategoryDTO } from "../../dto/category.dto";
import { useAppDispatch } from "../../redux/hooks";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  createCategory,
  fetchCategories,
  deleteCategory,
} from "../../redux/slices/categorySlice";

// Add Category Modal Component
function AddCategoryModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const { loading, error } = useSelector((state: RootState) => state.category);
  const [success, setSuccess] = useState(false);

  const [categoryData, setCategoryData] = useState({
    name: "",
    description: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCategoryData({
      ...categoryData,
      [name]: value,
    });

    // Clear validation error when user types
    if (name === "name" && formErrors.name) {
      setFormErrors({
        ...formErrors,
        name: "",
      });
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = { ...formErrors };

    if (!categoryData.name.trim()) {
      newErrors.name = "Category name is required";
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const resultAction = await dispatch(createCategory(categoryData));

    if (createCategory.fulfilled.match(resultAction)) {
      setSuccess(true);
      // Reset form
      setCategoryData({
        name: "",
        description: "",
      });

      // Close modal after delay
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    }
  };

  // Reset state when modal is closed
  useEffect(() => {
    if (!open) {
      setCategoryData({
        name: "",
        description: "",
      });
      setFormErrors({
        name: "",
      });
      setSuccess(false);
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog aria-labelledby="add-category-modal" size="md">
        <ModalClose />
        <Typography id="add-category-modal" level="h4" mb={2}>
          Add New Category
        </Typography>
        <Divider />

        {error && (
          <Alert color="danger" startDecorator={<ErrorIcon />} sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            color="success"
            startDecorator={<CheckCircleIcon />}
            sx={{ mt: 2 }}
          >
            Category created successfully!
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={2} sx={{ mt: 3 }}>
            <FormControl error={!!formErrors.name}>
              <FormLabel>Category Name *</FormLabel>
              <Input
                name="name"
                value={categoryData.name}
                onChange={handleInputChange}
                placeholder="Enter category name"
                autoFocus
              />
              {formErrors.name && (
                <Typography level="body-xs" color="danger">
                  {formErrors.name}
                </Typography>
              )}
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                value={categoryData.description}
                onChange={handleInputChange}
                placeholder="Enter category description (optional)"
                minRows={3}
                maxRows={6}
              />
            </FormControl>

            <Box
              sx={{
                display: "flex",
                gap: 1,
                justifyContent: "flex-end",
                mt: 2,
              }}
            >
              <Button
                variant="plain"
                color="neutral"
                onClick={onClose}
                disabled={loading || success}
              >
                Cancel
              </Button>
              <Button type="submit" loading={loading} disabled={success}>
                Add Category
              </Button>
            </Box>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  );
}

// Categories Table Component
function CategoriesTable({ categories }: { categories: CategoryDTO[] }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentPath = window.location.pathname;
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryDTO | null>(
    null
  );

  const handleEdit = (categoryId: number) => {
    navigate(`${currentPath}/edit/${categoryId}`);
  };

  const handleDelete = (category: CategoryDTO) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (categoryToDelete?.name) {
      await dispatch(deleteCategory(categoryToDelete.name));
      setDeleteModalOpen(false);
    }
  };

  return (
    <>
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
            minWidth: 800,
          }}
        >
          <thead>
            <tr>
              <th style={{ width: 80 }}>ID</th>
              <th style={{ width: 250 }}>Name</th>
              <th>Description</th>
              <th style={{ width: 120 }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>
                  <Typography level="body-sm" fontWeight="md">
                    {category.name}
                  </Typography>
                </td>
                <td>
                  <Typography level="body-xs" color="neutral">
                    {category.description
                      ? category.description.length > 100
                        ? `${category.description.substring(0, 100)}...`
                        : category.description
                      : "—"}
                  </Typography>
                </td>
                <td>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Tooltip title="Edit">
                      <IconButton
                        size="sm"
                        variant="soft"
                        color="neutral"
                        onClick={() => handleEdit(category.id!)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="sm"
                        variant="soft"
                        color="danger"
                        onClick={() => handleDelete(category)}
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

      {/* Delete Confirmation Modal */}
      <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <Typography level="h4" color="danger">
            Confirm Deletion
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography level="body-md">
            Are you sure you want to delete the category "
            {categoryToDelete?.name}"? This action cannot be undone.
          </Typography>
          <Box
            sx={{ display: "flex", gap: 1, justifyContent: "flex-end", mt: 2 }}
          >
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="solid" color="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </>
  );
}

export default function CategoryDashboardPage() {
  const dispatch = useAppDispatch();
  const [addModalOpen, setAddModalOpen] = useState(false);

  const { loading, categories } = useSelector(
    (state: RootState) => state.category
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <DashboardLayout title="Category Management">
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
        <Button
          startDecorator={<AddIcon />}
          onClick={() => setAddModalOpen(true)}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          Add Category
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
        {loading && categories.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <CategoriesTable categories={categories} />
        )}
      </Sheet>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Typography level="body-sm">
          Showing {categories.length} of {categories.length} categories
        </Typography>
      </Box>

      {/* Add Category Modal */}
      <AddCategoryModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />
    </DashboardLayout>
  );
}
