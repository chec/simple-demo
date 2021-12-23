import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  useConditionals,
  useCapture,
  useCheckout,
  useCaptureWithStripe,
  useIsFree,
} from '@chec/react-commercejs-hooks';
import ErrorSummary from './Checkout/ErrorSummary';
import Customer from './Checkout/Customer';
import Shipping from './Checkout/Shipping';
import Payment from './Checkout/Payment';
import PurchaseButton from './Checkout/PurchaseButton';
import ProductOptions from './Checkout/ProductOptions';
import isGatewayAvailable from './isGatewayAvailable';
import ShippingOverview from './Checkout/ShippingOverview';
import PaymentMethodSelector from './Checkout/PaymentMethodSelector';

export default function Checkout() {
  const form = useForm({ criteriaMode: 'all', shouldFocusError: true });
  const [capturing, setCapturing] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
  const [order, setOrder] = useState();
  const [serverErrors, setServerErrors] = useState([]);
  const {
    handleSubmit,
    errors,
    formState: { isSubmitting, isSubmitSuccessful },
  } = form;
  const checkout = useCheckout();
  const conditionals = useConditionals();
  const captureWithStripe = useCaptureWithStripe();
  const capture = useCapture();
  const isFree = useIsFree();

  if (!checkout) {
    return 'Loading...';
  }

  if (order) {
    console.log('hey unreal. we done here');
    return <div>Order complete</div>
  }

  /**
   * Handle a Commerce.js checkout capture request
   *
   * @param {object} detail
   * @returns {Promise}
   */
  const dispatchCapture = async (detail) => {
    try {
      if (isGatewayAvailable(checkout, 'stripe')) {
        // SCA is handled internally by the hook
        return await captureWithStripe(detail);
      }
      // Standard checkout.capture()
      return await capture(detail);
    } catch (error) {
      // Handle errors from Stripe SCA
      if (error?.code === 'payment_intent_authentication_failure') {
        setServerErrors([error.message]);
        return null;
      }

      // It might be nested objects referencing specific fields, and an array of error messages
      if (error.statusCode === 422 && typeof error?.data?.error?.errors !== 'undefined') {
        const captureErrors = Object.values(error.data.error.errors).reduce((acc, value) => {
          value.map((captureError) => acc.push(captureError));
          return acc;
        });
        setServerErrors(captureErrors);
        return null;
      }

      // Sometimes it will be a flat string error eg. 402 errors
      if (typeof error.data.error.message !== 'undefined') {
        setServerErrors([error.data.error.message]);
        return null;
      }

      // Some other kind of exception, e.g. server error
      setServerErrors(['Something went wrong, please try again.']);
    }
    return null;
  };

  const onSubmit = async (data) => {
    // Define shipping to store shipping object
    let shipping;

    // If shipping needs to be collected, store in a shipping object
    if (conditionals.collects.shipping_address) {
      shipping = {
        name: Object.hasOwnProperty.call(data, 'fullname') ? data.fullname : `${data.first_name} ${data.last_name}`,
        street: data.street,
        street_2: data.street_2,
        town_city: data.city,
        county_state: data.state,
        postal_zip_code: data.postal_zip,
        country: data.country,
      };
    }

    // Define billing to either store same shipping data
    // or billing data from billing fields
    let billing;

    // If billing is required and if sameBilling is true
    // with checked as the default state
    if (conditionals.collects.billing_address) {
      billing = shipping;
    }

    let payment;

    // Because payment fields will not render when checkout is free,
    // Send an empty payment object
    if (isFree && !checkout.has.pay_what_you_want) {
      payment = {}
      // If checkout is not free, collect data from the payment fields
    } else {
      payment = {
        gateway: 'test_gateway',
        card: {
          number: data.number,
          expiry_month: data.expiry_month,
          expiry_year: data.expiry_year,
          cvc: data.cvc,
          postal_zip_code: data.payment_postal_zip,
        },
      };
    }

    const detail = {
      customer: {
        firstname: data.first_name,
        lastname: data.last_name,
        email: data.email,
        phone: data.phone,
      },
      fulfillment: {
        shipping_method: data.shipping_method ?? '',
      },
      extrafields: data.extrafields ?? [],
      payment,
      shipping,
      billing,
    };

    const pwyw = data.pay_what_you_want;
    if (pwyw !== undefined && pwyw !== null) {
      detail.pay_what_you_want = pwyw;
    }

    setCapturing(true);

    // Dispatch capture hook to capture checkout with checkout data
    const orderResponse = await dispatchCapture(detail);

    // Sets order to true and resets setServerErrors
    setCapturing(false);
    if (orderResponse) {
      setOrder(orderResponse);
      setServerErrors(null);
    }
  };

  const hasShipping = checkout?.live.shipping?.id !== undefined;

  /**
   * If there are any errors returned from the API after form
   * submission, render server error(s) as a list
   *
   * @returns {JSX.Element}
   */
  const renderServerErrorMessage = () => {
    if (!serverErrors || !serverErrors.length) {
      return null;
    }

    return (
      <div
        className="error-summary error-summary--payment"
      >
        { serverErrors.length === 1 && (
          <p className="error-summary__title">
            There was an error with the form submission. Please edit the form and try again.
          </p>
        )}
        { serverErrors.length > 1 && (
          <p className="error-summary__title">
            There were some errors with the form submission. Please edit the form and try again.
          </p>
        )}
        <ul className="error-summary__list">
          { serverErrors.map((error, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={i}>{error}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <form
      action=""
      className="checkout__form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <ProductOptions product={checkout.products[0]} />
      <div>
        <h1>Checkout</h1>
        <ErrorSummary errors={errors} />
        { showShipping || (
          <>
            <Customer form={form} />
            <div className="checkout__payment-and-address">
              <div><PaymentMethodSelector /></div>
              <div><ShippingOverview /></div>
            </div>
          </>
        )}
        { showShipping && <Shipping form={form} /> }
        <Payment form={form} />
        { renderServerErrorMessage() }
        <PurchaseButton
          form={form}
          // eslint-disable-next-line no-mixed-operators
          processing={isSubmitting || capturing && !isSubmitSuccessful}
          disabled={checkout?.has.physical_delivery && !hasShipping}
        />
      </div>
    </form>
  )
}
