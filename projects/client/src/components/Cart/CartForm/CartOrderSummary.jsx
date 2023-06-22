import { Button, Flex, Heading, Stack, Text, Divider } from "@chakra-ui/react";
import { FaArrowRight } from "react-icons/fa";

export const CartOrderSummary = (props) => {
    const { cartQty, totalPrice } = props;
    return (
        <Stack
            spacing="5"
            rounded="lg"
            padding="8"
            width="full"
            backgroundColor={"#DEE2E6"}
        >
            <Heading size="md">Order Summary</Heading>
            <Divider orientation="horizontal" />
            <Stack spacing="6">
                <Flex justify="space-between">
                    <Text fontSize="lg" fontWeight="semibold">
                        Total
                    </Text>
                    <Text fontSize="xl" fontWeight="extrabold">
                        Rp
                        {totalPrice}
                    </Text>
                </Flex>
            </Stack>
            <Button
                colorScheme="blue"
                size="lg"
                fontSize="md"
                rightIcon={<FaArrowRight />}
            >
                Checkout
            </Button>
        </Stack>
    );
};
