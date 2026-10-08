import { eveChannel } from "eve/channels/eve";
import { localDev, vercelOidc, type AuthFn } from "eve/channels/auth";
import { getCustomer } from "../lib/auth.js";
 
const appAuth: AuthFn<Request> = async (request) => {
  const customer = getCustomer(request);
  if (!customer) return null; // not one of our customers → fall through
 
  // The tier comes from the customer's record, not from the request. The
  // per-tier playbook (agent/skills/shop-playbook.ts) reads it from here.
  const attributes: Record<string, string> = {};
  if (customer.tier) attributes.tier = customer.tier;
 
  return {
    principalId: customer.id,
    principalType: "user",
    authenticator: "app",
    issuer: "spoke-and-mirror",
    attributes,
  };
};
 
export default eveChannel({
  auth: [appAuth, vercelOidc(), localDev()],
});