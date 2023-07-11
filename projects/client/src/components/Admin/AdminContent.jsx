// chakra
import { Box } from "@chakra-ui/react";

// components
import { UserList } from "./UserTabAdmin";
import { WarehouseList } from "./WarehouseTabAdmin";
import { CategoryList } from "./CategoryTabAdmin";
import { ProductList } from "./ProductTabAdmin";
import { ProductStockList } from "./StockTabAdmin";
import { MutationList } from "./MutationTabAdmin";
import { WarehouseMutationApproveList } from "./ApproveMutationTabAdmin";
import { WarehouseMutationRequestList } from "./RequestMutationTabAdmin";
import { ReportList } from "./JournalStockTabAdmin";
import { WarehouseReportList } from "./JournalStockTabWarehouseAdmin";
import { TransactionList } from "./TransactionAdminTab";
import { WarehouseTransactionList } from "./WarehouseTransactionTab";

export const AdminContent = ({ tabNum, role }) => {
    const tabs =
        role === 3
            ? [
                  UserList,
                  WarehouseList,
                  CategoryList,
                  ProductList,
                  ProductStockList,
                  MutationList,
                  ReportList,
                  TransactionList,
              ]
            : [
                  CategoryList,
                  ProductList,
                  ProductStockList,
                  WarehouseMutationRequestList,
                  WarehouseMutationApproveList,
                  WarehouseReportList,
                  WarehouseTransactionList,
              ];
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
