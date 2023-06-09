import Axios from "axios";
import { useCallback, useEffect, useState, useRef } from "react";

import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    TableContainer,
    Td,
    Flex,
    Box,
    Center,
    InputGroup,
    Input,
    IconButton,
    InputRightElement,
    Skeleton,
    Stack,
    Text,
} from "@chakra-ui/react";

// swal
import Swal from "sweetalert2";

// icons
import { BiSearch } from "react-icons/bi";
import { BsFillTrashFill, BsArrowUp, BsArrowDown } from "react-icons/bs";
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";
import { RxReload } from "react-icons/rx";

// props
import { EditUser } from "./AdminProperties/EditUser";

export const UserList = () => {
    const url = process.env.REACT_APP_API_BASE_URL + "/admin";
    const token = localStorage.getItem("token");

    const [users, setUsers] = useState();
    const [sort, setSort] = useState("id");
    const [order, setOrder] = useState("ASC");
    const [page, setPage] = useState(0);
    const [pages, setPages] = useState();
    const [search, setSearch] = useState(``);

    const searchValue = useRef(``);

    const getUsers = useCallback(async () => {
        try {
            const userURL =
                url +
                `/fetch-users?search=${search}&sort=${sort}&order=${order}&page=${page}`;
            const resultUsers = await Axios.get(userURL, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });
            setUsers(resultUsers.data.result, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });
            setPages(resultUsers.data.pages, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });

            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        } catch (err) {}
    }, [sort, page, order, search, url, token]);

    const deleteUser = async (id) => {
        try {
            await Axios.delete(url + `delete-user/${id}`, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });
            getUsers();
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
                    deleteUser(id);
                    Swal.fire(
                        "Deleted!",
                        "Your file has been deleted.",
                        "success"
                    );
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
        getUsers();
    }, [getUsers]);

    const tableHead = [
        { name: "Id", origin: "id", width: "100px" },
        { name: "Email", origin: "email", width: "" },
        { name: "Name", origin: "name", width: "700px" },
        { name: "Phone Number", origin: "phone_number", width: "700px" },
        { name: "Role", origin: "role", width: "50px" },
    ];

    return (
        <Box padding={{ base: "10px", lg: "0" }}>
            <Center paddingBottom={"12px"}>
                <Box paddingRight={"5px"}>
                    <InputGroup w={{ base: "200px", lg: "400px" }}>
                        <Input
                            placeholder={"Search"}
                            _focusVisible={{ border: "1px solid #212529" }}
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
                                    setSearch(searchValue.current.value);
                                }}
                            />
                        </InputRightElement>
                    </InputGroup>
                </Box>
                <IconButton
                    icon={<RxReload />}
                    onClick={() => {
                        window.location.reload();
                        getUsers();
                    }}
                />
            </Center>
            <TableContainer borderRadius={"10px"}>
                <Table>
                    <Thead>
                        <Tr>
                            {tableHead.map((item, index) => {
                                return (
                                    <Th
                                        key={index}
                                        bg={"#495057"}
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
                            <Th
                                bg={"#495057"}
                                textAlign={"center"}
                                color={"white"}
                                width={"200px"}
                                borderY={"none"}
                            >
                                Action
                            </Th>
                        </Tr>
                    </Thead>
                    {users ? (
                        users?.map((item, index) => {
                            return (
                                <Tbody
                                    key={index}
                                    bg={"#DEE2E6"}
                                    _hover={{ bg: "#ADB5BD" }}
                                >
                                    <Tr>
                                        <Td textAlign={"center"}>{item.id}</Td>
                                        <Td>{item.email}</Td>
                                        <Td>{item.name}</Td>
                                        <Td>{item.phone_number}</Td>
                                        <Td textAlign={"center"}>
                                            {item.role}
                                        </Td>
                                        <Td>
                                            <Flex
                                                gap={"20px"}
                                                justifyContent={"center"}
                                                alignItems={"center"}
                                            >
                                                <EditUser
                                                    user={item}
                                                    getUsers={getUsers}
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
