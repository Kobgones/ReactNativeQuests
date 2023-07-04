import * as FileSystem from "expo-file-system";
import { useFocusEffect } from "@react-navigation/native";
import { FlatList, Image, StyleSheet, Button, Alert } from "react-native";
import React, { useCallback, useState } from "react";
import singleFileUploader from "single-file-uploader";
import Constants from "expo-constants";

export default function ImagesScreen() {
	const [pictures, setPictures] = useState([]);

	useFocusEffect(
		useCallback(() => {
			(async () => {
				const images = await FileSystem.readDirectoryAsync(
					FileSystem.cacheDirectory + "ImageManipulator"
				);
				setPictures(images);
			})();
		}, [])
	);

	return pictures.length > 0 ? (
		<FlatList
			data={pictures}
			keyExtractor={(pictures) => pictures}
			renderItem={(itemData) => {
				console.log("item", itemData);
				return (
					<>
						<Image
							style={styles.image}
							source={{
								uri:
									FileSystem.cacheDirectory +
									"ImageManipulator/" +
									itemData.item,
							}}
						/>
						<Button
							title="Upload picture"
							onPress={async () => {
								try {
									await singleFileUploader(
										{
											distantUrl: "https://wildstagram.nausicaa.wilders.dev/upload",
											expectedStatusCode: 201,
											filename: itemData.item,
											filetype: "image/jpeg",
											formDataName:
												"fileData",
											localUri:
												FileSystem.cacheDirectory +
												"ImageManipulator/" +
												itemData.item,
											token: Constants
												.manifest
												.extra.token,
										},
										Alert.alert("File upload 👍🏽")
									);
								} catch (error) {
									Alert.alert(
										"An error occured while uploading the picture ❌"
									);
								}
							}}
						/>
					</>
				);
			}}
		/>
	) : null;
}

const styles = StyleSheet.create({
	image: {
		resizeMode: "cover",
		height: 500,
	},
});
