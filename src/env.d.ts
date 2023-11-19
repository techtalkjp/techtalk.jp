/// <reference types="astro/client" />

declare namespace astroHTML.JSX {
  interface HTMLAttributes {
    popover?: boolean
    anchor?: string
  }

  interface ButtonHTMLAttributes {
    popovertarget?: string
  }
}
