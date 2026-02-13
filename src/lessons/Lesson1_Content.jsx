export default function Lesson1_Content() {
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
          LESSON 01
        </div>
        <h1 style={{
          fontSize: 28,
          fontWeight: 700,
          color: "#ffffff",
          margin: "0 0 16px 0",
          lineHeight: 1.3,
        }}>
          The Real-World Payment Stack
        </h1>
        <p style={{
          fontSize: 13,
          color: "#94a3b8",
          lineHeight: 1.8,
          margin: 0,
        }}>
          Everything in payments — APIs, fraud systems, settlement logic, disputes —
          is built on top of this model. Get this mental model locked in and
          everything else will make sense.
        </p>
      </div>

      {/* Section — The Problem */}
      <Section title="Why Does This Stack Exist?">
        <p>
          Before cards existed, buying on credit meant the store owner personally
          knew you. How does a Starbucks cashier in New York trust your Chase card
          is good for $6? She has never met you. Chase has never met Starbucks.
          Yet the transaction completes in 2 seconds.
        </p>
        <p>
          The payment stack exists entirely to solve this <Highlight>trust
          problem at scale</Highlight>. Every party exists because someone needed
          to own a specific piece of the trust chain.
        </p>
      </Section>

      {/* Section — The Parties */}
      <Section title="The Six Parties">
        <Party
          name="Cardholder"
          color="#00d4ff"
          icon="👤"
          us="You, with a Chase Sapphire Visa"
          india="You, with an HDFC Bank Visa"
          why="The person whose money it ultimately is."
        />
        <Party
          name="Issuing Bank"
          color="#7c3aed"
          icon="🏛️"
          us="Chase, Bank of America, Capital One"
          india="HDFC Bank, SBI Cards, ICICI Bank"
          why="Knows you. Vouches for you. Carries the credit risk. Earns the largest fee."
        />
        <Party
          name="Card Network"
          color="#ec4899"
          icon="🌐"
          us="Visa, Mastercard, Amex"
          india="Visa, Mastercard, RuPay (operated by NPCI)"
          why="The pipe and the rulebook. Solves the interoperability problem. Does not hold your money."
        />
        <Party
          name="Acquiring Bank"
          color="#f59e0b"
          icon="🏦"
          us="JPMorgan Chase Acquiring, Fiserv, BofA Merchant"
          india="HDFC Bank Acquiring, Axis Bank, ICICI Acquiring"
          why="Knows the merchant. Holds merchant's settlement account. Licensed network member."
        />
        <Party
          name="Processor"
          color="#10b981"
          icon="⚙️"
          us="Adyen, Stripe, Aurus, TSYS, Fiserv"
          india="Razorpay, PayU, CCAvenue, Cashfree"
          why="Technology layer. APIs, terminals, fraud tools, reporting. Amortizes complexity across thousands of merchants."
        />
        <Party
          name="Merchant"
          color="#64748b"
          icon="🏪"
          us="Starbucks, Amazon, DoorDash"
          india="Flipkart, Zepto, Reliance Smart"
          why="Integrates with processor. Never thinks about acquirers or networks directly."
        />
      </Section>

      {/* Section — Processor Types */}
      <Section title="Three Types of Processors">
        <ProcessorType
          name="Licensed Processor + Acquirer"
          example="Adyen"
          color="#00d4ff"
          description="Holds acquiring licenses. Connects directly to Visa/Mastercard. Acts as both technology layer and acquirer. More control over auth rates and settlement. Used by Uber, McDonald's, Spotify."
        />
        <ProcessorType
          name="Pure Technology Middleware"
          example="Aurus"
          color="#7c3aed"
          description="No acquiring license. Sits between merchant POS and multiple acquirers. Enables transaction routing across acquirers. Common in large US enterprise retail."
        />
        <ProcessorType
          name="Payment Facilitator (PayFac)"
          example="Stripe, Razorpay"
          color="#10b981"
          description="Master merchant account with an acquirer. Onboards sub-merchants under their umbrella. Sign up in minutes. Stripe in US, Razorpay in India. PayFac bears the risk."
        />
      </Section>

      {/* Section — Three Phases */}
      <Section title="The Three Phases of Every Transaction">
        <Phase
          name="Authorization"
          color="#00d4ff"
          time="~2 seconds"
          description="Issuer approves and reserves funds. Pure messaging. No money moves. Terminal says Approved."
          us="Chase holds $6.00 for Starbucks transaction"
          india="HDFC holds ₹500 for Reliance Smart transaction"
        />
        <Phase
          name="Clearing"
          color="#7c3aed"
          time="End of day"
          description="Merchant submits final amounts via processor. Network calculates interbank positions. Authorization hold converts to actual debit."
          us="Starbucks submits daily batch ~11pm"
          india="Reliance Smart submits EOD batch"
        />
        <Phase
          name="Settlement"
          color="#ef4444"
          time="T+1 / T+2"
          description="Actual money moves between banks. Issuer pays acquirer via network. Acquirer pays merchant minus all fees."
          us="Starbucks receives $5.65 of original $6.00"
          india="Reliance Smart receives ₹488 of ₹500"
        />
      </Section>

      {/* Section — Key Insight */}
      <Section title="The Most Important Insight">
        <div style={{
          background: "#0f172a",
          border: "1px solid #1e3a5f",
          borderLeft: "4px solid #00d4ff",
          borderRadius: 8,
          padding: "20px 24px",
          marginBottom: 16,
        }}>
          <div style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#ffffff",
            marginBottom: 12,
          }}>
            Authorization ≠ Money Movement
          </div>
          <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.8, margin: 0 }}>
            When the terminal says "Approved," no money has moved. The issuer has
            reserved funds. The merchant has a promise. Actual funds move at
            settlement — T+1 or T+2 later. The gap between these two events is
            where refunds, disputes, fraud, and partial captures all live.
          </p>
        </div>
      </Section>

      {/* Section — Fee Breakdown */}
      <Section title="Where Does the Money Go?">
        <FeeBreakdown
          title="US — $6.00 Starbucks (Chase Visa Credit)"
          rows={[
            { label: "You pay", amount: "$6.00", color: "#e2e8f0" },
            { label: "Interchange → Chase (Issuer)", amount: "− $0.14", color: "#ef4444" },
            { label: "Scheme fee → Visa", amount: "− $0.03", color: "#ec4899" },
            { label: "Acquirer margin", amount: "− $0.08", color: "#f59e0b" },
            { label: "Processor fee → Adyen", amount: "− $0.10", color: "#10b981" },
            { label: "Starbucks receives", amount: "$5.65", color: "#00d4ff", bold: true },
          ]}
        />
        <FeeBreakdown
          title="India — ₹500 Reliance Smart (HDFC Visa Credit)"
          rows={[
            { label: "You pay", amount: "₹500.00", color: "#e2e8f0" },
            { label: "Interchange → HDFC (Issuer)", amount: "− ₹7.50", color: "#ef4444" },
            { label: "Scheme fee → Visa", amount: "− ₹1.50", color: "#ec4899" },
            { label: "Acquirer + Processor margin", amount: "− ₹3.00", color: "#f59e0b" },
            { label: "Reliance Smart receives", amount: "₹488.00", color: "#00d4ff", bold: true },
          ]}
        />
      </Section>

      {/* Section — Mental Model */}
      <Section title="The Three-Layer Mental Model">
        <p style={{ marginBottom: 20 }}>
          Use this to orient yourself in any payments conversation:
        </p>
        <Layer
          name="Money Layer"
          color="#ef4444"
          parties="Issuer + Acquirer"
          description="Licensed banks. Where funds actually live and move. Regulated by Fed + OCC in US, RBI in India."
        />
        <Layer
          name="Rules Layer"
          color="#ec4899"
          parties="Visa, Mastercard, RuPay / NPCI"
          description="Sets operating rules, interchange rates, dispute processes. The referee. Everyone else must follow their rules."
        />
        <Layer
          name="Technology Layer"
          color="#10b981"
          parties="Adyen, Aurus, Stripe, Razorpay, PayU"
          description="Makes participation practical for merchants. APIs, terminals, fraud tools, reporting. Where engineers spend their time."
        />
        <div style={{
          marginTop: 20,
          padding: "14px 18px",
          background: "#0f172a",
          border: "1px solid #1e2d45",
          borderRadius: 8,
          fontSize: 11,
          color: "#64748b",
          fontStyle: "italic",
        }}>
          Architect's question for every decision: Which layer is this sitting in,
          and who actually holds the money?
        </div>
      </Section>

      {/* Sources */}
      <Section title="Primary Sources to Validate This">
        {[
          { name: "Visa — How Visa Works", url: "https://usa.visa.com/run-your-business/small-business-resources/payment-technology/how-visa-works.html" },
          { name: "Mastercard Rules", url: "https://www.mastercard.us/en-us/business/overview/support/rules.html" },
          { name: "NPCI Official", url: "https://www.npci.org.in" },
          { name: "Stripe Docs — Payments", url: "https://stripe.com/docs/payments/accept-a-payment" },
          { name: "Adyen Knowledge Hub", url: "https://www.adyen.com/knowledge-hub" },
          { name: "RBI Payment Guidelines", url: "https://www.rbi.org.in" },
          { name: "US Federal Reserve Payments Study", url: "https://www.federalreserve.gov/paymentsystems/fr-payments-study.htm" },
        ].map((source) => (
          <a
            key={source.name}
            href={source.url}
            target="_blank"
            rel="noreferrer"
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

function Highlight({ children }) {
  return (
    <span style={{ color: "#00d4ff", fontWeight: 700 }}>{children}</span>
  );
}

function Party({ name, color, icon, us, india, why }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "200px 1fr",
      gap: 16,
      padding: "14px 0",
      borderBottom: "1px solid #1e2d45",
    }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span>{icon}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color }}>{name}</span>
        </div>
        <div style={{ fontSize: 10, color: "#64748b" }}>🇺🇸 {us}</div>
        <div style={{ fontSize: 10, color: "#64748b", marginTop: 3 }}>🇮🇳 {india}</div>
      </div>
      <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.7, paddingTop: 4 }}>
        {why}
      </div>
    </div>
  );
}

