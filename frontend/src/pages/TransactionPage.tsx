// filepath: d:\Project\jayajuniortools\frontend\src\pages\TransactionPage.tsx
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
} from "@mui/joy";

// DTOs
import { ProductDTO, ProductStatus, DiscountType } from "../dto/product.dto";
import { OrderDTO } from "../dto/order.dto";
import { PaymentDTO } from "../dto/payment.dto";
import { UserDTO, Role } from "../dto/user.dto";

// Icons
import SearchIcon from "@mui/icons-material/Search";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
// import ReceiptIcon from "@mui/icons-material/Receipt";
import PersonIcon from "@mui/icons-material/Person";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import InventoryIcon from "@mui/icons-material/Inventory";
// import CategoryIcon from "@mui/icons-material/Category";
// import PercentIcon from "@mui/icons-material/Percent";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PaymentIcon from "@mui/icons-material/Payment";
import HistoryIcon from "@mui/icons-material/History";
// import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import SendIcon from "@mui/icons-material/Send";
import BarcodeReaderIcon from "@mui/icons-material/QrCodeScanner";
// import CameraIcon from "@mui/icons-material/Camera";
import PaymentsIcon from "@mui/icons-material/Payments";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PrintIcon from "@mui/icons-material/Print";
import InfoIcon from "@mui/icons-material/Info";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
// import CloudOffIcon from "@mui/icons-material/CloudOff";
import ErrorIcon from "@mui/icons-material/Error";
import SaveIcon from "@mui/icons-material/Save";
import WifiOffIcon from "@mui/icons-material/WifiOff";
// import DoneAllIcon from "@mui/icons-material/DoneAll";
import CloseIcon from "@mui/icons-material/Close";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

// API Service (mock)
// const API_URL = "/api";

// Mock service for API calls
const apiService = {
  fetchProducts: async (): Promise<ProductDTO[]> => {
    // In a real app, this would fetch from an API endpoint
    return new Promise((resolve) => {
      setTimeout(() => resolve(sampleProducts), 800);
    });
  },

  fetchCustomers: async (): Promise<UserDTO[]> => {
    // In a real app, this would fetch from an API endpoint
    return new Promise((resolve) => {
      setTimeout(() => resolve(sampleCustomers), 600);
    });
  },

  createOrder: async (orderData: any): Promise<OrderDTO> => {
    // Simulate API call to create an order
    return new Promise((resolve) => {
      setTimeout(() => {
        const orderNo = `INV-${Date.now().toString().substr(-6)}`;
        resolve({
          id: Math.floor(Math.random() * 1000),
          status: "PENDING",
          totalAmount: orderData.totalAmount,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          maker: "Admin",
          user: orderData.user || {
            id: 0,
            name: "Guest",
            role: Role.BUYER,
            status: "ACTIVE" as any,
            createdAt: "",
            updatedAt: "",
          },
          items: orderData.items,
          payment: orderData.payment,
        } as any);
      }, 1500);
    });
  },

  processPayment: async (paymentData: any): Promise<PaymentDTO> => {
    // Simulate API call to process payment
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: Math.floor(Math.random() * 1000),
          amount: paymentData.amount,
          amountPaid: paymentData.amountPaid,
          amountChange: paymentData.amountChange,
          paymentDate: new Date(),
          paymentStatus: "COMPLETED",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          orderId: paymentData.orderId,
          receiver: paymentData.receiver,
        } as any);
      }, 1200);
    });
  },

  saveTransactionDraft: async (
    draftData: any
  ): Promise<{ id: string; success: boolean }> => {
    // Simulate API call to save draft
    return new Promise((resolve) => {
      setTimeout(() => {
        const draftId = `DRAFT-${Date.now().toString().substr(-6)}`;
        resolve({ id: draftId, success: true });
      }, 800);
    });
  },
};

// Local Storage Keys
const STORAGE_KEYS = {
  CART: "jjt_pos_cart",
  CUSTOMER: "jjt_pos_customer",
  DRAFT_ORDERS: "jjt_pos_draft_orders",
  PENDING_SYNC: "jjt_pos_pending_sync",
  SETTINGS: "jjt_pos_settings",
};

