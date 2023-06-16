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

export const CreateWarehouse = ({ getWarehouse, provinces }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Box>
            <Button
                onClick={onOpen}
                leftIcon={<CgMathPlus />}
                colorScheme="teal"
            >
                New Warehouse
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign={"center"}>
                        Create Warehouse and Assign to
                    </ModalHeader>
                    <ModalBody>
                        <AddForm
                            close={onClose}
                            getWarehouse={getWarehouse}
                            provinces={provinces}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

const AddForm = ({ close, getWarehouse, provinces }) => {
    const url = process.env.REACT_APP_API_BASE_URL + "/admin";
    const token = localStorage.getItem("token");

    const [cities, setCities] = useState();
    const [province, setProvince] = useState();
    const [provinceId, setProvinceId] = useState();
    const [city, setCity] = useState();
    const [cityId, setCityId] = useState();

    const validation = Yup.object().shape({
        warehouse_name: Yup.string().required("Cannot be Empty"),
        address: Yup.string().required("Cannot be Empty"),
        user_id: Yup.string().required("Cannot be Empty"),
    });

    const getCities = useCallback(async () => {
        try {
            const resultCities = await Axios.get(
                process.env.REACT_APP_API_BASE_URL + `/city/${provinceId}`
            );
            setCities(resultCities.data.result);
        } catch (err) {}
    }, [provinceId]);

    const addWarehouse = async (value) => {
        try {
            const data = {
                warehouse_name: value.warehouse_name,
                address: value.address,
                province: province,
                province_id: +provinceId,
                city: city,
                city_id: +cityId,
                user_id: value.user_id,
            };

            const result = await Axios.post(url + "/create-warehouse", data, {
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

            getWarehouse();
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
        if (province) {
            getCities();
        }
    }, [province, getCities]);

    return (
        <Box>
            <Formik
                initialValues={{
                    warehouse_name: "",
                    user_id: "",
                    address: "",
                }}
                validationSchema={validation}
                onSubmit={(value) => {
                    addWarehouse(value);
                }}
            >
                <Form>
                    <FormControl isRequired>
                        <FormLabel>Warehouse Name</FormLabel>
                        <Input as={Field} name={"warehouse_name"} />
                        <ErrorMessage
                            style={{ color: "red" }}
                            component="div"
                            name="warehouse_name"
                        />
                        <FormLabel>Warehouse Address</FormLabel>
                        <FastField name="address">
                            {({ field, form }) => (
                                <Textarea
                                    {...field}
                                    size="lg"
                                    height="200px"
                                    isInvalid={
                                        form.errors.address &&
                                        form.touched.address
                                    }
                                />
                            )}
                        </FastField>
                        <ErrorMessage
                            style={{ color: "red" }}
                            component="div"
                            name="address"
                        />
                        <FormLabel>Province</FormLabel>
                        <Select
                            placeholder={"-- Select --"}
                            onChange={(e) => {
                                setProvinceId(e.target.value.split(",")[0]);
                                setProvince(e.target.value.split(",")[1]);
                            }}
                        >
                            {provinces?.map((item, index) => {
                                return (
                                    <option
                                        key={index}
                                        value={[
                                            item.province_id,
                                            item.province,
                                        ]}
                                    >
                                        {item.province}
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
