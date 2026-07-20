import React, { useEffect, useState, useRef } from 'react'
import Navbar from '../../Navbar.jsx'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setMyShopData, updateShopItem } from '../../redux/ownerSlice.js';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from "react-icons/io5";
import { IoClose, IoAdd } from "react-icons/io5";
import { socket } from '../../socket.js'
import { ClipLoader } from 'react-spinners';

const MAX_IMAGES = 3;

const EditItem = () => {
  const { id } = useParams();
  const { myShopData } = useSelector((state) => state.owner);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const item = myShopData?.[0]?.items?.find((i) => i._id === id);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  // existingImages: URLs already in DB that user hasn't removed
  const [existingImages, setExistingImages] = useState([]);
  // newImages: freshly selected files, not yet uploaded
  const [newImages, setNewImages] = useState([]);
  const fileInputRef = useRef(null);

  const totalImageCount = existingImages.length + newImages.length;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setName(value);
    } else if (name === "description") {
      setDescription(value);
      e.target.style.height = "auto"
      e.target.style.height = e.target.scrollHeight + "px";
    } else if (name === "price") {
      setPrice(value);
    }
  }

  const handleAddImageClick = () => {
    if (totalImageCount >= MAX_IMAGES) return;
    fileInputRef.current.click();
  };

  const handleFileSelected = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (totalImageCount >= MAX_IMAGES) {
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewImages((prev) => [...prev, { file, preview: reader.result }]);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("shopId", myShopData[0]?.owner?._id);
    formData.append("existingImages", JSON.stringify(existingImages));
    newImages.forEach((img) => formData.append("images", img.file));

    try {
      setLoading(true)
      const url = import.meta.env.VITE_SERVER_URL;
      const response = await axios.post(`${url}/api/items/edit-item/${id}`, formData, { withCredentials: true })
      dispatch(updateShopItem({ itemId: response.data._id, item: response.data, shopId: response.data.shop }))
      setLoading(false)
      navigate('/')
    } catch (err) {
      setLoading(false)
      console.log(`errror while addig Items ${err}`);
    }
  }

  useEffect(() => {
    if (item) {
      setName(item?.name)
      setDescription(item?.description);
      setPrice(item?.price)

      // normalize existing images: handle array, single string, or "\n" joined entries
      const source = item?.images || item?.image;
      const rawArray = Array.isArray(source) ? source : (source ? [source] : []);
      const flattened = rawArray
        .flatMap((entry) => (typeof entry === "string" ? entry.split("\n") : entry))
        .map((url) => url?.trim())
        .filter(Boolean);
      setExistingImages([...new Set(flattened)]);
    }
    socket.on("EditItem", (data) => {
      dispatch(updateShopItem({ itemId: data.ItemId, item: data.Item, shopId: data.shopId }))
    })
  }, [id])

  return (
    <>
      <div className="flex flex-col items-center gap-5 mt-5 relative">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute top-5 left-5 text-2xl text-gray-800"
          aria-label="Go back"
        >
          <IoArrowBack />
        </button>

        <h1 className="text-3xl text-gray-600">Fill in all details</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-100 w-full max-w-md rounded-lg shadow-2xl pb-5"
        >
          <div className="px-5 mt-5">
            <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
              Design Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Design name"
              className="w-full p-2 border rounded"
              onChange={handleChange}
              value={name}
              required
            />
          </div>

          {/* Hidden file input - used for adding new images */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelected}
          />

          {/* Image slots */}
          <div className="px-5 mt-5">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Design Images ({totalImageCount}/{MAX_IMAGES})
            </label>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {existingImages.map((url, index) => (
                <div
                  key={`existing-${index}`}
                  className="relative flex-shrink-0 w-28 h-36 rounded-lg overflow-hidden border border-gray-300 bg-white"
                >
                  <img src={url} alt={`Design ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(index)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-black/80"
                    aria-label="Remove image"
                  >
                    <IoClose />
                  </button>
                </div>
              ))}

              {newImages.map((img, index) => (
                <div
                  key={`new-${index}`}
                  className="relative flex-shrink-0 w-28 h-36 rounded-lg overflow-hidden border border-gray-300 bg-white"
                >
                  <img src={img.preview} alt={`New design ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(index)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-black/80"
                    aria-label="Remove image"
                  >
                    <IoClose />
                  </button>
                </div>
              ))}

              {totalImageCount < MAX_IMAGES && (
                <button
                  type="button"
                  onClick={handleAddImageClick}
                  className="flex-shrink-0 w-28 h-36 rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors"
                  aria-label="Add another image"
                >
                  <IoAdd size={26} />
                </button>
              )}
            </div>
          </div>

          <div className="px-5 py-3">
            <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter a brief description of your design"
              className="w-full p-2 border rounded"
              onChange={handleChange}
              value={description}
              required
            />
          </div>

          <div className="px-5 py-3">
            <label htmlFor="price" className="block text-sm font-medium text-gray-900 mb-2">
              Stitching Price
            </label>
            <input
              id="price"
              type="number"
              name="price"
              placeholder="Enter your stitching price"
              className="w-full p-2 border rounded"
              onChange={handleChange}
              value={price}
              required
            />
          </div>

          <div className="flex justify-center pt-2">
            {loading ? <ClipLoader /> : (
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center justify-center"
              >
                Update Item
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  )
}

export default EditItem