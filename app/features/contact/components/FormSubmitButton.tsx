import { Button } from '@chakra-ui/react'

export const FormSubmitButton = ({
  isSubmitting = false,
  children,
}: {
  isSubmitting?: boolean
  children: React.ReactNode
}) => {
  return (
    <Button
      type="submit"
      colorScheme="accent"
      isDisabled={isSubmitting}
      isLoading={isSubmitting}
    >
      {isSubmitting ? 'Submitting...' : children}
    </Button>
  )
}