// Utility functions for local storage
const StorageUtils = {
  saveCart: (cart: any[], customerId?: number | null) => {
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

  saveDraftOrder: (orderData: any) => {
    try {
      const existingDrafts = StorageUtils.loadDraftOrders() || [];
      const newDraft = {
        id: `DRAFT-${Date.now()}`,
        orderData,
        timestamp: Date.now(),
        synced: false,
      };

      const updatedDrafts = [newDraft, ...existingDrafts];
      localStorage.setItem(
        STORAGE_KEYS.DRAFT_ORDERS,
        JSON.stringify(updatedDrafts)
      );
      return newDraft.id;
    } catch (e) {
      console.error("Error saving draft order to localStorage", e);
      return null;
    }
  },

  loadDraftOrders: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DRAFT_ORDERS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error loading draft orders from localStorage", e);
      return [];
    }
  },

  updateDraftOrderStatus: (draftId: string, synced: boolean) => {
    try {
      const drafts = StorageUtils.loadDraftOrders();
      const updatedDrafts = drafts.map((draft: any) =>
        draft.id === draftId ? { ...draft, synced } : draft
      );
      localStorage.setItem(
        STORAGE_KEYS.DRAFT_ORDERS,
        JSON.stringify(updatedDrafts)
      );
      return true;
    } catch (e) {
      console.error("Error updating draft order status", e);
      return false;
    }
  },

  clearCart: () => {
    localStorage.removeItem(STORAGE_KEYS.CART);
  },

  addPendingSync: (action: string, data: any) => {
    try {
      const pendingActions = StorageUtils.getPendingSync() || [];
      pendingActions.push({
        id: `sync-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        action,
        data,
        timestamp: Date.now(),
      });
      localStorage.setItem(
        STORAGE_KEYS.PENDING_SYNC,
        JSON.stringify(pendingActions)
      );
    } catch (e) {
      console.error("Error adding pending sync action", e);
    }
  },

  getPendingSync: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PENDING_SYNC);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error getting pending sync actions", e);
      return [];
    }
  },

  removePendingSync: (id: string) => {
    try {
      const pendingActions = StorageUtils.getPendingSync();
      const updated = pendingActions.filter((action: any) => action.id !== id);
      localStorage.setItem(STORAGE_KEYS.PENDING_SYNC, JSON.stringify(updated));
    } catch (e) {
      console.error("Error removing pending sync action", e);
    }
  },

  clearAllStorage: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.CART);
      localStorage.removeItem(STORAGE_KEYS.CUSTOMER);
      localStorage.removeItem(STORAGE_KEYS.PENDING_SYNC);
      // Note: We don't clear draft orders here as they might be important
    } catch (e) {
      console.error("Error clearing storage", e);
    }
  },
};

// Mock sample products
const sampleProducts: ProductDTO[] = [
  {
    id: 1,
    name: "Palu Tukang Premium",
    description: "Palu tukang kualitas premium dengan pegangan anti selip",
    retailPrice: 85000,
    wholesalePrice: 65000,
    minWholesaleQty: 5,
    sku: "TL-PLU-001",
    productStatus: ProductStatus.AVAILABLE,
    quantityInStock: 25,
    minimumStock: 5,
    categories: ["Perkakas", "Tukang"],
    imageUrls: ["https://images.unsplash.com/photo-1586864387967-d02ef85d93e8"],
    brand: {
      name: "ToolMaster",
      description: "Brand perkakas premium",
      logoUrl: null,
    },
  },
  {
    id: 2,
    name: "Obeng Set 12 Pcs",
    description: "Set obeng lengkap 12 pcs dengan berbagai ukuran dan jenis",
    retailPrice: 120000,
    wholesalePrice: 95000,
    minWholesaleQty: 3,
    sku: "TL-OBG-012",
    productStatus: ProductStatus.AVAILABLE,
    quantityInStock: 15,
    minimumStock: 3,
    categories: ["Perkakas", "Set Alat"],
    imageUrls: [
      "https://res.cloudinary.com/ruparupa-com/image/upload/h_400,w_400,f_auto/Products/KW0101626_1.jpg",
    ],
    brand: {
      name: "ToolMaster",
      description: "Brand perkakas premium",
      logoUrl: null,
    },
    discount: {
      name: "Diskon Musim",
      description: "Diskon spesial untuk produk musiman",
      discountType: DiscountType.PERCENTAGE,
      discountValue: 10,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
  },
  {
    id: 3,
    name: "Kunci Pas Set 8-24mm",
    description: "Set kunci pas lengkap dengan ukuran 8-24mm",
    retailPrice: 175000,
    wholesalePrice: 145000,
    minWholesaleQty: 2,
    sku: "TL-KP-824",
    productStatus: ProductStatus.AVAILABLE,
    quantityInStock: 8,
    minimumStock: 2,
    categories: ["Perkakas", "Set Alat"],
    imageUrls: ["https://images.unsplash.com/photo-1572981779307-38b8cabb2407"],
    brand: {
      name: "ProTools",
      description: "Alat profesional untuk tukang",
      logoUrl: null,
    },
  },
  {
    id: 4,
    name: "Meteran 5m",
    description: "Meteran manual 5 meter dengan kualitas tinggi",
    retailPrice: 45000,
    wholesalePrice: 35000,
    minWholesaleQty: 10,
    sku: "TL-MTR-5M",
    productStatus: ProductStatus.AVAILABLE,
    quantityInStock: 30,
    minimumStock: 5,
    categories: ["Perkakas", "Alat Ukur"],
    imageUrls: ["https://images.unsplash.com/photo-1589939705384-5185137a7f0f"],
    brand: {
      name: "MeasurePro",
      description: "Alat ukur presisi tinggi",
      logoUrl: null,
    },
  },
  {
    id: 5,
    name: 'Gergaji Kayu 24"',
    description: "Gergaji kayu 24 inci dengan pegangan ergonomis",
    retailPrice: 95000,
    wholesalePrice: 75000,
    minWholesaleQty: 5,
    sku: "TL-GRG-24",
    productStatus: ProductStatus.AVAILABLE,
    quantityInStock: 12,
    minimumStock: 3,
    categories: ["Perkakas", "Pemotong"],
    imageUrls: ["https://images.unsplash.com/photo-1504222490345-c075b6008014"],
    brand: {
      name: "CutPro",
      description: "Alat pemotong profesional",
      logoUrl: null,
    },
    discount: {
      name: "Diskon Bulan Ini",
      description: "Diskon spesial bulan ini",
      discountType: DiscountType.PERCENTAGE,
      discountValue: 15,
      startDate: new Date(),
      endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
  },
  {
    id: 6,
    name: "Set Kunci L 9 Pcs",
    description: "Set kunci L dengan 9 ukuran berbeda",
    retailPrice: 65000,
    wholesalePrice: 50000,
    minWholesaleQty: 5,
    sku: "TL-KL-9PC",
    productStatus: ProductStatus.AVAILABLE,
    quantityInStock: 3,
    minimumStock: 2,
    categories: ["Perkakas", "Set Alat"],
    imageUrls: [
      "https://images.tokopedia.net/img/cache/700/hDjmkQ/2023/3/16/54e9882d-d491-450d-9111-5244ca1eefa5.jpg",
    ],
    brand: {
      name: "ToolMaster",
      description: "Brand perkakas premium",
      logoUrl: null,
    },
  },
];

// Sample customers
const sampleCustomers: UserDTO[] = [
  {
    id: 1,
    name: "Budi Santoso",
    email: "budi@example.com",
    status: "ACTIVE" as any,
    role: "BUYER" as any,
    createdAt: "2023-01-15",
    updatedAt: "2023-01-15",
  },
  {
    id: 2,
    name: "Siti Rahayu",
    email: "siti@example.com",
    status: "ACTIVE" as any,
    role: "BUYER" as any,
    createdAt: "2023-02-20",
    updatedAt: "2023-02-20",
  },
  {
    id: 3,
    name: "Agus Wijaya",
    email: "agus@example.com",
    status: "ACTIVE" as any,
    role: "BUYER" as any,
    createdAt: "2023-03-10",
    updatedAt: "2023-03-10",
  },
];

// Sample payment methods
const paymentMethods = [
  {
    id: 1,
    method: "CASH",
    provider: "Cash",
    accountNumber: "-",
    accountHolderName: "-",
  },
  {
    id: 2,
    method: "BANK",
    provider: "BCA",
    accountNumber: "123456789",
    accountHolderName: "Jaya Junior Tools",
  },
  {
    id: 3,
    method: "E_WALLET",
    provider: "OVO",
    accountNumber: "081234567890",
    accountHolderName: "Jaya Junior Tools",
  },
  {
    id: 4,
    method: "E_WALLET",
    provider: "GoPay",
    accountNumber: "081234567890",
    accountHolderName: "Jaya Junior Tools",
  },
];

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
          disabled={item.quantity >= item.product.quantityInStock}
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
    ? product.retailPrice * (1 - product.discount!.discountValue / 100)
    : product.retailPrice;

  const isLowStock = product.quantityInStock <= (product.minimumStock || 5);
  const isOutOfStock = product.quantityInStock <= 0;

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
          {product.discount!.discountValue}% OFF
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

// Network status checker
const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
};

// Main Transaction Page Component
const TransactionPage = () => {
  // Network status
  const isOnline = useNetworkStatus();

  // States
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductDTO[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<UserDTO | null>(
    null
  );
  const [customers, setCustomers] = useState<UserDTO[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>("CASH");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [barcodeModalOpen, setBarcodeModalOpen] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarColor, setSnackbarColor] = useState<
    "success" | "danger" | "warning" | "neutral"
  >("neutral");
  const [syncingDraft, setSyncingDraft] = useState(false);
  const [draftsModalOpen, setDraftsModalOpen] = useState(false);
  const [draftOrders, setDraftOrders] = useState<any[]>([]);
  const [hasPendingSync, setHasPendingSync] = useState(false);

  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const total = subtotal;
  const change = Math.max(0, amountPaid - total);

  // Load data from localStorage on initial render
  useEffect(() => {
    const loadSavedCart = () => {
      const savedData = StorageUtils.loadCart();
      if (savedData && savedData.cart && savedData.cart.length > 0) {
        setCart(savedData.cart);
        setHasChanges(true);

        // If there was a customer selected
        if (savedData.customerId) {
          const customer = customers.find((c) => c.id === savedData.customerId);
          if (customer) {
            setSelectedCustomer(customer);
          }
        }
      }
    };

    const loadDraftOrders = () => {
      const drafts = StorageUtils.loadDraftOrders();
      setDraftOrders(drafts);

      // Check if any drafts need to be synced
      const pendingSyncs = drafts.filter((draft: any) => !draft.synced);
      setHasPendingSync(pendingSyncs.length > 0);
    };

    // Load products first
    setLoadingProducts(true);
    apiService
      .fetchProducts()
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
        setLoadingProducts(false);

        // Then load customers
        return apiService.fetchCustomers();
      })
      .then((data) => {
        setCustomers(data);

        // Finally load cart data from localStorage
        loadSavedCart();
        loadDraftOrders();
      })
      .catch((err) => {
        console.error("Error loading initial data:", err);
        setLoadingProducts(false);

        // Fallback to localStorage even if API fails
        loadSavedCart();
        loadDraftOrders();

        // Use sample data as fallback if we're offline
        if (!isOnline) {
          setProducts(sampleProducts);
          setFilteredProducts(sampleProducts);
          setCustomers(sampleCustomers);
        }

        // Show error message
        showSnackbar(
          "Gagal memuat data dari server. Menggunakan data lokal.",
          "warning"
        );
      });
  }, []);

  // Auto-save cart to localStorage when it changes
  useEffect(() => {
    if (cart.length > 0 || hasChanges) {
      const success = StorageUtils.saveCart(cart, selectedCustomer?.id);
      if (success) {
        setHasChanges(true);
      }
    }
  }, [cart, selectedCustomer]);

  // Effect to compile unique categories from products
  useEffect(() => {
    // Extract all categories from products and remove duplicates
    const allCategories = products
      .flatMap((product) => product.categories || [])
      .filter((category): category is string => Boolean(category));

    // Remove duplicates using reduce and includes
    const uniqueCategories = allCategories.reduce<string[]>((acc, category) => {
      if (!acc.includes(category)) {
        acc.push(category);
      }
      return acc;
    }, []);

    setCategories(uniqueCategories);
  }, [products]);

  // Effect to filter products based on search and category
  useEffect(() => {
    let result = products;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.sku?.toLowerCase().includes(query) ||
          product.brand?.name.toLowerCase().includes(query)
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
        if (item.quantity >= product.quantityInStock) {
          showSnackbar("Stok produk tidak mencukupi", "warning");
          return; // Don't add more than available stock
        }

        item.quantity += 1;
        item.total = item.price * item.quantity;

        setCart(updatedCart);
      } else {
        // Add new item to cart
        const price = product.discount?.isActive
          ? product.retailPrice * (1 - product.discount.discountValue / 100)
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
    if (item.quantity >= item.product.quantityInStock) {
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

  // Checkout Handlers
  const handleCheckout = () => {
    if (cart.length === 0) {
      showSnackbar(
        "Keranjang kosong. Tambahkan produk terlebih dahulu.",
        "warning"
      );
      return; // Don't proceed if cart is empty
    }

    if (!isOnline && paymentMethod !== "CASH") {
      showSnackbar(
        "Pembayaran online tidak tersedia saat offline. Silakan pilih pembayaran tunai.",
        "warning"
      );
      setPaymentMethod("CASH");
    }

    setAmountPaid(Math.ceil(total)); // Default to exact amount
    setPaymentModalOpen(true);
  };

  const handlePayment = () => {
    setLoading(true);

    const orderData = {
      items: cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.total,
      })),
      totalAmount: total,
      user: selectedCustomer || {
        id: 0,
        name: "Guest",
        role: Role.BUYER,
        status: "ACTIVE",
        createdAt: "",
        updatedAt: "",
      },
      payment: {
        amount: total,
        amountPaid: amountPaid,
        amountChange: change,
        paymentMethod: paymentMethod,
        receiver: paymentMethods.find((pm) => pm.method === paymentMethod),
      },
    };

    if (isOnline) {
      // If online, process payment directly through API
      apiService
        .createOrder(orderData)
        .then((order) => {
          const orderNo = `INV-${order.id}`;
          setOrderNumber(orderNo);

          setLoading(false);
          setPaymentModalOpen(false);
          setOrderComplete(true);
          setReceiptModalOpen(true);
          setHasChanges(false);

          // Clear any local storage data
          StorageUtils.clearCart();

          showSnackbar("Transaksi berhasil disimpan ke server", "success");
        })
        .catch((err) => {
          console.error("Error processing payment", err);
          setLoading(false);

          // Save draft locally
          const draftId = StorageUtils.saveDraftOrder(orderData);

          // Show fallback message
          showSnackbar(
            "Gagal menyimpan ke server. Transaksi disimpan sebagai draft lokal.",
            "warning"
          );
          setPaymentModalOpen(false);
          setHasPendingSync(true);
        });
    } else {
      // If offline, save as local draft
      setTimeout(() => {
        const draftId = StorageUtils.saveDraftOrder(orderData);
        const orderNo = `DRAFT-${Date.now().toString().substr(-6)}`;
        setOrderNumber(orderNo);

        setLoading(false);
        setPaymentModalOpen(false);
        setOrderComplete(true);
        setReceiptModalOpen(true);
        setHasChanges(false);

        // Clear cart but keep the draft
        StorageUtils.clearCart();

        // Load updated drafts
        const drafts = StorageUtils.loadDraftOrders();
        setDraftOrders(drafts);
        setHasPendingSync(true);

        showSnackbar("Transaksi disimpan sebagai draft lokal", "warning");
      }, 1000);
    }
  };

  const finalizeTransaction = () => {
    setReceiptModalOpen(false);
    clearCart();
    setOrderComplete(false);
    setAmountPaid(0);
  };

  // Barcode handling
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!scannedBarcode) return;

    // In a real app, you would search for the product by barcode
    // Here we'll just simulate finding a product by SKU
    const foundProduct = products.find((p) => p.sku === scannedBarcode);

    if (foundProduct) {
      addToCart(foundProduct);
      setBarcodeModalOpen(false);
      setScannedBarcode("");
    } else {
      // Show some error or product not found message
      showSnackbar(
        `Produk dengan kode ${scannedBarcode} tidak ditemukan`,
        "danger"
      );
    }
  };

  // Save current cart as draft
  const saveAsDraft = () => {
    if (cart.length === 0) {
      showSnackbar("Keranjang kosong. Tidak ada yang disimpan.", "warning");
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
      user: selectedCustomer,
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage
    const draftId = StorageUtils.saveDraftOrder(orderData);

    // Update drafts list
    const drafts = StorageUtils.loadDraftOrders();
    setDraftOrders(drafts);
    setHasPendingSync(true);

    showSnackbar("Transaksi berhasil disimpan sebagai draft", "success");

    // Clear cart after saving as draft
    clearCart();
  };

  // Sync all pending drafts
  const syncAllDrafts = async () => {
    if (!isOnline) {
      showSnackbar("Tidak dapat sinkronisasi saat offline", "warning");
      return;
    }

    setSyncingDraft(true);
    showSnackbar("Sedang menyinkronkan draft transaksi...", "neutral");

    try {
      // Filter unsynchronized drafts
      const unsyncedDrafts = draftOrders.filter((draft) => !draft.synced);

      if (unsyncedDrafts.length === 0) {
        showSnackbar("Tidak ada draft yang perlu disinkronkan", "success");
        setSyncingDraft(false);
        return;
      }

      // Process each draft
      for (const draft of unsyncedDrafts) {
        try {
          const order = await apiService.createOrder(draft.orderData);
          StorageUtils.updateDraftOrderStatus(draft.id, true);
        } catch (err) {
          console.error(`Failed to sync draft ${draft.id}:`, err);
          // Continue with other drafts even if one fails
        }
      }

      // Reload drafts list
      const updatedDrafts = StorageUtils.loadDraftOrders();
      setDraftOrders(updatedDrafts);

      // Check if we still have pending syncs
      const stillPending = updatedDrafts.filter((draft: any) => !draft.synced);
      setHasPendingSync(stillPending.length > 0);

      showSnackbar(
        `Sinkronisasi selesai. ${
          unsyncedDrafts.length - stillPending.length
        } dari ${unsyncedDrafts.length} berhasil.`,
        stillPending.length > 0 ? "warning" : "success"
      );
    } catch (err) {
      console.error("Error during sync process:", err);
      showSnackbar(
        "Gagal menyinkronkan draft. Silakan coba lagi nanti.",
        "danger"
      );
    } finally {
      setSyncingDraft(false);
      setLastSyncTime(new Date());
    }
  };

  // Load a draft to the cart
  const loadDraft = (draft: any) => {
    if (hasChanges && cart.length > 0) {
      if (
        !window.confirm(
          "Keranjang saat ini memiliki perubahan yang belum disimpan. Yakin ingin menggantinya dengan draft?"
        )
      ) {
        return;
      }
    }

    try {
      // Convert draft items back to cart items
      const cartItems: CartItem[] = draft.orderData.items.map((item: any) => {
        // Find the product in our products list
        const product = products.find((p) => p.id === item.productId);

        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }

        return {
          product,
          quantity: item.quantity,
          price: item.unitPrice,
          total: item.totalPrice,
        };
      });

      // Set the cart
      setCart(cartItems);

      // Set the customer if exists
      if (draft.orderData.user && draft.orderData.user.id) {
        const customer = customers.find(
          (c) => c.id === draft.orderData.user.id
        );
        if (customer) {
          setSelectedCustomer(customer);
        }
      }

      setDraftsModalOpen(false);
      showSnackbar("Draft berhasil dimuat ke keranjang", "success");
    } catch (err) {
      console.error("Error loading draft:", err);
      showSnackbar(
        "Gagal memuat draft. Beberapa produk mungkin tidak tersedia lagi.",
        "danger"
      );
    }
  };

  // Delete a draft
  const deleteDraft = (draftId: string) => {
    if (!window.confirm("Yakin ingin menghapus draft ini?")) {
      return;
    }

    try {
      // Load current drafts
      const drafts = StorageUtils.loadDraftOrders();

      // Filter out the one to delete
      const updatedDrafts = drafts.filter((draft: any) => draft.id !== draftId);

      // Save back to localStorage
      localStorage.setItem(
        STORAGE_KEYS.DRAFT_ORDERS,
        JSON.stringify(updatedDrafts)
      );

      // Update state
      setDraftOrders(updatedDrafts);

      // Check if we still have pending syncs
      const stillPending = updatedDrafts.filter((draft: any) => !draft.synced);
      setHasPendingSync(stillPending.length > 0);

      showSnackbar("Draft berhasil dihapus", "success");
    } catch (err) {
      console.error("Error deleting draft:", err);
      showSnackbar("Gagal menghapus draft", "danger");
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

  // Render
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
          {!isOnline && (
            <Chip
              color="danger"
              variant="solid"
              startDecorator={<WifiOffIcon />}
            >
              Offline
            </Chip>
          )}

          {hasPendingSync && (
            <Tooltip title="Ada transaksi yang belum disinkronkan ke server">
              <Button
                variant="soft"
                color="warning"
                startDecorator={
                  syncingDraft ? (
                    <CircularProgress size="sm" />
                  ) : (
                    <CloudUploadIcon />
                  )
                }
                onClick={syncAllDrafts}
                disabled={!isOnline || syncingDraft}
                size="sm"
              >
                {syncingDraft ? "Menyinkronkan..." : "Sinkron"}
              </Button>
            </Tooltip>
          )}

          <Button
            variant="soft"
            color="neutral"
            startDecorator={<ListAltIcon />}
            onClick={() => setDraftsModalOpen(true)}
            size="sm"
          >
            Draft ({draftOrders.length})
          </Button>

          <Button
            variant="soft"
            color="neutral"
            startDecorator={<HistoryIcon />}
            sx={{ display: { xs: "none", sm: "flex" } }}
            size="sm"
          >
            Riwayat
          </Button>

          <IconButton variant="soft" color="neutral" size="sm">
            <AccountCircleIcon />
          </IconButton>
        </Box>
      </Sheet>

      {/* Main Content */}
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
          {loadingProducts ? (
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
                    Produk yang Anda cari tidak ditemukan. Coba kata kunci lain
                    atau pilih kategori yang berbeda.
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
                <>
                  <Tooltip title="Simpan sebagai draft" placement="top">
                    <IconButton
                      variant="soft"
                      color="primary"
                      size="sm"
                      onClick={saveAsDraft}
                    >
                      <SaveIcon />
                    </IconButton>
                  </Tooltip>
                  <Button
                    variant="soft"
                    color="danger"
                    size="sm"
                    startDecorator={<RemoveShoppingCartIcon />}
                    onClick={clearCart}
                  >
                    Kosongkan
                  </Button>
                </>
              )}
            </Box>
          </Box>

          {/* Offline Indicator */}
          {!isOnline && (
            <Sheet
              variant="soft"
              color="warning"
              sx={{
                p: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <WifiOffIcon sx={{ mr: 1 }} />
                <Typography level="body-sm">
                  Mode Offline - Transaksi akan disimpan ke perangkat
                </Typography>
              </Box>
              <Tooltip title="Transaksi offline akan disimpan sebagai draft lokal hingga koneksi tersedia kembali">
                <IconButton variant="soft" size="sm" color="warning">
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Sheet>
          )}

          {/* Sync Status */}
          {hasPendingSync && isOnline && (
            <Sheet
              variant="soft"
              color="primary"
              sx={{
                p: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CloudUploadIcon sx={{ mr: 1 }} />
                <Typography level="body-sm">
                  {draftOrders.filter((d) => !d.synced).length} transaksi belum
                  disinkronkan
                </Typography>
              </Box>
              <Button
                size="sm"
                variant="solid"
                color="primary"
                onClick={syncAllDrafts}
                loading={syncingDraft}
                loadingPosition="start"
                startDecorator={syncingDraft ? null : <CloudUploadIcon />}
              >
                {syncingDraft ? "Menyinkronkan..." : "Sinkronkan Sekarang"}
              </Button>
            </Sheet>
          )}

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
              options={customers}
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

                {draftOrders.length > 0 && (
                  <Button
                    variant="soft"
                    startDecorator={<ListAltIcon />}
                    onClick={() => setDraftsModalOpen(true)}
                    sx={{ mt: 2 }}
                  >
                    Lihat Draft Tersimpan ({draftOrders.length})
                  </Button>
                )}
              </Box>
            ) : (
              cart.map((item, index) => (
                <Box
                  key={`${item.product.id}-${index}`}
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
                    {item.product.imageUrls &&
                    item.product.imageUrls.length > 0 ? (
                      <img
                        src={item.product.imageUrls[0]}
                        alt={item.product.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
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
                        color={
                          item.product.discount?.isActive ? "danger" : "primary"
                        }
                      >
                        Rp {item.price.toLocaleString("id-ID")}
                      </Typography>
                      {item.product.discount?.isActive && (
                        <Typography
                          level="body-xs"
                          color="primary"
                          sx={{ textDecoration: "line-through" }}
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
                      onClick={() => decreaseQuantity(index)}
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
                      disabled={item.quantity >= item.product.quantityInStock}
                      onClick={() => increaseQuantity(index)}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Typography
                    level="body-sm"
                    sx={{ width: 90, textAlign: "right", mr: 1 }}
                  >
                    Rp {item.total.toLocaleString("id-ID")}
                  </Typography>

                  <IconButton
                    size="sm"
                    color="danger"
                    variant="soft"
                    onClick={() => removeFromCart(index)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
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

            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                fullWidth
                variant="soft"
                color="primary"
                disabled={cart.length === 0}
                onClick={saveAsDraft}
                startDecorator={<SaveIcon />}
              >
                Simpan Draft
              </Button>
              <Button
                fullWidth
                variant="solid"
                color="primary"
                disabled={cart.length === 0}
                onClick={handleCheckout}
                endDecorator={<PaymentIcon />}
              >
                Bayar
              </Button>
            </Box>
          </Sheet>
        </Sheet>
      </Box>

      {/* Drafts Modal */}
      <Modal open={draftsModalOpen} onClose={() => setDraftsModalOpen(false)}>
        <ModalDialog
          variant="outlined"
          sx={{ maxWidth: 600, maxHeight: "85vh", overflow: "auto" }}
        >
          <ModalClose />
          <Typography level="h4" sx={{ mb: 2 }}>
            <ListAltIcon sx={{ mr: 1, verticalAlign: "text-bottom" }} />
            Draft Transaksi
          </Typography>

          {draftOrders.length === 0 ? (
            <Box sx={{ py: 4, textAlign: "center" }}>
              <Typography level="body-lg" sx={{ mb: 2 }}>
                Tidak ada draft transaksi tersimpan
              </Typography>
              <Button variant="soft" onClick={() => setDraftsModalOpen(false)}>
                Tutup
              </Button>
            </Box>
          ) : (
            <>
              {isOnline && draftOrders.some((draft) => !draft.synced) && (
                <Box sx={{ mb: 2 }}>
                  <Button
                    fullWidth
                    variant="solid"
                    color="primary"
                    onClick={syncAllDrafts}
                    loading={syncingDraft}
                    startDecorator={<CloudUploadIcon />}
                  >
                    Sinkronkan Semua Draft (
                    {draftOrders.filter((draft: any) => !draft.synced).length})
                  </Button>
                </Box>
              )}

              <Box sx={{ mb: 2 }}>
                <Typography level="title-sm" sx={{ mb: 1 }}>
                  Total: {draftOrders.length} draft
                </Typography>
                <Divider />
              </Box>

              <Stack spacing={2}>
                {draftOrders.map((draft) => (
                  <Card key={draft.id} variant="outlined">
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography level="title-md">{draft.id}</Typography>
                        <Chip
                          size="sm"
                          color={draft.synced ? "success" : "warning"}
                          variant="soft"
                        >
                          {draft.synced ? "Tersinkron" : "Belum Sinkron"}
                        </Chip>
                      </Box>

                      <Typography level="body-sm" sx={{ mb: 1 }}>
                        Dibuat: {formatDate(draft.timestamp)}
                      </Typography>

                      <Divider sx={{ my: 1 }} />

                      <Typography level="body-sm" sx={{ mb: 0.5 }}>
                        Pelanggan: {draft.orderData.user?.name || "Umum"}
                      </Typography>

                      <Typography level="body-sm" sx={{ mb: 0.5 }}>
                        Total Item: {draft.orderData.items.length}
                      </Typography>

                      <Typography level="body-sm" sx={{ mb: 1.5 }}>
                        Total: Rp{" "}
                        {draft.orderData.totalAmount?.toLocaleString("id-ID") ||
                          "0"}
                      </Typography>

                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          size="sm"
                          variant="soft"
                          color="primary"
                          startDecorator={<ShoppingCartIcon />}
                          onClick={() => loadDraft(draft)}
                          sx={{ flex: 1 }}
                        >
                          Muat ke Keranjang
                        </Button>

                        <IconButton
                          size="sm"
                          variant="soft"
                          color="danger"
                          onClick={() => deleteDraft(draft.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </>
          )}
        </ModalDialog>
      </Modal>

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

      {/* Payment Modal */}
      <Modal open={paymentModalOpen} onClose={() => setPaymentModalOpen(false)}>
        <ModalDialog
          variant="outlined"
          role="alertdialog"
          aria-labelledby="payment-modal-title"
          aria-describedby="payment-modal-desc"
          sx={{ maxWidth: 500 }}
        >
          <ModalClose />
          <Typography id="payment-modal-title" level="h3" sx={{ mb: 2 }}>
            <PaymentsIcon sx={{ mr: 1, verticalAlign: "bottom" }} />
            Pembayaran
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Metode Pembayaran</FormLabel>
            <Select
              value={paymentMethod}
              onChange={(_, value) => value && setPaymentMethod(value)}
              disabled={!isOnline && paymentMethod !== "CASH"}
            >
              <Option value="CASH">Tunai</Option>
              <Option value="BANK" disabled={!isOnline}>
                Transfer Bank {!isOnline && "(Membutuhkan koneksi internet)"}
              </Option>
              <Option value="E_WALLET" disabled={!isOnline}>
                E-Wallet {!isOnline && "(Membutuhkan koneksi internet)"}
              </Option>
            </Select>
          </FormControl>

          {paymentMethod === "CASH" && (
            <>
              <FormControl sx={{ mb: 2 }}>
                <FormLabel>Total Tagihan</FormLabel>
                <Input
                  readOnly
                  value={`Rp ${total.toLocaleString("id-ID")}`}
                  startDecorator={<LocalAtmIcon />}
                />
              </FormControl>

              <FormControl sx={{ mb: 2 }}>
                <FormLabel>Jumlah Dibayar</FormLabel>
                <Input
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(Number(e.target.value) || 0)}
                  startDecorator={<LocalAtmIcon />}
                  slotProps={{
                    input: {
                      min: total,
                      step: 1000,
                    },
                  }}
                />
              </FormControl>

              <FormControl sx={{ mb: 2 }}>
                <FormLabel>Kembalian</FormLabel>
                <Input
                  readOnly
                  value={`Rp ${change.toLocaleString("id-ID")}`}
                  startDecorator={<LocalAtmIcon />}
                  color={change >= 0 ? "success" : "danger"}
                />
              </FormControl>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                {[10000, 20000, 50000, 100000].map((amount) => (
                  <Button
                    key={amount}
                    variant="soft"
                    onClick={() => setAmountPaid(amount)}
                  >
                    {amount.toLocaleString("id-ID")}
                  </Button>
                ))}
                <Button
                  variant="soft"
                  onClick={() => setAmountPaid(Math.ceil(total))}
                >
                  Pas
                </Button>
              </Box>
            </>
          )}

          {paymentMethod === "BANK" && (
            <>
              <FormControl sx={{ mb: 2 }}>
                <FormLabel>Bank</FormLabel>
                <Select defaultValue="BCA">
                  <Option value="BCA">BCA</Option>
                  <Option value="MANDIRI">Mandiri</Option>
                  <Option value="BNI">BNI</Option>
                  <Option value="BRI">BRI</Option>
                </Select>
              </FormControl>

              <Alert
                sx={{ mb: 2 }}
                startDecorator={<InfoIcon />}
                color="primary"
              >
                <Typography fontWeight="lg">Rekening BCA: 123456789</Typography>
                <Typography>a/n PT Jaya Junior Tools</Typography>
              </Alert>

              <FormControl sx={{ mb: 2 }}>
                <FormLabel>Total Tagihan</FormLabel>
                <Input
                  readOnly
                  value={`Rp ${total.toLocaleString("id-ID")}`}
                  startDecorator={<LocalAtmIcon />}
                />
              </FormControl>
            </>
          )}

          {paymentMethod === "E_WALLET" && (
            <>
              <FormControl sx={{ mb: 2 }}>
                <FormLabel>Pilih E-Wallet</FormLabel>
                <Select defaultValue="OVO">
                  <Option value="OVO">OVO</Option>
                  <Option value="GOPAY">GoPay</Option>
                  <Option value="DANA">DANA</Option>
                </Select>
              </FormControl>

              <Alert
                sx={{ mb: 2 }}
                startDecorator={<InfoIcon />}
                color="primary"
              >
                <Typography fontWeight="lg">
                  Scan QR Code atau kirim ke nomor: 081234567890
                </Typography>
                <Typography>a/n PT Jaya Junior Tools</Typography>
              </Alert>

              <FormControl sx={{ mb: 2 }}>
                <FormLabel>Total Tagihan</FormLabel>
                <Input
                  readOnly
                  value={`Rp ${total.toLocaleString("id-ID")}`}
                  startDecorator={<LocalAtmIcon />}
                />
              </FormControl>
            </>
          )}

          {/* Payment method note */}
          {!isOnline && paymentMethod === "CASH" && (
            <Alert
              color="warning"
              sx={{ mb: 2 }}
              startDecorator={<WifiOffIcon />}
            >
              Anda sedang offline. Transaksi akan disimpan sebagai draft lokal
              dan akan otomatis disinkronkan ke server saat koneksi tersedia.
            </Alert>
          )}

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
              onClick={handlePayment}
              loading={loading}
              loadingPosition="start"
              startDecorator={loading ? null : <CheckCircleIcon />}
            >
              Selesaikan Pembayaran
            </Button>
          </Box>
        </ModalDialog>
      </Modal>

      {/* Receipt Modal */}
      <Modal open={receiptModalOpen} onClose={() => finalizeTransaction()}>
        <ModalDialog
          variant="outlined"
          role="alertdialog"
          aria-labelledby="receipt-modal-title"
          sx={{ maxWidth: 500 }}
        >
          <ModalClose />
          <Typography
            id="receipt-modal-title"
            level="h3"
            sx={{ mb: 2, textAlign: "center" }}
          >
            <ReceiptLongIcon sx={{ mr: 1, verticalAlign: "bottom" }} />
            Transaksi Berhasil
          </Typography>

          <Box
            sx={{
              border: "2px dashed",
              borderColor: "divider",
              borderRadius: "md",
              p: 2,
              mb: 2,
              bgcolor: "background.surface",
            }}
          >
            <Typography level="h4" sx={{ mb: 1, textAlign: "center" }}>
              Jaya Junior Tools
            </Typography>
            <Typography level="body-sm" sx={{ mb: 2, textAlign: "center" }}>
              Jl. Contoh Alamat No. 123, Jakarta Selatan
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography level="body-sm">No. Invoice:</Typography>
              <Typography level="body-sm" fontWeight="bold">
                {orderNumber}
              </Typography>
            </Box>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography level="body-sm">Tanggal:</Typography>
              <Typography level="body-sm">
                {new Date().toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </Typography>
            </Box>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography level="body-sm">Kasir:</Typography>
              <Typography level="body-sm">Admin</Typography>
            </Box>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography level="body-sm">Pelanggan:</Typography>
              <Typography level="body-sm">
                {selectedCustomer ? selectedCustomer.name : "Umum"}
              </Typography>
            </Box>

            {!isOnline && (
              <Alert
                color="warning"
                size="sm"
                sx={{ mt: 1, mb: 2 }}
                startDecorator={<WifiOffIcon fontSize="small" />}
              >
                <Typography level="body-xs">
                  Transaksi disimpan secara lokal. Akan disinkronkan saat
                  online.
                </Typography>
              </Alert>
            )}

            <Divider sx={{ my: 2 }} />

            <Typography level="body-sm" fontWeight="bold" sx={{ mb: 1 }}>
              Detail Pesanan:
            </Typography>

            {cart.map((item, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography level="body-sm">{item.product.name}</Typography>
                  <Typography level="body-sm">
                    Rp {item.total.toLocaleString("id-ID")}
                  </Typography>
                </Box>
                <Typography level="body-xs" sx={{ color: "text.tertiary" }}>
                  {item.quantity} x Rp {item.price.toLocaleString("id-ID")}
                </Typography>
              </Box>
            ))}

            <Divider sx={{ my: 2 }} />

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography level="body-sm">Subtotal:</Typography>
              <Typography level="body-sm">
                Rp {subtotal.toLocaleString("id-ID")}
              </Typography>
            </Box>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography level="body-sm" fontWeight="bold">
                Total:
              </Typography>
              <Typography level="body-sm" fontWeight="bold">
                Rp {total.toLocaleString("id-ID")}
              </Typography>
            </Box>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography level="body-sm">
                Pembayaran (
                {paymentMethod === "CASH"
                  ? "Tunai"
                  : paymentMethod === "BANK"
                  ? "Transfer Bank"
                  : "E-Wallet"}
                ):
              </Typography>
              <Typography level="body-sm">
                Rp {amountPaid.toLocaleString("id-ID")}
              </Typography>
            </Box>

            {paymentMethod === "CASH" && (
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography level="body-sm">Kembalian:</Typography>
                <Typography level="body-sm">
                  Rp {change.toLocaleString("id-ID")}
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            <Typography level="body-sm" sx={{ textAlign: "center", mb: 1 }}>
              Terima kasih telah berbelanja di Jaya Junior Tools
            </Typography>

            <Typography
              level="body-xs"
              sx={{ textAlign: "center", color: "text.tertiary" }}
            >
              Barang yang sudah dibeli tidak dapat dikembalikan
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
            <Button
              variant="outlined"
              color="neutral"
              startDecorator={<PrintIcon />}
            >
              Cetak Struk
            </Button>
            <Button
              variant="solid"
              color="primary"
              onClick={finalizeTransaction}
              startDecorator={<CheckCircleIcon />}
            >
              Selesai
            </Button>
          </Box>
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
