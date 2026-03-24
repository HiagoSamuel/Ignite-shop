// pages/success.tsx
import { GetServerSideProps } from 'next'
import { stripe } from '../lib/stripe'
import Link from 'next/link'

interface SuccessProps {
  customerName: string
  productsImages: string[]
}

export default function Success({ customerName, productsImages }: SuccessProps) {
  return (
    <div>
      <h1>Compra efetuada!</h1>
      <div>
        {productsImages.map((image, i) => (
          <img key={i} src={image} alt="" />
        ))}
      </div>
      <p>
        Uhuul, <strong>{customerName}</strong>, sua compra foi concluída com sucesso!
      </p>
      <Link href="/">Voltar ao catálogo</Link>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const sessionId = query.session_id as string

  if (!sessionId) {
    return { redirect: { destination: '/', permanent: false } }
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'line_items.data.price.product'],
  })

  const customerName = session.customer_details?.name ?? 'Cliente'

  const productsImages = session.line_items?.data.map((item) => {
    const product = item.price?.product as Stripe.Product
    return product.images[0]
  }) ?? []

  return {
    props: { customerName, productsImages },
  }
}