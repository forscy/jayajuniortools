import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Typography,
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
  Modal,
  ModalDialog,
  ModalClose,
  FormControl,
  FormLabel,
  Select,
  Option,
  Autocomplete,
  AutocompleteOption,
  ListItemContent,
  ListItemDecorator,
  Avatar,
  Badge,
  Tooltip,
  Alert,
  CircularProgress,
  Snackbar,
  Table,
} from "@mui/joy";

// DTOs
import { ProductDTO, ProductStatus, DiscountType } from "../dto/product.dto";
import { OrderDTO, OrderStatus } from "../dto/order.dto";
import { PaymentDTO, PaymentStatus, PaymentMethod } from "../dto/payment.dto";
import { UserDTO, Role } from "../dto/user.dto";

// Icons
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import PersonIcon from "@mui/icons-material/Person";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import InventoryIcon from "@mui/icons-material/Inventory";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PaymentIcon from "@mui/icons-material/Payment";
import HistoryIcon from "@mui/icons-material/History";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BarcodeReaderIcon from "@mui/icons-material/QrCodeScanner";
import PaymentsIcon from "@mui/icons-material/Payments";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PrintIcon from "@mui/icons-material/Print";
import InfoIcon from "@mui/icons-material/Info";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import ErrorIcon from "@mui/icons-material/Error";
import SaveIcon from "@mui/icons-material/Save";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import CloseIcon from "@mui/icons-material/Close";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MoneyIcon from "@mui/icons-material/Money";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import TableRowsIcon from "@mui/icons-material/TableRows";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchProducts } from "../redux/slices/productSlice";
import { createOrder, fetchOrders } from "../redux/slices/orderSlice";
import {
  createPayment,
  fetchPayments,
  pay,
} from "../redux/slices/paymentSlice";
import { fetchUsers } from "../redux/slices/userSlice";

// Local Storage Keys
const STORAGE_KEYS = {
  CART: "jjt_pos_cart",
};

// Utility functions for local storage
const StorageUtils = {
  saveCart: (cart: CartItem[], customerId?: number | null) => {
    try {
      const data = { cart, customerId, timestamp: Date.now() };
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error("Error saving cart to localStorage", e);
      return false;
    }
  },

  loadCart: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CART);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error("Error loading cart from localStorage", e);
      return null;
    }
  },

  clearCart: () => {
    localStorage.removeItem(STORAGE_KEYS.CART);
  },
};

// Define cart item type
interface CartItem {
  product: ProductDTO;
  quantity: number;
  price: number;
  total: number;
}

// Helper Components
const CartItemComponent = ({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: {
  item: CartItem;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}) => {
  const hasDiscount = item.product.discount && item.product.discount.isActive;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        p: 1,
        borderRadius: "md",
        mb: 1,
        bgcolor: "background.surface",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          mr: 1.5,
          borderRadius: "sm",
          overflow: "hidden",
        }}
      >
        {item.product.imageUrls && item.product.imageUrls.length > 0 ? (
          <img
            src={item.product.imageUrls[0]}
            alt={item.product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Sheet
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "primary.100",
              color: "primary.700",
            }}
          >
            <InventoryIcon fontSize="small" />
          </Sheet>
        )}
      </Box>

      <Box sx={{ flex: 1, mr: 1, overflow: "hidden" }}>
        <Typography level="title-sm" noWrap>
          {item.product.name}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            level="body-xs"
            color={hasDiscount ? "danger" : "primary"}
          >
            Rp {item.price.toLocaleString("id-ID")}
          </Typography>
          {hasDiscount && (
            <Typography
              level="body-xs"
              sx={{ textDecoration: "line-through", color: "text.tertiary" }}
            >
              Rp {item.product.retailPrice.toLocaleString("id-ID")}
            </Typography>
          )}
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
        <IconButton
          size="sm"
          variant="soft"
          color="neutral"
          disabled={item.quantity <= 1}
          onClick={onDecrease}
        >
          <RemoveIcon fontSize="small" />
        </IconButton>
        <Typography sx={{ width: 40, textAlign: "center" }}>
          {item.quantity}
        </Typography>
        <IconButton
          size="sm"
          variant="soft"
          color="neutral"
          disabled={item.quantity >= (item.product.quantityInStock || 0)}
          onClick={onIncrease}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>

      <Typography level="body-sm" sx={{ width: 90, textAlign: "right", mr: 1 }}>
        Rp {item.total.toLocaleString("id-ID")}
      </Typography>

      <IconButton size="sm" color="danger" variant="soft" onClick={onRemove}>
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

