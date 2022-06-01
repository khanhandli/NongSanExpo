import { AntDesign } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import moment from 'moment';
import { Button, Divider, Flex, ScrollView, Text, View } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import TopBar from '../../components/Layout/TopBar';
import { numberWithCommas } from '../../ultils/common';

const DetailOrderScreen = ({ navigation }: any) => {
    const route = useRoute();
    const order = route?.params?.order;
    const total = order.cart.reduce((tt: any, item: any) => {
        return tt + item.price * item.quantity;
    }, 0);
    return (
        <View px="6" style={{ flex: 1, backgroundColor: 'white' }}>
            <TopBar isBack title="CHI TIẾT GIAO DỊCH" />
            <View my="5">
                <Text textAlign="center" fontSize="15" color={!(order?.status === '0') ? `green.400` : 'red.400'}>
                    {!(order?.status === '0') ? 'Bạn đã đặt hàng thành công' : 'Đã hủy đơn hàng'}
                </Text>
                <Text textAlign="center" fontSize="15" color={!(order?.status === '0') ? `green.400` : 'red.400'}>
                    {moment(order?.createdAt).format('DD/MM/YYYY')}
                </Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text fontSize="lg" fontWeight="bold">
                    Thông tin khách hàng
                </Text>
                <Divider bg="#000" mt="1" />
                <Text fontSize="16" mt="3" color="#888">
                    {order.name}
                </Text>
                <Text fontSize="16" mt="3" color="#888">
                    {order.email}
                </Text>
                <Text fontSize="16" mt="3" color="#888">
                    {order.address}
                </Text>
                <Text fontSize="16" mt="3" color="#888">
                    {order.phone}
                </Text>
                <Text mt="5" fontSize="lg" fontWeight="bold">
                    Phương thức vận chuyển
                </Text>
                <Divider bg="#000" h=".5" mt="1" mb="4" />
                {order?.ship == '1' ? (
                    <Flex flexDirection="row" mb="4" alignItems="center" justifyContent="space-between">
                        <View>
                            <Text fontSize="md" fontWeight="500">
                                Giao hàng nhanh - 15.000đ
                            </Text>
                            <Text fontSize="sm" color="#888">
                                Dự kiến giao hàng 3-5 ngày
                            </Text>
                        </View>
                        <AntDesign name="check" size={24} />
                    </Flex>
                ) : (
                    <Flex flexDirection="row" mb="4" alignItems="center" justifyContent="space-between">
                        <View>
                            <Text fontSize="md" fontWeight="500">
                                Giao hàng COD - 20.000đ
                            </Text>
                            <Text fontSize="sm" color="#888">
                                Dự kiến giao hàng 2-4 ngày
                            </Text>
                        </View>
                        <AntDesign name="check" size={24} />
                    </Flex>
                )}
                <Text mt="3" fontSize="lg" fontWeight="bold">
                    Hình thức thanh toán
                </Text>
                <Divider bg="#000" h=".5" mt="1" mb="2" />
                <Flex flexDirection="row" alignItems="center" mb="4" justifyContent="space-between">
                    <View>
                        <Text fontSize="md" fontWeight="500">
                            {order.type === 'payment' ? 'Paypal' : 'Thanh toán khi nhận hàng'}
                        </Text>
                    </View>
                    <AntDesign name="check" size={24} />
                </Flex>
            </ScrollView>
            <View pt="4">
                <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
                    <Text fontSize="lg" color="#888">
                        Tổng tiền
                    </Text>
                    <Text fontSize="lg" fontWeight="bold" color="#059669">
                        {numberWithCommas(total)}đ
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
                        // onPress={handleCheckout}
                        // disabled={count === 0}
                    >
                        TIẾP TỤC
                    </Button>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Root')}>
                    <Text underline fontSize="lg" textAlign="center" mb="5" mt="1">
                        Quay về trang chủ
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default DetailOrderScreen;
