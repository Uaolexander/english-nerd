export const metadata = {
  title: "Terms of Service — English Nerd",
  description: "Terms of Service for English Nerd. Read our terms before using the site.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0B0B0D] text-white">
      <div className="mx-auto max-w-3xl px-6 py-16">

        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-white/40">
          <a href="/" className="hover:text-white transition">Home</a>
          <span className="mx-2 text-white/35">/</span>
          <span className="text-white/70">Terms of Service</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <div className="text-xs font-bold uppercase tracking-widest text-white/30 mb-3">Legal</div>
          <h1 className="text-4xl font-black tracking-tight">Terms of Service</h1>
          <p className="mt-3 text-white/50 text-sm">Last updated: March 2026</p>
          <div className="mt-6 h-px bg-white/8" />
        </div>

        <div className="prose prose-invert prose-sm max-w-none space-y-10 text-white/70 leading-relaxed">

          <section>
            <h2 className="text-lg font-black text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing and using English Nerd (<strong className="text-white">englishnerd.cc</strong>), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the site.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-3">2. Use of the Site</h2>
            <p>English Nerd is a free educational platform. You may use the site for personal, non-commercial learning purposes. You agree not to:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li>Copy, reproduce, or redistribute our content without written permission</li>
              <li>Use automated tools (bots, scrapers) to extract content from the site</li>
              <li>Attempt to disrupt or damage the site&apos;s operation</li>
              <li>Use the site for any unlawful purpose</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-3">3. Intellectual Property</h2>
            <p>
              All content on English Nerd — including grammar lessons, exercises, questions, explanations, images, and design — is the property of English Nerd and is protected by copyright law. You may not reproduce, distribute, or create derivative works without our express written permission.
            </p>
            <p className="mt-3">
              You are welcome to share links to our pages and reference our content for educational purposes, provided you credit English Nerd as the source.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-3">4. User Accounts</h2>
            <p>You may create a free account on English Nerd to save your progress. By creating an account, you agree to:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li>Provide a valid email address and keep your login credentials secure</li>
              <li>Not share your account with others or create accounts on behalf of third parties</li>
              <li>Not create multiple accounts to circumvent any restrictions</li>
            </ul>
            <p className="mt-3">
              You may delete your account at any time from your account settings. Deletion permanently removes all your data from our systems. We reserve the right to suspend or terminate accounts that violate these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-3">5. Free &amp; PRO Service</h2>
            <p>
              English Nerd offers a free tier available to all users, as well as an optional <strong className="text-white">PRO subscription</strong> at <strong className="text-white">$2.50/month</strong>. PRO unlocks additional features including an ad-free experience, the SpeedRound vocabulary game, downloadable PDF materials, a progress dashboard, and completion certificates.
            </p>
            <p className="mt-3">
              We reserve the right to modify, suspend, or discontinue any part of the service at any time without notice. We are not liable for any loss or inconvenience caused by such changes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-3">6. PRO Subscription &amp; Refund Policy</h2>
            <p>
              English Nerd PRO is a monthly digital subscription. By subscribing, you gain immediate access to all PRO features. The following terms apply:
            </p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li><strong className="text-white">Billing:</strong> Subscriptions are billed monthly on the date of purchase and renew automatically until cancelled.</li>
              <li><strong className="text-white">Cancellation:</strong> You may cancel your subscription at any time from your account settings. Cancellation takes effect at the end of the current billing period — you retain PRO access until then.</li>
              <li><strong className="text-white">Refunds:</strong> Because PRO features are delivered digitally and access is granted immediately upon payment, all sales are final and non-refundable. If you experience a technical issue preventing access to PRO features, please contact us at <a href="mailto:hello@englishnerd.cc" className="text-[#F5DA20] hover:underline">hello@englishnerd.cc</a> and we will resolve it promptly.</li>
              <li><strong className="text-white">Free trial / promo codes:</strong> Promotional codes may be issued at our discretion and grant temporary PRO access. No payment is taken during a promo period.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-3">7. Accuracy of Content</h2>
            <p>
              We strive to provide accurate and up-to-date grammar content. However, English Nerd does not guarantee that all content is error-free. If you spot an error, please report it to us at{" "}
              <a href="mailto:hello@englishnerd.cc" className="text-[#F5DA20] hover:underline">hello@englishnerd.cc</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-3">8. Third-Party Advertising</h2>
            <p>
              English Nerd displays advertisements provided by Google AdSense. We are not responsible for the content of these advertisements or the practices of advertisers. By using the site, you acknowledge that advertisements may be displayed.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-3">9. Disclaimer of Warranties</h2>
            <p>
              English Nerd is provided &quot;as is&quot; without any warranty of any kind, express or implied. We do not guarantee that the site will be uninterrupted, error-free, or free from viruses or other harmful components. Your use of the site is at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-3">10. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, English Nerd shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the site, including but not limited to loss of data or learning outcomes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-3">11. External Links</h2>
            <p>
              The site may contain links to third-party websites. These links are provided for convenience only. We have no control over the content of those sites and accept no responsibility for them.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-3">12. Changes to Terms</h2>
            <p>
              We may update these Terms of Service at any time. Changes will be reflected on this page with an updated date. Continued use of the site after changes constitutes your acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-3">13. Contact</h2>
            <p>For any questions regarding these Terms of Service:</p>
            <div className="mt-3 rounded-xl border border-white/8 bg-white/[0.03] p-4 text-sm">
              <div className="font-black text-white">English Nerd</div>
              <div className="mt-1">Email: <a href="mailto:hello@englishnerd.cc" className="text-[#F5DA20] hover:underline">hello@englishnerd.cc</a></div>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
