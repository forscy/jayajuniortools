import { BASE_API_URL } from "../constants/url.constant";
import { UserCreateDTO, UserDTO } from "../dto/user.dto";
import { BaseController } from "./BaseController";

class UserController extends BaseController {
  constructor() {
    super(`${BASE_API_URL}/users`);
  }

  // Add methods for user-related API calls here, e.g., getUsers, createUser, etc.
  async getUsers(params: any) {
    return await this.setAuthHeader().get<UserDTO[]>("");
  }

  async createUser(userData: UserCreateDTO) {
    return await this.setAuthHeader().post<UserDTO>("", userData);
  }

  // update user status
  async updateUserStatus(userData: UserDTO) {
    return await this.setAuthHeader().put<UserDTO>(`/${userData.id}`, userData);
  }
}

const userController = new UserController();
export default userController;
