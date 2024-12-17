import {
  Alert,
  Animated,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { IDonation, ISynagogue, SynagoguePost } from "@/constants/types";
import { router, useLocalSearchParams } from "expo-router";
import { getDonorDonations } from "@/utils/api/donations";
import { globalStyles } from "@/styles/globalStyles";
import { colors } from "@/styles/colors";
import SynagogueDetailsScreen from "./add";
import Button from "@/components/Button";
import {
  deleteSynagogue,
  getSynagogueById,
  updateSynagogue,
} from "@/utils/api/synagogues";
import { FontAwesome } from "@expo/vector-icons";
import DonationItem from "@/components/DonationItem";
import getCoordinatesFromAddress from "@/hooks/useAddressLocation";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import { typography } from "@/styles/typography";
import { FlatList } from "react-native";

interface SynagogueDetailsRef {
  getDonorDetails: () => Promise<SynagoguePost | null>;
}

const SynagoguePage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [synagogue, setSynagogue] = useState<ISynagogue>();
  const [lastDonations, setLastDonations] = useState<IDonation[]>();
  const [error, setError] = useState("");
  const [sortAnimation] = useState(new Animated.Value(0));
  const synagogueRef = useRef<SynagogueDetailsRef>(null);

  useEffect(() => {
    fetchSynagogue();
    fetchLastDonations();
  }, []);

  const fetchSynagogue = async () => {
    try {
      setIsLoading(true);
      const data = await getSynagogueById(id);
      console.log(data);
      setSynagogue(data);
    } catch (err) {
      setError("שגיאה בקליטת נתוני בית כנסת");
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
    let synagogueDetails = null;
    if (synagogueRef.current) {
      synagogueDetails = await synagogueRef.current.getDonorDetails();
      console.log(synagogueDetails)
    }
    if (synagogueDetails?.address === undefined) return;
    if (
      synagogueDetails.address.country != synagogue?.address.country ||
      synagogueDetails.address.city != synagogue.address.city ||
      synagogueDetails.address.street != synagogue?.address.street ||
      synagogueDetails.address.building != synagogue.address.building
    ) {
      const coordinate = await getCoordinatesFromAddress(
        synagogueDetails.address
      );
      synagogueDetails.coordinate = coordinate || synagogue?.coordinate;
    }
    await updateSynagogue(synagogue?._id!, synagogueDetails);
    setSynagogue((prev) => {
      return { ...prev!, ...synagogueDetails };
    });
    setShowDetails(false);
  };

  const handleDelete = () => {
    Alert.alert("מחיקת בית כנסת", "האם אתה בטוח שברצונך למחוק בית כנסת זה?", [
      {
        text: "ביטול",
        style: "cancel",
      },
      {
        text: "מחק",
        style: "destructive",
        onPress: async () => {
          await deleteSynagogue(synagogue?._id!);
          router.replace("/synagogues");
        },
      },
    ]);
  };

  if (isLoading) return <Loading size={"large"} />;
  if (error) return <ErrorMessage error={error} handleFetch={fetchSynagogue} />;

  return (
    <FlatList
      style={[globalStyles.scrollContainer, {marginBottom: 100}]}
      ListHeaderComponent={
        <>
          <Text style={[typography.header, { marginBottom: 5 }]}>
            {synagogue?.fullName}
          </Text>
          <Text
            style={[
              typography.header,
              { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
            ]}
          >
            {synagogue?.address.street} {synagogue?.address.building}
            {synagogue?.address.apartment && "/" + synagogue?.address.apartment}
            , {synagogue?.address.city} {synagogue?.address.country}
          </Text>
          <Text
            style={[typography.header, { fontSize: 16, fontWeight: "light" }]}
          >
            ממוצע תרומות: {synagogue?.averageDonations} ₪
          </Text>
          <Button
            title="הצג פרטי בית כנסת"
            handlePress={() => setShowDetails(!showDetails)}
          />
          {showDetails && (
            <>
              <SynagogueDetailsScreen
                synagogue={synagogue} ref={synagogueRef}
              />
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
          <Text style={[typography.subheader, styles.border]}>
            תרומות אחרונות
          </Text>
        </>
      }
      data={lastDonations}
      renderItem={renderDonationItem}
      keyExtractor={(item) => item._id!}
      refreshing={isLoading}
      onRefresh={fetchLastDonations}
    />
  );
};

export default SynagoguePage;

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
