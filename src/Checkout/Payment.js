import {
  useCheckout,
  useIsFree,
} from '@chec/react-commercejs-hooks';
import StripePayment from './StripePayment';
import TestGateway from './TestGateway';
import stripeLogo from 'bundle-text:./powered-by-stripe.svg';
import isGatewayAvailable from '../isGatewayAvailable';

export default function Payment({ form }) {
  const checkout = useCheckout();
  const isFree = useIsFree();

  if (!checkout) {
    return null;
  }

  // If checkout is free/product value is $0
  // and pay what you want is not enabled
  // then do not render payment fields
  if (isFree && !checkout.has.pay_what_you_want) {
    return null;
  }

  const { gateways } = checkout;

  const renderStripeElement = () => {
    if (!isGatewayAvailable(checkout, 'stripe')) {
      return null;
    }

    return (
      <>
        <div className="checkout__payment-subtitle">
          <h3
            className="checkout__subtitle"
          >
            Payment
          </h3>
          <div className="stripe-logo" dangerouslySetInnerHTML={{ __html: stripeLogo }} />
        </div>
        <StripePayment />
      </>
    );
  };

  const renderTestPaymentElement = () => {
    if (!isGatewayAvailable(checkout, 'test_gateway') || isGatewayAvailable(checkout, 'stripe')) {
      return null;
    }

    return (
      <>
        <h3
          className="checkout__subtitle"
        >
          {payment}
        </h3>
        <TestGateway form={form} />
      </>
    );
  };

  return (
    <>
      { renderStripeElement() }
      { renderTestPaymentElement() }
    </>
  );
}
