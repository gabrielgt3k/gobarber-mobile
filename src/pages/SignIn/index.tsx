import React, { useCallback, useRef } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import {
  Image,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers';
import { useAuth } from '../../hooks/auth';
import logo from '../../assets/logo.png';
import Input from '../../components/Input';
import Button from '../../components/Button';

import {
  Container,
  Title,
  ForgotPassword,
  ForgotPasswordText,
  CreateAccountButton,
  CreateAccountButtonText,
} from './styles';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const passwordInputRef = useRef<TextInput>(null);

  const { signIn } = useAuth();

  const schema = Yup.object().shape({
    email: Yup.string()
      .email('Digite um e-mail válido')
      .required('O E-mail é obrigatório'),
    password: Yup.string().required('A senha é obrigatória'),
  });

  const { control, handleSubmit, errors } = useForm<SignInFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
        await signIn({
          email: data.email,
          password: data.password,
        });
      } catch (error) {
        Alert.alert(
          'Erro na autenticação!',
          'Por favor, cheque suas credenciais e tente novamente',
        );
      }
    },
    [signIn],
  );

  const navigation = useNavigation();

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Container>
            <Image source={logo} />
            <View>
              <Title>Faça seu login</Title>
            </View>

            <Controller
              control={control}
              name="email"
              render={({ onChange, value, name }) => (
                <Input
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  icon="mail"
                  name={name}
                  placeholder="E-mail"
                  returnKeyType="next"
                  isErrored={!!errors.email}
                  errorMessage={errors.email?.message}
                  onSubmitEditing={() => {
                    // eslint-disable-next-line no-unused-expressions
                    passwordInputRef.current?.focus();
                  }}
                  onChangeText={textValue => onChange(textValue)}
                  value={value}
                />
              )}
              defaultValue=""
            />
            <Controller
              control={control}
              name="password"
              render={({ onChange, value, name }) => (
                <Input
                  secureTextEntry
                  returnKeyType="send"
                  onSubmitEditing={() => handleSubmit(onSubmit)()}
                  name={name}
                  icon="lock"
                  placeholder="Senha"
                  onChangeText={textValue => onChange(textValue)}
                  value={value}
                  isErrored={!!errors.password}
                  errorMessage={errors.password?.message}
                  ref={passwordInputRef}
                />
              )}
              defaultValue=""
            />

            <Button onPress={() => handleSubmit(onSubmit)()}>Entrar</Button>
            <ForgotPassword
              onPress={() => {
                console.log('lkdajk');
              }}
            >
              <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
            </ForgotPassword>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <CreateAccountButton
        onPress={() => {
          navigation.navigate('SignUp');
        }}
      >
        <Icon name="log-in" size={20} color="#ff9000" />
        <CreateAccountButtonText>Criar uma conta</CreateAccountButtonText>
      </CreateAccountButton>
    </>
  );
};

export default SignIn;
