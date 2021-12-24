export default function PaymentMethodSelector() {
  return (
    <>
      <h3>Payment method</h3>
      <ul className="payment-method-selector">
        <li>
          <label htmlFor="payment-card">
            <input id="payment-card" type="radio" name="chosen_method" value="card" checked />
            Card
          </label>
        </li>
        <li>
          <label htmlFor="payment-meta">
            <input id="payment-meta" type="radio" name="chosen_method" value="metamask" />
            Metamask
          </label>
        </li>
      </ul>
    </>
  )
}
