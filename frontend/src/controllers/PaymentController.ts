import { BASE_API_URL } from "../constants/url.constant";
import { PaymentCreateDTO, PaymentDTO } from "../dto/payment.dto";
import { BaseController } from "./BaseController";

class PaymentController extends BaseController {
  constructor() {
    super(`${BASE_API_URL}/payments`);
  }

  // Add methods for payment-related API calls here, e.g., getPayments, createPayment, etc.
  async getPayments(params: any) {
    return await this.setAuthHeader().get<PaymentDTO[]>("");
  }

  async createPayment(paymentData: PaymentCreateDTO) {
    return await this.setAuthHeader().post<PaymentDTO>("", paymentData);
  }

  // update payment status
  async updatePaymentStatus(paymentData: PaymentDTO) {
    return await this.setAuthHeader().put<PaymentDTO>(`/${paymentData.id}`, paymentData);
  }

  // pay payment
  async pay(paymentData: any) {
    return await this.setAuthHeader().post<PaymentDTO>(`/pay`, paymentData);
  }
}

const paymentController = new PaymentController();
export default paymentController;
