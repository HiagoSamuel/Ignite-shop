// src/lib/stripe.ts
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  appInfo: {
    name: 'Ignite Shop',
  },
})
```

---

## 🧭 Fluxo Completo Resumido
```
Home (SSG)
  └─ Usuário clica em produto → Página de produto (SSG + fallback)
       └─ Clica "Adicionar à sacola" → CartContext.addToCart()
            └─ Abre CartModal → lista itens
                 └─ Clica "Finalizar compra"
                      └─ POST /api/checkout (server)
                           └─ stripe.checkout.sessions.create()
                                └─ redirect → Stripe Checkout
                                     └─ Pagamento → success?session_id=xxx (SSR)