const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const route = express.Router();

// Ensure uploads folder exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ✅ Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // absolute path
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// ✅ File filter (only images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|svg/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"), false);
  }
};

// ✅ Init multer
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter,
});

// ✅ Render Home Page
route.get("/", (req, res) => {
  res.render("register");
});

// ✅ Handle Upload
route.post("/upload", (req, res) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      return res.render("upload", {
        success: false,
        error: err.message,
      });
    }

    if (!req.file) {
      return res.render("upload", {
        success: false,
        error: "No file selected",
      });
    }

    res.render("upload", {
      success: true,
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`,
    });
  });
});


module.exports = route;
