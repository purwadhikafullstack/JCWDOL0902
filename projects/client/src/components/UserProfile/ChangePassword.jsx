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
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const baseApi = process.env.REACT_APP_API_BASE_URL;

export const ChangePassword = ({ user, token }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const toast = useToast();
    const navigate = useNavigate();

    const onLogout = async () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        const { oldPassword, newPassword, newPasswordConfirmation } =
            e.target.elements;

        if (oldPassword.value === "") {
            toast({
                position: "top",
                title: "Please enter your old password",
                status: "warning",
                isClosable: true,
            });
            return;
        }

        if (newPassword.value === "") {
            toast({
                position: "top",
                title: "Please enter a new password",
                status: "warning",
                isClosable: true,
            });
            return;
        }

        if (newPasswordConfirmation.value === "") {
            toast({
                position: "top",
                title: "Please confirm your new password",
                status: "warning",
                isClosable: true,
            });
            return;
        }

        if (newPassword.value !== newPasswordConfirmation.value) {
            toast({
                position: "top",
                title: "New password and confirmation do not match",
                status: "error",
                isClosable: true,
            });
            return;
        }

        try {
            const response = await axios.patch(
                `${baseApi}/users/password-update/${user.id}`,
                {
                    oldPassword: oldPassword.value,
                    newPassword: newPassword.value,
                    newPasswordConfirmation: newPasswordConfirmation.value,
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

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Change Password</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form onSubmit={handlePasswordChange}>
                            <FormControl id="oldPassword" mb={4}>
                                <FormLabel>Old Password</FormLabel>
                                <Input type="password" />
                            </FormControl>
                            <FormControl id="newPassword" mb={4}>
                                <FormLabel>New Password</FormLabel>
                                <Input type="password" />
                            </FormControl>
                            <FormControl id="newPasswordConfirmation" mb={4}>
                                <FormLabel>Confirm New Password</FormLabel>
                                <Input type="password" />
                            </FormControl>
                            <Button type="submit" colorScheme="blue" mr={3}>
                                Change Password
                            </Button>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
