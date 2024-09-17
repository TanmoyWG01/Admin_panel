import Users from "../model/UserModel.js";

export const getUsers = async(req,res)=>{
   try {
    const data = await Users.find()
    res.status(200).json(data)
   } catch (error) {
    res.status(500).json(error)
   }
}