import { Button, Input, Text, View } from 'native-base';
import React from 'react';
import { Keyboard, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import TopBar from '../../components/Layout/TopBar';
import { useStore } from '../../hooks/useStore';

const initialState = {
    name: '',
    email: '',
    mobile: '',
    address: '',
};

const EditProfileScreen = () => {
    const [userr, setUserr] = useStore().userAPI.userr;
    const [editInfo, setEditInfo] = React.useState(initialState);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <View px="6">
                    <TopBar title="CHỈNH SỬA THÔNG TIN" isBack />
                </View>
                <View px="10" mt="2" style={{ flex: 1 }}>
                    <Text fontSize="15">Thông tin sẽ được lưu cho lần mua kế tiếp.</Text>
                    <Text fontSize="15">Bấm vào thông tin chi tiết để chỉnh sửa.</Text>

                    <Input
                        mt="10"
                        defaultValue={userr.username}
                        variant="underlined"
                        color="888"
                        fontSize="14"
                        placeholder="Họ tên"
                        onChangeText={(text) => setEditInfo({ ...editInfo, name: text })}
                    />
                    <Input
                        mt="1"
                        defaultValue={userr.email}
                        variant="underlined"
                        color="888"
                        fontSize="14"
                        placeholder="Họ tên"
                        onChangeText={(text) => setEditInfo({ ...editInfo, email: text })}
                    />
                    <Input
                        mt="1"
                        defaultValue={userr.address}
                        variant="underlined"
                        color="888"
                        fontSize="14"
                        placeholder="Họ tên"
                        onChangeText={(text) => setEditInfo({ ...editInfo, address: text })}
                    />
                    <Input
                        mt="1"
                        defaultValue={userr.mobile}
                        variant="underlined"
                        color="888"
                        fontSize="14"
                        placeholder="Số điện thoại"
                        onChangeText={(text) => setEditInfo({ ...editInfo, mobile: text })}
                    />
                </View>
                <TouchableOpacity>
                    <Button mx="10" mb="12" h="12" size="lg" p="2" bg="tertiary.700" position="relative" bottom="0">
                        LƯU THÔNG TIN
                    </Button>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default EditProfileScreen;
