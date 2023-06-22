// react
import Axios from "axios";
import { useEffect, useState, useCallback } from "react";

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
} from "@chakra-ui/react";

// swal
import Swal from "sweetalert2";

// icons
import { CgMathPlus } from "react-icons/cg";
import { RxCheck, RxCross1 } from "react-icons/rx";

export const CreateRequestMutation = ({ getMutation, warehouses }) => {
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
                        Create Request Mutation and Assign to
                    </ModalHeader>
                    <ModalBody>
                        <AddForm
                            close={onClose}
                            getMutation={getMutation}
                            warehouses={warehouses}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

const AddForm = ({ close, getMutation, warehouses }) => {
    const url = process.env.REACT_APP_API_BASE_URL + "/admin";
    const token = localStorage.getItem("token");

    const [cities, setCities] = useState();
    const [warehouse, setWarehouse] = useState();
    const [warehouseId, setWarehouseId] = useState();
    const [city, setCity] = useState();
    const [cityId, setCityId] = useState();
    const [productId, setProductId] = useState();
    const [qty, setQty] = useState();

    const validation = Yup.object().shape({
        product_id: Yup.string().required("Cannot be Empty"),
        address: Yup.string().required("Cannot be Empty"),
        user_id: Yup.string().required("Cannot be Empty"),
    });

    const getWarehouses = useCallback(async () => {
        try {
            const resultWarehouse = await Axios.get(
                process.env.REACT_APP_API_BASE_URL + `/fetch-warehouses/${warehouseId}`
            );
            setWarehouse(resultWarehouse.data.result);
        } catch (err) {}
    }, [warehouseId]);

    const reqMutation = async (value) => {
        try {
            const data = {
                product_id: value.product_id.name,
                address: value.address,
                warehouse: warehouse,
                warehouse_id: +warehouseId,
                city: city,
                city_id: +cityId,
                user_id: value.user_id,
                qty: value.qty
            };

            const result = await Axios.post(url + "/req-mutation", data, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });

            console.log(result.data.message);

            Swal.fire({
                icon: "success",
                title: "Success",
                text: result.data.message,
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
    };

    useEffect(() => {
        if (warehouse) {
            getWarehouses();
        }
    }, [warehouse, getWarehouses]);

    return (
        <Box>
            <Formik
                initialValues={{
                    product_id: "",
                    user_id: "",
                    address: "",
                }}
                validationSchema={validation}
                onSubmit={(value) => {
                    reqMutation(value);
                }}
            >
                <Form>
                    <FormControl isRequired>
                        <FormLabel>Product ID</FormLabel>
                        <Input as={Field} name={"product_id"} />
                        <ErrorMessage
                            style={{ color: "red" }}
                            component="div"
                            name="product_id"
                        />
                        <FormLabel>Qty</FormLabel>
                        <FastField name="qty">
                            {({ field, form }) => (
                                <Textarea
                                    {...field}
                                    size="lg"
                                    isInvalid={
                                        form.errors.qty &&
                                        form.touched.qty
                                    }
                                />
                            )}
                        </FastField>
                        <ErrorMessage
                            style={{ color: "red" }}
                            component="div"
                            name="address"
                        />
                        <FormLabel>Destination Warehouse</FormLabel>
                        <Select
                            placeholder={"-- Select --"}
                            onChange={(e) => {
                                setWarehouseId(e.target.value.split(",")[0]);
                                setWarehouse(e.target.value.split(",")[1]);
                            }}
                        >
                            {warehouses?.map((item, index) => {
                                return (
                                    <option
                                        key={index}
                                        value={[
                                            item.warehouse_id,
                                            item.warehouse,
                                        ]}
                                    >
                                        {item.warehouse}
                                    </option>
                                );
                            })}
                        </Select>
                        {cities ? (
                            <>
                                <FormLabel>City</FormLabel>
                                <Select
                                    placeholder={"-- Select --"}
                                    onChange={(e) => {
                                        setCityId(e.target.value.split(",")[0]);
                                        setCity(e.target.value.split(",")[1]);
                                    }}
                                >
                                    {cities?.map((item, index) => {
                                        return (
                                            <option
                                                key={index}
                                                value={[
                                                    item.city_id,
                                                    item.city_name,
                                                ]}
                                            >
                                                {item.city_name}
                                            </option>
                                        );
                                    })}
                                </Select>
                            </>
                        ) : null}
                        <FormLabel>User ID</FormLabel>
                        <Input
                            as={Field}
                            name={"user_id"}
                            placeholder="You can find the ID in the Users Tab"
                        />
                        <ErrorMessage
                            style={{ color: "red" }}
                            component="div"
                            name="user_id"
                        />
                        {/* <FormLabel>Admin Id</FormLabel>
                        <Select ref={UserId} placeholder={"- Select -"}>
                            {admin.map((item, index) => {
                                return (
                                    <option value={item.id} key={index}>
                                        {item.id}
                                    </option>
                                );
                            })}
                        </Select> */}
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
            </Formik>
        </Box>
    );
};
