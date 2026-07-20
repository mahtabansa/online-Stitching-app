import React, { useState, useMemo } from 'react'
import { CiEdit } from "react-icons/ci";
import { IoChevronForward } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { deleteItem } from '../../redux/ownerSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { IoMdClose } from "react-icons/io";

export const ItemCard = ({ data }) => {
  const navigate = useNavigate();
  const { myShopData } = useSelector((state) => state.owner);
  const dispatch = useDispatch();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const [selectedImage,setSelectedImage] = React.useState(null);

  const images = useMemo(() => {
    const source = data?.images || data?.image;
    if (!source) return [];

    const rawArray = Array.isArray(source) ? source : [source];

    const flattened = rawArray
      .flatMap((entry) => (typeof entry === "string" ? entry.split("\n") : entry))
      .map((url) => url?.trim())
      .filter(Boolean);

    return [...new Set(flattened)];
  }, [data?.images, data?.image]);

  const hasMultipleImages = images.length > 1;

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handleDelete = async (id) => {
    const confirmMessage = window.confirm("do you really want to delete");
    if (confirmMessage) {
      try {
        const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/items/delete-item/${id}`, { withCredentials: true });
        dispatch(deleteItem({ shopId: result.data.shop, ItemId: result.data._id, Item: result.data }))
        alert("Item deleted successfully!");
        navigate('/')
      } catch (err) {
        console.error("Error while deleting item ", err);
        alert("Delete failed, please try again.");
      }
    }
  }

  const description = data?.description || "";
  const isLongDescription = description.length > 100;

  return (
    <div className="w-full flex justify-center my-5 ">
      <div className="w-full max-w-3xl bg-gray-100 rounded-lg shadow-md flex flex-col sm:flex-row overflow-hidden">

        {/* Image */}
        <div className="relative sm:w-1/3 w-full h-52 bg-gray-100 flex items-center justify-center rounded-l-lg overflow-hidden">
          {

          }
          <img
            src={images[currentImageIndex]}
            alt={data?.name}
            className="max-h-full max-w-full m-auto object-contain"
          onClick={()=>setSelectedImage(images[currentImageIndex])}
          />

          {hasMultipleImages && (
            <button
              type="button"
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 transition"
              aria-label="Next image"
             

            >
              <IoChevronForward size={18} />
            </button>
          )}

          {hasMultipleImages && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, index) => (
                <span
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full ${
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

          {selectedImage && (
            <div className='fixed inset-0 bg-black/80 flex items-center justify-center z-50 '>
              <img src={selectedImage} className='max-w-[80%] max-h-[60%] bg-gray-100' onClick={(e)=>e.stopPropagation(null)} />

                <button className=' absolute top-5 right-5 text-white text-2xl font-bold' onClick={()=>setSelectedImage(null)}><IoMdClose/></button>
            </div>
          )}


        {/* Content */}
        <div className="flex flex-col justify-center p-4 gap-2 flex-1">

          <p>
            <span className="font-semibold">Design:</span> {data?.name}
          </p>

          <p>
            <span className="font-semibold">Price:</span> ₹{data?.price}
          </p>

          <p className="text-gray-600 break-words">
            <span className="font-semibold">About:</span>{" "}
            {showMore || !isLongDescription
              ? description
              : `${description.slice(0, 100)}...`}
            {isLongDescription && (
              <button
                type="button"
                onClick={() => setShowMore((prev) => !prev)}
                className="text-blue-600 font-medium ml-1 hover:underline"
              >
                {showMore ? "Show less" : "Show more"}
              </button>
            )}
          </p>

          {/* Buttons - hidden while description is expanded */}
          {!showMore && (
            <div className="flex gap-2 mt-2">
              <button
                className="bg-[#002fb0] px-3 py-1 rounded-md text-white"
                onClick={() => navigate(`/edit-item/${data._id}`)}
              >
                Edit
              </button>

              <button className="bg-[#e80202] px-3 py-1 text-white rounded-md" onClick={() => handleDelete(data._id)}>
                Remove
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}