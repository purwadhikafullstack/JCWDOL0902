import React from "react";

// redux
import { useSelector } from "react-redux";

import {
    Box,
    Flex,
    Heading,
    Stack,
    Divider,
    Text,
    Image,
} from "@chakra-ui/react";
import { CartItem } from "./CartItem";
import { CartOrderSummary } from "./CartOrderSummary";
import pict from "../../../assets/empty-cart-ilustration.png";

export const CartForm = () => {
    const cart = useSelector((state) => state.cartSlice.value);
    const cartQty = useSelector((state) =>
        state.cartSlice.value.reduce(function (acc, obj) {
            return acc + obj.qty;
        }, 0)
    );
    const totalPrice = useSelector((state) =>
        state.cartSlice.value
            .reduce(function (acc, obj) {
                return acc + obj.qty * obj.product.price;
            }, 0)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    );

    const renderCartItems = () => {
        if (cart.length === 0) {
            return (
                <Stack spacing="4" align="center">
                    <Text fontSize="xl" fontWeight="bold">
                        Your Cart is Empty
                    </Text>
                    <Text fontWeight={"500"}>
                        Looks like you have not added anything to your cart
                    </Text>
                    <Image src={pict} alt="Empty Cart" maxWidth="400px" />
                </Stack>
            );
        }

        return cart.map((item) => <CartItem key={item.id} {...item} />);
    };

    return (
        <Box
            maxW={{
                base: "3xl",
                lg: "7xl",
            }}
            mx="auto"
            px={{
                base: "4",
                md: "8",
                lg: "12",
            }}
            py={{
                base: "6",
                md: "8",
                lg: "12",
            }}
        >
            <Stack
                direction={{
                    base: "column",
                    lg: "row",
                }}
                align={{
                    lg: "flex-start",
                }}
                spacing={{
                    base: "8",
                    md: "16",
                }}
            >
                <Stack
                    spacing={{
                        base: "8",
                        md: "10",
                    }}
                    flex="2"
                >
                    <Heading fontSize="2xl" fontWeight="extrabold">
                        Shopping Cart ({cartQty} Items)
                    </Heading>
                    <Divider orientation="horizontal" />

                    <Stack spacing="10">{renderCartItems()}</Stack>
                </Stack>

                <Flex direction="column" align="center" flex="1">
                    <CartOrderSummary
                        cartQty={cartQty}
                        totalPrice={totalPrice}
                    />
                </Flex>
            </Stack>
        </Box>
    );
};
