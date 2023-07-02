import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Button, Text } from 'react-native';
import { db } from '../../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ConnexionScreen = ({ navigation }) => {
    const [telephone, setTelephone] = useState('');
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');

    const seConnecter = async () => {
        try {
            // on vérifie dans la liste des utilisateurs, l'utilisateur ayant le téléphone et le code saisis dans le formulaire
            const utilisateursRef = collection(db, "utilisateurs");
            const q = query(utilisateursRef, where("telephone", "==", telephone), where("code", "==", code));
            const querySnapshot = await getDocs(q);
            // on vérifie si les champs sont remplis
            if (!telephone || !code) {
                setMessage('Veuillez remplir les champs obligatoires.');
                return;
            }
            // on vérifie si on a récupéré un document
            if (querySnapshot.empty) {
                setMessage('Aucun utilisateur trouvé.');
                return;
            }
            setMessage('Vous êtes bien connecté.');
            const utilisateurId = querySnapshot.docs[0].id; // Récupération de l'ID de l'utilisateur
            await AsyncStorage.setItem('utilisateurId', utilisateurId); // Stockage de l'ID de l'utilisateur dans le localStorage
            // On se redirige vers la page d'accueil et on va déclencher le useEffect de la page d'accueil
            navigation.reset({
                index: 0,
                routes: [{ name: 'HomeScreen' }],
            });
        } catch (error) {
            console.error('Erreur lors de la connexion de l\'utilisateur :', error);
            setMessage('Une erreur s\'est produite lors de la connexion de l\'utilisateur. Veuillez réessayer.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.buttonRetour}>
                <Button
                    title="Retour"
                    onPress={() => navigation.navigate('HomeScreen')}
                />
            </View>
            <View style={styles.form}>
                <TextInput style={styles.input} value={telephone} onChangeText={setTelephone} placeholder="Téléphone" />
                <TextInput style={styles.input} value={code} onChangeText={setCode} placeholder="Code" />
                <Button onPress={seConnecter} title="Se connecter" />
                <Text>{message}</Text>
            </View>
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'purple',
        padding: 20,
    },
    input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        backgroundColor: 'white',
        borderColor: '#C0C0C0',
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    buttonRetour: {
        position: 'absolute',
        left: 20,
        top: 20,
        backgroundColor: '#fff',
    },
    form: {
        paddingTop: 10,
        marginLeft: 20,
        marginRight: 20,
    },
});

export { ConnexionScreen };