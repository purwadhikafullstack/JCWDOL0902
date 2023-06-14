import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import decode from "jwt-decode";
import {
    Box,
    Button,
    Center,
    FormControl,
    FormLabel,
    Input,
    Text,
    Image,
    useToast,
} from "@chakra-ui/react";

import { ChangeProfilePicture } from "./ProfilePict";
import { ChangePassword } from "./ChangePassword";
const baseApi = process.env.REACT_APP_API_BASE_URL;
const serverApi = process.env.REACT_APP_SERVER;

export const Profile = () => {
    const [user, setUser] = useState([]);
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState("");

    const token = localStorage.getItem("token");
    const decodedToken = decode(token);
    const toast = useToast();
    const navigate = useNavigate();

    const onLogout = async () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const getUser = useCallback(async () => {
        try {
            const response = await axios.get(
                `${baseApi}/users/profile/${decodedToken.id}`,
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                }
            );

            setUser(response.data);
            setName(response.data.name);
            setImage(response.data.photo_profile);
            setPhoneNumber(response.data.phone_number);
            setEmail(response.data.email);
        } catch (error) {}
    }, [decodedToken.id]);

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handlePasswordChange = () => {
        // Logic for changing the password
        // Add your code here
    };

    const handleSaveChanges = async () => {
        try {
            await axios.patch(
                `${baseApi}/users/profile-settings/${decodedToken.id}`,
                {
                    name: name,
                    phone_number: phoneNumber,
                },
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                }
            );
            setTimeout(() => 2000);
            toast({
                position: "top",
                title: "Successfuly updating profile, please Re-Login",
                status: "success",
                isClosable: true,
            });
            setTimeout(() => onLogout(), 2500);
        } catch (error) {
            console.error("Error updating bio:", error);
        }
    };

    useEffect(() => {
        getUser();
    }, [getUser]);

    return (
        <Center>
            <Box p={4} maxWidth="400px">
                <FormControl mb={4}>
                    <FormLabel>Name</FormLabel>
                    <Input
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </FormControl>

                <FormControl mb={4}>
                    <FormLabel>Phone Number</FormLabel>
                    <Input
                        type="text"
                        name="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </FormControl>

                <FormControl mb={4}>
                    <FormLabel>Email</FormLabel>
                    <Input type="text" value={email} isDisabled />
                </FormControl>

                <FormLabel>Profile Picture</FormLabel>
                {image ? (
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius="md"
                        p={2}
                        mb={2}
                    >
                        <Image
                            borderRadius="lg"
                            src={`${serverApi}${image}`}
                            alt="Current Profile Picture"
                            maxH="200px"
                            maxW="200px"
                        />
                    </Box>
                ) : (
                    <Text>No profile picture available.</Text>
                )}

                <ChangeProfilePicture
                    user={user}
                    image={image}
                    setImage={setImage}
                    token={token}
                />

                <ChangePassword user={user} token={token} />
                <Button colorScheme="green" mb={4} onClick={handleSaveChanges}>
                    Save Changes
                </Button>
            </Box>
        </Center>
    );
};
