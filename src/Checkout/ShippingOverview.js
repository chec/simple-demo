export default function ShippingOverview() {
  return (
    <>
      <h3>Last known address</h3>
      <div className="shipping-overview">
        <div className="shipping-overview__address">
          1853 Market Street<br />
          San Francisco<br />
          94117, CA
        </div>
        <button type="button" className="shipping-overview__change">Change</button>
      </div>
    </>
  );
}
