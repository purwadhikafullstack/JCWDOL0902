import React from "react";
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
    Center,
    VStack,
} from "@chakra-ui/react";
import axios from "axios";
import * as Yup from "yup";
import { Field, ErrorMessage, Formik, Form } from "formik";
import Swal from "sweetalert2";
import { useState } from "react";

const url = process.env.REACT_APP_API_BASE_URL;

export const RegisterationForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const RegisterSchema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        email: Yup.string()
            .email("Invalid email")
            .required("Email is required"),
        phone_number: Yup.string()
            .matches(/^\d+$/, "Invalid phone number")
            .required("Phone number is required"),
    });

    const onRegister = async (data) => {
        try {
            setIsLoading(true);
            const result = await axios.post(`${url}/register`, data);

            Swal.fire({
                icon: "success",
                title: "Email Sent",
                text: `${result.data.message}`,
                customClass: {
                    container: "my-swal",
                },
            });
            setIsLoading(false);
            onClose();
        } catch (err) {
            console.log(data);
            console.log(err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.response.data.message,
                customClass: {
                    container: "my-swal",
                },
            });
            setIsLoading(false);
        }
    };

    return (
        <>
            <Button
                display={{ base: "solid", md: "inline-flex" }}
                fontSize={"md"}
                fontWeight={600}
                color={"495057"}
                bg="#CED4DA"
                href={"#"}
                onClick={onOpen}
                borderRadius="15px"
            >
                Register
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        <Center>Sign Up Here</Center>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Formik
                            initialValues={{
                                name: "",
                                email: "",
                                phone_number: "",
                            }}
                            validationSchema={RegisterSchema}
                            onSubmit={(values) => {
                                onRegister(values);
                            }}
                        >
                            {(props) => (
                                <Form>
                                    <VStack>
                                        <FormControl>
                                            <FormLabel mb={3}>Name</FormLabel>
                                            <Field
                                                placeholder="Enter your name"
                                                as={Input}
                                                name="name"
                                            />
                                            <ErrorMessage
                                                name="name"
                                                component="div"
                                                style={{ color: "red" }}
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel mb={3}>Email</FormLabel>
                                            <Field
                                                placeholder="Enter your email"
                                                as={Input}
                                                type="email"
                                                name="email"
                                            />
                                            <ErrorMessage
                                                name="email"
                                                component="div"
                                                style={{ color: "red" }}
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel mb={3}>
                                                Phone Number
                                            </FormLabel>
                                            <Field
                                                placeholder="Enter your phone number"
                                                as={Input}
                                                name="phone_number"
                                            />
                                            <ErrorMessage
                                                name="phone_number"
                                                component="div"
                                                style={{ color: "red" }}
                                            />
                                        </FormControl>
                                        <ModalFooter>
                                            <Button
                                                type="submit"
                                                isLoading={isLoading}
                                                loadingText="Sending"
                                                mr={5}
                                            >
                                                Send
                                            </Button>
                                            <Button onClick={onClose}>
                                                Cancel
                                            </Button>
                                        </ModalFooter>
                                    </VStack>
                                </Form>
                            )}
                        </Formik>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};
