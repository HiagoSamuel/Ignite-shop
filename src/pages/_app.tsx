import type { AppProps } from 'next/app'

import { CartModal } from '../components/CardModal'
import { CartProvider } from '../contexts/CartContext'
import { useCart } from '../contexts/CartContext'
import { globalStyles, styled } from '../styles'

globalStyles()

type AppContentProps = Pick<AppProps, 'Component' | 'pageProps'>

const AppShell = styled('div', {
  minHeight: '100vh',
  padding: '0.75rem',
  borderTop: '10px solid $mint500',
})

const AppFrame = styled('div', {
  minHeight: 'calc(100vh - 1.5rem)',
  background: 'linear-gradient(180deg, rgba(22, 22, 29, 0.98) 0%, rgba(9, 9, 12, 0.98) 100%)',
  borderRadius: '$lg',
  boxShadow: '0 30px 120px rgba(0, 0, 0, 0.42)',
  position: 'relative',
  overflow: 'hidden',
})

const Brand = styled('div', {
  position: 'absolute',
  top: '2rem',
  left: '2rem',
  zIndex: 20,
  display: 'flex',
  alignItems: 'center',
  gap: '0.85rem',

  '@sm': {
    top: '1.25rem',
    left: '1.25rem',
  },
})

const BrandSymbol = styled('div', {
  width: '1.65rem',
  height: '1.65rem',
  background: 'linear-gradient(180deg, $mint500 0%, $green500 100%)',
  clipPath: 'polygon(0 18%, 100% 0, 68% 100%)',
  transform: 'skew(-12deg)',
  boxShadow: '0 0 24px rgba(102, 230, 209, 0.28)',
})

const BrandText = styled('div', {
  lineHeight: 1,

  strong: {
    display: 'block',
    fontSize: '$xl',
    letterSpacing: '-0.03em',
  },

  span: {
    display: 'block',
    marginTop: '0.15rem',
    color: '$gray400',
    fontSize: '$sm',
    fontWeight: 700,
    textTransform: 'lowercase',
  },
})

const FloatingCartButton = styled('button', {
  position: 'fixed',
  top: '2rem',
  right: '2rem',
  zIndex: 30,
  border: 0,
  borderRadius: '$pill',
  backgroundColor: 'rgba(32, 32, 42, 0.96)',
  color: '$gray100',
  minWidth: '4.5rem',
  height: '4rem',
  padding: '0 1.2rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '$sm',
  fontWeight: 700,
  boxShadow: '0 18px 40px rgba(0, 0, 0, 0.38)',
  gap: '0.5rem',
  backdropFilter: 'blur(14px)',

  '@sm': {
    top: '1.25rem',
    right: '1.25rem',
  },

  '& span': {
    minWidth: '1.5rem',
    height: '1.5rem',
    padding: '0 0.35rem',
    borderRadius: 9999,
    backgroundColor: '$green300',
    color: '$gray900',
    fontSize: '$sm',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

function AppContent({ Component, pageProps }: AppContentProps) {
  const { cartCount, setIsCartOpen } = useCart()

  return (
    <AppShell>
      <AppFrame>
        <Brand>
          <BrandSymbol />
          <BrandText>
            <strong>ignite</strong>
            <span>shop</span>
          </BrandText>
        </Brand>

        <FloatingCartButton
          type="button"
          onClick={() => setIsCartOpen(true)}
          aria-label="Abrir sacola"
        >
          Sacola
          {cartCount > 0 && <span>{cartCount}</span>}
        </FloatingCartButton>
        <Component {...pageProps} />
        <CartModal />
      </AppFrame>
    </AppShell>
  )
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CartProvider>
      <AppContent Component={Component} pageProps={pageProps} />
    </CartProvider>
  )
}
