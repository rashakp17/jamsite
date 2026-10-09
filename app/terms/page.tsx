import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="October 2026"
      sections={[
        {
          heading: "Orders",
          body: [
            "Because we cook in small batches, some flavours sell out. If something you ordered isn't available, we'll let you know and refund that item straight away.",
          ],
        },
        {
          heading: "Pricing",
          body: ["All prices are in Indian Rupees and include GST. Shipping is free on orders over ₹999."],
        },
        {
          heading: "Delivery",
          body: [
            "Orders leave our kitchen within two working days. Delivery times are estimates and can vary during festivals and the monsoon.",
          ],
        },
        {
          heading: "Returns",
          body: [
            "Food can't be returned, but if a jar arrives damaged or isn't right, send us a photo within seven days and we'll replace it or refund you.",
          ],
        },
      ]}
    />
  );
}