function ProcessorType({ name, example, color, description }) {
  return (
    <div style={{
      padding: "16px",
      marginBottom: 12,
      background: "#0f172a",
      border: `1px solid ${color}30`,
      borderLeft: `3px solid ${color}`,
      borderRadius: 8,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color }}>{name}</span>
        <span style={{ fontSize: 10, color: "#64748b" }}>e.g. {example}</span>
      </div>
      <p style={{ fontSize: 11, color: "#94a3b8", margin: 0, lineHeight: 1.7 }}>
        {description}
      </p>
    </div>
  );
}

function Phase({ name, color, time, description, us, india }) {
  return (
    <div style={{
      padding: "16px",
      marginBottom: 12,
      background: "#0f172a",
      border: `1px solid ${color}30`,
      borderRadius: 8,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color }}>{name}</span>
        <span style={{ fontSize: 10, color: "#64748b" }}>{time}</span>
      </div>
      <p style={{ fontSize: 11, color: "#94a3b8", margin: "0 0 10px", lineHeight: 1.7 }}>
        {description}
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div style={{ fontSize: 10, color: "#64748b" }}>🇺🇸 {us}</div>
        <div style={{ fontSize: 10, color: "#64748b" }}>🇮🇳 {india}</div>
      </div>
    </div>
  );
}

