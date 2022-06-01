import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    Box,
    Button,
    Flex,
    FormControl,
    HStack,
    Image,
    Input,
    Popover,
    ScrollView,
    Spinner,
    Text,
    Toast,
    View,
    WarningOutlineIcon,
} from 'native-base';
import React from 'react';
import { Dimensions, Keyboard, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { postDataAPI } from '../../api/FetchApi';
import { useStore } from '../../hooks/useStore';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const validateEmail = (email: string) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

const LoginScreen = ({ navigation: { navigate } }: any) => {
    const [userr, setUserr] = useStore().userAPI.userr;
    const [isLooged, setLooged] = useStore().userAPI.isLogged;
    const [isAdmin, setIsAdmin] = useStore().userAPI.isAdmin;
    const [token, setToken] = useStore().token;
    const loading = useStore().loading;

    const [email, setEmail] = React.useState('');
    const [valid, setValid] = React.useState(false);
    const [isLogin, setIslogin] = React.useState(false);
    const [isRegister, setIsRegister] = React.useState(false);
    const [openPop, setOpenPop] = React.useState(false);
    const [password, setPassword] = React.useState('');
    const [loadingAuth, setLoadingAuth] = React.useState(false);
    const [rePassword, setRePassword] = React.useState('');
    const [userName, setUsername] = React.useState('');

    const handleSubmit = async () => {
        const check = validateEmail(email);
        if (!check) {
            setValid(true);
            return;
        } else {
            setValid(false);
        }
        try {
            setLoadingAuth(true);

            const res = await postDataAPI('check_user', { email: email.trim().toLowerCase() });
            if (res?.status === 200) {
                Toast.show({
                    title: 'Tài khoản tồn tại',
                    status: 'success',
                    description: 'Nhập mật khẩu đề đăng nhập',
                    placement: 'top',
                });
                setIslogin(true);
                setLoadingAuth(false);
            }
        } catch (error: any) {
            Toast.show({
                title: 'Có lỗi xảy ra',
                status: 'danger',
                description: error?.response?.data?.msg,
                placement: 'top',
            });
            setIsRegister(true);
            setIslogin(false);
            setLoadingAuth(false);
        }
    };

    React.useEffect(() => {
        if (isLooged) {
            navigate('Root', 'TabOne');
        }
    }, [isLooged]);

    const handleSubmitLogin = async () => {
        setLoadingAuth(true);
        try {
            const res = await postDataAPI('login', { email: email.trim().toLowerCase(), password });
            if (res?.status === 200) {
                await AsyncStorage.setItem(
                    'firstLogin',
                    `{"token": "${res.data.access_token}", "user": "${res.data.user._id}"}`
                );
                Toast.show({
                    title: 'Tài khoản chính xác',
                    status: 'success',
                    description: 'Chúc bạn có 1 trải nghiệm tuyệt vời',
                    placement: 'top',
                });
                setToken({ token: res.data.access_token, user: res.data.user._id });
                setUserr(res.data);
                setLooged(true);
                setIsAdmin(res.data.user.role === 'admin');
                navigate('Root');
                // UserAPI(res.data.access_token, res.data.user._id);
            }
            setLoadingAuth(false);
        } catch (error) {
            Toast.show({
                title: 'Tài khoản chưa chính xác',
                status: 'danger',
                description: 'Nhập lại mật khẩu',
                placement: 'top',
            });
            setLoadingAuth(false);
        }
    };

    const handleSubmitRegister = async () => {
        if (!password || !rePassword) {
            Toast.show({
                title: 'Vui lòng nhập mật khẩu',
                status: 'danger',
                description: 'Nhập lại mật khẩu',
                placement: 'top',
            });
            return;
        }
        if (password !== rePassword) {
            Toast.show({
                title: 'Mật khẩu không khớp',
                status: 'danger',
                description: 'Nhập lại mật khẩu',
                placement: 'top',
            });
            return;
        }
        setLoadingAuth(true);
        try {
            const res = await postDataAPI('register', {
                email: email.trim().toLowerCase(),
                username: userName.trim(),
                password,
            });
            if (res?.status === 200) {
                Toast.show({
                    title: 'Đăng ký thành công',
                    status: 'success',
                    description: 'Đăng nhập ngay',
                    placement: 'top',
                });
                setIsRegister(false);
                setLoadingAuth(false);
            }
        } catch (error: any) {
            Toast.show({
                title: 'Đăng ký thất bại',
                status: 'danger',
                description: error.response.data.msg,
                placement: 'top',
            });
            setLoadingAuth(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                {/* <KeyboardAvoidingView
                h={{
                    base: '800px',
                }}
                style={{ backgroundColor: 'white' }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            > */}
                {loading ? (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <HStack space={8} justifyContent="center">
                            <Spinner color="cyan.500" size="lg" />
                        </HStack>
                    </View>
                ) : (
                    <ScrollView>
                        <View style={{ ...styles.container }}>
                            <Image
                                alt="banner login"
                                source={require('../../assets/images/bannerlogin.png')}
                                style={{
                                    height: windowHeight / 2 - 60,
                                    width: windowWidth,
                                    resizeMode: 'cover',
                                }}
                            />
                            <Text textAlign="center" fontSize="4xl" fontWeight="bold" my="3" color="#007537">
                                Agricultural
                            </Text>
                            <Text textAlign="center" w="5/6">
                                Mua sắm và trải nghiệm sản phẩm nông sản chất lượng cùng gia vị độc đáo duy nhất tại
                                Việt Nam
                            </Text>
                            {loadingAuth ? (
                                <View style={{ height: 300, alignItems: 'center', justifyContent: 'center' }}>
                                    <HStack space={8} justifyContent="center">
                                        <Spinner color="cyan.500" />
                                    </HStack>
                                </View>
                            ) : (
                                <>
                                    {!isRegister ? (
                                        <>
                                            <FormControl isInvalid={valid} w="5/6" mt="8" mb="4">
                                                <Input
                                                    fontSize="md"
                                                    variant="underlined"
                                                    placeholder="Email"
                                                    value={email}
                                                    onChangeText={(text) => setEmail(text)}
                                                />
                                                {valid ? (
                                                    <FormControl.ErrorMessage
                                                        leftIcon={<WarningOutlineIcon size="xs" />}
                                                    >
                                                        Email không hợp lệ
                                                    </FormControl.ErrorMessage>
                                                ) : (
                                                    <></>
                                                )}
                                            </FormControl>
                                            {isLogin ? (
                                                <FormControl mb="8" w="5/6">
                                                    <Input
                                                        onChangeText={(text) => setPassword(text)}
                                                        fontSize="md"
                                                        variant="underlined"
                                                        placeholder="Mật khẩu"
                                                        type="password"
                                                    />
                                                </FormControl>
                                            ) : (
                                                <></>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <FormControl isInvalid={valid} w="5/6" mt="8" mb="4">
                                                <Input
                                                    fontSize="md"
                                                    variant="underlined"
                                                    placeholder="Email"
                                                    value={email}
                                                    onChangeText={(text) => setEmail(text)}
                                                />
                                                {valid ? (
                                                    <FormControl.ErrorMessage
                                                        leftIcon={<WarningOutlineIcon size="xs" />}
                                                    >
                                                        Email không hợp lệ
                                                    </FormControl.ErrorMessage>
                                                ) : (
                                                    <></>
                                                )}
                                            </FormControl>
                                            <FormControl mb="8" w="5/6">
                                                <Input
                                                    onChangeText={(text) => setUsername(text)}
                                                    fontSize="md"
                                                    variant="underlined"
                                                    placeholder="Họ và tên"
                                                    type="text"
                                                />
                                            </FormControl>
                                            <FormControl mb="8" w="5/6">
                                                <Input
                                                    onChangeText={(text) => setPassword(text)}
                                                    fontSize="md"
                                                    variant="underlined"
                                                    placeholder="Mật khẩu"
                                                    type="password"
                                                />
                                            </FormControl>
                                            <FormControl mb="8" w="5/6">
                                                <Input
                                                    onChangeText={(text) => setRePassword(text)}
                                                    fontSize="md"
                                                    variant="underlined"
                                                    placeholder="Nhập lại mật khẩu"
                                                    type="password"
                                                />
                                            </FormControl>
                                        </>
                                    )}
                                    {isRegister && (
                                        <Flex
                                            w="5/6"
                                            flexDirection="row"
                                            justifyContent="space-between"
                                            alignItems="center"
                                        >
                                            <Button variant="ghost" px="10" py="2" onPress={() => setIsRegister(false)}>
                                                Trở lại
                                            </Button>
                                            <Button px="10" py="2" onPress={handleSubmitRegister}>
                                                Đăng ký
                                            </Button>
                                        </Flex>
                                    )}
                                    {isLogin ? (
                                        <Flex
                                            w="5/6"
                                            flexDirection="row"
                                            justifyContent="space-between"
                                            alignItems="center"
                                        >
                                            <Button variant="ghost" px="10" py="2" onPress={() => setIslogin(false)}>
                                                Trở lại
                                            </Button>
                                            <Button px="10" py="2" onPress={handleSubmitLogin}>
                                                Đăng nhập
                                            </Button>
                                        </Flex>
                                    ) : isRegister ? (
                                        <></>
                                    ) : (
                                        <Button px="10" py="2" onPress={handleSubmit}>
                                            Đăng nhập / Đăng ký
                                        </Button>
                                    )}
                                    <TouchableOpacity onPress={() => navigate('Root', { name: 'TabOne' })}>
                                        <Text mt="4" underline>
                                            Chưa phải bây giờ
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>

                        <Box h="60%" w="100%" alignItems="center">
                            <Popover
                                defaultIsOpen={openPop}
                                trigger={(triggerProps) => {
                                    return <></>;
                                }}
                                isOpen={openPop}
                            >
                                <Popover.Content accessibilityLabel="Delete Customerd" w="56">
                                    <Popover.Arrow />
                                    <Popover.CloseButton />
                                    <Popover.Header>Delete Customer</Popover.Header>
                                    <Popover.Body>
                                        This will remove all data relating to Alex. This action cannot be reversed.
                                        Deleted data can not be recovered.
                                    </Popover.Body>
                                    <Popover.Footer justifyContent="flex-end">
                                        <Button.Group space={2}>
                                            <Button colorScheme="coolGray" variant="ghost">
                                                Cancel
                                            </Button>
                                            <Button colorScheme="danger">Delete</Button>
                                        </Button.Group>
                                    </Popover.Footer>
                                </Popover.Content>
                            </Popover>
                        </Box>
                    </ScrollView>
                )}
                {/* </KeyboardAvoidingView> */}
            </TouchableWithoutFeedback>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
    },
});

export default LoginScreen;
