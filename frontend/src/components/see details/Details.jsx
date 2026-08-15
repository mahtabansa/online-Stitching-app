import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { IoLocationSharp } from "react-icons/io5";
import { BiAt } from "react-icons/bi";
import { setAddToCard, setCheckOut } from '../../redux/userSlice.js'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from "react-redux";
import {
  IoChevronBack,
  IoChevronForward,
} from "react-icons/io5";

const Details = () => {
  const { ItemsInMyCity  } = useSelector(
    (state) => state.user 
  );
  const { id } = useParams();
  const [showFullDescription, setShowFullDescription] = React.useState(false);
  const imageContainerRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!ItemsInMyCity || ItemsInMyCity.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-gray-500 text-lg">
          No tailor details found.
        </p>
      </div>
    );
  }

  const item = ItemsInMyCity.find(
    (item) => item._id === id
  );

    const handleBook = () => {
      dispatch(setCheckOut({...item, quantity: 1}));
      navigate('/checkout')
    }



  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-gray-500 text-lg">
          Tailor not found.
        </p>
      </div>
    );
  }

  const images =
    item.image && item.image.length > 0
      ? item.image
      : ["/media/dummy_pic.jpg"];

  // ================= MOVE RIGHT =================
  const moveRight = () => {
    if (imageContainerRef.current) {
      imageContainerRef.current.scrollBy({
        left: imageContainerRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  };

  // ================= MOVE LEFT =================
  const moveLeft = () => {
    if (imageContainerRef.current) {
      imageContainerRef.current.scrollBy({
        left: -imageContainerRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-3 sm:px-5 md:px-8 py-5 sm:py-8">
      {/* ================= HEADING ================= */}
      <div className="flex justify-center w-full flex items-center  gap-5 my-4 ">
        <span
          className="
          text-xl
          sm:text-2xl
          md:text-3xl
          font-semibold
          text-center
          text-gray-800
          "
          onClick={() => window.history.back(-1)}
        >
         <FaArrowLeft />
        </span>
        <span
          className="
          text-xl
          sm:text-2xl
          md:text-3xl
          font-semibold
          text-center
          text-gray-800
          px-4
        "
        >
          Tailor Details
        </span>
      </div>

      {/* ================= MAIN CARD ================= */}
      <div
        className="
          w-full
          max-w-md
          mx-auto
          bg-white
          rounded-2xl
          shadow-lg
          overflow-hidden
        "
      >

        {/*                    IMAGE SECTION                  */}

        <div className="relative sm:w-full sm:h-auto bg-white">

          {/* IMAGE CONTAINER */}
          <div
            ref={imageContainerRef}
            className="
              flex
              w-auto
              overflow-x-auto
              snap-x
              snap-mandatory
              scroll-smooth
              scrollbar-hide
            "
          >
            {images.map((img, index) => (
              <div
                key={index}
                className="
                  flex-shrink-0
                  w-full
                  aspect-[4/5]
                  snap-center
                  flex
                  items-center
                  justify-center
                  bg-white
                  overflow-hidden
                  px-4
                  sm:px-8
                  md:px-12
                "
              >
                <img
                  src={img}
                  alt={`Tailor ${index + 1}`}
                  className="
                    w-full
                    h-full
                    object-contain
                  "
                />
              </div>
            ))}
          </div>

          {/* ================= LEFT BUTTON ================= */}
          {images.length > 1 && (
            <button
              onClick={moveLeft}
              className="
                absolute
                left-2
                sm:left-4
                top-1/2
                -translate-y-1/2
                z-10

                w-9
                h-9
                sm:w-11
                sm:h-11

                flex
                items-center
                justify-center

                rounded-full
                bg-white
                shadow-md
                border
                border-gray-200

                text-gray-700

                hover:bg-gray-100
                active:scale-95

                transition-all
                duration-200
              "
            >
              <IoChevronBack className="text-xl sm:text-2xl" />
            </button>
          )}

          {/* ================= RIGHT BUTTON ================= */}
          {images.length > 1 && (
            <button
              onClick={moveRight}
              className="
                absolute
                right-2
                sm:right-4
                top-1/2
                -translate-y-1/2
                z-10

                w-9
                h-9
                sm:w-11
                sm:h-11

                flex
                items-center
                justify-center

                rounded-full
                bg-white
                shadow-md
                border
                border-gray-200

                text-gray-700

                hover:bg-gray-100
                active:scale-95

                transition-all
                duration-200
              "
            >
              <IoChevronForward className="text-xl sm:text-2xl" />
            </button>
          )}

          {/* ================= PHOTO COUNT ================= */}
          {images.length > 1 && (
            <div
              className="
                absolute
                bottom-3
                right-3
                sm:right-5

                bg-black/60
                text-white

                text-xs
                sm:text-sm

                px-3
                py-1
                rounded-full
              "
            >
              {images.length} Photos
            </div>
          )}
        </div>

        {/*                  DETAILS SECTION                  */}

        <div className="border-t border-gray-100">
          <div
            className="
              p-5
              sm:p-7
              md:p-9
            "
          >
            {/* ================= TAILOR NAME ================= */}
            <h2
              className="
                text-2xl
                sm:text-3xl
                font-bold
                text-gray-900
                mb-2
              "
            >
              {item.name || "Fashion World"}
            </h2>

            {/* ================= BOUTIQUE ================= */}

            <div className="flex items-start gap-3 mb-5">

              <BiAt
                className="
                  text-2xl
                  text-orange-600
                  flex-shrink-0
                  mt-0.5
                "
              />

              <div>
                <p className="text-sm text-gray-500">
                  Boutique
                </p>

                <p className="font-semibold text-gray-800">
                  {item.shopName || "Fashion World"}
                </p>
              </div>

            </div>


            {/* ================= DESCRIPTION ================= */}

            <div className="mb-6">

              <h3
                className="
                  text-lg
                  sm:text-xl
                  font-semibold
                  text-gray-900
                  mb-2
                "
              >
                About this Tailor
              </h3>


              <p
                className={`text-sm
                  sm:text-base
                  text-gray-600
                  leading-7
                   ${showFullDescription ? "" : "line-clamp-3"}`}

              >
                {item.description ||
                  "Get your clothes perfectly stitched according to your preferred design and measurements. Our tailor provides quality stitching services with attention to detail and your personal style."}
              </p>
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                {showFullDescription ? "Show Less" : "Show More"}
              </button>

            </div>


            {/* ================= LOCATION ================= */}

            <div className="flex items-start gap-3 mb-6">

              <IoLocationSharp
                className="
                  text-2xl
                  text-red-500
                  flex-shrink-0
                  mt-0.5
                "
              />

              <div>

                <p className="text-sm text-gray-500">
                  Location
                </p>

                <p
                  className="
                    font-medium
                    text-gray-700
                    leading-6 
                  "
                >
                  {item.address ||
                    "Nizamuddin Colony, near Jama Masjid"}
                </p>

              </div>

            </div>


            {/* ================= SERVICES ================= */}

            <div className="mb-7">

              <h3
                className="
                  text-lg
                  sm:text-xl
                  font-semibold
                  text-gray-900
                  mb-3
                "
              >
                Services
              </h3>

              <div className="flex flex-wrap gap-2">

                <span
                  className="
                    px-3
                    py-2
                    rounded-full
                    bg-orange-50
                    text-orange-700
                    text-sm
                    font-medium
                  "
                >
                  Custom Stitching
                </span>

                <span
                  className="
                    px-3
                    py-2
                    rounded-full
                    bg-orange-50
                    text-orange-700
                    text-sm
                    font-medium
                  "
                >
                  Measurements
                </span>

                <span
                  className="
                    px-3
                    py-2
                    rounded-full
                    bg-orange-50
                    text-orange-700
                    text-sm
                    font-medium
                  "
                >
                  Alteration
                </span>

                <span
                  className="
                    px-3
                    py-2
                    rounded-full
                    bg-orange-50
                    text-orange-700
                    text-sm
                    font-medium
                  "
                >
                  Designer Wear
                </span>

              </div>

            </div>


            {/* ================= DIVIDER ================= */}

            <div className="border-t border-gray-200 mb-6"></div>


            {/* ================= BOOK BUTTON ================= */}

            <button
              className="
                w-full
                py-3.5
                sm:py-4
                rounded-xl
                bg-gray-700              
                active:scale-[0.98]
                text-base
                sm:text-lg
                font-semibold
                shadow-md
                hover:bg-[#C7843B] 
                 text-white
                transition-all
                duration-200
              "
              onClick={handleBook}
            >
              Book Tailor
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Details;

