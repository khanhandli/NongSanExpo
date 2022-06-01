import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Badge, Button, Center, Divider, Flex, HStack, Icon, Image, ScrollView, Text, View } from 'native-base';
import React from 'react';
import { Dimensions, TouchableOpacity } from 'react-native';
import { Rating } from 'react-native-ratings';
import NHCSafeAreaView from '../../components/NHCSafeAreaView';
import { useStore } from '../../hooks/useStore';
import { numberWithCommas } from '../../ultils/common';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const TopBar = ({ route, navi, cart }: any) => {
    return (
        <View
            style={{
                backgroundColor: '#fff',
                height: 70,
                paddingTop: 30,
                marginBottom: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 20,
            }}
        >
            <TouchableOpacity
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                onPress={() => {
                    !route?.params?.isSearch ? navi.goBack() : navi.navigate('TabTwo');
                }}
            >
                <MaterialIcons name="arrow-back-ios" size={18} color="black" />
            </TouchableOpacity>
            <Text style={{ textTransform: 'uppercase', fontSize: 18 }}>{route.params.product.title.slice(0, 22)}</Text>
            <TouchableOpacity
                onPress={async () => {
                    navi.navigate('Cart');
                }}
            >
                <View>
                    {cart?.length ? (
                        <Badge // bg="red.400"
                            colorScheme="danger"
                            rounded="full"
                            top="-8px"
                            right="-6px"
                            zIndex={1}
                            variant="solid"
                            alignSelf="flex-end"
                            _text={{
                                fontSize: 12,
                            }}
                            position="absolute"
                        >
                            {cart?.length}
                        </Badge>
                    ) : (
                        <></>
                    )}
                    <Icon
                        as={Feather}
                        size={6}
                        style={{ color: '#666', marginRight: 3, marginTop: 2 }}
                        name="shopping-cart"
                    />
                </View>
            </TouchableOpacity>
        </View>
    );
};

const DetailProductScreen = ({ navigation }: any) => {
    const route = useRoute();
    const [count, setCount] = React.useState(0);
    const [priceState, setPriceState] = React.useState(0);
    const addCart = useStore().userAPI.addCart;
    const [cart, setCart] = useStore().userAPI.cart;

    React.useLayoutEffect(() => {
        // setHiddenTaBbar(true);
        setPriceState(0);
        setCount(0);
    }, [route]);
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <TopBar cart={cart} navi={navigation} route={route} />
            <ScrollView>
                <Flex direction="column" style={{ flex: 1 }}>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        {/* <View
                            style={{
                                backgroundColor: '#ccc',
                                width: windowWidth,
                                flexDirection: 'row',
                                justifyContent: 'center',
                            }}
                        > */}
                        <Image
                            style={{
                                height: 240,
                                width: windowWidth,
                                resizeMode: 'cover',
                                borderRadius: 4,
                            }}
                            source={{ uri: route.params.product.image }}
                            alt={route.params.product.title}
                        />
                        {/* </View> */}
                        <View px="8">
                            <HStack mb="2" space={2.5} style={{ width: windowWidth }} justifyContent="flex-start">
                                <View bg="tertiary.800" mt="3" rounded="md" p="2">
                                    <Text
                                        style={{
                                            color: 'white',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {route.params.product.category.name}
                                    </Text>
                                </View>
                                {route.params.product.discount > 0 ? (
                                    <View bg="danger.600" mt="3" rounded="md" p="2">
                                        <Text
                                            style={{
                                                color: 'white',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            -{route.params.product.discount}%
                                        </Text>
                                    </View>
                                ) : (
                                    <></>
                                )}
                            </HStack>
                            <HStack>
                                <Text
                                    style={{
                                        color: '#065f46',
                                        fontSize: 24,
                                        fontWeight: '500',
                                    }}
                                    pt="4"
                                >
                                    {numberWithCommas(Number(route.params.product.price))}đ
                                    {route.params.product.price_text}
                                </Text>
                                {route.params.product.discount > 0 ? (
                                    <Text
                                        style={{
                                            color: '#065f46',
                                            fontSize: 18,
                                            opacity: 0.8,
                                            fontWeight: '500',
                                        }}
                                        pl="3"
                                        pt="4"
                                        strikeThrough
                                    >
                                        {numberWithCommas(Number(route.params.product.price_old))}đ/
                                        {route.params.product.price_text}
                                    </Text>
                                ) : (
                                    <></>
                                )}
                            </HStack>
                            <HStack mt="3" alignItems="center" justifyContent="space-between">
                                <Text fontSize="lg">Chi tiết sản phẩm</Text>
                                <Button size="md" px="4" rounded="full" bg="emerald.400">
                                    Bình luận
                                </Button>
                            </HStack>
                            <Divider my="2" bg="#333" thickness="1" />
                            <HStack mt="2" justifyContent="space-between">
                                <Text fontSize="md">Đã bán</Text>
                                <Text fontSize="md">{route.params.product.sold}</Text>
                            </HStack>
                            <Divider my="2" bg="#ccc" thickness="1.5" />
                            <HStack mt="2" justifyContent="space-between" alignItems="flex-start">
                                <Text fontSize="md">Đánh giá</Text>
                                <Rating
                                    style={{ marginTop: 4 }}
                                    showReadOnlyText
                                    type="star"
                                    ratingCount={5}
                                    imageSize={16}
                                    startingValue={
                                        Number(
                                            (
                                                route?.params?.product?.rating / route?.params?.product?.numReviewers
                                            ).toFixed(1)
                                        )
                                            ? Number(
                                                  (
                                                      route?.params?.product?.rating /
                                                      route?.params?.product?.numReviewers
                                                  ).toFixed(1)
                                              )
                                            : 0
                                    }
                                />
                            </HStack>
                            <Divider my="2" bg="#ccc" thickness="1.5" />
                            <Text mt="1">{route.params.product.description}</Text>
                            <Divider my="2" bg="#ccc" thickness="1.5" />
                        </View>
                    </View>
                </Flex>
                <HStack justifyContent="space-between" my="2" mx="5">
                    <View>
                        <Text color="#777" fontSize="md" mb="1">
                            Đã chọn {count} sản phẩm
                        </Text>
                        <HStack alignItems="center">
                            <TouchableOpacity
                                disabled={count === 0}
                                onPress={() => {
                                    setCount((count) => count - 1);
                                    setPriceState((count - 1) * route.params.product.price);
                                }}
                            >
                                <AntDesign name="minussquareo" size={24} color={count === 0 ? '#ccc' : 'black'} />
                            </TouchableOpacity>
                            <Text fontSize="xl" mx="6">
                                {count}
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setCount((count) => {
                                        setPriceState((count + 1) * route.params.product.price);
                                        return count + 1;
                                    });
                                }}
                            >
                                <AntDesign name="plussquareo" size={24} color="black" />
                            </TouchableOpacity>
                        </HStack>
                    </View>
                    <View>
                        <Text textAlign="right" color="#777" mb="1">
                            Tạm tính
                        </Text>
                        <Text fontWeight="bold" color="#444" fontSize="xl">
                            {numberWithCommas(priceState)}đ
                        </Text>
                    </View>
                </HStack>
                <Button
                    mx="5"
                    h="12"
                    size="lg"
                    p="2"
                    bg={count === 0 ? '#ccc' : 'tertiary.700'}
                    mb="4"
                    m="1"
                    disabled={count === 0}
                    onPress={async () => {
                        addCart(route.params.product, count);
                        navigation.navigate('Cart');
                    }}
                >
                    CHỌN MUA
                </Button>
            </ScrollView>
        </View>
    );
};

export default DetailProductScreen;
