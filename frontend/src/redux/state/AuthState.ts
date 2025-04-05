import { UserDTO } from "../../dto/user.dto";


export interface AuthState {
  user: UserDTO | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}