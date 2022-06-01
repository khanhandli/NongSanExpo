import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Badge, Center, FlatList, Flex, HStack, Icon, Image, ScrollView, Spinner, Text, View } from 'native-base';
import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { Rating } from 'react-native-ratings';
import NHCSafeAreaView from '../../components/NHCSafeAreaView';
import { useStore } from '../../hooks/useStore';
import { numberWithCommas } from '../../ultils/common';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const filter = [
    { name: 'Mới nhất', value: '0' },
    { name: 'Cũ nhất', value: '1' },
    { name: 'Bán chạy nhất', value: '2' },
    { name: 'Cao - Thấp', value: '3' },
    { name: 'Thấp - Cao', value: '4' },
];

const TopBar = ({ route, cart }: any) => {
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
            <Text style={{ textTransform: 'uppercase', fontSize: 18 }}>Sản phẩm khuyến mại</Text>
            <TouchableOpacity
                onPress={async () => {
                    // navigate('Auth
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

const PromotionScreen = ({ navigation: { navigate }, route }: any) => {
    const [isFilter, setIsFilter] = React.useState('0');
    const [loading, setLoading] = React.useState(false);
    const [product, setProduct] = useStore().productsAPI.products;
    const [productByDiscount, setProductByDiscount] = React.useState([]);
    const [cart, setCart] = useStore().userAPI.cart;

    React.useLayoutEffect(() => {
        setProductByDiscount(
            product.filter((item: any) => item.discount).sort((a: any, b: any) => a.createdAt - b.createdAt)
        );
    }, [route]);

    const handleSelect = (value: any) => {
        if (!productByDiscount && !productByDiscount?.length > 0) return;
        setLoading(true);
        switch (value) {
            case '0':
                setIsFilter('0');
                const sort = productByDiscount.sort((a, b) => new Date(b?.createdAt) - new Date(a.createdAt));

                setProductByDiscount(sort);
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
                break;
            case '1':
                setIsFilter('1');
                const sort1 = productByDiscount.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

                setProductByDiscount(sort1);
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
                break;
            case '2':
                setIsFilter('2');
                const sort2 = productByDiscount.sort((a, b) => b.sold - a.sold);

                setProductByDiscount(sort2);
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
                break;
            case '3':
                setIsFilter('3');
                const sort3 = productByDiscount.sort((a, b) => b.price - a.price);

                setProductByDiscount(sort3);
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
                break;
            case '4':
                setIsFilter('4');
                const sort4 = productByDiscount.sort((a, b) => a.price - b.price);

                setProductByDiscount(sort4);
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
                break;
            default:
                break;
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <TopBar cart={cart} route={route} />
            {loading ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <HStack space={8} justifyContent="center">
                        <Spinner color="cyan.500" size="lg" />
                    </HStack>
                </View>
            ) : (
                <View>
                    <FlatList
                        style={{ paddingBottom: 10 }}
                        mx="2"
                        data={filter}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleSelect(item.value)}>
                                <Center
                                    bg={isFilter === item.value ? 'primary.300' : false}
                                    mx="1"
                                    p="2"
                                    px="3"
                                    rounded="6"
                                >
                                    {item.name}
                                </Center>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item.name}
                    />

                    <ScrollView>
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                borderRadius: 20,
                                justifyContent: 'center',
                                paddingBottom: 110,
                            }}
                        >
                            {productByDiscount &&
                                productByDiscount.length > 0 &&
                                productByDiscount.map((product, index) => {
                                    return (
                                        <TouchableOpacity
                                            style={{
                                                width: windowWidth / 2 - 30,
                                                borderRadius: 10,
                                                margin: 10,
                                                position: 'relative',
                                            }}
                                            onPress={() => navigate('DetailProduct', { product, isSearch: false })}
                                            key={index + Math.random()}
                                        >
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'center',
                                                    backgroundColor: 'white',
                                                    shadowColor: '#333',
                                                    shadowOffset: {
                                                        width: 0,
                                                        height: 1,
                                                    },
                                                    shadowOpacity: 0.1,
                                                    shadowRadius: 2.22,
                                                    padding: 10,

                                                    elevation: 2,
                                                    borderRadius: 10,
                                                }}
                                            >
                                                <Image
                                                    alt="item"
                                                    source={{ uri: product.image }}
                                                    style={{
                                                        height: 120,
                                                        width: windowWidth / 2 - 60,
                                                        resizeMode: 'cover',
                                                        borderRadius: 12,
                                                    }}
                                                />
                                            </View>
                                            <View style={styles.infoProduct}>
                                                <Text style={styles.title} numberOfLines={2}>
                                                    {product.title}
                                                </Text>
                                                <Flex
                                                    mt="1"
                                                    direction="row"
                                                    alignItems="center"
                                                    justify="space-between"
                                                >
                                                    <Flex direction="row" alignItems="center">
                                                        <Text
                                                            style={{
                                                                fontWeight: 'bold',
                                                                color: '#333',
                                                                fontSize: 13,
                                                            }}
                                                        >
                                                            {numberWithCommas(Number(product.price))}đ
                                                        </Text>
                                                        <Text style={{ fontSize: 10 }}>{product.price_text}</Text>
                                                    </Flex>

                                                    {Number((product.rating / product.numReviewers).toFixed(1)) ? (
                                                        <Rating
                                                            showReadOnlyText
                                                            type="star"
                                                            ratingCount={5}
                                                            imageSize={12}
                                                            startingValue={Number(
                                                                (product.rating / product.numReviewers).toFixed(1)
                                                            )}
                                                            //   onFinishRating={this.ratingCompleted}
                                                        />
                                                    ) : (
                                                        <></>
                                                    )}
                                                </Flex>
                                                {product?.discount ? (
                                                    <Flex direction="row" alignItems="center">
                                                        <Text
                                                            style={{
                                                                fontWeight: 'bold',
                                                                color: '#ccc',
                                                                fontSize: 12,
                                                                textDecorationLine: 'line-through',
                                                            }}
                                                        >
                                                            {numberWithCommas(Number(product.price_old))}đ
                                                        </Text>
                                                        <Text
                                                            style={{
                                                                fontSize: 9,
                                                                textDecorationLine: 'line-through',
                                                                color: '#ccc',
                                                            }}
                                                        >
                                                            {product.price_text}
                                                        </Text>
                                                    </Flex>
                                                ) : (
                                                    <></>
                                                )}
                                            </View>
                                            {product?.discount ? (
                                                <View style={styles.discount}>
                                                    <Text style={{ fontSize: 10, color: 'white' }}>
                                                        -{product.discount}%
                                                    </Text>
                                                </View>
                                            ) : (
                                                <></>
                                            )}
                                        </TouchableOpacity>
                                    );
                                })}
                        </View>
                    </ScrollView>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
    title: {
        fontSize: 14.5,
        fontWeight: 'bold',
        color: '#333',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    containerBanner: {
        height: 245,
        position: 'relative',
        backgroundColor: '#F6F6F6',
    },
    tinyLogo: {
        width: windowWidth,
        height: 205,
        resizeMode: 'cover',
        position: 'absolute',
        bottom: 0,
    },
    boxBanner: {
        position: 'absolute',
        top: 20,
        backgroundColor: 'transparent',
        width: windowWidth,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
    },
    textBanner: {
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 22,
        lineHeight: 37,
        paddingTop: 26,
        color: '#221F1F',
        width: windowWidth - 140,
    },
    btnCart: {
        padding: 10,
        borderRadius: 999,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 10,
    },
    infoProduct: {
        marginTop: 6,
    },
    discount: {
        padding: 4,
        position: 'absolute',
        top: 0,
        zIndex: 10,
        elevation: 10,
        backgroundColor: '#de2000',
        fontSize: 10,
        borderRadius: 4,
    },
});

export default PromotionScreen;
