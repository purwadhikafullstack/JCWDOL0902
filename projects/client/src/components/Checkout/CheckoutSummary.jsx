import { Button, Flex, Heading, Stack, Text, Divider } from "@chakra-ui/react";
import { FaArrowRight } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const CheckoutSummary = (props) => {
  const { cartQty, totalPrice, shipmentCost } = props;
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (shipmentCost < 1) {
      return Swal.fire({
        title: "Harap pilih ekspedisi pengiriman",
        icon: "warning",
      });
    }

    navigate("/cart");
  };

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
            Shipment Cost
          </Text>
          <Text fontSize="xl" fontWeight="extrabold">
            Rp
            {Intl.NumberFormat("id-ID").format(shipmentCost)}
          </Text>
        </Flex>
        <Flex justify="space-between">
          <Text fontSize="lg" fontWeight="semibold">
            Total
          </Text>
          <Text fontSize="xl" fontWeight="extrabold">
            Rp
            {Intl.NumberFormat("id-ID").format(+totalPrice + +shipmentCost)}
          </Text>
        </Flex>
      </Stack>
      <Button
        colorScheme="blue"
        size="lg"
        fontSize="md"
        rightIcon={<FaArrowRight />}
        onClick={handleCheckout}
      >
        Choose Payment Method
      </Button>
    </Stack>
  );
};