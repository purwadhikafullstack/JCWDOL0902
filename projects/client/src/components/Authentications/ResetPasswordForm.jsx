import React from "react";
import { useState } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { Field, ErrorMessage, Formik, Form } from "formik";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Box,
    FormControl,
    FormLabel,
    Input,
    Button,
    Center,
    Text,
    VStack,
} from "@chakra-ui/react";
const url = process.env.REACT_APP_API_BASE_URL + "/users";

export const ResetPassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const ResetPassSchema = Yup.object().shape({
        email: Yup.string().email().required("Email is required"),
    });

    const onResetPass = async (e) => {
        try {
            setIsLoading(true);
            const result = await Axios.post(`${url}/reset-password-email`, e);

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
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.response.data.name
                    ? err.response.data.errors[0].message
                    : err.response.data,

                customClass: {
                    container: "my-swal",
                },
            });
            setIsLoading(false);
        }
    };

    return (
        <Box>
            <Button
                colorScheme={"teal"}
                variant="link"
                onClick={onOpen}
                pt={5}
                fontWeight={"500"}
            >
                Forgot your Password?
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay>
                    <ModalContent>
                        <ModalHeader>
                            <Center>Forgot Password?</Center>
                        </ModalHeader>
                        <Center>
                            <Text p={5}>
                                We will send you an email to set up your new
                                password
                            </Text>
                        </Center>
                        <ModalCloseButton />
                        <ModalBody>
                            <Formik
                                initialValues={{
                                    email: "",
                                }}
                                validationSchema={ResetPassSchema}
                                onSubmit={(value, action) => {
                                    onResetPass(value);
                                }}
                            >
                                {(props) => {
                                    return (
                                        <>
                                            <Form>
                                                <VStack>
                                                    <FormControl>
                                                        <FormLabel>
                                                            Email
                                                        </FormLabel>
                                                        <Field
                                                            as={Input}
                                                            type="email"
                                                            name="email"
                                                        />
                                                        <ErrorMessage
                                                            name="email"
                                                            component="div"
                                                            style={{
                                                                color: "red",
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <ModalFooter>
                                                        <Button
                                                            type="submit"
                                                            isLoading={
                                                                isLoading
                                                            }
                                                            loadingText="Sending"
                                                            colorScheme="teal"
                                                            mr={5}
                                                        >
                                                            Send
                                                        </Button>
                                                        <Button
                                                            onClick={onClose}
                                                            colorScheme="blue"
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </ModalFooter>
                                                </VStack>
                                            </Form>
                                        </>
                                    );
                                }}
                            </Formik>
                        </ModalBody>
                    </ModalContent>
                </ModalOverlay>
            </Modal>
        </Box>
    );
};
