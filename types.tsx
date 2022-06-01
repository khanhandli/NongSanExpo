/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}

export type RootStackParamList = {
    Root: NavigatorScreenParams<RootTabParamList> | undefined;
    Modal: undefined;
    NotBottom: undefined;
    NotFound: undefined;
    Auth: undefined;
    Order: undefined;
    EditProfile: undefined;
    History: undefined;
    DetailOrder: undefined;
    Report: undefined;
    Rules: undefined;
    Private: undefined;
    Promotion: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
    RootStackParamList,
    Screen
>;

export type RootTabParamList = {
    TabOne: undefined;
    TabTwo: undefined;
    Category: undefined;
    DetailProduct: undefined;
    Cart: undefined;
    TabThree: undefined;
    TabFoure: undefined;
};

export type AuthTabParamList = {
    Login: undefined;
};

export type NotBottomTabParamList = {
    Category: undefined;
    category: undefined;
    Home: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
>;
