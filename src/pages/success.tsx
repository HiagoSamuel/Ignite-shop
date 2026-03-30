import Image from 'next/image'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import Stripe from 'stripe'

import { stripe, withStripeTimeout } from '../lib/stripe'
import { styled } from '../styles'

interface SuccessProps {
  customerName: string
  productsImages: string[]
}

const SuccessContainer = styled('main', {
  maxWidth: 720,
  margin: '0 auto',
  minHeight: '100vh',
  padding: '6rem 1.5rem 3rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',

  h1: {
    fontSize: '$2xl',
  },

  p: {
    marginTop: '2rem',
    color: '$gray300',
    lineHeight: 1.6,
    fontSize: '$md',
  },

  a: {
    marginTop: '2rem',
    color: '$green300',
    fontWeight: 700,
  },
})

const ImagesRow = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '1rem',
  marginTop: '2rem',
})

const ImageBox = styled('div', {
  width: '8.75rem',
  height: '8.75rem',
  borderRadius: 9999,
  overflow: 'hidden',
  background: 'linear-gradient(180deg, #1ea483 0%, #7465d4 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export default function Success({ customerName, productsImages }: SuccessProps) {
  return (
    <SuccessContainer>
      <h1>Compra efetuada!</h1>
      <ImagesRow>
        {productsImages.map((image, index) => (
          <ImageBox key={`${image}-${index}`}>
            <Image src={image} alt="" width={140} height={140} />
          </ImageBox>
        ))}
      </ImagesRow>
      <p>
        Uhuul, <strong>{customerName}</strong>, sua compra foi concluida com sucesso!
      </p>
      <Link href="/">Voltar ao catalogo</Link>
    </SuccessContainer>
  )
}

export const getServerSideProps: GetServerSideProps<SuccessProps> = async ({ query }) => {
  const sessionId = query.session_id as string

  if (!sessionId) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  try {
    const session = await withStripeTimeout(
      stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['line_items', 'line_items.data.price.product'],
      }),
    )

    const customerName = session.customer_details?.name ?? 'Cliente'
    const productsImages =
      session.line_items?.data
        .map((item) => {
          const product = item.price?.product as Stripe.Product
          return product.images[0] ?? ''
        })
        .filter(Boolean) ?? []

    return {
      props: {
        customerName,
        productsImages,
      },
    }
  } catch (error) {
    console.error(`Failed to load checkout session ${sessionId}.`, error)

    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
}
