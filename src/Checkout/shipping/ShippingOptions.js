import { useEffect, useState } from 'react';
import { ErrorMessage } from '@hookform/error-message';
import {
  useCheckout,
  useShippingOptions,
  useSetShippingOption,
  useConditionals,
} from '@chec/react-commercejs-hooks';
import ErrorMessageContainer from '../ErrorMessageContainer';

export default function ShippingOptions({
  getValues, errors, register, watch,
}) {
  const checkout = useCheckout();
  const conditionals = useConditionals();

  // Early exit if no shipping methods, then don't render shipping dropdown
  // or call useShippingOptions hook
  if (!checkout && !checkout.shipping_methods.length) {
    return null;
  }
  const shippingOptions = useShippingOptions(watch('country'), watch('state'));
  const chooseShipping = useSetShippingOption();

  // Register a side effect for choosing the shipping option if only one exists
  useEffect(() => {
    // Cancel side effect if checkout is not created
    if (!checkout) {
      return;
    }

    if (checkout.live.shipping?.id) {
      return;
    }

    // Cancel this side effect if there's no physical fulfillment configured for the product.
    if (!conditionals.collects || !conditionals.has.physical_delivery) {
      return;
    }

    const { country, state } = getValues(['country', 'state']);

    if (!shippingOptions || typeof country !== 'string' || country === '') {
      return;
    }

    // Pre-select shipping option if there is only one
    if (shippingOptions.length === 1) {
      chooseShipping(shippingOptions[0].id, country, state);
    }

    // Pre-select disabled option to show 'Choose shipping' label
    // when there is more than one shipping option
    if (shippingOptions.length > 1) {
      const disabledOption = document.getElementById('disabled-option');
      if (disabledOption) {
        disabledOption.setAttribute('selected', 'selected');
      }
    }
  }, [shippingOptions]);

  if (!checkout) {
    return null;
  }

  // Don't render the shipping methods select if no physical delivery exists
  if (!conditionals.collects || !conditionals.has.physical_delivery) {
    return null;
  }

  let shippingMethods = [];

  if (conditionals.has && conditionals.has.physical_delivery) {
    shippingMethods = shippingOptions;
  }

  // If country or state are not set yet, dont render the input or message.
  if (!watch('country')?.length || !watch('state')?.length) {
    return null;
  }

  // Render message if shipping options don't exist for the selection.
  if (shippingOptions === null) {
    return null;
  }

  if (shippingOptions.length === 1 && checkout.live.shipping?.id) {
    return null;
  }

  /**
   * Handle shipping option select for multiple shipping options
   */
  const handleShippingOptionChange = (e) => {
    const id = e.target.value;
    const { country, state } = getValues(['country', 'state']);
    chooseShipping(id, country, state);
  };

  return (
    <>
      <h3
        className="checkout__subtitle"
      >
        Shipping method
      </h3>
      <div className="checkout__input-group">
        <select
          id="shipping_method"
          name="shipping_method"
          onChange={handleShippingOptionChange}
          aria-label="Shipping method"
          aria-invalid={errors.shipping_method ? 'true' : 'false'}
          ref={register({ required: { value: true, message: 'Please select a shipping method.' } })}
          className="checkout__shipping-method"
        >
          <option
            value=""
            id="disabled-option"
            disabled
          >
            Choose a shipping method
          </option>
          { shippingMethods && Object.entries(shippingMethods).map(([key, option]) => (
            <option
              value={option.id}
              key={key}
            >
              {`${option.description} - $${option.price.formatted_with_code}` }
            </option>
          )) }
        </select>
        <ErrorMessage
          errors={errors}
          name="shipping_method"
          as={<ErrorMessageContainer />}
          render={({ message }) => <p>{message}</p>}
        />
      </div>
    </>
  );
}
