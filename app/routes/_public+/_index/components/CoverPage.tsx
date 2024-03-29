import type React from 'react'
import { cn } from '~/libs/utils'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  id: string
  bgImage: string
}

const CoverPage = ({ children, className, bgImage, id, ...rest }: Props) => {
  return (
    <div
      id={id}
      className={cn(
        'inview-fade-in relative flex h-screen snap-start snap-always items-center justify-center bg-black/40 bg-cover bg-center bg-blend-overlay',
        className,
      )}
      {...rest}
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="mx-auto w-full px-4 text-center sm:w-2/3 sm:px-0">
        {children}
      </div>
    </div>
  )
}

export default CoverPage
