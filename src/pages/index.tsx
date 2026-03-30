import Image from 'next/image'
import Link from 'next/link'
import { GetStaticProps } from 'next'
import Stripe from 'stripe'

import { useCart } from '../contexts/CartContext'
import { stripe, withStripeTimeout } from '../lib/stripe'
import { styled } from '../styles'

interface Product {
  id: string
  name: string
  imageUrl: string
  price: string
  defaultPriceId: string
  priceNumber: number
  quantity: number
}

interface HomeProps {
  products: Product[]
  productsUnavailable: boolean
}

const HomeContainer = styled('main', {
  maxWidth: 1280,
  margin: '0 auto',
  padding: '7rem 2rem 3rem',

  '@sm': {
    padding: '6rem 1.25rem 2rem',
  },
})

const Intro = styled('section', {
  display: 'flex',
  alignItems: 'end',
  justifyContent: 'space-between',
  gap: '2rem',
  marginBottom: '2.5rem',

  '@md': {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
})

const Heading = styled('div', {
  maxWidth: 640,

  small: {
    display: 'inline-block',
    marginBottom: '1rem',
    color: '$mint500',
    textTransform: 'uppercase',
    letterSpacing: '0.18em',
    fontSize: '0.72rem',
    fontWeight: 700,
  },

  h1: {
    fontSize: '$3xl',
    lineHeight: 1.02,
    letterSpacing: '-0.06em',
  },

  p: {
    marginTop: '1rem',
    color: '$gray400',
    lineHeight: 1.7,
    maxWidth: 520,
  },
})

const MetaCard = styled('div', {
  minWidth: 220,
  padding: '1.25rem 1.4rem',
  borderRadius: '$lg',
  background: 'linear-gradient(180deg, rgba(21, 21, 29, 0.94) 0%, rgba(14, 14, 20, 0.94) 100%)',
  border: '1px solid rgba(255, 255, 255, 0.06)',

  span: {
    display: 'block',
    color: '$gray400',
    fontSize: '$sm',
  },

  strong: {
    display: 'block',
    marginTop: '0.4rem',
    fontSize: '$2xl',
    color: '$mint500',
  },
})

const ProductGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))',
  gap: '2.25rem',
})

const ProductCard = styled('div', {
  background: 'linear-gradient(180deg, rgba(23, 23, 29, 0.96) 0%, rgba(11, 11, 16, 0.96) 100%)',
  borderRadius: '$lg',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  transition: 'transform 0.2s ease, border-color 0.2s ease',

  '&:hover': {
    transform: 'translateY(-6px)',
    borderColor: 'rgba(102, 230, 209, 0.26)',
  },
})

const ProductLink = styled(Link, {
  padding: '1.5rem 1.5rem 1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
})

const ProductImageBox = styled('div', {
  minHeight: 340,
  borderRadius: '$md',
  overflow: 'hidden',
  background: 'linear-gradient(180deg, rgba(0, 179, 126, 0.94) 0%, rgba(78, 168, 222, 0.72) 55%, rgba(27, 27, 68, 0.96) 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1.5rem',
})

const ProductName = styled('strong', {
  fontSize: '$lg',
  lineHeight: 1.4,
  letterSpacing: '-0.02em',
})

const ProductPrice = styled('span', {
  color: '$green300',
  fontSize: '$xl',
  fontWeight: 700,
})

const AddButton = styled('button', {
  margin: '0 1.5rem 1.5rem',
  border: 0,
  borderRadius: '$md',
  padding: '1rem',
  background: 'linear-gradient(180deg, #00b37e 0%, #00875f 100%)',
  color: '$white',
  fontWeight: 700,
  boxShadow: '0 18px 32px rgba(0, 179, 126, 0.18)',

  '&:disabled': {
    backgroundColor: '$gray300',
    color: '$gray800',
    cursor: 'not-allowed',
  },
})

const EmptyState = styled('div', {
  minHeight: '50vh',
  display: 'grid',
  placeItems: 'center',
  textAlign: 'center',
  color: '$gray300',

  p: {
    maxWidth: 420,
    lineHeight: 1.6,
  },
})

export default function Home({ products, productsUnavailable }: HomeProps) {
  const { addToCart, isInCart, setIsCartOpen } = useCart()

  function handleAddToCart(product: Product) {
    addToCart(product)
    setIsCartOpen(true)
  }

  return (
    <HomeContainer>
      <Intro>
        <Heading>
          <small>ignite shop</small>
          <h1>Uma vitrine mais forte para seus produtos favoritos.</h1>
          <p>
            Explore pecas com visual editorial, checkout rapido e uma sacola lateral no estilo
            do mock original do Ignite Shop.
          </p>
        </Heading>
        <MetaCard>
          <span>Catalogo carregado</span>
          <strong>{products.length} itens</strong>
        </MetaCard>
      </Intro>

      {products.length === 0 ? (
        <EmptyState>
          <p>
            {productsUnavailable
              ? 'Nao foi possivel carregar os produtos agora. Confira sua conexao e as chaves do Stripe, depois recarregue a pagina.'
              : 'Nenhum produto foi encontrado no momento.'}
          </p>
        </EmptyState>
      ) : (
        <ProductGrid>
          {products.map((product) => (
            <ProductCard key={product.id}>
              <ProductLink href={`/product/${product.id}`} prefetch={false}>
                <ProductImageBox>
                  <Image src={product.imageUrl} alt={product.name} width={520} height={480} />
                </ProductImageBox>
                <ProductName>{product.name}</ProductName>
                <ProductPrice>{product.price}</ProductPrice>
              </ProductLink>
              <AddButton
                type="button"
                onClick={() => handleAddToCart(product)}
                disabled={isInCart(product.id)}
              >
                {isInCart(product.id) ? 'Adicionado na sacola' : 'Adicionar na sacola'}
              </AddButton>
            </ProductCard>
          ))}
        </ProductGrid>
      )}
    </HomeContainer>
  )
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  try {
    const response = await withStripeTimeout(
      stripe.products.list({
        expand: ['data.default_price'],
      }),
    )

    const products = response.data.map((product) => {
      const price = product.default_price as Stripe.Price

      return {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0] ?? '',
        price: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format((price.unit_amount ?? 0) / 100),
        priceNumber: price.unit_amount ?? 0,
        defaultPriceId: price.id,
        quantity: 1,
      }
    })

    return {
      props: {
        products,
        productsUnavailable: false,
      },
      revalidate: 60 * 60 * 2,
    }
  } catch (error) {
    console.error('Failed to load Stripe products for the home page.', error)

    return {
      props: {
        products: [],
        productsUnavailable: true,
      },
      revalidate: 60,
    }
  }
}
