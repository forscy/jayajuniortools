import { BASE_API_URL } from "../types/constants";
import { BaseController } from "./BaseController";
import { User } from "../types";

class AuthController extends BaseController {
  constructor() {
    super(`${BASE_API_URL}/auth`);
  }

  // User login
  public async signIn(credentials: { email: string; password: string }) {
    return this.post<{ token: string; user: User }>("/signin", credentials);
  }

  // User registration
  public async signUp(userData: { name: string; email: string; password: string }) {
    return this.post<{ token: string; user: User }>("/signup", userData);
  }

  // Get current user profile
  public async getMe() {
    return this.get<User>("/me");
  }

  // Logout user (if server-side logout is needed)
  public async logout() {
    return this.post<null>("/logout", {});
  }
}

const authController = new AuthController();

export default authController;