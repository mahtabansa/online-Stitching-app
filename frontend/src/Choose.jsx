import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { setRole } from "./redux/userSlice.js";
const Choose = () => {
  const userRole = useSelector((state) => state.user.role);
  const [showPopup, setShowPopup] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleSelect = (role) => {
    console.log("Selected Role:", role);
    dispatch(setRole(role));
    setShowPopup(false);

  };
  const handleClose = () => {
    setShowPopup(false);
    navigate('/');
  }

  return (
    <>
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">


          <div className="bg-[#FEFEFE] w-[90%] max-w-md rounded-2xl shadow-lg p-6 text-center relative">
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>
            <h2 className="text-2xl font-semibold mb-4">
              Choose Your Role
            </h2>

            <p className="text-gray-500 mb-6">
              Please select how you want to continue
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">

              <button
                onClick={() => handleSelect("customer")}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition"
              >
                Customer
              </button>

              <button
                onClick={() => handleSelect("tailor")}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition"
              >
                Tailor
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Choose;
