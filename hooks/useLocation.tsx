import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { Coordinate } from "@/constants/types";

const useLocation = () => {
  const [coords, setCoords] = useState<Coordinate | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const getUserLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("הרשאת גישה למיקום נדחתה");
        setIsLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      if (location) {
        const newCoords: Coordinate = {
          type: "Point",
          coordinates: [location.coords.longitude, location.coords.latitude],
        };
        setCoords(newCoords);

        let response = await Location.reverseGeocodeAsync(location.coords);
        console.log("user location", response);
      }
    } catch (error) {
      setErrorMsg("תקלה בקליטת נתוני מיקום נוכחי");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  return { coords, errorMsg, setErrorMsg, getUserLocation, isLoading };
};

export default useLocation;