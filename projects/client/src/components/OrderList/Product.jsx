import { Box, Flex, Text, useMediaQuery } from "@chakra-ui/react";
import React from "react";

const serverApi = process.env.REACT_APP_SERVER;


const Product = ({ data }) => {
  const [isSmallScreen] = useMediaQuery("(max-width: 666px)");
  const numberFormatter = (num) => {
    return Intl.NumberFormat("id-ID").format(num);
  };
  return (
    <Flex
      m={"2"}
      flexDirection={isSmallScreen ? "column" : "row"}
      borderBottom={"2px"}
      pb={"2"}
      borderColor={"gray.200"}
    >
      <Flex className="space-x-5" flex={1}>
        <img
          src={serverApi+data.product_location.product.product_image}
          alt="product"
          className="rounded-lg w-28 h-36 object-cover"
        />
        <Box>
          <Text className="text-xl font-semibold">
            {data.product_location.product.name}
          </Text>
          <Text>
            {data.qty} X {numberFormatter(data.price)}
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Product;