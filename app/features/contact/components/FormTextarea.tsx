import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Textarea,
} from '@chakra-ui/react'
import { useField } from 'remix-validated-form'

interface FormTextareaProps {
  name: string
  label: string
}

export const FormTextarea = ({ name, label }: FormTextareaProps) => {
  const { error, getInputProps } = useField(name)

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Textarea
        backgroundColor="blackAlpha.400"
        placeholder={label}
        id={name}
        {...getInputProps()}
      />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  )
}
