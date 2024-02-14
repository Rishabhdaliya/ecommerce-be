import express from "express";
import {
  signUp,
  login,
  updateUserById,
  allUsers,
  deleteUserById,
  userById,
} from "../controller/user.controller.js";

const router = express.Router();

router.post("/sign_up", signUp);
router.post("/auth", login);
router.put("/update_user/:_id", updateUserById);
router.get("/all_users", allUsers);
router.get("/single_user/:_id", userById);
router.delete("/remove_user/:_id", deleteUserById);

export default (app) => {
  app.use("/api/v1/user", router);
};
