export default function isGatewayAvailable(checkout, gateway) {
  return checkout.gateways.some((candidate) => candidate.code === gateway);
}
