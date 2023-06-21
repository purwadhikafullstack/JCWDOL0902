import { Box, Heading, Text, Button, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import pict from "../assets/not_found.png";

export const ErrorPage = () => {
    const navigate = useNavigate();
    return (
        <Box textAlign="center" py={10} px={6}>
            <Heading
                display="inline-block"
                as="h2"
                size="2xl"
                bgGradient="linear(to-r, blue.400, blue.600)"
                backgroundClip="text"
            >
                404
            </Heading>
            <Text fontSize="18px" mt={3} mb={2} fontWeight="bold">
                Page Not Found
            </Text>
            <Text color="gray.500" mb={6}>
                The page you're looking for does not seem to exist
            </Text>

            <Button
                onClick={() => navigate("/")}
                colorScheme="blue"
                bgGradient="linear(to-r, blue.400, blue.500, blue.600)"
                color="white"
                variant="solid"
                mb={6}
                mx="auto"
                maxW="200px"
                width="100%"
            >
                Go to Home
            </Button>

            <Image
                src={pict}
                alt="Error"
                maxW="xl"
                mx="auto"
                mt={6}
                width="100%"
            />
        </Box>
    );
};
