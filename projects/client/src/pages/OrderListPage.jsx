import { Box, Container, useMediaQuery } from "@chakra-ui/react";
import React from "react";
import { Navbar } from "../components/Navbar";
import { FooterComponent } from "../components/Footer";
import { ErrorPage } from "./ErrorPage";
import divider from "../assets/divider_result.jpg";
import OrderList from "../components/OrderList";

const OrderListPage = () => {
  const [isSmallScreen] = useMediaQuery("(max-width: 666px)");
  const token = localStorage.getItem("token");

  if (!token) {
    return <ErrorPage />;
  }

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Navbar />
      <Box flex="1">
        <Box mt={isSmallScreen ? "30px" : "30px"} color="black" pb="6">
          <Box maxW="1000px" m="auto">
            <div
              style={{
                backgroundImage: `url(${divider})`,
                backgroundSize: "cover",
                borderRadius: "12px",
              }}
              className="w-full flex justify-between p-5 mt-5"
            >
              <div className="hidden lg:flex lg:flex-col lg:gap-1 lg:w-full text-white">
                <p className="text-2xl font-semibold">Order History</p>
              </div>
              {isSmallScreen && (
                <div className="flex flex-col gap-1 w-full text-white">
                  <p className="text-2xl font-semibold">Order History</p>
                </div>
              )}
            </div>
            <OrderList />
          </Box>
        </Box>
      </Box>
      <FooterComponent />
    </Box>
  );
};

export default OrderListPage;
