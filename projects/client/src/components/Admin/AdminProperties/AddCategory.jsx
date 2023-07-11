import Axios from "axios";
import { useState } from "react";

import { Formik, ErrorMessage, Form, Field } from "formik";
import * as Yup from "yup";

import {
    Box,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    useDisclosure,
    FormControl,
    FormLabel,
    Input,
    Center,
    IconButton,
} from "@chakra-ui/react";

import Swal from "sweetalert2";

import { CgMathPlus } from "react-icons/cg";
import { RxCheck, RxCross1 } from "react-icons/rx";

export const AddCategory = ({ getCategory }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Box>
            <Button
                onClick={onOpen}
                leftIcon={<CgMathPlus />}
                colorScheme="teal"
            >
                New Category
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign={"center"}>Add Category</ModalHeader>
                    <ModalBody>
                        <AddForm close={onClose} getCategory={getCategory} />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

const AddForm = ({ close, getCategory }) => {
    const [previewImage, setPreviewImage] = useState(null);
    const url = process.env.REACT_APP_API_BASE_URL + "/admin/add-category";
    const token = localStorage.getItem("token");

    const validation = Yup.object().shape({
        name: Yup.string().required("Cannot Be Empty"),
        images: Yup.mixed().required("Image is required"),
    });

    const addCategory = async (value) => {
        try {
            const data = new FormData();
            data.append("name", value.name);
            data.append("images", value.images);

            await Axios.post(url, data, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });
            getCategory();

            Swal.fire({
                icon: "success",
                title: "Success",
                text: `Category Added`,
            });

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
                    name: "",
                    images: null,
                }}
                validationSchema={validation}
                onSubmit={(value) => {
                    addCategory(value);
                }}
            >
                {(props) => {
                    return (
                        <Form>
                            <FormControl isRequired>
                                <FormLabel>Category Name</FormLabel>
                                <Input as={Field} name={"name"} />
                                <ErrorMessage
                                    style={{ color: "red" }}
                                    component="div"
                                    name="name"
                                />
                                <FormLabel>Category Image</FormLabel>
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
