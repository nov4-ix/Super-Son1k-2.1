import { FastifyInstance } from 'fastify'
import Stripe from 'stripe'
import { SupabaseAuthService } from '../services/supabaseAuth'
import { supabaseAuthMiddleware } from '../middleware/supabaseAuth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16'
})

export async function stripeRoutes(fastify: FastifyInstance) {
  const supabaseAuth = new SupabaseAuthService(fastify.prisma)

  // Get available plans
  fastify.get('/plans', async (request, reply) => {
    const plans = [
      {
        id: 'free',
        name: 'FREE',
        price: 0,
        monthlyGenerations: 5,
        dailyGenerations: 2,
        maxDuration: 60,
        quality: 'standard',
        features: ['basic_generation', 'community_access'],
        stripePriceId: null
      },
      {
        id: 'pro',
        name: 'PRO',
        price: 9.99,
        monthlyGenerations: 50,
        dailyGenerations: 10,
        maxDuration: 120,
        quality: 'high',
        features: ['basic_generation', 'community_access', 'priority_support', 'advanced_controls'],
        stripePriceId: process.env.STRIPE_PRO_PRICE_ID
      },
      {
        id: 'premium',
        name: 'PREMIUM',
        price: 29.99,
        monthlyGenerations: 200,
        dailyGenerations: 25,
        maxDuration: 300,
        quality: 'premium',
        features: ['basic_generation', 'community_access', 'priority_support', 'advanced_controls', 'collaboration', 'commercial_use'],
        stripePriceId: process.env.STRIPE_PREMIUM_PRICE_ID
      },
      {
        id: 'enterprise',
        name: 'ENTERPRISE',
        price: 99.99,
        monthlyGenerations: 1000,
        dailyGenerations: 100,
        maxDuration: 600,
        quality: 'enterprise',
        features: ['basic_generation', 'community_access', 'priority_support', 'advanced_controls', 'collaboration', 'commercial_use', 'api_access', 'white_label'],
        stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID
      }
    ]

    return {
      success: true,
      data: plans
    }
  })

  // Create checkout session
  fastify.post('/create-checkout-session', {
    preHandler: [supabaseAuthMiddleware]
  }, async (request, reply) => {
    const user = (request as any).user
    const { planId, successUrl, cancelUrl } = request.body as any

    try {
      const plans = {
        pro: process.env.STRIPE_PRO_PRICE_ID,
        premium: process.env.STRIPE_PREMIUM_PRICE_ID,
        enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID
      }

      const priceId = plans[planId as keyof typeof plans]

      if (!priceId) {
        return reply.code(400).send({
          success: false,
          error: {
            code: 'INVALID_PLAN',
            message: 'Invalid plan selected'
          }
        })
      }

      // Create or get Stripe customer
      let customerId = user.stripeCustomerId

      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            userId: user.id,
            username: user.username
          }
        })
        customerId = customer.id

        // Update user with customer ID
        await fastify.prisma.userTier.update({
          where: { userId: user.id },
          data: { stripeCustomerId: customerId }
        })
      }

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1
          }
        ],
        mode: 'subscription',
        success_url: successUrl || `${process.env.FRONTEND_URL}/dashboard?success=true`,
        cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/pricing?canceled=true`,
        metadata: {
          userId: user.id,
          planId: planId
        }
      })

      return {
        success: true,
        data: {
          sessionId: session.id,
          url: session.url
        }
      }
    } catch (error) {
      console.error('Stripe checkout error:', error)
      return reply.code(400).send({
        success: false,
        error: {
          code: 'CHECKOUT_FAILED',
          message: 'Failed to create checkout session'
        }
      })
    }
  })

  // Create portal session
  fastify.post('/create-portal-session', {
    preHandler: [supabaseAuthMiddleware]
  }, async (request, reply) => {
    const user = (request as any).user
    const { returnUrl } = request.body as any

    try {
      const userTier = await fastify.prisma.userTier.findUnique({
        where: { userId: user.id }
      })

      if (!userTier?.stripeCustomerId) {
        return reply.code(400).send({
          success: false,
          error: {
            code: 'NO_SUBSCRIPTION',
            message: 'No active subscription found'
          }
        })
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: userTier.stripeCustomerId,
        return_url: returnUrl || `${process.env.FRONTEND_URL}/dashboard`
      })

      return {
        success: true,
        data: {
          url: session.url
        }
      }
    } catch (error) {
      console.error('Stripe portal error:', error)
      return reply.code(400).send({
        success: false,
        error: {
          code: 'PORTAL_FAILED',
          message: 'Failed to create portal session'
        }
      })
    }
  })

  // Webhook for Stripe events
  fastify.post('/webhook', async (request, reply) => {
    const sig = request.headers['stripe-signature'] as string
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(request.body as string, sig, webhookSecret)
    } catch (error) {
      console.error('Webhook signature verification failed:', error)
      return reply.code(400).send({
        success: false,
        error: {
          code: 'INVALID_SIGNATURE',
          message: 'Invalid webhook signature'
        }
      })
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
          break

        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
          break

        case 'customer.subscription.deleted':
          await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
          break

        case 'invoice.payment_succeeded':
          await handlePaymentSucceeded(event.data.object as Stripe.Invoice)
          break

        case 'invoice.payment_failed':
          await handlePaymentFailed(event.data.object as Stripe.Invoice)
          break

        default:
          console.log(`Unhandled event type: ${event.type}`)
      }

      return { success: true }
    } catch (error) {
      console.error('Webhook processing error:', error)
      return reply.code(500).send({
        success: false,
        error: {
          code: 'WEBHOOK_FAILED',
          message: 'Webhook processing failed'
        }
      })
    }
  })

  // Helper functions for webhook handling
  async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.userId
    const planId = session.metadata?.planId

    if (!userId || !planId) {
      console.error('Missing metadata in checkout session')
      return
    }

    const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
    
    // Update user tier
    await supabaseAuth.updateUserTier(
      userId,
      planId.toUpperCase(),
      session.customer as string,
      subscription.id
    )

    console.log(`User ${userId} upgraded to ${planId}`)
  }

  async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string
    
    const userTier = await fastify.prisma.userTier.findUnique({
      where: { stripeCustomerId: customerId }
    })

    if (!userTier) {
      console.error('User tier not found for customer:', customerId)
      return
    }

    // Update subscription status
    await fastify.prisma.userTier.update({
      where: { userId: userTier.userId },
      data: {
        subscriptionStatus: subscription.status,
        subscriptionEndDate: new Date(subscription.current_period_end * 1000)
      }
    })

    console.log(`Subscription updated for user ${userTier.userId}: ${subscription.status}`)
  }

  async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string
    
    const userTier = await fastify.prisma.userTier.findUnique({
      where: { stripeCustomerId: customerId }
    })

    if (!userTier) {
      console.error('User tier not found for customer:', customerId)
      return
    }

    // Downgrade to FREE tier
    await supabaseAuth.updateUserTier(userTier.userId, 'FREE')

    console.log(`User ${userTier.userId} downgraded to FREE`)
  }

  async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
    const customerId = invoice.customer as string
    
    const userTier = await fastify.prisma.userTier.findUnique({
      where: { stripeCustomerId: customerId }
    })

    if (!userTier) {
      console.error('User tier not found for customer:', customerId)
      return
    }

    // Reset monthly usage
    await fastify.prisma.userTier.update({
      where: { userId: userTier.userId },
      data: {
        usedThisMonth: 0,
        monthResetAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    })

    console.log(`Payment succeeded for user ${userTier.userId}`)
  }

  async function handlePaymentFailed(invoice: Stripe.Invoice) {
    const customerId = invoice.customer as string
    
    const userTier = await fastify.prisma.userTier.findUnique({
      where: { stripeCustomerId: customerId }
    })

    if (!userTier) {
      console.error('User tier not found for customer:', customerId)
      return
    }

    // Update subscription status
    await fastify.prisma.userTier.update({
      where: { userId: userTier.userId },
      data: {
        subscriptionStatus: 'past_due'
      }
    })

    console.log(`Payment failed for user ${userTier.userId}`)
  }
}
