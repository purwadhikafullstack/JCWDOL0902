import Axios from "axios";
import { useEffect, useState, useCallback, useRef } from "react";

import { Formik, ErrorMessage, Form, Field } from "formik";
import * as Yup from "yup";

import {
    Box,
    Center,
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
    IconButton,
} from "@chakra-ui/react";

// swal
import Swal from "sweetalert2";

// icons
import { BsFillGearFill } from "react-icons/bs";
import { RxCheck, RxCross1 } from "react-icons/rx";

export const EditWarehouse = ({
    warehouse,
    getWarehouse,
    admin,
    provinces,
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Box>
            <IconButton
                icon={<BsFillGearFill />}
                bg={"none"}
                onClick={onOpen}
            />
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign={"center"}>
                        Edit Warehouse
                    </ModalHeader>
                    <ModalBody>
                        <EditForm
                            warehouse={warehouse}
                            getWarehouse={getWarehouse}
                            close={onClose}
                            admin={admin}
                            provinces={provinces}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

const EditForm = ({ close, getWarehouse, admin, provinces, warehouse }) => {
    const url =
        process.env.REACT_APP_API_BASE_URL +
        `/admin/update-warehouse/${warehouse.id}`;
    const token = localStorage.getItem("token");

    const [cities, setCities] = useState();
    const [province, setProvince] = useState(warehouse.province);
    const [provinceId, setProvinceId] = useState(warehouse.province_id);
    const [city, setCity] = useState();
    const [cityId, setCityId] = useState();

    const UserId = useRef("");

    const validation = Yup.object().shape({
        warehouse_name: Yup.string().required("Cannot be Empty"),
    });

    const getCities = useCallback(async () => {
        try {
            const resultCities = await Axios.get(
                process.env.REACT_APP_API_BASE_URL + `/city/${provinceId}`
            );
            setCities(resultCities.data.result);
        } catch (err) {}
    }, [provinceId]);

    const editWarehouse = async (value) => {
        try {
            if (
                value.warehouse_name !== warehouse.warehouse_name ||
                province !== warehouse.province ||
                city !== warehouse.city ||
                +UserId.current.value !== warehouse.UserId
            ) {
                const data = {
                    warehouse_name: value.warehouse_name,
                    province: province,
                    province_id: +provinceId,
                    city: city,
                    city_id: +cityId,
                    UserId: UserId.current.value,
                };
                await Axios.patch(url, data, {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                });
            }

            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Warehouse Edited",
            });

            getWarehouse();
            close();
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.response.data.message,
            });
        }
    };

    useEffect(() => {
        getCities();
    }, [getCities]);

    return (
        <Box>
            <Formik
                initialValues={{
                    warehouse_name: warehouse.warehouse_name,
                }}
                validationSchema={validation}
                onSubmit={(value) => {
                    editWarehouse(value);
                }}
            >
                <Form>
                    <FormControl>
                        <FormLabel>Warehouse Name</FormLabel>
                        <Input as={Field} name={"warehouse_name"} />
                        <ErrorMessage
                            style={{ color: "red" }}
                            component="div"
                            name="warehouse_name"
                        />
                        <FormLabel>Province</FormLabel>
                        <Select
                            placeholder={warehouse.province}
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
                        <FormLabel>City</FormLabel>
                        <Select
                            placeholder={warehouse.city}
                            onChange={(e) => {
                                setCityId(e.target.value.split(",")[0]);
                                setCity(e.target.value.split(",")[1]);
                            }}
                        >
                            {cities?.map((item, index) => {
                                return (
                                    <option
                                        key={index}
                                        value={[item.city_id, item.city_name]}
                                    >
                                        {item.city_name}
                                    </option>
                                );
                            })}
                        </Select>
                        <FormLabel>Admin Id</FormLabel>
                        <Select ref={UserId} defaultValue={warehouse.UserId}>
                            {admin.map((item, index) => {
                                return (
                                    <option value={item.id} key={index}>
                                        {item.id}
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
            </Formik>
        </Box>
    );
};
