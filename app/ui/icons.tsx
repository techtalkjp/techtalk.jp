// lucide-static v1.41.0 (ISC) のアイコンをインライン化したもの
import type { Handle, RemixNode } from 'remix/component'

export interface IconProps {
  size?: number
  strokeWidth?: number
}

function Lucide(handle: Handle<IconProps & { children?: RemixNode }>) {
  return () => {
    let { size = 16, strokeWidth = 2, children } = handle.props
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width={strokeWidth}
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        {children}
      </svg>
    )
  }
}

export function MenuIcon(handle: Handle<IconProps>) {
  return () => (
    <Lucide {...handle.props}>
      <path d="M4 5h16" />
      <path d="M4 12h16" />
      <path d="M4 19h16" />
    </Lucide>
  )
}

export function CloseIcon(handle: Handle<IconProps>) {
  return () => (
    <Lucide {...handle.props}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </Lucide>
  )
}

export function ArrowUpRightIcon(handle: Handle<IconProps>) {
  return () => (
    <Lucide {...handle.props}>
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </Lucide>
  )
}

export function BotIcon(handle: Handle<IconProps>) {
  return () => (
    <Lucide {...handle.props}>
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </Lucide>
  )
}

export function LinkIcon(handle: Handle<IconProps>) {
  return () => (
    <Lucide {...handle.props}>
      <path d="M9 17H7A5 5 0 0 1 7 7h2" />
      <path d="M15 7h2a5 5 0 1 1 0 10h-2" />
      <line x1="8" x2="16" y1="12" y2="12" />
    </Lucide>
  )
}

export function RefreshIcon(handle: Handle<IconProps>) {
  return () => (
    <Lucide {...handle.props}>
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </Lucide>
  )
}

export function ShieldCheckIcon(handle: Handle<IconProps>) {
  return () => (
    <Lucide {...handle.props}>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </Lucide>
  )
}

export function CompassIcon(handle: Handle<IconProps>) {
  return () => (
    <Lucide {...handle.props}>
      <circle cx="12" cy="12" r="10" />
      <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z" />
    </Lucide>
  )
}

export function DatabaseZapIcon(handle: Handle<IconProps>) {
  return () => (
    <Lucide {...handle.props}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 15 21.84" />
      <path d="M21 5V8" />
      <path d="M21 12L18 17H22L19 22" />
      <path d="M3 12A9 3 0 0 0 14.59 14.87" />
    </Lucide>
  )
}

export function DiscIcon(handle: Handle<IconProps>) {
  return () => (
    <Lucide {...handle.props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M6 12c0-1.7.7-3.2 1.8-4.2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M18 12c0 1.7-.7 3.2-1.8 4.2" />
    </Lucide>
  )
}

export function ExternalLinkIcon(handle: Handle<IconProps>) {
  return () => (
    <Lucide {...handle.props}>
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </Lucide>
  )
}

export function LayersIcon(handle: Handle<IconProps>) {
  return () => (
    <Lucide {...handle.props}>
      <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
      <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" />
      <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" />
    </Lucide>
  )
}

export function SparklesIcon(handle: Handle<IconProps>) {
  return () => (
    <Lucide {...handle.props}>
      <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
      <path d="M20 2v4" />
      <path d="M22 4h-4" />
      <circle cx="4" cy="20" r="2" />
    </Lucide>
  )
}

export function BookOpenIcon(handle: Handle<IconProps>) {
  return () => (
    <Lucide {...handle.props}>
      <path d="M12 5v16" />
      <path d="M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z" />
    </Lucide>
  )
}

export function UserIcon(handle: Handle<IconProps>) {
  return () => (
    <Lucide {...handle.props}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </Lucide>
  )
}

export function ArrowLeftIcon(handle: Handle<IconProps>) {
  return () => (
    <Lucide {...handle.props}>
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </Lucide>
  )
}

export function SunIcon(handle: Handle<IconProps>) {
  return () => (
    <Lucide {...handle.props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </Lucide>
  )
}

export function MoonIcon(handle: Handle<IconProps>) {
  return () => (
    <Lucide {...handle.props}>
      <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
    </Lucide>
  )
}

export function MonitorIcon(handle: Handle<IconProps>) {
  return () => (
    <Lucide {...handle.props}>
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </Lucide>
  )
}

function Brand(handle: Handle<{ size?: number; children?: RemixNode }>) {
  return () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={handle.props.size ?? 16}
      height={handle.props.size ?? 16}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      {handle.props.children}
    </svg>
  )
}

export function FacebookIcon(handle: Handle<{ size?: number }>) {
  return () => (
    <Brand size={handle.props.size}>
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </Brand>
  )
}

export function GithubIcon(handle: Handle<{ size?: number }>) {
  return () => (
    <Brand size={handle.props.size}>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.338c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </Brand>
  )
}

export function TwitterIcon(handle: Handle<{ size?: number }>) {
  return () => (
    <Brand size={handle.props.size}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </Brand>
  )
}
