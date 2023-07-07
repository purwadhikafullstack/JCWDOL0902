import {
    Button,
    Flex,
    Heading,
    Stack,
    Text,
    Divider,
    Box,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalContent,
    ModalFooter,
    RadioGroup,
    Radio,
} from "@chakra-ui/react";
import { FaArrowRight } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import decode from "jwt-decode";
import { useNavigate } from "react-router-dom";


const baseApi = process.env.REACT_APP_API_BASE_URL;

export const CheckoutSummary = (props) => {
    const navigate = useNavigate();
    const {
        cartQty,
        totalPrice,
        shipmentCost,
        address,
        fullAddress,
        selectedServices,
        warehouseId,
    } = props;
    const { onOpen, onClose, isOpen } = useDisclosure();

    const token = localStorage.getItem("token");
    const decodedToken = decode(token);

    const handleCheckout = () => {
        if (!address) {
            return Swal.fire({
                icon: "warning",
                text: `Please Choose an Address First!`,
            });
        }
        if (shipmentCost < 1) {
            return Swal.fire({
                title: "Please Choose The Shipment Method First!",
                icon: "warning",
            });
        }
        onOpen();
    };

    const createOrder = async () => {
        try {
            const transactionData = {
                shipping_price:shipmentCost,
                shipping_method: selectedServices.service,
                courier: selectedServices.description,
                nearestWarehouse_id: warehouseId,
                total_price: totalPrice,
                total_qty: cartQty,
                user_address_id: fullAddress.filter((item) => item.default_address === true)[0].id,
            };

            await axios.post(
                `${baseApi}/users/create-order/${decodedToken.id}`,
                transactionData
            );

            Swal.fire({
                icon: "success",
                title: "Payment on Process",
                text: `Please Upload Your Payment Proof!`,
            });
            // navigate("/order-list");
            navigate("/");
        } catch (err) {}
    };

    return (
        <Stack
            spacing="5"
            rounded="lg"
            padding="8"
            width="full"
            backgroundColor={"#DEE2E6"}
        >
            <Heading size="md">Order Summary</Heading>
            <Divider orientation="horizontal" />
            <Stack spacing="6">
                <Flex justify="space-between">
                    <Text fontSize="lg">Product Price</Text>
                    <Text fontSize="xl">
                        Rp
                        {Intl.NumberFormat("id-ID").format(totalPrice)}
                    </Text>
                </Flex>
                <Flex justify="space-between">
                    <Text fontSize="lg">Shipment Cost</Text>
                    <Text fontSize="xl">
                        Rp
                        {Intl.NumberFormat("id-ID").format(shipmentCost)}
                    </Text>
                </Flex>{" "}
                <Divider orientation="horizontal" colorScheme="whiteAlpha" />
                <Flex justify="space-between">
                    <Text fontSize="lg" fontWeight="semibold">
                        Total Price
                    </Text>
                    <Text fontSize="xl" fontWeight="extrabold">
                        Rp
                        {Intl.NumberFormat("id-ID").format(
                            +totalPrice + +shipmentCost
                        )}
                    </Text>
                </Flex>
            </Stack>
            <Button
                colorScheme="blue"
                size="lg"
                fontSize="md"
                rightIcon={<FaArrowRight />}
                onClick={handleCheckout}
            >
                Choose Payment Method
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign={"center"}>
                        Choose Payment Method
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <RadioGroup>
                            <Box
                                border={"2px"}
                                borderRadius="5px"
                                p={5}
                                mb={3}
                                borderColor="gray"
                            >
                                <Radio colorScheme={"blue"} defaultChecked>
                                    Bank Transfer
                                </Radio>
                            </Box>
                            <Box
                                border={"2px"}
                                borderRadius="5px"
                                p={5}
                                borderColor="gray"
                            >
                                <Radio isDisabled>Others (Coming Soon)</Radio>
                            </Box>
                        </RadioGroup>
                        <Box mt={5}>
                            <Heading size="md">Order Summary</Heading>
                            <Divider orientation="horizontal" my={5} />
                            <Stack spacing="6">
                                <Flex justify="space-between">
                                    <Text fontSize="lg">Product Price</Text>
                                    <Text fontSize="xl">
                                        Rp
                                        {Intl.NumberFormat("id-ID").format(
                                            totalPrice
                                        )}
                                    </Text>
                                </Flex>
                                <Flex justify="space-between">
                                    <Text fontSize="lg">Shipment Cost</Text>
                                    <Text fontSize="xl">
                                        Rp
                                        {Intl.NumberFormat("id-ID").format(
                                            shipmentCost
                                        )}
                                    </Text>
                                </Flex>{" "}
                                <Divider orientation="horizontal" />
                                <Flex justify="space-between">
                                    <Text fontSize="lg" fontWeight="semibold">
                                        Total Price
                                    </Text>
                                    <Text fontSize="xl" fontWeight="extrabold">
                                        Rp
                                        {Intl.NumberFormat("id-ID").format(
                                            +totalPrice + +shipmentCost
                                        )}
                                    </Text>
                                </Flex>
                            </Stack>
                        </Box>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            textColor="white"
                            bg={"blue.400"}
                            onClick={() => createOrder()}
                        >
                            Proceed
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Stack>
    );
};
