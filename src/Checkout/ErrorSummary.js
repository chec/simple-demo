import { ErrorMessage } from '@hookform/error-message';

export default function ErrorSummary({ errors }) {
  if (Object.keys(errors).length === 0) {
    return null;
  }

  return (
    <div
      className="error-summary"
    >
      { Object.keys(errors).length === 1 && (
        <p className="error-summary__title">
          There was an error with the form submission. Please edit the form and try again.
        </p>
      )}
      { Object.keys(errors).length > 1 && (
        <p className="error-summary__title">
          There were some errors with the form submission. Please edit the form and try again.
        </p>
      )}
      <ul className="error-summary__list">
        { Object.keys(errors).map((fieldName) => (
          <ErrorMessage
            errors={errors}
            name={fieldName}
            as="li"
            key={fieldName}
          />
        )) }
      </ul>
    </div>
  );
}