function FeeBreakdown({ title, rows }) {
  return (
    <div style={{
      marginBottom: 16,
      background: "#0f172a",
      border: "1px solid #1e2d45",
      borderRadius: 8,
      overflow: "hidden",
    }}>
      <div style={{
        padding: "10px 16px",
        background: "#111827",
        fontSize: 10,
        color: "#64748b",
        borderBottom: "1px solid #1e2d45",
      }}>
        {title}
      </div>
      {rows.map((row) => (
        <div key={row.label} style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "8px 16px",
          borderBottom: "1px solid #1e2d45",
        }}>
          <span style={{ fontSize: 11, color: "#94a3b8" }}>{row.label}</span>
          <span style={{
            fontSize: 11,
            color: row.color,
            fontWeight: row.bold ? 700 : 400,
          }}>
            {row.amount}
          </span>
        </div>
      ))}
    </div>
  );
}

function Layer({ name, color, parties, description }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "140px 1fr",
      gap: 16,
      padding: "14px 0",
      borderBottom: "1px solid #1e2d45",
    }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 4 }}>
          {name}
        </div>
        <div style={{ fontSize: 10, color: "#64748b" }}>{parties}</div>
      </div>
      <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.7, paddingTop: 2 }}>
        {description}
      </div>
    </div>
  );
}