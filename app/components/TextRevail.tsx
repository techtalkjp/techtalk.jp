import { motion, useAnimation } from 'motion/react'
import { useEffect } from 'react'
import { cn } from '~/libs/utils'

export const TextReveal = ({
  text,
  delay = 0,
  className,
  isLastLine = false,
}: {
  text: string
  delay?: number
  className?: string
  isLastLine?: boolean
}) => {
  const characters = Array.from(text)
  const controls = useAnimation()

  useEffect(() => {
    controls.start('visible')
  }, [controls])

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isLastLine ? 0 : 0.05,
        delayChildren: delay,
      },
    },
  }

  const child = {
    hidden: { opacity: 0, y: isLastLine ? 50 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: isLastLine ? 'tween' : 'spring',
        duration: isLastLine ? 0.8 : 0.2,
        ease: 'easeOut',
        damping: 12,
        stiffness: 200,
      },
    },
  }

  return (
    <motion.span
      // @ts-ignore
      className={cn('flex justify-center overflow-hidden', className)}
      style={{ overflow: 'hidden', display: 'flex' }}
      variants={container}
      initial="hidden"
      animate={controls}
    >
      {characters.map((character, index) => (
        <motion.span key={`${index}-${character}`} variants={child}>
          {character === ' ' ? '\u00A0' : character}
        </motion.span>
      ))}
    </motion.span>
  )
}
