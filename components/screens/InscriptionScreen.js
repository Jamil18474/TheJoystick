import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Button, Text } from 'react-native';
import { db } from '../../firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';

// composant de l'écran d'inscription
const InscriptionScreen = ({ navigation }) => {
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [telephone, setTelephone] = useState('');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');

    // fonction pour vider les champs
    const resetForm = () => {
        setNom('');
        setPrenom('');
        setTelephone('');
        setEmail('');
        setCode('');
    };

    // fonction pour créer un utilisateur
    const creerUtilisateur = async () => {
        try {
            const utilisateur = {
                nom: nom,
                prenom: prenom,
                telephone: telephone,
                email: email,
                code: code
            };
            // on vérifie si les champs sont vides
            if (!nom || !prenom || !telephone || !code) {
                setMessage('Veuillez remplir les champs obligatoires.');
                return;
            }
            // on ajoute le nouvel utilisateur dans la base de données
            addDoc(collection(db, 'utilisateurs'), utilisateur);
            resetForm();
            setMessage('L\'utilisateur a été créé avec succès.');
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
                <TextInput style={styles.input} value={nom} onChangeText={setNom} placeholder="Nom" />
                <TextInput style={styles.input} value={prenom} onChangeText={setPrenom} placeholder="Prénom" />
                <TextInput style={styles.input} value={telephone} onChangeText={setTelephone} placeholder="Téléphone" />
                <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" />
                <TextInput style={styles.input} value={code} onChangeText={setCode} placeholder="Code" />
                <Button onPress={creerUtilisateur} title="Créer Utilisateur" />
                <Text>{message}</Text>
            </View>
        </View>
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

export { InscriptionScreen };