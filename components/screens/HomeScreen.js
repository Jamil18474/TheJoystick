import React from 'react';
import { View, StyleSheet, Button } from 'react-native';

const HomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.buttonSignUp}>
                <Button
                    title="SIGN UP"
                    onPress={() => navigation.navigate('InscriptionScreen')}
                />
            </View>
            <View style={styles.buttonLogIn}>
                <Button
                    title="LOG IN"
                    onPress={() => navigation.navigate('ConnexionScreen')}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'purple'
    },
    buttonSignUp: {
        position: 'absolute',
        right: 100,
        top: 20,
        backgroundColor: '#fff'
    },
    buttonLogIn: {
        position: 'absolute',
        right: 20,
        top: 20,
        backgroundColor: '#fff'
    },
});
export { HomeScreen };