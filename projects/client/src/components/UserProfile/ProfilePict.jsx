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
    const [selectedImage, setSelectedImage] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const toast = useToast();

    const handlePictureChange = (e) => {
        const file = e.target.files[0];
        setSelectedImage(file);
    };

    const handleSaveChanges = async () => {
        if (selectedImage) {
            const formData = new FormData();
            formData.append("images", selectedImage);

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
                    title: "Successfully updated profile picture, Please Re-Login to apply the changes",
                    status: "success",
                    isClosable: true,
                });
                getUser();
            } catch (error) {
                console.error("Error updating profile picture:", error);
            }
        }
    };

    const handlePreviewImage = (e) => {
        const file = e.target.files[0];

        if (file) {
            setSelectedImage(file);
            setShowPreview(true);
        } else {
            setSelectedImage(null);
            setShowPreview(false);
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
                        {showPreview && (
                            <img
                                src={URL.createObjectURL(selectedImage)}
                                alt="Preview"
                                style={{ width: "100%", marginBottom: "1rem" }}
                            />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePreviewImage}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme="blue" onClick={handleSaveChanges}>
                            Save Changes
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
