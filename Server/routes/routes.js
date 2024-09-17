import Users from "../model/UserModel.js";
import DashboardUser from "../model/DashboardUser.js";
import UploadVideos from "../model/UploadVideos.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import ffprobeStatic from "ffprobe-static";
import path from "path";
import { fileURLToPath } from "url";
import { authenticateToken } from "../middleware/auth.js";
import { upload, uploadVideo } from "../middleware/upload.js";
import fs from "fs";

import express from "express";
// import { type } from "os";

const router = express.Router();

// Get the current file path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set ffmpeg and ffprobe paths
ffmpeg.setFfmpegPath(ffmpegStatic);
ffmpeg.setFfprobePath(ffprobeStatic.path);

//Display login form
router.get("/", (req, res) => {
  res.render("home");
});

//Display register form
router.get("/register", (req, res) => {
  try {
    const token = req.cookies.Jwtoken;
    if (token) {
      return res.redirect("/dashboard");
    } else {
      return res.render("register");
    }
  } catch (err) {
    res.status(500).json({
      message: "Internel Server Error",
      success: false,
    });
  }
});

//Display login form

router.get("/login", (req, res) => {
  try {
    const token = req.cookies.Jwtoken;
    if (token) {
      return res.redirect("/dashboard");
    } else {
      return res.render("login");
    }
  } catch (err) {
    res.status(500).json({
      message: "Internel Server Error",
      success: false,
    });
  }
});

//handle register form submission

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await Users.findOne({ email });

    if (user) {
      return res
        .status(409)
        .json({ message: "User is already exists", success: false });
    }
    const userModel = new Users({ name, email, password });

    userModel.password = await bcrypt.hash(password, 10);

    await userModel.save();
    res.redirect("/login");
  } catch (err) {
    res.status(500).json({
      message: "Internel Server Error",
      success: false,
    });
  }
});

// Handle login form submission

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Authentication is failed!", success: false });
    }
    const pass = await bcrypt.compare(password, user.password);

    if (!pass) {
      return res.status(401).json({
        message: "Authentication is failed, Worng password or email!",
        success: false,
      });
    }

    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_KEY,
      { expiresIn: "24hr" }
    );

    user.tokens.push({ token: jwtToken });
    await user.save();

    res.cookie("Jwtoken", jwtToken, {
      httpOnly: true,
      path: "/",
    });

    // console.log(req.cookies.jwt);

    res.redirect("/dashboard");
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
});

// Display dashboard page with token authentication

router.get("/dashboard", authenticateToken, async (req, res) => {
  try {
    const users = await DashboardUser.find().exec();
    res.render("dashboard", { users: users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Display the add page for adding new users

router.get("/add", (req, res) => {
  res.render("add", { title: "Add New User" });
});

//Edit existing user

router.get("/edit/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let user = await DashboardUser.findById(id);
    if (!user) {
      return res.redirect("/dashboard");
    }
    return res.render("edit_users", {
      user: user,
    });
  } catch (err) {
    console.error(err);
    return res.redirect("/dashboard");
  }
});

//Update exixting user data to dataBase

router.post("/update/:id", upload, async (req, res) => {
  let id = req.params.id;
  let new_image = "";

  if (req.file) {
    new_image = req.file.filename;
    const oldImagePath = path.join(
      __dirname,
      "/public/images/",
      req.body.old_image
    );

    if (fs.existsSync(oldImagePath)) {
      try {
        fs.unlinkSync(oldImagePath);
      } catch (err) {
        console.log("Failed to delete old image:", err);
      }
    } else {
      console.log("Old image not found:", oldImagePath);
    }
  } else {
    new_image = req.body.old_image;
  }

  try {
    await DashboardUser.findByIdAndUpdate(id, {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      image: new_image,
    });

    req.session.message = {
      type: "success",
      message: "User updated successfully!",
    };
    res.redirect("/dashboard");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
});

//Delete user route

router.get("/delete/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await DashboardUser.findByIdAndDelete(id);

    if (result && result.image) {
      const imagePath = path.join(__dirname, "../public/images", result.image);

      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
        } catch (err) {
          console.log("Failed to delete image:", err);
        }
      } else {
        console.log("Image not found:", imagePath);
      }
    }

    req.session.message = {
      type: "info",
      message: "User deleted successfully!",
    };
    res.redirect("/dashboard");
  } catch (err) {
    console.log("Error:", err.message);
    res.json({ message: err.message });
  }
});

