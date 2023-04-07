import { View, Text, ScrollView, StyleSheet, Animated, Image, Alert, Touchable, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react';
import Input from '../components/Input';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Swiper from 'react-native-swiper';
import { Picker } from '@react-native-picker/picker';
import { TouchableOpacity } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from 'react-native-elements';
import COLORS from '../../conts/colors';
import Loader from '../components/Loader';

const AddScreen = ({navigation}) => {

	const [inputs, setInputs] = useState({
		name: '',
		veg: true,
		serves: '',
		imageID: 0,
		area: '',
		expiresIn: '',
		phNum: '',
		alt_phNum: '',
		address: '',
		landmark: '',
		desc: ''
	});


	
	const [errors, setErrors] = useState({});

	const [loading, setLoading] = useState(false);

	const [user, setUser] = useState();

	const { images, addFood, currentUser, getUserDetails } = useAuth();

	// onIndexChanged = (index) => {
	// 	setInputs(index);
	// };

	useEffect(() => {
		get();
	}, [])

	async function get() {
		const docRef = await getUserDetails();
		setUser(docRef.data())
		console.log("user", docRef.data());
	}


	const expiresIn = (value) => {
		setInputValue(value);
	};

	const hours = () => {
		// const numValue = parseInt(inputValue);
		if (isNaN(numValue)) {
			setResult('Invalid input');
		} else {
			setResult(`${numValue * 1000} milliseconds`);
		}
	};

	const validate = () => {
		Keyboard.dismiss();
		let isValid = true;

		if (!inputs.name) {
			handleError('Please input name', 'name');
			isValid = false;
		} else if (inputs.name.length < 3) {
			handleError('Please input a valid name', 'name');
			isValid = false;
		}

		if (!inputs.serves) {
			handleError('Please input serves', 'serves');
			isValid = false;
		}

		if (!inputs.area) {
			handleError('Please input area', 'area');
			isValid = false;
		}

		if (!inputs.phNum) {
			handleError('Please input contact number', 'phNum');
			isValid = false;
		} else if (inputs.phNum.length !== 10) {
			handleError('Please input valid 10 digit number', 'phNum');
			isValid = false;
		}

		if (!inputs.address) {
			handleError('Please enter the address', 'address');
			isValid = false;
		}

		if (!inputs.expiresIn) {
			handleError('Please enter the expiry time', 'expiresIn');
			isValid = false;
		}

		if (isValid) {
			Alert.alert(
                'Confirm Upload?',
                'Are you sure you want to upload?',
                [
                    {
                        text: 'No',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel'
                    },
                    {
                        text: 'Yes',
                        onPress: () => submit(),
                        style: 'destructive'
                    }
                ],
                { cancelable: false }
            );
		}
	};

	const submit = async () => {

		try {
			setLoading(true);
			await addFood(
				user.Name,
				inputs.name,
				inputs.imageID,
				inputs.veg,
				inputs.area,
				inputs.serves,
				inputs.expiresIn,
				inputs.phNum,
				inputs.alt_phNum,
				inputs.address,
				inputs.landmark,
				inputs.desc
			);
			setLoading(false)
			navigation.navigate("HomeScreen")
		} catch (error) {
			Alert.alert('Error', 'Something went wrong');
			console.log(error)
		}
		

	};

	const handleOnchange = (text, input) => {
		setInputs(prevState => ({ ...prevState, [input]: text }));
	};
	const handleError = (error, input) => {
		setErrors(prevState => ({ ...prevState, [input]: error }));
	};

	return (
		<>
			<View style={{ backgroundColor: '#5D5FEE', padding: 23 }}>
				<Text style={{ color: 'white', fontSize: 30, fontWeight: "bold" }}>Add Food Details</Text>
			</View>
            <Loader visible={loading} />
			<ScrollView style={{ backgroundColor: 'white' }}>
				<View style={{ marginVertical: 20, marginHorizontal: 20 }}>

					<View style={styles.container}>
						<Text style={styles.label}>Food Name<Text style={{ color: 'red' }}> *</Text></Text>
						{/* <TextInput
							style={styles.input}
							placeholder="Enter Food name"
							multiline={true}
							numberOfLines={1}
							onChangeText={handleChange}
							value={description}
						/> */}
						<Input
							onChangeText={text => handleOnchange(text, 'name')}
							onFocus={() => handleError(null, 'name')}
							placeholder="Enter food name"
							error={errors.name}
						/>
					</View>

					<View style={{
						marginBottom: 20,
						height: 280,
						backgroundColor: '#F3F4FB',
						// borderWidth:1,
						justifyContent: 'center',
						alignItems: 'center',
					}}>
						<Text style={styles.label}>Please Select the Food Type</Text>

						<Swiper onIndexChanged={item => handleOnchange(item, 'imageID')}>
							{images.map((image, index) => (
								<View key={index}>
									<Image source={image} style={{ margin: 10, width: "50%", height: 180, alignSelf: 'center' }} />
								</View>
							))}
						</Swiper>

					</View>

					<View style={[{ marginBottom: 20 }, styles.container]}>
						<Text style={styles.label}>Veg / Non-Veg<Text style={{ color: 'red' }}> *</Text></Text>
						<Picker style={{ backgroundColor: '#F3F4FB' }}
							selectedValue={inputs.veg}
							onValueChange={(itemValue, itemIndex) => handleOnchange(itemValue, 'veg')}
						>
							<Picker.Item label="Veg" value={true} />
							<Picker.Item label="Non-Veg" value={false} />
						</Picker>
					</View>

					<View style={styles.container}>
						<Text style={styles.label}>Serves<Text style={{ color: 'red' }}> *</Text></Text>
						<Input
							onChangeText={text => handleOnchange(text, 'serves')}
							onFocus={() => handleError(null, 'serves')}
							placeholder="Enter the no. of people can be served"
							error={errors.serves}
						/>
					</View>

					<View style={styles.container}>
						<Text style={styles.label}>Expires in<Text style={{ color: 'red' }}> *</Text></Text>
						<Input
							onChangeText={text => handleOnchange(text, 'expiresIn')}
							onFocus={() => handleError(null, 'expiresIn')}
							placeholder="For example: 12 "
							error={errors.expiresIn}
							keyboardType='numeric'
						/>

					</View>

					<View style={styles.container}>
						<Text style={styles.pnlabel}>Contact Number<Text style={{ color: 'red' }}> *</Text></Text>
						<Input
							onChangeText={text => handleOnchange(text, 'phNum')}
							onFocus={() => handleError(null, 'phNum')}
							placeholder="Enter the contact number "
							error={errors.phNum}
							keyboardType='numeric'
						/>
					</View>

					<View style={styles.container}>
						<Text style={styles.pnlabel}>Alternate Contact Number</Text>
						<Input
							onChangeText={text => handleOnchange(text, 'alt_phNum')}
							onFocus={() => handleError(null, 'alt_phNum')}
							placeholder="Enter the Alternate Contact number"
							error={errors.alt_phNum}
							keyboardType='numeric'
						/>
					</View>

					<View style={styles.container}>
						<Text style={styles.label}>Area<Text style={{ color: 'red' }}> *</Text></Text>
						<Input
							onChangeText={text => handleOnchange(text, 'area')}
							onFocus={() => handleError(null, 'area')}
							placeholder="Enter the Area"
							error={errors.area}
							style={styles.input}
						/>
					</View>

					<View style={styles.container}>
						<Text style={styles.label}>Address<Text style={{ color: 'red' }}> *</Text></Text>
						<Input
							onChangeText={text => handleOnchange(text, 'address')}
							onFocus={() => handleError(null, 'address')}
							placeholder="Enter the address"
							error={errors.address}
							multiline={true}
							style={styles.input}
							numberOfLines={4}
						/>
					</View>

					<View style={styles.container}>
						<Text style={styles.label}>Landmark</Text>
						<Input
							onChangeText={text => handleOnchange(text, 'landmark')}
							onFocus={() => handleError(null, 'landmark')}
							placeholder="Enter the near Landmark"
							error={errors.landmark}
						/>
					</View>

					<View style={styles.container}>
						<Text style={styles.label}>Description</Text>
						<Input
							multiline={true}
							numberOfLines={4}
							onChangeText={text => handleOnchange(text, 'desc')}
							onFocus={() => handleError(null, 'desc')}
							placeholder="Enter Description"
							error={errors.desc}
						/>
					</View>

					<Button
						buttonStyle={{ alignSelf: 'center', backgroundColor: COLORS.blue, width: 150 }}
						onPress={() => {
							validate();
							console.log('Upload pressed');
						}}
						title="Upload"
					/>

				</View>
			</ScrollView>
		</>
	)
	const summa = StyleSheet.create({
		card: {
			backgroundColor: "rgb(230,230,230)",
			width: "100%",
			height: "100%",
			borderRadius: 5,
			position: 'absolute',
			borderWidth: 1.5,
			borderColor: 'black',
			alignItems: 'center',
			justifyContent: 'center'

		}
	});
}


const styles = StyleSheet.create({
	container: {
		// margin:10,
		// marginBottom: 20,
	},

	Pickercontainer: {

		marginTop: 20,
		marginLeft: 10,
		marginRight: 10,
		marginVertical: 20
	},

	pnlabel: {

		fontSize: 18,
		color: '#5D5FEE',
		fontWeight: 'bold',
		paddingHorizontal: 10,
		marginBottom: 10,
	},

	// marginVertical: 5,
	//   fontSize: 14,
	//   fontWeight:'bold',
	//   paddingHorizontal: 10,
	//   color: COLORS.grey,
	label: {
		// margin:10,
		fontSize: 18,
		color: '#5D5FEE',
		fontWeight: 'bold',
		paddingHorizontal: 10,
		marginBottom: 10,
	},

	dlabel: {
		fontSize: 18,
		color: '#5D5FEE',
		fontWeight: 'bold',
		// paddingHorizontal: 10,
		marginBottom: 10,
	},

	input: {
		// width:'50%',
		// borderColor: '#dbdbdb',
		backgroundColor: '#F3F4FB',
		paddingHorizontal: 15,
		// borderWidth: 1,
		borderRadius: 5,
		padding: 10,
		fontSize: 14,
		textAlignVertical: 'top',
	},
});
export default AddScreen;