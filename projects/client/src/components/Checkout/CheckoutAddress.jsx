import { useEffect, useState, useCallback } from "react";
import axios from "axios";

import { IoCheckmarkOutline } from "react-icons/io5";

import { AddAddress } from "../UserAddress/AddAddress";
import { EditAddress } from "../UserAddress/EditAddress";
import { DeleteAddress } from "../UserAddress/DeleteAddress";
import {
    Box,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    useDisclosure,
    Badge,
    Flex,
    Text,
    useToast,
} from "@chakra-ui/react";

export const CheckoutAddress = ({ setDestination, setFullAddress }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [address, setAddress] = useState([]);
    const [name, setName] = useState("");

    const toast = useToast();

    const url = process.env.REACT_APP_API_BASE_URL;
    const token = localStorage.getItem("token");
    const fetchAddress = useCallback(async () => {
        try {
            const addressURL = url + `/users/fetch-address`;
            const result = await axios.get(addressURL, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });
            setAddress(result.data.result);
            setFullAddress(result.data.result);
            setDestination(
                result.data.result.find((item) => item.default_address === true)
                    .city_id
            );
        } catch (err) {}
    }, [url, token]);
    const selectDefaultAddress = async (item) => {
        try {
            await axios.patch(
                `${url}/users/change-default-address/${item.id}`,
                null,
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
                        title: "Successfully Changing the Main Address",
                        default_address: "success",
                        variant: "subtle",
                        isClosable: true,
                    }),
                1500
            );
            setTimeout(() => {
                fetchAddress();
                onClose();
            }, 1000);
        } catch (error) {}
    };
    useEffect(() => {
        fetchAddress();
    }, [fetchAddress]);
    return (
        <Box>
            {address.filter((item) => item.default_address === true)?.length ? (
                address
                    .filter((item) => item.default_address === true)
                    .map((item, index) => {
                        return (
                            <>
                                <Box
                                    key={index}
                                    borderRadius={"md"}
                                    bgColor={
                                        item?.default_address
                                            ? "#90e0ef"
                                            : "#ade8f4"
                                    }
                                    mt={{ base: "6", md: "3" }}
                                    pl={4}
                                    pt={2}
                                    pb={4}
                                    display={"flex"}
                                    flexDirection={"column"}
                                    gap={3}
                                >
                                    <Box pt={2} display={"flex"} gap={2}>
                                        <Badge
                                            variant={"outline"}
                                            colorScheme={"gray"}
                                            pt={1}
                                            hidden={
                                                item?.default_address
                                                    ? false
                                                    : true
                                            }
                                        >
                                            Main Address
                                        </Badge>
                                    </Box>
                                    <Box>
                                        <Flex justifyContent={"space-between"}>
                                            <Box>
                                                <Text
                                                    fontWeight={"semibold"}
                                                    fontSize={{
                                                        base: "16px",
                                                        md: "20px",
                                                    }}
                                                >
                                                    {item?.receiver_name}
                                                </Text>
                                                <Text>
                                                    {item?.user.phone_number}
                                                </Text>
                                                <Text>
                                                    {item?.user_address},{" "}
                                                    {item?.city}
                                                </Text>
                                            </Box>
                                        </Flex>
                                    </Box>
                                </Box>
                                <Button
                                    onClick={onOpen}
                                    colorScheme="white"
                                    color="black"
                                    border="2px"
                                    borderColor="gray.400"
                                    mt={3}
                                >
                                    Select Another Address
                                </Button>
                            </>
                        );
                    })
            ) : (
                <>
                    <Text fontWeight={"500"}>
                        You Don't Have a Main Address
                    </Text>
                    <Button
                        onClick={onOpen}
                        colorScheme="white"
                        color="black"
                        border="2px"
                        borderColor="gray.400"
                        mt={3}
                    >
                        Select an Address{" "}
                    </Button>
                </>
            )}

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign={"center"} mt={5} mb={-5}>
                        Select an Address
                    </ModalHeader>
                    <ModalBody mb={10}>
                        <Flex
                            justifyContent={"center"}
                            direction={{ base: "column", md: "row" }}
                            marginTop={5}
                        >
                            <Box>
                                <AddAddress
                                    address={address}
                                    baseApi={url}
                                    name={name}
                                />
                            </Box>
                        </Flex>
                        <Flex direction={"column"}>
                            {address?.length ? (
                                address.map((item, index) => {
                                    return (
                                        <Box
                                            key={index}
                                            borderRadius={"md"}
                                            bgColor={
                                                item?.default_address
                                                    ? "#90e0ef"
                                                    : "#ade8f4"
                                            }
                                            mt={{
                                                base: "6",
                                                md: "8",
                                            }}
                                            p={6}
                                            pt={0}
                                            pb={0}
                                            display={"flex"}
                                            flexDirection={"column"}
                                            gap={3}
                                        >
                                            <Box
                                                pt={2}
                                                display={"flex"}
                                                gap={2}
                                            >
                                                <Badge
                                                    variant={"outline"}
                                                    colorScheme={"gray"}
                                                    pt={1}
                                                    mt={2}
                                                    hidden={
                                                        item?.default_address
                                                            ? false
                                                            : true
                                                    }
                                                >
                                                    Main Address
                                                </Badge>
                                            </Box>
                                            <Box>
                                                <Flex
                                                    justifyContent={
                                                        "space-between"
                                                    }
                                                >
                                                    <Box>
                                                        <Text
                                                            fontWeight={
                                                                "semibold"
                                                            }
                                                            fontSize={{
                                                                base: "16px",
                                                                md: "20px",
                                                            }}
                                                        >
                                                            {
                                                                item?.receiver_name
                                                            }
                                                        </Text>
                                                        <Text>
                                                            {
                                                                item?.user
                                                                    .phone_number
                                                            }
                                                        </Text>
                                                        <Text>
                                                            {item?.user_address}
                                                            , {item?.city}
                                                        </Text>
                                                    </Box>
                                                    <Box pt={"3.5"}>
                                                        {item?.default_address ? (
                                                            <IoCheckmarkOutline
                                                                transform="scale(2.2)"
                                                                color="teal"
                                                            />
                                                        ) : (
                                                            <Button
                                                                colorScheme={
                                                                    "teal"
                                                                }
                                                                size={"sm"}
                                                                onClick={() => {
                                                                    setDestination(
                                                                        item.city_id
                                                                    );
                                                                    selectDefaultAddress(
                                                                        item
                                                                    );
                                                                }}
                                                            >
                                                                Select
                                                            </Button>
                                                        )}
                                                    </Box>
                                                </Flex>
                                            </Box>
                                            <Box
                                                mb={3}
                                                color={"#black"}
                                                display={"flex"}
                                                gap={4}
                                            >
                                                <EditAddress
                                                    address={address}
                                                    baseApi={url}
                                                    item={item}
                                                />
                                                <Text
                                                    as={"span"}
                                                    color="gray.500"
                                                >
                                                    {"|"}
                                                </Text>
                                                <DeleteAddress
                                                    item={item}
                                                    fetchAddressUser={
                                                        fetchAddress
                                                    }
                                                    baseApi={url}
                                                />
                                            </Box>
                                        </Box>
                                    );
                                })
                            ) : (
                                <Text
                                    textAlign="center"
                                    mt={6}
                                    fontWeight={"600"}
                                >
                                    You Don't Have an Address Yet
                                </Text>
                            )}
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};
