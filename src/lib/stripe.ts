import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
  appInfo: {
    name: 'Ignite Shop',
  },
})

const STRIPE_TIMEOUT_IN_MS = 8000

export async function withStripeTimeout<T>(promise: Promise<T>, timeoutInMs = STRIPE_TIMEOUT_IN_MS) {
  return Promise.race<T>([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Stripe request timed out.'))
      }, timeoutInMs)
    }),
  ])
}
