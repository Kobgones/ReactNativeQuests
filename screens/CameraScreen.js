import React, { useRef } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { Camera } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";

export default function CameraScreen() {
	const [permission, requestPermission] = Camera.useCameraPermissions();
	const cameraRef = useRef(null);

	if (!permission) {
		return <View />;
	}
	if (!permission.granted) {
		return (
			<View style={styles.container}>
				<Text style={{ textAlign: "center" }}>
					We need your permission to show the camera
				</Text>
				<Button onPress={requestPermission} title="grant permission" />
			</View>
		);
	}
	return (
		<>
			<Camera style={styles.camera} ref={cameraRef} />
			<Button
				title="Take a picture"
				onPress={async () => {
					if (cameraRef.current) {
						const pictureMetadata =
							await cameraRef.current.takePictureAsync();
						console.log("pictureMetadata", pictureMetadata);
						console.log(
							await ImageManipulator.manipulateAsync(
								pictureMetadata.uri,
								[{ resize: { width: 800 } }]
							)
						);
					} else {
						console.log("Error while taking picture");
					}
				}}
			/>
		</>
	);
}

const styles = StyleSheet.create({
	camera: {
		flex: 1,
	},
	container: {
		flex: 1,
		justifyContent: "center",
	},
});
