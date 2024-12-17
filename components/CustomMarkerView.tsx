import React, { useCallback, memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CustomMarkerViewProps {
  icon: React.JSX.Element;
  name: string;
  avgDonations: string;
  color: string;
}
// numberOfLines={1} ellipsizeMode="tail"
const CustomMarkerView = memo(({ icon, name, avgDonations, color }: CustomMarkerViewProps) => {
  return (
    <View style={styles.markerContainer}>
      <View style={[styles.marker, { backgroundColor: color }]}>
        {icon}
      </View>
      <View style={styles.details}>
        <Text style={[styles.labelText, { color: color }]} >
          {name}
        </Text>
        {/* <Text style={[styles.labelText, { color: color }]}>
          {avgDonations}
        </Text> */}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  markerContainer: {
    flexDirection: 'row',
    //width: "auto",
    alignItems: "flex-start",
    //backgroundColor: 'white',
    //borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: 300,
    //backgroundColor: "red",
    margin: 0,
    padding: 0,
    maxWidth: 1220
  },
  marker: {
    padding: 4,
    borderRadius: 20,
    marginRight: 8,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  labelText: {
    fontSize: 13,
    fontWeight: '500',
   // maxWidth: 200,
  },
});

export default CustomMarkerView;