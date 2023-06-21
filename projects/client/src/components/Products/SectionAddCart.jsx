import { useState, useRef } from "react";
import axios from "axios";
import decode from "jwt-decode";

import { useDispatch } from "react-redux";
import { cartUser } from "../../redux/cartSlice";

import {
    Box,
    Button,
    Divider,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Text,
    Tooltip,
} from "@chakra-ui/react";

import Swal from "sweetalert2";

export const SectionAddCart = ({
    totalStock,
    quantity,
    setQuantity,
    subtotal,
    product,
    baseApi,
    baseServer,
}) => {
    const [limit, setLimit] = useState(1);
    const addedQty = useRef(``);
    const dispatch = useDispatch();
    const AddCart = async (product) => {
        try {
            const token = localStorage.getItem("token");
            const decodedToken = decode(token);

            const data = {
                product_id: product.id,
                addedQty: parseInt(addedQty.current.defaultValue),
            };
            const url = process.env.REACT_APP_API_BASE_URL + "/users";
            const fetchCartURL = url + `/fetch-cart`;
            const addCartURL = url + `/add-to-cart`;
            await axios.patch(`${addCartURL}/${decodedToken.id}`, data, {
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

            Swal.fire({
                icon: "success",
                title: "Success",
                text: `Product Added to Cart Successfully!`,
            });

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

    return (
        <>
            <Box
                borderColor="#385898"
                borderRadius="md"
                borderWidth="2px"
                p={3}
            >
                <Text>Set the quantity</Text>
                <Divider my={"3"} />
                <Box display={"flex"} gap={2} alignItems={"center"}>
                    <Box width={"45%"}>
                        <NumberInput
                            size={"md"}
                            defaultValue={quantity}
                            min={1}
                            max={totalStock}
                            borderColor={"gray"}
                            isDisabled={totalStock ? false : true}
                        >
                            <NumberInputField
                                ref={addedQty}
                                accept="num"
                                onChange={(e) => {
                                    const regex = /^\d+$/;
                                    if (!regex.test(e.target.value)) {
                                        return setQuantity(0);
                                    }
                                    if (e.target.value < 1) {
                                        return setQuantity(1);
                                    }
                                    if (e.target.value > totalStock) {
                                        return setQuantity(totalStock);
                                    }
                                    setQuantity(+e.target.value);
                                }}
                            />
                            <NumberInputStepper>
                                <NumberIncrementStepper
                                    bg="#385898"
                                    children="+"
                                    onClick={() => {
                                        if (quantity < totalStock)
                                            setQuantity(quantity + 1);
                                    }}
                                />
                                <NumberDecrementStepper
                                    bg="#385898"
                                    children="-"
                                    onClick={() => {
                                        if (quantity > 1)
                                            setQuantity(quantity - 1);
                                    }}
                                />
                            </NumberInputStepper>
                        </NumberInput>
                    </Box>
                    <Text>
                        Stock:{" "}
                        <Text as={"span"} fontWeight="bold" color={"#385898"}>
                            {totalStock}
                        </Text>
                    </Text>
                </Box>
                <Box display={"flex"} justifyContent={"space-between"} mb={"4"}>
                    <Text color={"gray"}>Subtotal</Text>
                    <Text fontWeight="bold" color={"#385898"}>
                        {totalStock
                            ? `Rp${(subtotal * quantity)
                                  ?.toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
                            : "-"}
                    </Text>
                </Box>
                <Box>
                    <Tooltip label={totalStock ? "" : "Out of Stock"}>
                        <Button
                            w={"100%"}
                            colorScheme={"red"}
                            onClick={() => {
                                AddCart(product);
                                setLimit(limit + 1);
                            }}
                            disabled={totalStock ? false : true}
                        >
                            + Cart
                        </Button>
                    </Tooltip>
                </Box>
            </Box>
        </>
    );
};
