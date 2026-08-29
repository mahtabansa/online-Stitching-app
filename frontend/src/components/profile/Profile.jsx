import { useSelector } from "react-redux";
import profileavtar from '../../assets/profileavtar.webp'
import { FaRegEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const ProfileSection = () => {
  const { userData } = useSelector((state) => state.user);
  console.log("userData", userData)
  const Navigate = useNavigate();
  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-md border border-gray-200 p-6 mt-4 relative">
      <span className="absolute -right-2 -top-2 p-4 text-2xl" onClick={() => Navigate('/update-profile')}><FaRegEdit /></span>
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">

        {/* Profile Image */}
        <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-100 border-4 border-gray-200 flex-shrink-0">
          <img
            src={userData?.userData?.image || profileavtar}
            alt={userData?.userData?.name || "User"}
            className="w-full h-full object-cover"
          />
        </div>

        {/* User Name */}
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-semibold text-gray-800">
            {(userData?.userData?.name.toUpperCase())}
          </h2>

          <p className="text-gray-500 mt-1">
            {userData?.address?.city},{" "}
            {userData?.address?.state}
          </p>
        </div>

      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-6"></div>

      {/* Location Details */}
      <div className="space-y-5">

        {/* City */}
        <div>
          <p className="text-sm text-gray-500 mb-1">
            City
          </p>
          <p className="text-base font-medium text-gray-800">
            {userData?.address?.city}
          </p>
        </div>

        {/* State */}
        <div>
          <p className="text-sm text-gray-500 mb-1">
            State
          </p>
          <p className="text-base font-medium text-gray-800">
            {userData?.address?.state }
          </p>
        </div>

        {/* phone */}
        <div>
          <p className="text-sm text-gray-500 mb-1">
            phone
          </p>

          <p className="text-base font-medium text-gray-800 leading-relaxed">
            {userData?.phone}
          </p>
        </div>

        {/* Address */}
        <div>
          <p className="text-sm text-gray-500 mb-1">
            Address
          </p>

          <p className="text-base font-medium text-gray-800 leading-relaxed">
            {userData?.address
              ? Object.values(userData.address)
                .filter(Boolean)
                .join(", ")
              : "Address not available"}
          </p>
        </div>

      </div>

    </div>
  );
};

export default ProfileSection;