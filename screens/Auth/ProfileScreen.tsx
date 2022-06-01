import { Avatar, Divider, Text, View } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import TopBar from '../../components/Layout/TopBar';
import NHCSafeAreaView from '../../components/NHCSafeAreaView';
import { useStore } from '../../hooks/useStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation: { navigate } }: any) => {
    const [userr, setUserr] = useStore().userAPI.userr;
    const [isLooged, setLooged] = useStore().userAPI.isLogged;

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <TopBar title="THÔNG TIN" />
            <View style={{ paddingHorizontal: 30 }}>
                <View style={{ flexDirection: 'row' }}>
                    <Avatar
                        bg="blue.500"
                        source={{
                            uri: userr.avatar,
                        }}
                    >
                        JB
                    </Avatar>
                    <View ml="6">
                        {isLooged ? (
                            <>
                                <Text fontWeight="bold" fontSize="md">
                                    {userr.username}
                                </Text>
                                <Text fontSize="sm" color="#888">
                                    {userr.email}
                                </Text>
                            </>
                        ) : (
                            <TouchableOpacity
                                onPress={() => {
                                    navigate('Auth');
                                }}
                            >
                                <Text mt="5" color="red.500" fontWeight="bold" fontSize="16">
                                    Đăng nhập / Đăng ký
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
                <View mt="6">
                    <Text fontSize="md" fontWeight="500" color="#888">
                        Chung
                    </Text>
                    <Divider bg="#ccc" mt="1" />
                </View>
                {isLooged && (
                    <TouchableOpacity onPress={() => navigate('EditProfile')}>
                        <Text mt="5" fontWeight="bold" fontSize="16">
                            Chỉnh sửa thông tin
                        </Text>
                    </TouchableOpacity>
                )}

                {/* <TouchableOpacity>
                    <Text mt="5" fontWeight="bold" fontSize="16">
                        Cẩm nang trồng cây
                    </Text>
                </TouchableOpacity> */}
                <TouchableOpacity onPress={() => navigate('History')}>
                    <Text mt="5" fontWeight="bold" fontSize="16">
                        Lịch sử giao dịch
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigate('Report')}>
                    <Text mt="5" fontWeight="bold" fontSize="16">
                        Thống kê
                    </Text>
                </TouchableOpacity>
                <View mt="6">
                    <Text fontSize="md" fontWeight="500" color="#888">
                        Bảo mật và Điều khoản
                    </Text>
                    <Divider bg="#ccc" mt="1" />
                </View>
                <TouchableOpacity onPress={() => navigate('Rules')}>
                    <Text mt="5" fontWeight="bold" fontSize="16">
                        Điều khoản và điều kiện
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigate('Private')}>
                    <Text mt="5" fontWeight="bold" fontSize="16">
                        Chính sách quyền riêng tư
                    </Text>
                </TouchableOpacity>
                {isLooged && (
                    <TouchableOpacity
                        onPress={async () => {
                            // handle logout
                            setLooged(false);
                            setUserr({});
                            await AsyncStorage.removeItem('firstLogin');
                            navigate('Auth');
                        }}
                    >
                        <Text mt="5" color="red.500" fontWeight="bold" fontSize="16">
                            Đăng xuất
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default ProfileScreen;
