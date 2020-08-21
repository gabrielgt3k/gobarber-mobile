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
import logo from '../../assets/logo.png';
import Input from '../../components/Input';
import Button from '../../components/Button';
import api from '../../services/api';

import { Container, Title, BackToSignIn, BackToSignInText } from './styles';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const schema = Yup.object().shape({
    name: Yup.string().required('O nome é obrigatório'),
    email: Yup.string()
      .email('Digite um e-mail válido')
      .required('O E-mail é obrigatório'),
    password: Yup.string()
      .min(6, 'Mínimo seis caractéres')
      .required('A senha é obrigatória'),
  });

  const { control, handleSubmit, errors } = useForm<SignUpFormData>({
    resolver: yupResolver(schema),
  });

  const navigation = useNavigation();
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const onSubmit = useCallback(
    async (data: SignUpFormData) => {
      try {
        await api.post('users', data);

        Alert.alert(
          'Cadastro realizado com sucesso!',
          'Você já pode fazer login',
        );

        navigation.goBack();
      } catch (error) {
        Alert.alert(
          'Erro ao realizar o cadastro!',
          'Por favor, cheque suas credenciais e tente novamente',
        );
      }
    },
    [navigation],
  );

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
              <Title>Crie sua conta</Title>
            </View>

            <Controller
              control={control}
              name="name"
              render={({ onChange, value, name }) => (
                <Input
                  autoCapitalize="words"
                  icon="user"
                  name={name}
                  placeholder="Nome"
                  onChangeText={textValue => onChange(textValue)}
                  value={value}
                  isErrored={!!errors.name}
                  errorMessage={errors.name?.message}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    // eslint-disable-next-line no-unused-expressions
                    emailInputRef.current?.focus();
                  }}
                />
              )}
              defaultValue=""
              rules={{ required: 'o campo é obrigatório' }}
            />
            <Controller
              control={control}
              name="email"
              render={({ onChange, value, name }) => (
                <Input
                  ref={emailInputRef}
                  keyboardType="email-address"
                  autoCorrect={false}
                  autoCapitalize="none"
                  icon="mail"
                  name={name}
                  placeholder="E-mail"
                  onChangeText={textValue => onChange(textValue)}
                  value={value}
                  isErrored={!!errors.email}
                  errorMessage={errors.email?.message}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    // eslint-disable-next-line no-unused-expressions
                    passwordInputRef.current?.focus();
                  }}
                />
              )}
              defaultValue=""
              rules={{ required: 'o campo é obrigatório' }}
            />
            <Controller
              control={control}
              name="password"
              render={({ onChange, value, name }) => (
                <Input
                  ref={passwordInputRef}
                  secureTextEntry
                  textContentType="newPassword"
                  name={name}
                  icon="lock"
                  placeholder="Senha"
                  onChangeText={textValue => onChange(textValue)}
                  value={value}
                  isErrored={!!errors.password}
                  errorMessage={errors.password?.message}
                  returnKeyType="send"
                  onSubmitEditing={() => handleSubmit(onSubmit)()}
                />
              )}
              defaultValue=""
              rules={{ required: 'o campo é obrigatório' }}
            />

            <Button onPress={() => handleSubmit(onSubmit)()}>Entrar</Button>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <BackToSignIn
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Icon name="arrow-left" size={20} color="#fff" />
        <BackToSignInText>Voltar para login</BackToSignInText>
      </BackToSignIn>
    </>
  );
};

export default SignUp;