//Delete the video

router.get("/deleteVideo/:id", async (req, res) => {
  let id = req.params.id;

  try {
    const video = await UploadVideos.findByIdAndDelete(id);

    if (video) {
      console.log("Video found:", video);

      if (typeof video.filename === "string" && video.filename.trim() !== "") {
        const videoPath = path.join(
          __dirname,
          "../public/videos",
          video.filename
        );
        if (fs.existsSync(videoPath)) {
          try {
            fs.unlinkSync(videoPath);
            console.log("Deleted video file:", videoPath);
          } catch (err) {
            console.log("Failed to delete video file:", err);
          }
        } else {
          console.log("Video file not found:", videoPath);
        }
      } else {
        console.log("Video filename is undefined or invalid");
      }

      if (
        typeof video.thumbnail === "string" &&
        video.thumbnail.trim() !== ""
      ) {
        const thumbnailPath = path.join(
          __dirname,
          "../public/thumbnails",
          video.thumbnail
        );
        if (fs.existsSync(thumbnailPath)) {
          try {
            fs.unlinkSync(thumbnailPath);
            console.log("Deleted thumbnail file:", thumbnailPath);
          } catch (err) {
            console.log("Failed to delete thumbnail file:", err);
          }
        } else {
          console.log("Thumbnail not found:", thumbnailPath);
        }
      } else {
        console.log("Thumbnail filename is undefined or invalid");
      }
    } else {
      console.log("No video found with the given ID");
    }

    req.session.message = {
      type: "info",
      message: "Video deleted successfully!",
    };
    res.redirect("/videos");
  } catch (err) {
    console.log("Error:", err.message);
    res.json({ message: err.message });
  }
});

//Display the videos router

router.get("/videos", async (req, res) => {
  try {
    const videos = await UploadVideos.find().exec();
    res.render("videos", { videos: videos });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Display the videoUploading Page

router.get("/upload", (req, res) => {
  res.render("upload", { title: "Video Upload" });
});

//Insert an user into database route

router.post("/add", upload, async (req, res) => {
  try {
    const user = new DashboardUser({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      image: req.file.filename,
    });
    await user.save();

    req.session.message = {
      type: "success",
      message: "User added successfully!",
    };
    res.redirect("/dashboard");
  } catch (err) {
    res.status(500).json({
      message: "Internel Server Error",
      success: false,
    });
  }
});

// Function to resolve directory paths correctly
function resolvePath(...segments) {
  return path.resolve(path.join(...segments));
}

router.post("/upload", uploadVideo, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No video file uploaded",
        success: false,
      });
    }

    console.log("Video file uploaded:", req.file.filename);

    const videoData = new UploadVideos({
      name: req.body.name,
      description: req.body.description,
      video: req.file.filename,
    });

    await videoData.save();
    console.log("Video data saved to MongoDB");

    const videoPath = resolvePath(
      __dirname,
      "..",
      "public",
      "videos",
      req.file.filename
    );
    const thumbnailPath = resolvePath(
      __dirname,
      "..",
      "public",
      "thumbnails",
      `${Date.now()}_thumbnail.png`
    );

    ffmpeg(videoPath)
      .on("end", async () => {
        console.log("Thumbnail generated");

        videoData.thumbnail = path.basename(thumbnailPath);
        await videoData.save();
        console.log("Thumbnail path saved to MongoDB");

        res.redirect("/videos");
      })
      .on("error", (err) => {
        console.error("Error generating thumbnail:", err);
        res.status(500).json({
          message: "Error generating thumbnail",
          success: false,
        });
      })
      .screenshots({
        count: 1,
        folder: resolvePath(__dirname, "..", "public", "thumbnails"),
        filename: path.basename(thumbnailPath),
        size: "256x128",
      });
  } catch (err) {
    console.error("Error in upload route:", err);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
});

//Logout route

router.post("/logout", async (req, res) => {
  try {
    const token = req.cookies.Jwtoken;
    if (token) {
      await Users.updateOne(
        { "tokens.token": token },
        { $pull: { tokens: { token: token } } }
      );
    }
    res.clearCookie("Jwtoken", { path: "/" });
    res.redirect("/");
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
});

export default router;
