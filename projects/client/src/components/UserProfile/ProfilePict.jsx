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
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

const baseApi = process.env.REACT_APP_API_BASE_URL;

export const ChangeProfilePicture = ({ user, token, getUser }) => {
    const [previewImage, setPreviewImage] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const toast = useToast();

    const handlePictureChange = async (e) => {
        const file = e.target.files[0];

        if (file) {
            const formData = new FormData();
            formData.append("images", file);

            try {
                await axios.patch(
                    `${baseApi}/users/profile-picture/${user.id}`,
                    formData,
                    {
                        headers: {
                            authorization: `Bearer ${token}`,
                        },
                    }
                );

                toast({
                    position: "top",
                    title: "Successfuly updating profile picture, click save changes to continue",
                    status: "success",
                    isClosable: true,
                });
                setTimeout(() => 2000);
                getUser();
            } catch (error) {
                console.error("Error updating profile picture:", error);
                // Handle error scenario
            }
        }
    };

    const handlePreviewImage = (e) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
    };

    return (
        <>
            <Button colorScheme="blue" mb={4} m={2} onClick={onOpen}>
                New Profile Picture
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Change Profile Picture</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {previewImage && (
                            <img
                                src={previewImage}
                                alt="Preview"
                                style={{ width: "100%", marginBottom: "1rem" }}
                            />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                handlePictureChange(e);
                                handlePreviewImage(e);
                            }}
                        />
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
