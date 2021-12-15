import { ErrorMessage } from '@hookform/error-message';
import {
  useCheckout,
  useShippingCountries,
  useConditionals,
  useAllCountries,
} from '@chec/react-commercejs-hooks';
import ErrorMessageContainer from '../ErrorMessageContainer';

export default function CountriesOptions({ errors, register }) {
  const checkout = useCheckout();
  const conditionals = useConditionals();
  const shippingCountries = useShippingCountries();
  const countries = useAllCountries();

  // If no checkout, don't render country options
  if (!checkout) {
    return null;
  }

  // Don't render the countries select if we don't need to collect shipping information
  if (!conditionals.collects || !conditionals.collects.shipping_address) {
    return null;
  }

  let countriesOptions = [];

  if (!shippingCountries || !shippingCountries.length) {
    countriesOptions = countries;
  } else {
    countriesOptions = shippingCountries;
  }

  return (
    <div className="checkout__input-group">
      <select
        id="country"
        name="country"
        aria-invalid={errors.country ? 'true' : 'false'}
        aria-label="Country"
        defaultValue=""
        ref={register({ required: { value: true, message: 'Please select a country.' } })}
      >
        <option
          value=""
          disabled
        >
          Country
        </option>
        { countriesOptions && Object.entries(countriesOptions).map(([key, value]) => (
          <option
            value={key}
            key={key}
          >
            {value}
          </option>
        )) }
      </select>
      <ErrorMessage
        errors={errors}
        name="country"
        as={<ErrorMessageContainer />}
        render={({ message }) => <p>{message}</p>}
      />
    </div>
  );
}
