import {
    Badge,
    Box,
    Button,
    Flex,
    Text,
    useToast,
    Stack,
    Image,
} from "@chakra-ui/react";
import { IoCheckmarkOutline } from "react-icons/io5";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";

import { AddAddress } from "./AddAddress";
import { EditAddress } from "./EditAddress";
import { DeleteAddress } from "./DeleteAddress";

import pict from "../.././assets/location-ilustration.png";

const baseApi = process.env.REACT_APP_API_BASE_URL;

export const Address = () => {
    const toast = useToast();
    const [address, setAddress] = useState([]);
    const [name, setName] = useState("");
    const token = localStorage.getItem("token");

    const fetchAddressUser = useCallback(async () => {
        try {
            const response = await axios.get(`${baseApi}/users/fetch-address`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAddress(response.data.result);
        } catch (error) {}
    }, []);

    const selectDefaultAddress = async (item) => {
        try {
            await axios.patch(
                `${baseApi}/users/change-default-address/${item.id}`,
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
            setTimeout(() => fetchAddressUser(), 1000);
        } catch (error) {}
    };

    useEffect(() => {
        fetchAddressUser();
    }, [fetchAddressUser]);
    return (
        <>
            <Flex
                justifyContent={"center"}
                direction={{ base: "column", md: "row" }}
                gap={{ base: "3", md: "5" }}
                marginTop={"20px"}
            >
                <Box>
                    <AddAddress
                        address={address}
                        baseApi={baseApi}
                        name={name}
                    />
                </Box>
            </Flex>
            <Flex direction={"column"}>
                {address?.map((item, index) => {
                    return (
                        <Box
                            key={index}
                            borderRadius={"md"}
                            bgColor={
                                item?.default_address ? "#90e0ef" : "#ade8f4"
                            }
                            mt={{ base: "6", md: "8" }}
                            p={6}
                            pt={0}
                            pb={0}
                            display={"flex"}
                            flexDirection={"column"}
                            gap={3}
                        >
                            <Box pt={2} display={"flex"} gap={2}>
                                <Text color={"gray.500"} fontWeight={"medium"}>
                                    Address
                                </Text>
                                <Badge
                                    variant={"outline"}
                                    colorScheme={"gray"}
                                    pt={1}
                                    hidden={
                                        item?.default_address ? false : true
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
                                            {item?.user_address}, {item?.city}
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
                                                colorScheme={"teal"}
                                                size={"sm"}
                                                onClick={() =>
                                                    selectDefaultAddress(item)
                                                }
                                            >
                                                Set as Main
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
                                    baseApi={baseApi}
                                    item={item}
                                />
                                <Text
                                    as={"span"}
                                    color="gray.500"
                                    hidden={
                                        item?.default_address ? true : false
                                    }
                                >
                                    {"|"}
                                </Text>
                                <DeleteAddress
                                    item={item}
                                    fetchAddressUser={fetchAddressUser}
                                    baseApi={baseApi}
                                />
                            </Box>
                        </Box>
                    );
                })}
            </Flex>
            <Box marginTop={"15px"}>
                {!address?.length ? (
                    <Stack spacing="4" align="center">
                        <Text fontSize="xl" fontWeight="bold">
                            No Address Found
                        </Text>
                        <Text fontWeight={"500"}>
                            Looks like you have not added anything to your
                            address
                        </Text>
                        <Image src={pict} alt="Empty Cart" maxWidth="600px" />
                    </Stack>
                ) : (
                    ""
                )}
            </Box>
        </>
    );
};
