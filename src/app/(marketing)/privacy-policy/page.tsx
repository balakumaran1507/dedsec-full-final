import { PolicyLayout } from "@/components/landing/policy-layout"

export default function PrivacyPolicy() {
    return (
        <PolicyLayout title="Privacy Policy" date="December 3, 2025">
            <section>
                <h3>1. Who we are</h3>
                <p>
                    We (“we”, “us”, “Cybercom” / “DedSec X01”) operate the website at https://cybercom.live and sub-domain https://dedsec.cybercom.live (together, “Website”).
                    <br />
                    Our registered location: Chennai, Tamil Nadu, India – 600094.
                    <br />
                    If you have any questions regarding privacy, you may contact us at dedsec@cybercom.live / support@cybercom.live / sponsors@cybercom.live / founders@cybercom.live.
                </p>
            </section>

            <section>
                <h3>2. What information we collect</h3>
                <p>We collect only information voluntarily provided by you when you:</p>
                <ul>
                    <li>register on our CTF / team platform (CTF profile, membership)</li>
                    <li>donate or sponsor us</li>
                    <li>contact us via email or contact form</li>
                </ul>
                <p>
                    The information may include your name, email address, contact info (if provided), social-media / public links (in case of sponsors), and any details you voluntarily submit.
                </p>
            </section>

            <section>
                <h3>3. Why we collect your information & how we use it</h3>
                <p>We use the collected information to:</p>
                <ul>
                    <li>create and manage your CTF profile / membership</li>
                    <li>process donations or sponsorships</li>
                    <li>communicate with you (email updates, newsletters, sponsor-related communication)</li>
                    <li>manage our website and services</li>
                </ul>
                <p>
                    We do <strong>not</strong> collect or store sensitive personal information beyond what’s required for the above — and we do <strong>not</strong> collect payment card details ourselves (payments are handled via third-party payment gateway).
                </p>
            </section>

            <section>
                <h3>4. Data security & storage</h3>
                <p>
                    We take reasonable technical and organizational measures to protect your data from unauthorized access or misuse. However, no system is completely secure — by using our Website you acknowledge this limitation.
                </p>
            </section>

            <section>
                <h3>5. Sharing or disclosure of information</h3>
                <p>
                    We will <strong>not</strong> sell, trade or rent your personal information to any third party.
                    <br />
                    We may share minimal information internally (e.g. with authorized team members) when needed to process donations/sponsorships or manage your account.
                </p>
                <p>
                    We may also disclose information if required by law or in response to a legal request, or to protect the rights, safety or property of Cybercom / DedSec X01.
                </p>
            </section>

            <section>
                <h3>6. Cookies and tracking</h3>
                <p>
                    At present, we do not actively use cookies or tracking mechanisms. If that changes, we will update this policy accordingly.
                </p>
            </section>

            <section>
                <h3>7. Your rights</h3>
                <p>
                    You can request to access, update, correct, or delete your personal information by contacting us at the above emails.
                    <br />
                    If you wish to stop receiving communications from us (e.g. promotional emails or updates), you can opt out by emailing us.
                </p>
            </section>

            <section>
                <h3>8. Changes to this policy</h3>
                <p>
                    We reserve the right to modify this Privacy Policy at any time. All changes will be posted on this page with updated “Last updated” date. By continuing to use the Website after changes, you accept the updated policy.
                </p>
            </section>
        </PolicyLayout>
    )
}
