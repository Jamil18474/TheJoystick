import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Button, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { db } from '../../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ConnexionScreen = ({ navigation }) => {
    const [telephone, setTelephone] = useState('');
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setLoading] = useState(false);
    const seConnecter = async () => {
        try {
            // on vérifie dans la liste des utilisateurs, l'utilisateur ayant le téléphone et le code saisis dans le formulaire
            const utilisateurRef = collection(db, "utilisateurs");
            const q = query(utilisateurRef, where("telephone", "==", telephone), where("code", "==", code));
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
            setLoading(true);
            setTimeout(() => {
                // on indique que la page a fini de charger
                setLoading(false);
                // on rafraîchit la page d'accueil
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'HomeScreen' }],
                });
            }, 1000);
        } catch (error) {
            // on affiche un message d'erreur s'il y'a eu un problème lors de la connexion de l'utilisateur
            console.log(error);
            setMessage('Une erreur s\'est produite lors de la connexion de l\'utilisateur : ', error);
            setTimeout(() => {
                setMessage("");
            }, 1000);
        }
    };

    return (
        <View style={styles.container} pointerEvents={isLoading ? 'none' : 'auto'}>
            <TouchableOpacity style={styles.buttonRetour} onPress={() => navigation.navigate('HomeScreen')}>
                <Text style={styles.buttonRetourText}>RETOUR</Text>
            </TouchableOpacity>
            <View style={styles.form}>
                <TextInput style={styles.input} value={telephone} onChangeText={setTelephone} placeholder="Téléphone" />
                <TextInput style={styles.input} value={code} onChangeText={setCode} placeholder="Code" />
                <TouchableOpacity style={styles.buttonSeConnecter} onPress={seConnecter}>
                    <Text style={styles.buttonSeConnecterText} >SE CONNECTER</Text>
                </TouchableOpacity>
                <Text style={styles.messageText}>{message}</Text>
            </View>
        </View >
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
    buttonSeConnecter: {
        backgroundColor: 'yellow',
    },
    buttonSeConnecterText: {
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

export { ConnexionScreen };