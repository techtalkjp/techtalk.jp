import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input
} from '@chakra-ui/react'
import { useField } from 'remix-validated-form'

interface FormTextareaProps {
  name: string
  label: string
}

export const FormInput = ({ name, label }: FormTextareaProps) => {
  const { error, getInputProps } = useField(name)

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Input
        backgroundColor="blackAlpha.400"
        placeholder={label}
        id={name}
        {...getInputProps()}
      />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  )
}
