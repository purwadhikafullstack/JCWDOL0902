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
    FormHelperText,
    FormErrorMessage,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { ChangeProfilePicture } from "./ProfilePict";
import { ChangePassword } from "./ChangePassword";
const baseApi = process.env.REACT_APP_API_BASE_URL;
const serverApi = process.env.REACT_APP_SERVER;

const profileSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, "Too Short!")
        .max(30, "Too Long!")
        .required("Required"),
    phoneNumber: Yup.string()
        .test("numonly", "Only input numbers!", (val) => /^[0-9]+$/.test(val))
        .min(9, "Minimum 9 digit!")
        .max(13, "maximum 13 digit!")
        .required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
});

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

    const formik = useFormik({
        initialValues: {
            name: "",
            phoneNumber: "",
            email: "",
        },
        onSubmit: (values) => {
            handleSaveChanges();
        },
        validationSchema: profileSchema,
        validateOnBlur: true,
        validateOnChange: true,
    });

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
            // console.log(response.data);
            setUser(response.data);
            setName(response.data.name);
            setImage(response.data.photo_profile);
            setPhoneNumber(response.data.phone_number);
            setEmail(response.data.email);
            formik.setValues({
                name: response.data.name,
                email: response.data.email,
                phoneNumber: response.data.phone_number,
            });
        } catch (error) {}
    }, [decodedToken.id]);

    const handleSaveChanges = async () => {
        try {
            await axios.patch(
                `${baseApi}/users/profile-settings/${decodedToken.id}`,
                {
                    name: formik.values.name,
                    phone_number: formik.values.phoneNumber,
                },
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                }
            );
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
                <FormControl mb={4} isInvalid={!!formik.errors.name}>
                    <FormLabel>Name</FormLabel>
                    <Input
                        variant="filled"
                        type="text"
                        name="name"
                        onChange={formik.handleChange}
                        value={formik.values.name}
                    />
                    {formik.errors.name && formik.touched.name ? (
                        <FormErrorMessage>
                            {formik.errors.name}
                        </FormErrorMessage>
                    ) : null}
                </FormControl>

                <FormControl mb={4} isInvalid={!!formik.errors.phoneNumber}>
                    <FormLabel>Phone Number</FormLabel>
                    <Input
                        variant="filled"
                        type="text"
                        name="phoneNumber"
                        onChange={formik.handleChange}
                        value={formik.values.phoneNumber}
                    />
                    {formik.errors.phoneNumber && formik.touched.phoneNumber ? (
                        <FormErrorMessage>
                            {formik.errors.phoneNumber}
                        </FormErrorMessage>
                    ) : null}
                </FormControl>

                <FormControl mb={4} isInvalid={!!formik.errors.email}>
                    <FormLabel>Email</FormLabel>
                    <Input
                        type="text"
                        isDisabled
                        variant="filled"
                        name="email"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                    />
                    {formik.errors.email && formik.touched.email ? (
                        <FormErrorMessage>
                            {formik.errors.email}
                        </FormErrorMessage>
                    ) : null}
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
                    token={token}
                    getUser={getUser}
                />

                <ChangePassword user={user} token={token} />
                <Button
                    colorScheme="green"
                    mb={4}
                    m={2}
                    onClick={formik.handleSubmit}
                >
                    Save Changes
                </Button>
            </Box>
        </Center>
    );
};
