import Image from 'next/image'
import axios from 'axios'
import { useEffect, useState } from 'react'

import { useCart } from '../../contexts/CartContext'
import { styled } from '../../styles'

const Overlay = styled('div', {
  position: 'fixed',
  inset: 0,
  background:
    'linear-gradient(180deg, rgba(5, 5, 7, 0.2) 0%, rgba(5, 5, 7, 0.72) 100%)',
  zIndex: 40,
  backdropFilter: 'blur(4px)',
})

const Panel = styled('aside', {
  position: 'fixed',
  top: 0,
  right: 0,
  width: 'min(30rem, 100%)',
  height: '100vh',
  background: 'linear-gradient(180deg, rgba(28, 28, 36, 0.98) 0%, rgba(17, 17, 24, 0.98) 100%)',
  zIndex: 50,
  padding: '2.5rem 2rem 2rem',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '-18px 0 60px rgba(0, 0, 0, 0.5)',
  borderLeft: '1px solid rgba(255, 255, 255, 0.06)',
})

const CloseButton = styled('button', {
  alignSelf: 'flex-end',
  background: 'transparent',
  border: 0,
  color: '$gray400',
  fontSize: '$xl',
  lineHeight: 1,
})

const Title = styled('h2', {
  marginTop: '1rem',
  marginBottom: '2rem',
  fontSize: '$lg',
  fontWeight: 700,
})

const ItemsList = styled('ul', {
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  flex: 1,
  overflowY: 'auto',
})

const Item = styled('li', {
  display: 'grid',
  gridTemplateColumns: '5.875rem 1fr',
  gap: '1rem',
  alignItems: 'center',
})

const ImageBox = styled('div', {
  width: '5.875rem',
  height: '5.875rem',
  borderRadius: '$md',
  overflow: 'hidden',
  background: 'linear-gradient(180deg, #1ea483 0%, #7465d4 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const ItemInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem',

  span: {
    color: '$gray400',
    fontSize: '0.95rem',
  },

  strong: {
    fontSize: '$md',
  },
})

const RemoveButton = styled('button', {
  border: 0,
  background: 'transparent',
  color: '$green300',
  fontWeight: 700,
  textAlign: 'left',
  padding: 0,
})

const EmptyState = styled('p', {
  color: '$gray300',
})

const Footer = styled('footer', {
  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  paddingTop: '1.5rem',
  marginTop: '1.5rem',
})

const Row = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  color: '$gray400',

  '& + &': {
    marginTop: '0.5rem',
  },

  strong: {
    color: '$gray100',
    fontSize: '$lg',
  },
})

const CheckoutButton = styled('button', {
  width: '100%',
  marginTop: '2rem',
  border: 0,
  borderRadius: '$md',
  background: 'linear-gradient(180deg, #00b37e 0%, #00875f 100%)',
  color: '$white',
  padding: '1.25rem',
  fontWeight: 700,
  fontSize: '$md',
  boxShadow: '0 18px 32px rgba(0, 179, 126, 0.18)',

  '&:disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
})

export function CartModal() {
  const { cartItems, removeFromCart, cartTotal, cartCount, isCartOpen, setIsCartOpen } = useCart()
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false)

  useEffect(() => {
    document.body.style.overflow = isCartOpen ? 'hidden' : 'auto'

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isCartOpen])

  async function handleCheckout() {
    try {
      setIsCreatingCheckout(true)
      const response = await axios.post('/api/checkout', {
        products: cartItems,
      })
      const { checkoutUrl } = response.data
      window.location.href = checkoutUrl
    } catch {
      setIsCreatingCheckout(false)
      alert('Falha ao redirecionar para o checkout. Tente novamente.')
    }
  }

  if (!isCartOpen) return null

  return (
    <>
      <Overlay onClick={() => setIsCartOpen(false)} />
      <Panel>
        <CloseButton type="button" onClick={() => setIsCartOpen(false)} aria-label="Fechar sacola">
          X
        </CloseButton>
        <Title>Sacola de compras</Title>

        {cartItems.length === 0 ? (
          <EmptyState>Sua sacola esta vazia.</EmptyState>
        ) : (
          <ItemsList>
            {cartItems.map((item) => (
              <Item key={item.id}>
                <ImageBox>
                  <Image src={item.imageUrl} alt={item.name} width={94} height={94} />
                </ImageBox>
                <ItemInfo>
                  <span>{item.name}</span>
                  <strong>{item.price}</strong>
                  <RemoveButton type="button" onClick={() => removeFromCart(item.id)}>
                    Remover
                  </RemoveButton>
                </ItemInfo>
              </Item>
            ))}
          </ItemsList>
        )}

        <Footer>
          <Row>
            <span>Quantidade</span>
            <span>
              {cartCount} {cartCount === 1 ? 'item' : 'itens'}
            </span>
          </Row>
          <Row>
            <strong>Valor total</strong>
            <strong>{cartTotal}</strong>
          </Row>
          <CheckoutButton
            type="button"
            onClick={handleCheckout}
            disabled={isCreatingCheckout || cartItems.length === 0}
          >
            {isCreatingCheckout ? 'Redirecionando...' : 'Finalizar compra'}
          </CheckoutButton>
        </Footer>
      </Panel>
    </>
  )
}
