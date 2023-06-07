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

    const navigate = useNavigate();

    return (
        <Box bg={"white"}>
            <NavbarAdmin />
            <Box>
                <p>test123</p>
            </Box>
        </Box>
    );
};
