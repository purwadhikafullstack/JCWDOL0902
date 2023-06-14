import { Container, Box } from "@chakra-ui/react";

import { Navbar } from "../components/Navbar";
import { Profile } from "../components/UserProfile/Profile";

export const ProfilePage = () => {
    return (
        <>
            <Box bg="#F8F9FA" minHeight="100vh">
                <Navbar />
                <Container minH={"89.5vh"} maxW={"100%"} p={5} color={"black"}>
                    <Container maxW="container.lg">
                        <Container maxW="container.lg" p={5}>
                            <Profile />
                        </Container>
                    </Container>
                </Container>
                {/* <Footer /> */}
            </Box>
        </>
    );
};
