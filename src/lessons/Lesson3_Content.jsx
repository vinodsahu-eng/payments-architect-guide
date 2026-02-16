export default function Lesson3_Content() {
  return (
    <div style={{
      maxWidth: 800,
      margin: "0 auto",
      padding: "48px 32px",
      fontFamily: "monospace",
      color: "#e2e8f0",
    }}>

      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <div style={{
          fontSize: 11,
          color: "#00d4ff",
          letterSpacing: "0.15em",
          marginBottom: 12,
        }}>
          LESSON 03
        </div>
        <h1 style={{
          fontSize: 28,
          fontWeight: 700,
          color: "#ffffff",
          margin: "0 0 16px 0",
          lineHeight: 1.3,
        }}>
          Payment Rails
        </h1>
        <p style={{
          fontSize: 13,
          color: "#94a3b8",
          lineHeight: 1.8,
          margin: 0,
        }}>
          Same person. Same Friday. Four completely different payment
          experiences. Different speeds, costs, finality, infrastructure.
          An architect's job is to know which rail fits which use case — and why.
        </p>
      </div>

      {/* What is a Rail */}
      <Section title="What Is a Payment Rail?">
        <p>
          A payment rail is the underlying infrastructure that moves money
          from one bank account to another. Every time money moves digitally,
          it travels on one of these rails. The rail determines how fast the
          money arrives, how much it costs, whether it can be reversed, and
          what happens when something goes wrong.
        </p>
        <p>
          Cards — covered in Lessons 1 and 2 — are one rail. But there are
          many others, and in both the US and India, different rails dominate
          different use cases.
        </p>
      </Section>

      {/* The Three Dimensions */}
      <Section title="The Three Dimensions Every Architect Weighs">
        {[
          {
            title: "Speed vs Cost",
            color: "#00d4ff",
            desc: "Faster rails generally cost more. Cards are fast but expensive. ACH is cheap but slow. RTP is fast and cheap but not universal. UPI breaks this tradeoff entirely — fast and free — which is why it won in India.",
          },
          {
            title: "Finality vs Flexibility",
            color: "#7c3aed",
            desc: "Irrevocable rails like wire and RTP give the recipient certainty — money cannot be taken back. Reversible rails like ACH and cards give the sender protection. A gig worker wants irrevocable pay. A consumer buying online wants chargeback protection.",
          },
          {
            title: "Reach vs Optimization",
            color: "#10b981",
            desc: "Cards reach everyone. But if your users are all US businesses with bank accounts, ACH is cheaper and just as effective. Reach matters most when you don't know your user. Optimization is possible when you do.",
          },
        ].map((item) => (
          <div key={item.title} style={{
            padding: "16px",
            marginBottom: 12,
            background: "#0f172a",
            border: `1px solid ${item.color}30`,
            borderLeft: `3px solid ${item.color}`,
            borderRadius: 8,
          }}>
            <div style={{
              fontSize: 12,
              fontWeight: 700,
              color: item.color,
              marginBottom: 8,
            }}>
              {item.title}
            </div>
            <p style={{ fontSize: 11, color: "#94a3b8", margin: 0, lineHeight: 1.7 }}>
              {item.desc}
            </p>
          </div>
        ))}
      </Section>

      {/* US Rails */}
      <Section title="US Payment Rails">
        {[
          {
            name: "Credit / Debit Cards",
            network: "Visa · Mastercard · Amex",
            color: "#00d4ff",
            speed: "Auth instant · Settle T+2",
            cost: "1.5–3% MDR (credit) · ~$0.21+0.05% (debit/Durbin)",
            reversible: "Yes — chargeback up to 120 days",
            bestFor: "Consumer purchases, e-commerce, retail",
            note: "The Durbin Amendment of 2010 capped debit interchange for large banks. This is why debit MDR is significantly cheaper than credit in the US — regulatory intervention changed the economics.",
            us: "Chase Sapphire at Starbucks NYC",
            india: "N/A — see India rails",
          },
          {
            name: "ACH",
            network: "FedACH · The Clearing House EPN",
            color: "#7c3aed",
            speed: "T+1 standard · Same-day available (higher fee)",
            cost: "$0.20–$1.50 flat — same cost for $100 or $10,000",
            reversible: "Yes — returns possible up to 60 days",
            bestFor: "Payroll, subscriptions, B2B payments, marketplace payouts",
            note: "ACH reversibility is its biggest risk. A business can receive payment, ship goods, and have the payment reversed 2 days later. Design hold periods into any ACH acceptance flow.",
            us: "Netflix monthly billing · Employer payroll",
            india: "NEFT is the conceptual equivalent",
          },
          {
            name: "RTP — Real-Time Payments",
            network: "The Clearing House",
            color: "#10b981",
            speed: "Seconds · 24/7/365",
            cost: "$0.25–$1.00 per transaction",
            reversible: "No — irrevocable once sent",
            bestFor: "Gig economy payouts, insurance claims, urgent disbursements",
            note: "RTP launched 2017 — the first new US core payment rail in 40 years. Covers ~60% of US bank accounts. $1M per transaction limit. This is the US catching up to what India built with UPI in 2016.",
            us: "DoorDash instant driver payouts after delivery",
            india: "UPI is the equivalent — but faster, cheaper, and universal",
          },
          {
            name: "FedNow",
            network: "Federal Reserve",
            color: "#ec4899",
            speed: "Seconds · 24/7/365",
            cost: "$0.25–$1.00 per transaction",
            reversible: "No — irrevocable",
            bestFor: "Same as RTP — instant, irrevocable payments",
            note: "Launched July 2023. The Fed's own instant rail competing with RTP. Not all banks support both — architects may need to support both and route based on receiving bank's participation.",
            us: "Government benefit disbursements, small business payouts",
            india: "UPI equivalent — but UPI launched 7 years earlier",
          },
          {
            name: "Wire Transfer (Fedwire)",
            network: "Federal Reserve",
            color: "#f59e0b",
            speed: "Same day · Banking hours only",
            cost: "$25–$35 per transaction",
            reversible: "No — final once received",
            bestFor: "Real estate, large B2B, treasury operations",
            note: "Never for consumer payments. Each transaction settles gross — individually, not in batches. The cost only makes sense for high-value payments where speed and finality matter more than cost.",
            us: "Home purchase closing · Corporate M&A settlement",
            india: "RTGS is the equivalent (min ₹2 lakh)",
          },
        ].map((rail) => (
          <RailCard key={rail.name} rail={rail} />
        ))}
      </Section>

      {/* India Rails */}
      <Section title="India Payment Rails">
        {[
          {
            name: "UPI — Unified Payments Interface",
            network: "NPCI",
            color: "#00d4ff",
            speed: "Seconds · 24/7/365",
            cost: "Zero MDR for most merchant categories",
            reversible: "Final — disputes via NPCI mechanism",
            bestFor: "Everything — dominant rail for all Indian digital payments",
            note: "UPI is a protocol, not an app. PhonePe, Google Pay, Paytm all run on it. India processes more real-time payment transactions than the US, UK, and Europe combined by volume. Zero MDR is a government policy decision that drove universal adoption.",
            us: "RTP + FedNow combined — but cheaper, faster, and with 7 years head start",
            india: "Street vendor QR code · Flipkart checkout · Utility bill payment",
          },
          {
            name: "IMPS — Immediate Payment Service",
            network: "NPCI",
            color: "#7c3aed",
            speed: "Instant · 24/7/365",
            cost: "₹2–₹25 flat",
            reversible: "Final — bank intervention required for disputes",
            bestFor: "Bank-to-bank transfers · UPI's settlement backbone",
            note: "Launched 2010 — six years before UPI. IMPS is the settlement infrastructure UPI is built on top of. Understanding IMPS explains why UPI can settle in real time. Direct IMPS integration is less common now that UPI provides a better UX on top of it.",
            us: "RTP infrastructure equivalent",
            india: "Sending money to family using account + IFSC",
          },
          {
            name: "NEFT — National Electronic Funds Transfer",
            network: "RBI",
            color: "#10b981",
            speed: "Next half-hourly batch · 24/7 since 2019",
            cost: "₹2–₹25 flat",
            reversible: "Returns possible for failed transactions",
            bestFor: "Vendor payments, loan disbursements, medium B2B",
            note: "Was batch-processed hourly until 2019. RBI moved NEFT to continuous half-hourly processing 24/7. Effectively within 30 minutes any time of day. Good for non-urgent bank transfers where UPI's ₹1 lakh limit is a constraint.",
            us: "ACH is the conceptual equivalent",
            india: "Paying a vendor invoice from net banking",
          },
          {
            name: "RTGS — Real Time Gross Settlement",
            network: "RBI",
            color: "#f59e0b",
            speed: "Real time · 24/7 since 2020",
            cost: "₹25–₹50 per transaction",
            reversible: "Final once settled",
            bestFor: "Large corporate transfers · Minimum ₹2 lakh",
            note: "India's high-value rail. Operated by RBI. Each transaction settles individually — gross settlement, no netting. The ₹2 lakh minimum is a hard limit. Available 24/7 since December 2020.",
            us: "Fedwire equivalent",
            india: "CFO transferring ₹5 crore to pay a supplier",
          },
          {
            name: "RuPay Cards",
            network: "NPCI",
            color: "#ec4899",
            speed: "Auth instant · Settle T+1/T+2",
            cost: "Lower MDR than Visa/Mastercard · Near-zero for some categories",
            reversible: "Yes — chargeback mechanism",
            bestFor: "Government-promoted card payments · Lower MDR use cases",
            note: "India's domestic card network created by NPCI. Lower interchange than Visa/Mastercard by design — government policy to make card acceptance affordable. Works exactly like Visa/Mastercard structurally but routes through NPCI instead.",
            us: "No direct US equivalent — closest is a regulated domestic debit scheme",
            india: "Jan Dhan account holders · Kisan Credit Cards",
          },
        ].map((rail) => (
          <RailCard key={rail.name} rail={rail} />
        ))}
      </Section>

      {/* Real Architecture Decisions */}
      <Section title="Real Architecture Decisions Illuminated">
        {[
          {
            company: "DoorDash (US)",
            decision: "Moved driver payouts from ACH to RTP",
            reason: "Drivers can cash out immediately after delivery. Competitive differentiator for driver acquisition. Slightly higher per-transaction cost accepted in exchange for driver experience improvement.",
            rail: "RTP",
            color: "#ef4444",
          },
          {
            company: "Swiggy (India)",
            decision: "NEFT for weekly restaurant partner settlement",
            reason: "Restaurants don't need instant settlement — they care about predictable timing and low fees. NEFT is cheap, reliable, and sufficient. No need to pay for UPI's speed they don't need.",
            rail: "NEFT",
            color: "#f59e0b",
          },
          {
            company: "Amazon India",
            decision: "Supports UPI + Cards + Net Banking + EMI + Pay Later",
            reason: "Each rail serves a different user segment. UPI for smartphone-native users. Cards for premium customers. Net banking for users without cards. The architect's job was to support all rails and reconcile across all of them.",
            rail: "Multi-rail",
            color: "#00d4ff",
          },
          {
            company: "US B2B SaaS (Annual Contracts)",
            decision: "ACH over cards for contracts above $10,000",
            reason: "2.9% on $10,000 = $290 in card fees. ACH costs $1. For B2B with annual contracts, ACH is obvious once the customer is onboarded. Cards only for initial trial or low-value plans.",
            rail: "ACH",
            color: "#10b981",
          },
        ].map((item) => (
          <div key={item.company} style={{
            padding: "16px",
            marginBottom: 12,
            background: "#0f172a",
            border: `1px solid ${item.color}30`,
            borderRadius: 8,
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>
                {item.company}
              </span>
              <span style={{
                fontSize: 9,
                color: item.color,
                padding: "2px 8px",
                background: `${item.color}15`,
                border: `1px solid ${item.color}30`,
                borderRadius: 4,
                fontWeight: 700,
              }}>
                {item.rail}
              </span>
            </div>
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#94a3b8",
              marginBottom: 6,
            }}>
              {item.decision}
            </div>
            <p style={{ fontSize: 11, color: "#64748b", margin: 0, lineHeight: 1.7 }}>
              {item.reason}
            </p>
          </div>
        ))}
      </Section>

      {/* India Advantage */}
      <Section title="The India Advantage — Why It Matters for Architects">
        <div style={{
          padding: "20px 24px",
          background: "rgba(0,212,255,0.05)",
          border: "1px solid rgba(0,212,255,0.2)",
          borderRadius: 10,
          marginBottom: 16,
        }}>
          <p style={{ margin: "0 0 12px 0" }}>
            Every major economy is now building an instant payment system
            modeled on what India did with UPI — Brazil's PIX, Singapore's
            PayNow, EU's SEPA Instant, US's FedNow. The architectural
            principles are identical: open interoperability, central operator,
            account-to-account push payments, real-time settlement.
          </p>
          <p style={{ margin: 0 }}>
            Understanding UPI deeply means you can reason about all of these
            systems because they share the same DNA. This is a genuine career
            advantage for an architect with India market knowledge.
          </p>
        </div>
      </Section>

      {/* Sources */}
      <Section title="Primary Sources">
        {[
          { name: "The Clearing House — RTP", url: "https://www.theclearinghouse.org/payment-systems/rtp" },
          { name: "Federal Reserve — FedNow", url: "https://www.fednow.org" },
          { name: "Federal Reserve — ACH", url: "https://www.federalreserve.gov/paymentsystems/fedach_about.htm" },
          { name: "NPCI — UPI", url: "https://www.npci.org.in/what-we-do/upi/product-overview" },
          { name: "NPCI — IMPS", url: "https://www.npci.org.in/what-we-do/imps/product-overview" },
          { name: "RBI — NEFT & RTGS", url: "https://www.rbi.org.in/Scripts/FAQView.aspx?Id=60" },
          { name: "ACI Worldwide Real-Time Payments Report", url: "https://www.aciworldwide.com/prime-time-for-real-time" },
        ].map((source) => (
          <a
            key={source.name}
            href={source.url}
            target="_blank"
            rel={'noopener noreferrer'}
            style={{
              display: "block",
              padding: "10px 14px",
              marginBottom: 8,
              background: "#0f172a",
              border: "1px solid #1e2d45",
              borderRadius: 6,
              color: "#00d4ff",
              fontSize: 11,
              textDecoration: "none",
            }}
          >
            → {source.name}
          </a>
        ))}
      </Section>

    </div>
  );
}

