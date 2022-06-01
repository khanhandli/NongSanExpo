import { Dimensions, StyleSheet } from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    text_toat: {
        color: 'white',
        fontSize: 18,
        backgroundColor: '#333',
    },
    text_topBar: {
        fontSize: 18,
        color: '#333',
        textAlign: 'center',
        marginTop: 3,
    },
    topBar: {
        backgroundColor: '#fff',
        height: 80,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 20,
    },
    group_57: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'space-between',
    },
    icon_back: {
        marginTop: 2,
        // marginLeft: 10,
        // justifyContent: 'center',
    },
    reload: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
});

export default styles;
