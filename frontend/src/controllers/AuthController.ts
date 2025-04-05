import { BASE_API_URL } from "../constants/url.constant";
import { BaseController } from "./BaseController";
import { UserDTO } from "../dto/user.dto";
import {
  getTokenInLocalStorage,
  removeTokenInLocalStorage,
} from "../utils/localStorageUtil";

class AuthController extends BaseController {
  constructor() {
    super(`${BASE_API_URL}/auth`);
  }

  // Check is authenticated or not by token in cookie
  public async isAuthenticated() {
    if (!getTokenInLocalStorage()) {
      throw new Error("You are not authenticated");
    } else {
      return this.setAuthHeader().get<{
        isAuthenticated: boolean;
        user: UserDTO;
        token: string;
      }>("/is-authenticated");
    }
  }

  // User login
  public async signIn(credentials: { email: string; password: string }) {
    return this.post<{ token: string; user: UserDTO }>("/signin", credentials);
  }

  // User registration
  public async signUp(userData: {
    name: string;
    email: string;
    password: string;
  }) {
    return this.post<{ token: string; user: UserDTO }>("/signup", userData);
  }

  // Get current user profile
  public async getMe() {
    return this.setAuthHeader().get<UserDTO>("/me");
  }

  // Logout user (if server-side logout is needed)
  public async logout() {
    removeTokenInLocalStorage();
    return;
  }
}

const authController = new AuthController();

export default authController;
