import React from 'react'
import { CiEdit } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import { setMyShopData } from '../../redux/ownerSlice.js';
import { useSelector } from 'react-redux';
import axios from 'axios';

export const ItemCard = ({ data }) => {
  const navigate = useNavigate();
  //  const url  = import.meta.data.VITE_SERVER_URL
const {myShopData} =useSelector((state)=>state.owner);
console.log("my shop data in the item card",myShopData);

const handleDelete = async(id)=> {

console.log("item id",id);
 
  const confirmMessage =  window.confirm("do you realy want to delete");
  if (confirmMessage) {
      try {
    
       const result = await axios.get(`http://localhost:8000/api/items/delete-item/${id}` ,{withCredentials:true});
  
     
        setMyShopData(result.data);

        alert("Item deleted successfully!");
        navigate('/')
      } catch (err) {
        console.error("Delete karne mein error aaya", err);
        alert("Delete fail ho gaya, kripya dobara koshish karein.");
      }
    }

}

  return (
  <div className="w-full flex justify-center my-5 ">
  <div className="w-full max-w-3xl bg-gray-100 rounded-lg shadow-md flex flex-col sm:flex-row overflow-hidden">

    {/* Image */}
<div className="relative sm:w-1/3 w-full h-52 bg-gray-100 flex items-center justify-center rounded-l-lg overflow-hidden">
  
  <img
    src={data?.image}
    alt={data?.name}
    className="max-h-full max-w-full object-contain"
  />

</div>
    {/* Content */}
    <div className="flex flex-col justify-center p-4 gap-2 flex-1">

      <p>
        <span className="font-semibold">Design:</span> {data?.name}
      </p>

      <p>
        <span className="font-semibold">Price:</span> ₹{data?.price}
      </p>

      <p className="text-gray-600 break-words">
        <span className="font-semibold">About:</span> {data?.description}
      </p>

      {/* Buttons */}
      <div className="flex gap-2 mt-2">
        <button
          className="bg-[#002fb0] px-3 py-1 rounded-md text-white"
          onClick={() => navigate(`/edit-item/${data._id}`)}
        >
          Edit
        </button>

        <button className="bg-[#e80202] px-3 py-1 text-white rounded-md" onClick={()=>handleDelete(data._id)}>
          Remove
        </button>
      </div>

    </div>
  </div>
</div>
  )
}
