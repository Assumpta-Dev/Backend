import { Users } from "../model/users";

declare global {
  namespace Express {
    interface Request {
      user?: Users;
    }
  }
}
