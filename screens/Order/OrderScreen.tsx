import { Box, Button, Divider, Flex, Input, KeyboardAvoidingView, Text, Toast, useToast, View } from 'native-base';
import { WebView } from 'react-native-webview';
import { ActivityIndicator, Modal } from 'react-native';
import React from 'react';
import NHCSafeAreaView from '../../components/NHCSafeAreaView';
import TopBar from '../../components/Layout/TopBar';
import { Keyboard, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { useStore } from '../../hooks/useStore';
import { AntDesign } from '@expo/vector-icons';
import { numberWithCommas } from '../../ultils/common';
import { postDataAPI } from '../../api/FetchApi';
import axios from 'axios';

const initialState = {
    address: '',
    phone: '',
};

const OrderScreen = ({ navigation: { navigate } }) => {
    const toast = useToast();

    const [userr, setUserr] = useStore().userAPI.userr;
    const [shipping, setShipping] = React.useState('1');
    const [typePayment, setTypePayment] = React.useState('1');
    const [cart, setCart] = useStore().userAPI.cart;
    const addCart = useStore().userAPI.addCart;

    const [callback, setCallback] = useStore().callback;

    const [token, setToken] = useStore().token;
    const [loading, setLoading] = React.useState(false);

    const total = cart.reduce((tt: any, item: any) => {
        return tt + item.price * item.quantity;
    }, 0);
    const [openCheckoutPaypal, setOpenCheckoutPaypal] = React.useState(false);

    const [infoCustomer, setInfoCustomer] = React.useState(initialState);

    const handleCheckout = async () => {
        if (!infoCustomer.address || !infoCustomer.phone) {
            alert('Vui lòng nhập đầy đủ thông tin');
            return;
        }
        if (typePayment === '1') {
            setOpenCheckoutPaypal(true);
        } else {
            setLoading(true);
            const res = await axios.post(
                'https://nongsan-app.herokuapp.com/api/payment',
                {
                    user: userr._id,
                    cart,
                    name: userr.username,
                    address: infoCustomer.address,
                    phone: infoCustomer.phone,
                    priceCheckout: total,
                },
                {
                    headers: { Authorization: token.token },
                }
            );
            if (res.status === 200) {
                const res2 = await axios.patch(
                    'https://nongsan-app.herokuapp.com/api/addcart',
                    { cart: [] },
                    {
                        headers: { Authorization: token.token },
                    }
                );
                setCart([]);
                if (res2.status === 200) {
                    const res3 = await axios.post('https://nongsan-app.herokuapp.com/api/noti', {
                        title: `${userr.username} đã đặt hàng thành công!`,
                        user: userr._id,
                    });
                    if (res3.status === 200) {
                        toast.show({
                            title: 'Đặt hàng thành công',
                            status: 'success',
                            description: 'Cảm ơn bạn đã sử dụng dịch vụ',
                            placement: 'top',
                        });
                        setCallback(!callback);
                        navigate('TabOne');
                        setLoading(false);
                    }
                }
            }
        }
    };
    let i = 0;
    const handleResponse = async (data: any) => {
        if (data.title === 'success' && !data.loading) {
            if (i == 0) {
                i++;

                try {
                    const res = await axios.post(
                        'https://nongsan-app.herokuapp.com/api/payment',
                        {
                            user: userr._id,
                            name: userr.username,
                            phone: infoCustomer.phone,
                            // email: userr.email,
                            address: infoCustomer.address,
                            cart: cart,
                            priceCheckout: total,
                            type: 'payment',
                        },
                        {
                            headers: { Authorization: token.token },
                        }
                    );
                    if (res.status == 200) {
                        toast.show({
                            title: 'Thanh toán và đặt hàng thành công',
                            status: 'success',
                            description: 'Cảm ơn bạn đã sử dụng dịch vụ',
                            placement: 'top',
                        });
                        const res2 = await axios.patch(
                            'https://nongsan-app.herokuapp.com/api/addcart',
                            { cart: [] },
                            {
                                headers: { Authorization: token.token },
                            }
                        );
                        setCart([]);
                        if (res2.status === 200) {
                            const res3 = await axios.post('https://nongsan-app.herokuapp.com/api/noti', {
                                title: `${userr.username} đã đặt hàng thành công!`,
                                user: userr._id,
                            });
                            if (res3.status === 200) {
                                setCallback(!callback);
                                navigate('TabOne');
                            }
                        }
                    } else {
                        alert('Có lỗi xảy ra');
                    }
                    setOpenCheckoutPaypal(false);
                } catch (error: any) {
                    console.log('🚀 ~ file: OrderScreen.tsx ~ line 77 ~ handleResponse ~ error', error.response);
                    alert('Có lỗi xảy ra');
                }
            } else {
                return;
            }
        } else if (data.title === 'cancel') {
            setOpenCheckoutPaypal(false);
        } else {
            return;
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <KeyboardAvoidingView style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={{ flex: 1, backgroundColor: 'white' }} px="6">
                    <TopBar title="THANH TOÁN" isBack />
                    {loading ? (
                        <ActivityIndicator size="large" color="blue" style={{ marginLeft: 8 }} />
                    ) : (
                        <>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <Text fontSize="lg" fontWeight="bold">
                                    Thông tin khách hàng
                                </Text>
                                <Divider bg="#000" mt="1" />
                                <Input variant="underlined" fontSize="16" value={userr.username} editable={false} />
                                <Input variant="underlined" fontSize="16" value={userr.email} editable={false} />
                                <Input
                                    value={infoCustomer.address}
                                    variant="underlined"
                                    fontSize="16"
                                    placeholder="Địa chỉ"
                                    onChangeText={(text) => setInfoCustomer({ ...infoCustomer, address: text })}
                                />
                                <Input
                                    value={infoCustomer.phone}
                                    variant="underlined"
                                    fontSize="16"
                                    placeholder="Số điện thoại"
                                    keyboardType="numeric"
                                    onChangeText={(text) => setInfoCustomer({ ...infoCustomer, phone: text })}
                                />
                                <Text mt="5" fontSize="lg" fontWeight="bold">
                                    Phương thức vận chuyển
                                </Text>
                                <Divider bg="#000" h=".5" mt="1" mb="4" />
                                <TouchableOpacity onPress={() => setShipping('1')}>
                                    <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
                                        <View>
                                            <Text
                                                fontSize="md"
                                                fontWeight="500"
                                                color={shipping === '1' ? '#059669' : 'black'}
                                            >
                                                Giao hàng nhanh - 15.000đ
                                            </Text>
                                            <Text fontSize="sm" color="#888">
                                                Dự kiến giao hàng 3-5 ngày
                                            </Text>
                                        </View>
                                        <AntDesign
                                            name="check"
                                            size={24}
                                            color={shipping === '1' ? '#059669' : 'black'}
                                        />
                                    </Flex>
                                    <Divider bg="#aaa" h=".5" mt="1" mb="4" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setShipping('2')}>
                                    <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
                                        <View>
                                            <Text
                                                fontSize="md"
                                                fontWeight="500"
                                                color={shipping === '2' ? '#059669' : 'black'}
                                            >
                                                Giao hàng COD - 20.000đ
                                            </Text>
                                            <Text fontSize="sm" color="#888">
                                                Dự kiến giao hàng 2-4 ngày
                                            </Text>
                                        </View>
                                        <AntDesign
                                            name="check"
                                            size={24}
                                            color={shipping === '2' ? '#059669' : 'black'}
                                        />
                                    </Flex>
                                    <Divider bg="#aaa" h=".5" mt="1.5" mb="2" />
                                </TouchableOpacity>
                                <Text mt="3" fontSize="lg" fontWeight="bold">
                                    Hình thức thanh toán
                                </Text>
                                <Divider bg="#000" h=".5" mt="1" mb="2" />
                                <TouchableOpacity onPress={() => setTypePayment('1')}>
                                    <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
                                        <View>
                                            <Text
                                                fontSize="md"
                                                fontWeight="500"
                                                color={typePayment === '1' ? '#059669' : 'black'}
                                            >
                                                Paypal
                                            </Text>
                                        </View>
                                        <AntDesign
                                            name="check"
                                            size={24}
                                            color={typePayment === '1' ? '#059669' : 'black'}
                                        />
                                    </Flex>
                                    <Divider bg="#aaa" h=".5" mt="1.5" mb="2" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setTypePayment('2')}>
                                    <Flex flexDirection="row" alignItems="center" mt="2" justifyContent="space-between">
                                        <View>
                                            <Text
                                                fontSize="md"
                                                fontWeight="500"
                                                color={typePayment === '2' ? '#059669' : 'black'}
                                            >
                                                Thanh toán khi nhận hàng
                                            </Text>
                                        </View>
                                        <AntDesign
                                            name="check"
                                            size={24}
                                            color={typePayment === '2' ? '#059669' : 'black'}
                                        />
                                    </Flex>
                                    <Divider bg="#aaa" h=".5" mt="1.5" mb="2" />
                                </TouchableOpacity>
                            </ScrollView>
                            <View pt="4">
                                <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
                                    <Text fontSize="sm" color="#888">
                                        Tạm tính
                                    </Text>
                                    <Text fontSize="md">{numberWithCommas(total)}đ</Text>
                                </Flex>
                                <Flex flexDirection="row" my="1" alignItems="center" justifyContent="space-between">
                                    <Text fontSize="sm" color="#888">
                                        Phí vận chuyển
                                    </Text>
                                    <Text fontSize="md">{shipping === '1' ? '15.000đ' : '20.000đ'}</Text>
                                </Flex>
                                <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
                                    <Text fontSize="lg" color="#888">
                                        Tổng cộng
                                    </Text>
                                    <Text fontSize="lg" fontWeight="bold" color="#059669">
                                        {numberWithCommas(total + (shipping === '1' ? 15000 : 20000))}đ
                                    </Text>
                                </Flex>
                                <TouchableOpacity>
                                    <Button
                                        mb="3"
                                        h="12"
                                        size="lg"
                                        p="2"
                                        bg="tertiary.700"
                                        mt="3"
                                        onPress={handleCheckout}
                                        // disabled={count === 0}
                                    >
                                        TIẾP TỤC
                                    </Button>
                                </TouchableOpacity>
                            </View>
                            <Modal
                                visible={openCheckoutPaypal}
                                onRequestClose={() => setOpenCheckoutPaypal(!openCheckoutPaypal)}
                            >
                                <WebView
                                    source={{ uri: 'https://nongsan-app.herokuapp.com' }}
                                    onNavigationStateChange={(data) => handleResponse(data)}
                                    injectedJavaScript={`setTimeout(function() {document.getElementById("price").value=${total};document.f1.submit()}, 100);`}
                                />
                            </Modal>
                        </>
                    )}
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

export default OrderScreen;
