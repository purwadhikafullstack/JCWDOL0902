import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export const AdminPage = () => {
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
        ADMIN 
      </Heading>
      <Text fontSize="18px" mt={3} mb={2}>
        ADMIN PAGE
      </Text>
      <Text color={"gray.500"} mb={6}>
        ADMIN PAGE
      </Text>

      <Button
        onClick={() => navigate("/")}
        colorScheme="blue"
        bgGradient="linear(to-r, blue.400, blue.500, blue.600)"
        color="white"
        variant="solid"
      >
        Go to Home
      </Button>
    </Box>
  );
};
