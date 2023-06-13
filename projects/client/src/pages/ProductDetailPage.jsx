import { Box, Container } from "@chakra-ui/react";

import { Navbar } from "../components/Navbar";
import { ProductDetail } from "../components/Products/ProductDetail";

export const DetailProductPage = () => {
    return (
        <Box bg="#F8F9FA" minHeight="100vh">
            <Navbar />
            <Container maxW={"full"} pt={"8"}>
                <ProductDetail />
            </Container>
        </Box>
    );
};
