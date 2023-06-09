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

import { RegisterationForm } from "./Authentications/RegisterationForm";
import { LoginForm } from "./Authentications/LoginForm";

import userLogin from "../assets/default_avatar.jpg";
import loginMenu from "../assets/login_menu.webp";

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

    const onLogout = async () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <Box>
            <Button
                as={Avatar}
                size={"xl"}
                src={token ? decodedToken.picture : userLogin}
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
                                        token ? decodedToken.picture : loginMenu
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
                                    Profile
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
