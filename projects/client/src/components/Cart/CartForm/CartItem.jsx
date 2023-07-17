import { useRef } from "react";
import axios from "axios";
import decode from "jwt-decode";

import { useDispatch, useSelector } from "react-redux";
import { cartUser } from "../../../redux/cartSlice";

import {
    Flex,
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
    const token = localStorage.getItem("token");
    const decodedToken = decode(token);

    const updatedQty = useRef();
    const dispatch = useDispatch();
    const editCartQty = async (updatedQty) => {
        try {
            const data = {
                product_id: product.id,
                newQty: parseInt(updatedQty),
            };
            const fetchCartURL = url + "/fetch-cart";
            const editCartURL = url + "/edit-cart-qty";

            await axios.patch(`${editCartURL}/${decodedToken.id}`, data, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });
            const cartData = await axios.get(
                `${fetchCartURL}/${decodedToken.id}`,
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                }
            );
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
                url + `/remove-product-cart/${decodedToken.id}`,
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                    data,
                }
            );

            const cartData = await axios.get(
                url + `/fetch-cart/${decodedToken.id}`,
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                }
            );
            dispatch(cartUser(cartData.data.cartData));
        } catch (err) {}
    };
    const deleteWarning = async () => {
        try {
            Swal.fire({
                title: "Are you sure?",
                text: "The Product Will Be Removed From the Cart!",
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
                        "The Product Has Been Removed From The Cart!",
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
            justifyItems={"center"}
        >
            <Stack direction="row" spacing="2" width="full" align="center">
                <Image
                    rounded="lg"
                    width="100px"
                    height="100px"
                    fit="cover"
                    src={`${serverApi}${product.product_image}`}
                    draggable="false"
                    loading="lazy"
                />
                <Box pt="4" flex={"1"}>
                    <Text fontWeight="medium">{product.name}</Text>
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
                    onChange={(value) =>
                        editCartQty(value)
                        // console.log(value)
                    }
                >
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
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
