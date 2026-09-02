import React from "react";
import {
  FaUser,
  FaMapMarkerAlt,
  FaStore,
  FaTshirt,
  FaClipboardCheck,
  FaTruck,
} from "react-icons/fa";

const steps = [
  {
    icon: <FaUser size={28} />,
    title: "1. Create an Account",
    description:
      "Sign up as a Customer or Tailor and log in to access all features.",
  },
  {
    icon: <FaMapMarkerAlt size={28} />,
    title: "2. Allow Location",
    description:
      "Enable your location to discover tailoring shops available in your city.",
  },
  {
    icon: <FaStore size={28} />,
    title: "3. Browse Nearby Shops",
    description:
      "Explore tailoring shops, compare services, prices, and available stitching designs.",
  },
  {
    icon: <FaTshirt size={28} />,
    title: "4. Select a Design",
    description:
      "Choose your favorite design, view images, pricing, and complete design details.",
  },
  {
    icon: <FaClipboardCheck size={28} />,
    title: "5. Place Your Order",
    description:
      "Confirm your order and provide the required details to the tailor.",
  },
  {
    icon: <FaTruck size={28} />,
    title: "6. Track Your Order",
    description:
      "Monitor your order status from acceptance to completion and delivery.",
  },
];

const HowWorks = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-5">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-[#C7843B]">
          How It Works
        </h1>

        <p className="text-center text-gray-600 mt-4 max-w-3xl mx-auto">
          Online Stitching makes tailoring simple. Follow these easy steps to
          discover nearby tailors, choose your favourite design, place an order,
          and track everything from one place.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {steps?.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6"
            >
              <div className="w-14 h-14 rounded-full bg-[#C7843B] text-white flex items-center justify-center">
                {step?.icon}
              </div>

              <h2 className="text-xl font-semibold mt-5">{step?.title}</h2>

              <p className="text-gray-600 mt-3 leading-7">
                {step?.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-[#C7843B] text-white rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold">
            Start Your Stitching Journey Today
          </h2>

          <p className="mt-4 text-lg">
            Find trusted tailoring shops near you, explore hundreds of designs,
            and place your order in just a few clicks.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowWorks;