import { useEffect, useState } from 'react';
import { useCheckout } from '@chec/react-commercejs-hooks';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import isGatewayAvailable from '../isGatewayAvailable';

/**
 * "Maybe" wraps the children of this component with a Stripe Elements provider, based on whether
 * the checkout supports stripe.
 */
export default function WithStripeElements({ children }) {
  const [stripePromise, setStripePromise] = useState();
  const checkout = useCheckout();

  useEffect(() => {
    if (!checkout || !isGatewayAvailable(checkout, 'stripe')) {
      return;
    }

    console.log(checkout.gateways);

    const stripeKey = checkout.gateways.find((candidate) => candidate.code === 'stripe').config.publishable_key;

    if (stripePromise || !stripeKey) {
      return;
    }

    setStripePromise(loadStripe(stripeKey));
  }, [checkout]);

  // Show nothing while the checkout is loading
  if (!checkout) {
    return children;
  }

  // Skip wrapping in the Stripe provider if Stripe isn't supported
  if (!isGatewayAvailable(checkout, 'stripe')) {
    return children;
  }

  // Show nothing if we're waiting for Stripe to load
  if (!stripePromise) {
    return null;
  }

  return <Elements stripe={stripePromise}>{ children }</Elements>;
}
