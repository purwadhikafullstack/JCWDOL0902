// react
import { useNavigate } from "react-router-dom";
import decode from "jwt-decode";

import {
    Box,
    Flex,
    Image,
    Avatar,
    HStack,
    VStack,
    useColorModeValue,
    Text,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
} from "@chakra-ui/react";

import { FiChevronDown } from "react-icons/fi";

import logo from "../../assets/kickshub_logo.png";

import { DrawerAdmin } from "./AdminDrawer";

export const NavbarAdmin = () => {
    const token = localStorage.getItem("token");
    const decodedToken = decode(token);

    const navigate = useNavigate();

    const onLogout = async () => {
        localStorage.removeItem("token");
    };

    return (
        <Flex
            ml={{ base: 0 }}
            px={{ base: 4, md: 4 }}
            height={"20"}
            alignItems="center"
            bg={"#212529"}
            justifyContent={{ base: "space-between" }}
            boxShadow="md"
        >
            <DrawerAdmin />

            <Image src={logo} display={{ base: "block" }} w={"auto"} h={12} />

            <HStack spacing={{ base: "0", md: "6" }}>
                <Flex alignItems={"center"}>
                    <Menu>
                        <MenuButton
                            py={2}
                            transition="all 0.3s"
                            _focus={{ boxShadow: "none" }}
                        >
                            <HStack>
                                <Avatar
                                    size={"sm"}
                                    src={decodedToken.picture}
                                    border={"1px solid white"}
                                />
                                <VStack
                                    display={{ base: "none", md: "flex" }}
                                    alignItems="flex-start"
                                    spacing="1px"
                                    ml="2"
                                >
                                    <Text
                                        fontSize="lg"
                                        color="white"
                                        fontWeight="bold"
                                    >
                                        {decodedToken.name}
                                    </Text>
                                </VStack>
                                <Box display={{ base: "none", md: "flex" }}>
                                    <FiChevronDown color={"white"} />
                                </Box>
                            </HStack>
                        </MenuButton>
                        <MenuList
                            bg={useColorModeValue("white", "gray.900")}
                            borderColor={useColorModeValue(
                                "gray.200",
                                "gray.700"
                            )}
                        >
                            <MenuItem>Profile</MenuItem>
                            <MenuItem>Settings</MenuItem>
                            <MenuDivider />
                            <MenuItem
                                onClick={() => {
                                    onLogout();
                                    navigate("/");
                                }}
                            >
                                Sign out
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </HStack>
        </Flex>
    );
};
