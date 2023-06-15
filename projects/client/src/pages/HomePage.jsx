import { HomeCarousel } from "../components/Carousel";
import { FooterComponent } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { Box } from "@chakra-ui/react";

export const HomePage = () => {
    return (
        <Box minHeight="100vh" display="flex" flexDirection="column">
            <Navbar />
            <Box flex="1">
                <HomeCarousel />
            </Box>
            <FooterComponent />
        </Box>
    );
};
