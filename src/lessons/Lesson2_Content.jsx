export default function Lesson2_Content() {
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
          LESSON 02
        </div>
        <h1 style={{
          fontSize: 28,
          fontWeight: 700,
          color: "#ffffff",
          margin: "0 0 16px 0",
          lineHeight: 1.3,
        }}>
          The Transaction Lifecycle
        </h1>
        <p style={{
          fontSize: 13,
          color: "#94a3b8",
          lineHeight: 1.8,
          margin: 0,
        }}>
          Between authorization and settlement live five distinct operations.
          Confusing them causes real production bugs. Understanding them
          precisely is what separates an engineer from an architect.
        </p>
      </div>

      {/* Why This Matters */}
      <Section title="Why This Lesson Matters">
        <p>
          Companies have charged customers twice by capturing the same
          authorization twice. Lost chargeback disputes by not understanding
          evidence requirements. Held customer funds too long by not knowing
          when to release an authorization.
        </p>
        <p>
          These are not theoretical mistakes. Every payment API you will
          ever work with — Stripe, Razorpay, Adyen — is an implementation
          of the same underlying state machine. Know the states, know the system.
        </p>
      </Section>

      {/* The Five Operations */}
      <Section title="The Five Core Operations">
        <p style={{ marginBottom: 20 }}>
          Every card transaction goes through some combination of these five
          operations. Not every transaction goes through all five — but every
          transaction goes through at least two.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 16 }}>
          {[
            { path: "Authorization → Capture → Settlement", label: "Normal happy path", color: "#10b981" },
            { path: "Authorization → Void", label: "Cancellation — no money moves", color: "#00d4ff" },
            { path: "Authorization → Capture → Settlement → Refund", label: "Post-settlement return", color: "#f59e0b" },
            { path: "Authorization → Capture → Settlement → Chargeback", label: "Dispute path", color: "#ef4444" },
          ].map((item) => (
            <div key={item.path} style={{
              padding: "10px 14px",
              background: "#0f172a",
              border: `1px solid ${item.color}30`,
              borderLeft: `3px solid ${item.color}`,
              borderRadius: 6,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <span style={{ fontSize: 11, color: "#e2e8f0" }}>{item.path}</span>
              <span style={{ fontSize: 10, color: item.color }}>{item.label}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Operation 1 - Authorization */}
      <Section title="Operation 1 — Authorization">
        <OperationHeader
          number="01"
          name="Authorization"
          color="#00d4ff"
          timing="~2 seconds"
          moneyMoves={false}
          reversible={true}
        />
        <p>
          Authorization is a question sent from the acquirer to the issuer:
          <em style={{ color: "#e2e8f0" }}> "Can this card pay this amount right now?"</em>
        </p>
        <p>
          The issuer checks available balance, fraud risk, card status, and
          geographic rules. On approval, an authorization code is generated
          and a hold is placed on cardholder funds.
        </p>
        <KeyInsight color="#00d4ff">
          The hold amount and final capture amount do not have to match.
          A hotel authorizes $200 at check-in and captures $340 at check-out.
          A gas station authorizes $1.00 and captures the actual fuel amount.
        </KeyInsight>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
          <MarketExample
            flag="🇺🇸"
            market="US"
            color="#00d4ff"
            example="Chase Sapphire tapped at Starbucks NYC — Chase holds $6.00. Auth code generated."
          />
          <MarketExample
            flag="🇮🇳"
            market="India"
            color="#7c3aed"
            example="HDFC Visa at Reliance Smart — HDFC holds ₹500. Auth valid for 30 days."
          />
        </div>
        <NuanceBox title="Authorization Expiry">
          Authorizations do not last forever. Visa and Mastercard allow up to
          30 days. If a merchant does not capture within that window, the hold
          is released automatically. E-commerce merchants who authorize at order
          time but ship weeks later must re-authorize if too much time passes.
        </NuanceBox>
      </Section>

      {/* Operation 2 - Capture */}
      <Section title="Operation 2 — Capture">
        <OperationHeader
          number="02"
          name="Capture"
          color="#7c3aed"
          timing="Immediate or days later"
          moneyMoves={false}
          reversible={false}
        />
        <p>
          Capture is the merchant confirming the final amount and triggering
          settlement. No money moves at capture — but it puts the transaction
          into the settlement batch.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div style={{
            padding: "14px 16px",
            background: "#0f172a",
            border: "1px solid #1e2d45",
            borderRadius: 8,
          }}>
            <div style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#7c3aed",
              marginBottom: 8,
              letterSpacing: "0.08em",
            }}>
              SINGLE MESSAGE (Auth + Capture)
            </div>
            <p style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.7, margin: 0 }}>
              Authorization and capture happen simultaneously.
              Standard for card present. Terminal says approved
              and transaction immediately enters settlement batch.
            </p>
            <div style={{ fontSize: 10, color: "#64748b", marginTop: 8 }}>
              🇺🇸 Starbucks POS · 🇮🇳 Reliance Smart terminal
            </div>
          </div>
          <div style={{
            padding: "14px 16px",
            background: "#0f172a",
            border: "1px solid #1e2d45",
            borderRadius: 8,
          }}>
            <div style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#00d4ff",
              marginBottom: 8,
              letterSpacing: "0.08em",
            }}>
              DUAL MESSAGE (Auth then Capture)
            </div>
            <p style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.7, margin: 0 }}>
              Authorization now, capture later. Dominant in
              e-commerce. Amazon authorizes at order, captures
              at shipment. Protects merchant if item out of stock.
            </p>
            <div style={{ fontSize: 10, color: "#64748b", marginTop: 8 }}>
              🇺🇸 Amazon · 🇮🇳 Flipkart, Myntra
            </div>
          </div>
        </div>

        <NuanceBox title="Partial Capture">
          You authorize $100. One item is out of stock. You capture $80
          and release the remaining $20 hold. All major processors support
          partial capture via API. Stripe: set amount in capture call.
          Razorpay: capture with custom amount parameter.
        </NuanceBox>

        <div style={{ marginTop: 16 }}>
          <APIStates title="Stripe API States">
            {[
              { state: "requires_capture", meaning: "Authorized — awaiting capture" },
              { state: "succeeded", meaning: "Captured — entering settlement" },
            ]}
          </APIStates>
          <APIStates title="Razorpay API States">
            {[
              { state: "authorized", meaning: "Hold placed — awaiting capture" },
              { state: "captured", meaning: "Captured — entering settlement" },
            ]}
          </APIStates>
        </div>
      </Section>

      {/* Operation 3 - Void */}
      <Section title="Operation 3 — Void">
        <OperationHeader
          number="03"
          name="Void"
          color="#10b981"
          timing="Before settlement only"
          moneyMoves={false}
          reversible={true}
        />
        <p>
          A void cancels an authorization before it has been captured and
          settled. The hold on cardholder funds is released immediately.
          No money ever moved. No fees charged.
        </p>
        <KeyInsight color="#10b981">
          Void is only possible before settlement. Once money has moved,
          you cannot void — you must issue a refund instead. Voids are
          free. Refunds cost interchange. Always void before the batch closes.
        </KeyInsight>
        <div style={{ marginTop: 16 }}>
          <p style={{ marginBottom: 12 }}>Common void scenarios:</p>
          {[
            "Customer cancels order before shipment",
            "Duplicate authorization detected by merchant system",
            "Hotel cancellation before check-out",
            "Fraud detected by merchant after authorization",
            "E-commerce item out of stock after auth",
          ].map((scenario) => (
            <div key={scenario} style={{
              padding: "8px 12px",
              marginBottom: 6,
              background: "#0f172a",
              border: "1px solid #1e2d45",
              borderRadius: 6,
              fontSize: 11,
              color: "#94a3b8",
            }}>
              · {scenario}
            </div>
          ))}
        </div>
        <NuanceBox title="Common Production Bug">
          Merchant system crashes after authorization but before capture.
          When it recovers it tries to void — but the authorization has
          already aged past the void window and auto-settled. Customer is
          charged. Merchant must now issue a refund, paying interchange
          and creating a worse customer experience. Design your systems
          with void-window awareness.
        </NuanceBox>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
          <MarketExample
            flag="🇺🇸"
            market="US"
            color="#00d4ff"
            example="Void window typically until end-of-day settlement batch closes."
          />
          <MarketExample
            flag="🇮🇳"
            market="India"
            color="#7c3aed"
            example="Razorpay supports void via cancel payment flow before capture. UPI has no traditional void — payments are atomic."
          />
        </div>
      </Section>

      {/* Operation 4 - Refund */}
      <Section title="Operation 4 — Refund">
        <OperationHeader
          number="04"
          name="Refund"
          color="#f59e0b"
          timing="T+1 to T+7 days"
          moneyMoves={true}
          reversible={false}
        />
        <p>
          A refund is a new transaction in reverse — it moves money from
          the merchant back to the cardholder after settlement has occurred.
          It is not undoing the original transaction. It is creating a new
          credit transaction flowing back through the same rails.
        </p>
        <KeyInsight color="#f59e0b">
          Interchange on the original transaction is NOT returned when
          you refund. The merchant pays the original interchange and gets
          nothing back. Stripe returns their processing fee on refunds —
          but interchange is gone. High refund rates are a direct financial
          cost to merchants.
        </KeyInsight>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
          <MarketExample
            flag="🇺🇸"
            market="US"
            color="#00d4ff"
            example="Stripe refunds: 5-10 business days to cardholder statement. Partial refunds supported via API."
          />
          <MarketExample
            flag="🇮🇳"
            market="India"
            color="#7c3aed"
            example="Razorpay card refunds: 5-7 business days. UPI refunds: 24-48 hours via NPCI infrastructure."
          />
        </div>
        <NuanceBox title="Architect's Data Model Rule">
          Every refund must map to an original payment in your database.
          Every chargeback must map to an original payment. Without this
          linkage your accounting will never balance and reconciliation
          becomes impossible. Design this mapping into your schema
          before you write a single line of payment code.
        </NuanceBox>
      </Section>

      {/* Operation 5 - Chargeback */}
      <Section title="Operation 5 — Chargeback">
        <OperationHeader
          number="05"
          name="Chargeback"
          color="#ef4444"
          timing="Up to 120 days after transaction"
          moneyMoves={true}
          reversible={true}
        />
        <p>
          A chargeback is fundamentally different from a refund. In a
          refund, the merchant initiates the money return. In a chargeback,
          the cardholder's issuing bank forcibly reverses the transaction —
          whether the merchant agrees or not.
        </p>
        <div style={{ marginBottom: 16 }}>
          <p style={{ marginBottom: 12 }}>Cardholder dispute reasons:</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { reason: "Fraud", desc: "I never made this transaction" },
              { reason: "Non-delivery", desc: "I paid but never received goods" },
              { reason: "Item not as described", desc: "Product was materially different" },
              { reason: "Processing error", desc: "I was charged the wrong amount" },
              { reason: "Credit not processed", desc: "I returned it but got no refund" },
              { reason: "Subscription cancelled", desc: "Charged after cancellation" },
            ].map((item) => (
              <div key={item.reason} style={{
                padding: "10px 12px",
                background: "#0f172a",
                border: "1px solid #1e2d45",
                borderRadius: 6,
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#ef4444", marginBottom: 3 }}>
                  {item.reason}
                </div>
                <div style={{ fontSize: 10, color: "#64748b" }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <KeyInsight color="#ef4444">
          Liability shift from 3DS reappears here. If 3DS authentication
          passed, fraud chargeback liability shifts from merchant to issuer.
          This is the single biggest financial reason to implement 3DS —
          not just compliance, but protection from fraud chargebacks.
        </KeyInsight>

        <NuanceBox title="Chargeback Ratio — The Threshold That Matters">
          Visa and Mastercard monitor merchant chargeback rates monthly.
          Exceed 1% of transactions in chargebacks and you enter a monitoring
          program with fines. Exceed it for multiple months and you can be
          terminated from accepting cards entirely — placed on the MATCH list,
          effectively blacklisted. Architects must build chargeback monitoring
          into their dashboards.
        </NuanceBox>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
          <MarketExample
            flag="🇺🇸"
            market="US"
            color="#00d4ff"
            example="30-day dispute response window. Chargeback fee: $15-$25 per dispute. Evidence: delivery proof, IP logs, 3DS result, customer comms."
          />
          <MarketExample
            flag="🇮🇳"
            market="India"
            color="#7c3aed"
            example="RBI regulates chargeback handling. Razorpay charges per dispute. UPI disputes handled via NPCI dispute resolution — different mechanism entirely."
          />
        </div>
      </Section>

      {/* State Machine */}
      <Section title="The Complete State Machine">
        <p style={{ marginBottom: 20 }}>
          Every payment API you will ever work with is an implementation
          of this state machine. Names differ but transitions are always the same.
        </p>
        <div style={{
          background: "#0f172a",
          border: "1px solid #1e2d45",
          borderRadius: 10,
          padding: "24px",
          fontFamily: "monospace",
        }}>
          {[
            { state: "INITIATED", color: "#64748b", desc: "Payment created in your system" },
            { state: "AUTHORIZED", color: "#00d4ff", desc: "Hold placed. No money moved." },
            { state: "CAPTURED", color: "#7c3aed", desc: "In settlement batch. Still no money moved." },
            { state: "SETTLED", color: "#10b981", desc: "Money moved to merchant." },
            { state: "VOIDED", color: "#94a3b8", desc: "Cancelled before settlement. Hold released." },
            { state: "REFUNDED", color: "#f59e0b", desc: "Merchant returned funds post-settlement." },
            { state: "CHARGEBACK", color: "#ef4444", desc: "Issuer forcibly reversed. Merchant may dispute." },
            { state: "EXPIRED", color: "#374151", desc: "Auth window passed. Hold auto-released." },
          ].map((item, idx) => (
            <div key={item.state} style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: idx < 7 ? 8 : 0,
            }}>
              <div style={{
                width: 120,
                padding: "4px 8px",
                background: `${item.color}15`,
                border: `1px solid ${item.color}40`,
                borderRadius: 4,
                fontSize: 10,
                fontWeight: 700,
                color: item.color,
                textAlign: "center",
              }}>
                {item.state}
              </div>
              <div style={{ fontSize: 10, color: "#64748b" }}>→ {item.desc}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Architect Takeaways */}
      <Section title="Architect Takeaways">
        {[
          {
            title: "Design your data model around states",
            desc: "Every payment needs a status field mapping to this state machine. You should be able to query all authorized-but-not-captured payments older than 25 days — those are approaching expiry.",
            color: "#00d4ff",
          },
          {
            title: "Void before you refund wherever possible",
            desc: "Voids are free. Refunds cost interchange. Build logic that checks settlement status before deciding void vs refund. This saves real money at scale.",
            color: "#10b981",
          },
          {
            title: "Store everything for chargeback defense",
            desc: "IP address, device fingerprint, delivery confirmation, customer communication, 3DS result. If you cannot prove the transaction was legitimate within 30 days, you lose by default.",
            color: "#f59e0b",
          },
          {
            title: "UPI is architecturally different",
            desc: "UPI has no authorization-capture split. It is a push payment — money moves atomically. No traditional void. Disputes go through NPCI resolution. Build this as a completely separate flow.",
            color: "#7c3aed",
          },
          {
            title: "Reconciliation is not optional",
            desc: "Every refund must map to an original payment. Every chargeback must map to an original payment. Design this into your schema before writing payment code.",
            color: "#ef4444",
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

      {/* Sources */}
      <Section title="Primary Sources to Validate This">
        {[
          { name: "Stripe — PaymentIntent Lifecycle", url: "https://stripe.com/docs/payments/paymentintents/lifecycle" },
          { name: "Razorpay — Payment Lifecycle", url: "https://razorpay.com/docs/payments" },
          { name: "Adyen — Payment Statuses", url: "https://docs.adyen.com/online-payments/payment-statuses" },
          { name: "Visa — Dispute Resolution", url: "https://usa.visa.com/support/consumer/transaction-disputes.html" },
          { name: "Mastercard — Chargeback Guide", url: "https://www.mastercard.us/en-us/business/overview/safety-and-security/dispute-resolution.html" },
          { name: "NPCI — UPI Dispute Resolution", url: "https://www.npci.org.in/what-we-do/upi/dispute-redressal-mechanism" },
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

// ── Helper Components ──────────────────────────────────────────

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

function OperationHeader({ number, name, color, timing, moneyMoves, reversible }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 16,
      padding: "14px 16px",
      background: "#0f172a",
      border: `1px solid ${color}40`,
      borderRadius: 8,
      marginBottom: 16,
    }}>
      <div style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: `${color}20`,
        border: `2px solid ${color}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        fontWeight: 700,
        color,
        flexShrink: 0,
      }}>
        {number}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color, marginBottom: 4 }}>{name}</div>
        <div style={{ fontSize: 10, color: "#64748b" }}>Timing: {timing}</div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Badge
          label="Money Moves"
          active={moneyMoves}
          activeColor="#ef4444"
        />
        <Badge
          label="Reversible"
          active={reversible}
          activeColor="#10b981"
        />
      </div>
    </div>
  );
}

function Badge({ label, active, activeColor }) {
  return (
    <div style={{
      padding: "3px 8px",
      borderRadius: 4,
      fontSize: 9,
      fontWeight: 700,
      background: active ? `${activeColor}20` : "#1e2d45",
      color: active ? activeColor : "#374151",
      border: `1px solid ${active ? activeColor + "40" : "#1e2d45"}`,
    }}>
      {active ? "✓" : "✗"} {label}
    </div>
  );
}

function KeyInsight({ children, color }) {
  return (
    <div style={{
      padding: "14px 18px",
      background: `${color}08`,
      border: `1px solid ${color}30`,
      borderLeft: `4px solid ${color}`,
      borderRadius: 8,
      fontSize: 11,
      color: "#94a3b8",
      lineHeight: 1.8,
      margin: "16px 0",
    }}>
      <span style={{ color, fontWeight: 700 }}>Key insight: </span>
      {children}
    </div>
  );
}

function NuanceBox({ title, children }) {
  return (
    <div style={{
      padding: "14px 18px",
      background: "#0f172a",
      border: "1px dashed #1e3a5f",
      borderRadius: 8,
      marginTop: 16,
    }}>
      <div style={{
        fontSize: 10,
        fontWeight: 700,
        color: "#64748b",
        letterSpacing: "0.08em",
        marginBottom: 8,
      }}>
        ⚠ {title.toUpperCase()}
      </div>
      <p style={{ fontSize: 11, color: "#64748b", margin: 0, lineHeight: 1.8 }}>
        {children}
      </p>
    </div>
  );
}

function MarketExample({ flag, market, color, example }) {
  return (
    <div style={{
      padding: "12px 14px",
      background: "#0f172a",
      border: `1px solid ${color}30`,
      borderRadius: 8,
    }}>
      <div style={{
        fontSize: 10,
        fontWeight: 700,
        color,
        marginBottom: 6,
      }}>
        {flag} {market}
      </div>
      <div style={{ fontSize: 10, color: "#64748b", lineHeight: 1.7 }}>
        {example}
      </div>
    </div>
  );
}

function APIStates({ title, children }) {
  return (
    <div style={{
      marginBottom: 10,
      background: "#0f172a",
      border: "1px solid #1e2d45",
      borderRadius: 8,
      overflow: "hidden",
    }}>
      <div style={{
        padding: "8px 14px",
        background: "#111827",
        fontSize: 10,
        color: "#64748b",
        borderBottom: "1px solid #1e2d45",
        fontWeight: 700,
        letterSpacing: "0.06em",
      }}>
        {title.toUpperCase()}
      </div>
      {children.map((item) => (
        <div key={item.state} style={{
          display: "flex",
          gap: 16,
          padding: "8px 14px",
          borderBottom: "1px solid #1e2d45",
          alignItems: "center",
        }}>
          <code style={{
            fontSize: 10,
            color: "#00d4ff",
            background: "rgba(0,212,255,0.08)",
            padding: "2px 6px",
            borderRadius: 3,
            minWidth: 160,
          }}>
            {item.state}
          </code>
          <span style={{ fontSize: 10, color: "#64748b" }}>{item.meaning}</span>
        </div>
      ))}
    </div>
  );
}