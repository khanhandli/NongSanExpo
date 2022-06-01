import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import {
    Actionsheet,
    Box,
    Button,
    Checkbox,
    Flex,
    HStack,
    Icon,
    Image,
    ScrollView,
    Text,
    useDisclose,
    View,
    VStack,
} from 'native-base';
import React from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import NHCSafeAreaView from '../../components/NHCSafeAreaView';
import { useStore } from '../../hooks/useStore';
import { numberWithCommas } from '../../ultils/common';

const TopBar = ({ route }: any) => {
    const navigate = useNavigation();
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
                    // setHiddenTaBbar(false);
                    navigate.goBack();
                }}
            >
                <MaterialIcons name="arrow-back-ios" size={18} color="black" />
            </TouchableOpacity>
            <Text style={{ textTransform: 'uppercase', fontSize: 18 }}>GIỎ HÀNG</Text>

            <View></View>
        </View>
    );
};

const CartScreen = ({ navigation: { navigate } }: any) => {
    const [cart, setCart] = useStore().userAPI.cart;
    const [token, setToken] = useStore().token;
    const [count, setCount] = React.useState(0);
    const [id, setID] = React.useState('');

    const { isOpen, onOpen, onClose } = useDisclose();

    const route = useNavigation();

    const addToCart = async (cart: any) => {
        try {
            await axios.patch(
                'https://nongsan-app.herokuapp.com/api/addcart',
                { cart },
                {
                    headers: { Authorization: token?.token },
                }
            );
        } catch (error: any) {
            console.log('🚀 ~ file: CartScreen.tsx ~ line 60 ~ addToCart ~ error', error.response);
        }
    };

    const increment = (id: string) => {
        cart.forEach((item: any) => {
            if (item._id === id) {
                item.quantity += 1;
            }
        });

        setCart([...cart]);
        addToCart(cart);
    };

    const decrement = (id: string) => {
        cart.forEach((item: any) => {
            if (item._id === id) {
                item.quantity === 1 ? (item.quantity = 1) : (item.quantity -= 1);
            }
        });

        setCart([...cart]);
        addToCart(cart);
    };

    const removeProduct = (id: string) => {
        cart.forEach((item: any, index: any) => {
            if (item._id === id) {
                cart.splice(index, 1);
            }
        });

        setCart([...cart]);
        addToCart(cart);
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <TopBar route={route} />
                {cart.length > 0 ? (
                    <>
                        <ScrollView>
                            {cart.map((item: any, index: any) => {
                                return (
                                    <View key={index} px="6" flexDirection="row" mb="4" alignItems="center">
                                        <Checkbox value="test" accessibilityLabel="This is a dummy checkbox" />
                                        <Image
                                            ml="6"
                                            alt={item.title}
                                            mr="4"
                                            source={{ uri: item.image }}
                                            rounded="10"
                                            w="90"
                                            h="80"
                                            style={{ resizeMode: 'cover', maxWidth: 90, maxHeight: 80 }}
                                        />
                                        <VStack justifyContent="center" flex="1">
                                            <Text fontSize="16" fontWeight="bold">
                                                {item.title}
                                            </Text>
                                            <HStack mb="2" alignItems="center">
                                                <Text color="tertiary.700" mr="2" fontWeight="bold">
                                                    {numberWithCommas(item.price)}đ
                                                </Text>
                                                {item.discount > 0 && (
                                                    <Text fontSize="xs" strikeThrough>
                                                        {numberWithCommas(item.price_old)}đ
                                                    </Text>
                                                )}
                                            </HStack>
                                            <HStack alignItems="center">
                                                <TouchableOpacity
                                                    disabled={item.quantity == 1}
                                                    onPress={() => {
                                                        decrement(item._id);
                                                    }}
                                                >
                                                    <AntDesign
                                                        name="minussquareo"
                                                        size={20}
                                                        color={item.quantity === 1 ? '#ccc' : 'black'}
                                                    />
                                                </TouchableOpacity>
                                                <Text fontSize="lg" mx="6">
                                                    {item.quantity}
                                                </Text>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        increment(item._id);
                                                    }}
                                                >
                                                    <AntDesign name="plussquareo" size={20} color="black" />
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    onPress={() => {
                                                        onOpen();
                                                        setID(item._id);
                                                        // removeProduct(item._id);
                                                    }}
                                                >
                                                    <Text py="1" ml="4" fontSize="md" underline>
                                                        Xóa
                                                    </Text>
                                                </TouchableOpacity>
                                            </HStack>
                                        </VStack>
                                    </View>
                                );
                            })}
                        </ScrollView>
                        <View>
                            <Flex py="2" pt="2" flexDirection="row" px="6" justifyContent="space-between">
                                <Text>Tạm tính</Text>
                                <Text fontWeight="bold">
                                    {numberWithCommas(
                                        cart.reduce((total: any, item: any) => {
                                            return total + item.price * item.quantity;
                                        }, 0)
                                    )}
                                    đ
                                </Text>
                            </Flex>
                            <TouchableOpacity onPress={() => navigate('Order')}>
                                <Button
                                    mb="3"
                                    h="12"
                                    size="lg"
                                    p="2"
                                    mx="6"
                                    bg="tertiary.700"
                                    m="1"
                                    disabled={count === 0}
                                >
                                    <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
                                        <Text color="white" fontSize="lg" mr="16">
                                            Tiến hành thanh toán
                                        </Text>
                                        <AntDesign name="right" size={20} color="white" />
                                    </Flex>
                                </Button>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <View>
                        <Text textAlign="center" fontSize="md">
                            Giỏ hàng của bạn hiện tại đang trống
                        </Text>
                    </View>
                )}
            </View>
            <Actionsheet isOpen={isOpen} onClose={onClose}>
                <Actionsheet.Content>
                    <Text fontSize="16" color="black" mb="2">
                        Xác nhận xóa đơn hàng?
                    </Text>
                    <Text
                        fontSize="14"
                        color="gray.500"
                        _dark={{
                            color: 'gray.300',
                        }}
                    >
                        Thao tác này sẽ không thể khôi phục
                    </Text>
                    <View w="full">
                        <TouchableOpacity
                            onPress={() => {
                                removeProduct(id);
                                onClose();
                            }}
                        >
                            <Button h="12" size="lg" p="2" bg="tertiary.700" mb="1" mt="6" m="1" disabled={count === 0}>
                                Đồng ý
                            </Button>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={() => onClose()}>
                        <Text fontSize="md" py="2" mb="4" underline textAlign="center">
                            Hủy bỏ
                        </Text>
                    </TouchableOpacity>
                </Actionsheet.Content>
            </Actionsheet>
        </View>
    );
};

export default CartScreen;
