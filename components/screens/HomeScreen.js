import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../../firebaseConfig';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const HomeScreen = ({ navigation }) => {
    const [idUtilisateur, setIdUtilisateur] = useState('');
    const [jeux, setJeux] = useState([]);
    const [jeuCourantIndex, setJeuCourantIndex] = useState(0);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const chargementInitial = async () => {
            try {
                // on récupère l'id de l'utilisateur connecté
                const utilisateurId = await AsyncStorage.getItem('utilisateurId');
                // si l'id de l'utilisateur existe
                if (utilisateurId != null) {
                    // on stocke l'id de l'utilisateur 
                    setIdUtilisateur(utilisateurId);
                    // on récupère la liste des jeux
                    const jeuxSnapshot = await getDocs(collection(db, "jeux"));
                    // on récupère les données des jeux avec en plus l'id de chaque document
                    const jeuxData = jeuxSnapshot.docs.map((doc) => {
                        return {
                            id: doc.id,
                            ...doc.data()
                        };
                    });
                    // on stocke les jeux récupérés 
                    setJeux(jeuxData);
                }
            } catch (error) {
                setMessage("Erreur lors du chargement de la page.")
            }
        };
        chargementInitial();
    }, []);


    const aimerJeu = () => {
        const utilisateurId = idUtilisateur;
        const jeuCourant = jeux[jeuCourantIndex];

        if (jeuCourant) {
            // Vérifier si l'utilisateur est déjà dans la liste des votants
            if (jeuCourant.votants.includes(utilisateurId)) {
                setMessage("Vous avez déjà aimé ce jeu.");
                passerJeu();
                return;
            }
            const jeuMaj = { ...jeuCourant };
            // on ajoute l'id de l'utilisateur à la fin de la liste des votants du jeu 
            jeuMaj.votants = [...jeuMaj.votants, utilisateurId];
            // on récupère le document que l'on veut mettre à jour
            const jeuRef = doc(db, "jeux", jeuCourant.id);
            // on supprime le nouveau champ id qui était nécessaire uniquement pour trouver le document donc plus maintenant
            delete jeuMaj.id;
            // on met à jour le jeu avec la nouvelle liste des votants
            updateDoc(jeuRef, jeuMaj)
                .then(() => {
                    setMessage("Vous avez bien voté pour ce jeu.")
                })
                .catch((error) => {
                    setMessage("Erreur lors de la mise à jour du champ 'votants' :", error);
                });
            passerJeu();
        }
    };

    // fonction pour passer les jeux
    const passerJeu = () => {
        // si on a pas encore atteint la fin des jeux
        if (jeuCourantIndex < jeux.length - 1) {
            // on incrémente de 1 l'index du jeu courant
            setJeuCourantIndex(jeuCourantIndex + 1);
        } else {
            setMessage("Aucun jeu disponible");
            // On se redirige vers la page d'accueil et on va déclencher le useEffect de la page d'accueil
            navigation.reset({
                index: 0,
                routes: [{ name: 'HomeScreen' }],
            });

        }
    };

    const seDeconnecter = async () => {
        // Actions à effectuer lorsque le bouton "LogOut" est cliqué
        // on supprime l'ID de l'utilisateur du AsyncStorage
        await AsyncStorage.removeItem('utilisateurId');
        // on vide l'id de l'utilisateur
        setIdUtilisateur('');
        // On se redirige vers la page d'accueil et on va déclencher le useEffect de la page d'accueil
        navigation.reset({
            index: 0,
            routes: [{ name: 'HomeScreen' }],
        });
    };

    return (
        <View style={styles.container}>
            {idUtilisateur && jeux.length > 0 && jeuCourantIndex < jeux.length ? (

                <View style={styles.jeuContainer}>

                    <Text style={styles.nomJeu}>{jeux[jeuCourantIndex].nom}</Text>
                    <Text style={styles.descriptionJeu}>{jeux[jeuCourantIndex].description}</Text>

                    <View style={styles.buttonContainer}>
                        <View style={styles.buttonPasser}>
                            <Button title="Passer" onPress={passerJeu} />
                        </View>
                        <View style={styles.buttonLiker}>
                            <Button title="Liker" onPress={aimerJeu} />
                        </View>
                    </View>
                    <Text style={styles.messageText}>{message}</Text>
                </View>

            ) : (
                <View>
                    <View style={styles.buttonSignUp}>
                        <Button title="SIGN UP" onPress={() => navigation.navigate('InscriptionScreen')} />
                    </View>
                    <View style={styles.buttonLogIn}>
                        <Button title="LOG IN" onPress={() => navigation.navigate('ConnexionScreen')} />
                    </View>
                </View>
            )}
            {idUtilisateur && (
                <View style={styles.buttonLogOut}>
                    <Button title="LogOut" onPress={seDeconnecter} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'purple'
    },
    jeuContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'space-between'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignContent: 'space-around',
    },
    buttonSignUp: {
        position: 'absolute',
        right: 100,
        top: 20,
        backgroundColor: '#fff'
    },
    nomJeu: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: 'white',
    },
    descriptionJeu: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
        color: 'white',
    },
    buttonLogIn: {
        position: 'absolute',
        right: 20,
        top: 20,
        backgroundColor: '#fff'
    },
    messageText: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
    },
    buttonLogOut: {
        position: 'absolute',
        right: 20,
        top: 20,
        backgroundColor: '#fff',
    },

    buttonLiker: {
        width: 150,
        right: 5,
    },
    buttonPasser: {
        width: 150,
        left: 2,
    },
});

export { HomeScreen };