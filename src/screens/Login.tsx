import React, { useState } from 'react';
import { Box, VStack, Button, Image, Heading, Text, useToast, Icon } from 'native-base';
import { useNavigation, useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormInput } from 'src/components/user-input';
import { KeyboardBehaviorWrapper } from 'src/components/wrappers';
import { anonymousSignIn, fetchSignInMethods } from 'src/firebase/api';
import { useAppSelector, useAppDispatch } from 'src/hooks/useful-ducks';
import { guestSignIn } from 'src/ducks/user-slice';
import { AuthStackParams } from 'src/navigation/auth-stack';
import { ScreenParams } from 'src/types/screen';
import MaetSvg from 'assets/MaetSvg.svg';
import { AlertToast } from 'src/components/feedback/alert-toast';

// define navigation props
type LoginScreenProps = StackNavigationProp<AuthStackParams, 'Email'>;

// define schema for form input
const schema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
});

export const LoginScreen: React.FC<ScreenParams> = (props: ScreenParams) => {

    // hooks
    const navigation = useNavigation<LoginScreenProps>();
    const isAnonymous = useAppSelector((state) => state.user.isAnonymous);
    const dispatch = useAppDispatch();
    const iconColor = useTheme().colors.text;
    const toast = useToast();
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
    });


    // react states
    const [isEmailLoading, setEmailLoading] = useState<boolean>(false);
    const [isGuestLoading, setIsGuestLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    // toast component for guest
    const renderGuestToast = () => (
        <AlertToast title='Using Maet as a Guest.' type='primary' toExit={() => toast.close('guestToast')} />
    );

    const handleEmail = async (data: any) => {
        setEmailLoading(true);
        try {
            const methods = await fetchSignInMethods(data.email);
            setEmailLoading(false);

            // reset react form and navigate to new screen
            reset();
            navigation.navigate('AuthEmail', {
                signInMethods: methods,
                email: data.email,
            });
        } catch (e: any) {
            console.log(`Error with email: ${e}`);
            setError(e.message);
            setEmailLoading(false);
        }
    };

    const handleAnonymous = async () => {
        setIsGuestLoading(true);
        try {
            const response = await anonymousSignIn();
            dispatch(guestSignIn(response.user.uid));
            toast.show({
                placement: 'top',
                render: renderGuestToast,
                id: 'guestToast'
            });
        } catch (e: any) {
            console.log(`Error with Guest sign in ${e}`);
            setError(e.message);
            setIsGuestLoading(false);
        }
    };

    return (
        <KeyboardBehaviorWrapper bounces={false} centerVertically>
            <Box
                px="10"
                w="100%"
                h="100%"
                bg="background.100"
                justifyContent={!isAnonymous ? 'center' : 'flex-start'}
                alignItems="center"
                safeArea={!isAnonymous ? true : undefined}>
                <VStack space={3} alignItems="center" w="100%">
                    {!isAnonymous ? (
                        <>
                            <MaetSvg height={150} width={150} fill={iconColor} />
                            <Heading mb={3} color="plainText.900">Welcome to Maet!</Heading>
                        </>
                    ) : null}
                    <FormInput
                        key="login-email"
                        name="email"
                        control={control}
                        isInvalid={'email' in errors}
                        label="Input your email"
                        placeholder="name@example.com"
                        defaultValue=""
                        errorMessage={errors?.email?.message}
                    />
                    {/* <Button mt="3" colorScheme="primary" w="100%" disabled>
                        Send me a sign-in link
                    </Button> */}
                    <Button
                        key="Password-Button"
                        w="100%"
                        colorScheme="primary"
                        onPress={handleSubmit(handleEmail)}
                        isLoading={isEmailLoading}
                        isLoadingText="Submitting">
                        Submit
                    </Button>
                    {!isAnonymous ? (
                        <Button
                            w="100%"
                            colorScheme="primary"
                            variant="link"
                            onPress={handleAnonymous}
                            isLoading={isGuestLoading}
                            isLoadingText="Continuing">
                            Continue as guest
                        </Button>
                    ) : null}
                    <Text color="danger.600">{error}</Text>
                </VStack>
            </Box>
        </KeyboardBehaviorWrapper>
    );
};
