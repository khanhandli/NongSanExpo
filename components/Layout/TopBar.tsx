import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { FC } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';

export interface userDataResponseType {
    api_token: string;
}

export type Props = {
    title: string;
    isBack?: boolean;
    reLoad?: boolean;
};

const TopBar: FC<Props> = ({ title, isBack }) => {
    const navigate = useNavigation();

    return (
        // <View style={{flex: 1, backgroundColor: '#fff'}}>
        <View style={styles.topBar}>
            <View style={styles.group_57}>
                {isBack ? (
                    <TouchableOpacity
                        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                        onPress={() => isBack && navigate.goBack()}
                        style={styles.icon_back}
                    >
                        <MaterialIcons name="arrow-back-ios" size={18} color="black" />
                    </TouchableOpacity>
                ) : (
                    <View></View>
                )}

                <Text style={styles.text_topBar}>{title}</Text>
                <View></View>
            </View>
        </View>
        // </View>
    );
};

export default TopBar;
