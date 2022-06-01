/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import HomeScreen from '../screens/HomeScreen';
import {
    AuthTabParamList,
    NotBottomTabParamList,
    RootStackParamList,
    RootTabParamList,
    RootTabScreenProps,
} from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import SearchScreen from '../screens/SearchScreen';
import NotificationScreen from '../screens/NotificationScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import { useStore } from '../hooks/useStore';
import CategoryScreen from '../screens/category/CategoryScreen';
import { Badge } from 'native-base';
import DetailProductScreen from '../screens/product/DetailProductScreen';
import CartScreen from '../screens/Cart/CartScreen';
import OrderScreen from '../screens/Order/OrderScreen';
import ProfileScreen from '../screens/Auth/ProfileScreen';
import EditProfileScreen from '../screens/Auth/EditProfileScreen';
import HistoryScreen from '../screens/Order/HistoryScreen';
import DetailOrderScreen from '../screens/Order/DetailOrderScreen';
import ReportScreen from '../screens/Report/ReportScreen';
import RulesScreen from '../screens/Policy/RulesScreen';
import PrivateScreen from '../screens/Policy/PrivateScreen';
import PromotionScreen from '../screens/Promotion/PromotionScreen';

const horizontalAnimation = {
    gestureDirection: 'horizontal',
    cardStyleInterpolator: ({ current, layouts }: any) => {
        return {
            cardStyle: {
                transform: [
                    {
                        translateX: current.progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [layouts.screen.width, 0],
                        }),
                    },
                ],
            },
        };
    },
};

export const styleBottom = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,

        elevation: 10,
        height: 46,
        borderWidth: 0,
        position: 'relative',
    },
});
function MyTabBar({ state, descriptors, navigation }: any) {
    const [noti, setNoti] = useStore().notifications;

    return (
        <View style={styleBottom.tabBar} key={Math.random()}>
            {state.routes.map((route: any, index: any) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                        ? options.title
                        : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        // The `merge: true` option makes sure that the params inside the tab screen are preserved
                        navigation.navigate({ name: route.name, merge: true });
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };
                if (route.name === 'Category' || route.name === 'DetailProduct' || route.name === 'Cart') return;

                return (
                    <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        key={Math.random()}
                        style={{ flex: 1 }}
                    >
                        {route.name === 'TabThree' && (
                            <Badge // bg="red.400"
                                colorScheme="danger"
                                rounded="full"
                                mb={-4}
                                right={6}
                                zIndex={1}
                                variant="solid"
                                alignSelf="flex-end"
                                position="absolute"
                                _text={{
                                    fontSize: 12,
                                }}
                            >
                                {noti?.length}
                            </Badge>
                        )}
                        <TabBarIconAntd
                            name={
                                route.name === 'TabOne'
                                    ? 'home'
                                    : route.name === 'TabTwo'
                                    ? 'search1'
                                    : route.name === 'TabThree'
                                    ? 'bells'
                                    : route.name === 'TabFoure'
                                    ? 'user'
                                    : 'home'
                            }
                            color={isFocused ? '#673ab7' : '#666'}
                        />
                        {isFocused && (
                            <Text
                                style={{
                                    position: 'absolute',
                                    color: isFocused ? '#673ab7' : '#222',
                                    textAlign: 'center',
                                    fontSize: 60,
                                    bottom: -14,
                                    right: 0,
                                    left: 0,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                .
                            </Text>
                        )}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
export default function Navigation({ colorScheme }: any) {
    return (
        <NavigationContainer linking={LinkingConfiguration} theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <RootNavigator />
        </NavigationContainer>
    );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthTabParamList>();
const NotBottomTabStack = createNativeStackNavigator<NotBottomTabParamList>();

const NotBottomTabStackScreen = () => {
    return (
        <NotBottomTabStack.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerShown: false,
            }}
        >
            <NotBottomTabStack.Screen name="Home" component={HomeScreen} />
            <NotBottomTabStack.Screen name="Category" component={CategoryScreen} />
        </NotBottomTabStack.Navigator>
    );
};

const AuthStackScreen = () => {
    return (
        <AuthStack.Navigator
            initialRouteName="Login"
            screenOptions={{
                headerShown: false,
            }}
        >
            <AuthStack.Screen name="Login" component={LoginScreen} />
        </AuthStack.Navigator>
    );
};
function RootNavigator() {
    const [isLooged] = useStore().userAPI.isLogged;

    return (
        <Stack.Navigator initialRouteName={`${isLooged != false && isLooged ? 'Root' : 'Auth'}`}>
            <Stack.Screen name="Auth" component={AuthStackScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="Order" component={OrderScreen} options={{ headerShown: false }} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: false }} />
            <Stack.Screen name="History" component={HistoryScreen} options={{ headerShown: false }} />
            <Stack.Screen name="DetailOrder" component={DetailOrderScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Report" component={ReportScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Rules" component={RulesScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Private" component={PrivateScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Promotion" component={PromotionScreen} options={{ headerShown: false }} />
            {/* <Stack.Screen name="NotBottom" component={NotBottomTabStackScreen} options={{ headerShown: false }} /> */}
            <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
            <Stack.Group screenOptions={{ presentation: 'modal' }}>
                <Stack.Screen name="Modal" component={ModalScreen} />
            </Stack.Group>
        </Stack.Navigator>
    );
}

const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
    const [hiddenTabBar, setHiddenTaBbar] = useStore().hiddenTabBar;
    const colorScheme = useColorScheme();

    return (
        <BottomTab.Navigator
            initialRouteName="TabOne"
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme].tint,
            }}
            tabBar={(props) => (hiddenTabBar ? <></> : <MyTabBar {...props} />)}
        >
            <BottomTab.Screen
                name="TabOne"
                options={{
                    headerShown: false,
                }}
                component={HomeScreen}
            />

            <BottomTab.Screen name="Category" options={{ headerShown: false }} component={CategoryScreen} />
            <BottomTab.Screen name="DetailProduct" options={{ headerShown: false }} component={DetailProductScreen} />

            <BottomTab.Screen name="Cart" options={{ headerShown: false }} component={CartScreen} />

            <BottomTab.Screen name="TabTwo" options={{ headerShown: false }} component={SearchScreen} />
            <BottomTab.Screen name="TabThree" options={{ headerShown: false }} component={NotificationScreen} />
            <BottomTab.Screen name="TabFoure" options={{ headerShown: false }} component={ProfileScreen} />
        </BottomTab.Navigator>
    );
}

function TabBarIconAntd(props: { name: React.ComponentProps<typeof AntDesign>['name']; color: string }) {
    return (
        <AntDesign
            size={26}
            style={{ fontWeight: 'normal', marginBottom: -3, marginTop: 6, textAlign: 'center' }}
            {...props}
        />
    );
}
