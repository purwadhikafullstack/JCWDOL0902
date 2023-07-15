// react
import Axios from "axios";
import { useEffect, useState, useCallback, useRef } from "react";
import decode from "jwt-decode";

// validation
import { Formik, ErrorMessage, Form, Field, FastField } from "formik";
import * as Yup from "yup";

// chakra
import {
    Textarea,
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
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    FormHelperText,
} from "@chakra-ui/react";

// swal
import Swal from "sweetalert2";

// icons
import { CgMathPlus } from "react-icons/cg";
import { RxCheck, RxCross1 } from "react-icons/rx";

export const CreateRequestMutation = ({ getMutation, warehouse, product }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Box>
            <Button
                onClick={onOpen}
                leftIcon={<CgMathPlus />}
                colorScheme="teal"
            >
                Create Request Mutation
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign={"center"}>
                        Request Mutation Form
                    </ModalHeader>
                    <ModalBody>
                        <AddForm
                            close={onClose}
                            getMutation={getMutation}
                            warehouse_name={warehouse}
                            product_name={product}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

const AddForm = ({ close, getMutation, warehouse_name, product_name }) => {
    const url = process.env.REACT_APP_API_BASE_URL + "/admin";
    const token = localStorage.getItem("token");
    const decodedToken = decode(token);
    const [selectedWarehouseId, setSelectedWarehouseId] = useState();
    const [allProductLocation, setAllProductLocation] = useState();
    const [availableProduct, setAvailableProduct] = useState();
    const [productId, setProductId] = useState();

    const validation = Yup.object().shape({
        qty: Yup.number().required("Cannot be Empty").min(1, "Cannot be Empty"),
        remarks: Yup.string().required("Cannot be Empty"),
    });

    const getProductStock = useCallback(async () => {
        try {
            const productStockURL =
                url +
                `/fetch-product-stock?search=&sort=&order=&page=&warehouse=`;

            const resultProductStockList = await Axios.get(productStockURL, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });

            setAllProductLocation(resultProductStockList.data.allProductStock);

            const productQty = allProductLocation.filter(
                (item) =>
                    item.product_id == productId &&
                    item.warehouse_location_id == selectedWarehouseId
            );

            if (productId != "select" && selectedWarehouseId != "select") {
                setAvailableProduct(
                    productQty.length == 0 ? 0 : productQty[0].qty
                );
            }

            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        } catch (err) {}
    }, [url, token, selectedWarehouseId, productId]);

    useEffect(() => {
        getProductStock();
    }, [getProductStock]);

    const addMutation = async (value) => {
        try {
            const data = {
                product_id: productId,
                warehouse_approve_id: selectedWarehouseId,
                qty: value.qty,
                remarks: value.remarks,
            };

            await Axios.post(url + "/req-mutation", data, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });

            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Request Mutation Successfuly Created",
            });

            getMutation();
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
                    qty: 0,
                    remarks: "",
                }}
                validationSchema={validation}
                onSubmit={(value) => {
                    addMutation(value);
                }}
            >
                {props => (
                    <Form>
                        <FormControl isRequired>
                            <FormLabel>Product ID</FormLabel>
                            <Select
                                onClick={(e) => {
                                    setProductId(e.target.value);
                                }}
                            >
                                <option value={"select"}>-- Select --</option>
                                {product_name?.map((item, index) => {
                                    return (
                                        <option key={index} value={[item.id]}>
                                            {item.name}
                                        </option>
                                    );
                                })}
                            </Select>
                            <FormLabel>Qty</FormLabel>
                            <NumberInput
                                defaultValue={0}
                                min={0}
                                max={availableProduct}
                                isDisabled={availableProduct > 0 ? false : true}
                                onChange={value => {
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
                            <FormLabel>Request to Warehouse</FormLabel>
                            <Select
                                onChange={(e) => {
                                    setSelectedWarehouseId(e.target.value);
                                }}
                            >
                                <option value={"select"}>-- Select --</option>
                                {warehouse_name
                                    ?.filter(
                                        (warehouses) =>
                                            warehouses.user_id !==
                                            decodedToken.id
                                    )
                                    .map((item, index) => {
                                        return (
                                            <option key={index} value={item.id}>
                                                {item.warehouse_name}
                                            </option>
                                        );
                                    })}
                            </Select>
                            {availableProduct !== undefined ? (
                                <FormHelperText>
                                    Available Stock: {availableProduct}
                                </FormHelperText>
                            ) : null}
                            <FormLabel>Remarks</FormLabel>
                            <Input
                                as={Field}
                                name={"remarks"}
                                placeholder="Remarks"
                            />
                            <ErrorMessage
                                style={{ color: "red" }}
                                component="div"
                                name="remarks"
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
                )}
            </Formik>
        </Box>
    );
};
