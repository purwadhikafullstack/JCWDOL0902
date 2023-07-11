// react
import Axios from "axios";
import { useRef, useState } from "react";

// validation
import { Formik, ErrorMessage, Form, Field, FastField } from "formik";
import * as Yup from "yup";

// chakra
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
    Select,
    Textarea,
    Center,
    IconButton,
} from "@chakra-ui/react";

// swal
import Swal from "sweetalert2";

// icons
import { CgMathPlus } from "react-icons/cg";
import { RxCheck, RxCross1 } from "react-icons/rx";

export const AddProduct = ({ getProducts, category }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Box>
            <Button
                onClick={onOpen}
                leftIcon={<CgMathPlus />}
                colorScheme="teal"
            >
                New Product
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign={"center"}>Add Product</ModalHeader>
                    <ModalBody>
                        <AddForm
                            close={onClose}
                            category_name={category}
                            getProducts={getProducts}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

const AddForm = ({ close, category_name, getProducts }) => {
    const url = process.env.REACT_APP_API_BASE_URL + "/admin";
    const token = localStorage.getItem("token");
    const [previewImage, setPreviewImage] = useState(null);

    const category_id = useRef("");

    const validation = Yup.object().shape({
        name: Yup.string().required("Cannot be Empty"),
        description: Yup.string()
            .min(50, "description minimum is 20 char")
            .required("Cannot be Empty"),
        images: Yup.mixed().required("Image is required"),
        price: Yup.number("Must be Integer").required("Cannot be Empty"),
        brand: Yup.string().required("Cannot Be Empty"),
        weight: Yup.number("Must be Integer").required("Cannot be Empty"),
    });

    const addProduct = async (values) => {
        try {
            const data = new FormData();
            data.append("name", values.name);
            data.append("description", values.description);
            data.append("price", values.price);
            data.append("brand", values.brand);
            data.append("weight", values.weight);
            data.append("category_id", category_id.current.value);
            data.append("images", values.images);

            await Axios.post(url + "/create-product", data, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });

            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Product added",
            });

            getProducts();
            close();
        } catch (err) {
            console.log(err);
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
                    description: "",
                    images: null,
                    price: "",
                    brand: "",
                    weight: "",
                }}
                validationSchema={validation}
                onSubmit={(value) => {
                    addProduct(value);
                }}
            >
                {(props) => {
                    return (
                        <Form>
                            <FormControl isRequired>
                                <FormLabel>Product Name</FormLabel>
                                <Input name={"name"} as={Field} />
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
                                <FormLabel>Product Image</FormLabel>
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
                                <FormLabel>Price</FormLabel>
                                <Input
                                    type={"number"}
                                    name={"price"}
                                    as={Field}
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
                                    type={"number"}
                                    name={"weight"}
                                    as={Field}
                                />
                                <ErrorMessage
                                    style={{ color: "red" }}
                                    component="div"
                                    name="weight"
                                />
                                <FormLabel>Category</FormLabel>
                                <Select
                                    ref={category_id}
                                    placeholder={"- Select -"}
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
