// react
import Axios from "axios";
import { useRef } from "react";

// validation
import { Formik, ErrorMessage, Form, Field } from "formik";
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
    Center,
    IconButton,
} from "@chakra-ui/react";

// swal
import Swal from "sweetalert2";

// icons
import { CgMathPlus } from "react-icons/cg";
import { RxCheck, RxCross1 } from "react-icons/rx";

export const AddProductStock = ({ getProductStock, product, warehouse }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Box>
            <Button
                onClick={onOpen}
                leftIcon={<CgMathPlus />}
                bg={"#DEE2E6"}
                _hover={{ bg: "#F8F9FA" }}
            >
                Add Product Stock
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign={"center"}>
                        Add Product Stock
                    </ModalHeader>
                    <ModalBody>
                        <AddForm
                            close={onClose}
                            product_name={product}
                            warehouse_name={warehouse}
                            getProductStock={getProductStock}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

const AddForm = ({ close, product_name, warehouse_name, getProductStock }) => {
    const url = process.env.REACT_APP_API_BASE_URL + "/admin";
    const token = localStorage.getItem("token");

    const product_id = useRef("");
    const warehouse_location_id = useRef("");

    const validation = Yup.object().shape({
        qty: Yup.number("Must be Integer").required("Cannot be Empty"),
    });

    const AddProductStock = async (value) => {
        try {
            const data = {
                product_id: product_id.current.value,
                warehouse_location_id: warehouse_location_id.current.value,
                qty: value.qty,
            };

            await Axios.post(url + "/add-product-stock", data, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });

            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Product stock added",
            });

            getProductStock();
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
                    qty: "",
                }}
                validationSchema={validation}
                onSubmit={(value) => {
                    AddProductStock(value);
                }}
            >
                {(props) => {
                    return (
                        <Form>
                            <FormControl isRequired>
                                <FormLabel>Product Name</FormLabel>
                                <Select
                                    ref={product_id}
                                    placeholder={"- Select -"}
                                >
                                    {product_name?.map((item, index) => {
                                        return (
                                            <option value={item.id} key={index}>
                                                {item.name}
                                            </option>
                                        );
                                    })}
                                </Select>
                                <FormLabel>Warehouse Name</FormLabel>
                                <Select
                                    ref={warehouse_location_id}
                                    placeholder={"- Select -"}
                                >
                                    {warehouse_name?.map((item, index) => {
                                        return (
                                            <option value={item.id} key={index}>
                                                {item.warehouse_name}
                                            </option>
                                        );
                                    })}
                                </Select>
                                <FormLabel>Add Stock</FormLabel>
                                <Input name={"qty"} as={Field} />
                                <ErrorMessage
                                    style={{ color: "red" }}
                                    component="div"
                                    name="qty"
                                />
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
