// react
import Axios from "axios";
import { useEffect, useState, useCallback } from "react";

// chakra
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
    Skeleton,
    Text,
    Select,
    HStack,
    Button,
    Spacer,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { BiSearch } from "react-icons/bi";
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";
const baseApi = process.env.REACT_APP_API_BASE_URL;

export const SalesList = () => {
    const { id, role } = useSelector((state) => state.userSlice.value);
    const [salesList, setSalesList] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [filterMonth, setFilterMonth] = useState("");
    const [category, setCategory] = useState([]);
    const [filterCat, setFilterCat] = useState("");
    const [wrList, setWrList] = useState([]);
    const [wrId, setWrId] = useState("");
    const [cleanSales, setCleanSales] = useState(0);
    const [search, setSearch] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const token = localStorage.getItem("token");

    const handleQuery = () => setSearchQuery(search);

    const getSalesList = useCallback(async () => {
        try {
            const response = await (
                await Axios.get(
                    `${baseApi}/admin/sale-report?month=${
                        filterMonth ? filterMonth : ""
                    }&categorie=${filterCat}&wrId=${wrId}&search_query=${
                        searchQuery ? searchQuery : ""
                    }&id=${id}&role=${role}&page=${page - 1}`,
                    {
                        headers: {
                            authorization: `Bearer ${token}`,
                        },
                    }
                )
            ).data;
            console.log(response);
            setSalesList(response.allSales);
            setCleanSales(response.cleantotalSales);
            setTotalPage(response.totalPage);
        } catch (err) {
            console.log(err);
            console.log(err.response.data.message);
        }
    }, [filterMonth, filterCat, wrId, searchQuery, id, role, page]);

    const getCategories = useCallback(async () => {
        try {
            const response = await Axios.get(
                `${baseApi}/admin/fetch-categories`,
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                }
            );
            // console.log(response);
            setCategory(response.data.allCategory);
        } catch (err) {
            console.log(err);
        }
    }, []);

    const renderCategories = () => {
        return category.map((item, index) => {
            return (
                <option value={item.id} key={index}>
                    {item.name}
                </option>
            );
        });
    };

    const warehouseList = useCallback(async () => {
        try {
            const response = await (
                await Axios.get(`${baseApi}/admin/fetch-warehouses`, {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                })
            ).data;
            setWrList(response.allWarehouse);
        } catch (error) {
            console.log(error);
        }
    }, []);

    const renderWarehouse = () => {
        return wrList.map((item, index) => {
            return (
                <option value={item.id} key={index}>
                    {item.warehouse_name}
                </option>
            );
        });
    };

    useEffect(() => {
        getSalesList();
        getCategories();
        warehouseList();
    }, [getSalesList, getCategories, warehouseList]);

    const tableHead = [
        { name: "transaction id", origin: "transaction_id", width: "100px" },
        { name: "date", origin: "createdAt", width: "100px" },
        { name: "category", origin: "", width: "100px" },
        { name: "product", origin: "", width: "100px" },
        { name: "price", origin: "", width: "100px" },
        { name: "quantity", origin: "", width: "100px" },
        { name: "Total", origin: "", width: "100px" },
        { name: "warehouse", origin: "", width: "100px" },
    ];

    const crossTitle = (str, start, end) => {
        if (str?.length > end) {
            return str.slice(start, end) + "...";
        }
        return str;
    };

    return (
        <Box>
            <Box>
                <Center mt={5}>
                    <Box paddingRight={"5px"}>
                        <InputGroup w={{ base: "200px", lg: "400px" }}>
                            <Input
                                placeholder={"Search"}
                                _focusVisible={{ border: "1px solid #b759b4" }}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleQuery();
                                        e.preventDefault();
                                    }
                                }}
                                onKeyUp={(e) => {
                                    if (e.key === "Backspace") {
                                        handleQuery();
                                    }
                                }}
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
                                        handleQuery();
                                    }}
                                />
                            </InputRightElement>
                        </InputGroup>
                    </Box>
                </Center>
                <Center>
                    <HStack mt={4} mb={5}>
                        <Box maxW={role === 2 ? "50%" : "30%"}>
                            <Select
                                bgColor={"white"}
                                textColor="black"
                                onChange={(e) => {
                                    setFilterMonth(e.target.value);
                                }}
                            >
                                <option value={""}>---All Year---</option>
                                <option value={1}>January</option>
                                <option value={2}>February</option>
                                <option value={3}>March</option>
                                <option value={4}>April</option>
                                <option value={5}>May</option>
                                <option value={6}>June</option>
                                <option value={7}>July</option>
                                <option value={8}>August</option>
                                <option value={9}>September</option>
                                <option value={10}>October</option>
                                <option value={11}>November</option>
                                <option value={12}>December</option>
                            </Select>
                        </Box>
                        <Box maxW={role === 2 ? "50%" : "30%"}>
                            <Select
                                bgColor={"white"}
                                textColor="black"
                                onChange={(e) => {
                                    setFilterCat(e.target.value);
                                }}
                                placeholder={
                                    filterCat ? "Reset" : "--Categories--"
                                }
                            >
                                {renderCategories()}
                            </Select>
                        </Box>
                        <Box hidden={role === 2 ? true : false} maxW={"30%"}>
                            <Select
                                bgColor={"white"}
                                textColor="black"
                                onChange={(e) => {
                                    setWrId(e.target.value);
                                }}
                                placeholder={wrId ? "Reset" : "--Warehouse--"}
                                hidden={role === 2 ? true : false}
                            >
                                {renderWarehouse()}
                            </Select>
                        </Box>
                    </HStack>
                </Center>
            </Box>

            <Box padding={{ base: "10px", lg: "0" }}>
                {salesList ? (
                    <TableContainer borderRadius={"10px"} minH={"117px"}>
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
                                                        <Center>
                                                            {item.name}
                                                        </Center>
                                                    </Flex>
                                                </Center>
                                            </Th>
                                        );
                                    })}
                                </Tr>
                            </Thead>
                            {salesList ? (
                                salesList?.map((item, index) => {
                                    // ;
                                    return (
                                        <Tbody
                                            key={index}
                                            bg={"#ADE8F4"}
                                            _hover={{ bg: "#CAF0F8" }}
                                        >
                                            <Tr>
                                                <Td textAlign={"center"}>
                                                    {item.id}
                                                </Td>
                                                <Td textAlign={"center"}>
                                                    {item.transaction_date.slice(
                                                        0,
                                                        10
                                                    )}
                                                </Td>
                                                <Td
                                                    textAlign={"center"}
                                                    lineHeight={"10"}
                                                >
                                                    <Box key={index}>
                                                        {
                                                            item
                                                                ?.transaction_item
                                                                .product_location
                                                                .product
                                                                .category?.name
                                                        }
                                                    </Box>
                                                    {/* {item.transaction_item.product_location.map(
                                                        (item, index) => {
                                                            return (
                                                                <Box
                                                                    key={index}
                                                                >
                                                                    {
                                                                        item
                                                                            ?.product
                                                                            .category
                                                                            ?.name
                                                                    }
                                                                </Box>
                                                            );
                                                        }
                                                    )} */}
                                                </Td>
                                                <Td
                                                    textAlign={"start"}
                                                    lineHeight={"10"}
                                                >
                                                    <Box key={index}>
                                                        {item?.transaction_item
                                                            .product_location
                                                            .product?.name
                                                            .length > 40
                                                            ? crossTitle(
                                                                  item
                                                                      ?.transaction_item
                                                                      .product_location
                                                                      .product
                                                                      ?.name,
                                                                  0,
                                                                  -35
                                                              )
                                                            : crossTitle(
                                                                  item
                                                                      ?.transaction_item
                                                                      .product_location
                                                                      .product
                                                                      ?.name,
                                                                  0
                                                              )}
                                                    </Box>
                                                    {/* {item.transaction_item.product_location.map(
                                                        (item, index) => {
                                                            return (
                                                                <Box
                                                                    key={index}
                                                                >
                                                                    {item
                                                                        ?.product
                                                                        ?.name
                                                                        .length >
                                                                    40
                                                                        ? crossTitle(
                                                                              item
                                                                                  ?.product
                                                                                  ?.name,
                                                                              0,
                                                                              -35
                                                                          )
                                                                        : crossTitle(
                                                                              item
                                                                                  ?.product
                                                                                  ?.name,
                                                                              0
                                                                          )}
                                                                </Box>
                                                            );
                                                        }
                                                    )} */}
                                                </Td>
                                                <Td
                                                    textAlign={"start"}
                                                    lineHeight={"10"}
                                                >
                                                    <Box key={index}>
                                                        Rp
                                                        {item?.transaction_item.product_location.product?.price.toLocaleString()}
                                                    </Box>
                                                </Td>
                                                <Td
                                                    textAlign={"center"}
                                                    lineHeight={"10"}
                                                >
                                                    <Box key={index}>
                                                        {
                                                            item
                                                                ?.transaction_item
                                                                .product_location
                                                                .qty
                                                        }
                                                    </Box>
                                                </Td>
                                                <Td
                                                    textAlign={"center"}
                                                    lineHeight={"10"}
                                                >
                                                    <Box key={index}>
                                                        Rp
                                                        {(
                                                            item
                                                                ?.transaction_item
                                                                .product_location
                                                                .qty *
                                                            item
                                                                ?.transaction_item
                                                                .product_location
                                                                .product.price
                                                        ).toLocaleString()}{" "}
                                                    </Box>
                                                </Td>
                                                <Td
                                                    textAlign={"start"}
                                                    lineHeight={"10"}
                                                >
                                                    <Box key={index}>
                                                        {
                                                            item
                                                                ?.transaction_item
                                                                .product_location
                                                                .warehouse_location
                                                                ?.warehouse_name
                                                        }
                                                    </Box>
                                                </Td>
                                            </Tr>
                                        </Tbody>
                                    );
                                })
                            ) : (
                                <Tbody>
                                    <Tr>
                                        <Td>
                                            <Skeleton />
                                        </Td>
                                    </Tr>
                                </Tbody>
                            )}
                        </Table>
                    </TableContainer>
                ) : (
                    <TableContainer>
                        <Center>
                            <Text>No Transactions Yet</Text>
                        </Center>
                    </TableContainer>
                )}

                <Box borderRadius={"10px"}>
                    <Spacer />
                    <Box
                        bg={"#3182CE"}
                        textAlign={"right"}
                        borderRadius={"10px"}
                        p={2}
                        color="white"
                    >
                        Total Sales : Rp{cleanSales.toLocaleString()}{" "}
                    </Box>
                </Box>
                {/* <Center paddingY={"10px"}>
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
                        {page + 1} of {totalPage}
                    </Text>
                    {page < totalPage - 1 ? (
                        <IconButton
                            icon={<SlArrowRight />}
                            onClick={() => {
                                setPage(page + 1);
                            }}
                        />
                    ) : (
                        <IconButton icon={<SlArrowRight />} disabled />
                    )}
                </Center> */}

                <Box
                    display="flex"
                    justifyContent="center"
                    alignContent="center"
                    gap={3}
                    mb={3}
                >
                    <Button
                        onClick={() => {
                            setPage(page - 1);
                        }}
                        disabled={page === 1 ? true : false}
                        size={{ base: "sm", md: "md" }}
                        borderColor="rgb(213, 75, 121)"
                        borderRadius=".6em"
                        borderWidth="2px"
                        bgColor="white"
                        _hover={{ bg: "rgb(213, 75, 121)" }}
                        _active={{ bg: "none" }}
                    >
                        {"Prev"}
                    </Button>
                    <Text alignSelf="center" color={"black"}>
                        {" "}
                        {page} of {totalPage}
                    </Text>

                    <Button
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPage ? true : false}
                        size={{ base: "sm", md: "md" }}
                        borderColor="rgb(213, 75, 121)"
                        borderRadius=".6em"
                        borderWidth="2px"
                        bgColor="white"
                        _hover={{ bg: "rgb(213, 75, 121)" }}
                        _active={{ bg: "none" }}
                    >
                        {"Next"}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};
