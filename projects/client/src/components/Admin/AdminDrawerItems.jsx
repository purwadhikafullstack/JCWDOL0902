import { useState } from "react";
import decode from "jwt-decode";

import { Stack, Button, Box, Flex, Image } from "@chakra-ui/react";

import logo from "../../assets/kickshub_logo_simplified.png";

export const DrawerItems = () => {
    const [context, setContext] = useState(0);

    const token = localStorage.getItem("token");
    const decodedToken = decode(token);

    const items =
        decodedToken.role === 3
            ? [
                  "Users",
                  "Warehouses",
                  "Products",
                  "Categories",
                  "Orders",
                  "Mutations",
                  "Reports",
                  "Sales",
              ]
            : [
                  "Products",
                  "Categories",
                  "Orders",
                  "Mutations",
                  "Reports",
                  "Sales",
              ];

    return (
        <Box>
            <Flex
                h={{ base: "20" }}
                alignItems={"center"}
                justifyContent={"center"}
            >
                <Image w={{ base: "auto" }} h={{ base: "10" }} src={logo} />
            </Flex>
            <Stack paddingTop={"2"}>
                {items.map((item, index) => {
                    return (
                        <Button
                            key={index}
                            borderRadius={0}
                            color={"white"}
                            bg={"none"}
                            _hover={{ bg: "#CED4DA" }}
                            onClick={() => {
                                setContext(index);
                            }}
                        >
                            {item}
                        </Button>
                    );
                })}
            </Stack>
        </Box>
    );
};
