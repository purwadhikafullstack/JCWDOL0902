import React from "react";
import { useEffect, useState, useCallback } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";

// redux
import { useDispatch, useSelector } from "react-redux";
import { cartUser } from "../../redux/cartSlice";

import {
    Portal,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverCloseButton,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    Button,
    Stack,
    Image,
    Text,
    Avatar,
    AvatarBadge,
} from "@chakra-ui/react";
import { FaShoppingCart } from "react-icons/fa";

import pict from "../.././assets/empty-cart-ilustration.png";

const url = process.env.REACT_APP_API_BASE_URL + "/users";
const serverApi = process.env.REACT_APP_SERVER;

export const CartNav = () => {
    let [cart, setCart] = useState();
    let [cartQty, setCartQty] = useState(0);

    const dispatch = useDispatch();

    const getCart = useCallback(async () => {
        try {
            const cartURL = url + `/fetch-cart`;
            const token = localStorage.getItem("token");

            const cartData = await Axios.get(cartURL, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });
            setCart(cartData.data.cartData);
            setCartQty(
                cartData.data.cartData.reduce(function (acc, obj) {
                    return acc + obj.qty;
                }, 0)
            );
            dispatch(cartUser(cartData.data.cartData));
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        } catch (err) {}
    }, [dispatch]);

    useEffect(() => {
        getCart();
    }, [getCart]);

    cart = useSelector((state) => state.cartSlice.value);
    cartQty = useSelector((state) =>
        state.cartSlice.value.reduce(function (acc, obj) {
            return acc + obj.qty;
        }, 0)
    );

    return (
        <Popover zIndex="20">
            <PopoverTrigger>
                <Avatar>
                    <Button
                        leftIcon={<FaShoppingCart size="1.5em" />}
                        color="black"
                        size="lg"
                        p="0"
                        bg="#E9ECEF"
                    />
                    <AvatarBadge
                        boxSize="2em"
                        bg="red.400"
                        placement="top-end"
                        fontSize={15}
                        borderColor="#E9ECEF"
                    >
                        {new Set(cart).size}
                    </AvatarBadge>
                </Avatar>
            </PopoverTrigger>
            <Portal>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverHeader fontSize={18} fontWeight={500}>
                        Cart ({cartQty})
                    </PopoverHeader>
                    <PopoverCloseButton />
                    <PopoverBody>
                        {cartQty !== 0 ? (
                            cart.map(({ product, qty, id }) => (
                                <Stack
                                    key={id}
                                    direction={["column", "row"]}
                                    align="center"
                                    justifyContent="space-between"
                                    gap="2"
                                    spacing="24px"
                                    my="4"
                                >
                                    <Image
                                        src={`${serverApi}${product.product_image}`}
                                        borderRadius="lg"
                                        boxSize="50px"
                                    />
                                    <Stack w="50%">
                                        <Text fontSize="xs">
                                            {product.name}
                                        </Text>
                                        <Text fontSize="sm">x {qty}</Text>
                                    </Stack>
                                    <Stack gap="2">
                                        <Text fontSize="sm">
                                            Rp
                                            {product.price
                                                .toString()
                                                .replace(
                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                    "."
                                                )
                                                }
                                        </Text>
                                    </Stack>
                                </Stack>
                            ))
                        ) : (
                            <Stack
                                direction="column"
                                align="center"
                                gap="2"
                                spacing="24px"
                            >
                                <Image
                                    src={pict}
                                    alt="Empty Cart"
                                    maxWidth={"200px"}
                                />
                                <Text
                                    fontSize="m"
                                    textAlign="right"
                                    align="center"
                                >
                                    Your Cart is Empty!
                                </Text>
                            </Stack>
                        )}
                    </PopoverBody>
                    {cartQty !== 0 ? (
                        <PopoverFooter justify="end" align="end">
                            <Button
                                bg="#319795"
                                color="white"
                                size="xs"
                                as={Link}
                                to={"/cart"}
                            >
                                See Cart
                            </Button>
                        </PopoverFooter>
                    ) : null}
                </PopoverContent>
            </Portal>
        </Popover>
    );
};
