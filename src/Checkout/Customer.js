import { ErrorMessage } from '@hookform/error-message';
import ErrorMessageContainer from './ErrorMessageContainer';

export default function Customer({ form: { register, errors }, extrafields }) {
  return (
    <>
      <div className="checkout__input-group">
        <input
          type="text"
          name="name"
          placeholder="Name"
          aria-label="Name"
          aria-invalid={errors.name ? 'true' : 'false'}
          ref={register({
            required: { value: true, message: 'Please enter your name.' },
            maxLength: { value: 50, message: 'Max length exceeded.' },
            minLength: { value: 2, message: 'Must be at least 2 characters.' },
          })}
          className="checkout__input"
        />
        <ErrorMessage
          errors={errors}
          name="name"
          as={<ErrorMessageContainer />}
          render={({ messages }) => messages && (
            Object.entries(messages).map(([type, message]) => (
              <p key={type}>{message}</p>
            )))}
        />
      </div>
      <div className="checkout__input-group">
        <input
          type="text"
          id="email"
          name="email"
          placeholder="Email address"
          aria-label="Email address"
          aria-invalid={errors.email ? 'true' : 'false'}
          ref={register({
            required: { value: true, message: 'An email is required.' },
            pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: 'Please enter a valid email.' },
          })}
          className="checkout__input"
        />
        <ErrorMessage
          errors={errors}
          name="email"
          as={<ErrorMessageContainer />}
          render={({ messages }) => messages
            && Object.entries(messages).map(([type, message]) => (
              <p key={type}>{message}</p>
            ))}
        />
      </div>

      { extrafields && extrafields.map((extrafield) => {
        // Only handle text inputs for now
        if (extrafield.type !== 'text') {
          return null;
        }

        // Namespaced in a way that checkout.capture() will ultimately expect, these values are
        // copied straight into the capture request in Checkout.js
        const fieldId = `extrafields[${extrafield.id}]`;

        // fieldId above doesn't apply to react-hook-forms, which is a nested object
        const fieldError = errors.extrafields ? errors.extrafields[extrafield.id] : {};

        return (
          <>
            <h3
              className="checkout__subtitle"
            >
              Extra details
            </h3>
            <div
              className="checkout__input-group"
              key={extrafield.id}
            >
              <input
                type="text"
                id={fieldId}
                name={fieldId}
                placeholder={extrafield.name}
                aria-invalid={errors[fieldId] ? 'true' : 'false'}
                ref={register({
                  required: extrafield.required ? 'This field is required.' : false,
                })}
                className="checkout__input"
              />
              { fieldError && (
                <ErrorMessage
                  errors={errors}
                  name={fieldId}
                  as={<ErrorMessageContainer />}
                  render={({ messages }) => messages
                    && Object.entries(messages).map(([type, message]) => (
                      <p key={type}>{message}</p>
                    ))}
                />
              ) }
            </div>
          </>
        );
      }) }
    </>
  );
}
