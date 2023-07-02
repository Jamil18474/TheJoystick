import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
    const [idUtilisateur, setIdUtilisateur] = useState('');

    useEffect(() => {
        const chargementInitial = async () => {
            try {
                const utilisateurId = await AsyncStorage.getItem('utilisateurId');
                setIdUtilisateur(utilisateurId);
            } catch (error) {
            }
        };
        chargementInitial();
    }, []);

    const seDeconnecter = async () => {
        // Actions à effectuer lorsque le bouton "LogOut" est cliqué
        // on supprime l'ID de l'utilisateur du AsyncStorage
        await AsyncStorage.removeItem('utilisateurId');
        // on vide l'id de l'utilisateur
        setIdUtilisateur('');
        navigation.reset({
            index: 0,
            routes: [{ name: 'HomeScreen' }],
        });
    };

    return (
        <View style={styles.container}>
            {idUtilisateur ? ( // Vérifiez si l'utilisateur est connecté en utilisant l'ID de l'utilisateur
                <>
                    <View style={styles.buttonLogOut}>
                        <Button title="LogOut" onPress={seDeconnecter} />
                    </View>
                </>
            ) : (
                <>
                    <View style={styles.buttonSignUp}>
                        <Button title="SIGN UP" onPress={() => navigation.navigate('InscriptionScreen')} />
                    </View>
                    <View style={styles.buttonLogIn}>
                        <Button title="LOG IN" onPress={() => navigation.navigate('ConnexionScreen')} />
                    </View>
                </>
            )}
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
    buttonLogOut: {
        position: 'absolute',
        right: 20,
        top: 20,
        backgroundColor: '#fff',
    },
});

export { HomeScreen };