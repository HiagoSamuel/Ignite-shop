import { createContext, useContext, useState, ReactNode } from 'react'

interface CartItem {
  id: string
  name: string
  imageUrl: string
  price: string        // formatado: "R$ 79,90"
  priceNumber: number  // em centavos: 7990
  defaultPriceId: string
  quantity: number
}

interface CartContextData {
  cartItems: CartItem[]
  cartCount: number
  cartTotal: string
  addToCart: (item: CartItem) => void
  removeFromCart: (itemId: string) => void
  isInCart: (itemId: string) => boolean
  isCartOpen: boolean
  setIsCartOpen: (value: boolean) => void
}

const CartContext = createContext({} as CartContextData)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  const cartTotal = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cartItems.reduce((acc, item) => acc + item.priceNumber * item.quantity, 0) / 100)

  function addToCart(newItem: CartItem) {
    setCartItems((state) => {
      const itemAlreadyInCart = state.find((item) => item.id === newItem.id)
      if (itemAlreadyInCart) {
        // Incrementa quantidade em vez de duplicar
        return state.map((item) =>
          item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...state, { ...newItem, quantity: 1 }]
    })
  }

  function removeFromCart(itemId: string) {
    setCartItems((state) => state.filter((item) => item.id !== itemId))
  }

  function isInCart(itemId: string) {
    return cartItems.some((item) => item.id === itemId)
  }

  return (
    <CartContext.Provider
      value={{ cartItems, cartCount, cartTotal, addToCart, removeFromCart, isInCart, isCartOpen, setIsCartOpen }}
    >
      {children}
    </CartContext.Provider>
  )
}

// Hook personalizado — boa prática!
export const useCart = () => useContext(CartContext)