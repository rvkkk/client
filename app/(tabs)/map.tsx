import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { globalStyles } from "@/styles/globalStyles";
import { colors } from "@/styles/colors";
import { typography } from "@/styles/typography";
import { findNearestDonors } from "@/utils/api/donors";
import {
  AntDesign,
  FontAwesome5,
  FontAwesome6,
  Ionicons,
} from "@expo/vector-icons";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import { Coordinate, IDonor, ISynagogue } from "@/constants/types";
import { findNearestSynagogues } from "@/utils/api/synagogues";
import useLocation from "@/hooks/useLocation";
import SearchBar from "@/components/SearchBar";
import getCoordinatesFromAddress from "@/hooks/useAddressLocation";
import ErrorMessage from "@/components/ErrorMessage";
import CustomMarkerView from "@/components/CustomMarkerView";

type LocationDetails = {
  coords: Coordinate | null;
  errorMsg: string;
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>;
  getUserLocation: () => Promise<void>;
  isLoading: boolean;
};

const MapScreen = () => {
  const [donors, setDonors] = useState<IDonor[]>([]);
  const [synagogues, setSynagogues] = useState<ISynagogue[]>([]);
  const [address, setAddress] = useState("");
  const [coordinate, setCoordinate] = useState<Coordinate>();
  const [regionDelta, setRegionDelta] = useState({
    latitudeDelta: 0.05,//0.0922,
    longitudeDelta: 0.05//0.0421,
  });
  const { user } = useAuth();
  const mapRef = useRef<MapView | null>(null);

  const {
    coords,
    errorMsg,
    setErrorMsg,
    getUserLocation,
    isLoading,
  }: LocationDetails = useLocation();

  const getLocationDetails = async (coords: Coordinate) => {
    try {
      const donorsData = await findNearestDonors(
        coords.coordinates[0],
        coords.coordinates[1]
      );
      setDonors(donorsData);
      const synagoguesData = await findNearestSynagogues(
        coords.coordinates[0],
        coords.coordinates[1]
      );
      setSynagogues(synagoguesData);
      console.log(donorsData, 1, synagoguesData);
    } catch (error) {
      console.log("Error fetching donors", error);
      setErrorMsg("שגיאה בקליטת נתוני תורמים");
    }
  };

  useEffect(() => {
    if (coords) {
      setCoordinate(coords);
      getLocationDetails(coords);
    }
  }, [coords]);

  useEffect(() => {
    setAddress("");
    setRegionDelta({
      latitudeDelta: 0.05,//0.0922,
      longitudeDelta: 0.05//0.0421,
    });
    mapRef.current?.animateToRegion(
      {
        longitude: coordinate!.coordinates[0],
        latitude: coordinate!.coordinates[1],
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      500
    );
  }, [coordinate]);

  const searchLocation = async () => {
    console.log(1456482, address);
    const coords = await getCoordinatesFromAddress(address);
    if (coords) {
      console.log(coords);
      setCoordinate(coords);
      getLocationDetails(coords);
    }
  };

  const zoomIn = () => {
    const newRegion = {
      latitudeDelta: regionDelta.latitudeDelta / 2,
      longitudeDelta: regionDelta.longitudeDelta / 2,
    };
    setRegionDelta(newRegion);
    mapRef.current?.animateToRegion(
      {
        ...newRegion,
        longitude: coordinate!.coordinates[0],
        latitude: coordinate!.coordinates[1],
      },
      500
    );
  };

  const zoomOut = () => {
    const newRegion = {
      latitudeDelta: regionDelta.latitudeDelta * 2,
      longitudeDelta: regionDelta.longitudeDelta * 2,
    };
    setRegionDelta(newRegion);
    mapRef.current?.animateToRegion(
      {
        ...newRegion,
        longitude: coordinate!.coordinates[0],
        latitude: coordinate!.coordinates[1],
      },
      500
    );
  };

  const SynagogueMarkerView = () => {
    return <FontAwesome5 name="star-of-david" size={22} color="yellow" />;
  };

  const DonorMarkerView = () => {
    return <FontAwesome6 name="user-large" size={22} color={colors.black} />;
  };

  // const CustomMarkerView = useCallback(({ icon, name, avgDonations, color } : {icon: React.JSX.Element, name: string, avgDonations: string, color: string}) => {
  //   return (
  //     <View style={[styles.row, { position: 'relative', flexDirection: 'row' }]}>
  //       <View style={[styles.marker, {backgroundColor: color}]}>
  //         {icon}
  //       </View>
  //       <View style={styles.details}>
  //         <Text style={[styles.labelText, {color: color}]}>{name}</Text>
  //         <Text style={[styles.labelText, {color: color}]}>{avgDonations}</Text>
  //       </View>
  //     </View>
  //   );
  // },[]);

  if (isLoading) {
    return (
      <View style={[globalStyles.container, { alignItems: "center" }]}>
        <Text style={typography.body}>טוען מיקום...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return <ErrorMessage error={errorMsg} handleFetch={getUserLocation} />;
  }

  return (
    <View style={styles.container}>
      <SearchBar
        placeHolder="חפש מיקום במפה"
        searchQuery={address}
        handleSearch={searchLocation}
        handleSave={setAddress}
        style={{ position: "absolute", top: 10, left: 10, right: 10 }}
      />

      {coordinate ? (
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              longitude: coordinate?.coordinates[0],
              latitude: coordinate?.coordinates[1],
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onRegionChangeComplete={(newRegion) => setRegionDelta(newRegion)}
          >
            <Marker
              coordinate={{
                longitude: coordinate?.coordinates[0],
                latitude: coordinate?.coordinates[1],
              }}
              title={`${user?.firstName} ${user?.lastName}`}
              icon={7}
              description="המיקום הנוכחי שלי"
              pinColor="red"
            />
            {donors.map((donor, index) => (
              <Marker
                key={donor._id}
                zIndex={index + 1}
                coordinate={{
                  longitude: donor.coordinate?.coordinates[0] || 0,
                  latitude: donor.coordinate?.coordinates[1] || 0,
                }}
                style={{maxWidth: 500, maxHeight: 300}}
                onPress={() => router.push(`/donors/${donor._id}`)}
              >
                <CustomMarkerView
                  icon={
                    <FontAwesome6 name="user-large" size={16} color="white" />
                  }
                  name={`${donor.firstName} ${donor.lastName}`}
                  avgDonations={
                    donor.averageDonations?.toString() + " ממוצע תרומות"
                  }
                  color="#81C784"
                />
              </Marker>
            ))}
            {synagogues.map((synagogue) => (
              <Marker
                key={synagogue._id}
                coordinate={{
                  longitude: synagogue.coordinate?.coordinates[0] || 0,
                  latitude: synagogue.coordinate?.coordinates[1] || 0,
                }}
                onPress={() => router.push(`/synagogues/${synagogue._id}`)}
              >
                <CustomMarkerView
                  icon={
                    <FontAwesome5
                      name="star-of-david"
                      size={16}
                      color="white"
                    />
                  }
                  name={`${synagogue.fullName}`}
                  avgDonations={
                    synagogue.averageDonations?.toString() + " ממוצע תרומות"
                  }
                  color="yellow"
                />
              </Marker>
            ))}
          </MapView>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.addButton} onPress={zoomIn}>
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={zoomOut}>
              <AntDesign name="minus" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text style={typography.body}>לא ניתן לאתר מיקום</Text>
      )}
    </View>
  );
}

export default memo(MapScreen);

const styles = StyleSheet.create({
  errorText: {
    ...typography.body,
    color: colors.error,
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#1976D2",
    padding: 10,
    borderRadius: 15,
    elevation: 5,
  },
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  buttons: {
    position: "absolute",
    bottom: 100,
    right: 20,
    flexDirection: "column",
    gap: 10,
  },

  markerContainer: {
    //alignItems: 'center',
    gap: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    //borderRadius: 20,
    //elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  details: {
    gap: 3,
    paddingHorizontal: 4,
    //backgroundColor: "white",
    width: 300,
  },
  marker: {
    padding: 4,
    borderRadius: 20,
  },
  labelText: {
    fontSize: 13,
    fontWeight: "500",
    textShadowColor: "white",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 1,
  },
});
