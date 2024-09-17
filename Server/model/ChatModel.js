import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ChatSchema = new Schema(
  {
    members: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Chat", ChatSchema);
