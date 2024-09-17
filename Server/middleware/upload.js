import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const storageVideo = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/videos");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});


export const upload = multer({ storage: storage }).single("image");

export const uploadVideo = multer({storage: storageVideo}).single("video")



