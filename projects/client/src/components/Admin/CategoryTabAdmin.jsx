// react
import Axios from "axios";
import { useEffect, useState, useCallback, useRef } from "react";
import decode from "jwt-decode";

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
    Stack,
    Skeleton,
    Text,
} from "@chakra-ui/react";

// swal
import Swal from "sweetalert2";

// icons
import { BiSearch } from "react-icons/bi";
import { BsFillTrashFill, BsArrowUp, BsArrowDown } from "react-icons/bs";
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";

// Props
import { AddCategory } from "./AdminProperties/AddCategory";
import { EditCategory } from "./AdminProperties/EditCategory";

export const CategoryList = () => {
    const url = process.env.REACT_APP_API_BASE_URL + "/admin";
    const token = localStorage.getItem("token");
    const decodedToken = decode(token);

    const [category, setCategory] = useState();
    const [sort, setSort] = useState("id");
    const [order, setOrder] = useState("ASC");
    const [page, setPage] = useState(0);
    const [pages, setPages] = useState();
    const [search, setSearch] = useState(``);

    const searchValue = useRef(``);

    const getCategory = useCallback(async () => {
        try {
            const categoryURL =
                url +
                `/fetch-categories?search=${search}&sort=${sort}&order=${order}&page=${page}`;

            const result = await Axios.get(categoryURL, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });
            setCategory(result.data.result);
            setPages(result.data.pages);

            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        } catch (err) {}
    }, [url, order, page, search, sort, token]);

    const deleteCategory = async (id) => {
        try {
            await Axios.delete(url + `/delete-category/${id}`, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });
            getCategory();
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
                    deleteCategory(id);
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
        getCategory();
    }, [getCategory]);

    const tableHead = [
        { name: "Id", origin: "Id", width: "100px" },
        { name: "Category", origin: "name", width: "" },
    ];

    return (
        <Box>
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
                                        }}
                                    />
                                </InputRightElement>
                            </InputGroup>
                        </Box>
                    </Flex>
                    {decodedToken.role === 3 ? (
                        <Center>
                            <AddCategory getCategory={getCategory} />
                        </Center>
                    ) : null}
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
                            {decodedToken.role === 3 ? (
                                <Th
                                    bg={"#495057"}
                                    textAlign={"center"}
                                    color={"white"}
                                    w={"200px"}
                                    borderY={"none"}
                                >
                                    Action
                                </Th>
                            ) : null}
                        </Tr>
                    </Thead>
                    {category ? (
                        category.map((item, index) => {
                            return (
                                <Tbody
                                    key={index}
                                    bg={"#DEE2E6"}
                                    _hover={{ bg: "#ADB5BD" }}
                                >
                                    <Tr>
                                        <Td textAlign={"center"}>{item.id}</Td>
                                        <Td>{item.name}</Td>
                                        {decodedToken.role === 3 ? (
                                            <Td>
                                                <Flex
                                                    gap={"20px"}
                                                    justifyContent={"center"}
                                                    alignItems={"center"}
                                                >
                                                    <EditCategory
                                                        category={
                                                            category[index]
                                                        }
                                                        getCategory={
                                                            getCategory
                                                        }
                                                    />
                                                    <IconButton
                                                        onClick={() => {
                                                            deleteWarning(
                                                                item.id
                                                            );
                                                        }}
                                                        bg={"none"}
                                                        color={"#ff4d4d"}
                                                        icon={
                                                            <BsFillTrashFill />
                                                        }
                                                    />
                                                </Flex>
                                            </Td>
                                        ) : null}
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
                                {decodedToken.role === 3 ? (
                                    <Td>
                                        <Skeleton h={"10px"} />
                                    </Td>
                                ) : null}
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
