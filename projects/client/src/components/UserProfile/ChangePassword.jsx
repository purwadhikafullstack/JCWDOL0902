import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    useToast,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    FormErrorMessage,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";

const baseApi = process.env.REACT_APP_API_BASE_URL;

const changePasswordSchema = Yup.object().shape({
    oldPassword: Yup.string()
        .required("Old password is required!")
        .min(8, "Minimum 8 characters for password."),
    newPassword: Yup.string()
        .required("New password is required!")
        .min(8, "Minimum 8 characters for password."),
    newPasswordConfirmation: Yup.string()
        .required("Password confirmation is required!")
        .min(8, "Minimum 8 characters for password.")
        .oneOf([Yup.ref("newPassword")], "Password doesn't match!"),
});

export const ChangePassword = ({ user, token }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [viewOld, setViewOld] = useState(false);
    const [viewNew, setViewNew] = useState(false);
    const [viewConfirm, setViewConfirm] = useState(false);

    const toast = useToast();
    const navigate = useNavigate();

    const onLogout = async () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const formik = useFormik({
        initialValues: {
            oldPassword: "",
            newPassword: "",
            newPasswordConfirmation: "",
        },
        onSubmit: (values) => {
            handlePasswordChange();
        },
        validationSchema: changePasswordSchema,
        validateOnBlur: true,
        validateOnChange: true,
    });

    const handlePasswordChange = async () => {
        try {
            const response = await axios.patch(
                `${baseApi}/users/password-update/${user.id}`,
                {
                    oldPassword: formik.values.oldPassword,
                    newPassword: formik.values.newPassword,
                    newPasswordConfirmation:
                        formik.values.newPasswordConfirmation,
                },
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.status) {
                toast({
                    position: "top",
                    title: response.data.message,
                    status: "success",
                    isClosable: true,
                });
                setTimeout(() => onLogout(), 2500);
            } else {
                toast({
                    position: "top",
                    title: response.data.message,
                    status: "error",
                    isClosable: true,
                });
            }
        } catch (err) {
            toast({
                position: "top",
                title: err.response.data.message,
                status: "error",
                isClosable: true,
            });
        }
    };

    return (
        <>
            <Button colorScheme="blue" mb={4} m={2} onClick={onOpen}>
                Change Password
            </Button>

            <Modal
                isOpen={isOpen}
                onClose={() => {
                    onClose();
                    formik.resetForm();
                }}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Change Password</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form onSubmit={formik.handleSubmit}>
                            <FormControl
                                isRequired
                                id="oldPassword"
                                mb={4}
                                isInvalid={!!formik.errors.oldPassword}
                            >
                                <FormLabel>Old Password</FormLabel>
                                <InputGroup>
                                    <Input
                                        type={viewOld ? "text" : "password"}
                                        name="oldPassword"
                                        onChange={formik.handleChange}
                                        value={formik.values.oldPassword}
                                    />
                                    <InputRightElement>
                                        <Button
                                            onClick={() =>
                                                setViewOld((prev) => !prev)
                                            }
                                        >
                                            {viewOld ? (
                                                <ViewIcon />
                                            ) : (
                                                <ViewOffIcon />
                                            )}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                                {formik.errors.oldPassword &&
                                formik.touched.oldPassword ? (
                                    <FormErrorMessage>
                                        {formik.errors.oldPassword}
                                    </FormErrorMessage>
                                ) : null}
                            </FormControl>
                            <FormControl
                                isRequired
                                id="newPassword"
                                mb={4}
                                isInvalid={!!formik.errors.oldPassword}
                            >
                                <FormLabel>New Password</FormLabel>
                                <InputGroup>
                                    <Input
                                        type={viewNew ? "text" : "password"}
                                        name="newPassword"
                                        onChange={formik.handleChange}
                                        value={formik.values.newPassword}
                                    />
                                    <InputRightElement>
                                        <Button
                                            onClick={() =>
                                                setViewNew((prev) => !prev)
                                            }
                                        >
                                            {viewNew ? (
                                                <ViewIcon />
                                            ) : (
                                                <ViewOffIcon />
                                            )}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                                {formik.errors.newPassword &&
                                formik.touched.newPassword ? (
                                    <FormErrorMessage>
                                        {formik.errors.newPassword}
                                    </FormErrorMessage>
                                ) : null}
                            </FormControl>
                            <FormControl
                                isRequired
                                id="newPasswordConfirmation"
                                mb={4}
                                isInvalid={
                                    !!formik.errors.newPasswordConfirmation
                                }
                            >
                                <FormLabel>Confirm New Password</FormLabel>
                                <InputGroup>
                                    <Input
                                        type={viewConfirm ? "text" : "password"}
                                        name="newPasswordConfirmation"
                                        onChange={formik.handleChange}
                                        value={
                                            formik.values
                                                .newPasswordConfirmation
                                        }
                                    />
                                    <InputRightElement>
                                        <Button
                                            onClick={() =>
                                                setViewConfirm((prev) => !prev)
                                            }
                                        >
                                            {viewConfirm ? (
                                                <ViewIcon />
                                            ) : (
                                                <ViewOffIcon />
                                            )}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                                {formik.errors.newPasswordConfirmation &&
                                formik.touched.newPasswordConfirmation ? (
                                    <FormErrorMessage>
                                        {formik.errors.newPasswordConfirmation}
                                    </FormErrorMessage>
                                ) : null}
                            </FormControl>
                            <Button type="submit" colorScheme="blue" mr={3}>
                                Change Password
                            </Button>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            variant="ghost"
                            onClick={() => {
                                onClose();
                                formik.resetForm();
                            }}
                        >
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
