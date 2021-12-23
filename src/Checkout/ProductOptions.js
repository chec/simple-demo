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
  const handleVariantChange = ({ target: { name, value } }) => {
    setVariantOption({ ...selectedVariantOption, [name]: value });

    // Check the variant is valid (it probably is) and update the checkout token in state
    const lineItemId = checkout ? checkout.live.line_items[0].id : null;
    if (lineItemId && value) {
      checkVariant(lineItemId, name, value);
    }
  };

  /**
   * Renders a list of variant options with buttons to select them
   *
   * @returns {JSX.Element}
   */
  const renderVariants = () => {
    if (!product || !product.variant_groups.length) {
      return null;
    }

    return (
      <>
        <div className="product__variant-container">
          {product.variant_groups.map((variant) => (
            <div
              className="product__variant-select-container"
              key={variant.id}
            >
              <h3 className="product__variant-name">
                {variant.name}
              </h3>
              <div className="product__variant-options">
                {
                  variant.options.map((option) => (
                    <div className="product__variant-option">
                      <input type="radio" value={option.id} name={variant.id} onChange={handleVariantChange} />
                      <span>{ option.name }</span>
                    </div>
                  ))
                }
              </div>
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
        { product.image && <img className="product__image" src={product.image.url} /> }
        { renderVariants() }
      </div>
    </>
  );
}
