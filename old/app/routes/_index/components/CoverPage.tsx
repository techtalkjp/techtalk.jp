import React from 'react'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  id: string
  bgImage: string
}

const CoverPage = ({ children, bgImage, id, ...rest }: Props) => {
  return (
    <div
      id={id}
      className="relative flex h-screen snap-start snap-always items-center justify-center bg-black/40 bg-cover bg-center bg-blend-overlay"
      {...rest}
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="mx-auto w-full px-4 text-center sm:w-2/3 sm:px-0">{children}</div>
    </div>
  )
}

export default CoverPage
