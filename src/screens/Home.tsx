import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'native-base';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppDispatch, useAppSelector } from 'src/hooks/useful-ducks';
import { signOut } from 'src/ducks/user-slice';
import { signOutUser } from 'src/firebase/api';
import { HomeStackParams } from 'src/navigation/home-stack';


export interface HomeScreenParams {
    test?: undefined
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

/*
    Define Screen Typee
*/
type HomeScreenProps = StackNavigationProp<HomeStackParams, "Main">;

export const HomeScreen: React.FC<HomeScreenParams> = () => {
    const [showPickupSession, setPickupSession] = useState(false);
    const [showSignup, setSignup] = useState(false);

    // navigation
    const navigation = useNavigation<HomeScreenProps>();

    // redux handlers
    const dispatch = useAppDispatch();
    const loggedIn = useAppSelector((state) => state.user.loggedIn);
    const isAnonymous = useAppSelector((state) => state.user.isAnonymous);
    const user = useAppSelector((state) => state.user);
    console.log(`Anonymous In: ${isAnonymous}`);

    // handling button functions
    const handleLoginButton = async () => {
        if (loggedIn) {
            let res = await signOutUser();
            console.log('SIgned out');
            console.log(res);
        } else {
            navigation.navigate('Login');
        }
    }

    return (
        <>
        <View style={styles.container}>
            <Text>Home Screen: {user.email}</Text>
            <Button mt="2" colorScheme="indigo" onPress={() => navigation.navigate('Login')}>
                Schedule Pickup
            </Button>
            <Button mt="2" colorScheme="indigo" onPress={() => navigation.navigate('PickupSession')}>
                Start Pickup Session
            </Button>
            <Button mt="2" colorScheme="indigo" onPress={handleLoginButton}>
                {loggedIn ? 'Logout' : 'Login'}
            </Button>
        </View>
        {/* <LoginModal isOpen={showSignup} onClose={() => setSignup(false)} /> */}
        </>

    );
}