const ProductCard = ({
  product,
  onAddToCart,
}: {
  product: ProductDTO;
  onAddToCart: (product: ProductDTO) => void;
}) => {
  const hasDiscount = product.discount && product.discount.isActive;
  const displayPrice = hasDiscount
    ? product.retailPrice * (1 - (product.discount?.discountValue || 0) / 100)
    : product.retailPrice;

  const isLowStock =
    (product.quantityInStock || 0) <= (product.minimumStock || 5);
  const isOutOfStock = (product.quantityInStock || 0) <= 0;

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {hasDiscount && (
        <Chip
          size="sm"
          color="danger"
          variant="solid"
          sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}
        >
          {product.discount?.discountValue}% OFF
        </Chip>
      )}

      {isOutOfStock && (
        <Sheet
          variant="solid"
          color="danger"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.85,
            zIndex: 2,
          }}
        >
          <Typography level="title-lg" textColor="white" fontWeight="bold">
            Stok Habis
          </Typography>
        </Sheet>
      )}

      <AspectRatio ratio="1" sx={{ width: "100%" }}>
        {product.imageUrls && product.imageUrls.length > 0 ? (
          <img src={product.imageUrls[0]} alt={product.name} />
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "neutral.100",
            }}
          >
            <InventoryIcon sx={{ fontSize: 40, color: "neutral.500" }} />
          </Box>
        )}
      </AspectRatio>

      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Box sx={{ mb: 0.5 }}>
          {product.brand && (
            <Chip size="sm" variant="soft" color="primary" sx={{ mb: 0.5 }}>
              {product.brand.name}
            </Chip>
          )}
        </Box>

        <Typography
          level="title-sm"
          sx={{
            mb: 0.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {product.name}
        </Typography>

        {isLowStock && !isOutOfStock && (
          <Chip size="sm" color="warning" variant="soft" sx={{ mb: 0.5 }}>
            Sisa {product.quantityInStock}
          </Chip>
        )}

        <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mb: 1 }}>
          <Typography
            level="body-md"
            fontWeight="bold"
            color={hasDiscount ? "danger" : "primary"}
          >
            Rp {displayPrice.toLocaleString("id-ID")}
          </Typography>
          {hasDiscount && (
            <Typography
              level="body-xs"
              sx={{ textDecoration: "line-through", color: "text.tertiary" }}
            >
              Rp {product.retailPrice.toLocaleString("id-ID")}
            </Typography>
          )}
        </Box>

        <Button
          variant="soft"
          color="primary"
          startDecorator={<AddShoppingCartIcon />}
          disabled={isOutOfStock}
          onClick={() => onAddToCart(product)}
          sx={{ mt: "auto" }}
        >
          {isOutOfStock ? "Stok Habis" : "Tambah"}
        </Button>
      </CardContent>
    </Card>
  );
};

