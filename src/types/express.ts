import { Users } from "../model/users.js";

declare global {
  namespace Express {
    interface Request {
      user?: Users;
    }
  }
}
