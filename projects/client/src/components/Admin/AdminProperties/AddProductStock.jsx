// react
import Axios from "axios";
import { useRef } from "react";
import decode from "jwt-decode";

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
    NumberInputField,
    NumberInput,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInputStepper,
} from "@chakra-ui/react";

// swal
import Swal from "sweetalert2";

// icons
import { CgMathPlus } from "react-icons/cg";
import { RxCheck, RxCross1 } from "react-icons/rx";

export const AddProductStock = ({
    getProductStock,
    allProduct,
    allWarehouse,
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Box>
            <Button
                onClick={onOpen}
                leftIcon={<CgMathPlus />}
                colorScheme="teal"
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
                            product_name={allProduct}
                            warehouse_name={allWarehouse}
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
    const decodedToken = decode(token);

    const product_id = useRef("");
    const warehouse_location_id = useRef("");

    const validation = Yup.object().shape({
        qty: Yup.number().required("Cannot be Empty").min(1, "Cannot be Empty"),
    });

    const AddProductStock = async (value) => {
        try {
            const data = {
                product_id: product_id.current.value,
                warehouse_location_id:
                    decodedToken.role === 3
                        ? warehouse_location_id.current.value
                        : product_name.filter(
                              (product_name) =>
                                  product_name.warehouse_location.user_id ===
                                  decodedToken.id
                          ).warehouse_location.id,
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
            close();
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
                    qty: 0,
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

                                {decodedToken.role === 3 ? (
                                    <>
                                        <FormLabel>Warehouse Name</FormLabel>
                                        <Select
                                            ref={warehouse_location_id}
                                            placeholder={"- Select -"}
                                        >
                                            {warehouse_name?.map(
                                                (item, index) => {
                                                    return (
                                                        <option
                                                            value={item.id}
                                                            key={index}
                                                        >
                                                            {
                                                                item.warehouse_name
                                                            }
                                                        </option>
                                                    );
                                                }
                                            )}
                                        </Select>
                                    </>
                                ) : null}
                                <FormLabel>Add Stock</FormLabel>
                                <NumberInput
                                    defaultValue={0}
                                    min={0}
                                    onChange={(value) => {
                                        props.setFieldValue(
                                            "qty",
                                            parseInt(value)
                                        );
                                    }}
                                    type="number"
                                    name="qty"
                                >
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
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
