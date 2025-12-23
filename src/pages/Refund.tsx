import Layout from "@/components/Layout";

const Refund = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Cancellation & Refund Policy</h1>
        
        <div className="prose prose-lg max-w-none space-y-6">
          <p className="text-muted-foreground">
            Last updated: December 2024
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Overview</h2>
            <p>
              At FresherPools, we strive to provide the best experience for our users. This Cancellation & Refund Policy outlines our guidelines for subscription cancellations and refunds for our premium services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">2. Subscription Cancellation</h2>
            <p>
              You may cancel your subscription at any time through your account settings. Upon cancellation:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your subscription will remain active until the end of your current billing period</li>
              <li>You will continue to have access to premium features until the subscription expires</li>
              <li>No further charges will be made to your payment method after cancellation</li>
              <li>Your account will automatically revert to a free plan at the end of the billing period</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">3. Refund Policy</h2>
            <p>
              We offer refunds under the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Within 7 days of purchase:</strong> Full refund if you are not satisfied with our premium services</li>
              <li><strong>Technical issues:</strong> Full or partial refund if you experience persistent technical problems that we are unable to resolve</li>
              <li><strong>Duplicate charges:</strong> Full refund for any accidental duplicate payments</li>
              <li><strong>Unauthorized transactions:</strong> Full refund for any unauthorized charges made to your account</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">4. How to Request a Refund</h2>
            <p>
              To request a refund, please follow these steps:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Contact our support team at <a href="mailto:support@fresherpools.com" className="text-primary hover:underline">support@fresherpools.com</a></li>
              <li>Provide your registered email address and transaction details</li>
              <li>Explain the reason for your refund request</li>
              <li>Our team will review your request within 3-5 business days</li>
            </ol>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Refund Processing</h2>
            <p>
              Once your refund is approved:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Refunds will be processed within 5-7 business days</li>
              <li>The amount will be credited to your original payment method</li>
              <li>Bank processing times may vary; please allow up to 10 business days for the refund to appear</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">6. Non-Refundable Items</h2>
            <p>
              The following are not eligible for refunds:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Partial month subscriptions after the 7-day refund window</li>
              <li>Services already consumed or used (e.g., resume downloads already completed)</li>
              <li>Promotional or discounted purchases (unless otherwise stated)</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">7. Changes to This Policy</h2>
            <p>
              We reserve the right to modify this policy at any time. Changes will be effective immediately upon posting on our website. We encourage you to review this policy periodically.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">8. Contact Us</h2>
            <p>
              If you have any questions about our Cancellation & Refund Policy, please contact us:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email: <a href="mailto:support@fresherpools.com" className="text-primary hover:underline">support@fresherpools.com</a></li>
              <li>Phone: +91 7411470665</li>
              <li>Address: Bengaluru, Karnataka, India</li>
            </ul>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Refund;
