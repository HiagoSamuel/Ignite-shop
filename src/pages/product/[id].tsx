import Image from 'next/image'
import { GetStaticPaths, GetStaticProps } from 'next'
import Stripe from 'stripe'

import { useCart } from '../../contexts/CartContext'
import { stripe, withStripeTimeout } from '../../lib/stripe'
import { styled } from '../../styles'

interface ProductData {
  id: string
  name: string
  imageUrl: string
  description: string | null
  price: string
  priceNumber: number
  defaultPriceId: string
  quantity: number
}

interface ProductProps {
  product: ProductData
}

const ProductContainer = styled('main', {
  maxWidth: 1280,
  margin: '0 auto',
  minHeight: '100vh',
  padding: '7rem 2rem 3rem',
  display: 'grid',
  gridTemplateColumns: 'minmax(20rem, 42rem) minmax(18rem, 30rem)',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '3rem',

  '@md': {
    gridTemplateColumns: '1fr',
    padding: '6rem 1.25rem 2rem',
  },
})

const ProductImageBox = styled('div', {
  borderRadius: '$lg',
  background:
    'linear-gradient(180deg, rgba(0, 179, 126, 0.94) 0%, rgba(78, 168, 222, 0.72) 55%, rgba(27, 27, 68, 0.96) 100%)',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 540,
  padding: '2rem',
  boxShadow: '0 26px 60px rgba(0, 0, 0, 0.34)',

  '@md': {
    minHeight: 420,
  },
})

const ProductDetails = styled('section', {
  display: 'flex',
  flexDirection: 'column',
  minHeight: 540,
  maxWidth: 420,

  h1: {
    fontSize: '$3xl',
    lineHeight: 1.02,
    letterSpacing: '-0.05em',
  },

  span: {
    marginTop: '1rem',
    color: '$green300',
    fontSize: '$2xl',
    fontWeight: 700,
  },

  p: {
    marginTop: '2rem',
    color: '$gray400',
    lineHeight: 1.6,
  },
})

const AddButton = styled('button', {
  marginTop: 'auto',
  border: 0,
  borderRadius: '$md',
  padding: '1.25rem',
  background: 'linear-gradient(180deg, #00b37e 0%, #00875f 100%)',
  color: '$white',
  fontWeight: 700,
  fontSize: '$md',
  boxShadow: '0 18px 32px rgba(0, 179, 126, 0.18)',

  '&:disabled': {
    backgroundColor: '$gray300',
    color: '$gray800',
    cursor: 'not-allowed',
  },
})

export default function Product({ product }: ProductProps) {
  const { addToCart, isInCart, setIsCartOpen } = useCart()

  function handleAddToCart() {
    addToCart(product)
    setIsCartOpen(true)
  }

  return (
    <ProductContainer>
      <ProductImageBox>
        <Image src={product.imageUrl} alt={product.name} width={520} height={480} priority />
      </ProductImageBox>
      <ProductDetails>
        <h1>{product.name}</h1>
        <span>{product.price}</span>
        <p>{product.description}</p>
        <AddButton type="button" onClick={handleAddToCart} disabled={isInCart(product.id)}>
          {isInCart(product.id) ? 'Item já está na sacola' : 'Adicionar à sacola'}
        </AddButton>
      </ProductDetails>
    </ProductContainer>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<ProductProps> = async ({ params }) => {
  const productId = params?.id as string

  try {
    const product = await withStripeTimeout(
      stripe.products.retrieve(productId, {
        expand: ['default_price'],
      }),
    )
    const price = product.default_price as Stripe.Price

    return {
      props: {
        product: {
          id: product.id,
          name: product.name,
          imageUrl: product.images[0] ?? '',
          description: product.description,
          price: new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format((price.unit_amount ?? 0) / 100),
          priceNumber: price.unit_amount ?? 0,
          defaultPriceId: price.id,
          quantity: 1,
        },
      },
      revalidate: 60 * 60,
    }
  } catch (error) {
    console.error(`Failed to load product ${productId} from Stripe.`, error)

    return {
      notFound: true,
      revalidate: 60,
    }
  }
}
