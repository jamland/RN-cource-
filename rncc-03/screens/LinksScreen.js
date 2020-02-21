import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, Text } from "react-native";
import { ExpoLinksView } from "@expo/samples";
import * as Sharing from "expo-sharing";

export default function LinksScreen() {
  const onShare = async () => {
    try {
      await Sharing.shareAsync(
        "file:///Users/apylypchuk/Library/Developer/CoreSimulator/Devices/155A6FC8-31F1-4603-AFAC-7403E7611717/data/Containers/Data/Application/7005B9EB-3F09-4E4F-B695-B540EEC6163F/Library/Caches/ExponentExperienceData/%2540jamland%252Frncc-03/Camera/5E20FD51-9072-4A9B-9D25-9DFDCA1A0EE8.jpg",
        {}
      );
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/**
       * Go ahead and delete ExpoLinksView and replace it with your content;
       * we just wanted to provide you with some helpful links.
       */}
      <TouchableOpacity onPress={onShare}>
        <Text>Share</Text>
      </TouchableOpacity>
      {/* <ExpoLinksView /> */}
    </ScrollView>
  );
}

LinksScreen.navigationOptions = {
  title: "Links"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff"
  }
});
