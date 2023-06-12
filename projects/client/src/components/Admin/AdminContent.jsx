// chakra
import { Box } from "@chakra-ui/react";

// components
import { UserList } from "./UserTabAdmin";
import { WarehouseList } from "./WarehouseTabAdmin";
import { CategoryList } from "./CategoryTabAdmin";
import { ProductList } from "./ProductTabAdmin";
import { ProductStockList } from "./StockTabAdmin";

export const AdminContent = ({ tabNum, role }) => {
    const tabs =
        role === 3
            ? [
                  UserList,
                  WarehouseList,
                  CategoryList,
                  ProductList,
                  ProductStockList,
              ]
            : [CategoryList, ProductList, ProductStockList];
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
