import { Flex, Stack, Image, Text, Box } from "@chakra-ui/react";

const serverApi = process.env.REACT_APP_SERVER;

export const CheckoutItem = (props) => {
    const { product, qty } = props;
    return (
        <Flex
            direction={{
                base: "column",
                md: "row",
            }}
            justify="center"
            align="center"
            justifyItems={"center"}
        >
            <Stack direction="row" spacing="2" width="full" align="center">
                <Image
                    rounded="lg"
                    width="100px"
                    height="100px"
                    fit="cover"
                    src={`${serverApi}${product.product_image}`}
                    draggable="false"
                    loading="lazy"
                />
                <Box>
                    <Text fontWeight="medium">{product.name}</Text>
                    <Text fontWeight="small">{qty} Item(s)</Text>
                    {product.weight >= 1000 ? (
                        <Text fontWeight="small">
                            {product.weight / 1000} kg
                        </Text>
                    ) : (
                        <Text fontWeight="small">{product.weight} gr</Text>
                    )}
                    <Text as="span" fontWeight="medium">
                        Rp
                        {(product.price * qty)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    </Text>
                </Box>
            </Stack>

            <Flex
                width="full"
                justify="space-between"
                display={{
                    base: "none",
                    md: "flex",
                }}
            ></Flex>
        </Flex>
    );
};
