// pages/index.tsx
import { GetStaticProps } from 'next'
import { stripe } from '../lib/stripe' // instância do Stripe server-side
import { useCart } from '../contexts/CartContext'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  imageUrl: string
  price: string
  defaultPriceId: string
  priceNumber: number
}

interface HomeProps {
  products: Product[]
}

export default function Home({ products }: HomeProps) {
  const { addToCart, isInCart, setIsCartOpen } = useCart()

  function handleAddToCart(product: Product) {
    addToCart({ ...product, quantity: 1 })
    setIsCartOpen(true)
  }

  return (
    <main>
      {products.map((product) => (
        <div key={product.id}>
          <Link href={`/product/${product.id}`} prefetch={false}>
            <Image src={product.imageUrl} alt={product.name} width={520} height={480} />
            <strong>{product.name}</strong>
            <span>{product.price}</span>
          </Link>
          <button
            onClick={() => handleAddToCart(product)}
            disabled={isInCart(product.id)}
          >
            {isInCart(product.id) ? 'Adicionado' : '+ Adicionar'}
          </button>
        </div>
      ))}
    </main>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ['data.default_price'],
  })

  const products = response.data.map((product) => {
    const price = product.default_price as Stripe.Price

    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      price: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format((price.unit_amount ?? 0) / 100),
      priceNumber: price.unit_amount ?? 0,
      defaultPriceId: price.id,
    }
  })

  return {
    props: { products },
    revalidate: 60 * 60 * 2, // revalida a cada 2 horas
  }
}