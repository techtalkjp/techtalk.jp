import { Button } from '@chakra-ui/react'

export const FormSubmitButton = ({ state }: { state?: string }) => {
  const isSubmitting = state === 'submitting'

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
