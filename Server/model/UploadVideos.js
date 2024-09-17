import mongoose from "mongoose";
const Schema = mongoose.Schema;

const VideoSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    unique: true,
  },
  video: {
    type: String,
    required: true,
  },
  thumbnail:{
    type:String,
  },
  created: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

export default mongoose.model("Video", VideoSchema);
