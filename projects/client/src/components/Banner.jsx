import { Flex, Image, Box, Center } from "@chakra-ui/react";
import banner from "../assets/banner_hobby_zone.jpg";

export const Banner = () => {
  return (
    <Center>
      <Box maxW="100%" borderBottom="5px solid black" paddingBottom="50px">
        <Flex justify="center" alignItems="center">
          <Image src={banner} alt="Banner" borderRadius="lg" objectFit="cover" width="100%" />
        </Flex>
      </Box>
    </Center>
  );
};


