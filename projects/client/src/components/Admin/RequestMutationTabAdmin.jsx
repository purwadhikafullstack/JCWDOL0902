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

import { BsFillCaretDownFill, BsFillCaretUpFill } from "react-icons/bs";
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";

import { CreateRequestMutation } from "./AdminProperties/CreateRequestMutation";

export const WarehouseMutationRequestList = () => {
    const url = process.env.REACT_APP_API_BASE_URL + "/admin";
    const token = localStorage.getItem("token");

    const [mutation, setMutation] = useState();
    const [warehouse, setWarehouse] = useState();
    const [sort, setSort] = useState("id");
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState("ASC");
    const [pages, setPages] = useState();
    const [search, setSearch] = useState(``);
    const [product, setProduct] = useState();

    const getMutation = useCallback(async () => {
        try {
            const mutationURL =
                url +
                `/fetch-mutation-requests?&sort=${sort}&order=${order}&page=${page}`;
            const resultMutation = await Axios.get(mutationURL, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });

            const resultWarehouse = await Axios.get(
                url +
                    `/fetch-warehouses?search=${search}&sort=${sort}&order=${order}&page=${page}`,
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                }
            );
            const resultProduct = await Axios.get(
                url +
                    `/fetch-productlist?search=${search}&sort=${sort}&order=${order}&page=${page}`,
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                }
            );

            setWarehouse(resultWarehouse.data.allWarehouse);
            setMutation(resultMutation.data.result);
            setProduct(resultProduct.data.allProduct);
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
            name: "Request To",
            origin: "warehouse_approve_id",
            width: "300px",
        },
        { name: "Product", origin: "product_id", width: "300px" },
        { name: "Quantity", origin: "qty", width: "200px" },
        { name: "Remarks", origin: "remarks", width: "250px" },
    ];

    return (
        <Box padding={{ base: "10px", lg: "0" }} mt={"5"}>
            <Center paddingBottom={"12px"}>
                <Stack>
                    <Center>
                        <CreateRequestMutation
                            getMutation={getMutation}
                            warehouse={warehouse}
                            product={product}
                        />
                    </Center>
                </Stack>
            </Center>
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
                                                        icon={
                                                            <BsFillCaretUpFill />
                                                        }
                                                        size={"xs"}
                                                        color={"white"}
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
                                                        icon={
                                                            <BsFillCaretDownFill />
                                                        }
                                                        size={"xs"}
                                                        color={"white"}
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
