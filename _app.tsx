import type { AppProps } from 'next/app'
import { CartProvider } from '../contexts/CartContext'
import { globalStyles } from '../styles/global'

globalStyles() // aplica estilos globais

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CartProvider>
      <Component {...pageProps} />
    </CartProvider>
  )
}