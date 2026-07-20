import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { IoArrowBack } from "react-icons/io5";
import { IoClose, IoAdd } from "react-icons/io5";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from 'react-toastify';
import axiosInstance from '../../axiosInstance.js';
import { setMyShopData } from '../../redux/ownerSlice.js';

const MAX_IMAGES = 3;

const EditItem = () => {
  const { id } = useParams();
  const { myShopData } = useSelector((state) => state.owner);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // existingImages: array of URL strings already saved in DB (that user kept)
  const [existingImages, setExistingImages] = useState([]);
  // newImages: array of { file, preview } for freshly added images
  const [newImages, setNewImages] = useState([]);

  const fileInputRef = useRef(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState('');

  const totalImageCount = existingImages.length + newImages.length;

  // Fetch current item data on mount
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axiosInstance.get(
          `${import.meta.env.VITE_SERVER_URL}/api/items/get-item/${id}`,
          { withCredentials: true }
        );
        const item = response.data;

        setName(item?.name || "");
        setDescription(item?.description || "");
        setPrice(item?.price || "");

        // normalize images: handle array, single string, or "\n" joined entries
        const source = item?.images || item?.image;
        const rawArray = Array.isArray(source) ? source : (source ? [source] : []);
        const flattened = rawArray
          .flatMap((entry) => (typeof entry === "string" ? entry.split("\n") : entry))
          .map((url) => url?.trim())
          .filter(Boolean);
        setExistingImages([...new Set(flattened)]);
      } catch (err) {
        console.error("Error fetching item:", err);
        toast.error("Failed to load item details");
      } finally {
        setFetching(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") setName(value);
    else if (name === "description") {
      setDescription(value);
      e.target.style.height = "auto";
      e.target.style.height = e.target.scrollHeight + "px";
    } else if (name === "price") setPrice(value);
  };

  const handleAddImageClick = () => {
    if (totalImageCount >= MAX_IMAGES) return;
    fileInputRef.current.click();
  };

  const handleFileSelected = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (totalImageCount >= MAX_IMAGES) {
      toast.error("You can only have up to 3 images");
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

    if (!name.trim() || !description.trim() || !price.trim()) {
      toast.error("Please fill all required fields", { position: "bottom-left" });
      setError("Please fill all required fields");
      return;
    }

    if (totalImageCount === 0) {
      setError("At least one image is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("existingImages", JSON.stringify(existingImages));
    newImages.forEach((img) => formData.append("images", img.file));

    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_SERVER_URL}/api/items/edit-item/${id}`,
        formData,
        { withCredentials: true }
      );

      toast.success("Item updated successfully");
      setLoading(false);
      navigate('/');
    } catch (err) {
      setLoading(false);
      toast.error(err.customMessage || "Failed to update item");
      setError(err?.response?.data?.message);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader />
      </div>
    );
  }

  return (
    <>
      <div className="gap-5 mt-5">
        <div className='flex justify-center items-center gap-5 py-5'>
          <button type="button" onClick={() => window.history.back()} className="text-2xl text-gray-800" aria-label="Go back">
            <IoArrowBack />
          </button>
          <h1 className="text-2xl text-gray-600 mx-5 px-5">Edit item details</h1>
        </div>

        <div className='flex flex-col items-center py-5'>
          <form onSubmit={handleSubmit} className="bg-gray-100 w-full max-w-md rounded-lg shadow-2xl pb-5">
            <div className="px-5 mt-5">
              <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">Design Name</label>
              <input id="name" type="text" name="name" placeholder="Design name" className="w-full p-2 border rounded" onChange={handleChange} value={name} />
            </div>

            {/* Hidden file input - used for adding new images */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelected}
            />

            {/* Image slots - existing images + new images + add button */}
            <div className="px-5 mt-5">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Design Images ({totalImageCount}/{MAX_IMAGES})
              </label>

              <div className="flex gap-3 overflow-x-auto pb-2">
                {/* Existing images (already on server) */}
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

                {/* Newly added images (not yet uploaded) */}
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

                {/* Add button */}
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
              <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">Description</label>
              <textarea id="description" name="description" placeholder="Enter a brief description of your design" className="w-full p-2 border rounded" onChange={handleChange} value={description} />
            </div>

            <div className="px-5 py-3">
              <label htmlFor="price" className="block text-sm font-medium text-gray-900 mb-2">Stitching Price</label>
              <input id="price" type="number" name="price" placeholder="Enter your stitching price" className="w-full p-2 border rounded" onChange={handleChange} value={price} />
            </div>

            {error && <p className='text-center text-red-600 font-semibold'>{error}</p>}

            <div className='py-2'>
              <div className='flex justify-center pb-4' style={{ width: "100%" }}>
                {loading ? <ClipLoader className='text-white font-semibold' /> : (
                  <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded-md flex justify-center align-center'>Save changes</button>
                )}
              </div>
            </div>
          </form>

          <ToastContainer position="top-right" autoClose={5000} />
        </div>
      </div>
    </>
  )
}

export default EditItem