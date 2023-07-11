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

export const WarehouseReportList = () => {
    const url = process.env.REACT_APP_API_BASE_URL + "/admin";
    const token = localStorage.getItem("token");

    const [report, setReport] = useState();
    const [sort, setSort] = useState("id");
    const [order, setOrder] = useState("ASC");
    const [page, setPage] = useState(0);
    const [pages, setPages] = useState();
    const [search, setSearch] = useState(``);

    const searchValue = useRef(``);

    const getReport = useCallback(async () => {
        try {
            const reportURL =
                url +
                `/fetch-own-stock-reports?search=${search}&sort=${sort}&order=${order}&page=${page}`;

            const resultReport = await Axios.get(reportURL, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });

            setReport(resultReport.data.result);
            setPages(resultReport.data.pages);

            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        } catch (err) {}
    }, [url, order, page, search, sort, token]);

    useEffect(() => {
        getReport();
    }, [getReport]);

    const tableHead = [
        { name: "Date", origin: "journal_date", width: "200px" },
        { name: "Type", origin: "type", width: "200px" },
        { name: "Product", origin: "product_id", width: "" },
        { name: "Warehouse", origin: "warehouse_location_id", width: "150px" },
        { name: "Increment", origin: "increment_change", width: "100px" },
        { name: "Decrement", origin: "decrement_change", width: "100px" },
        {
            name: "Total Stock Before",
            origin: "total_qty_before",
            width: "100px",
        },
        {
            name: "Updated Total Stock",
            origin: "new_total_qty",
            width: "100px",
        },
        {
            name: "Remarks",
            origin: "description",
            width: "100px",
        },
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
                                        }}
                                    />
                                </InputRightElement>
                            </InputGroup>
                        </Box>
                    </Flex>
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
                    {report ? (
                        report?.map((item, index) => {
                            return (
                                <Tbody
                                    key={index}
                                    bg={"#ADE8F4"}
                                    _hover={{ bg: "#CAF0F8" }}
                                >
                                    <Tr>
                                        <Td textAlign={"center"}>
                                            {item.journal_date}
                                        </Td>
                                        <Td textAlign={"center"}>
                                            {item.type}
                                        </Td>
                                        <Td textAlign={"center"}>
                                            {item.product?.name}
                                        </Td>
                                        <Td textAlign={"center"}>
                                            {
                                                item.warehouse_location
                                                    ?.warehouse_name
                                            }
                                        </Td>
                                        <Td textAlign={"center"}>
                                            {item.increment_change}
                                        </Td>
                                        <Td textAlign={"center"}>
                                            {item.decrement_change}
                                        </Td>
                                        <Td textAlign={"center"}>
                                            {item.total_qty_before}
                                        </Td>
                                        <Td textAlign={"center"}>
                                            {item.new_total_qty}
                                        </Td>
                                        <Td textAlign={"center"}>
                                            {item.description}
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
