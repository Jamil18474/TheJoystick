import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { db } from '../../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateDoc, doc, getDoc } from 'firebase/firestore';

// composant de l'écran d'inscription
const UserScreen = ({ navigation }) => {
    const [idUtilisateur, setIdUtilisateur] = useState('');
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [telephone, setTelephone] = useState('');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        // on indique que la page est en train de charger
        setLoading(true);
        setTimeout(() => {
            // on indique que la page a fini de charger
            setLoading(false);
        }, 1000);
        const userData = async () => {
            try {
                // on récupère l'id de l'utilisateur connecté
                const utilisateurId = await AsyncStorage.getItem('utilisateurId');
                setIdUtilisateur(utilisateurId);
                // on récupère l'utilisateur que l'on veut mettre à jour
                const utilisateurRef = doc(db, "utilisateurs", utilisateurId);
                const utilisateurSnap = await getDoc(utilisateurRef);
                // si l'utilisateur existe
                if (utilisateurSnap.exists()) {
                    // on initialise les champs de l'utilisateur
                    setNom(utilisateurSnap.data().nom);
                    setPrenom(utilisateurSnap.data().prenom);
                    setTelephone(utilisateurSnap.data().telephone);
                    setEmail(utilisateurSnap.data().email);
                    setCode(utilisateurSnap.data().code);
                } else {
                    console.log("No document");
                }
            } catch (error) {
                // on affiche un message d'erreur dans le cas d'une erreur de chargement de page
                console.log(error);
                setMessage("Erreur lors du chargement de la page : ", erorr);
            }
        };
        userData();
    }, []);

    // fonction pour modifier un utilisateur
    const modifierUtilisateur = async () => {
        try {
            // on vérifie si les champs sont vides
            if (!nom || !prenom || !telephone || !code) {
                setMessage('Veuillez remplir les champs obligatoires.');
                return;
            }
            // si l'id de l'utilisateur existe
            if (idUtilisateur != null) {
                // on récupère l'utilisateur que l'on veut mettre à jour
                const utilisateurRef = doc(db, "utilisateurs", idUtilisateur);
                // on modifie l'utilisateur dans la base de données
                await updateDoc(utilisateurRef, {
                    nom: nom,
                    prenom: prenom,
                    telephone: telephone,
                    email: email,
                    code: code
                }).then(() => {
                    setMessage("Vous avez bien modifié l'utilisateur.");
                    // Vider le message après 1 seconde
                    setTimeout(() => {
                        setMessage("");
                    }, 1000);
                })
                    .catch((error) => {
                        console.log(error);
                        setMessage("Erreur lors de la mise à jour de l'utilisateur : ", error);
                        // Vider le message après 1 seconde
                        setTimeout(() => {
                            setMessage("");
                        }, 1000);
                    });
            }
        } catch (error) {
            // on affiche un message d'erreur s'il y'a eu un problème lors de la modification d'un utilisateur
            console.log(error);
            setMessage("Une erreur s\'est produite lors de la modification de l\'utilisateur : ", error);
            setTimeout(() => {
                setMessage("");
            }, 1000);
        }
    };

    return (
        <View style={styles.container} pointerEvents={isLoading ? 'none' : 'auto'}>
            {isLoading &&
                <View>
                    <ActivityIndicator size="large" />
                </View>
            }
            <TouchableOpacity style={styles.buttonRetour} onPress={() => navigation.navigate('HomeScreen')}>
                <Text style={styles.buttonRetourText}>RETOUR</Text>
            </TouchableOpacity>
            <View style={styles.form}>
                <TextInput style={styles.input} value={nom} onChangeText={setNom} placeholder="Nom" />
                <TextInput style={styles.input} value={prenom} onChangeText={setPrenom} placeholder="Prénom" />
                <TextInput style={styles.input} value={telephone} onChangeText={setTelephone} placeholder="Téléphone" />
                <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" />
                <TextInput style={styles.input} value={code} onChangeText={setCode} placeholder="Code" />
                <TouchableOpacity style={styles.buttonModifierUtilisateur} onPress={modifierUtilisateur}>
                    <Text style={styles.buttonModifierUtilisateurText}>MODIFIER</Text>
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
        width: 312,
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
    buttonModifierUtilisateur: {
        backgroundColor: 'yellow',
    },
    buttonModifierUtilisateurText: {
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

export { UserScreen };