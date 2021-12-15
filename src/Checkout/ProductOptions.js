import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import ErrorMessageContainer from './ErrorMessageContainer';
import {
  useCheckout,
  useCheckQuantity,
  useCheckVariant,
} from '@chec/react-commercejs-hooks';
import { useDebounce } from 'use-debounce';

export default function ProductOptions({ product }) {
  const form = useForm({ criteriaMode: 'all', shouldFocusError: true });
  const { errors } = form;
  const checkQuantity = useCheckQuantity();
  const checkVariant = useCheckVariant();
  const checkout = useCheckout();
  const [selectedVariantOption, setVariantOption] = useState();
  const [selectedQuantity, setQuantity] = useState(1);
  const [quantity] = useDebounce(parseInt(selectedQuantity, 10), 500);
  const lineItem = checkout?.live.line_items[0];

  // Create a side effect that updates the checkout when the user updates quantity. This uses a
  // debounced "quantity" value to prevent excess API calls.
  useEffect(() => {
    // Ensure that there is at least a line item and that we have a new _valid_ quantity
    if (!lineItem || !quantity || quantity < 1 || lineItem.quantity === quantity) {
      return;
    }

    // Don't bother checking quantity without variant selection (if the product has variants)
    if (product.variants.length && (
      // Either they haven't chosne any option yet...
      !selectedVariantOption
      // ... or they haven't chosen options for all the variant groups
      || Object.values(selectedVariantOption).length !== product.variants.length
    )) {
      return;
    }

    checkQuantity(lineItem.id, quantity, selectedVariantOption);
  }, [quantity, selectedVariantOption]);

  // Return predefined box shadow style based on whether
  // inputBoxShadow was selected in the editor
  // To be improved with select or range input
  const containerBoxShadow = () => {
    if (!boxShadow) {
      return null;
    }
    return '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
  };

  /**
   * Handle variant option select for multi-variants
   */
  const handleVariantChange = ({ target: { id, value } }) => {
    setVariantOption({ ...selectedVariantOption, [id]: value });

    // Check the variant is valid (it probably is) and update the checkout token in state
    const lineItemId = checkout ? checkout.live.line_items[0].id : null;
    if (lineItemId && value) {
      checkVariant(lineItemId, id, value);
    }
  };

  /**
   * Renders a list of variant options with buttons to select them
   *
   * @returns {JSX.Element}
   */
  const renderVariants = () => {
    if (!product || !product.variants.length) {
      return null;
    }

    return (
      <>
        <hr
          className="product__divider"
        />
        <div className="product__variant-container">
          {product.variants.map((variant) => (
            <div
              className="product__variant-select-container"
              key={variant.id}
            >
              <label className="product__variant-name">
                {variant.name}
              </label>
              <select
                className="product__variant-select"
                id={variant.id}
                name={variant.id}
                aria-label={variant.name}
                onChange={handleVariantChange}
                defaultValue=""
              >
                <option value="">
                  Choose { variant.name }
                </option>
                {
                variant.options.map((option) => (
                  <option
                    value={option.id}
                    key={option.id}
                  >
                    {option.name}
                  </option>
                ))
              }
              </select>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <>
      <div
        className="product"
      >
        <div className="product__header">
          <p className="product__name">
            {product.name}
          </p>
          <div className="product__quantity">
            <span>Quantity:</span>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={selectedQuantity}
              onChange={({ target: { value } }) => setQuantity(value)}
              aria-label="Quantity"
            />
            <ErrorMessage
              errors={errors}
              name="quantity"
              as={<ErrorMessageContainer />}
              render={({ messages }) => messages
                && Object.entries(messages).map(([type, message]) => (
                  <p key={type}>{message}</p>
                ))}
            />
          </div>
        </div>
        { renderVariants() }
      </div>
    </>
  );
}
