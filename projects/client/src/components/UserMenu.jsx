import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    Button,
    Avatar,
    Center,
    Box,
    Stack,
} from "@chakra-ui/react";
import decode from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";

import { RegisterationForm } from "./Authentications/RegisterationForm";
import { LoginForm } from "./Authentications/LoginForm";

import userLogin from "../assets/default_avatar.jpg";
import loginMenu from "../assets/login_menu.webp";
import { useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";

const serverApi = process.env.REACT_APP_SERVER;

export const UserMenu = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    let decodedToken;
    if (token) {
        decodedToken = decode(token);
    } else {
        decodedToken = null;
    }
    // console.log(decodedToken);
    const dispatch = useDispatch();
    const onLogout = async () => {
        dispatch(logout());
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <Box>
            <Button
                as={Avatar}
                size={"xl"}
                src={token ? `${serverApi}${decodedToken.picture}` : userLogin}
                bg="grey"
                onClick={onOpen}
                boxSize={{ base: 8, lg: 12 }}
                borderRadius={"50%"}
            />
            <Drawer onClose={onClose} isOpen={isOpen} size={"xs"}>
                <DrawerOverlay />
                <DrawerContent bg={"#CED4DA"}>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottom={"2px solid black"}>
                        <Box>
                            <Center>
                                <Avatar
                                    size={{ base: "xl", lg: "xl" }}
                                    src={
                                        token
                                            ? `${serverApi}${decodedToken.picture}`
                                            : loginMenu
                                    }
                                    bg="white"
                                />
                            </Center>
                            <Box textAlign={"center"}>
                                {token
                                    ? `Hi, ${decodedToken.name}`
                                    : "Login Menu"}
                            </Box>
                        </Box>
                    </DrawerHeader>
                    <DrawerBody display={"flex"} flexDir={"column"}>
                        {token ? (
                            <Stack>
                                <Button as={Link} to={"/profile/settings"}>
                                    <FaUser style={{ marginRight: "0.5rem" }} />{" "}
                                    Profile
                                </Button>
                                <Button as={Link} to={"/profile/settings"}>
                                    <FaMapMarkerAlt
                                        style={{ marginRight: "0.5rem" }}
                                    />{" "}
                                    Address
                                </Button>
                            </Stack>
                        ) : (
                            <Stack>
                                <LoginForm />
                                <RegisterationForm />
                            </Stack>
                        )}
                    </DrawerBody>
                    {token ? (
                        <DrawerFooter>
                            {/* <Center> */}
                            <Button
                                color={"495057"}
                                bg="#F8F9FA"
                                onClick={() => {
                                    onLogout();
                                }}
                            >
                                Sign Out
                            </Button>
                            {/* </Center> */}
                        </DrawerFooter>
                    ) : null}
                </DrawerContent>
            </Drawer>
        </Box>
    );
};
