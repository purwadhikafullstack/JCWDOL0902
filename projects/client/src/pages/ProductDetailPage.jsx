import { Box, Container } from "@chakra-ui/react";

import { Navbar } from "../components/Navbar";
import { ProductDetail } from "../components/Products/ProductDetail";
import { FooterComponent } from "../components/Footer";

export const DetailProductPage = () => {
    return (
        <Box bg="#F5F5F5" minHeight="100vh">
            <Navbar />
            <Container maxW={"full"} pt={"8"}>
                <ProductDetail />
            </Container>
            <FooterComponent />
        </Box>
    );
};
