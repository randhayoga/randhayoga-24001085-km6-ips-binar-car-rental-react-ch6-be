const express = require("express");
const router = express.Router();

const authController = require("../controller/auth");
const { authMiddleware } = require("../middleware/auth");

router.post("/register", authController.registerUser);
router.post(
    "/addAdmin",
    authMiddleware(["superadmin"]),
    authController.registerAdmin
);
router.post("/login", authController.loginUser);
router.get("/", authMiddleware(["superadmin"]), authController.getAllUsers);
router
    .route("/:id")
    .get(authController.getUserByID)
    .put(authController.updateUser)
    .delete(authController.deleteUser);