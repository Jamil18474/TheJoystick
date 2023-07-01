import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Button, Text } from 'react-native';
import { initializeApp } from "firebase/app";
import { addDoc, collection, getFirestore } from 'firebase/firestore/lite';
// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


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
const db = getFirestore(app);
const InscriptionScreen = () => {
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [telephone, setTelephone] = useState('');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');

    const creerUtilisateur = async () => {
        try {
            const utilisateur = {
                nom: nom,
                prenom: prenom,
                telephone: telephone,
                email: email,
                code: code
            };

            if (!nom || !prenom || !telephone || !code) {
                setMessage('Veuillez remplir les champs obligatoires.');
                return;
            }
            addDoc(collection(db, 'utilisateurs'), utilisateur);
            setNom('');
            setPrenom('');
            setTelephone('');
            setEmail('');
            setCode('');
            setMessage('L\'utilisateur a été créé avec succès.');
        } catch (error) {
            console.error('Erreur lors de la création de l\'utilisateur :', error);
            setMessage('Une erreur s\'est produite lors de la création de l\'utilisateur. Veuillez réessayer.');
        }
    };

    return (
        <View>
            <TextInput value={nom} onChangeText={setNom} placeholder="Nom" />
            <TextInput value={prenom} onChangeText={setPrenom} placeholder="Prénom" />
            <TextInput value={telephone} onChangeText={setTelephone} placeholder="Téléphone" />
            <TextInput value={email} onChangeText={setEmail} placeholder="Email" />
            <TextInput value={code} onChangeText={setCode} placeholder="Code" />
            <Button onPress={creerUtilisateur} title="Créer Utilisateur" />
            <Text>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    message: {
        marginTop: 20,
        color: 'red',
        fontSize: 16,
    },
});
export { InscriptionScreen };