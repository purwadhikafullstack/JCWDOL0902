// chakra
import { Box } from "@chakra-ui/react";

// components
import { UserList } from "./UserTabAdmin";
import { WarehouseList } from "./WarehouseTabAdmin";

export const AdminContent = ({ tabNum, role }) => {
    const tabs =
        role === 3 ? [UserList, WarehouseList] : [UserList, WarehouseList];
    const TabBody = tabs[tabNum];

    return (
        <Box
            paddingLeft={{ base: 2 }}
            paddingRight={{ md: 4 }}
            paddingTop={{ md: 3 }}
        >
            <TabBody />
        </Box>
    );
};
