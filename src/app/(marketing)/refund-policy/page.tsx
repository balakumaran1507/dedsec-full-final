import { PolicyLayout } from "@/components/landing/policy-layout"

export default function RefundPolicy() {
    return (
        <PolicyLayout title="Donation & Refund Policy" date="December 3, 2025">
            <section>
                <h3>1. Donations / Sponsorships</h3>
                <p>
                    Cybercom / DedSec X01 accepts monetary donations and sponsorships to support the development, maintenance, and community operations of our CTF platform and associated projects. Donations or sponsorships may be one-time or periodic, as per donor’s wish.
                </p>
            </section>

            <section>
                <h3>2. Use of Donations / Sponsorships</h3>
                <p>
                    All funds received are used to run our CTF infrastructure, pay hosting costs, maintain servers, develop tools, organize events/training, and support our community operations.
                </p>
            </section>

            <section>
                <h3>3. Refunds / Cancellations</h3>
                <ul>
                    <li>
                        As donations/sponsorships are voluntary and used for community/support purposes, they are generally <strong>non-refundable</strong>.
                    </li>
                    <li>
                        Refunds will be considered only under exceptional circumstances — for example, proven fraud, illegal activity, or misuse of funds — and at our discretion.
                    </li>
                    <li>
                        To request a refund in such exceptional cases, donors must contact us at <a href="mailto:sponsors@cybercom.live">sponsors@cybercom.live</a> within <strong>7 days</strong> of donation, providing donation reference ID and explanation. After evaluation, we may approve refunds.
                    </li>
                </ul>
            </section>

            <section>
                <h3>4. No Warranty or Return</h3>
                <p>
                    Donations / sponsorships do not guarantee any service, membership, or access. They are contributions to support our work and community.
                </p>
            </section>

            <section>
                <h3>5. Voluntary Participation</h3>
                <p>
                    By donating or sponsoring, you acknowledge that you are doing so voluntarily and understand that funds may be used for ongoing community / infrastructure support — not for personal returns.
                </p>
            </section>
        </PolicyLayout>
    )
}
