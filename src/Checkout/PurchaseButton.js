import classNames from 'classnames/bind';
import { useCheckout } from '@chec/react-commercejs-hooks';

export default function PurchaseButton({
  disabled,
  processing,
}) {
  const checkout = useCheckout();

  const renderSubmitButton = () => {
    if (processing) {
      return 'Processing...';
    }
    return `Pay ${checkout.live.total_with_tax.formatted_with_symbol}`;
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
