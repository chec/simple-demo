import { ErrorMessage } from '@hookform/error-message';
import ErrorMessageContainer from './ErrorMessageContainer';

export default function TestGateway({ form: { register, errors } }) {
  return (
    <div className="checkout__test-gateway">
      <div className="checkout__test-gateway-number">
        <div className="checkout__input-group">
          <input
            type="text"
            id="number"
            name="number"
            maxLength="16"
            placeholder="Credit card number"
            aria-label="Credit card number"
            aria-invalid={errors.number ? 'true' : 'false'}
            defaultValue="4242424242424242"
            ref={register({
              required: { value: true, message: 'A card number is required.' },
              maxLength: { value: 16, message: 'Max length exceeded.' },
              pattern: { value: /^[0-9.]+/i, message: 'Please enter a valid test card number. ie. 4242 4242 4242 4242' },
            })}
            className="checkout__input"
          />
          <ErrorMessage
            errors={errors}
            name="number"
            as={<ErrorMessageContainer />}
            render={({ messages }) => messages
              && Object.entries(messages).map(([type, message]) => (
                <p key={type}>{message}</p>
              ))}
          />
        </div>
        <div className="checkout__input-group">
          <input
            name="cvc"
            type="number"
            id="cvc"
            maxLength="3"
            placeholder="CVC/CCV code"
            aria-label="CVC/CCV code"
            defaultValue="123"
            aria-invalid={errors.cvc ? 'true' : 'false'}
            ref={register({
              required: { value: true, message: 'CVC is required.' },
              maxLength: { value: 4, message: 'Max length exceeded.' },
              pattern: { value: /^[0-9.]+/i, message: 'Please enter a valid cvc.' },
            })}
            className="checkout__input"
          />
          <ErrorMessage
            errors={errors}
            name="cvc"
            as={<ErrorMessageContainer />}
            render={({ messages }) => messages
              && Object.entries(messages).map(([type, message]) => (
                <p key={type}>{message}</p>
              ))}
          />
        </div>
      </div>
      <div className="checkout__test-gateway-details">
        <div className="checkout__input-group">
          <input
            id="expiry_month"
            name="expiry_month"
            type="number"
            maxLength="2"
            placeholder="MM"
            aria-label="Expiry month"
            aria-invalid={errors.expiry_month ? 'true' : 'false'}
            defaultValue="01"
            ref={register({
              required: { value: true, message: 'The expiry month is required.' },
              maxLength: { value: 2, message: 'Max length exceeded.' },
              pattern: { value: /^[0-9.]+/i, message: 'Please enter a valid expiry month.' },
            })}
            className="checkout__input"
          />
          <ErrorMessage
            errors={errors}
            name="expiry_month"
            as={<ErrorMessageContainer />}
            render={({ messages }) => messages
              && Object.entries(messages).map(([type, message]) => (
                <p key={type}>{message}</p>
              ))}
          />
        </div>
        <div className="checkout__input-group">
          <input
            id="expiry_year"
            name="expiry_year"
            type="number"
            placeholder="YYYY"
            maxLength="4"
            defaultValue="24"
            aria-label="Expiry year"
            aria-invalid={errors.expiry_year ? 'true' : 'false'}
            ref={register({
              required: { value: true, message: 'The expiry year is required.' },
              maxLength: { value: 4, message: 'Max length exceeded.' },
              pattern: { value: /^[0-9.]+/i, message: 'Please enter a valid expiry year.' },
            })}
            className="checkout__input"
          />
          <ErrorMessage
            errors={errors}
            name="expiry_year"
            as={<ErrorMessageContainer />}
            render={({ messages }) => messages
              && Object.entries(messages).map(([type, message]) => (
                <p key={type}>{message}</p>
              ))}
          />
        </div>
        <div className="checkout__input-group">
          <input
            name="payment_postal_zip"
            type="text"
            id="payment_postal_zip"
            maxLength="6"
            placeholder="Postal/zip code"
            aria-label="Postal/zip code"
            defaultValue="12345"
            aria-invalid={errors.payment_postal_zip ? 'true' : 'false'}
            ref={register({
              required: { value: true, message: 'Postal/zip code is required.' },
              maxLength: { value: 7, message: 'Max length exceeded.' },
            })}
            className="checkout__input"
          />
          <ErrorMessage
            errors={errors}
            name="payment_postal_zip"
            as={<ErrorMessageContainer />}
            render={({ messages }) => messages
              && Object.entries(messages).map(([type, message]) => (
                <p key={type}>{message}</p>
              ))}
          />
        </div>
      </div>
    </div>
  );
}
