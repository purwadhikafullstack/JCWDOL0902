import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    Image,
    InputRightElement,
    InputGroup,
    IconButton,
} from "@chakra-ui/react";
import { ViewOffIcon, ViewIcon } from "@chakra-ui/icons";
import pict from "../assets/reset_password.png";
import Axios from "axios";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { Field, ErrorMessage, Formik, Form } from "formik";
import { FooterComponent } from "../components/Footer";

const url = process.env.REACT_APP_API_BASE_URL + "/users";

export const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [user, setUser] = useState([]);
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setConfirmPass] = useState(false);

    const VerifyToken = async () => {
        try {
            const result = await Axios.get(`${url}/token-validator`, {
                headers: {
                    Authorization: `Bearer ${params.token}`,
                },
            });
            setUser(result.data.user);
        } catch (err) {
            navigate("/err");
        }
    };

    const resetPassSchema = Yup.object().shape({
        password: Yup.string()
            .required("Password is required")
            .min(8, "password must contain 8 or more characters"),
        password_confirmation: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords does not match")
            .required("Please match with password"),
    });

    const onResetPass = async (data) => {
        try {
            if (data.password !== data.password_confirmation) {
                return Swal.fire({
                    icon: "error",
                    title: "Oooops ...",
                    text: "Make sure password and confirm password match",
                    customClass: {
                        container: "my-swal",
                    },
                });
            }

            Swal.fire({
                icon: "success",
                title: "Reset Password Success",
                text: "You can now log in to your account, Happy shopping!",
                customClass: {
                    container: "my-swal",
                },
            });

            await Axios.patch(`${url}/reset-password`, {
                email: user,
                password: data.password,
                password_confirmation: data.password_confirmation,
            });
            navigate("/");
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Something went wrong!",
                customClass: {
                    container: "my-swal",
                },
            });
        }
    };

    const handlePass = () => {
        setShowPass(!showPass);
    };
    const handleConfirmPass = () => {
        setConfirmPass(!showConfirmPass);
    };
    useEffect(() => {
        VerifyToken();
    });

    return (
        <Stack minH={"100vh"} color="black">
            <Flex
                p={8}
                flex={1}
                align={"center"}
                justify={"center"}
                direction={{ base: "column", md: "row" }}
            >
                <Formik
                    initialValues={{
                        email: user,
                        password: "",
                        password_confirmation: "",
                    }}
                    validationSchema={resetPassSchema}
                    onSubmit={(value, action) => {
                        onResetPass(value);
                    }}
                >
                    {(props) => {
                        return (
                            <Form>
                                <Stack spacing={4} w={"full"} maxW={"md"}>
                                    <Heading
                                        fontSize={"2xl"}
                                        pb={5}
                                        fontFamily={"gantari"}
                                        fontWeight={"500"}
                                    >
                                        Create your New Password
                                    </Heading>

                                    <FormControl id="email">
                                        <FormLabel>Email address</FormLabel>
                                        <Field
                                            as={Input}
                                            type="email"
                                            value={user}
                                            disabled={user ? true : false}
                                        />
                                    </FormControl>
                                    <FormControl
                                        id="password"
                                        colorScheme={"white"}
                                    >
                                        <FormLabel> New Password</FormLabel>
                                        <InputGroup
                                            size="md"
                                            variant={"filled"}
                                        >
                                            <Field
                                                as={Input}
                                                type={
                                                    showPass
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="password"
                                            />
                                            <InputRightElement>
                                                <IconButton
                                                    color="black"
                                                    aria-label="Show Pasword"
                                                    onClick={handlePass}
                                                >
                                                    {showPass ? (
                                                        <ViewIcon />
                                                    ) : (
                                                        <ViewOffIcon />
                                                    )}
                                                </IconButton>
                                            </InputRightElement>
                                        </InputGroup>
                                        <ErrorMessage
                                            name="password"
                                            component="div"
                                            style={{ color: "red" }}
                                        />
                                    </FormControl>
                                    <FormControl id="password_confirmation">
                                        <FormLabel>Confirm Password</FormLabel>
                                        <InputGroup
                                            size="md"
                                            variant={"filled"}
                                        >
                                            <Field
                                                as={Input}
                                                type={
                                                    showConfirmPass
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="password_confirmation"
                                            />
                                            <InputRightElement>
                                                <IconButton
                                                    color="black"
                                                    aria-label="Show Pasword"
                                                    onClick={handleConfirmPass}
                                                >
                                                    {showConfirmPass ? (
                                                        <ViewIcon />
                                                    ) : (
                                                        <ViewOffIcon />
                                                    )}
                                                </IconButton>
                                            </InputRightElement>
                                        </InputGroup>
                                        <ErrorMessage
                                            name="password_confirmation"
                                            component="div"
                                            style={{ color: "red" }}
                                        />
                                    </FormControl>
                                    <Stack spacing={6}>
                                        <Stack
                                            direction={{
                                                base: "column",
                                                sm: "row",
                                            }}
                                            align={"start"}
                                            justify={"space-between"}
                                        ></Stack>
                                        <Button
                                            colorScheme="teal"
                                            variant={"solid"}
                                            type="submit"
                                        >
                                            Continue
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Form>
                        );
                    }}
                </Formik>
                <Image
                    src={pict}
                    alt="reset pass image"
                    maxW={{ base: "xs", md: "sm" }}
                    w="100%"
                    objectFit="cover"
                    mr={8}
                />
            </Flex>
            <FooterComponent />
        </Stack>
    );
};
