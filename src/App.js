import { useEffect, useState } from 'react';
import { CheckoutProvider, CommerceProvider } from '@chec/react-commercejs-hooks';
import Checkout from './Checkout';
import WithStripeElements from './Checkout/WithStripeElements';

export default function App() {
  const productId = process.env.PRODUCT_ID;

  // const [productId, setProductId] = useState(process.env.PRODUCT_ID);
  //
  // useEffect(() => {
  //   ue4.listen(function ({ event, payload }) {
  //     if (event === 'set-product') {
  //       setProductId(payload);
  //     }
  //   })
  // }, []);

  return (
    <CommerceProvider
      publicKey={process.env.CHEC_API_KEY}
      options={{
        url: process.env.CHEC_API_URL || 'https://api.chec.io/',
      }}
    >
      <CheckoutProvider
        type="product_id"
        id={productId}
      >
        <WithStripeElements>
          <Checkout />
        </WithStripeElements>
      </CheckoutProvider>
    </CommerceProvider>
  )
}

export const bar = 'baz';
