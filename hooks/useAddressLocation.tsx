import { Address } from "@/constants/types";
import axios from "axios";

const GOOGLE_MAPS_API_KEY = "AIzaSyAUSZt8LO6WXu_9KvQQqMCeJ4OiXZAm-N8";

const getCoordinatesFromAddress = async (address: Address | string) => {
  let fullAddress: string;
  if (typeof address === "object")
    fullAddress = `${address.building} ${address.street}, ${address.city}, ${address.country}`;
  else fullAddress = address;

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          address: fullAddress,
          key: GOOGLE_MAPS_API_KEY,
        },
      }
    );
console.log(response.data, 8888)
    if (response.data.status === "OK") {
      const location = response.data.results[0].geometry.location;
      return {
        type: "Point",
        coordinates: [location.lng, location.lat],
      };
    } else {
      throw new Error("Unable to get coordinates");
    }
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};

export default getCoordinatesFromAddress;
