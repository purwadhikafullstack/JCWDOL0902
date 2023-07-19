import { useState } from "react";
import decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";

import {
    Avatar,
    Button,
    Box,
    Drawer,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    Flex,
    Image,
    Container,
    Stack,
    HStack,
    VStack,
    useColorModeValue,
    Text,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    useToast,
} from "@chakra-ui/react";

import { FiChevronDown } from "react-icons/fi";
import { HamburgerIcon } from "@chakra-ui/icons";
import {
    FaUser,
    FaWarehouse,
    FaListAlt,
    FaBox,
    FaExchangeAlt,
} from "react-icons/fa";
import { BsInboxesFill } from "react-icons/bs";
import { ImCheckmark } from "react-icons/im";
import { TbReportAnalytics, TbReportSearch } from "react-icons/tb";
import { BsFillCartCheckFill } from "react-icons/bs";

import logo from "../assets/hobbyzone_logo.png";
import simple from "../assets/hobbyzone_logo_simple.png";

import { AdminContent } from "../components/Admin/AdminContent";
import { ErrorPage } from "./ErrorPage";

const serverApi = process.env.REACT_APP_SERVER;

export const AdminPage = () => {
    const [tab, setTab] = useState(0);

    const token = localStorage.getItem("token");
    const decodedToken = decode(token);
    const dispatch = useDispatch();
    const toast = useToast();

    const TabContent = () => {
        const items =
            decodedToken.role === 3
                ? [
                      { label: "Sales Report", icon: TbReportSearch },

                      { label: "Users", icon: FaUser },
                      { label: "Warehouses", icon: FaWarehouse },
                      { label: "Categories", icon: FaListAlt },
                      { label: "Products", icon: FaBox },
                      { label: "Stock Management", icon: BsInboxesFill },
                      { label: "Stock Mutations", icon: FaExchangeAlt },
                      {
                          label: "Stock Journal Report",
                          icon: TbReportAnalytics,
                      },
                      { label: "Transactions", icon: BsFillCartCheckFill },
                  ]
                : [
                      {
                          label: "Sales Report",
                          icon: TbReportSearch,
                      },
                      { label: "Categories", icon: FaListAlt },
                      { label: "Products", icon: FaBox },
                      { label: "My Warehouse Stock", icon: BsInboxesFill },
                      {
                          label: "Request Stock Mutation",
                          icon: FaExchangeAlt,
                      },
                      {
                          label: "Approve Stock Mutation Requests",
                          icon: ImCheckmark,
                      },
                      { label: "My Stock Journal", icon: TbReportAnalytics },
                      {
                          label: "My Warehouse Transactions",
                          icon: BsFillCartCheckFill,
                      },
                  ];

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
                        const Icon = item.icon;

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
                                leftIcon={<Icon />} // Add the icon as the left icon
                            >
                                {item.label}
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
                    color={"gray"}
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
                    <DrawerContent bg={"#385898"}>
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
                        bg={"#385898"}
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
        const navigate = useNavigate();
        const onLogout = () => {
            toast({
                title: "Logging out",
                status: "warning",
                position: "top",
                duration: 2000,
                isClosable: true,
            });

            setTimeout(() => {
                dispatch(logout());
                localStorage.removeItem("token");
                navigate("/");
            }, 2000);
        };

        return (
            <Flex
                ml={{ base: 0 }}
                px={{ base: 4, md: 4 }}
                height={"20"}
                alignItems="center"
                bg={"#E9ECEF"}
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
                                        src={`${serverApi}${decodedToken.picture}`}
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
                                            color="black"
                                            fontWeight="600"
                                        >
                                            {decodedToken.name}
                                        </Text>
                                    </VStack>
                                    <Box display={{ base: "none", md: "flex" }}>
                                        <FiChevronDown color={"black"} />
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
                                <MenuItem
                                    onClick={() => {
                                        navigate("/");
                                    }}
                                >
                                    Home
                                </MenuItem>
                                <MenuItem>Profile</MenuItem>
                                <MenuItem>Settings</MenuItem>
                                <MenuDivider />
                                <MenuItem
                                    onClick={() => {
                                        onLogout();
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

    return (
        <>
            {decodedToken.role === 1 ? (
                <ErrorPage />
            ) : (
                <Box bg={"white"}>
                    <Navbar />
                    <Box>
                        <AdminContent tabNum={tab} role={decodedToken.role} />
                    </Box>
                </Box>
            )}
        </>
    );
};
