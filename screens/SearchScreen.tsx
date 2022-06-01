import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
    Button,
    Center,
    Flex,
    HStack,
    Image,
    Input,
    Spinner,
    Text as TextBase,
    View as ViewBase,
    VStack,
} from 'native-base';
import React from 'react';
import {
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import { deleteDataAPI, getDataAPI, postDataAPI } from '../api/FetchApi';
import TopBar from '../components/Layout/TopBar';
import NHCSafeAreaView from '../components/NHCSafeAreaView';
import { Text, View } from '../components/Themed';
import { useStore } from '../hooks/useStore';
import { RootTabScreenProps } from '../types';
import { numberWithCommas } from '../ultils/common';
function removeAccents(str) {
    var AccentsMap = [
        'aàảãáạăằẳẵắặâầẩẫấậ',
        'AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ',
        'dđ',
        'DĐ',
        'eèẻẽéẹêềểễếệ',
        'EÈẺẼÉẸÊỀỂỄẾỆ',
        'iìỉĩíị',
        'IÌỈĨÍỊ',
        'oòỏõóọôồổỗốộơờởỡớợ',
        'OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ',
        'uùủũúụưừửữứự',
        'UÙỦŨÚỤƯỪỬỮỨỰ',
        'yỳỷỹýỵ',
        'YỲỶỸÝỴ',
    ];
    for (var i = 0; i < AccentsMap.length; i++) {
        var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
        var char = AccentsMap[i][0];
        str = str.replace(re, char);
    }
    return str;
}

const windowWidth = Dimensions.get('window').width;

export default function SearchScreen({ navigation: { navigate } }: RootTabScreenProps<'TabTwo'>) {
    const [product, setProduct] = useStore().productsAPI.products;
    const [userr, setUserr] = useStore().userAPI.userr;
    const [token, setToken] = useStore().token;
    const [isLooged] = useStore().userAPI.isLogged;

    const [productSearch, setProductSearch] = React.useState([]);
    const typingTimeoutRef = React.useRef(null);
    const [historySearch, setHistorySearch] = React.useState([]);
    const [callback, setCallback] = React.useState(false);

    const [textSearch, setTextSearch] = React.useState<any>('');
    const [loading, setLoading] = React.useState(false);

    const handleSearch = (text) => {
        if (!isLooged) return navigate('Auth');
        if (!text) {
            setProductSearch([]);
            setTextSearch('');
            return;
        }

        setTextSearch(text);

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef!.current = setTimeout(async () => {
            setProductSearch(
                () =>
                    product &&
                    product.length > 0 &&
                    product.filter((pro) => {
                        return removeAccents(pro.title).toLowerCase().includes(removeAccents(text).toLowerCase());
                    })
            );
        }, 120);
    };

    React.useEffect(() => {
        if (!isLooged) return;
        (async () => {
            setLoading(true);
            const res = await getDataAPI('history_search?limit=8', token.token);
            setHistorySearch(res.data);
            setLoading(false);
        })();
    }, [callback]);

    const handlePressItem = async (item: any) => {
        navigate('DetailProduct', { product: item, isSearch: true });
        await postDataAPI('history_search', { user: userr._id, name: textSearch });
        setCallback(!callback);
    };

    const handleDeleteSearchHistory = async (id: string) => {
        setLoading(true);

        const res = await deleteDataAPI('history_search/' + id);
        if (res?.status === 200) {
            setCallback(!callback);
        }
        setLoading(false);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ViewBase px="6" bg="white">
                    <TopBar isBack title="TÌM KIẾM" />
                </ViewBase>
                <View style={styles.container}>
                    <ViewBase mb="12">
                        <Input
                            InputRightElement={
                                <TouchableOpacity
                                    onPress={() => textSearch && setTextSearch('')}
                                    hitSlop={{ top: 20, left: 20, right: 20, bottom: 20 }}
                                >
                                    <AntDesign
                                        name={textSearch ? 'close' : 'search1'}
                                        size={24}
                                        style={{ marginRight: 10 }}
                                        color="black"
                                    />
                                </TouchableOpacity>
                            }
                            size="lg"
                            variant="underlined"
                            placeholder="Nhập để tìm kiếm"
                            onChangeText={handleSearch}
                            value={textSearch}
                        />
                    </ViewBase>
                    {textSearch && productSearch ? (
                        productSearch.map((item, index) =>
                            index < 4 ? (
                                <TouchableOpacity key={item._id + Math.random()} onPress={() => handlePressItem(item)}>
                                    <Flex mb="4" direction="row" alignItems="center">
                                        <Image
                                            source={{ uri: item.image }}
                                            style={{
                                                height: 76,
                                                width: 76,
                                                resizeMode: 'cover',
                                                borderRadius: 12,
                                            }}
                                            alt={item.title}
                                        />
                                        <Flex w="5/6">
                                            <TextBase fontSize="md" ml="3">
                                                {item?.title}
                                            </TextBase>
                                            <Flex direction="row">
                                                <TextBase fontSize="sm" fontWeight="bold" ml="3">
                                                    {numberWithCommas(Number(item?.price))}đ{item.price_text}
                                                </TextBase>
                                                {item?.discount > 0 ? (
                                                    <TextBase
                                                        style={{
                                                            fontWeight: 'bold',
                                                            color: '#ccc',
                                                            fontSize: 13,
                                                            textDecorationLine: 'line-through',
                                                        }}
                                                        fontSize="md"
                                                        ml="3"
                                                    >
                                                        {numberWithCommas(Number(item?.price_old))}đ
                                                    </TextBase>
                                                ) : (
                                                    <></>
                                                )}
                                            </Flex>
                                            <TextBase fontSize="xs" ml="3">
                                                Đã bán: {item.sold}
                                            </TextBase>
                                        </Flex>
                                    </Flex>
                                </TouchableOpacity>
                            ) : (
                                <></>
                            )
                        )
                    ) : (
                        <View>
                            <View>
                                <TextBase fontSize="lg">Tìm kiếm gấn đây</TextBase>
                            </View>
                            {!isLooged ? (
                                <Flex direction="row" mt="6" alignItems="center">
                                    <Button onPress={() => navigate('Auth')}> Đăng nhập</Button>
                                    <TextBase fontSize="md" ml="3">
                                        để lưu lịch sử tìm kiếm!
                                    </TextBase>
                                </Flex>
                            ) : loading ? (
                                <View style={{ height: 300, alignItems: 'center', justifyContent: 'center' }}>
                                    <HStack space={8} justifyContent="center">
                                        <Spinner color="cyan.500" />
                                    </HStack>
                                </View>
                            ) : (
                                <VStack space={1} alignItems="center" mt="4">
                                    {historySearch && historySearch.length > 0 ? (
                                        historySearch.map((item, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                style={{ width: windowWidth - 90, height: 44 }}
                                                onPress={() => handleSearch(item.name)}
                                            >
                                                <Center>
                                                    <Flex
                                                        direction="row"
                                                        justify="space-between"
                                                        align="center"
                                                        w="full"
                                                    >
                                                        <Flex direction="row" justify="center" align="center">
                                                            <FontAwesome name="history" size={24} color="#ccc" />
                                                            <TextBase
                                                                fontSize="lg"
                                                                ml="3"
                                                                mb="1.5"
                                                                color="#444"
                                                                fontWeight="bold"
                                                            >
                                                                {item.name}
                                                            </TextBase>
                                                        </Flex>
                                                        <TouchableOpacity
                                                            onPress={() => handleDeleteSearchHistory(item._id)}
                                                        >
                                                            <AntDesign
                                                                name="close"
                                                                size={24}
                                                                style={{ marginRight: 10 }}
                                                                color="black"
                                                            />
                                                        </TouchableOpacity>
                                                    </Flex>
                                                </Center>
                                            </TouchableOpacity>
                                        ))
                                    ) : (
                                        <></>
                                    )}
                                </VStack>
                            )}
                        </View>
                    )}
                    {textSearch && !(productSearch.length > 0) ? (
                        <TextBase textAlign="center">Không tìm thấy sản phẩm</TextBase>
                    ) : (
                        <></>
                    )}
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 40,
    },
});
