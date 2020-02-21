import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Button,
  Image,
  ScrollView,
  TouchableHighlight
} from "react-native";

const { width } = Dimensions.get("screen");
export default function Screens() {
  console.log("herer");
  const [imageHash, setImageHash] = useState("");
  const uri = "https://picsum.photos/800/800";

  const getUsers = async () => {
    const result = await fetch("https://jsonplaceholder.typicode.com/users");
    const json = await result.json();
    console.log("result", json);
  };

  getUsers();

  const onPress = () => {
    setImageHash(Date.now());
  };

  return (
    <View style={styles.container}>
      <View style={styles.box1}>
        <TouchableHighlight onPress={onPress}>
          <Image
            style={{ width, height: "100%" }}
            source={{
              uri: `${uri}?${imageHash}`
            }}
          />
        </TouchableHighlight>
      </View>
      <ScrollView style={styles.box2}>
        <Button title="MY Button" onPress={onPress} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  box1: {
    // backgroundColor: "tomato",
    flex: 0.8,
    width
  },
  box2: {
    backgroundColor: "#ffffff",
    flex: 0.2,
    width,
    maxHeight: 200
  }
});
