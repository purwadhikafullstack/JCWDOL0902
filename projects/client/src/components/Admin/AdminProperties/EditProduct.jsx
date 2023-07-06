// react
import Axios from "axios";
import { useRef } from "react";

// validation
import { Formik, ErrorMessage, Form, Field, FastField } from "formik";
import * as Yup from "yup";

// chakra
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
    Textarea,
    Select,
    IconButton,
    Center,
} from "@chakra-ui/react";

// swal
import Swal from "sweetalert2";

// icons
import { FaEdit } from "react-icons/fa";
import { RxCheck, RxCross1 } from "react-icons/rx";

export const EditProduct = ({ getProducts, category, item }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Box>
            <IconButton icon={<FaEdit />} bg={"none"} onClick={onOpen} />
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign={"center"}>Edit Product</ModalHeader>
                    <ModalBody>
                        <EditForm
                            close={onClose}
                            category_name={category}
                            getProducts={getProducts}
                            item={item}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

const EditForm = ({ close, category_name, getProducts, item }) => {
    const url = process.env.REACT_APP_API_BASE_URL + `/admin`;
    const token = localStorage.getItem("token");

    const category_id = useRef("");

    const validation = Yup.object().shape({
        name: Yup.string().required("Cannot be Empty"),
        description: Yup.string()
            .min(50, "description minimum is 50 char")
            .required("Cannot be Empty"),
        price: Yup.number("Must be Integer").required("Cannot be Empty"),
        brand: Yup.string().required("Cannot Be Empty"),
        weight: Yup.number("Must be Integer").required("Cannot be Empty"),
    });

    const editProduct = async (value) => {
        try {
            const editData = {
                name: value.name,
                description: value.description,
                price: value.price,
                brand: value.brand,
                weight: value.weight,
                category_id: category_id.current.value,
            };

            if (
                value.name !== item.name ||
                value.description !== item.description ||
                value.price !== item.price ||
                value.brand !== item.brand ||
                value.weight !== item.weight ||
                category_id.current.value !== item.category.id
            ) {
                await Axios.patch(url + `/edit-product/${item.id}`, editData, {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                });
            }

            Swal.fire({
                icon: "success",
                title: "Success",
                text: `Product Edited`,
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
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    brand: item.brand,
                    weight: item.weight,
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
                                <FormLabel>Product Name</FormLabel>
                                <Input as={Field} name={"name"} />
                                <ErrorMessage
                                    style={{ color: "red" }}
                                    component="div"
                                    name="name"
                                />
                                <FormLabel>Description</FormLabel>
                                <FastField name="description">
                                    {({ field, form }) => (
                                        <Textarea
                                            {...field}
                                            size="lg"
                                            height="200px"
                                            isInvalid={
                                                form.errors.description &&
                                                form.touched.description
                                            }
                                        />
                                    )}
                                </FastField>
                                <ErrorMessage
                                    style={{ color: "red" }}
                                    component="div"
                                    name="description"
                                />
                                <FormLabel>Price</FormLabel>
                                <Input
                                    as={Field}
                                    name={"price"}
                                    type={"number"}
                                />
                                <ErrorMessage
                                    style={{ color: "red" }}
                                    component="div"
                                    name="price"
                                />
                                <FormLabel>Brand</FormLabel>
                                <Input name={"brand"} as={Field} />
                                <ErrorMessage
                                    style={{ color: "red" }}
                                    component="div"
                                    name="brand"
                                />
                                <FormLabel>Weight</FormLabel>
                                <Input
                                    as={Field}
                                    name={"weight"}
                                    type={"number"}
                                />
                                <ErrorMessage
                                    style={{ color: "red" }}
                                    component="div"
                                    name="weight"
                                />
                                <FormLabel>Category</FormLabel>
                                <Select
                                    ref={category_id}
                                    defaultValue={item.category.id}
                                >
                                    {category_name?.map((item, index) => {
                                        return (
                                            <option value={item.id} key={index}>
                                                {item.name}
                                            </option>
                                        );
                                    })}
                                </Select>
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
