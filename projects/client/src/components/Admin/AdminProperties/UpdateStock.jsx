// react
import Axios from "axios";
import { useState, useRef } from "react";

// validation
import { Formik, ErrorMessage, Form, Field } from "formik";
import * as Yup from "yup";

// chakra
import {
    Box,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    FormControl,
    FormLabel,
    Input,
    IconButton,
    Center,
    Button,
    Select,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    NumberInput,
} from "@chakra-ui/react";

// swal
import Swal from "sweetalert2";

// icons
import { BiEdit } from "react-icons/bi";
import { RxCheck, RxCross1 } from "react-icons/rx";

export const UpdateStock = ({ product, getProductStock }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Box>
            <Button
                rightIcon={<BiEdit />}
                bg={"#495057"}
                color={"white"}
                _hover={{ bg: "#DEE2E6", color: "#495057" }}
                textAlign={"center"}
                onClick={onOpen}
            >
                Update Stock
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign={"center"}>Update Stock</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <EditForm
                            stockValue={product}
                            getProductStock={getProductStock}
                            close={onClose}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

const EditForm = ({ close, stockValue, getProductStock }) => {
    const url =
        process.env.REACT_APP_API_BASE_URL +
        `/admin/update-product-stock/${stockValue.product.id}`;
    const token = localStorage.getItem("token");

    const validation = Yup.object().shape({
        type: Yup.string().required("Required"),
        description: Yup.string().required("Required"),
    });

    const [newStock, setNewStock] = useState(stockValue.qty);
    const [selectedType, setSelectedType] = useState();

    const increment = useRef(``);
    const decrement = useRef(``);
    const typeValue = useRef(``);

    const editStock = async (value) => {
        try {
            const editData = {
                type: value.type,
                increment_change: value.increment_change,
                decrement_change: value.decrement_change,
                total_qty_before_change: value.total_qty_before_change,
                new_total_qty: value.new_total_qty,
                description: value.description,
                product_id: stockValue.product.id,
                warehouse_location_id: stockValue.warehouse_location.id,
                product_location_id: stockValue.id,
                product_stock: stockValue.product.stock,
            };

            await Axios.patch(url, editData, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });
            getProductStock();

            Swal.fire({
                icon: "success",
                title: "Success",
                text: `Stock Updated`,
            });
            close();
        } catch (err) {
            console.log(err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.response.data.message,
            });
            close();
        }
    };

    return (
        <Box>
            <Formik
                initialValues={{
                    type: "",
                    increment_change: 0,
                    decrement_change: 0,
                    total_qty_before_change: 0,
                    new_total_qty: 0,
                    description: "",
                }}
                validationSchema={validation}
                onSubmit={(value) => {
                    editStock(value);
                    console.log(value);
                }}
            >
                {(props) => {
                    return (
                        <Form>
                            <FormControl>
                                <FormLabel>
                                    {stockValue.product.name} (
                                    {
                                        stockValue.warehouse_location
                                            .warehouse_name
                                    }
                                    )
                                </FormLabel>
                                <Select
                                    paddingBottom={"10px"}
                                    defaultValue={""}
                                    placeholder="Select Type of Journal"
                                    name={"type"}
                                    ref={typeValue}
                                    onClick={() => {
                                        setSelectedType(
                                            typeValue.current.value
                                        );
                                        // setNewStock(stockValue.qty);
                                        props.setFieldValue(
                                            "type",
                                            typeValue.current.value
                                        );
                                        props.setFieldValue(
                                            "increment_change",
                                            0
                                        );
                                        props.setFieldValue(
                                            "decrement_change",
                                            0
                                        );
                                    }}
                                >
                                    <option value={"Stock Sold"}>
                                        Stock Sold
                                    </option>
                                    <option value={"Add Stock by Admin"}>
                                        Add Stock by Admin
                                    </option>
                                    <option value={"Subtract Stock by Admin"}>
                                        Subtract Stock by Admin
                                    </option>
                                </Select>
                                <ErrorMessage
                                    style={{ color: "red" }}
                                    component="div"
                                    name="type"
                                />

                                <FormLabel textAlign={"center"}>
                                    Current Stock:
                                </FormLabel>
                                <FormLabel
                                    name={"total_qty_before_change"}
                                    textAlign={"center"}
                                >
                                    {stockValue.qty}
                                </FormLabel>

                                {selectedType ? (
                                    <>
                                        {selectedType ===
                                        "Add Stock by Admin" ? (
                                            <>
                                                <FormLabel>
                                                    Increment Change
                                                </FormLabel>
                                                <NumberInput
                                                    defaultValue={0}
                                                    min={0}
                                                    name={"increment_change"}
                                                    ref={increment}
                                                    onClick={() => {
                                                        setNewStock(
                                                            stockValue.qty +
                                                                parseInt(
                                                                    increment
                                                                        .current
                                                                        .firstChild
                                                                        .value
                                                                )
                                                        );
                                                        props.setFieldValue(
                                                            "increment_change",
                                                            parseInt(
                                                                increment
                                                                    .current
                                                                    .firstChild
                                                                    .value
                                                            )
                                                        );
                                                    }}
                                                >
                                                    <NumberInputField />
                                                    <NumberInputStepper>
                                                        <NumberIncrementStepper />
                                                        <NumberDecrementStepper />
                                                    </NumberInputStepper>
                                                </NumberInput>
                                            </>
                                        ) : (
                                            <>
                                                <FormLabel>
                                                    Decrement Change
                                                </FormLabel>
                                                <NumberInput
                                                    defaultValue={0}
                                                    min={0}
                                                    max={
                                                        stockValue.product.stock
                                                    }
                                                    name={"decrement_change"}
                                                    ref={decrement}
                                                    onClick={() => {
                                                        setNewStock(
                                                            stockValue.qty -
                                                                parseInt(
                                                                    decrement
                                                                        .current
                                                                        .firstChild
                                                                        .value
                                                                )
                                                        );
                                                        props.setFieldValue(
                                                            "decrement_change",
                                                            parseInt(
                                                                decrement
                                                                    .current
                                                                    .firstChild
                                                                    .value
                                                            )
                                                        );
                                                    }}
                                                >
                                                    <NumberInputField />
                                                    <NumberInputStepper>
                                                        <NumberIncrementStepper />
                                                        <NumberDecrementStepper />
                                                    </NumberInputStepper>
                                                </NumberInput>
                                            </>
                                        )}

                                        <FormLabel
                                            textAlign={"center"}
                                            paddingTop={"5px"}
                                        >
                                            Updated Stock:
                                        </FormLabel>
                                        <FormLabel
                                            textAlign={"center"}
                                            paddingTop={"5px"}
                                            name={"new_total_qty"}
                                        >
                                            {newStock}
                                        </FormLabel>

                                        <Input
                                            placeholder={"Description"}
                                            name={"description"}
                                            as={Field}
                                        />
                                        <ErrorMessage
                                            style={{ color: "red" }}
                                            component="div"
                                            name="description"
                                        />

                                        <Center
                                            paddingTop={"10px"}
                                            gap={"10px"}
                                        >
                                            <IconButton
                                                icon={<RxCheck />}
                                                fontSize={"3xl"}
                                                color={"green"}
                                                type={"submit"}
                                                onClick={() => {
                                                    props.setFieldValue(
                                                        "total_qty_before_change",
                                                        stockValue.product.stock
                                                    );
                                                    props.setFieldValue(
                                                        "new_total_qty",
                                                        newStock
                                                    );
                                                }}
                                            />
                                            <IconButton
                                                icon={<RxCross1 />}
                                                fontSize={"xl"}
                                                color={"red"}
                                                onClick={close}
                                            />
                                        </Center>
                                    </>
                                ) : null}
                            </FormControl>
                        </Form>
                    );
                }}
            </Formik>
        </Box>
    );
};
