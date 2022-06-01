import moment from 'moment';
import {
    Button,
    Flex,
    HStack,
    Image,
    ScrollView,
    Spinner,
    Text,
    Text as TextBase,
    View as ViewBase,
} from 'native-base';
import React from 'react';
import {
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    RefreshControl,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import TopBar from '../components/Layout/TopBar';
import { View } from '../components/Themed';
import { useStore } from '../hooks/useStore';
import { RootTabScreenProps } from '../types';

const windowWidth = Dimensions.get('window').width;
const wait = (timeout: any) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
};
export default function NotificationScreen({ navigation: { navigate } }: RootTabScreenProps<'TabThree'>) {
    const [isLooged] = useStore().userAPI.isLogged;
    const [loading, setLoading] = React.useState(false);

    const [noti, setNoti] = useStore().notifications;

    const [callback, setCallback] = useStore()?.callback;

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setCallback(!callback);
        setRefreshing(true);
        wait(50).then(() => setRefreshing(false));
    }, [callback]);
    const handlePressItem = (id: string) => {
        console.log('đén', id);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ViewBase px="6" bg="white">
                    <TopBar isBack title="THÔNG BÁO" />
                </ViewBase>
                {loading ? (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <HStack space={8} justifyContent="center">
                            <Spinner color="cyan.500" size="lg" />
                        </HStack>
                    </View>
                ) : (
                    <View style={{ ...styles.container, paddingBottom: 20 }}>
                        <ScrollView
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                            showsVerticalScrollIndicator={false}
                            style={{ flex: 1 }}
                        >
                            {!isLooged ? (
                                <Flex direction="row" mt="6" justifyContent="center" alignItems="center">
                                    <Button onPress={() => navigate('Auth')}> Đăng nhập</Button>
                                    <TextBase fontSize="md" ml="3">
                                        để xem thông báo!
                                    </TextBase>
                                </Flex>
                            ) : noti && noti.length > 0 ? (
                                noti.map((item: any, index: any) => (
                                    <View key={index}>
                                        <ViewBase mb="6" borderBottomWidth="1" borderBottomColor="#ccc">
                                            <TextBase fontSize="md">
                                                {moment(item.createdAt).format('HH:mm:ss YYYY-MM-DD')}
                                            </TextBase>
                                        </ViewBase>
                                        <TouchableOpacity
                                            key={item._id + Math.random()}
                                            onPress={() => handlePressItem(item?._id)}
                                        >
                                            <Flex mb="4" direction="row" alignItems="center">
                                                <Image
                                                    source={{ uri: item.imgProduct ?? item?.user.avatar }}
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
                                                </Flex>
                                            </Flex>
                                        </TouchableOpacity>
                                    </View>
                                ))
                            ) : (
                                <View>
                                    <Text>Chưa có thông báo !</Text>
                                </View>
                            )}
                        </ScrollView>
                    </View>
                )}
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
