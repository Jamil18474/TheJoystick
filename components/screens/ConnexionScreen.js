import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Button, Text } from 'react-native';
import { db } from '../../firebaseConfig';
import { addDoc, collection, doc, getDoc, query, where, getDocs } from 'firebase/firestore';
// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

/*
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBsag8WD-XSv2kd51u8keTOipgX4fct_O8",
    authDomain: "the-joystick.firebaseapp.com",
    projectId: "the-joystick",
    storageBucket: "the-joystick.appspot.com",
    messagingSenderId: "749338624051",
    appId: "1:749338624051:web:3dc1979b2d982e9ac8a346",
    measurementId: "G-216WV9DH6Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);*/
const ConnexionScreen = ({ navigation }) => {
    const [telephone, setTelephone] = useState('');
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');

    const seConnecter = async ({ navigation }) => {
        try {
            const utilisateursRef = collection(db, "utilisateurs")
            const q = query(utilisateursRef, where("telephone", "==", telephone), where("code", "==", code));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                setMessage('Aucun utilisateur trouvé.');
                return;
            }
            if (!telephone || !code) {
                setMessage('Veuillez remplir les champs obligatoires.');
                return;
            }
            setMessage('Vous êtes bien connecté.');
            navigation.navigate('HomeScreen');
        } catch (error) {
            console.error('Erreur lors de la création de l\'utilisateur :', error);
            setMessage('Une erreur s\'est produite lors de la création de l\'utilisateur. Veuillez réessayer.');
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