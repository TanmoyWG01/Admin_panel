import mongoose from "mongoose";
const Schema = mongoose.Schema;

const DashboardSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

export default mongoose.model("Dashboard", DashboardSchema);
