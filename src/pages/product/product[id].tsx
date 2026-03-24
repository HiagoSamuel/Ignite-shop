// pages/product/[id].tsx
import { GetStaticPaths, GetStaticProps } from 'next'
import { stripe } from '../../lib/stripe'
import { useCart } from '../../contexts/CartContext'

export default function Product({ product }) {
  const { addToCart, isInCart, setIsCartOpen } = useCart()

  function handleAddToCart() {
    addToCart({ ...product, quantity: 1 })
    setIsCartOpen(true)
  }

  return (
    <div>
      <img src={product.imageUrl} alt={product.name} />
      <h1>{product.name}</h1>
      <span>{product.price}</span>
      <p>{product.description}</p>
      <button onClick={handleAddToCart} disabled={isInCart(product.id)}>
        Adicionar à sacola
      </button>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Pré-gera apenas os produtos mais acessados
  return {
    paths: [],
    fallback: 'blocking', // gera a página na 1ª visita e cacheia
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const productId = params?.id as string

  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price'],
  })
  const price = product.default_price as Stripe.Price

  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        description: product.description,
        price: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format((price.unit_amount ?? 0) / 100),
        priceNumber: price.unit_amount ?? 0,
        defaultPriceId: price.id,
      },
    },
    revalidate: 60 * 60 * 1,
  }
}