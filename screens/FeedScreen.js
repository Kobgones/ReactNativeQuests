import { useFocusEffect } from "@react-navigation/native";
import { FlatList, Image, StyleSheet } from "react-native";
import React, { useState, useCallback } from "react";

import axios from "axios";

export default function FeedScreen() {
	const [nausicaaPictures, setNausicaaPictures] = useState([]);
	const [refreshing, setRefreshing] = useState(false);

	useFocusEffect(
		useCallback(() => {
			(async () => {
				try {
					const filesUrl = await axios.get(
						"https://wildstagram.nausicaa.wilders.dev/list"
					);
					console.log("filesurls", filesUrl.data);
					setNausicaaPictures(filesUrl.data);
				} catch (err) {
					console.log(err);
				}
			})();
		}, [])
	);

	const handleRefresh = useCallback(() => {
		setRefreshing(true); // Mettez à jour l'état de rafraîchissement à true

		axios.get("https://wildstagram.nausicaa.wilders.dev/list")
			.then((response) => {
				setNausicaaPictures(response.data); // Mettez à jour vos données avec les nouvelles images
				setRefreshing(false); // Remettez l'état de rafraîchissement à false une fois les nouvelles données chargées
			})
			.catch((error) => {
				console.error(error);
				setRefreshing(false); // Assurez-vous également de réinitialiser l'état de rafraîchissement en cas d'erreur
			});
	}, []);

	return nausicaaPictures.length > 0 ? (
		<FlatList
			data={nausicaaPictures}
			keyExtractor={(nausicaaPictures) => nausicaaPictures}
			renderItem={(itemData) => {
				console.log("item", itemData);
				return (
					<>
						<Image
							style={styles.image}
							source={{
								uri:
									"https://wildstagram.nausicaa.wilders.dev/files/" +
									itemData.item,
							}}
						/>
					</>
				);
			}}
			onRefresh={handleRefresh}
			refreshing={refreshing}
		/>
	) : null;
}
const styles = StyleSheet.create({
	image: {
		resizeMode: "cover",
		height: 500,
	},
});
