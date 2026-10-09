import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="October 2026"
      sections={[
        {
          heading: "What we collect",
          body: [
            "When you order, we collect your name, email, delivery address and phone number so we can get your jars to you. When you join our letter, we collect only your email address.",
          ],
        },
        {
          heading: "How we use it",
          body: [
            "We use your details to process orders, answer messages and, if you've opted in, send our occasional newsletter. We never sell or rent your information.",
          ],
        },
        {
          heading: "Cookies",
          body: [
            "We use a small amount of local storage to remember what's in your bag. We don't use advertising trackers.",
          ],
        },
        {
          heading: "Your choices",
          body: [
            "You can unsubscribe from emails at any time using the link at the bottom of each one, or ask us to delete your data by writing to hello@berryandbloom.in.",
          ],
        },
      ]}
    />
  );
}
