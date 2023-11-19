/// <reference types="astro/client" />

declare namespace astroHTML.JSX {
  interface HTMLAttributes {
    popover?: boolean
  }

  interface ButtonHTMLAttributes {
    popovertarget?: string
  }
}
