const express = require("express");
const router = express.Router();
const { JWTProtection, restrictToAdmin } = require("../middleware/jwt");
const {
  getCategoriesList,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category");

router.get("/", getCategoriesList);
router.get("/:id", getCategory);

router.post("/", JWTProtection, restrictToAdmin, createCategory);
router.put("/:id", JWTProtection, restrictToAdmin, updateCategory);
router.delete("/:id", JWTProtection, restrictToAdmin, deleteCategory);

module.exports = router;
