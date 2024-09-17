import mongoose from "mongoose";
const Schema = mongoose.Schema;

const messageSchema = new Schema({
 chatId:{
  type:String,
  required: true
 },
 senderId:{
  type: String,
  required: true
 },
 text:{
  type:String,
  required: true
 }
},{
  timestamps: true
})

export default mongoose.model("Message", messageSchema);