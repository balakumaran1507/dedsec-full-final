import { PolicyLayout } from "@/components/landing/policy-layout"

export default function AboutContact() {
    return (
        <PolicyLayout title="About & Contact" date="December 3, 2025">
            <section>
                <h3>About Us</h3>
                <p>
                    <strong>Cybercom (owner) — DedSec X01 (official CTF team)</strong>
                    <br />
                    Website: <a href="https://cybercom.live">https://cybercom.live</a>
                    <br />
                    Team Web: <a href="https://dedsec.cybercom.live">https://dedsec.cybercom.live</a>
                </p>
                <p>
                    We are a cybersecurity / CTF team and community operating from Chennai, Tamil Nadu, India (PIN: 600094).
                    <br />
                    We build and run CTF infrastructure, security training, events, and accept sponsorships & donations to support our work.
                </p>
            </section>

            <section>
                <h3>Contact Us</h3>
                <p>
                    For general queries or support: <a href="mailto:dedsec@cybercom.live">dedsec@cybercom.live</a>
                    <br />
                    For sponsor/donation related queries: <a href="mailto:sponsors@cybercom.live">sponsors@cybercom.live</a>
                    <br />
                    For founders’ / partnerships: <a href="mailto:founders@cybercom.live">founders@cybercom.live</a>
                    <br />
                    Alternate support: <a href="mailto:support@cybercom.live">support@cybercom.live</a>
                </p>
                <p>
                    <strong>Address:</strong> Chennai, Tamil Nadu, India – 600094
                </p>
            </section>
        </PolicyLayout>
    )
}
