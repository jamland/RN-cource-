import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";

import { Notifications } from "expo";
import * as Permissions from "expo-permissions";

const PUSH_ENDPOINT = "https://your-server.com/users/push-token";

const registerForPushNotificationsAsync = async () => {
  console.log("1");

  try {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    console.log("2");

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== "granted") {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    console.log("3");

    // Stop here if the user did not grant permissions
    if (finalStatus !== "granted") {
      return;
    }
    console.log("4");

    try {
      // Get the token that uniquely identifies this device
      let token = await Notifications.getExpoPushTokenAsync();

      console.log("5");
      console.log("token", token);

      // POST the token to your backend server from where you can retrieve it to send push notifications.
      return fetch(PUSH_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token: {
            value: token
          },
          user: {
            username: "Brent"
          }
        })
      });
    } catch (error) {
      console.warn(error);
    }
  } catch (error) {
    console.warn(error);
  }
};

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [libStatus, setLibStatus] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");

      const result = await MediaLibrary.requestPermissionsAsync();
      console.log("result", result);

      setLibStatus(result.status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const options = { quality: 1, base64: true };

      const data = await camera.takePictureAsync(options);

      // console.log("data", data);
      setImage(data.uri);

      if (libStatus) {
        const asset = await MediaLibrary.createAssetAsync(data.uri);

        console.log("2", asset);

        try {
          const album = await MediaLibrary.getAlbumAsync("Lohika");
          if (!album) {
            const album = await MediaLibrary.createAlbumAsync("Lohika", asset);
          } else {
            const result = await MediaLibrary.addAssetsToAlbumAsync(
              asset,
              album
            );
            console.log("result", result);
          }
        } catch (error) {
          console.log("error", error);
        }

        console.log("album", album);
        // try {
        //   const result = MediaLibrary.addAssetsToAlbumAsync([asset], album);
        //   console.log("result", result);
        // } catch (error) {
        //   console.log(error);
        // }
      }
      console.log(data);
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1 }}>
      {image !== null && (
        <Image
          source={{
            uri: image
          }}
          style={{ width: 100, height: 100 }}
        />
      )}

      <Camera
        style={{ flex: 1 }}
        type={type}
        ref={ref => {
          setCamera(ref);
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
            flexDirection: "row"
          }}
        >
          <TouchableOpacity
            style={{
              flex: 0.1,
              alignSelf: "flex-end",
              alignItems: "center"
            }}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          >
            <Text style={{ fontSize: 18, marginBottom: 10, color: "white" }}>
              {" "}
              Flip{" "}
            </Text>
          </TouchableOpacity>
        </View>
      </Camera>
      <TouchableOpacity
        style={{
          flex: 0.1,
          alignItems: "center"
        }}
        onPress={() => takePicture()}
      >
        <Text style={{ fontSize: 18, marginBottom: 10 }}>SNAP</Text>
      </TouchableOpacity>
    </View>
  );
}
