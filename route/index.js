const express = require("express");
const router = express.Router();

const auth = require("./auth");
const cars = require("./cars");

router.use("/auth", auth);
router.use("/cars", cars);

module.exports = router;
