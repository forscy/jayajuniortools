import { BASE_API_URL } from "../constants/url.constant";
import { OrderCreateDTO, OrderDTO } from "../dto/order.dto";
import { BaseController } from "./BaseController";

class OrderController extends BaseController {
  constructor() {
    super(`${BASE_API_URL}/orders`);
  }

  // Add methods for order-related API calls here, e.g., getOrders, createOrder, etc.
  async getOrders(params: any) {
    return await this.setAuthHeader().get<OrderDTO[]>("");
  }

  async createOrder(orderData: OrderCreateDTO) {
    return await this.setAuthHeader().post<OrderDTO>("", orderData);
  }

  // update order status
  async updateOrderStatus(orderData: OrderDTO) {
    return await this.setAuthHeader().put<OrderDTO>(`/${orderData.id}`, orderData);
  }
}

const orderController = new OrderController();
export default orderController;
