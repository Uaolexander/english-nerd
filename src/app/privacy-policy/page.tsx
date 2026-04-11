export const metadata = {
  title: "Privacy Policy — English Nerd",
  description: "Privacy Policy for English Nerd. Learn how we collect, use, and protect your data, including information about cookies and third-party advertising.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#0B0B0D] text-white">
      <div className="mx-auto max-w-3xl px-6 py-16">

        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-white/55">
          <a href="/" className="hover:text-white transition">Home</a>
          <span className="mx-2 text-white/50">/</span>
          <span className="text-white/70">Privacy Policy</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <div className="text-xs font-bold uppercase tracking-widest text-white/50 mb-3">Legal</div>
          <h1 className="text-4xl font-black tracking-tight">Privacy Policy</h1>
          <p className="mt-3 text-white/50 text-sm">Last updated: March 2026</p>
          <div className="mt-6 h-px bg-white/8" />
        </div>

        <div className="prose prose-invert prose-sm max-w-none space-y-10 text-white/70 leading-relaxed">

          <section>
            <h2 className="text-lg font-black text-white mb-3">1. Who We Are</h2>
            <p>
              English Nerd (<strong className="text-white">englishnerd.cc</strong>) is a free educational website providing English grammar lessons, vocabulary tests, and exercises for learners at all levels (A1–C1). We are committed to protecting your privacy and being transparent about how we handle your data.
            </p>
            <p className="mt-3">
              If you have any questions about this policy, contact us at:{" "}
              <a href="mailto:hello@englishnerd.cc" className="text-[#F5DA20] hover:underline">hello@englishnerd.cc</a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-3">2. What Data We Collect</h2>
            <p>We collect minimal data to operate the site. This includes:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li><strong className="text-white">Account data</strong> — if you create an account, we collect your email address and a hashed password. You may also provide a display name. This data is stored securely via Supabase.</li>
              <li><strong className="text-white">Progress data</strong> — exercise scores, completed topics, and test results linked to your account so you can track your learning.</li>
              <li><strong className="text-white">Usage data</strong> — pages visited, time spent, browser type, device type, and approximate location (country/city via IP address). This is collected anonymously.</li>
              <li><strong className="text-white">Cookie data</strong> — small files stored in your browser to remember your preferences (e.g. cookie consent choice, session token).</li>
              <li><strong className="text-white">Advertising data</strong> — collected by Google AdSense (see Section 4).</li>
            </ul>
            <p className="mt-3">You can use the site without creating an account. Account creation is optional and solely for saving your progress.</p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-3">3. User Accounts</h2>
            <p>When you register an account on English Nerd, we collect and store:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li>Your <strong className="text-white">email address</strong> — used to identify your account and send a confirmation link</li>
              <li>A <strong className="text-white">hashed password</strong> — we never store your password in plain text</li>
              <li>Your <strong className="text-white">exercise progress</strong> — scores and completion data linked to your account</li>
            </ul>
            <p className="mt-3">We do not sell or share your account data with third parties. You may delete your account at any time from your account settings, which will permanently erase all your data from our systems.</p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-3">4. How We Use Cookies</h2>
            <p>Cookies are small text files stored on your device. We use them for:</p>
            <div className="mt-4 space-y-4">
              <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
                <div className="text-sm font-black text-white mb-1">Essential Cookies</div>
                <p className="text-sm">Required for the site to function. These include your cookie consent preference. You cannot opt out of these.</p>
              </div>
              <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
                <div className="text-sm font-black text-white mb-1">Analytics Cookies</div>
                <p className="text-sm">Help us understand how visitors use the site (pages visited, session duration). Used to improve content. Data is anonymised.</p>
              </div>
              <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
                <div className="text-sm font-black text-white mb-1">Advertising Cookies</div>
                <p className="text-sm">Set by Google AdSense to show relevant advertisements. These may include personalised ads based on your browsing history across sites.</p>
              </div>
            </div>
            <p className="mt-4">You can manage or withdraw cookie consent at any time using the cookie banner at the bottom of the page, or by adjusting your browser settings.</p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-3">5. Google AdSense & Third-Party Advertising</h2>
            <p>
              We use <strong className="text-white">Google AdSense</strong> to display advertisements on this site. Google uses cookies (including the DoubleClick cookie) to serve ads based on your prior visits to this and other websites.
            </p>
            <p className="mt-3">Google&apos;s use of advertising cookies enables it and its partners to serve ads based on your visit to English Nerd and/or other sites on the Internet.</p>
            <p className="mt-3">You may opt out of personalised advertising by visiting{" "}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-[#F5DA20] hover:underline">Google Ads Settings</a>{" "}
              or{" "}
              <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-[#F5DA20] hover:underline">aboutads.info</a>.
            </p>
            <p className="mt-3">For more information on how Google uses data, see:{" "}
              <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-[#F5DA20] hover:underline">How Google uses data when you use our partners&apos; sites or apps</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-3">6. Data Sharing</h2>
            <p>We do <strong className="text-white">not</strong> sell, trade, or rent your personal data to third parties. Data may be shared with:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li><strong className="text-white">Google</strong> — for analytics and advertising purposes (see Section 5).</li>
              <li><strong className="text-white">Hosting providers</strong> — who process server logs as part of normal website operation.</li>
              <li><strong className="text-white">Authorities</strong> — if required by law.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-3">7. Your Rights (GDPR)</h2>
            <p>If you are located in the European Economic Area (EEA), you have the following rights under GDPR:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li>Right to <strong className="text-white">access</strong> the personal data we hold about you</li>
              <li>Right to <strong className="text-white">rectification</strong> of inaccurate data</li>
              <li>Right to <strong className="text-white">erasure</strong> ("right to be forgotten")</li>
              <li>Right to <strong className="text-white">restrict</strong> processing</li>
              <li>Right to <strong className="text-white">data portability</strong></li>
              <li>Right to <strong className="text-white">object</strong> to processing</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, contact us at{" "}
              <a href="mailto:hello@englishnerd.cc" className="text-[#F5DA20] hover:underline">hello@englishnerd.cc</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-3">8. Data Retention</h2>
            <p>Analytics data is retained for a maximum of 26 months. Cookie preference data is stored locally in your browser and expires after 12 months. We do not store personal data on our servers beyond server logs, which are automatically deleted after 30 days.</p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-3">9. Children&apos;s Privacy</h2>
            <p>English Nerd is intended for general audiences. We do not knowingly collect personal information from children under the age of 13. If you believe a child has provided us with personal information, please contact us and we will delete it promptly.</p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-3">10. Links to Other Sites</h2>
            <p>Our site may contain links to external websites. We are not responsible for the privacy practices of those sites and encourage you to review their privacy policies.</p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-3">11. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date. We encourage you to review this page periodically.</p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-3">12. Contact Us</h2>
            <p>If you have any questions or concerns about this Privacy Policy, please contact us:</p>
            <div className="mt-3 rounded-xl border border-white/8 bg-white/[0.03] p-4 text-sm">
              <div className="font-black text-white">English Nerd</div>
              <div className="mt-1">Email: <a href="mailto:hello@englishnerd.cc" className="text-[#F5DA20] hover:underline">hello@englishnerd.cc</a></div>
              <div className="mt-1">Website: englishnerd.cc</div>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
