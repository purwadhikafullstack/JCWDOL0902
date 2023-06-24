import React from "react";
import { Container, Box } from "@chakra-ui/react";

import { Navbar } from "../components/Navbar";
import { CartForm } from "../components/Cart/CartForm/CartForm";
import { FooterComponent } from "../components/Footer";

export const CartPage = () => {
    return (
        <Box minHeight="100vh">
            <Navbar />
            <Container minH={"89.5vh"} maxW={"100%"} p={5} color={"black"}>
                <Container maxW="container.lg">
                    <Container maxW="container.lg" p={5}>
                        <CartForm />
                    </Container>
                </Container>
            </Container>
            <FooterComponent />
        </Box>
    );
};
