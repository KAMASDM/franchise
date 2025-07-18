import React from "react";
import { PageLayout, PolicySection } from "./PrivacyPolicy";

const TermsAndConditions = () => {
  return (
    <PageLayout title="Terms and Conditions">
      <PolicySection title="1. Agreement to Terms">
        By using our services to find your perfect restaurant franchise, you
        agree to be bound by these Terms and Conditions. These terms govern your
        access to and use of our website and services.
      </PolicySection>

      <PolicySection title="2. Our Services">
        Our platform provides a marketplace to connect potential franchisees
        with restaurant franchise brands. We provide information, resources, and
        expert support to facilitate this process. All franchise information is
        thoroughly vetted, but we do not guarantee the performance or ROI of any
        franchise.
      </PolicySection>

      <PolicySection title="3. User Responsibilities">
        You are responsible for the accuracy of the information you provide and
        for conducting your own due diligence before entering into any franchise
        agreement. You agree to use our platform for its intended purpose and
        not to engage in any unlawful activity.
      </PolicySection>

      <PolicySection title="4. Intellectual Property">
        All content on this website, including text, graphics, logos, and the
        "Find Your Perfect Restaurant Franchise" branding, is our property or
        the property of our licensors and is protected by copyright and other
        intellectual property laws.
      </PolicySection>

      <PolicySection title="5. Limitation of Liability">
        We are not liable for any direct, indirect, incidental, or consequential
        damages resulting from your use of our platform or your investment in a
        franchise. Our role is to facilitate connections, and the ultimate
        decision and risk lie with you.
      </PolicySection>

      <PolicySection title="6. Governing Law">
        These Terms and Conditions shall be governed by and construed in
        accordance with the laws of the jurisdiction in which our company is
        based, without regard to its conflict of law principles.
      </PolicySection>
    </PageLayout>
  );
};

export default TermsAndConditions;
