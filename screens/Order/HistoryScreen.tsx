import axios from 'axios';
import moment from 'moment';
import {
    Center,
    FlatList,
    Flex,
    HStack,
    Image,
    KeyboardAvoidingView,
    ScrollView,
    Spinner,
    Text,
    View,
} from 'native-base';
import React from 'react';
import { Keyboard, Platform, RefreshControl, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import TopBar from '../../components/Layout/TopBar';
import { useStore } from '../../hooks/useStore';
import { numberWithCommas } from '../../ultils/common';

const wait = (timeout: any) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
};

const filter = [
    { name: 'Chờ duyệt', value: '1' },
    { name: 'Đã duyệt', value: '2' },
    { name: 'Hoàn thành', value: '3' },
    { name: 'Hủy', value: '0' },
];

const HistoryScreen = ({ navigation }: any) => {
    const [loading, setLoading] = React.useState(false);
    const [historyOrder, setHistoryOrder] = React.useState([]);
    const [token, setToken] = useStore().token;
    const [page, setPage] = React.useState(1);
    const [refreshing, setRefreshing] = React.useState(false);
    const [callback, setCallback] = React.useState(false);
    const [listFilter, setListFilter] = React.useState([]);

    const [isFilter, setIsFilter] = React.useState('1');

    React.useEffect(() => {
        (async () => {
            setLoading(true);
            const res = await axios.get('https://nongsan-app.herokuapp.com/api/history', {
                headers: { Authorization: token.token },
            });
            if (res.status === 200) {
                setHistoryOrder(res.data);
                setListFilter(res.data.filter((item) => item.status == '1'));
            }
            setLoading(false);
        })();
    }, [navigation, callback]);

    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }: any) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    };

    const handleSelect = (value: any) => {
        if (!historyOrder && !historyOrder?.length > 0) return;
        setLoading(true);
        switch (value) {
            case '0':
                setIsFilter('0');
                const fill = historyOrder.filter((item) => item.status == '0' || !item.status);

                setListFilter(fill);
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
                break;
            case '1':
                setIsFilter('1');
                const fill1 = historyOrder.filter((item) => item.status == '1');

                setListFilter(fill1);
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
                break;
            case '2':
                setIsFilter('2');
                const fill2 = historyOrder.filter((item) => item.status == '2');

                setListFilter(fill2);
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
                break;
            case '3':
                setIsFilter('3');
                const fill3 = historyOrder.filter((item) => item.status == '3');

                setListFilter(fill3);
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
                break;
            default:
                break;
        }
    };

    const onRefresh = React.useCallback(() => {
        setCallback(!callback);
        setRefreshing(true);
        wait(50).then(() => setRefreshing(false));
    }, [callback]);

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View px="6" bg="white">
                <TopBar isBack title="LỊCH SỬ GIAO DỊCH" />
            </View>
            {loading ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <HStack space={8} justifyContent="center">
                        <Spinner color="cyan.500" size="lg" />
                    </HStack>
                </View>
            ) : (
                <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 40, paddingBottom: 20 }}>
                    <FlatList
                        data={filter}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleSelect(item.value)}>
                                <Center bg={isFilter === item.value ? 'primary.300' : null} p="2" rounded="6">
                                    {item.name}
                                </Center>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item.name}
                        style={{ height: 60, flexGrow: 0 }}
                    />

                    <View style={{ flex: 1 }}>
                        <ScrollView
                            onScroll={({ nativeEvent }) => {
                                if (isCloseToBottom(nativeEvent)) {
                                    setPage(page + 1);
                                }
                            }}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                            scrollEventThrottle={14}
                            showsVerticalScrollIndicator={false}
                            style={{ flex: 1 }}
                        >
                            {listFilter && listFilter.length > 0 ? (
                                listFilter.map(
                                    (item: any, index: any) =>
                                        index < page * 5 && (
                                            <View key={index}>
                                                <View
                                                    mb="6"
                                                    borderBottomWidth="1"
                                                    flexDirection="row"
                                                    justifyContent="space-between"
                                                    borderBottomColor="#ccc"
                                                >
                                                    <Text fontSize="md">
                                                        {moment(item.createdAt).format('HH:mm:ss YYYY-MM-DD')}
                                                    </Text>
                                                    <Text>{numberWithCommas(item.priceCheckout)}đ</Text>
                                                </View>
                                                {item.cart &&
                                                    item.cart.length > 0 &&
                                                    item.cart.map((product: any, index: any) => (
                                                        <TouchableOpacity
                                                            key={index + Math.random()}
                                                            onPress={() =>
                                                                navigation.navigate('DetailOrder', { order: item })
                                                            }
                                                        >
                                                            <Flex mb="4" direction="row" alignItems="center">
                                                                <Image
                                                                    source={{ uri: product.image }}
                                                                    style={{
                                                                        height: 76,
                                                                        width: 76,
                                                                        resizeMode: 'cover',
                                                                        borderRadius: 12,
                                                                    }}
                                                                    alt={product.title}
                                                                />
                                                                <Flex w="5/6">
                                                                    <Text
                                                                        fontSize="md"
                                                                        ml="3"
                                                                        color={
                                                                            item.status == '0'
                                                                                ? 'red.500'
                                                                                : item.status == '1'
                                                                                ? 'yellow.500'
                                                                                : 'green.500'
                                                                        }
                                                                    >
                                                                        {item?.status == '2' && item?.type == 'payment'
                                                                            ? 'Đã thanh toán - Đang giao'
                                                                            : item?.status == '2'
                                                                            ? 'Chưa thanh toán - Đang giao'
                                                                            : item?.status == '1'
                                                                            ? 'Đơn hàng đang xử lý'
                                                                            : item?.status == '3'
                                                                            ? 'Đơn hàng đã giao'
                                                                            : 'Đã hủy đơn hàng'}
                                                                    </Text>
                                                                    <Text fontSize="md" ml="3">
                                                                        {product?.title}
                                                                    </Text>
                                                                    <Flex direction="row">
                                                                        <Text fontSize="sm" fontWeight="bold" ml="3">
                                                                            {numberWithCommas(Number(product?.price))}đ
                                                                            {product.price_text}
                                                                        </Text>
                                                                        {product?.discount > 0 ? (
                                                                            <Text
                                                                                style={{
                                                                                    fontWeight: 'bold',
                                                                                    color: '#ccc',
                                                                                    fontSize: 13,
                                                                                    textDecorationLine: 'line-through',
                                                                                }}
                                                                                fontSize="md"
                                                                                ml="3"
                                                                            >
                                                                                {numberWithCommas(
                                                                                    Number(product?.price_old)
                                                                                )}
                                                                                đ
                                                                            </Text>
                                                                        ) : (
                                                                            <></>
                                                                        )}
                                                                    </Flex>
                                                                    <Text fontSize="xs" ml="3">
                                                                        Số lượng: {product.quantity}
                                                                    </Text>
                                                                </Flex>
                                                            </Flex>
                                                        </TouchableOpacity>
                                                    ))}
                                            </View>
                                        )
                                )
                            ) : (
                                <View>
                                    <Text textAlign="center" fontSize="md" color="#888">
                                        Bạn chưa có lịch sử giao dịch nào!
                                    </Text>
                                </View>
                            )}
                        </ScrollView>
                    </View>
                </View>
            )}
        </View>
    );
};

export default HistoryScreen;
