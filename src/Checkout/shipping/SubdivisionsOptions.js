import { ErrorMessage } from '@hookform/error-message';
import {
  useCheckout,
  useConditionals,
  useShippingSubdivisions,
} from '@chec/react-commercejs-hooks';
import ErrorMessageContainer from '../ErrorMessageContainer';

export default function SubdivisionsOptions({ errors, register, watch }) {
  const checkout = useCheckout();
  const conditionals = useConditionals();
  const shippingSubdivisions = useShippingSubdivisions(watch('country'));

  // Don't render the subdivisions select if we don't need to collect shipping information
  if (!checkout || !conditionals.collects || !conditionals.collects.shipping_address) {
    return null;
  }

  return (
    <div className="checkout__input-group">
      <select
        id="state"
        name="state"
        aria-invalid={errors.name ? 'true' : 'false'}
        aria-label="State/province"
        defaultValue=""
        ref={register({ required: { value: true, message: 'Please select a state/province.' } })}
      >
        <option
          value=""
          disabled
        >
          State/province
        </option>
        { shippingSubdivisions && (
          Object.entries(shippingSubdivisions).map(([key, value]) => (
            <option
              value={key}
              key={key}
            >
              {value}
            </option>
          ))
        ) }
      </select>
      <ErrorMessage
        errors={errors}
        name="state"
        as={<ErrorMessageContainer />}
        render={({ message }) => <p>{message}</p>}
      />
    </div>
  );
}
