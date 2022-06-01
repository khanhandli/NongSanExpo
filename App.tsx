import { StatusBar } from 'expo-status-bar';
import { NativeBaseProvider } from 'native-base';
import { SafeAreaView, View } from 'react-native';
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { DataProvider } from './GlobalState';
export default function App() {
    const isLoadingComplete = useCachedResources();
    const colorScheme = useColorScheme();

    if (!isLoadingComplete) {
        return null;
    } else {
        return (
            <DataProvider>
                <NativeBaseProvider>
                    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
                        <SafeAreaView style={{ flex: 1 }}>
                            <Navigation colorScheme={colorScheme} />
                            <StatusBar />
                        </SafeAreaView>
                    </SafeAreaProvider>
                </NativeBaseProvider>
            </DataProvider>
        );
    }
}
