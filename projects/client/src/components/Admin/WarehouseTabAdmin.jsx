import Axios from "axios";
import { useEffect, useState, useCallback, useRef } from "react";

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
    InputGroup,
    InputRightElement,
    Input,
    IconButton,
    Skeleton,
    Stack,
    Text,
} from "@chakra-ui/react";

import Swal from "sweetalert2";

import { BiSearch } from "react-icons/bi";
import {
    BsFillTrashFill,
    BsFillCaretDownFill,
    BsFillCaretUpFill,
} from "react-icons/bs";
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";
import { RxReload } from "react-icons/rx";

import { CreateWarehouse } from "./AdminProperties/CreateWarehouse";
import { EditWarehouse } from "./AdminProperties/EditWarehouse";

export const WarehouseList = () => {
    const url = process.env.REACT_APP_API_BASE_URL + "/admin";
    const token = localStorage.getItem("token");

    const [admin, setAdmin] = useState();
    const [warehouse, setWarehouse] = useState();
    const [sort, setSort] = useState("id");
    const [provinces, setProvinces] = useState();
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState("ASC");
    const [pages, setPages] = useState();
    const [search, setSearch] = useState(``);

    const searchValue = useRef(``);

    const getWarehouse = useCallback(async () => {
        try {
            const warehouseURL =
                url +
                `/fetch-warehouses?search=${search}&sort=${sort}&order=${order}&page=${page}`;
            const resultWarehouse = await Axios.get(warehouseURL, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });
            setWarehouse(resultWarehouse.data.result);
            setPages(resultWarehouse.data.pages);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        } catch (err) {}
    }, [sort, order, page, search, url, token]);

    const getProvince = async () => {
        try {
            const resultProvinces = await Axios.get(
                process.env.REACT_APP_API_BASE_URL + "/province"
            );
            setProvinces(resultProvinces.data.result);
        } catch (err) {}
    };

    const getAdmin = useCallback(async () => {
        try {
            const resultAdmin = await Axios.get(url + "/fetch-admins", {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });
            setAdmin(resultAdmin.data);
        } catch (err) {}
    }, [url, token]);

    const deleteWarehouse = async (id) => {
        try {
            await Axios.delete(url + `/delete-warehouse/${id}`, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });
            getWarehouse();
        } catch (err) {}
    };

    const deleteWarning = async (id) => {
        try {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteWarehouse(id);
                    Swal.fire("Deleted!", "Warehouse deleted.", "success");
                }
            });
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.response.data.name
                    ? err.response.data.errors[0].message.toUpperCase()
                    : err.response.data.toUpperCase(),
            });
        }
    };

    useEffect(() => {
        getWarehouse();
        getAdmin();
        getProvince();
    }, [getWarehouse, getAdmin]);

    const tableHead = [
        { name: "ID", origin: "id", width: "100px" },
        { name: "Warehouse Name", origin: "warehouse_name", width: "" },
        { name: "Province", origin: "province", width: "250px" },
        { name: "City", origin: "city", width: "150px" },
        { name: "Email", origin: "email", width: "50px" },
    ];

    return (
        <Box padding={{ base: "10px", lg: "0" }}>
            <Center paddingBottom={"5px"}>
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
                                        }}
                                    />
                                </InputRightElement>
                            </InputGroup>
                        </Box>
                        <IconButton
                            icon={<RxReload />}
                            onClick={() => {
                                getWarehouse();
                            }}
                        />
                    </Flex>
                    <Center>
                        <CreateWarehouse
                            getWarehouse={getWarehouse}
                            provinces={provinces}
                            admin={admin}
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
                            <Th
                                bg={"#3182CE"}
                                textAlign={"center"}
                                color={"white"}
                                width={"200px"}
                                borderY={"none"}
                            >
                                Action
                            </Th>
                        </Tr>
                    </Thead>
                    {warehouse ? (
                        warehouse?.map((item, index) => {
                            return (
                                <Tbody
                                    key={index}
                                    bg={"#ADE8F4"}
                                    _hover={{ bg: "#CAF0F8" }}
                                >
                                    <Tr>
                                        <Td textAlign={"center"}>{item.id}</Td>
                                        <Td>{item.warehouse_name}</Td>
                                        <Td textAlign={"center"}>
                                            {item.province}
                                        </Td>
                                        <Td textAlign={"center"}>
                                            {item.city}
                                        </Td>
                                        <Td textAlign={"center"}>
                                            {item.email}
                                        </Td>
                                        <Td>
                                            <Flex
                                                gap={"20px"}
                                                justifyContent={"center"}
                                                alignItems={"center"}
                                            >
                                                <EditWarehouse
                                                    warehouse={item}
                                                    admin={admin}
                                                    getWarehouse={getWarehouse}
                                                    provinces={provinces}
                                                />
                                                <IconButton
                                                    onClick={() => {
                                                        deleteWarning(item.id);
                                                    }}
                                                    bg={"none"}
                                                    color={"#ff4d4d"}
                                                    icon={<BsFillTrashFill />}
                                                />
                                            </Flex>
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
