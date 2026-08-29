import { User } from "../models/usermodel.js";

const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(200).json({ message: "user Is not found" });
    }
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(400).json({ message: "user does not exist" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `get current user error ${error}` });
  }
};
export { getCurrentUser };

const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, phone ,house,sector,area,city,state} = req.body;
    
    console.log("req.body",name, phone ,house,sector,area,city,state);
    if(!name || !phone  || !house || !sector || !area || !city || !state){
     return res.status(400).json({message:"all field required!"})
    }
  
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name,phone,address:{house,sector,area,city,state} },
      { new: true },
    );
   
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    } else {
      return res
        .status(200)
        .json({ message: "Profile updated successfully", user: updatedUser });
    }
  } catch (err) {
    console.error("Error updating profile:", err);
    return res
      .status(500)
      .json({ message: "An error occurred while updating the profile" });
  }
};

export { updateProfile };
