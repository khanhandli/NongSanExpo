import { ScrollView, Text, View } from 'native-base';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import WebView from 'react-native-webview';
import TopBar from '../../components/Layout/TopBar';
import { useStore } from '../../hooks/useStore';

const ReportScreen = () => {
    const { height, width } = useWindowDimensions();
    const [token, setToken] = useStore().token;

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View px="6" bg="white">
                <TopBar isBack title="THỐNG KÊ" />
            </View>
            <WebView
                javaScriptEnabled={true}
                style={{ flex: 1, width: width, overflowX: 'hidden' }}
                domStorageEnabled={true}
                startInLoadingState={true}
                source={{ uri: 'https://thuyhang.cf/rp_webview?token=' + token.token }}
            />
        </View>
    );
};

export default ReportScreen;
