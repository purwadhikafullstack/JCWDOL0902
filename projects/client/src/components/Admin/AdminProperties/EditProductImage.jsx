import Axios from "axios";
import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import {
    Box,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    useDisclosure,
    FormControl,
    FormLabel,
    Input,
    IconButton,
    Center,
} from "@chakra-ui/react";

// swal
import Swal from "sweetalert2";

import { AiOutlineFileImage } from "react-icons/ai";
import { RxCheck, RxCross1 } from "react-icons/rx";
import React from "react";

export const EditProductImage = ({ getProducts, item }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Box>
            <IconButton
                icon={<AiOutlineFileImage />}
                bg={"none"}
                onClick={onOpen}
            />
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign={"center"}>
                        Edit Product Image
                    </ModalHeader>
                    <ModalBody>
                        <EditForm
                            close={onClose}
                            getProducts={getProducts}
                            item={item}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

const EditForm = ({ close, getProducts, item }) => {
    const [previewImage, setPreviewImage] = useState(null);
    const url = process.env.REACT_APP_API_BASE_URL + `/admin`;
    const token = localStorage.getItem("token");

    const validation = Yup.object().shape({
        images: Yup.mixed().required("Image is required"),
    });

    const editProduct = async (value) => {
        try {
            const data = new FormData();
            data.append("images", value.images);

            await Axios.patch(url + `/update-photo-product/${item.id}`, data, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });

            Swal.fire({
                icon: "success",
                title: "Success",
                text: `Product Image Edited`,
            });

            getProducts();
            close();
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.response.data.message,
            });
        }
    };

    return (
        <Box>
            <Formik
                initialValues={{
                    images: item.images,
                }}
                validationSchema={validation}
                onSubmit={(value) => {
                    editProduct(value);
                }}
            >
                {(props) => {
                    return (
                        <Form>
                            <FormControl>
                                <FormLabel>Please Upload an Image</FormLabel>
                                <Input
                                    type="file"
                                    name="images"
                                    onChange={(event) => {
                                        const file =
                                            event.currentTarget.files[0];
                                        props.setFieldValue("images", file);

                                        const reader = new FileReader();
                                        reader.onload = () => {
                                            setPreviewImage(reader.result);
                                        };
                                        reader.readAsDataURL(file);
                                    }}
                                />
                                {previewImage && (
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        style={{
                                            marginTop: "10px",
                                            width: "200px",
                                        }}
                                    />
                                )}
                                <Center paddingTop={"10px"} gap={"10px"}>
                                    <IconButton
                                        icon={<RxCheck />}
                                        fontSize={"3xl"}
                                        color={"green"}
                                        type={"submit"}
                                    />
                                    <IconButton
                                        icon={<RxCross1 />}
                                        fontSize={"xl"}
                                        color={"red"}
                                        onClick={close}
                                    />
                                </Center>
                            </FormControl>
                        </Form>
                    );
                }}
            </Formik>
        </Box>
    );
};
