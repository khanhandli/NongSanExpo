import { Badge, Box, Button, Flex, Icon, IconButton, ScrollView, Skeleton, Stack } from 'native-base';
import { FlatList, Image, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import axios from 'axios';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import NHCSafeAreaView from '../components/NHCSafeAreaView';
import { Dimensions } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { Rating } from 'react-native-ratings';
import { numberWithCommas } from '../ultils/common';
import { useStore } from '../hooks/useStore';
import PopoverComponent from '../components/Popover';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const wait = (timeout: any) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
};
export default function HomeScreen({ navigation: { navigate } }: RootTabScreenProps<'TabOne'>) {
    const [category, setCategory] = useStore().categoriesAPI.categories;
    const [product, setProduct] = useStore().productsAPI.products;
    const loadingProduct = useStore().productsAPI.loadingProduct;
    const [isLooged] = useStore().userAPI.isLogged;
    const [cart, setCart] = useStore().userAPI.cart;
    const [callback, setCallback] = useStore()?.productsAPI?.callback;

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        console.log('🚀 ~ file: HomeScreen.tsx ~ line 35 ~ onRefresh ~ callback', callback);
        setCallback(!callback);
        setRefreshing(true);
        wait(50).then(() => setRefreshing(false));
    }, [callback]);

    let checkProduct: any = [];

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <View style={styles.container}>
                    <View style={styles.containerBanner}>
                        <Image style={styles.tinyLogo} source={require('../assets/images/banner.png')} />
                        <View style={styles.boxBanner}>
                            <View style={{ backgroundColor: 'transparent' }}>
                                <Text style={styles.textBanner}>Agricultural - Cung cấp sản phẩm chất lượng</Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        navigate('Promotion');
                                    }}
                                >
                                    <View
                                        style={{
                                            marginTop: 10,
                                            backgroundColor: 'transparent',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text
                                            style={{
                                                marginRight: 8,
                                                color: '#007537',
                                                fontSize: 16,
                                                fontStyle: 'normal',
                                                fontWeight: '400',
                                            }}
                                        >
                                            Xem sản phẩm khuyến mại
                                        </Text>
                                        <AntDesign name="arrowright" size={22} color="#007537" />
                                    </View>
                                </TouchableOpacity>
                            </View>

                            {/* <TouchableOpacity onPress={() => !isLooged && navigate('Auth')}> */}
                            <TouchableOpacity
                                onPress={async () => {
                                    // await AsyncStorage.removeItem('firstLogin');
                                    navigate('Cart');
                                }}
                            >
                                <View style={styles.btnCart}>
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
                                        size={7}
                                        style={{ color: '#666', marginRight: 3, marginTop: 2 }}
                                        name="shopping-cart"
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flex: 1, paddingHorizontal: 10 }}>
                        {loadingProduct ? (
                            <View>
                                <Skeleton rounded="20" mt="8" h="5" w="3/6" />
                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                        borderRadius: 20,
                                    }}
                                >
                                    {[...new Array(4)].map((_, index) => (
                                        <View
                                            key={index}
                                            style={{
                                                width: windowWidth / 2 - 30,
                                                borderRadius: 10,
                                                margin: 10,
                                                position: 'relative',
                                            }}
                                        >
                                            <Skeleton rounded="10" mt="8" h="40" w={windowWidth / 2 - 30} />
                                            <Skeleton rounded="20" my="2" h="2" w={windowWidth / 2 - 50} />
                                            <Skeleton rounded="20" h="2" w={windowWidth / 2 - 50} />
                                        </View>
                                    ))}
                                </View>
                            </View>
                        ) : (
                            category &&
                            category.length > 0 &&
                            category.map((category: any, index: any) => (
                                <View key={index + category?._id + Math.random()}>
                                    <Text
                                        style={{
                                            fontStyle: 'normal',
                                            fontWeight: 'bold',
                                            fontSize: 21,
                                            lineHeight: 34,
                                            marginTop: 20,
                                            marginBottom: 8,
                                            color: '#333',
                                        }}
                                    >
                                        {category?.name}
                                    </Text>
                                    <View
                                        style={{
                                            flex: 1,
                                            flexDirection: 'row',
                                            flexWrap: 'wrap',
                                            borderRadius: 20,
                                        }}
                                    >
                                        {product &&
                                            product.length > 0 &&
                                            product.map((product: any, index: any) => {
                                                if (
                                                    product?.category?._id === category?._id &&
                                                    checkProduct.filter((x) => x == category?._id).length < 4
                                                ) {
                                                    checkProduct.push(category?._id);
                                                    return (
                                                        <TouchableOpacity
                                                            style={{
                                                                width: windowWidth / 2 - 30,
                                                                borderRadius: 10,
                                                                margin: 10,
                                                                position: 'relative',
                                                            }}
                                                            onPress={() => navigate('DetailProduct', { product })}
                                                            key={category?._id + index + Math.random()}
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
                                                                        <Text style={{ fontSize: 10 }}>
                                                                            {product.price_text}
                                                                        </Text>
                                                                    </Flex>

                                                                    {Number(
                                                                        (product.rating / product.numReviewers).toFixed(
                                                                            1
                                                                        )
                                                                    ) ? (
                                                                        <Rating
                                                                            showReadOnlyText
                                                                            type="star"
                                                                            ratingCount={5}
                                                                            imageSize={12}
                                                                            startingValue={Number(
                                                                                (
                                                                                    product.rating /
                                                                                    product.numReviewers
                                                                                ).toFixed(1)
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
                                                                            {numberWithCommas(
                                                                                Number(product.price_old)
                                                                            )}
                                                                            đ
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
                                                }
                                            })}
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => navigate('Category', { category })}
                                        style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                fontWeight: 'bold',
                                                marginRight: 6,
                                                marginTop: 10,
                                                borderBottomWidth: 1,
                                                borderBottomColor: '#666',
                                                paddingBottom: 1,
                                                color: '#666',
                                            }}
                                        >
                                            Xem thêm {category.name}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ))
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

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
        marginTop: 30,
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
