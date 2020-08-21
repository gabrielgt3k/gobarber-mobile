import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useCallback,
} from 'react';
import { TextInputProps } from 'react-native';

import { Container, TextInput, Icon } from './styles';

interface InputProps extends TextInputProps {
  name: string;
  icon: string;
  isErrored: boolean;
  errorMessage?: string;
}

interface InputRef {
  focus(): void;
}

const Input: React.RefForwardingComponent<InputRef, InputProps> = (
  { name, icon, isErrored, ...rest },
  ref,
) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const inputElementRef = useRef<any>(null);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);

    setIsFilled(!!inputElementRef.current.text);
  }, []);

  useImperativeHandle(ref, () => ({
    focus() {
      inputElementRef.current.focus();
    },
  }));

  return (
    <Container isFocused={isFocused} isFilled={isFilled} isErrored={isErrored}>
      <Icon
        name={icon}
        size={20}
        color={isFocused || isFilled ? '#FF9000' : '#666360'}
      />
      <TextInput
        {...rest}
        onFocus={handleInputFocus}
        ref={inputElementRef}
        onBlur={handleInputBlur}
        keyboardAppearance="dark"
        placeholderTextColor="#666360"
      />
    </Container>
  );
};

export default forwardRef(Input);
