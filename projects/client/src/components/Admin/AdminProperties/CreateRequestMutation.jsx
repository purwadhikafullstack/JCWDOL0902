// react
import Axios from "axios";
import { useEffect, useState, useCallback, useRef } from "react";

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


    const product_id = useRef("")
    const warehouse_location_id = useRef("")
    const validation = Yup.object().shape({
        qty: Yup.number().required("Cannot be Empty"),
       
    });

    const reqMutation = async (value) => {
        try {
            const data = {
                product_id : product_id.current.value,
                warehouse_location_id : warehouse_location_id.current.value,
                qty : value.qty,
                remarks : value.remarks
            }
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
            console.log(err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.response.data.message,
            });
        }
    }

    return (
        <Box>
            <Formik
                initialValues={{
                    qty: ""
                }}
                validationSchema={validation}
                onSubmit={(value) => {
                    reqMutation(value);
                }}
            > 
            {(props) => {
                return (
                <Form>
                    <FormControl isRequired>
                        <FormLabel>Product ID</FormLabel>
                        <Select
                            ref={product_id}
                            placeholder={"-- Select --"}
                        >
                            {product_name?.map((item, index) => {
                                return (
                                    <option
                                        key={index}
                                        value={[
                                            item.name
                                        ]}
                                    >
                                        {item.name}
                                    </option>
                                );
                            })}
                        </Select>
                        <ErrorMessage
                            style={{ color: "red" }}
                            component="div"
                            name="product_id"
                        />
                        <FormLabel>Qty</FormLabel>
                        <NumberInput defaultValue={0} min={0}>
                        <NumberInputField />
                         <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                         </NumberInputStepper>
                        </NumberInput>
                        <ErrorMessage
                            style={{ color: "red" }}
                            component="div"
                            name="address"
                        />
                        
                        <FormLabel>Request to Warehouse</FormLabel>
                        <Select
                            ref={warehouse_location_id}
                            placeholder={"-- Select --"}
                        >
                            {warehouse_name?.map((item, index) => {
                                return (
                                    <option
                                        key={index}
                                        value={[
                                            item.warehouse_name
                                        ]}
                                    >
                                        {item.warehouse_name}
                                    </option>
                                );
                            })}
                        </Select>
                        <FormLabel>Remarks</FormLabel>
                        <Input
                            as={Field}
                            name={"Remarks"}
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
                )
            }}
            </Formik>
        </Box>
    );
};
