import { User } from "../models/usermodel.js";
import bcrypt from 'bcrypt'; 
import { createToken } from "../utils/token.js";
import  uploadOnCloudinary  from "../utils/Cloudinary.js";

export const signup = async(req,res,next) => {
 const  {name, phone,email,password ,role} = req.body;
 console.log("name, phone,email,password",name, phone,email,password,role)

 try {
       if(!name || !phone || !email || !password || !role){
        return res.json({message:"all filled required"});
       }
       let user = await User.findOne({ email });
       if(user){
           return res.send({message:"user already exist please,login"});
       }
      
       const hashPassword = await bcrypt.hash(password,10);
       if(!hashPassword){
        return res.send({message:"error in hashing the password"});
       }

      user = await User.create({
           name,
           email,
           phone,
           password:hashPassword,
           role,
       });

       const token = createToken(user._id);
       
       res.cookie("token",token,{
        httpOnly:'true',
        Secure:"false",
        sameSite:"lax",
         path:'/',
         maxAge:3*24*60*60*1000,
       });
       res.send({message:"user resister successfully"});
       next();
    } catch(err){
        console.log("Error in the register",err);
    }
       
}

export const login = async(req,res,next) => {
const {email,password} = req.body;
 try {
    if(!email || !password){
        return res.send({message:"Please provide email and password"});
    }
    const user = await User.findOne({ email });
   if(!user){
    return res.send({message:"user does not exit for given email,you can signup"})
   }

   const hashPassword = await bcrypt.compare(req.body.password,user.password);

  if(!hashPassword){
    return res.send({message:"Incorrect password"});
  }
   const token = createToken(user._id);
    res.cookie("token",token,{
        httpOnly:true,
        secure:false,
        sameSite:"lax",
        path:"/",
        maxAge:3*24*60*60*1000,
    })
     res.send("user login successfully");
    next();
 }catch(err){
    console.log("error occurs during login",err);
 }

}
    
const logout = async(req,res)=> {

  try {
        console.log("logout handler")
    res.clearCookie("token");

    return res.status(200).json({ message: "signOut successfully" });
  } catch (err) {
    return res.status(500).json(`singOut error ${err}`);
  }
}
export {logout}



// EditProfile = async(req,res) => {
//   try {
//     const userId = req.userId;
//     const { name, phone, email } = req.body;

//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { name, phone, email },
//       { new: true }
//     );

//     if (!updatedUser) {
//       return res.status(404).json({ message: "User not found" });
//     } else {
//       return res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
//     }     
//   } catch (err) {
//     console.error("Error updating profile:", err);
//     return res.status(500).json({ message: "An error occurred while updating the profile" });
//   }
// }

// export { EditProfile };



const AddImage = async (req, res) => {
  try {
    const userId = req.userId;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = await uploadOnCloudinary(req.file.path);

    if (!imageUrl) {
      return res.status(500).json({ message: "Upload failed" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { image: imageUrl },
      { new: true }
    );

    return res.status(200).json({
      message: "Image uploaded",
      user: updatedUser,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
export {AddImage}