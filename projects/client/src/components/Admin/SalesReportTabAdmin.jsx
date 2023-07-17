// react
import Axios from "axios";
import { useEffect, useState, useCallback, useRef } from "react";
import decode from "jwt-decode";
// icons
import { BiSearch } from "react-icons/bi";
import { BsFillCaretDownFill, BsFillCaretUpFill } from "react-icons/bs";
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";
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
    Divider,
} from "@chakra-ui/react";

// Chart JS
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const SalesList = () => {
    const url = process.env.REACT_APP_API_BASE_URL + "/admin";
    const token = localStorage.getItem("token");
    const decodedToken = decode(token);

    const [salesData, setSalesData] = useState();
    const [allWarehouses, setAllWarehouses] = useState();
    const [warehouseId, setWarehouseId] = useState(
        decodedToken.role === 3 ? "All Warehouses" : decodedToken.id
    );
    const [allCategories, setAllCategories] = useState();
    const [categoryId, setCategoryId] = useState("All Categories");
    const [allProducts, setAllProducts] = useState();
    const [productId, setProductId] = useState("All Products");
    const [selectedYear, setSelectedYear] = useState("2023");
    const [selectedMonth, setSelectedMonth] = useState("All Months");
    const [search, setSearch] = useState(``);
    const [sort, setSort] = useState("id");
    const [order, setOrder] = useState("ASC");
    const [page, setPage] = useState(0);
    const [pages, setPages] = useState();

    const [chartData, setChartData] = useState();
    const [warehouseIdChart, setWarehouseIdChart] = useState(
        decodedToken.role === 3 ? "All Warehouses" : decodedToken.id
    );
    const [categoryIdChart, setCategoryIdChart] = useState("All Categories");
    const [productIdChart, setProductIdChart] = useState("All Products");
    const [selectedYearChart, setSelectedYearChart] = useState("2023");
    const [selectedMonthChart, setSelectedMonthChart] = useState("All Months");
    const [chartDataSales, setChartDataSales] = useState();
    const [chartDataOrders, setChartDataOrders] = useState();

    const searchValue = useRef(``);

    let dataSales = [];
    let dataOrders = [];

    const getSalesData = useCallback(async () => {
        try {
            const salesReportURL =
                url +
                `/sales-report?warehouseId=${warehouseId}&year=${selectedYear}&month=${selectedMonth}&categoryId=${categoryId}&productId=${productId}&search=${search}&sort=${sort}&order=${order}&page=${page}`;
            const resultSalesReportURL = await Axios.get(salesReportURL, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });
            setSalesData(resultSalesReportURL.data.result);
            setPages(resultSalesReportURL.data.pages);
            setAllWarehouses(resultSalesReportURL.data.allWarehouses);
            setAllCategories(resultSalesReportURL.data.allCategories);
            setAllProducts(resultSalesReportURL.data.allProducts);

            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        } catch (err) {
            console.log(err.response.data.message);
        }
    }, [
        order,
        page,
        search,
        sort,
        token,
        warehouseId,
        selectedYear,
        selectedMonth,
        categoryId,
        productId,
    ]);
    const getChartData = useCallback(async () => {
        try {
            const chartReportURL =
                url +
                `/sales-report-chart?warehouseId=${warehouseIdChart}&year=${selectedYearChart}&month=${selectedMonthChart}&categoryId=${categoryIdChart}&productId=${productIdChart}`;
            const resultChartReportURL = await Axios.get(chartReportURL, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });
            setChartData(resultChartReportURL.data.result);
            console.log(resultChartReportURL.data.result);

            dataSales = [];
            for (let i = 0; i <= 11; i++) {
                const totalSales = resultChartReportURL.data.result
                    .filter(
                        (item) =>
                            new Date(
                                item.transaction.transaction_date
                            ).getMonth() === i
                    )
                    .reduce(function (acc, obj) {
                        return acc + obj.price;
                    }, 0);
                dataSales.push(totalSales);
            }
            setChartDataSales(dataSales);

            dataOrders = [];
            for (let i = 0; i <= 11; i++) {
                const totalOrders = resultChartReportURL.data.result.filter(
                    (item) =>
                        new Date(
                            item.transaction.transaction_date
                        ).getMonth() === i
                ).length;
                dataOrders.push(totalOrders);
            }
            setChartDataOrders(dataOrders);
        } catch (err) {
            console.log(err);
        }
    }, [
        token,
        warehouseIdChart,
        selectedYearChart,
        selectedMonthChart,
        categoryIdChart,
        productIdChart,
    ]);

    useEffect(() => {
        getSalesData();
    }, [getSalesData]);
    useEffect(() => {
        getChartData();
    }, [getChartData]);

    const tableHead = [
        { name: "transaction id", origin: "transaction_id", width: "100px" },
        { name: "date", origin: "transaction_date", width: "100px" },
        { name: "warehouse", origin: "", width: "100px" },
        { name: "category", origin: "", width: "100px" },
        { name: "product", origin: "", width: "100px" },
        { name: "Total price", origin: "", width: "100px" },
    ];

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Chart Per Month",
            },
        },
    };

    const labels = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const barData1 = {
        labels,
        datasets: [
            {
                label: "Total Sales",
                data: chartDataSales,
                backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
        ],
    };
    const barData2 = {
        labels,
        datasets: [
            {
                label: "Total Orders",
                data: chartDataOrders,
                backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
        ],
    };

    return (
        <>
            <Box mb={10}>
                <Center paddingBottom={"12px"}>
                    <Stack>
                        <Stack direction="row" spacing={4} alignItems="center">
                            <Select
                                paddingRight={"5px"}
                                defaultValue={"2023"}
                                onChange={(e) => {
                                    setSelectedYearChart(e.target.value);
                                }}
                            >
                                <option value="2023">2023</option>
                                <option value="2022">2022</option>
                                <option value="2021">2021</option>
                            </Select>
                            <Select
                                paddingRight={"5px"}
                                defaultValue={"All Categories"}
                                onChange={(e) => {
                                    setCategoryIdChart(e.target.value);
                                }}
                            >
                                <option value="All Categories">
                                    All Categories
                                </option>
                                {allCategories?.map((item) => {
                                    return (
                                        <option value={item.id}>
                                            {item.name}
                                        </option>
                                    );
                                })}
                            </Select>
                            <Select
                                paddingRight={"5px"}
                                defaultValue={"All Products"}
                                onChange={(e) => {
                                    setProductIdChart(e.target.value);
                                }}
                            >
                                <option value="All Products">
                                    All Products
                                </option>
                                {allProducts?.map((item) => {
                                    return (
                                        <option value={item.id}>
                                            {item.name}
                                        </option>
                                    );
                                })}
                            </Select>
                        </Stack>
                        {decodedToken.role === 3 ? (
                            <Stack
                                direction="row"
                                spacing={4}
                                alignItems="center"
                            >
                                <Select
                                    paddingRight={"5px"}
                                    defaultValue={"All Warehouses"}
                                    onChange={(e) => {
                                        setWarehouseIdChart(e.target.value);
                                    }}
                                >
                                    <option value="All Warehouses">
                                        All Warehouses
                                    </option>
                                    {allWarehouses?.map((item) => {
                                        return (
                                            <option value={item.id}>
                                                {item.warehouse_name}
                                            </option>
                                        );
                                    })}
                                </Select>{" "}
                            </Stack>
                        ) : null}
                    </Stack>
                </Center>
                <Box
                    display="flex"
                    borderWidth="1px"
                    borderRadius="lg"
                    width="full" 
                    minWidth="max-content"
                    align="center"
                    gap="2"
                    justifyContent="center"
                >
                    {" "}
                    <Box m={10} maxW="800px">
                        <Bar options={options} data={barData1} />{" "}
                    </Box>{" "}
                    <Box m={10} maxW="800px">
                        <Bar options={options} data={barData2} />
                    </Box>
                </Box>
            </Box>
            <Divider mb={10} />
            <Box>
                <Center paddingBottom={"12px"}>
                    <Stack>
                        <Stack
                            direction="row"
                            spacing={4}
                            justifyContent="center"
                        >
                            <Box paddingRight={"5px"}>
                                <InputGroup w={{ base: "200px", lg: "400px" }}>
                                    <Input
                                        placeholder={"Search"}
                                        _focusVisible={{
                                            border: "1px solid black",
                                        }}
                                        ref={searchValue}
                                        onChange={() => {
                                            setSearch(
                                                searchValue.current.value
                                            );
                                        }}
                                    />
                                    <InputRightElement>
                                        <IconButton
                                            type={"submit"}
                                            aria-label="Search database"
                                            bg={"none"}
                                            opacity={"50%"}
                                            _hover={{
                                                bg: "none",
                                                opacity: "100%",
                                            }}
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
                        </Stack>
                        <Stack direction="row" spacing={4} alignItems="center">
                            <Select
                                paddingRight={"5px"}
                                defaultValue={"2023"}
                                onChange={(e) => {
                                    setSelectedYear(e.target.value);
                                }}
                            >
                                <option value="2023">2023</option>
                                <option value="2022">2022</option>
                                <option value="2021">2021</option>
                            </Select>
                            <Select
                                paddingRight={"5px"}
                                defaultValue={"All Months"}
                                onChange={(e) => {
                                    setSelectedMonth(e.target.value);
                                }}
                                width="full"
                            >
                                <option value="All Months">All Months</option>
                                <option value="1">January</option>
                                <option value="2">February</option>
                                <option value="3">March</option>
                                <option value="4">April</option>
                                <option value="5">May</option>
                                <option value="6">June</option>
                                <option value="7">July</option>
                                <option value="8">August</option>
                                <option value="9">September</option>
                                <option value="10">Oktober</option>
                                <option value="11">November</option>
                                <option value="12">December</option>
                            </Select>
                        </Stack>{" "}
                        <Stack direction="row" spacing={4} alignItems="center">
                            {" "}
                            <Select
                                paddingRight={"5px"}
                                defaultValue={"All Categories"}
                                onChange={(e) => {
                                    setCategoryId(e.target.value);
                                }}
                            >
                                <option value="All Categories">
                                    All Categories
                                </option>
                                {allCategories?.map((item) => {
                                    return (
                                        <option value={item.id}>
                                            {item.name}
                                        </option>
                                    );
                                })}
                            </Select>
                            <Select
                                paddingRight={"5px"}
                                defaultValue={"All Products"}
                                onChange={(e) => {
                                    setProductId(e.target.value);
                                }}
                            >
                                <option value="All Products">
                                    All Products
                                </option>
                                {allProducts?.map((item) => {
                                    return (
                                        <option value={item.id}>
                                            {item.name}
                                        </option>
                                    );
                                })}
                            </Select>
                        </Stack>
                        {decodedToken.role === 3 ? (
                            <Stack
                                direction="row"
                                spacing={4}
                                alignItems="center"
                            >
                                <Select
                                    paddingRight={"5px"}
                                    defaultValue={"All Warehouses"}
                                    onChange={(e) => {
                                        setWarehouseId(e.target.value);
                                    }}
                                >
                                    <option value="All Warehouses">
                                        All Warehouses
                                    </option>
                                    {allWarehouses?.map((item) => {
                                        return (
                                            <option value={item.id}>
                                                {item.warehouse_name}
                                            </option>
                                        );
                                    })}
                                </Select>{" "}
                            </Stack>
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
                                                                setOrder(
                                                                    "DESC"
                                                                );
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
                        {salesData ? (
                            salesData.map((item, index) => {
                                return (
                                    <Tbody
                                        key={index}
                                        bg={"#ADE8F4"}
                                        _hover={{ bg: "#CAF0F8" }}
                                    >
                                        <Tr>
                                            <Td textAlign={"center"}>
                                                {item.transaction_id}
                                            </Td>
                                            <Td textAlign={"center"}>
                                                {
                                                    item.transaction
                                                        .transaction_date
                                                }
                                            </Td>
                                            <Td textAlign={"center"}>
                                                {
                                                    item.product_location
                                                        .warehouse_location
                                                        .warehouse_name
                                                }
                                            </Td>
                                            <Td textAlign={"center"}>
                                                {
                                                    item.product_location
                                                        ?.product?.category
                                                        ?.name
                                                }
                                            </Td>
                                            <Td textAlign={"center"}>
                                                {
                                                    item.product_location
                                                        ?.product?.name
                                                }
                                            </Td>
                                            <Td textAlign={"center"}>
                                                Rp
                                                {item.price
                                                    .toString()
                                                    .replace(
                                                        /\B(?=(\d{3})+(?!\d))/g,
                                                        "."
                                                    )}
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
        </>
    );
};

// /////////////////////////////////
// import { useSelector } from "react-redux";

// export const SalesList = () => {
//     const { id, role } = useSelector((state) => state.userSlice.value);
//     const [salesList, setSalesList] = useState([]);
//     const [page, setPage] = useState(1);
//     const [totalPage, setTotalPage] = useState(0);
//     const [filterMonth, setFilterMonth] = useState("");
//     const [category, setCategory] = useState([]);
//     const [filterCat, setFilterCat] = useState("");
//     const [wrList, setWrList] = useState([]);
//     const [wrId, setWrId] = useState("");
//     const [cleanSales, setCleanSales] = useState(0);
//     const [search, setSearch] = useState("");
//     const [searchQuery, setSearchQuery] = useState("");

//     const handleQuery = () => setSearchQuery(search);

//     const getSalesList = useCallback(async () => {
//         try {
//             const response = await (
//                 await Axios.get(
//                     `${baseApi}/admin/sale-report?month=${
//                         filterMonth ? filterMonth : ""
//                     }&categorie=${filterCat}&wrId=${wrId}&search_query=${
//                         searchQuery ? searchQuery : ""
//                     }&id=${id}&role=${role}&page=${page - 1}`,
//                     {
//                         headers: {
//                             authorization: `Bearer ${token}`,
//                         },
//                     }
//                 )
//             ).data;
//             console.log(response);
//             setSalesList(response.allSales);
//             setCleanSales(response.cleantotalSales);
//             setTotalPage(response.totalPage);
//         } catch (err) {
//             console.log(err);
//             console.log(err.response.data.message);
//         }
//     }, [filterMonth, filterCat, wrId, searchQuery, id, role, page]);

//     const getCategories = useCallback(async () => {
//         try {
//             const response = await Axios.get(
//                 `${baseApi}/admin/fetch-categories`,
//                 {
//                     headers: {
//                         authorization: `Bearer ${token}`,
//                     },
//                 }
//             );
//             // console.log(response);
//             setCategory(response.data.allCategory);
//         } catch (err) {
//             console.log(err);
//         }
//     }, []);

//     const renderCategories = () => {
//         return category.map((item, index) => {
//             return (
//                 <option value={item.id} key={index}>
//                     {item.name}
//                 </option>
//             );
//         });
//     };

//     const warehouseList = useCallback(async () => {
//         try {
//             const response = await (
//                 await Axios.get(`${baseApi}/admin/fetch-warehouses`, {
//                     headers: {
//                         authorization: `Bearer ${token}`,
//                     },
//                 })
//             ).data;
//             setWrList(response.allWarehouse);
//         } catch (error) {
//             console.log(error);
//         }
//     }, []);

//     const renderWarehouse = () => {
//         return wrList.map((item, index) => {
//             return (
//                 <option value={item.id} key={index}>
//                     {item.warehouse_name}
//                 </option>
//             );
//         });
//     };

//     useEffect(() => {
//         getSalesList();
//         getCategories();
//         warehouseList();
//     }, [getSalesList, getCategories, warehouseList]);

//     const tableHead = [
//         { name: "transaction id", origin: "transaction_id", width: "100px" },
//         { name: "date", origin: "createdAt", width: "100px" },
//         { name: "category", origin: "", width: "100px" },
//         { name: "product", origin: "", width: "100px" },
//         { name: "price", origin: "", width: "100px" },
//         { name: "quantity", origin: "", width: "100px" },
//         { name: "Total", origin: "", width: "100px" },
//         { name: "warehouse", origin: "", width: "100px" },
//     ];

//     const crossTitle = (str, start, end) => {
//         if (str?.length > end) {
//             return str.slice(start, end) + "...";
//         }
//         return str;
//     };

//     return (
//         <Box>
//             <Box>
//                 <Center mt={5}>
//                     <Box paddingRight={"5px"}>
//                         <InputGroup w={{ base: "200px", lg: "400px" }}>
//                             <Input
//                                 placeholder={"Search"}
//                                 _focusVisible={{ border: "1px solid #b759b4" }}
//                                 onChange={(e) => {
//                                     setSearch(e.target.value);
//                                 }}
//                                 onKeyDown={(e) => {
//                                     if (e.key === "Enter") {
//                                         handleQuery();
//                                         e.preventDefault();
//                                     }
//                                 }}
//                                 onKeyUp={(e) => {
//                                     if (e.key === "Backspace") {
//                                         handleQuery();
//                                     }
//                                 }}
//                             />
//                             <InputRightElement>
//                                 <IconButton
//                                     type={"submit"}
//                                     aria-label="Search database"
//                                     bg={"none"}
//                                     opacity={"50%"}
//                                     _hover={{ bg: "none", opacity: "100%" }}
//                                     icon={<BiSearch />}
//                                     onClick={() => {
//                                         handleQuery();
//                                     }}
//                                 />
//                             </InputRightElement>
//                         </InputGroup>
//                     </Box>
//                 </Center>
//                 <Center>
//                     <HStack mt={4} mb={5}>
//                         <Box maxW={role === 2 ? "50%" : "30%"}>
//                             <Select
//                                 bgColor={"white"}
//                                 textColor="black"
//                                 onChange={(e) => {
//                                     setFilterMonth(e.target.value);
//                                 }}
//                             >
//                                 <option value={""}>---All Year---</option>
//                                 <option value={1}>January</option>
//                                 <option value={2}>February</option>
//                                 <option value={3}>March</option>
//                                 <option value={4}>April</option>
//                                 <option value={5}>May</option>
//                                 <option value={6}>June</option>
//                                 <option value={7}>July</option>
//                                 <option value={8}>August</option>
//                                 <option value={9}>September</option>
//                                 <option value={10}>October</option>
//                                 <option value={11}>November</option>
//                                 <option value={12}>December</option>
//                             </Select>
//                         </Box>
//                         <Box maxW={role === 2 ? "50%" : "30%"}>
//                             <Select
//                                 bgColor={"white"}
//                                 textColor="black"
//                                 onChange={(e) => {
//                                     setFilterCat(e.target.value);
//                                 }}
//                                 placeholder={
//                                     filterCat ? "Reset" : "--Categories--"
//                                 }
//                             >
//                                 {renderCategories()}
//                             </Select>
//                         </Box>
//                         <Box hidden={role === 2 ? true : false} maxW={"30%"}>
//                             <Select
//                                 bgColor={"white"}
//                                 textColor="black"
//                                 onChange={(e) => {
//                                     setWrId(e.target.value);
//                                 }}
//                                 placeholder={wrId ? "Reset" : "--Warehouse--"}
//                                 hidden={role === 2 ? true : false}
//                             >
//                                 {renderWarehouse()}
//                             </Select>
//                         </Box>
//                     </HStack>
//                 </Center>
//             </Box>

//             <Box padding={{ base: "10px", lg: "0" }}>
//                 {salesList ? (
//                     <TableContainer borderRadius={"10px"} minH={"117px"}>
//                         <Table>
//                             <Thead>
//                                 <Tr>
//                                     {tableHead.map((item, index) => {
//                                         return (
//                                             <Th
//                                                 key={index}
//                                                 bg={"#3182CE"}
//                                                 textAlign={"center"}
//                                                 color={"white"}
//                                                 w={item.width}
//                                                 borderY={"none"}
//                                             >
//                                                 <Center>
//                                                     <Flex gap={"5px"}>
//                                                         <Center>
//                                                             {item.name}
//                                                         </Center>
//                                                     </Flex>
//                                                 </Center>
//                                             </Th>
//                                         );
//                                     })}
//                                 </Tr>
//                             </Thead>
//                             {salesList ? (
//                                 salesList?.map((item, index) => {
//                                     // ;
//                                     return (
//                                         <Tbody
//                                             key={index}
//                                             bg={"#ADE8F4"}
//                                             _hover={{ bg: "#CAF0F8" }}
//                                         >
//                                             <Tr>
//                                                 <Td textAlign={"center"}>
//                                                     {item.id}
//                                                 </Td>
//                                                 <Td textAlign={"center"}>
//                                                     {item.transaction_date.slice(
//                                                         0,
//                                                         10
//                                                     )}
//                                                 </Td>
//                                                 <Td
//                                                     textAlign={"center"}
//                                                     lineHeight={"10"}
//                                                 >
//                                                     <Box key={index}>
//                                                         {
//                                                             item
//                                                                 ?.transaction_item
//                                                                 .product_location
//                                                                 .product
//                                                                 .category?.name
//                                                         }
//                                                     </Box>
//                                                     {/* {item.transaction_item.product_location.map(
//                                                         (item, index) => {
//                                                             return (
//                                                                 <Box
//                                                                     key={index}
//                                                                 >
//                                                                     {
//                                                                         item
//                                                                             ?.product
//                                                                             .category
//                                                                             ?.name
//                                                                     }
//                                                                 </Box>
//                                                             );
//                                                         }
//                                                     )} */}
//                                                 </Td>
//                                                 <Td
//                                                     textAlign={"start"}
//                                                     lineHeight={"10"}
//                                                 >
//                                                     <Box key={index}>
//                                                         {item?.transaction_item
//                                                             .product_location
//                                                             .product?.name
//                                                             .length > 40
//                                                             ? crossTitle(
//                                                                   item
//                                                                       ?.transaction_item
//                                                                       .product_location
//                                                                       .product
//                                                                       ?.name,
//                                                                   0,
//                                                                   -35
//                                                               )
//                                                             : crossTitle(
//                                                                   item
//                                                                       ?.transaction_item
//                                                                       .product_location
//                                                                       .product
//                                                                       ?.name,
//                                                                   0
//                                                               )}
//                                                     </Box>
//                                                     {/* {item.transaction_item.product_location.map(
//                                                         (item, index) => {
//                                                             return (
//                                                                 <Box
//                                                                     key={index}
//                                                                 >
//                                                                     {item
//                                                                         ?.product
//                                                                         ?.name
//                                                                         .length >
//                                                                     40
//                                                                         ? crossTitle(
//                                                                               item
//                                                                                   ?.product
//                                                                                   ?.name,
//                                                                               0,
//                                                                               -35
//                                                                           )
//                                                                         : crossTitle(
//                                                                               item
//                                                                                   ?.product
//                                                                                   ?.name,
//                                                                               0
//                                                                           )}
//                                                                 </Box>
//                                                             );
//                                                         }
//                                                     )} */}
//                                                 </Td>
//                                                 <Td
//                                                     textAlign={"start"}
//                                                     lineHeight={"10"}
//                                                 >
//                                                     <Box key={index}>
//                                                         Rp
//                                                         {item?.transaction_item.product_location.product?.price.toLocaleString()}
//                                                     </Box>
//                                                 </Td>
//                                                 <Td
//                                                     textAlign={"center"}
//                                                     lineHeight={"10"}
//                                                 >
//                                                     <Box key={index}>
//                                                         {
//                                                             item
//                                                                 ?.transaction_item
//                                                                 .product_location
//                                                                 .qty
//                                                         }
//                                                     </Box>
//                                                 </Td>
//                                                 <Td
//                                                     textAlign={"center"}
//                                                     lineHeight={"10"}
//                                                 >
//                                                     <Box key={index}>
//                                                         Rp
//                                                         {(
//                                                             item
//                                                                 ?.transaction_item
//                                                                 .product_location
//                                                                 .qty *
//                                                             item
//                                                                 ?.transaction_item
//                                                                 .product_location
//                                                                 .product.price
//                                                         ).toLocaleString()}{" "}
//                                                     </Box>
//                                                 </Td>
//                                                 <Td
//                                                     textAlign={"start"}
//                                                     lineHeight={"10"}
//                                                 >
//                                                     <Box key={index}>
//                                                         {
//                                                             item
//                                                                 ?.transaction_item
//                                                                 .product_location
//                                                                 .warehouse_location
//                                                                 ?.warehouse_name
//                                                         }
//                                                     </Box>
//                                                 </Td>
//                                             </Tr>
//                                         </Tbody>
//                                     );
//                                 })
//                             ) : (
//                                 <Tbody>
//                                     <Tr>
//                                         <Td>
//                                             <Skeleton />
//                                         </Td>
//                                     </Tr>
//                                 </Tbody>
//                             )}
//                         </Table>
//                     </TableContainer>
//                 ) : (
//                     <TableContainer>
//                         <Center>
//                             <Text>No Transactions Yet</Text>
//                         </Center>
//                     </TableContainer>
//                 )}

//                 <Box borderRadius={"10px"}>
//                     <Spacer />
//                     <Box
//                         bg={"#3182CE"}
//                         textAlign={"right"}
//                         borderRadius={"10px"}
//                         p={2}
//                         color="white"
//                     >
//                         Total Sales : Rp{cleanSales.toLocaleString()}{" "}
//                     </Box>
//                 </Box>
//                 {/* <Center paddingY={"10px"}>
//                     {page <= 0 ? (
//                         <IconButton icon={<SlArrowLeft />} disabled />
//                     ) : (
//                         <IconButton
//                             onClick={() => {
//                                 setPage(page - 1);
//                             }}
//                             icon={<SlArrowLeft />}
//                         />
//                     )}
//                     <Text paddingX={"10px"}>
//                         {page + 1} of {totalPage}
//                     </Text>
//                     {page < totalPage - 1 ? (
//                         <IconButton
//                             icon={<SlArrowRight />}
//                             onClick={() => {
//                                 setPage(page + 1);
//                             }}
//                         />
//                     ) : (
//                         <IconButton icon={<SlArrowRight />} disabled />
//                     )}
//                 </Center> */}

//                 <Box
//                     display="flex"
//                     justifyContent="center"
//                     alignContent="center"
//                     gap={3}
//                     mb={3}
//                 >
//                     <Button
//                         onClick={() => {
//                             setPage(page - 1);
//                         }}
//                         disabled={page === 1 ? true : false}
//                         size={{ base: "sm", md: "md" }}
//                         borderColor="rgb(213, 75, 121)"
//                         borderRadius=".6em"
//                         borderWidth="2px"
//                         bgColor="white"
//                         _hover={{ bg: "rgb(213, 75, 121)" }}
//                         _active={{ bg: "none" }}
//                     >
//                         {"Prev"}
//                     </Button>
//                     <Text alignSelf="center" color={"black"}>
//                         {" "}
//                         {page} of {totalPage}
//                     </Text>

//                     <Button
//                         onClick={() => setPage(page + 1)}
//                         disabled={page === totalPage ? true : false}
//                         size={{ base: "sm", md: "md" }}
//                         borderColor="rgb(213, 75, 121)"
//                         borderRadius=".6em"
//                         borderWidth="2px"
//                         bgColor="white"
//                         _hover={{ bg: "rgb(213, 75, 121)" }}
//                         _active={{ bg: "none" }}
//                     >
//                         {"Next"}
//                     </Button>
//                 </Box>
//             </Box>
//         </Box>
//     );
// };
