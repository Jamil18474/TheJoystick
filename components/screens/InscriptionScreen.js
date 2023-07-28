import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Text, TouchableOpacity } from 'react-native';
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
            // on vérifie si les champs sont vides
            if (!nom || !prenom || !telephone || !code) {
                setMessage('Veuillez remplir les champs obligatoires.');
                return;
            }
            // on ajoute le nouvel utilisateur dans la base de données
            await addDoc(collection(db, 'utilisateurs'), {
                nom: nom,
                prenom: prenom,
                telephone: telephone,
                email: email,
                code: code
            }).then(() => {
                // on vide les champs de saisie du formulaire
                resetForm();
                setMessage("Vous avez bien créé un compte.");
                // Vider le message après 1 seconde
                setTimeout(() => {
                    setMessage("");
                }, 1000);
            })
                .catch((error) => {
                    console.log(error);
                    setMessage("Erreur lors de la création de compte :", error);
                    setTimeout(() => {
                        setMessage("");
                    }, 1000);
                });

        } catch (error) {
            // on affiche un message d'erreur s'il y'a eu un problème lors de la création d'un utilisateur
            console.log(error);
            setMessage('Une erreur s\'est produite lors de la création de compte : ', error);
            setTimeout(() => {
                setMessage("");
            }, 1000);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.buttonRetour} onPress={() => navigation.navigate('HomeScreen')}>
                <Text style={styles.buttonRetourText}>RETOUR</Text>
            </TouchableOpacity>
            <View style={styles.form}>
                <TextInput style={styles.input} value={nom} onChangeText={setNom} placeholder="Nom" />
                <TextInput style={styles.input} value={prenom} onChangeText={setPrenom} placeholder="Prénom" />
                <TextInput style={styles.input} value={telephone} onChangeText={setTelephone} placeholder="Téléphone" />
                <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" />
                <TextInput style={styles.input} value={code} onChangeText={setCode} placeholder="Code" />
                <TouchableOpacity style={styles.buttonCreerUtilisateur} onPress={creerUtilisateur}>
                    <Text style={styles.buttonCreerUtilisateurText}>S'INSCRIRE</Text>
                </TouchableOpacity>
                <Text style={styles.messageText}>{message}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'purple',
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
        flexDirection: 'row',
        width: 100,
        justifyContent: 'flex-start',
        backgroundColor: 'yellow',
    },
    buttonRetourText: {
        textAlign: 'center',
        color: 'green',
    },
    buttonCreerUtilisateur: {
        backgroundColor: 'yellow',
    },
    buttonCreerUtilisateurText: {
        textAlign: 'center',
        color: 'green',
    },
    messageText: {
        fontSize: 16,
        color: 'green',
    },
    form: {
        flex: 1,
        marginLeft: 50,
        marginRight: 50,
        justifyContent: 'center',
    },
});

export { InscriptionScreen };