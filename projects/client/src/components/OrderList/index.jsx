import { Box, useMediaQuery, Text, Stack, Image, HStack, Button, Select, Flex, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import OrderItem from "./OrderItem";
import axios from "axios";
import { useSelector } from "react-redux";
import pict from "../../assets/not_found.png";

const BASE_API = process.env.REACT_APP_API_BASE_URL;
const STATUS_ORDER = [
    {
        id: 0,
        status: 'All Order'
    },
    {
        id: 1,
        status: 'Menunggu Pembayaran'
    },
    {
        id: 2,
        status: 'Menunggu Konfirmasi Pembayaran'
    },
    {
        id: 3,
        status: 'Pesanan Diproses'
    },
    {
        id: 4,
        status: 'Pesanan Dikirim'
    },
    {
        id: 5,
        status: 'Pesanan Selesan'
    },
    {
        id: 6,
        status: 'Pesanan Batal'
    },
]


const OrderList = () => {
    const [isSmallScreen] = useMediaQuery("(max-width: 666px)");
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const userId = useSelector((state) => state.userSlice.value.id);
    const token = localStorage.getItem("token");

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const fetchOrderList = async (page, status) => {

        try {
            const { data } = await axios.get(
                BASE_API + `/users/transactions?user_id=${userId}&status=${status}&page=${page}`,
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                }
            );
            // console.log(data);
            setOrders(data.data);
            setTotalPages(data.totalPages)
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchOrderList(currentPage, filter);
    }, [userId, currentPage, filter]);

    return (
        <Box display={"flex"} flexDirection={"column"}>
            <VStack mt={'4'} alignItems={'flex-start'}>
                <Text fontSize={'lg'} fontWeight={'semibold'}>Filter Order</Text>
                <Select border={'2px'} fontWeight={'bold'} borderColor={'gray.400'} onChange={(e) => setFilter(e.target.value)}>
                    {
                        STATUS_ORDER.map(status => (
                            <option key={status.id} value={status.id}>{status.status}</option>
                        ))
                    }
                </Select>
            </VStack>
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
                    <OrderItem key={i} refetch={() => fetchOrderList(currentPage, filter)} data={item} />
                ))
            )}
            <HStack justifyContent="center" spacing={4} mt={'5'}>
                <Button colorScheme="blue" variant={'solid'} onClick={handlePreviousPage} isDisabled={currentPage === 1}>
                    Previous
                </Button>
                <Text>{currentPage} of {totalPages}</Text>
                <Button colorScheme="blue" variant={'solid'} onClick={handleNextPage} isDisabled={currentPage === totalPages}>
                    Next
                </Button>
            </HStack>
        </Box>
    );
};

export default OrderList;