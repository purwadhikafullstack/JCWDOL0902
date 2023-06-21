import React from "react";
import { useRef } from "react";
import decode from "jwt-decode";
import Axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/userSlice";
import {
    Button,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
} from "@chakra-ui/react";

import { ResetPassword } from "./ResetPasswordForm";
const url = process.env.REACT_APP_API_BASE_URL + "/users";

export const LoginForm = () => {
    const {
        isOpen: isOpenLogin,
        onOpen: onOpenLogin,
        onClose: onCloseLogin,
    } = useDisclosure();

    const navigate = useNavigate();

    const inputEmail = useRef("");
    const inputPass = useRef("");
    const dispatch = useDispatch();

    const onLogin = async (e) => {
        e.preventDefault();
        try {
            const user = {
                email: inputEmail.current.value,
                password: inputPass.current.value,
            };

            const result = await Axios.post(`${url}/login`, user);
            dispatch(
                login({
                  id: result.data.id,
                  email: result.data.email,
                  name: result.data.name,
                  is_verified: result.data.is_verified,
                  role: result.data.role,
                  photo_profile: result.data.photo_profile,
                })
              );
            console.log(result.data.data.token);

            localStorage.setItem("token", result.data.data.token);
            const decodedToken = decode(result.data.data.token);

            console.log(decodedToken);

            Swal.fire({
                icon: "success",
                title: "Login Success",
                text: `${result.data.message}`,

                customClass: {
                    container: "my-swal",
                },
            });
            onCloseLogin();

            if (decodedToken.role === 2 || decodedToken.role === 3) {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (err) {
            console.log(err);
            Swal.fire({
                icon: "error",
                title: "Failed Attempt",
                text: err.response.data.message
                    ? err.response.data.message
                    : "Something Went Wrong !",

                customClass: {
                    container: "my-swal",
                },
            });
            onCloseLogin();
        }
    };

    return (
        <>
            <Button
                display={{ base: "solid", md: "inline-flex" }}
                fontSize={"md"}
                fontWeight="600"
                colorScheme="blue"
                href={"#"}
                onClick={onOpenLogin}
                pt={{ base: "3", md: 0 }}
                borderRadius="15px"
            >
                Login
            </Button>
            <Modal isOpen={isOpenLogin} onClose={onCloseLogin}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Sign In to your Account</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={5}>
                        <form onSubmit={onLogin}>
                            <FormControl>
                                <FormLabel mb={4}>Email</FormLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    ref={inputEmail}
                                />
                                <FormLabel mt={5}>Password</FormLabel>
                                <Input
                                    id="password"
                                    type="password"
                                    ref={inputPass}
                                />
                                <ResetPassword />
                            </FormControl>
                            <ModalFooter>
                                <Button mr={5} type="submit" colorScheme="blue">
                                    Login
                                </Button>
                                <Button
                                    onClick={onCloseLogin}
                                    colorScheme="teal"
                                >
                                    Cancel
                                </Button>
                            </ModalFooter>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};
