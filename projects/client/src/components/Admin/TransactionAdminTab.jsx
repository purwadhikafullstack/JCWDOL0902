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
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Link,
    VStack,
} from "@chakra-ui/react";

import { BiSearch } from "react-icons/bi";
import { BsFillCaretDownFill, BsFillCaretUpFill } from "react-icons/bs";
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";

import Swal from "sweetalert2";
import axios from "axios";

const serverApi = process.env.REACT_APP_SERVER;

function formatDate(val) {
    const date = new Date(val);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear());

    return `${day}-${month}-${year}`;
}
function formatCurrency(params) {
    return Intl.NumberFormat('id-ID').format(params)
}
export const TransactionList = () => {
    const url = process.env.REACT_APP_API_BASE_URL + "/admin";
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(false);
    const [transaction, setTransaction] = useState([]);
    const [sort, setSort] = useState("id");
    const [order, setOrder] = useState("ASC");
    const [page, setPage] = useState(0);
    const [pages, setPages] = useState(0);
    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [openModal, setOpenModal] = useState("");
    const [selectedTransactionId, setSelectedTransactionId] = useState(null);
    const [selectedTransactionItems, setSelectedTransactionItems] = useState(
        []
    );

    const searchValue = useRef("");

    const getTransaction = useCallback(async () => {
        try {
            setLoading(true)
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
            setLoading(false)
        } catch (err) {
            console.error(err);
            setLoading(false)

        }
    }, [url, order, page, search, sort, startDate, endDate]);

    const getTransactionItems = async (transactionId) => {
        try {
            setLoading(true)

            const response = await axios.get(
                `${url}/fetch-transaction-items/${transactionId}`
            );
            setSelectedTransactionItems(response.data.data);
            setLoading(false)

        } catch (error) {
            console.error(error);
            setLoading(false)
        }
    };

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
        { name: "Payment", origin: "", width: "100px" },
        { name: "Confirmation", origin: "", width: "100px" },
    ];

    const TEXT_MESSAGE = {
        1: "Payment rejected!",
        3: "Payment accepted!",
        4: "Order accepted!",
        6: "Order rejected!",
    };

    const handleAcceptOrder = (id) => {
        Swal.fire({
            text: "Are you sure you want to send the order?",
            icon: "warning",
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonColor: "#4BB543",
            confirmButtonText: "Accept",
        }).then(async (res) => {
            if (res.isConfirmed) {
                await updateStatusTransaction(id, 4);
            }
        });
    };

    const handleRejectOrder = (id) => {
        Swal.fire({
            text: "Are you sure you want to cancel the order?",
            icon: "warning",
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonColor: "red",
            confirmButtonText: "Reject",
        }).then(async (res) => {
            if (res.isConfirmed) {
                await updateStatusTransaction(id, 6);
            }
        });
    };
    const handleAcceptPayment = (id) => {
        setOpenModal("");
        Swal.fire({
            text: "Are you sure you want to receive payment?",
            icon: "warning",
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonColor: "#4BB543",
            confirmButtonText: "Accept",
        }).then(async (res) => {
            if (res.isConfirmed) {
                await updateStatusTransaction(id, 3);
            }
        });
    };

    const handleRejectPayment = (id) => {
        setOpenModal("");

        Swal.fire({
            text: "Are you sure you want to decline the payment?",
            icon: "warning",
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonColor: "red",
            confirmButtonText: "Reject",
        }).then(async (res) => {
            if (res.isConfirmed) {
                await updateStatusTransaction(id, 1);
            }
        });
    };

    const updateStatusTransaction = async (id, status) => {
        try {
            setLoading(true)

            const { data: res } = await axios.patch(
                url + `/transaction/${id}`,
                { status }
            );
            // console.log(res);
            await getTransaction();
            Swal.fire({
                text: TEXT_MESSAGE[status],
                icon: "success",
            });
            setLoading(false)
        } catch (error) {
            // console.log(error);
            setLoading(false)
        }
    };

    const handleOpenModal = async (transactionId) => {
        setSelectedTransactionId(transactionId);
        await getTransactionItems(transactionId);

    };

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
                            {tableHead.map((item, index) => (
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
                                                    icon={<BsFillCaretUpFill />}
                                                    size={"xs"}
                                                    color={"white"}
                                                    onClick={() => {
                                                        setSort(item.origin);
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
                                                        setSort(item.origin);
                                                        setPage(0);
                                                        setOrder("DESC");
                                                    }}
                                                    bg={"none"}
                                                />
                                            </Stack>
                                        </Flex>
                                    </Center>
                                </Th>
                            ))}
                        </Tr>
                    </Thead>
                    <Tbody bg={"#ADE8F4"}>
                        {!loading ? (
                            transaction.map((item, index) => (
                                <Tr key={index}>
                                    <Td textAlign={"center"}>
                                        <Button
                                            colorScheme="blue"
                                            variant="link"
                                            onClick={() =>
                                                handleOpenModal(item.id)
                                            }
                                        >
                                            {item.id}
                                        </Button>
                                    </Td>
                                    <Td textAlign={"center"}>
                                        {formatDate(item.transaction_date)}
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
                                        {formatDate(item.expired)}
                                    </Td>
                                    <Td textAlign={"center"}>
                                        <Button
                                            colorScheme="blue"
                                            isDisabled={
                                                item.order_status_id === 1
                                            }
                                            onClick={() =>
                                                setOpenModal(item.id)
                                            }
                                        >
                                            View
                                        </Button>
                                    </Td>
                                    <Td textAlign={"center"}>
                                        {item.order_status_id < 4 ? (
                                            <Flex gap={"3"}>
                                                <Button
                                                    onClick={() =>
                                                        handleAcceptOrder(
                                                            item.id
                                                        )
                                                    }
                                                    variant={"unstyled"}
                                                    color={"green.500"}
                                                    fontSize={"3xl"}
                                                >
                                                    <AiFillCheckCircle />
                                                </Button>
                                                <Button
                                                    onClick={() =>
                                                        handleRejectOrder(
                                                            item.id
                                                        )
                                                    }
                                                    variant={"unstyled"}
                                                    color={"red.500"}
                                                    fontSize={"3xl"}
                                                >
                                                    <AiFillCloseCircle />
                                                </Button>
                                            </Flex>
                                        ) : (
                                            <Text>
                                                {item.order_status_id === 6
                                                    ? "Rejected"
                                                    : "Confirmed"}
                                            </Text>
                                        )}
                                    </Td>
                                </Tr>
                            ))
                        ) : (
                            <Tr>
                                <Td colSpan={tableHead.length}>
                                    <Skeleton h={"10px"} />
                                </Td>
                            </Tr>
                        )}
                    </Tbody>
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

            <Modal isOpen={Boolean(openModal)} onClose={() => setOpenModal("")}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Payment Proof</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box>
                            <img
                                src={
                                    serverApi +
                                    transaction.find(
                                        (item) => item.id === openModal
                                    )?.upload_payment
                                }
                                alt="payment-proof"
                            />
                        </Box>
                    </ModalBody>
                    <ModalFooter>
                        <Flex justifyContent={'space-around'} w={'full'}>
                            <Button colorScheme="blue" size={'sm'} as={Link} href={serverApi +
                                transaction.find(
                                    (item) => item.id === openModal
                                )?.upload_payment} target="_blank">Download</Button>

                            {+transaction.find((item) => item.id === openModal)
                                ?.order_status_id < 3 && (
                                    <>
                                        <Button
                                            colorScheme="whatsapp"
                                            size={'sm'}
                                            onClick={() =>
                                                handleAcceptPayment(openModal)
                                            }
                                        >
                                            Confirm Payment
                                        </Button>
                                        <Button
                                            colorScheme="red"
                                            size={'sm'}
                                            onClick={() =>
                                                handleRejectPayment(openModal)
                                            }
                                        >
                                            Reject Payment
                                        </Button>
                                    </>
                                )}
                        </Flex>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal
                isOpen={Boolean(selectedTransactionId)}
                onClose={() => setSelectedTransactionId(null)}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Transaction Details</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {selectedTransactionItems.length > 0 ? (
                            <Table>
                                <Thead>
                                    <Tr>
                                        <Th>Product</Th>
                                        <Th>Quantity</Th>
                                        <Th>Price</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {selectedTransactionItems.map(
                                        (item, index) => (
                                            <Tr key={index}>
                                                <Td>{item.product}</Td>
                                                <Td>{item.qty}</Td>
                                                <Td>
                                                    {`Rp${item.price.toLocaleString()}`}
                                                </Td>
                                            </Tr>
                                        )
                                    )}
                                </Tbody>
                            </Table>
                        ) : (
                            <Text>No items found.</Text>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Flex justifyContent={'space-between'} w={'full'}>
                            <VStack alignItems={'flex-start'}>
                                <Text>Shippment Cost</Text>
                                <Text>Total Cost</Text>
                            </VStack>
                            <VStack alignItems={'flex-end'}>
                                <Text>Rp{formatCurrency(transaction.find(item => selectedTransactionId === item.id)?.shipping)}</Text>
                                <Text>Rp{formatCurrency(transaction.find(item => selectedTransactionId === item.id)?.shipping + transaction.find(item => selectedTransactionId === item.id)?.total_price)}</Text>
                            </VStack>
                        </Flex>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};