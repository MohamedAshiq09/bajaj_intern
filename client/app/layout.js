import './globals.css'

export const metadata = {
  title: 'BFHL Hierarchy Analyzer',
  description: 'Bajaj Finserv Health Challenge',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
