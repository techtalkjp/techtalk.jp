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
      className="flex items-center justify-center relative w-screen h-screen bg-black/40 bg-cover bg-center bg-blend-overlay snap-start snap-always"
      {...rest}
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="px-4 sm:px-0 text-center mx-auto max-w-[32rem]">
        {children}
      </div>
    </div>
  )
}

export default CoverPage
