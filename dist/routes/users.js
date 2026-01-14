import express from "express";
import { getAllUsers, getUserById, updateUser, deleteUser, } from "../controller/users";
const router = express.Router();
// GET all users
router.post("/", getAllUsers);
router.get("/", getAllUsers);
// GET single user by ID
router.post("/:id", getUserById);
router.get("/:id", getUserById);
// UPDATE a user by ID
router.put("/:id", updateUser);
// DELETE a user by ID
router.delete("/:id", deleteUser);
export default router;
//# sourceMappingURL=users.js.map