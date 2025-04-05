import { Pagination } from "../../controllers/BaseController";
import { ProductDTO } from "../../dto/product.dto";

export interface ProductState {
  currentProduct?: ProductDTO | null;
  product: ProductDTO | null;
  products: ProductDTO[];
  pagination?: Pagination;
  loading: boolean;
  error: string | null;
}