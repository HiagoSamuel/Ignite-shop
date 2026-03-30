import { NextApiRequest, NextApiResponse } from 'next'

import { CartItem } from '../../contexts/CartContext'
import { stripe, withStripeTimeout } from '../../lib/stripe'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { products } = req.body as { products?: CartItem[] }

  if (!products || products.length === 0) {
    return res.status(400).json({ error: 'Carrinho vazio.' })
  }

  const baseUrl = process.env.NEXT_URL ?? process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'
  const successUrl = `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`
  const cancelUrl = `${baseUrl}/`

  try {
    const checkoutSession = await withStripeTimeout(
      stripe.checkout.sessions.create({
        success_url: successUrl,
        cancel_url: cancelUrl,
        mode: 'payment',
        line_items: products.map((product) => ({
          price: product.defaultPriceId,
          quantity: product.quantity,
        })),
      }),
    )

    if (!checkoutSession.url) {
      return res.status(500).json({ error: 'Checkout URL not generated.' })
    }

    return res.status(201).json({ checkoutUrl: checkoutSession.url })
  } catch (error) {
    console.error('Failed to create Stripe checkout session.', error)
    return res.status(500).json({ error: 'Nao foi possivel iniciar o checkout.' })
  }
}