// ── Helper Components ─────────────────────────────────────────

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{
        fontSize: 11,
        fontWeight: 700,
        color: "#64748b",
        letterSpacing: "0.12em",
        marginBottom: 20,
        paddingBottom: 10,
        borderBottom: "1px solid #1e2d45",
      }}>
        {title.toUpperCase()}
      </div>
      <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.9 }}>
        {children}
      </div>
    </div>
  );
}

function RailCard({ rail }) {
  return (
    <div style={{
      marginBottom: 16,
      background: "#0f172a",
      border: `1px solid ${rail.color}20`,
      borderRadius: 10,
      overflow: "hidden",
    }}>
      <div style={{
        padding: "14px 16px",
        background: `${rail.color}10`,
        borderBottom: `1px solid ${rail.color}20`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: rail.color }}>
          {rail.name}
        </span>
        <span style={{ fontSize: 10, color: "#64748b" }}>{rail.network}</span>
      </div>
      <div style={{ padding: "14px 16px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginBottom: 12,
        }}>
          {[
            { label: "Speed", value: rail.speed },
            { label: "Cost", value: rail.cost },
            { label: "Reversible", value: rail.reversible },
            { label: "Best For", value: rail.bestFor },
          ].map((item) => (
            <div key={item.label}>
              <div style={{
                fontSize: 9,
                fontWeight: 700,
                color: "#64748b",
                letterSpacing: "0.08em",
                marginBottom: 3,
              }}>
                {item.label.toUpperCase()}
              </div>
              <div style={{ fontSize: 10, color: "#94a3b8", lineHeight: 1.5 }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
        <div style={{
          padding: "10px 12px",
          background: "rgba(100,116,139,0.08)",
          borderRadius: 6,
          fontSize: 10,
          color: "#64748b",
          lineHeight: 1.7,
          marginBottom: 10,
          fontStyle: "italic",
        }}>
          {rail.note}
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
        }}>
          <div style={{
            padding: "8px 10px",
            background: "#0a0e1a",
            borderRadius: 6,
            fontSize: 10,
            color: "#64748b",
          }}>
            <span style={{ color: "#00d4ff", fontWeight: 700 }}>🇺🇸 </span>
            {rail.us}
          </div>
          <div style={{
            padding: "8px 10px",
            background: "#0a0e1a",
            borderRadius: 6,
            fontSize: 10,
            color: "#64748b",
          }}>
            <span style={{ color: "#7c3aed", fontWeight: 700 }}>🇮🇳 </span>
            {rail.india}
          </div>
        </div>
      </div>
    </div>
  );
}
