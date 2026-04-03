import { useEffect, useState } from "react";
import axios from "axios";

const MapComponent = () => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      setLocation({ lat, lng });

      // call backend
      const res = await axios.get(
        `http://localhost:8000/get-address?lat=${lat}&lng=${lng}`
      );

      const addr = res.data.results?.[0]?.formatted_address;
      setAddress(addr);
    });
  }, []);

  return (
    <div>
      <h2>Your Location</h2>

      {location && (
        <p>
          Lat: {location.lat}, Lng: {location.lng}
        </p>
      )}

      <h3>Address:</h3>
      <p>{address}</p>

      <div id="map" style={{ height: "400px", width: "100%" }}></div>
    </div>
  );
};

export default MapComponent;