// Main Transaction Page Component
const TransactionPage = () => {
  const dispatch = useAppDispatch();
  const { products, loading: productsLoading } = useAppSelector(
    (state) => state.product
  );
  const { orders, loading: ordersLoading } = useAppSelector(
    (state) => state.order
  );
  const { users, loading: usersLoading } = useAppSelector(
    (state) => state.user
  );
  const { payments, loading: paymentsLoading } = useAppSelector(
    (state) => state.payment
  );

  // States
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<ProductDTO[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<UserDTO | null>(
    null
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.CASH
  );
  const [orderSuccessModalOpen, setOrderSuccessModalOpen] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [barcodeModalOpen, setBarcodeModalOpen] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarColor, setSnackbarColor] = useState<
    "success" | "danger" | "warning" | "neutral"
  >("neutral");
  const [currentView, setCurrentView] = useState<"products" | "orders">(
    "products"
  );
  const [selectedOrder, setSelectedOrder] = useState<OrderDTO | null>(null);
  const [orderDetailsModalOpen, setOrderDetailsModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentProofModalOpen, setPaymentProofModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentDTO | null>(
    null
  );
  const [paymentProof, setPaymentProof] = useState<File | null>(null);

  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const total = subtotal;

  // Load data on initial render
  useEffect(() => {
    dispatch(fetchProducts({}));
    dispatch(fetchOrders({}));
    dispatch(fetchUsers({}));
    dispatch(fetchPayments({}));

    // Load cart from localStorage
    const savedData = StorageUtils.loadCart();
    if (savedData && savedData.cart && savedData.cart.length > 0) {
      setCart(savedData.cart);
      setHasChanges(true);

      // If there was a customer selected and users are loaded
      if (savedData.customerId && users && users.length > 0) {
        const customer = users.find((c) => c.id === savedData.customerId);
        if (customer) {
          setSelectedCustomer(customer);
        }
      }
    }
  }, [dispatch]);

  // When users are loaded, check if we need to set the selected customer from localStorage
  useEffect(() => {
    if (!usersLoading && users && users.length > 0) {
      const savedData = StorageUtils.loadCart();
      if (savedData && savedData.customerId) {
        const customer = users.find((c) => c.id === savedData.customerId);
        if (customer) {
          setSelectedCustomer(customer);
        }
      }
    }
  }, [users, usersLoading]);

  // Update filtered products when products change
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  // Auto-save cart to localStorage when it changes
  useEffect(() => {
    if (cart.length > 0 || hasChanges) {
      const success = StorageUtils.saveCart(cart, selectedCustomer?.id);
      if (success) {
        setHasChanges(true);
      }
    }
  }, [cart, hasChanges, selectedCustomer]);

  // Effect to compile unique categories from products
  useEffect(() => {
    const allCategories = products
      .flatMap((product) => product.categories || [])
      .filter((category): category is string => Boolean(category));

    const uniqueCategories = Array.from(new Set(allCategories));
    setCategories(uniqueCategories);
  }, [products]);

  // Effect to filter products based on search and category
  useEffect(() => {
    let result = [...products];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          (product.sku && product.sku.toLowerCase().includes(query)) ||
          (product.brand && product.brand.name.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (activeCategory) {
      result = result.filter((product) =>
        product.categories?.includes(activeCategory)
      );
    }

    setFilteredProducts(result);
  }, [products, searchQuery, activeCategory]);

  // Effect to focus barcode input when modal opens
  useEffect(() => {
    if (barcodeModalOpen && barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, [barcodeModalOpen]);

  // Show snackbar message helper
  const showSnackbar = (
    message: string,
    color: "success" | "danger" | "warning" | "neutral" = "neutral"
  ) => {
    setSnackbarMessage(message);
    setSnackbarColor(color);
    setSnackbarOpen(true);
  };

  // Cart Handlers
  const addToCart = useCallback(
    (product: ProductDTO) => {
      // Check if product already exists in cart
      const existingItemIndex = cart.findIndex(
        (item) => item.product.id === product.id
      );

      if (existingItemIndex >= 0) {
        // Update quantity if already in cart
        const updatedCart = [...cart];
        const item = updatedCart[existingItemIndex];

        // Check if adding more would exceed stock
        if (item.quantity >= (product.quantityInStock || 0)) {
          showSnackbar("Stok produk tidak mencukupi", "warning");
          return; // Don't add more than available stock
        }

        item.quantity += 1;
        item.total = item.price * item.quantity;

        setCart(updatedCart);
      } else {
        // Add new item to cart
        const price = product.discount?.isActive
          ? product.retailPrice *
            (1 - (product.discount.discountValue || 0) / 100)
          : product.retailPrice;

        setCart([
          ...cart,
          {
            product,
            quantity: 1,
            price,
            total: price,
          },
        ]);
      }

      setHasChanges(true);
    },
    [cart]
  );

  const increaseQuantity = (index: number) => {
    const updatedCart = [...cart];
    const item = updatedCart[index];

    // Check if increasing would exceed stock
    if (item.quantity >= (item.product.quantityInStock || 0)) {
      showSnackbar("Stok produk tidak mencukupi", "warning");
      return; // Don't add more than available stock
    }

    item.quantity += 1;
    item.total = item.price * item.quantity;

    setCart(updatedCart);
    setHasChanges(true);
  };

  const decreaseQuantity = (index: number) => {
    const updatedCart = [...cart];
    const item = updatedCart[index];

    if (item.quantity > 1) {
      item.quantity -= 1;
      item.total = item.price * item.quantity;
      setCart(updatedCart);
      setHasChanges(true);
    }
  };

  const removeFromCart = (index: number) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
    setHasChanges(true);
  };

  const clearCart = () => {
    setCart([]);
    setSelectedCustomer(null);
    StorageUtils.clearCart();
    setHasChanges(false);
  };

  // Create Order handler
  const handleCreateOrder = () => {
    if (cart.length === 0) {
      showSnackbar(
        "Keranjang kosong. Tambahkan produk terlebih dahulu.",
        "warning"
      );
      return;
    }

    // Prepare order data
    const orderData = {
      items: cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.total,
      })),
      totalAmount: total,
      userId: selectedCustomer?.id || null,
      status: OrderStatus.PENDING,
    };

    console.info("Order data user: " + orderData.userId);

    dispatch(
      createOrder({
        items: orderData.items.map((item) => ({
          productId: item.productId!,
          quantity: item.quantity,
        })),
        userId: orderData.userId || 1,
      })
    )
      .unwrap()
      .then((createdOrder) => {
        // Handle successful order creation
        setCreatedOrderId(createdOrder.id);
        setOrderNumber(`INV-${createdOrder.id}`);
        setOrderSuccessModalOpen(true);

        // Clear cart
        clearCart();

        // Refresh orders list
        dispatch(fetchOrders({}));

        showSnackbar("Pesanan berhasil dibuat", "success");
      })
      .catch((error) => {
        console.error("Error creating order:", error);
        showSnackbar("Gagal membuat pesanan. Silakan coba lagi.", "danger");
      });
  };

  // Create Payment handler
  const handleCreatePayment = (orderId: number) => {
    const foundOrder = orders?.find((order) => order.id === orderId);
    if (foundOrder) {
      setSelectedOrder(foundOrder);
      setPaymentModalOpen(true);
    } else {
      showSnackbar("Pesanan tidak ditemukan", "danger");
    }
  };

  // Submit payment
  const submitPayment = () => {
    if (!selectedOrder) return;

    const paymentData = {
      orderId: selectedOrder.id,
      amount: selectedOrder.totalAmount,
      paymentMethod: paymentMethod,
      status: PaymentStatus.PENDING,
    };

    dispatch(
      createPayment({
        orderId: paymentData.orderId,
        receiverId: 1,
      })
    )
      .unwrap()
      .then(() => {
        showSnackbar("Pembayaran berhasil dibuat", "success");
        setPaymentModalOpen(false);
        dispatch(fetchPayments({}));
        dispatch(fetchOrders({}));
      })
      .catch((error) => {
        console.error("Error creating payment:", error);
        showSnackbar("Gagal membuat pembayaran", "danger");
      });
  };

  // Open payment proof modal
  const openPaymentProofModal = (payment: PaymentDTO) => {
    setSelectedPayment(payment);
    setPaymentProofModalOpen(true);
  };

  // Submit payment proof update
  const handleUpdatePaymentStatus = () => {
    if (!selectedPayment) return;

    // Here you would normally upload the proof file first
    // Then update the payment status

    dispatch(
      pay({
        paymentId: selectedPayment.id,
        amountPaid: selectedPayment.amount,
      })
    )
      .unwrap()
      .then(() => {
        showSnackbar("Status pembayaran berhasil diperbarui", "success");
        setPaymentProofModalOpen(false);
        setPaymentProof(null);

        // Refresh data
        dispatch(fetchPayments({}));
        dispatch(fetchOrders({}));
      })
      .catch((error) => {
        console.error("Error updating payment status:", error);
        showSnackbar("Gagal memperbarui status pembayaran", "danger");
      });
  };

  // Barcode handling
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!scannedBarcode) return;

    // Search for product by barcode/SKU
    const foundProduct = products.find((p) => p.sku === scannedBarcode);

    if (foundProduct) {
      addToCart(foundProduct);
      setBarcodeModalOpen(false);
      setScannedBarcode("");
    } else {
      showSnackbar(
        `Produk dengan kode ${scannedBarcode} tidak ditemukan`,
        "danger"
      );
    }
  };

  // Format date helper
  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Payment status helper
  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.COMPLETED:
        return "success";
      case PaymentStatus.PENDING:
        return "warning";
      case PaymentStatus.FAILED:
        return "danger";
      default:
        return "neutral";
    }
  };

  // Order status helper
  const getOrderStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.COMPLETED:
        return "success";
      case OrderStatus.PENDING:
        return "warning";
      case OrderStatus.CANCELLED:
        return "danger";
      case OrderStatus.READY_FOR_PICKUP:
        return "primary";
      default:
        return "neutral";
    }
  };

  // Utility function to get payment for order - moved outside the slice
  const getPaymentForOrder = (orderId: number) => {
    console.info("Inih ", payments);
    return payments.find((payment) => payment.orderId === orderId);
  };

  // View order details
  const viewOrderDetails = (order: OrderDTO) => {
    setSelectedOrder(order);
    setOrderDetailsModalOpen(true);
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentProof(e.target.files[0]);
    }
  };

  // Toggle between products and orders view
  const toggleView = (view: "products" | "orders") => {
    setCurrentView(view);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Header */}
      <Sheet
        variant="solid"
        color="primary"
        sx={{ p: 2, display: "flex", alignItems: "center" }}
      >
        <Typography level="h4" sx={{ mr: 2, color: "white" }}>
          <PointOfSaleIcon sx={{ mr: 1, verticalAlign: "text-bottom" }} />
          Jaya Junior Tools POS
        </Typography>

        <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
          <Button
            variant={currentView === "products" ? "solid" : "soft"}
            color="neutral"
            startDecorator={<ShoppingCartIcon />}
            onClick={() => toggleView("products")}
            size="sm"
          >
            Produk
          </Button>

          <Button
            variant={currentView === "orders" ? "solid" : "soft"}
            color="neutral"
            startDecorator={<TableRowsIcon />}
            onClick={() => toggleView("orders")}
            size="sm"
          >
            Pesanan
          </Button>

          <IconButton variant="soft" color="neutral" size="sm">
            <AccountCircleIcon />
          </IconButton>
        </Box>
      </Sheet>

      {/* Main Content */}
      {currentView === "products" ? (
        <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Products Section (Left) */}
          <Box
            sx={{
              width: { xs: "100%", md: "60%" },
              p: 2,
              overflow: "auto",
              display: { xs: cart.length > 0 ? "none" : "block", md: "block" },
            }}
          >
            {/* Search and Filter */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <Input
                  startDecorator={<SearchIcon />}
                  placeholder="Cari produk, SKU, atau brand..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ flex: 1 }}
                />
                <Button
                  variant="outlined"
                  color="neutral"
                  onClick={() => setBarcodeModalOpen(true)}
                  startDecorator={<BarcodeReaderIcon />}
                  sx={{ display: { xs: "none", sm: "flex" } }}
                >
                  Scan Barcode
                </Button>
                <IconButton
                  variant="outlined"
                  color="neutral"
                  onClick={() => setBarcodeModalOpen(true)}
                  sx={{ display: { xs: "flex", sm: "none" } }}
                >
                  <BarcodeReaderIcon />
                </IconButton>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  overflow: "auto",
                  pb: 1,
                  "::-webkit-scrollbar": { height: "8px" },
                  "::-webkit-scrollbar-thumb": {
                    background: "rgba(0,0,0,0.1)",
                    borderRadius: "4px",
                  },
                }}
              >
                <Chip
                  variant={activeCategory === null ? "solid" : "soft"}
                  color={activeCategory === null ? "primary" : "neutral"}
                  onClick={() => setActiveCategory(null)}
                >
                  Semua
                </Chip>
                {categories.map((category) => (
                  <Chip
                    key={category}
                    variant={activeCategory === category ? "solid" : "soft"}
                    color={activeCategory === category ? "primary" : "neutral"}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </Chip>
                ))}
              </Box>
            </Box>

            {/* Products Grid */}
            {productsLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "50vh",
                }}
              >
                <CircularProgress size="lg" />
              </Box>
            ) : (
              <Grid container spacing={2}>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <Grid key={product.id} xs={6} sm={4} md={4} lg={3}>
                      <ProductCard product={product} onAddToCart={addToCart} />
                    </Grid>
                  ))
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      py: 8,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Sheet
                      variant="soft"
                      color="neutral"
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2,
                      }}
                    >
                      <SearchIcon sx={{ fontSize: 30 }} />
                    </Sheet>
                    <Typography level="h4" sx={{ mb: 1 }}>
                      Tidak Ada Produk
                    </Typography>
                    <Typography textAlign="center" sx={{ maxWidth: 400 }}>
                      Produk yang Anda cari tidak ditemukan. Coba kata kunci
                      lain atau pilih kategori yang berbeda.
                    </Typography>
                  </Box>
                )}
              </Grid>
            )}
          </Box>

          {/* Cart Section (Right) */}
          <Sheet
            variant="soft"
            sx={{
              width: { xs: cart.length > 0 ? "100%" : "0%", md: "40%" },
              borderLeft: "1px solid",
              borderColor: "divider",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              transition: "width 0.3s ease",
            }}
          >
            {/* Cart Header */}
            <Box
              sx={{
                p: 2,
                borderBottom: "1px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  variant="plain"
                  color="neutral"
                  sx={{
                    display: {
                      xs: cart.length > 0 ? "flex" : "none",
                      md: "none",
                    },
                  }}
                  onClick={() => setCart([])} // Just hide the cart view on mobile
                >
                  <ArrowBackIcon />
                </IconButton>
                <Badge badgeContent={cart.length} color="primary">
                  <ShoppingCartIcon sx={{ mr: 1 }} />
                </Badge>
                <Typography level="title-lg">Pesanan</Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                {cart.length > 0 && (
                  <Button
                    variant="soft"
                    color="danger"
                    size="sm"
                    startDecorator={<RemoveShoppingCartIcon />}
                    onClick={clearCart}
                  >
                    Kosongkan
                  </Button>
                )}
              </Box>
            </Box>

            {/* Cart Customer */}
            <Box
              sx={{
                p: 2,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Autocomplete
                placeholder="Cari atau pilih pelanggan..."
                startDecorator={<PersonIcon />}
                options={
                  users?.filter((user) => user.role === Role.BUYER) || []
                }
                value={selectedCustomer}
                onChange={(_, newValue) => {
                  setSelectedCustomer(newValue);
                  setHasChanges(true);
                }}
                getOptionLabel={(option) => option.name}
                renderOption={(props, option) => (
                  <AutocompleteOption {...props}>
                    <ListItemDecorator>
                      <Avatar size="sm">{option.name[0]}</Avatar>
                    </ListItemDecorator>
                    <ListItemContent>
                      <Typography>{option.name}</Typography>
                      <Typography level="body-xs">{option.email}</Typography>
                    </ListItemContent>
                  </AutocompleteOption>
                )}
                loading={usersLoading}
              />
            </Box>

            {/* Cart Items */}
            <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
              {cart.length === 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    py: 4,
                  }}
                >
                  <Sheet
                    variant="soft"
                    color="neutral"
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                    }}
                  >
                    <ShoppingCartIcon sx={{ fontSize: 40 }} />
                  </Sheet>
                  <Typography level="h4" sx={{ mb: 1 }}>
                    Keranjang Kosong
                  </Typography>
                  <Typography textAlign="center">
                    Tambahkan produk ke keranjang untuk memulai transaksi.
                  </Typography>
                </Box>
              ) : (
                cart.map((item, index) => (
                  <CartItemComponent
                    key={`${item.product.id}-${index}`}
                    item={item}
                    onIncrease={() => increaseQuantity(index)}
                    onDecrease={() => decreaseQuantity(index)}
                    onRemove={() => removeFromCart(index)}
                  />
                ))
              )}
            </Box>

            {/* Local Storage Indicator */}
            {hasChanges && cart.length > 0 && (
              <Sheet
                variant="soft"
                color="success"
                sx={{
                  p: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <CloudDoneIcon fontSize="small" />
                <Typography level="body-xs">
                  Perubahan disimpan secara lokal
                </Typography>
              </Sheet>
            )}

            {/* Cart Summary */}
            <Sheet
              variant="soft"
              sx={{
                p: 2,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography>Subtotal</Typography>
                <Typography>Rp {subtotal.toLocaleString("id-ID")}</Typography>
              </Box>
              <Divider sx={{ my: 1.5 }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 2,
                  fontWeight: "bold",
                }}
              >
                <Typography level="title-md">Total</Typography>
                <Typography level="title-md">
                  Rp {total.toLocaleString("id-ID")}
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="solid"
                color="primary"
                disabled={cart.length === 0}
                onClick={handleCreateOrder}
                endDecorator={<AddShoppingCartIcon />}
                loading={ordersLoading}
              >
                Buat Pesanan
              </Button>
            </Sheet>
          </Sheet>
        </Box>
      ) : (
        // Orders view
        <Box sx={{ p: 3, height: "100%", overflow: "auto" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Typography level="h4">Daftar Pesanan</Typography>
            <Button
              variant="solid"
              color="primary"
              startDecorator={<AddShoppingCartIcon />}
              onClick={() => toggleView("products")}
            >
              Buat Pesanan Baru
            </Button>
          </Box>

          {ordersLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : orders?.length === 0 ? (
            <Box sx={{ textAlign: "center", p: 4 }}>
              <Typography level="h4">Belum ada pesanan</Typography>
              <Button
                variant="soft"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => toggleView("products")}
                startDecorator={<AddShoppingCartIcon />}
              >
                Buat Pesanan Baru
              </Button>
            </Box>
          ) : (
            <Table sx={{ "& thead th": { fontWeight: "bold" } }}>
              <thead>
                <tr>
                  <th style={{ width: 100 }}>ID</th>
                  <th>Pelanggan</th>
                  <th>Tanggal</th>
                  <th>Total</th>
                  <th>Status Pesanan</th>
                  <th>Status Pembayaran</th>
                  <th style={{ width: 150 }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {orders?.map((order) => {
                  const payment = getPaymentForOrder(order.id);

                  return (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.user ? order.user.name : "Pelanggan Umum"}</td>
                      <td>{formatDate(order.createdAt || Date.now())}</td>
                      <td>Rp {order.totalAmount.toLocaleString("id-ID")}</td>
                      <td>
                        <Chip
                          size="sm"
                          variant="soft"
                          color={getOrderStatusColor(order.status)}
                        >
                          {order.status}
                        </Chip>
                      </td>
                      <td>
                        {payment ? (
                          <Chip
                            size="sm"
                            variant="soft"
                            color={getPaymentStatusColor(
                              payment.paymentStatus as PaymentStatus
                            )}
                          >
                            {payment.paymentStatus}
                          </Chip>
                        ) : (
                          <Chip size="sm" variant="soft" color="warning">
                            BELUM ADA
                          </Chip>
                        )}
                      </td>
                      <td>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <IconButton
                            size="sm"
                            variant="outlined"
                            color="primary"
                            onClick={() => viewOrderDetails(order)}
                            title="Lihat Detail"
                          >
                            <VisibilityIcon />
                          </IconButton>

                          {!payment && (
                            <IconButton
                              size="sm"
                              variant="outlined"
                              color="success"
                              onClick={() => handleCreatePayment(order.id)}
                              title="Buat Pembayaran"
                            >
                              <PaymentIcon />
                            </IconButton>
                          )}

                          {payment &&
                            payment.paymentStatus === PaymentStatus.PENDING && (
                              <IconButton
                                size="sm"
                                variant="outlined"
                                color="warning"
                                onClick={() => openPaymentProofModal(payment)}
                                title="Update Status Pembayaran"
                              >
                                <MoneyIcon />
                              </IconButton>
                            )}
                        </Box>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Box>
      )}

      {/* Barcode Scanner Modal */}
      <Modal open={barcodeModalOpen} onClose={() => setBarcodeModalOpen(false)}>
        <ModalDialog
          variant="outlined"
          role="alertdialog"
          aria-labelledby="barcode-modal-title"
          sx={{ maxWidth: 400 }}
        >
          <ModalClose />
          <Typography id="barcode-modal-title" level="h4" sx={{ mb: 2 }}>
            <BarcodeReaderIcon sx={{ mr: 1, verticalAlign: "bottom" }} />
            Scan Barcode
          </Typography>

          <form onSubmit={handleBarcodeSubmit}>
            <FormControl sx={{ mb: 2 }}>
              <FormLabel>Masukkan kode produk:</FormLabel>
              <Input
                ref={barcodeInputRef}
                placeholder="Scan atau ketik kode produk..."
                value={scannedBarcode}
                onChange={(e) => setScannedBarcode(e.target.value)}
                startDecorator={<BarcodeReaderIcon />}
                autoFocus
              />
            </FormControl>

            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                color="neutral"
                onClick={() => setBarcodeModalOpen(false)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="solid"
                color="primary"
                disabled={!scannedBarcode}
              >
                Tambah ke Keranjang
              </Button>
            </Box>
          </form>
        </ModalDialog>
      </Modal>

      {/* Order Success Modal */}
      <Modal
        open={orderSuccessModalOpen}
        onClose={() => setOrderSuccessModalOpen(false)}
      >
        <ModalDialog
          variant="outlined"
          role="alertdialog"
          aria-labelledby="order-success-modal-title"
          sx={{ maxWidth: 500 }}
        >
          <ModalClose />
          <Typography
            id="order-success-modal-title"
            level="h3"
            sx={{ mb: 2, textAlign: "center" }}
          >
            <CheckCircleIcon
              sx={{
                fontSize: 40,
                color: "success.500",
                mb: 1,
                display: "block",
                margin: "0 auto",
              }}
            />
            Pesanan Berhasil Dibuat
          </Typography>

          <Alert color="success" sx={{ mb: 2 }}>
            Pesanan dengan ID #{createdOrderId} telah berhasil dibuat.
          </Alert>

          <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
            <Button
              variant="outlined"
              color="neutral"
              onClick={() => setOrderSuccessModalOpen(false)}
            >
              Kembali ke Produk
            </Button>
            <Button
              variant="solid"
              color="primary"
              onClick={() => {
                setOrderSuccessModalOpen(false);
                toggleView("orders");
              }}
              startDecorator={<TableRowsIcon />}
            >
              Lihat Daftar Pesanan
            </Button>
          </Box>
        </ModalDialog>
      </Modal>

      {/* Order Details Modal */}
      <Modal
        open={orderDetailsModalOpen}
        onClose={() => setOrderDetailsModalOpen(false)}
      >
        <ModalDialog variant="outlined" sx={{ maxWidth: 600 }}>
          <ModalClose />
          <Typography level="h4" sx={{ mb: 2 }}>
            Detail Pesanan #{selectedOrder?.id}
          </Typography>

          {selectedOrder && (
            <>
              <Box sx={{ mb: 2 }}>
                <Chip
                  size="sm"
                  variant="soft"
                  color={getOrderStatusColor(selectedOrder.status)}
                >
                  {selectedOrder.status}
                </Chip>

                <Typography level="body-sm" sx={{ mt: 1 }}>
                  Tanggal: {formatDate(selectedOrder.createdAt || Date.now())}
                </Typography>

                <Typography level="body-sm">
                  Pelanggan:{" "}
                  {selectedOrder.user
                    ? selectedOrder.user.name
                    : "Pelanggan Umum"}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography level="title-sm" sx={{ mb: 1 }}>
                Item Pesanan:
              </Typography>

              <Sheet variant="soft" sx={{ p: 2, mb: 2, borderRadius: "md" }}>
                {selectedOrder.items &&
                  selectedOrder.items.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Box>
                        <Typography level="body-sm">
                          {item.productId || "Produk"}
                        </Typography>
                        <Typography level="body-xs" color="neutral">
                          {item.quantity} x Rp{" "}
                          {item.unitPrice.toLocaleString("id-ID")}
                        </Typography>
                      </Box>
                      <Typography level="body-sm">
                        Rp {item.totalPrice.toLocaleString("id-ID")}
                      </Typography>
                    </Box>
                  ))}

                <Divider sx={{ my: 1 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography level="body-md" fontWeight="bold">
                    Total
                  </Typography>
                  <Typography level="body-md" fontWeight="bold">
                    Rp {selectedOrder.totalAmount.toLocaleString("id-ID")}
                  </Typography>
                </Box>
              </Sheet>

              <Divider sx={{ my: 2 }} />

              <Typography level="title-sm" sx={{ mb: 1 }}>
                Informasi Pembayaran:
              </Typography>

              {getPaymentForOrder(selectedOrder.id) ? (
                <Box>
                  <Sheet variant="soft" sx={{ p: 2, borderRadius: "md" }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography level="body-sm">
                        Metode Pembayaran:
                      </Typography>
                      <Typography level="body-sm">
                        {getPaymentForOrder(selectedOrder.id)?.receiver.method}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography level="body-sm">Status:</Typography>
                      <Chip
                        size="sm"
                        variant="soft"
                        color={getPaymentStatusColor(
                          getPaymentForOrder(selectedOrder.id)
                            ?.paymentStatus as PaymentStatus
                        )}
                      >
                        {getPaymentForOrder(selectedOrder.id)?.paymentStatus}
                      </Chip>
                    </Box>

                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography level="body-sm">Jumlah:</Typography>
                      <Typography level="body-sm">
                        Rp{" "}
                        {getPaymentForOrder(
                          selectedOrder.id
                        )?.amount.toLocaleString("id-ID")}
                      </Typography>
                    </Box>
                  </Sheet>

                  {getPaymentForOrder(selectedOrder.id)?.paymentStatus ===
                    PaymentStatus.PENDING && (
                    <Button
                      fullWidth
                      variant="solid"
                      color="warning"
                      startDecorator={<MoneyIcon />}
                      onClick={() => {
                        setOrderDetailsModalOpen(false);
                        const payment = getPaymentForOrder(selectedOrder.id);
                        if (payment) {
                          openPaymentProofModal(payment);
                        }
                      }}
                      sx={{ mt: 2 }}
                    >
                      Update Status Pembayaran
                    </Button>
                  )}
                </Box>
              ) : (
                <Box sx={{ textAlign: "center", py: 2 }}>
                  <Typography level="body-sm" sx={{ mb: 2 }}>
                    Belum ada pembayaran untuk pesanan ini
                  </Typography>

                  <Button
                    variant="solid"
                    color="primary"
                    startDecorator={<PaymentIcon />}
                    onClick={() => {
                      setOrderDetailsModalOpen(false);
                      handleCreatePayment(selectedOrder.id);
                    }}
                  >
                    Buat Pembayaran
                  </Button>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  color="neutral"
                  onClick={() => setOrderDetailsModalOpen(false)}
                >
                  Tutup
                </Button>
              </Box>
            </>
          )}
        </ModalDialog>
      </Modal>

      {/* Payment Modal */}
      <Modal open={paymentModalOpen} onClose={() => setPaymentModalOpen(false)}>
        <ModalDialog variant="outlined" sx={{ maxWidth: 500 }}>
          <ModalClose />
          <Typography level="h4" sx={{ mb: 2 }}>
            <PaymentIcon sx={{ mr: 1, verticalAlign: "bottom" }} />
            Buat Pembayaran
          </Typography>

          {selectedOrder && (
            <>
              <Alert color="primary" sx={{ mb: 2 }}>
                <Typography fontWeight="bold">
                  Pesanan #{selectedOrder.id}
                </Typography>
                <Typography>
                  Total: Rp {selectedOrder.totalAmount.toLocaleString("id-ID")}
                </Typography>
              </Alert>

              <FormControl sx={{ mb: 2 }}>
                <FormLabel>Metode Pembayaran</FormLabel>
                <Select
                  value={paymentMethod}
                  onChange={(_, value) =>
                    value && setPaymentMethod(value as PaymentMethod)
                  }
                >
                  <Option value={PaymentMethod.CASH}>Tunai</Option>
                  <Option value={PaymentMethod.BANK}>Transfer Bank</Option>
                  <Option value={PaymentMethod.E_WALLET}>E-Wallet</Option>
                </Select>
              </FormControl>

              <Typography level="body-sm" sx={{ mb: 2 }}>
                Pembayaran akan dibuat dengan status "BELUM DIBAYAR". Anda dapat
                memperbarui status pembayaran setelah pelanggan membayar.
              </Typography>

              <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  color="neutral"
                  onClick={() => setPaymentModalOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  variant="solid"
                  color="primary"
                  startDecorator={<CreditCardIcon />}
                  onClick={submitPayment}
                  loading={paymentsLoading}
                >
                  Buat Pembayaran
                </Button>
              </Box>
            </>
          )}
        </ModalDialog>
      </Modal>

      {/* Payment Proof Modal */}
      <Modal
        open={paymentProofModalOpen}
        onClose={() => setPaymentProofModalOpen(false)}
      >
        <ModalDialog variant="outlined" sx={{ maxWidth: 500 }}>
          <ModalClose />
          <Typography level="h4" sx={{ mb: 2 }}>
            <MoneyIcon sx={{ mr: 1, verticalAlign: "bottom" }} />
            Update Status Pembayaran
          </Typography>

          {selectedPayment && (
            <>
              <Alert color="primary" sx={{ mb: 2 }}>
                <Typography fontWeight="bold">
                  Pembayaran #{selectedPayment.id}
                </Typography>
                <Typography>
                  Metode: {selectedPayment.receiver.method}
                </Typography>
                <Typography>
                  Jumlah: Rp {selectedPayment.amount.toLocaleString("id-ID")}
                </Typography>
              </Alert>

              <FormControl sx={{ mb: 2 }}>
                <FormLabel>Upload Bukti Pembayaran (Opsional)</FormLabel>
                <Box
                  sx={{
                    border: "1px dashed",
                    borderColor: "neutral.400",
                    borderRadius: "md",
                    p: 2,
                    textAlign: "center",
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                  component="label"
                >
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                  {paymentProof ? (
                    <Box>
                      <Typography level="body-sm" sx={{ mb: 1 }}>
                        {paymentProof.name}
                      </Typography>
                      <Chip
                        size="sm"
                        color="success"
                        startDecorator={<AttachFileIcon />}
                      >
                        File dipilih
                      </Chip>
                    </Box>
                  ) : (
                    <Box>
                      <UploadFileIcon
                        sx={{ fontSize: 40, color: "neutral.400", mb: 1 }}
                      />
                      <Typography level="body-sm">
                        Klik untuk memilih file atau seret file ke sini
                      </Typography>
                    </Box>
                  )}
                </Box>
              </FormControl>

              <Alert color="warning" sx={{ mb: 2 }}>
                Setelah mengubah status menjadi "DIBAYAR", status tidak dapat
                diubah kembali.
              </Alert>

              <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  color="neutral"
                  onClick={() => setPaymentProofModalOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  variant="solid"
                  color="success"
                  startDecorator={<CheckCircleIcon />}
                  onClick={handleUpdatePaymentStatus}
                  loading={paymentsLoading}
                >
                  Tandai Sudah Dibayar
                </Button>
              </Box>
            </>
          )}
        </ModalDialog>
      </Modal>

      {/* Snackbar for notifications */}
      <Snackbar
        autoHideDuration={4000}
        open={snackbarOpen}
        variant="soft"
        color={snackbarColor}
        onClose={() => setSnackbarOpen(false)}
        startDecorator={
          snackbarColor === "success" ? (
            <CheckCircleIcon />
          ) : snackbarColor === "danger" ? (
            <ErrorIcon />
          ) : snackbarColor === "warning" ? (
            <InfoIcon />
          ) : (
            <InfoIcon />
          )
        }
        endDecorator={
          <IconButton
            size="sm"
            variant="plain"
            color="neutral"
            onClick={() => setSnackbarOpen(false)}
          >
            <CloseIcon />
          </IconButton>
        }
      >
        {snackbarMessage}
      </Snackbar>
    </Box>
  );
};

export default TransactionPage;
