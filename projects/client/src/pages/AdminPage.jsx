// react
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import decode from "jwt-decode";

// chakra
import { Box } from "@chakra-ui/react";
import { NavbarAdmin } from "../components/Admin/NavbarAdmin";

// component
// import { AdminBody } from "../components/Admin/AdminBody";

export const AdminPage = () => {
    const [context, setContext] = useState(0);

    const token = localStorage.getItem("token");
    const decodedToken = decode(token);

<<<<<<< Updated upstream
    const navigate = useNavigate();
=======
    const TabContent = () => {
        const items =
            decodedToken.role === 3 ? ["Users", "Warehouses", "Categories"] : ["Categories"];

        return (
            <Box>
                <Flex
                    h={{ base: "20" }}
                    alignItems={"center"}
                    justifyContent={"center"}
                >
                    <Image
                        w={{ base: "auto" }}
                        h={{ base: "10" }}
                        src={simple}
                    />
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
                                    setTab(index);
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

    const DrawerAdminResponsive = () => {
        const { isOpen, onOpen, onClose } = useDisclosure();
        return (
            <Box>
                <HamburgerIcon
                    color={"white"}
                    display={{ base: "flex" }}
                    onClick={onOpen}
                    variant="outline"
                    aria-label="open menu"
                    w={6}
                    h={6}
                />
                <Drawer
                    autoFocus={false}
                    isOpen={isOpen}
                    placement="left"
                    onClose={onClose}
                    returnFocusOnClose={false}
                    onOverlayClick={onClose}
                    size={"xs"}
                >
                    <DrawerContent bg={"#343A40"}>
                        <DrawerCloseButton color={"white"} />
                        <TabContent onClose={onClose} />
                    </DrawerContent>
                </Drawer>
            </Box>
        );
    };

    const AdminSideMenu = () => {
        return (
            <Box>
                <Container>
                    <DrawerAdminResponsive />
                    <Box
                        bg={"#343A40"}
                        w={{ base: 40, md: 60 }}
                        pos={"fixed"}
                        h={"full"}
                        display={{ base: "none" }}
                        left={0}
                        top={0}
                    >
                        <TabContent />
                    </Box>
                </Container>
            </Box>
        );
    };

    const Navbar = () => {
        const onLogout = async () => {
            localStorage.removeItem("token");
        };
        const navigate = useNavigate();

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
                <AdminSideMenu />

                <Image
                    src={logo}
                    display={{ base: "block" }}
                    w={"auto"}
                    h={12}
                />

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
                                            fontWeight="600"
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
>>>>>>> Stashed changes

    return (
        <Box bg={"white"}>
            <NavbarAdmin />
            <Box>
                <p>test123</p>
            </Box>
        </Box>
    );
};
