import { ScrollView, Text, View } from 'native-base';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import WebView from 'react-native-webview';
import TopBar from '../../components/Layout/TopBar';

const RulesScreen = () => {
    const { height, width } = useWindowDimensions();

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View px="6" bg="white">
                <TopBar isBack title="ĐIỀU KHOẢN & ĐIỀU KIỆN" />
            </View>
            <WebView
                javaScriptEnabled={true}
                style={{ flex: 1, width: width, overflowX: 'hidden' }}
                domStorageEnabled={true}
                startInLoadingState={true}
                source={{ uri: 'https://thuyhang.cf/rules_webview' }}
            />
        </View>
    );
};

export default RulesScreen;
