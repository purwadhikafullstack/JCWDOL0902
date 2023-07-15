import { Box, useMediaQuery, Text, Stack, Image } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import OrderItem from "./OrderItem";
import axios from "axios";
import { useSelector } from "react-redux";
import pict from "../../assets/not_found.png";

const BASE_API = process.env.REACT_APP_API_BASE_URL;

const OrderList = () => {
    const [isSmallScreen] = useMediaQuery("(max-width: 666px)");
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState("");
    const userId = useSelector((state) => state.userSlice.value.id);
    const token = localStorage.getItem("token");

    const fetchOrderList = async () => {
        try {
            const { data } = await axios.get(
                BASE_API + `/users/transactions?user_id=${userId}`,
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                }
            );

            setOrders(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchOrderList();
    }, []);

    return (
        <Box display={"flex"} flexDirection={"column"}>
            {orders.length === 0 ? (
                <Stack spacing="4" align="center" mt={4}>
                    <Text fontSize="xl" fontWeight="bold">
                        No Orders Found
                    </Text>
                    <Text fontWeight={"500"}>
                        Looks like you have not added anything to your order
                        list
                    </Text>
                    <Image src={pict} alt="Empty Cart" maxWidth="600px" />
                </Stack>
            ) : (
                orders.map((item, i) => (
                    <OrderItem key={i} refetch={fetchOrderList} data={item} />
                ))
            )}
        </Box>
    );
};

export default OrderList;