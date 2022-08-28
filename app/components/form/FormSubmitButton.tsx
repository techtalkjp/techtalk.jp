import { useIsSubmitting } from 'remix-validated-form'
import { Button } from '@chakra-ui/react'

export const FormSubmitButton = () => {
  const isSubmitting = useIsSubmitting()

  return (
    <Button
      type="submit"
      colorScheme="accent"
      isDisabled={isSubmitting}
      isLoading={isSubmitting}
    >
      {isSubmitting ? 'Submitting...' : "Let's talk"}
    </Button>
  )
}
