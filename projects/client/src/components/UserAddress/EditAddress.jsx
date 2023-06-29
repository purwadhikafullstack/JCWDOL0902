import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    FormControl,
    FormLabel,
    Input,
    Divider,
    Checkbox,
    Text,
    Flex,
    Select,
    Textarea,
    useToast,
} from "@chakra-ui/react";

import { useCallback, useEffect, useState } from "react";
import { Formik, ErrorMessage, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";

export const EditAddress = ({ baseApi, item }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isLoading, setLoading] = useState(false);
    const toast = useToast();
    const [province, setProvince] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState([]);
    const [city, setCity] = useState([]);
    const [selectedCity, setSelectedCity] = useState([]);
    const [defaultAddress, setDefaultAddress] = useState(item.default_address);
    const handleDefaultAddress = (e) => setDefaultAddress(e.target.checked);
    const token = localStorage.getItem("token");

    const getProvince = useCallback(async () => {
        try {
            const response = await axios(`${baseApi}/province`);
            setProvince(response.data.result);
        } catch (error) {}
    }, [baseApi]);

    const renderProvince = () => {
        return province?.map((item) => {
            return (
                <option
                    value={[item?.province_id, item?.province]}
                    key={item?.province_id}
                >
                    {item?.province}
                </option>
            );
        });
    };

    const handleProvince = (value) => {
        setSelectedProvince(value?.split(","));
    };

    const getCity = useCallback(async () => {
        try {
            const response = await (
                await axios(
                    `${baseApi}/city/${
                        selectedProvince ? selectedProvince[0] : ""
                    }`
                )
            ).data;
            setCity(response.result);
        } catch (error) {}
    }, [baseApi, selectedProvince]);

    const renderCity = () => {
        return city?.map((item) => {
            return (
                <option
                    value={[item?.city_id, item?.city_name, item?.type]}
                    key={item?.city_id}
                >
                    {item?.type} {item?.city_name}
                </option>
            );
        });
    };

    const handleCity = (value) => {
        setSelectedCity(value?.split(","));
    };

    const addressValid = Yup.object().shape({
        receiver_name: Yup.string()
            .required("Required")
            .min(3, "Recipient Name at least 3")
            .max(50, "Recipient Name maximum 50"),
        user_address: Yup.string()
            .required("Required")
            .max(200, "Address maximum 200"),
    });

    const editAddress = async (value) => {
        try {
            if (!selectedProvince?.length) {
                return toast({
                    position: "top",
                    title: "Select Province",
                    defaultAddress: "warning",
                    isClosable: true,
                });
            }
            if (!selectedCity?.length) {
                return toast({
                    position: "top",
                    title: "Select City/Regency",
                    defaultAddress: "warning",
                    isClosable: true,
                });
            }
            setLoading(true);

            await axios.patch(
                `${baseApi}/users/update-address/${item.id}`,
                {
                    receiver_name: value.receiver_name,
                    province: selectedProvince[1],
                    province_id: selectedProvince[0],
                    city: selectedCity[1],
                    city_id: selectedCity[0],
                    user_address: value.user_address,
                    default_address: defaultAddress,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setTimeout(
                () =>
                    toast({
                        position: "top",
                        title: "Successfully Change Address",
                        defaultAddress: "success",
                        isClosable: true,
                    }),
                2000
            );
            setTimeout(() => setLoading(false), 2500);
            setTimeout(() => window.location.reload(), 3000);
        } catch (error) {
            toast({
                position: "top",
                title: error.response.data,
                defaultAddress: "error",
                isClosable: true,
            });
            setLoading(false);
        }
    };

    useEffect(() => {
        getProvince();
        if (selectedProvince) {
            getCity();
        }
    }, [getProvince, getCity, selectedProvince]);
    return (
        <>
            <Text
                cursor={"pointer"}
                onClick={onOpen}
                fontWeight={"bold"}
                color={"#023e8a"}
            >
                Change Address
            </Text>

            <Modal
                isOpen={isOpen}
                closeOnOverlayClick={false}
                scrollBehavior={"outside"}
                size={{ base: "md", md: "2xl" }}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader m={"auto"}>Change Address</ModalHeader>
                    <ModalCloseButton />
                    <Divider />
                    <Formik
                        initialValues={{
                            receiver_name: item?.receiver_name,
                            user_address: item?.user_address,
                            default_address: item?.default_address,
                        }}
                        validationSchema={addressValid}
                        onSubmit={(value) => {
                            editAddress(value);
                        }}
                    >
                        {(props) => {
                            return (
                                <>
                                    <Form>
                                        <ModalBody pb={6} mt={4}>
                                            <Text as={"b"} fontSize={"20px"}>
                                                Update Your Current Address
                                            </Text>
                                            <FormControl mt={4}>
                                                <Flex direction={"column"}>
                                                    <FormLabel>
                                                        Name of Recipient
                                                    </FormLabel>
                                                    <Input
                                                        name="receiver_name"
                                                        as={Field}
                                                        maxLength="50"
                                                    />
                                                    <ErrorMessage
                                                        style={{
                                                            color: "red",
                                                        }}
                                                        component="div"
                                                        name="receiver_name"
                                                    />
                                                    <FormLabel mt={4}>
                                                        Province
                                                    </FormLabel>
                                                    <Select
                                                        placeholder="--Province--"
                                                        onChange={(e) =>
                                                            handleProvince(
                                                                e.target.value
                                                            )
                                                        }
                                                        name="province"
                                                    >
                                                        {renderProvince()}
                                                    </Select>
                                                    <FormLabel mt={4}>
                                                        City/Regency
                                                    </FormLabel>
                                                    <Select
                                                        placeholder="--City--"
                                                        onChange={(e) =>
                                                            handleCity(
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        {renderCity()}
                                                    </Select>
                                                    <FormLabel mt={4}>
                                                        Full Address
                                                    </FormLabel>
                                                    <Field
                                                        name="user_address"
                                                        as={Textarea}
                                                        maxLength="200"
                                                    />
                                                    <ErrorMessage
                                                        style={{
                                                            color: "red",
                                                        }}
                                                        component="div"
                                                        name="user_address"
                                                    />
                                                    <Checkbox
                                                        colorScheme={"teal"}
                                                        mt={2}
                                                        onChange={(e) =>
                                                            handleDefaultAddress(
                                                                e
                                                            )
                                                        }
                                                        defaultChecked={
                                                            item.default_address
                                                        }
                                                        isDisabled={
                                                            item.default_address ===
                                                            true
                                                                ? true
                                                                : false
                                                        }
                                                    >
                                                        Set it as the Main
                                                        Address
                                                    </Checkbox>
                                                </Flex>
                                            </FormControl>
                                        </ModalBody>
                                        <ModalFooter
                                            display={"flex"}
                                            flexDirection={"column"}
                                            gap={4}
                                            textAlign={"center"}
                                        >
                                            <Button
                                                colorScheme="teal"
                                                type="submit"
                                                isLoading={isLoading}
                                            >
                                                Save
                                            </Button>
                                        </ModalFooter>
                                    </Form>
                                </>
                            );
                        }}
                    </Formik>
                </ModalContent>
            </Modal>
        </>
    );
};
