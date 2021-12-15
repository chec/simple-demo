import { ErrorMessage } from '@hookform/error-message';
import {
  useConditionals,
} from '@chec/react-commercejs-hooks';
import CountriesOptions from './shipping/CountriesOptions';
import SubdivisionsOptions from './shipping/SubdivisionsOptions';
import ShippingOptions from './shipping/ShippingOptions';
import ErrorMessageContainer from './ErrorMessageContainer';

export default function Shipping({
  form: {
    getValues, errors, register, watch,
  },
}) {
  const conditionals = useConditionals();

  // Don't render the shipping form if we don't need to collect shipping information
  if (!conditionals.collects || !conditionals.collects.shipping_address) {
    return null;
  }

  /**
   * Renders full name fields if required
   *
   * @returns {JSX.element}
   */
  const renderFullNameFields = () => {
    if (!conditionals.collects.fullname) {
      return null;
    }

    return (
      <div className="checkout__input-group">
        <input
          type="text"
          id="fullname"
          name="fullname"
          placeholder="Full name"
          aria-label="Full name"
          aria-invalid={errors.fullname ? 'true' : 'false'}
          ref={register({
            required: { value: true, message: 'Please enter your full name' },
          })}
          className="checkout__input"
        />
        <ErrorMessage
          errors={errors}
          name="fullname"
          as={<ErrorMessageContainer />}
          render={({ messages }) => messages
            && Object.entries(messages).map(([type, message]) => (
              <p key={type}>{message}</p>
            ))}
        />
      </div>
    );
  };

  return (
    <>
      <h3
        className="checkout__subtitle"
      >
        Where are we sending this to?
      </h3>
      { renderFullNameFields() }
      <div className="checkout__input-group">
        <input
          type="text"
          id="street"
          name="street"
          placeholder="Shipping address"
          aria-label="Shipping address"
          aria-invalid={errors.street ? 'true' : 'false'}
          ref={register({
            required: { value: true, message: 'Please enter the shipping street address.' },
          })}
          className="checkout__input"
        />
        <ErrorMessage
          errors={errors}
          name="street"
          as={<ErrorMessageContainer />}
          render={({ messages }) => messages
            && Object.entries(messages).map(([type, message]) => (
              <p key={type}>{message}</p>
            ))}
        />
      </div>
      <div className="checkout__input-group">
        <input
          type="text"
          id="street_2"
          name="street_2"
          placeholder="Apartment, suite, etc. (optional)"
          aria-label="Apartment, suite, etc. (optional)"
          aria-invalid={errors.street_2 ? 'true' : 'false'}
          ref={register({
            minLength: { value: 2, message: 'Must be at least 2 characters.' },
          })}
          className="checkout__input"
        />
        <ErrorMessage
          errors={errors}
          name="street_2"
          as={<ErrorMessageContainer />}
          render={({ message }) => <p>{message}</p>}
        />
      </div>
      <div className="checkout__city-country">
        <div className="checkout__input-group">
          <input
            type="text"
            id="city"
            name="city"
            placeholder="Town/city"
            aria-label="Town/city"
            aria-invalid={errors.city ? 'true' : 'false'}
            ref={register({
              required: { value: true, message: 'Please enter the shipping city.' },
            })}
            className="checkout__input"
          />
          <ErrorMessage
            errors={errors}
            name="city"
            as={<ErrorMessageContainer />}
            render={({ message }) => <p>{message}</p>}
          />
        </div>
        <CountriesOptions
          errors={errors}
          register={register}
        />
      </div>
      <div className="checkout__code-state">
        <div className="checkout__input-group">
          <input
            type="text"
            id="postal_zip"
            name="postal_zip"
            placeholder="Zip/postal code"
            aria-label="Zip/postal code"
            aria-invalid={errors.postal_zip ? 'true' : 'false'}
            ref={register({
              required: { value: true, message: 'Please enter the shipping zip/postal code.' },
              maxLength: { value: 20, message: 'Max length exceeded.' },
            })}
            className="checkout__input"
          />
          <ErrorMessage
            errors={errors}
            name="postal_zip"
            as={<ErrorMessageContainer />}
            render={({ messages }) => messages
              && Object.entries(messages).map(([type, message]) => (
                <p key={type}>{message}</p>
              ))}
          />
        </div>
        <SubdivisionsOptions
          watch={watch}
          getValues={getValues}
          errors={errors}
          register={register}
        />
      </div>
      <ShippingOptions
        watch={watch}
        getValues={getValues}
        errors={errors}
        register={register}
      />
    </>
  );
}
