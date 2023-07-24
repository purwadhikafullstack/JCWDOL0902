import { useState, useRef } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { cartUser } from "../../redux/cartSlice";
import decode from "jwt-decode";

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
}) => {
    const [limit, setLimit] = useState(1);
    const addedQty = useRef(``);
    const dispatch = useDispatch();
    const AddCart = async (product) => {
        try {
            if (addedQty.current.defaultValue==="") {
                Swal.fire({
                    icon: "error",
                    title: "Action Declined",
                    text: "Quantity Can't be Null",
                });
            } else{
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
    
                const cartData = await axios.get(
                    `${fetchCartURL}/${decodedToken.id}`,
                    {
                        headers: {
                            authorization: `Bearer ${token}`,
                        },
                    }
                );
                dispatch(cartUser(cartData.data.cartData));
    
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: `Product Added to Cart Successfully!`,
                });
            }
        } catch (err) {
            if (!err.response) {
                Swal.fire({
                    icon: "error",
                    title: "Action Declined",
                    text: "Please Login/Register First!",
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Action Declined",
                    text: err.response.data.message,
                });
            }
        }
    };

    return (
        <>
            <Box borderRadius="md" backgroundColor={"#DEE2E6"} p={3}>
                <Text fontWeight={"600"}>Add to Cart</Text>
                <Divider my={"3"} />
                <Box display={"flex"} gap={2} alignItems={"center"}>
                    <Box width={"45%"}>
                        <NumberInput
                            size={"md"}
                            defaultValue={quantity}
                            min={1}
                            max={totalStock}
                            borderWidth={"2px"}
                            borderRadius={"md"}
                            borderStyle={"none"}
                            isDisabled={totalStock ? false : true}
                            backgroundColor={"white"}
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
                                    bg="#343A40"
                                    children="+"
                                    fontWeight={"bold"}
                                    onClick={() => {
                                        if (quantity < totalStock)
                                            setQuantity(quantity + 1);
                                    }}
                                    color={"white"}
                                />
                                <NumberDecrementStepper
                                    bg="#343A40"
                                    children="-"
                                    fontWeight={"bold"}
                                    onClick={() => {
                                        if (quantity > 1)
                                            setQuantity(quantity - 1);
                                    }}
                                    color={"white"}
                                />
                            </NumberInputStepper>
                        </NumberInput>
                    </Box>
                    <Text fontWeight={"500"}>
                        Available Stock:{" "}
                        <Text as={"span"} fontWeight="bold">
                            {totalStock}
                        </Text>
                    </Text>
                </Box>
                <Box display={"flex"} justifyContent={"space-between"} mb={"4"}>
                    <Text color={"black"} fontWeight={"500"}>
                        Total Price
                    </Text>
                    <Text fontWeight="bold">
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
