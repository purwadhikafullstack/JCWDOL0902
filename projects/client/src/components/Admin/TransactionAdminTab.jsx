import Axios from "axios";
import { useEffect, useState, useCallback, useRef } from "react";

import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Flex,
    Box,
    Center,
    InputGroup,
    Input,
    InputRightElement,
    IconButton,
    Stack,
    Skeleton,
    Text,
} from "@chakra-ui/react";

import { BiSearch } from "react-icons/bi";
import { BsFillCaretDownFill, BsFillCaretUpFill } from "react-icons/bs";
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";

export const TransactionList = () => {
    const url = process.env.REACT_APP_API_BASE_URL + "/admin";
    const token = localStorage.getItem("token");

    const [transaction, setTransaction] = useState();
    const [sort, setSort] = useState("id");
    const [order, setOrder] = useState("ASC");
    const [page, setPage] = useState(0);
    const [pages, setPages] = useState();
    const [search, setSearch] = useState(``);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const searchValue = useRef(``);

    const getTransaction = useCallback(async () => {
        try {
            const transactionURL =
                url +
                `/fetch-all-transactions?search=${search}&sort=${sort}&order=${order}&page=${page}&startDate=${startDate}&endDate=${endDate}`;

            const transactionResult = await Axios.get(transactionURL, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });

            setTransaction(transactionResult.data.result);
            setPages(transactionResult.data.pages);

            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        } catch (err) {}
    }, [url, order, page, search, sort, token, startDate, endDate]);

    useEffect(() => {
        getTransaction();
    }, [getTransaction]);

    const tableHead = [
        { name: "Transaction ID", origin: "id", width: "200px" },
        { name: "Date", origin: "transaction_date", width: "200px" },
        { name: "User Name", origin: "user_id", width: "200px" },
        { name: "User Address", origin: "user_address_id", width: "150px" },
        { name: "Warehouse", origin: "warehouse_location_id", width: "100px" },
        { name: "Order Status", origin: "order_status_id", width: "100px" },
        { name: "Expire Date", origin: "expired", width: "100px" },
    ];

    return (
        <Box padding={{ base: "10px", lg: "0" }}>
            <Center paddingBottom={"12px"}>
                <Stack>
                    <Flex>
                        <Box paddingRight={"5px"}>
                            <InputGroup w={{ base: "200px", lg: "400px" }}>
                                <Input
                                    placeholder={"Search"}
                                    _focusVisible={{
                                        border: "1px solid black",
                                    }}
                                    ref={searchValue}
                                />
                                <InputRightElement>
                                    <IconButton
                                        type={"submit"}
                                        aria-label="Search database"
                                        bg={"none"}
                                        opacity={"50%"}
                                        _hover={{ bg: "none", opacity: "100%" }}
                                        icon={<BiSearch />}
                                        onClick={() => {
                                            setSearch(
                                                searchValue.current.value
                                            );
                                            setSort("id");
                                            setPage(0);
                                            setOrder("ASC");
                                            setStartDate(startDate);
                                            setEndDate(endDate);
                                        }}
                                    />
                                </InputRightElement>
                            </InputGroup>
                        </Box>
                    </Flex>
                    <Stack direction="row" spacing={4} alignItems="center">
                        <InputGroup>
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </InputGroup>
                        <Text>to</Text>
                        <InputGroup>
                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </InputGroup>
                    </Stack>
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
                                        w={item.width}
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
                    {transaction ? (
                        transaction?.map((item, index) => {
                            return (
                                <Tbody
                                    key={index}
                                    bg={"#ADE8F4"}
                                    _hover={{ bg: "#CAF0F8" }}
                                >
                                    <Tr>
                                        <Td textAlign={"center"}>{item.id}</Td>
                                        <Td textAlign={"center"}>
                                            {item.transaction_date}
                                        </Td>
                                        <Td textAlign={"center"}>
                                            {item.user?.name}
                                        </Td>
                                        <Td textAlign={"center"}>
                                            {item.user_address?.user_address}
                                        </Td>
                                        <Td textAlign={"center"}>
                                            {
                                                item.warehouse_location
                                                    ?.warehouse_name
                                            }
                                        </Td>
                                        <Td textAlign={"center"}>
                                            {item.order_status?.status}
                                        </Td>
                                        <Td textAlign={"center"}>
                                            {item.expired}
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
