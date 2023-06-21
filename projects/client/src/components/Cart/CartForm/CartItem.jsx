import { useRef } from "react";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import { cartUser } from "../../../redux/cartSlice";

import {
    Flex,
    useColorModeValue,
    Stack,
    Image,
    Text,
    Box,
    HStack,
    IconButton,
    NumberDecrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
} from "@chakra-ui/react";
import { BsFillTrashFill } from "react-icons/bs";
import Swal from "sweetalert2";

const serverApi = process.env.REACT_APP_SERVER;
const url = process.env.REACT_APP_API_BASE_URL + "/users";

const token = localStorage.getItem("token");

export const CartItem = (props) => {
    const { product, qty } = props;
    const {id}=useSelector((state)=>state.userSlice.value) 

    const updatedQty = useRef();
    const dispatch = useDispatch();
    const editCartQty = async (updatedQty) => {
        try {
            console.log(id)
            const data = {
                product_id: product.id,
                newQty: parseInt(updatedQty),
            };
            const fetchCartURL = url + `/fetch-cart`;
            const editCartURL = url + `/edit-cart-qty`;

            await axios.patch(`${editCartURL}/${id}`, data, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });
            const cartData = await axios.get(fetchCartURL, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });
            dispatch(cartUser(cartData.data.cartData));
        } catch (err) {
            if (!err.response) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Please Login/Register First!",
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: err.response.data.message,
                });
            }
        }
    };

    const deleteProductCart = async () => {
        try {
            const data = {
                product_id: product.id,
            };
            await axios.delete(
                url + `/remove-product-cart/${id}`,
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                    data,
                }
            );
            const cartData = await axios.get(url + `/fetch-cart`, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });
            dispatch(cartUser(cartData.data.cartData));
        } catch (err) {}
    };
    const deleteWarning = async () => {
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
                    deleteProductCart();
                    Swal.fire(
                        "Deleted!",
                        "Product has been deleted!",
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

    return (
        <Flex
            direction={{
                base: "column",
                md: "row",
            }}
            justify="center"
            align="center"
        >
            <Stack direction="row" spacing="2" width="full" align="flex-end">
                <Image
                    rounded="lg"
                    width="60px"
                    height="60px"
                    fit="cover"
                    src={`${serverApi}${product.product_image}`}
                    draggable="false"
                    loading="lazy"
                />
                <Box pt="4">
                    <Stack spacing="0.5">
                        <Text fontWeight="medium">{product.name}</Text>
                        <Text
                            color={useColorModeValue("gray.600", "gray.400")}
                            fontSize="xs"
                        >
                            {product.description}
                        </Text>
                    </Stack>
                </Box>
            </Stack>

            <Flex
                width="full"
                justify="space-between"
                display={{
                    base: "none",
                    md: "flex",
                }}
            >
                <NumberInput
                    size="md"
                    maxW={24}
                    defaultValue={qty}
                    min={1}
                    max={product.stock}
                    ref={updatedQty}
                >
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper
                            onClick={() =>
                                editCartQty(updatedQty.current.firstChild.value)
                            }
                        />
                        <NumberDecrementStepper
                            onClick={() =>
                                editCartQty(updatedQty.current.firstChild.value)
                            }
                        />
                    </NumberInputStepper>
                </NumberInput>
                <HStack spacing="1">
                    <Text as="span" fontWeight="medium">
                        Rp
                        {(product.price * qty)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    </Text>
                </HStack>
                <IconButton
                    bg={"none"}
                    color={"#ff4d4d"}
                    icon={<BsFillTrashFill />}
                    onClick={() => {
                        deleteWarning();
                    }}
                />
            </Flex>
        </Flex>
    );
};
