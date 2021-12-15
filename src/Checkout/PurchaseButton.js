import classNames from 'classnames/bind';

export default function PurchaseButton({
  disabled,
  processing,
}) {
  const renderSubmitButton = () => {
    if (processing) {
      return 'Processing...';
    }
    return 'Complete purchase';
  };

  return (
    <button
      type="submit"
      className={classNames('checkout__submit', {
        'checkout__submit--disabled': disabled || processing,
      })}
      disabled={processing || disabled}
    >
      { renderSubmitButton() }
    </button>
  );
}
