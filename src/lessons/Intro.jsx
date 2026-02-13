export default function Intro() {
  return (
    <div style={{
      maxWidth: 720,
      margin: "0 auto",
      padding: "64px 32px",
      fontFamily: "monospace",
      color: "#e2e8f0",
    }}>

      {/* Hero */}
      <div style={{ marginBottom: 64 }}>
        <div style={{
          display: "inline-block",
          padding: "4px 12px",
          background: "rgba(0,212,255,0.1)",
          border: "1px solid rgba(0,212,255,0.3)",
          borderRadius: 4,
          fontSize: 10,
          color: "#00d4ff",
          letterSpacing: "0.15em",
          marginBottom: 24,
        }}>
          PAYMENTS ARCHITECT REFERENCE GUIDE
        </div>

        <h1 style={{
          fontSize: 36,
          fontWeight: 700,
          color: "#ffffff",
          margin: "0 0 20px 0",
          lineHeight: 1.2,
        }}>
          Learning Payments
          <br />
          <span style={{ color: "#00d4ff" }}>From Engineer</span>
          <br />
          to Architect
        </h1>

        <p style={{
          fontSize: 13,
          color: "#94a3b8",
          lineHeight: 1.9,
          margin: "0 0 32px 0",
          maxWidth: 560,
        }}>
          A structured, self-built reference guide covering payment systems,
          rails, transaction lifecycles, fraud, disputes, and architecture
          patterns — documented while learning.
        </p>

        {/* Author card */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "16px 20px",
          background: "#0f172a",
          border: "1px solid #1e2d45",
          borderRadius: 10,
          maxWidth: 360,
        }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #00d4ff, #7c3aed)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            fontWeight: 700,
            color: "#fff",
            flexShrink: 0,
          }}>
            VS
          </div>
          <div>
            <div style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#ffffff",
              marginBottom: 3,
            }}>
              Vinod Sahu
            </div>
            <div style={{ fontSize: 10, color: "#64748b" }}>
              Software Engineer → Payments Architect
            </div>
            <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>
              Building domain knowledge · {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </div>

      {/* What this guide covers */}
      <div style={{ marginBottom: 48 }}>
        <SectionTitle>What This Guide Covers</SectionTitle>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}>
          {[
            { icon: "🏗️", title: "Payment Stack", desc: "Four-party model, processors, acquirers, networks" },
            { icon: "🔄", title: "Transaction Lifecycle", desc: "Auth, capture, void, refund, chargeback" },
            { icon: "🌐", title: "Payment Rails", desc: "Cards, ACH, UPI, RTP, FedNow, NEFT, RTGS" },
            { icon: "🛡️", title: "Fraud & Risk", desc: "3DS, CVV, AVS, velocity checks, liability shift" },
            { icon: "💰", title: "Settlement & Fees", desc: "Interchange, MDR, clearing, reconciliation" },
            { icon: "🏛️", title: "Regulations", desc: "PCI-DSS, RBI guidelines, Durbin Amendment" },
            { icon: "🇺🇸", title: "US Market", desc: "Visa, Mastercard, Stripe, Adyen, Aurus, FedNow" },
            { icon: "🇮🇳", title: "India Market", desc: "UPI, RuPay, NPCI, Razorpay, RBI compliance" },
          ].map((item) => (
            <div key={item.title} style={{
              padding: "14px 16px",
              background: "#0f172a",
              border: "1px solid #1e2d45",
              borderRadius: 8,
            }}>
              <div style={{ fontSize: 16, marginBottom: 6 }}>{item.icon}</div>
              <div style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#e2e8f0",
                marginBottom: 4,
              }}>
                {item.title}
              </div>
              <div style={{ fontSize: 10, color: "#64748b", lineHeight: 1.6 }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How to use */}
      <div style={{ marginBottom: 48 }}>
        <SectionTitle>How to Use This Guide</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { step: "01", text: "Read each lesson in order — concepts build on each other." },
            { step: "02", text: "Use the interactive diagrams to visualize flows. Click steps to expand details." },
            { step: "03", text: "Cross-reference key concepts with the primary sources listed in each lesson." },
            { step: "04", text: "Use the terminology glossary as a quick lookup during real-world work." },
          ].map((item) => (
            <div key={item.step} style={{
              display: "flex",
              gap: 16,
              padding: "12px 16px",
              background: "#0f172a",
              border: "1px solid #1e2d45",
              borderRadius: 8,
              alignItems: "flex-start",
            }}>
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#00d4ff",
                minWidth: 24,
                marginTop: 1,
              }}>
                {item.step}
              </span>
              <span style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.7 }}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Disclaimer */}
      <div style={{ marginBottom: 48 }}>
        <SectionTitle>Important Disclaimer</SectionTitle>
        <div style={{
          padding: "20px 24px",
          background: "rgba(245,158,11,0.05)",
          border: "1px solid rgba(245,158,11,0.3)",
          borderRadius: 10,
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 14,
          }}>
            <span style={{ fontSize: 18 }}>⚠️</span>
            <span style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#f59e0b",
              letterSpacing: "0.05em",
            }}>
              AI-ASSISTED CONTENT
            </span>
          </div>

          <p style={{
            fontSize: 11,
            color: "#94a3b8",
            lineHeight: 1.9,
            margin: "0 0 14px 0",
          }}>
            The content in this guide was developed with the assistance of
            AI (Claude by Anthropic) as a learning and documentation tool.
            While every effort has been made to ensure accuracy, this guide
            is a personal learning reference — not a professional or legal
            source of truth for payment systems.
          </p>

          <p style={{
            fontSize: 11,
            color: "#94a3b8",
            lineHeight: 1.9,
            margin: "0 0 14px 0",
          }}>
            Payment systems, regulations, interchange rates, and industry
            practices change frequently. Information in this guide may be
            incomplete, simplified for learning purposes, or reflect
            conditions at time of writing.
          </p>

          <div style={{
            padding: "12px 16px",
            background: "rgba(245,158,11,0.08)",
            borderRadius: 6,
            fontSize: 11,
            color: "#f59e0b",
            lineHeight: 1.7,
          }}>
            <strong>Always cross-reference</strong> with primary sources —
            Visa/Mastercard operating regulations, RBI guidelines, NPCI
            circulars, PCI-DSS standards, and official processor documentation
            before making architectural or business decisions.
          </div>
        </div>
      </div>

      {/* Primary Sources */}
      <div style={{ marginBottom: 48 }}>
        <SectionTitle>Authoritative Primary Sources</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { flag: "🌐", name: "Visa Operating Regulations", url: "https://usa.visa.com/run-your-business/small-business-resources/payment-technology/how-visa-works.html" },
            { flag: "🌐", name: "Mastercard Rules", url: "https://www.mastercard.us/en-us/business/overview/support/rules.html" },
            { flag: "🇮🇳", name: "NPCI Official — UPI & RuPay", url: "https://www.npci.org.in" },
            { flag: "🇮🇳", name: "RBI Payment System Guidelines", url: "https://www.rbi.org.in" },
            { flag: "🇺🇸", name: "Federal Reserve Payments Study", url: "https://www.federalreserve.gov/paymentsystems/fr-payments-study.htm" },
            { flag: "🔒", name: "PCI Security Standards Council", url: "https://www.pcisecuritystandards.org" },
            { flag: "⚙️", name: "Stripe Developer Documentation", url: "https://stripe.com/docs" },
            { flag: "⚙️", name: "Adyen Knowledge Hub", url: "https://www.adyen.com/knowledge-hub" },
          ].map((source) => (
            <a
              key={source.name}
              href={source.url}
              target="_blank"
              rel={'noopener noreferrer'}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 14px",
                background: "#0f172a",
                border: "1px solid #1e2d45",
                borderRadius: 6,
                color: "#00d4ff",
                fontSize: 11,
                textDecoration: "none",
                transition: "border-color 0.2s",
              }}
            >
              <span>{source.flag}</span>
              <span>→ {source.name}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        paddingTop: 24,
        borderTop: "1px solid #1e2d45",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div style={{ fontSize: 10, color: "#374151" }}>
          Vinod Sahu · Payments Architect Guide · {new Date().getFullYear()}
        </div>
        <div style={{ fontSize: 10, color: "#374151" }}>
          AI-assisted · Always verify with primary sources
        </div>
      </div>

    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{
      fontSize: 11,
      fontWeight: 700,
      color: "#64748b",
      letterSpacing: "0.12em",
      marginBottom: 16,
      paddingBottom: 10,
      borderBottom: "1px solid #1e2d45",
    }}>
      {children.toUpperCase()}
    </div>
  );
}