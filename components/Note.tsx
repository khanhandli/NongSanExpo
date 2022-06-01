import { Image } from 'native-base';
import React from 'react';
import { View, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';

const Note = ({ item, onPress, idCate }: any) => {
    const { title, desc } = item;

    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                width: width / 2,
                borderRadius: 10,
                backgroundColor: 'red',
            }}
        >
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Image source={{ uri: item.image }} style={{ height: 100, width: 100 }} />
            </View>
            <Text style={styles.title} numberOfLines={2}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

const width = Dimensions.get('window').width - 40;

const styles = StyleSheet.create({
    container: {
        width: width / 2,
        borderRadius: 10,
        backgroundColor: 'red',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default Note;
