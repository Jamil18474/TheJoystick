import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../../firebaseConfig';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const HomeScreen = ({ navigation }) => {
    const [idUtilisateur, setIdUtilisateur] = useState('');
    const [jeux, setJeux] = useState([]);
    const [jeuCourantIndex, setJeuCourantIndex] = useState(0);
    const [message, setMessage] = useState('');
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        // on indique que la page est en train de charger
        setLoading(true);
        setTimeout(() => {
            // on indique que la page a fini de charger
            setLoading(false);
        }, 1000);
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
                    // on récupère les données des jeux
                    const jeuxData = jeuxSnapshot.docs.map((doc) => {
                        return { id: doc.id, ...doc.data() };
                    });
                    // on stocke les jeux récupérés 
                    setJeux(jeuxData);
                }
            } catch (error) {
                // on affiche un message d'erreur dans le cas d'une erreur de chargement de page
                console.log(error);
                setMessage(error);
                setTimeout(() => {
                    setMessage("");
                }, 1000);
            }
        };
        chargementInitial();
    }, []);

    const aimerJeu = async () => {
        try {
            const utilisateurId = idUtilisateur;
            const jeuCourant = jeux[jeuCourantIndex];
            if (jeuCourant) {
                // Vérifier si l'utilisateur est déjà dans la liste des votants
                if (jeuCourant.votants.includes(utilisateurId)) {
                    setMessage("Vous avez déjà aimé ce jeu.");
                    // on indique que la page charge
                    setLoading(true);
                    // on passe au jeu suivant après 1 seconde
                    setTimeout(() => {
                        // Vider le message
                        setMessage("");
                        // on indique que la page a fini de charger
                        setLoading(false);
                        // on passe au jeu suivant
                        passerJeu();
                    }, 1000);
                    return;
                }
                // on déstructure l'objet afin de le copier et ne pas altérer le jeu lors de la modification de la copie
                const jeuMaj = { ...jeuCourant };
                // on ajoute l'id de l'utilisateur à la fin de la liste des votants du jeu 
                jeuMaj.votants = [...jeuMaj.votants, utilisateurId];
                // on récupère le jeu que l'on veut mettre à jour
                const jeuRef = doc(db, "jeux", jeuCourant.id);
                // on met à jour le jeu avec la nouvelle liste des votants
                await updateDoc(jeuRef, { votants: jeuMaj.votants })
                    .then(() => {
                        setMessage("Vous avez bien voté pour ce jeu.");
                        // on indique que la page charge
                        setLoading(true);
                        // Vider le message après 1 seconde
                        setTimeout(() => {
                            setMessage("");
                            // on indique que la page a fini de charger
                            setLoading(false);
                            // on passe au jeu suivant
                            passerJeu();
                        }, 1000);
                    })
                    .catch((error) => {
                        console.log(error);
                        setMessage("Erreur lors de la mise à jour du champ 'votants' :", error);
                        setTimeout(() => {
                            setMessage("");
                        }, 1000);
                    });
            }
        } catch (error) {
            // on affiche un message d'erreur s'il y'a eu un problème lors de l'appui du bouton liker
            console.log(error);
            setMessage('Une erreur s\'est produite lors de l\'appui du bouton liker : ', error);
            setTimeout(() => {
                setMessage("");
            }, 1000);
        }
    };

    // fonction pour passer les jeux
    const passerJeu = () => {
        try {
            // on incrémente de 1 l'index du jeu courant
            setJeuCourantIndex(jeuCourantIndex + 1);
            // si on a atteint la fin des jeux
            if (jeuCourantIndex >= jeux.length - 1) {
                // on indique le fait qu'il n'y a plus de jeux disponibles
                setMessage("Aucun jeu disponible");
                setTimeout(() => {
                    setMessage("");
                }, 1000);
            }
        } catch (error) {
            // on affiche un message d'erreur s'il y'a eu un problème lors de l'appui du bouton passer
            console.log(error);
            setMessage('Une erreur s\'est produite lors de l\'appui du bouton passer : ', error);
            setTimeout(() => {
                setMessage("");
            }, 1000);
        }
    };

    const seDeconnecter = async () => {
        try {
            // Actions à effectuer lorsque le bouton "LogOut" est cliqué
            // on supprime l'ID de l'utilisateur du AsyncStorage
            await AsyncStorage.removeItem('utilisateurId');
            // on vide l'id de l'utilisateur
            setIdUtilisateur('');
            // on indique que la page charge
            setLoading(true);
            // On se redirige vers la page d'accueil et on va déclencher le useEffect de la page d'accueil après 1 seconde
            setTimeout(() => {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'HomeScreen' }],
                });
            }, 1000);
        } catch (error) {
            // on affiche un message d'erreur s'il y'a eu un problème lors de la déconnexion de l'utilisateur
            console.log(error);
            setMessage('Une erreur s\'est produite lors de la déconnexion : ', error);
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
            {idUtilisateur ? (
                <View style={styles.buttonConnected}>
                    <TouchableOpacity onPress={() => navigation.navigate('UserScreen')}>
                        <View style={styles.buttonUser} >
                            <Text style={styles.buttonUserText}>USER</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={seDeconnecter}>
                        <View style={styles.buttonLogOut}>
                            <Text style={styles.buttonLogOutText}>LOG OUT</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.buttonDisconnected}>
                    <TouchableOpacity onPress={() => navigation.navigate('InscriptionScreen')}>
                        <View style={styles.buttonSignUp}>
                            <Text style={styles.buttonSignUpText}>SIGN UP</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('ConnexionScreen')} >
                        <View style={styles.buttonLogIn}>
                            <Text style={styles.buttonLogInText}>LOG IN</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )
            }
            {idUtilisateur && jeux.length > 0 && jeuCourantIndex < jeux.length &&
                <View style={styles.listContainer}>
                    <View style={styles.jeuContainer}>
                        <Text style={styles.nomJeu}>{jeux[jeuCourantIndex].nom}</Text>
                        <Text style={styles.descriptionJeu}>{jeux[jeuCourantIndex].description}</Text>
                        <Text style={styles.messageText}>{message}</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.buttonPasser} onPress={passerJeu}>
                            <Text style={styles.buttonPasserText}>PASSER</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonLiker} onPress={aimerJeu} >
                            <Text style={styles.buttonLikerText}>LIKER</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'purple',
    },
    listContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    jeuContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buttonConnected: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    buttonDisconnected: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    buttonSignUp: {
        width: 100,
        right: 5,
        backgroundColor: 'yellow',
    },
    buttonSignUpText: {
        textAlign: 'center',
        color: 'green',
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
        width: 100,
        right: 20,
        marginLeft: 20,
        backgroundColor: 'yellow',
    },
    buttonLogInText: {
        textAlign: 'center',
        color: 'green',
    },
    messageText: {
        fontSize: 16,
        color: 'green',
    },
    buttonLogOut: {
        width: 100,
        right: 20,
        marginLeft: 20,
        backgroundColor: 'yellow',
    },
    buttonLogOutText: {
        textAlign: 'center',
        color: 'green',
    },
    buttonLiker: {
        width: 150,
        right: 5,
        backgroundColor: 'yellow',
    },
    buttonLikerText: {
        textAlign: 'center',
        color: 'green',
    },
    buttonPasser: {
        width: 150,
        left: 2,
        backgroundColor: 'yellow',
    },
    buttonPasserText: {
        textAlign: 'center',
        color: 'green',
    },
    buttonUser: {
        width: 100,
        right: 5,
        backgroundColor: 'yellow',

    },
    buttonUserText: {
        textAlign: 'center',
        color: 'green',
    }
});

export { HomeScreen };