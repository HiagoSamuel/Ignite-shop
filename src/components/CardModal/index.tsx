// components/CartModal/index.tsx
import { useCart } from '../../contexts/CartContext'
import axios from 'axios'
import { useState } from 'react'

export function CartModal() {
  const { cartItems, removeFromCart, cartTotal, cartCount, isCartOpen, setIsCartOpen } = useCart()
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false)

  async function handleCheckout() {
    try {
      setIsCreatingCheckout(true)
      const response = await axios.post('/api/checkout', {
        products: cartItems,
      })
      const { checkoutUrl } = response.data
      window.location.href = checkoutUrl // redireciona para o Stripe
    } catch (err) {
      setIsCreatingCheckout(false)
      alert('Falha ao redirecionar para o checkout. Tente novamente.')
    }
  }

  if (!isCartOpen) return null

  return (
    <aside>
      <button onClick={() => setIsCartOpen(false)}>✕</button>
      <h2>Sacola de compras</h2>

      <ul>
        {cartItems.map((item) => (
          <li key={item.id}>
            <img src={item.imageUrl} alt={item.name} />
            <div>
              <span>{item.name}</span>
              <strong>{item.price}</strong>
              <button onClick={() => removeFromCart(item.id)}>Remover</button>
            </div>
          </li>
        ))}
      </ul>

      <footer>
        <div>
          <span>Quantidade</span>
          <span>{cartCount} {cartCount === 1 ? 'item' : 'itens'}</span>
        </div>
        <div>
          <strong>Valor total</strong>
          <strong>{cartTotal}</strong>
        </div>
        <button onClick={handleCheckout} disabled={isCreatingCheckout || cartItems.length === 0}>
          {isCreatingCheckout ? 'Aguarde...' : 'Finalizar compra'}
        </button>
      </footer>
    </aside>
  )
}