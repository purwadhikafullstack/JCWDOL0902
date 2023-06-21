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
    Select,
} from "@chakra-ui/react";

// swal
import Swal from "sweetalert2";

// icons
import { BiSearch } from "react-icons/bi";
import { BsFillTrashFill, BsArrowUp, BsArrowDown } from "react-icons/bs";
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";
import { RxReload } from "react-icons/rx";

// Props
import { AddProductStock } from "./AdminProperties/AddProductStock";
import { UpdateStock } from "./AdminProperties/UpdateStock";

export const ProductStockList = () => {
    const url = process.env.REACT_APP_API_BASE_URL + "/admin";
    const token = localStorage.getItem("token");
    const decodedToken = decode(token);

    const [product, setProduct] = useState();
    const [productStock, setProductStock] = useState();
    const [warehouse, setWarehouse] = useState("All Warehouse");
    const [allWarehouse, setAllWarehouse] = useState();
    const [sort, setSort] = useState("id");
    const [order, setOrder] = useState("ASC");
    const [page, setPage] = useState(0);
    const [pages, setPages] = useState();
    const [search, setSearch] = useState(``);

    const searchValue = useRef(``);

    const getProductStock = useCallback(async () => {
        try {
            const productStockURL =
                url +
                `/fetch-product-stock?search=${search}&sort=${sort}&order=${order}&page=${page}`;

            const resultProductStockList = await Axios.get(productStockURL, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });
            const resultProducts = await Axios.get(
                url +
                    `/fetch-productlist?search=${search}&sort=${sort}&order=${order}&page=${page}`,
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                }
            );
            const resultWarehouse = await Axios.get(
                url +
                    `/fetch-warehouses?search=${search}&sort=${sort}&order=${order}&page=${page}`,
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                }
            );

            setProductStock(resultProductStockList.data.result);
            setPages(resultProductStockList.data.pages);
            setProduct(resultProducts.data.result);
            setAllWarehouse(resultWarehouse.data.result);

            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        } catch (err) {}
    }, [url, order, page, search, sort, token]);

    const deleteProductStock = async (id) => {
        try {
            await Axios.delete(url + `/delete-product-stock/${id}`, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });
            getProductStock();
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
                    deleteProductStock(id);
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
                text: err.response.data.message,
            });
        }
    };

    useEffect(() => {
        getProductStock();
    }, [getProductStock]);

    const tableHead = [
        { name: "Id", origin: "id", width: "100px" },
        { name: "Name", origin: "name", width: "" },
        { name: "Warehouse", origin: "user", width: "" },
        { name: "Stock", origin: "stock", width: "" },
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
                        <IconButton
                            icon={<RxReload />}
                            onClick={() => {
                                getProductStock();
                            }}
                        />
                    </Flex>
                    {decodedToken.role === 3 ? (
                        <Select
                            paddingRight={"5px"}
                            defaultValue={"All Warehouse"}
                            onChange={(e) => setWarehouse(e.target.value)}
                        >
                            <option value="All Warehouse">All Warehouse</option>
                            {productStock
                                ?.map(
                                    (item) =>
                                        item.warehouse_location.warehouse_name
                                )
                                .filter(
                                    (value, index, self) =>
                                        self.indexOf(value) === index
                                )
                                .map((item, index) => {
                                    return <option value={item}>{item}</option>;
                                })}
                        </Select>
                    ) : null}
                    {decodedToken.role === 3 ? (
                        <Center>
                            <AddProductStock
                                getProductStock={getProductStock}
                                productStock={product}
                                allWarehouse={allWarehouse}
                            />
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
                            {decodedToken.role === 3 ? (
                                <Th
                                    bg={"#3182CE"}
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
                    {productStock ? (
                        (decodedToken.role === 2
                            ? productStock.filter(
                                  (productStock) =>
                                      productStock.warehouse_location
                                          .user_id === decodedToken.id
                              )
                            : warehouse === "All Warehouse"
                            ? productStock
                            : productStock.filter(
                                  (productStock) =>
                                      productStock.warehouse_location
                                          .warehouse_name === warehouse
                              )
                        ).map((item, index) => {
                            return (
                                <Tbody
                                    key={index}
                                    bg={"#ADE8F4"}
                                    _hover={{ bg: "#CAF0F8" }}
                                >
                                    <Tr>
                                        <Td textAlign={"center"}>{item.id}</Td>
                                        <Td textAlign={"center"}>
                                            {item.product.name}
                                        </Td>
                                        <Td textAlign={"center"}>
                                            {
                                                item.warehouse_location
                                                    .warehouse_name
                                            }
                                        </Td>
                                        <Td textAlign={"center"}>{item.qty}</Td>
                                        {decodedToken.role === 3 ? (
                                            <Td>
                                                <Flex
                                                    gap={"20px"}
                                                    justifyContent={"center"}
                                                    alignItems={"center"}
                                                >
                                                    <UpdateStock
                                                        product={
                                                            productStock[index]
                                                        }
                                                        getProductStock={
                                                            getProductStock
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
