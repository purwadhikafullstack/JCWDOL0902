import React, { useEffect, useState } from "react";

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
import { CheckoutItem } from "./CheckoutItem";
import { CheckoutSummary } from "./CheckoutSummary";
import { CheckoutAddress } from "./CheckoutAddress";
import pict from "../../assets/empty-cart-ilustration.png";
import LogoJne from "../../assets/logo_jne.png";
import LogoPos from "../../assets/logo_pos.png";
import LogoTiki from "../../assets/logo_tiki.png";
import axios from "axios";

const COURIER = [
  {
    id: "jne",
    logo: LogoJne,
    services: [],
  },
  {
    id: "pos",
    logo: LogoPos,
    services: [],
  },
  {
    id: "tiki",
    logo: LogoTiki,
    services: [],
  },
];

export const CheckoutForm = () => {
  const [address, setAddress] = useState("");
  const [selectedCourier, setSelectedCourier] = useState({});
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState({});

  const cart = useSelector((state) => state.cartSlice.value);
  const cartQty = useSelector((state) =>
    state.cartSlice.value.reduce(function (acc, obj) {
      return acc + obj.qty;
    }, 0)
  );
  const totalPrice = useSelector((state) =>
    state.cartSlice.value.reduce(function (acc, obj) {
      return acc + obj.qty * obj.product.price;
    }, 0)
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

    return cart.map((item) => <CheckoutItem key={item.id} {...item} />);
  };

  const handleSelectCourier = (arg) => {
    setSelectedCourier(arg);
  };
  const handleSetDestination = (arg) => {
    setAddress(arg);
  };

  const getOngkir = async () => {
    try {
      if (!selectedCourier.id || !address) {
        return;
      }
      const BASE_API = process.env.REACT_APP_API_BASE_URL;
      const { data } = await axios.get(
        BASE_API +
          `/cost?courier=${selectedCourier.id}&origin=115&destination=${address} `
      );

      setServices(data.data[0].costs);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOngkir();
  }, [selectedCourier, address]);

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
          <Stack flex="2">
            <Heading fontSize="2xl" fontWeight="extrabold">
              Addresses
            </Heading>
            <Divider orientation="horizontal" />
            <CheckoutAddress setDestination={handleSetDestination} />
          </Stack>
          <Stack flex="2">
            <Heading fontSize="2xl" fontWeight="extrabold">
              Shipment Methods
            </Heading>
            <Divider orientation="horizontal" />
            <Stack flexDirection={"row"} alignItems={"center"} mb={"3"}>
              {COURIER.map((item) => (
                <Flex
                  onClick={() => handleSelectCourier(item)}
                  key={item.id}
                  flexDirection={"column"}
                  className={`
                  w-20 h-10 justify-center items-center p-2
                  ${
                    selectedCourier.id === item.id ? "border-4" : "border-0"
                  } border-blue-300 rounded-xl`}
                >
                  <img src={item.logo} alt="courier" className="" />
                </Flex>
              ))}
            </Stack>
            <Flex gap={5}>
              {services &&
                services.map((item) => (
                  <Flex
                    flexDirection={"column"}
                    flex={1}
                    border={"2px"}
                    p={2}
                    rounded={"lg"}
                    cursor={"pointer"}
                    borderColor={
                      selectedServices.service === item.service
                        ? "blue.300"
                        : "gray.300"
                    }
                    onClick={() => setSelectedServices(item)}
                  >
                    <Flex justifyContent={"space-between"}>
                      <Text fontSize={"large"} fontWeight={"semibold"}>
                        {item.service}
                      </Text>
                      <Text fontSize={"large"}>
                        {" "}
                        {item.cost[0].etd.replace("HARI", "")} Hari
                      </Text>
                    </Flex>
                    <Text fontSize={"large"}>
                      Rp.{" "}
                      {Intl.NumberFormat("id-ID").format(item.cost[0].value)}
                    </Text>
                  </Flex>
                ))}
            </Flex>
            {/* Insert Shipment Form */}
          </Stack>
          <Stack flex="2">
            <Heading fontSize="2xl" fontWeight="extrabold">
              Shopping Cart ({cartQty} Item(s))
            </Heading>
            <Divider orientation="horizontal" />

            <Stack spacing="10">{renderCartItems()}</Stack>
          </Stack>
        </Stack>

        <Flex direction="column" align="center" flex="1">
          <CheckoutSummary
            cartQty={cartQty}
            totalPrice={totalPrice}
            shipmentCost={
              Object.keys(selectedServices).length > 0
                ? selectedServices?.cost[0]?.value
                : 0
            }
          />
        </Flex>
      </Stack>
    </Box>
  );
};