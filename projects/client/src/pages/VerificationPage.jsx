import React from "react";
import { useState, useEffect } from "react";
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
import Axios from "axios";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { Field, ErrorMessage, Formik, Form } from "formik";
import verification_pict from "../assets/verification.png";
import { FooterComponent } from "../components/Footer";

const url = process.env.REACT_APP_API_BASE_URL + "/users";

export const VerificationPage = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [user, setUser] = useState([]);
    const [show, setShow] = useState(false);
    const [showConfirm, setConfirm] = useState(false);

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

    const signUpSchema = Yup.object().shape({
        password: Yup.string()
            .required("Password is required")
            .min(8, "password must contain 8 or more characters"),
        password_confirmation: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords does not match")
            .required("Please match with password"),
    });

    const OnSignUp = async (data) => {
        try {
            if (data.password !== data.password_confirmation) {
                return Swal.fire({
                    icon: "error",
                    title: "Oooops ...",
                    text: "Password does not match",
                    customClass: {
                        container: "my-swal",
                    },
                });
            }
            Swal.fire({
                icon: "success",
                title: "Account Verified",
                text: "Your account is successfully verified!",
                customClass: {
                    container: "my-swal",
                },
            });

            await Axios.patch(`${url}/activation`, {
                email: user,
                password: data.password,
                password_confirmation: data.password_confirmation,
            });
            navigate("/");
        } catch (err) {
            console.log(err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.response.data.message,
                customClass: {
                    container: "my-swal",
                },
            });
        }
    };

    const handlePassword = () => {
        setShow(!show);
    };
    const handleConfirmPassword = () => {
        setConfirm(!showConfirm);
    };

    useEffect(() => {
        VerifyToken();
    });

    return (
        <Stack minH={"100vh"} color="black">
            <Flex
                align={"center"}
                flex={1}
                justify={"center"}
                direction={{ base: "column", md: "row" }}
            >
                <Formik
                    initialValues={{
                        email: user,
                        password: "",
                        password_confirmation: "",
                    }}
                    validationSchema={signUpSchema}
                    onSubmit={(value, action) => {
                        OnSignUp(value);
                    }}
                >
                    {(props) => {
                        return (
                            <Form>
                                <Stack spacing={4} w={"full"} maxW={"md"}>
                                    <Heading
                                        fontSize={"2xl"}
                                        pb={5}
                                        fontFamily={"Gantari"}
                                        fontWeight={"500"}
                                        mt={"5"}
                                    >
                                        Verify and Set Your Password
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
                                        <FormLabel fontWeight={"500"}>
                                            Set Password
                                        </FormLabel>
                                        <InputGroup
                                            size="md"
                                            variant={"filled"}
                                        >
                                            <Field
                                                as={Input}
                                                type={
                                                    show ? "text" : "password"
                                                }
                                                name="password"
                                            />
                                            <InputRightElement>
                                                <IconButton
                                                    color="black"
                                                    aria-label="Show Pasword"
                                                    onClick={handlePassword}
                                                >
                                                    {show ? (
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
                                    <FormControl id="confirm password">
                                        <FormLabel fontWeight={"500"}>
                                            Confirm Password
                                        </FormLabel>
                                        <InputGroup
                                            size="md"
                                            variant={"filled"}
                                        >
                                            <Field
                                                as={Input}
                                                type={
                                                    showConfirm
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="password_confirmation"
                                            />
                                            <InputRightElement>
                                                <IconButton
                                                    color="black"
                                                    aria-label="Show Pasword"
                                                    onClick={
                                                        handleConfirmPassword
                                                    }
                                                >
                                                    {showConfirm ? (
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
                    src={verification_pict}
                    alt="Verification Image"
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
