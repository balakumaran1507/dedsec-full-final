import { PolicyLayout } from "@/components/landing/policy-layout"

export default function TermsAndConditions() {
    return (
        <PolicyLayout title="Terms & Conditions" date="December 3, 2025">
            <p className="lead">
                By using this Website (https://cybercom.live and https://dedsec.cybercom.live), you agree to the following terms. Please read them carefully.
            </p>

            <section>
                <h3>1. Parties & Acceptance</h3>
                <p>
                    These Terms govern the relationship between you (“User”, “you”) and Cybercom / DedSec X01 (“we”, “us”, “our”). By using the Website — visiting any page, registering a profile, donating or sponsoring — you agree to abide by these Terms.
                </p>
            </section>

            <section>
                <h3>2. Eligibility</h3>
                <p>
                    You confirm that the information you provide is accurate and complete. There is no strict age restriction; however you agree that you will not use the Website for any illicit or malicious activity.
                </p>
            </section>

            <section>
                <h3>3. Purpose and Use of Services</h3>
                <p>
                    Cybercom / DedSec X01 provides a platform for CTF (Capture The Flag) competitions, educational/training content, and accepts donations/sponsorships to support operations.
                    <br />
                    Use of the site, membership, and donations are voluntary.
                </p>
            </section>

            <section>
                <h3>4. Donations / Sponsorships</h3>
                <ul>
                    <li>Donations / sponsorships are voluntary and done at donor’s consent.</li>
                    <li>Donations / sponsorships do not offer any guaranteed return or “product warranty”. They support the operations, maintenance and development of our platform and services.</li>
                    <li>Once a donation is accepted, it is considered final (see Donation & Refund Policy).</li>
                </ul>
            </section>

            <section>
                <h3>5. Prohibited Uses</h3>
                <p>
                    You agree <strong>not</strong> to use the Website or any associated infrastructure for hacking, malicious attacks, illegal cyber activity, or any activity that violates applicable Indian or international law.
                    <br />
                    You agree to use the platform responsibly and only for educational or legitimate purposes.
                </p>
            </section>

            <section>
                <h3>6. Liability & Disclaimer</h3>
                <p>
                    We do our best to maintain and secure our Website and services — but you understand that we cannot guarantee flawless uptime or absolute security.
                    <br />
                    We will not be liable for any direct or indirect damages arising from your use of the Website, including but not limited to data loss, unauthorized access, or misuse.
                </p>
            </section>

            <section>
                <h3>7. Modifications / Termination</h3>
                <p>
                    We may modify or suspend parts (or all) of the Website at any time. We may also update these Terms — updated version will be published with a new date.
                    <br />
                    Your continued use after changes means you accept the updated Terms.
                </p>
            </section>

            <section>
                <h3>8. Governing Law & Jurisdiction</h3>
                <p>
                    These Terms are governed by the laws of India. Any dispute arising out of or in connection with these Terms will be subject to the jurisdiction of courts in Tamil Nadu, India.
                </p>
            </section>
        </PolicyLayout>
    )
}
