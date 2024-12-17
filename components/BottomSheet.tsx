import { StyleSheet, View } from "react-native";
import React, { forwardRef, useMemo } from "react";
import { PropsWithChildren } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";


type Ref = BottomSheetModal;

const CustomBottomSheet = forwardRef<Ref, PropsWithChildren>(({ children }, ref) => {
  const snapPoints = useMemo(() => ["50%", "75%"], []);

  console.log(98479847)
  return (
    <BottomSheetModal ref={ref} index={0} snapPoints={snapPoints} enablePanDownToClose>
      <View style={styles.contentContainer}>{children}</View>
    </BottomSheetModal>
  );
});

export default CustomBottomSheet;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});
