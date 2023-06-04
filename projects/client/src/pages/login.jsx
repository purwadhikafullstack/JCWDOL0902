import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Checkbox,
    Stack,
    Button,
    Heading,
    useColorModeValue
  } from "@chakra-ui/react";
  import { useNavigate } from "react-router-dom";
  import axios from "axios";
  import Swal from "sweetalert2";
  import React from "react";
  
  export const LoginForm = () => {
    const navigate = useNavigate();
    const onLogin = async () => {
      try {
        const data = {
          email: document.getElementById("email").value,
          password: document.getElementById("password").value
        };
        const result = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/auth/login`,
          data
        );
  
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
  
        Swal.fire({
          icon: "success",
          title: result.data.message,
          showConfirmButton: false,
          timer: 1500
        });
  
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("username", result.data.data.username);
  
        setTimeout(() => {
          navigate("/");
        }, 100);
      } catch (err) {
        if (err.response.data) {
          Swal.fire({
            icon: "error",
            title: err.response.data.message,
            showConfirmButton: false,
            timer: 1500
          });
        } else {
          Swal.fire({
            icon: "error",
            title: err.response.data.errors[0].message,
            showConfirmButton: false,
            timer: 1500
          });
        }
      }
    };
  
    return (
      <Flex
        minH="100vh"
        align="center"
        justify="center"
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={8} mx="auto" maxW="lg" py={12} px={6}>
          <Stack align="center">
            <Heading fontSize="4xl">Sign in with your account</Heading>
          </Stack>
          <Box
            rounded="lg"
            bg={useColorModeValue("white", "gray.700")}
            boxShadow="lg"
            p={8}
          >
            <Stack spacing={4}>
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input type="email" />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input type="password" />
              </FormControl>
              <Stack spacing={10}>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align="start"
                  justify="space-between"
                >
                  <Checkbox>Remember me</Checkbox>
                  <Button onClick={() => navigate("/")} color="blue.400">
                    Back to home
                  </Button>
                </Stack>
                <Button
                  bg="blue.400"
                  color="white"
                  _hover={{
                    bg: "blue.500"
                  }}
                  onClick={onLogin}
                >
                  Sign in
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    );
  };
  