import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { CiLocationOn } from "react-icons/ci";
import { IoSearchOutline } from "react-icons/io5";
import { BiCurrentLocation } from "react-icons/bi";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { IoPhonePortraitOutline } from "react-icons/io5";
import { FiCreditCard } from "react-icons/fi";
import { BsBoxSeam } from "react-icons/bs";
import 'leaflet/dist/leaflet.css';
import Navbar from '../../Navbar.jsx';
import { setLocation, setAddress } from '../../redux/mapSlice.js';
import { setCurrentLocation,AddMyOrders } from '../../redux/userSlice.js';
import { FaScissors } from "react-icons/fa6";
import ChekOutItemCard from '../Tailor Cards/ChekOutItemCard.jsx';


function RecenterMap({ location }) {
      if (location.lat || location.log) {
            const map = useMap();
            map.setView([location.lat, location.log], map.getZoom(), { animate: true });
      }
}

const CheckOut = () => {
      const navigate = useNavigate();
      const dispatch = useDispatch();
      const { address } = useSelector(state => state.map);
      const { TotalAmount, ItemCard, Myorder, userData, location } = useSelector(state => state.user);

      const apikey = import.meta.env.VITE_GEOCODING_APIKEY;
      const [addressInput, setAddressInput] = useState(address || null);
      const [StitchingMethod, setStitchingMethod] = useState("tailor");
      const url = import.meta.env.VITE_SERVER_URL;

      const deliveryfees = TotalAmount > 500 ? 0 : 40;

      const ondragend = (e) => {
            const marker = e.target;
            const lat = marker._latlng.lat;
            const lon = marker._latlng.lng;
            dispatch(setCurrentLocation({ latitude: lat, longitude: lon }))
            dispatch(setLocation({ latitude: lat, longitude: lon }));
            getaddressByLatLog(lat, lon)
      }

      const getCurrentLocation = () => {
            console.log("location", location)
            const lat = location.latitude;
            const lon = location.longitude;
            dispatch(setLocation({ latitude: lat, longitude: lon }));
            getaddressByLatLog(lat, lon) // ye call karega current address ke liye 

      }

      const getaddressByLatLog = async (lat, lon) => {
            try {

                  const response = await axios.get(
                        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&type=postcode&format=json&apiKey=${apikey}`
                  );
                  console.log("response", response)
                  const data = response.data.results;

                  if (!data || data.length === 0) {
                        return "Address not found";
                  }

                  const addressData = data[0];

                  const fullAddress = `
            ${addressData.address_line2}
            ${addressData.address_line1}
          `.trim();

                  dispatch(setAddress(fullAddress));

            }
            catch (error) {
                  console.error("Error fetching address:", error);
                  return "Address not found";
            }
      }

      const getlatlogByAddress = async () => {
            try {

                  const response = fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&apiKey=${apikey}`, { withCredentials: true })
                        .then(resp => resp.json())
                        .then((geocodingResult) => {
                              console.log("Geocoding Result:", geocodingResult);
                              const { log, lat } = geocodingResult.features[0].properties;
                              dispatch(setLocation({ lat: lat, log: log }));
                        });


            }
            catch (err) {
                  console.log("errror occured during get lag and lat by city name", err);
            }
      }


      const handlePlaceOrder = async () => {
            await axios.post(`${url}/api/order/place-order`, {
                  ItemCard,
                  totalAmount: TotalAmount + deliveryfees,
                  deliveryAddress: addressInput,
                  loggitude: location.loggitude,
                  latitude: location.latitude,
                  StitchingMethod,

            }, { withCredentials: true })
                  .then(res => {
                        console.log("Order placed successfully:", res);
                      
                        // console.log("data", data);
                        // console.log("res.data.order", updatesOrder);
                        // if (paymentMethod === "cod") {

                              dispatch(AddMyOrders(res?.data?.order));
                              navigate('/')

                          

                        // } else {
                        //       console.log("const orderId = res.data.order.orderId:", res.data.orderId);
                        //       console.log("const razorOrder = res.data.order.razorOrder", res.data.razorOrder);
                        //       const orderId = res.data.orderId;
                        //       const razorOrder = res.data.razorOrder;
                        //       openRazorPayWindow(orderId, razorOrder)
                        // }
                  })
                  .catch(err => {
                        console.error("Error placing order:", err);
                  })
      }


      return (
            <>
                  <Navbar />

                  <div className='min-h-screen bg-[#fff9f6] flex items-center justify-center relative '>

                        <div className='flex absolute top-5 left-5 '>
                              <div className='z-10 ' onClick={() => navigate(-1)}>
                                    <IoArrowBack size={35} className='text-gray-800 cursor-pointer' />
                              </div>
                        </div>

                        <div className='w-full max-w-[900px] flex  flex-col rounded-lg bg-white shadow-lg space-y-6'>
                              <h1 className='font-bold text-2xl text-gray-800 m-4 text-center'>CheckOut</h1>
                              <section>
                                    <h2 className='flex items-center text-xl gap-2 m-4 font-bold'><CiLocationOn className='text-blue-700  text-2xl' />Pickup & Delivery Location</h2>

                                    <div className='gap-4 flex items-center m-4'>
                                          <input type="text" className='w-full rounded-md p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]' placeholder='Enter your pickup & delivery address..' value={addressInput} onChange={(e) => setAddressInput(e.target.value)} required/>
                                          <button className='bg-[#ff4d2d] text-white px-4 py-2 rounded-md hover:bg-[#ff4d2d]/90' onClick={getlatlogByAddress}>
                                                <IoSearchOutline size={20} />
                                          </button>

                                          <button className='bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer' onClick={getCurrentLocation}>
                                                <BiCurrentLocation onClick={getCurrentLocation} size={20} />
                                          </button>
                                    </div>
                              </section>

                              <div className='rounded-lg bg-gray-100 p-4 m-4  '>
                                    <div className='h-60 w-full '>

                                          <MapContainer center={[location.lat || 51.505, location.log || -0.09]} zoom={13} scrollWheelZoom={true} className="h-full w-full rounded-lg map-container">

                                                <TileLayer
                                                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                />
                                                <RecenterMap location={location} />
                                                <Marker position={[location.latitude || 51.505, location.longitude || -0.09]} draggable={true} eventHandlers={{ dragend: ondragend }}>
                                                      <Popup >
                                                            Give exact location for. <br /> fastest delivery
                                                      </Popup>
                                                </Marker>
                                          </MapContainer>
                                    </div>
                              </div>

                              {/* Choose Mode of Stitching */}
                              <section>
                                    <h2 className='text-lg font-semibold text-gray-800 m-6'>Choose Mode of Stitching </h2>

                                    <div className='grid grid-cols-1 sm:grid-cols-2  gap-4 m-4'>


                                          <div className={`flex items-center gap-3 rounded-lg bg-gray-100 p-4 py-4 text-left  hover:bg-gray-200 ${StitchingMethod == "tailor" ? " border border-blue-400  bg-gray-50" : "border-gray-200 hover:border-gray-300"}`} onClick={() => setStitchingMethod("tailor")}>
                                                <div className='p-2 bg-purple-100 rounded-full'>
                                                      <FaScissors className='text-blue-500' size={25} />
                                                </div>


                                                <div className='flex flex-col pb-1'>
                                                      <h1 className='text-gray-700 text-lg font-medium'> Everything on Doostep </h1>
                                                      <h1 className='text-gray-500 text-sm'>Tailor will come and pickup your clothes and measurement</h1>
                                                </div>
                                          </div>

                                          <div className={`flex items-center gap-3 rounded-lg bg-gray-100 p-4 py-4 text-left  hover:bg-gray-200 ${StitchingMethod == "parcel" ? "border border-blue-400  bg-gray-50" : "border-gray-200 hover:border-gray-300"}`} onClick={() => setStitchingMethod("parcel")}>
                                                <div className='p-2 bg-green-100 rounded-full'>
                                                      <BsBoxSeam className='text-green-500' size={30} />
                                                </div>


                                                <div className='flex flex-col pb-1'>
                                                      <h1 className='text-gray-700 text-lg font-medium'>Send Clothes and Same Sample </h1>
                                                      <h1 className='text-gray-500 text-sm'>After Booked you can send percel to the tailor
                                                      </h1>

                                                </div>
                                          </div>

                                    </div>

                              </section>

                              <section>
                                    <h2 className='text-lg font-semibold text-gray-800 m-6'>Your selected design </h2>
                                    <div className='m-4 bg-gray-100 p-4 rounded-lg'>


                                          <div className=''>
                                                {ItemCard?.map((item, idx) => (
                                                      <div key={idx} className='flex justify-between'>

                                                            <ChekOutItemCard item={item} key={item._id} />
                                                      </div>

                                                ))}

                                                <div className='flex justify-between my-2'>
                                                      <h3 className='text-gray-700'>Subtotal</h3>
                                                      <h3 className='text-gray-700'>₹{TotalAmount}</h3>
                                                </div>
                                                <div className='flex justify-between'>
                                                      <h3 className='text-gray-700'>Delivery Fee</h3>
                                                      <h3 className='text-gray-700'>₹{deliveryfees}</h3>
                                                </div>


                                                <hr className='my-2 border-gray-200' />
                                                <div className='flex justify-between'>
                                                      <h3 className='text-gray-800 font-bold text-xl '>Total</h3>
                                                      <h3 className='text-gray-800 font-bold text-xl '>₹{TotalAmount + deliveryfees}</h3>
                                                </div>
                                          </div>
                                    </div>
                              </section>

                              <section>
                                    <button className='w-[97%]  bg-gray-800 text-white py-2 p-4 m-4 rounded-md text-lg font-medium hover:bg-gray-600 ' onClick={handlePlaceOrder}>
                                          placeOrder
                                    </button>
                              </section>

                        </div>
                  </div>
            </>

      )
}

export default CheckOut