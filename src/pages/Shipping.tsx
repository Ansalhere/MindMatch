import Layout from "@/components/Layout";

const Shipping = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Shipping & Delivery Policy</h1>
        
        <div className="prose prose-lg max-w-none space-y-6">
          <p className="text-muted-foreground">
            Last updated: December 2024
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Digital Services Only</h2>
            <p>
              FresherPools is a digital job portal platform. We provide online services and do not ship any physical products. All our services are delivered digitally through our website and platform.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">2. Service Delivery</h2>
            <p>
              Our digital services are delivered as follows:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Premium Subscriptions:</strong> Activated immediately upon successful payment</li>
              <li><strong>Resume Builder Access:</strong> Available instantly after subscription activation</li>
              <li><strong>Skill Assessments:</strong> Accessible immediately upon subscription</li>
              <li><strong>Job Alerts & Notifications:</strong> Delivered via email and in-app notifications</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">3. Instant Activation</h2>
            <p>
              Upon successful payment:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your premium account is activated within seconds</li>
              <li>You will receive a confirmation email with your subscription details</li>
              <li>All premium features become immediately accessible</li>
              <li>No waiting period or shipping time required</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">4. Resume & Document Downloads</h2>
            <p>
              Resumes and documents created using our platform:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Can be downloaded instantly as PDF files</li>
              <li>Are available for download 24/7 from your dashboard</li>
              <li>No physical delivery - all documents are digital</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Service Availability</h2>
            <p>
              Our platform is available:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>24 hours a day, 7 days a week</li>
              <li>Worldwide - accessible from any location with internet</li>
              <li>On all devices - desktop, tablet, and mobile</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">6. Technical Requirements</h2>
            <p>
              To access our services, you need:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>A stable internet connection</li>
              <li>A modern web browser (Chrome, Firefox, Safari, Edge)</li>
              <li>A valid email address for account verification and notifications</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">7. Service Interruptions</h2>
            <p>
              While we strive for 99.9% uptime, occasional maintenance or technical issues may occur:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Scheduled maintenance will be announced in advance</li>
              <li>We aim to resolve any unplanned outages within hours</li>
              <li>Premium subscribers may receive compensation for extended outages</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">8. Contact Us</h2>
            <p>
              For any questions regarding service delivery, please contact us:
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

export default Shipping;
