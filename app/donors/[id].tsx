import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Animated,
  Alert,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import Loading from "@/components/Loading";
import { globalStyles } from "@/styles/globalStyles";
import { DonorPost, IDonation, IDonor } from "@/constants/types";
import { deleteDonor, getDonorById, updateDonor } from "@/utils/api/donors";
import { StyleSheet } from "react-native";
import { colors } from "@/styles/colors";
import ErrorMessage from "@/components/ErrorMessage";
import DonorDetailsScreen from "./add";
import Button from "@/components/Button";
import { getDonorDonations } from "@/utils/api/donations";
import { typography } from "@/styles/typography";
import DonationItem from "@/components/DonationItem";
import getCoordinatesFromAddress from "@/hooks/useAddressLocation";
import { useAuth } from "@/contexts/AuthContext";

interface DonorDetailsRef {
  getDonorDetails: () => Promise<DonorPost | null>;
}

const DonorPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {user, setUser} = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [donor, setDonor] = useState<IDonor>();
  const [lastDonations, setLastDonations] = useState<IDonation[]>();
  const [error, setError] = useState("");
  const donorRef = useRef<DonorDetailsRef>(null);
  const [sortAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    fetchDonor();
    fetchLastDonations();
  }, []);

  const fetchDonor = async () => {
    try {
      setIsLoading(true);
      const data = await getDonorById(id);
      setDonor(data);
    } catch (err) {
      setError("שגיאה בקליטת נתוני תורם");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLastDonations = async () => {
    try {
      const data = await getDonorDonations(id, 10);
      setLastDonations(data);
    } catch (err) {
      setError("שגיאה בקליטת נתוני תרומות לתורם");
    }
  };

  const renderDonationItem = useCallback(
    ({ item }: { item: IDonation }) => (
      <Animated.View style={{ transform: [{ translateX: sortAnimation }] }}>
        <TouchableOpacity
          style={globalStyles.card}
          onPress={() => router.push(`/donations/${item._id}`)}
        >
          <DonationItem donation={item} />
        </TouchableOpacity>
      </Animated.View>
    ),
    []
  );

  const handleUpdate = async () => {
    let donorDetails = null;
    if (donorRef.current) {
      donorDetails = await donorRef.current.getDonorDetails();
    }
    if (donorDetails?.address === undefined) return;
    if (
      donorDetails.address.country != donor?.address.country ||
      donorDetails.address.city != donor.address.city ||
      donorDetails.address.street != donor?.address.street ||
      donorDetails.address.building != donor.address.building
    ) {
      const coordinate = await getCoordinatesFromAddress(donorDetails.address);
      donorDetails.coordinate = coordinate || donor?.coordinate;
    }
    await updateDonor(donor?._id!, donorDetails);
    setDonor((prev) => {
      return { ...prev!, ...donorDetails };
    });
    setShowDetails(false);
  };

  const handleDelete = () => {
    Alert.alert("מחיקת תורם", "האם אתה בטוח שברצונך למחוק תורם זה?", [
      {
        text: "ביטול",
        style: "cancel",
      },
      {
        text: "מחק",
        style: "destructive",
        onPress: async () => {
          await deleteDonor(donor?._id!);
          setUser!({ ...user!, totalDonations: user!.totalDonations! - donor?.averageDonations!, });
          router.back();
        },
      },
    ]);
  };

  if (isLoading) return <Loading size={"large"} />;
  if (error) return <ErrorMessage error={error} handleFetch={fetchDonor} />;

  return (
    <FlatList
      style={[globalStyles.scrollContainer]}
      ListHeaderComponent={
        <>
          <Text style={[typography.header, { marginBottom: 5 }]}>
            {donor?.firstName} {donor?.lastName}
          </Text>
          <Text
            style={[
              typography.header,
              { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
            ]}
          >
            {donor?.address.street} {donor?.address.building}
            {donor?.address.apartment && "/" + donor?.address.apartment},{" "}
            {donor?.address.city} {donor?.address.country}
          </Text>
          <Text
            style={[typography.header, { fontSize: 16, fontWeight: "light" }]}
          >
            ממוצע תרומות: {donor?.averageDonations} ₪
          </Text>
          <Button
            title="הצג פרטי תורם"
            handlePress={() => setShowDetails(!showDetails)}
          />
          {showDetails && (
            <>
              <DonorDetailsScreen ref={donorRef} donor={donor} />
              <View style={styles.buttonContainer}>
                <FontAwesome
                 style={{marginTop: 20}}
                  onPress={handleDelete}
                  color={colors.primary}
                  name="trash"
                  size={24}
                />
                <Button
                  title="עדכן"
                  handlePress={handleUpdate}
                  containerStyles={{ flex: 1, marginTop: 10 }}
                />
              </View>
            </>
          )}
          <Text style={[typography.header, styles.border]}>תרומות אחרונות</Text>
        </>
      }
      ListFooterComponent={<View style={{ marginBottom: 20 }}></View>}
      data={lastDonations}
      renderItem={renderDonationItem}
      keyExtractor={(item) => item._id!}
      refreshing={isLoading}
      onRefresh={fetchLastDonations}
    />
  );
};

export default DonorPage;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
  },
  border: {
    borderTopColor: colors.lightGray,
    borderStyle: "dotted",
    borderTopWidth: 4,
    paddingTop: 20,
    fontSize: 20,
    marginBottom: 10,
  },
});
