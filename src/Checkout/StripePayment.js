import { CardElement } from '@stripe/react-stripe-js';

export default function StripePayment() {
  const cardElementOptions = {
    style: {
      base: {
        iconColor: 'rgb(255, 220, 254)',
        color: 'rgb(255, 220, 254)',
        textShadow: '0 0 8px rgb(229, 78, 162)',
        textTransform: 'uppercase',
        fontSmoothing: 'antialiased',
        fontSize: '14px',
        '::placeholder': {
          color: 'rgba(255, 220, 254, 0.6)',
        },
        // boxShadow: boxShadow(), TODO
      },
      invalid: {
        iconColor: 'rgb(241, 153, 153)',
        color: 'rgb(241, 153, 153)',
        textShadow: '0 0 8px rgb(176, 0, 0)',
      },
    },
  };

  return (
    <div
      className="checkout__stripe-element"
    >
      <CardElement options={cardElementOptions} />
    </div>
  );
}
