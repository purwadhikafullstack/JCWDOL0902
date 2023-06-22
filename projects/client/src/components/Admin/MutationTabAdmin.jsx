import Axios from "axios";
import { useEffect, useState, useCallback } from "react";

import {
    Thead,
    Box,
    Table,
    Tr,
    Tbody,
    Td,
    Th,
    TableContainer,
    Center,
    Flex,
    IconButton,
    Skeleton,
    Stack,
    Text,
} from "@chakra-ui/react";

import { BsArrowUp, BsArrowDown } from "react-icons/bs";
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";

export const MutationList = () => {
    const url = process.env.REACT_APP_API_BASE_URL + "/admin";
    const token = localStorage.getItem("token");

    const [mutation, setMutation] = useState();
    const [sort, setSort] = useState("id");
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState("ASC");
    const [pages, setPages] = useState();

    const getMutation = useCallback(async () => {
        try {
            const mutationURL =
                url +
                `/fetch-all-mutations?&sort=${sort}&order=${order}&page=${page}`;
            const resultMutation = await Axios.get(mutationURL, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });
            setMutation(resultMutation.data.result);
            setPages(resultMutation.data.pages);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        } catch (err) {}
    }, [sort, order, page, url, token]);

    useEffect(() => {
        getMutation();
    }, []);

    const tableHead = [
        { name: "ID", origin: "id", width: "100px" },
        { name: "Mutation Date", origin: "mutation_date", width: "250px" },
        { name: "Approval Status", origin: "approved", width: "250px" },
        {
            name: "Warehouse Request",
            origin: "requested_by",
            width: "300px",
        },
        {
            name: "Warehouse Approval",
            origin: "warehouse_approval_id",
            width: "300px",
        },
        { name: "Product", origin: "product_id", width: "300px" },
        { name: "Quantity", origin: "qty", width: "200px" },
        { name: "Remarks", origin: "remarks", width: "250px" },
    ];

    return (
        <Box padding={{ base: "10px", lg: "0" }} mt={"10"}>
            <TableContainer borderRadius={"10px"}>
                <Table>
                    <Thead>
                        <Tr>
                            {tableHead.map((item, index) => {
                                return (
                                    <Th
                                        key={index}
                                        bg={"#3182CE"}
                                        textAlign={"center"}
                                        color={"white"}
                                        width={item.width}
                                        borderY={"none"}
                                    >
                                        <Center>
                                            <Flex gap={"5px"}>
                                                <Center>{item.name}</Center>
                                                <Stack>
                                                    <IconButton
                                                        icon={<BsArrowUp />}
                                                        size={"xs"}
                                                        color={"black"}
                                                        onClick={() => {
                                                            setSort(
                                                                item.origin
                                                            );
                                                            setPage(0);
                                                            setOrder("ASC");
                                                        }}
                                                        bg={"none"}
                                                    />
                                                    <IconButton
                                                        icon={<BsArrowDown />}
                                                        size={"xs"}
                                                        color={"black"}
                                                        onClick={() => {
                                                            setSort(
                                                                item.origin
                                                            );
                                                            setPage(0);
                                                            setOrder("DESC");
                                                        }}
                                                        bg={"none"}
                                                    />
                                                </Stack>
                                            </Flex>
                                        </Center>
                                    </Th>
                                );
                            })}
                        </Tr>
                    </Thead>
                    {mutation ? (
                        mutation?.map((item, index) => {
                            return (
                                <Tbody
                                    key={index}
                                    bg={"#ADE8F4"}
                                    _hover={{ bg: "#CAF0F8" }}
                                >
                                    <Tr>
                                        <Td textAlign={"center"}>{item.id}</Td>
                                        <Td textAlign={"center"}>
                                            {item.mutation_date}
                                        </Td>
                                        <Td textAlign={"center"}>
                                            {item.approved}
                                        </Td>
                                        <Td textAlign={"center"}>
                                            {item.requested_by}
                                        </Td>
                                        <Td textAlign={"center"}>
                                            {
                                                item.warehouse_location
                                                    ?.warehouse_name
                                            }
                                        </Td>
                                        <Td textAlign={"center"}>
                                            {item.product?.name}
                                        </Td>
                                        <Td textAlign={"center"}>{item.qty}</Td>
                                        <Td textAlign={"center"}>
                                            {item.remarks}
                                        </Td>
                                    </Tr>
                                </Tbody>
                            );
                        })
                    ) : (
                        <Tbody>
                            <Tr>
                                {tableHead.map((item, index) => {
                                    return (
                                        <Td key={index}>
                                            <Skeleton h={"10px"} />
                                        </Td>
                                    );
                                })}
                                <Td>
                                    <Skeleton h={"10px"} />
                                </Td>
                            </Tr>
                        </Tbody>
                    )}
                </Table>
            </TableContainer>
            <Center paddingY={"10px"}>
                {page <= 0 ? (
                    <IconButton icon={<SlArrowLeft />} disabled />
                ) : (
                    <IconButton
                        onClick={() => {
                            setPage(page - 1);
                        }}
                        icon={<SlArrowLeft />}
                    />
                )}
                <Text paddingX={"10px"}>
                    {page + 1} of {pages}
                </Text>
                {page < pages - 1 ? (
                    <IconButton
                        icon={<SlArrowRight />}
                        onClick={() => {
                            setPage(page + 1);
                        }}
                    />
                ) : (
                    <IconButton icon={<SlArrowRight />} disabled />
                )}
            </Center>
        </Box>
    );
};
