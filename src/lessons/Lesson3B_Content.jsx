export default function Lesson3B_Content() {
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
          color: "#f59e0b",
          letterSpacing: "0.15em",
          marginBottom: 12,
        }}>
          LESSON 03B — CARD RAILS DEEP DIVE
        </div>
        <h1 style={{
          fontSize: 28,
          fontWeight: 700,
          color: "#ffffff",
          margin: "0 0 16px 0",
          lineHeight: 1.3,
        }}>
          Cards for E-Commerce
          <br />
          <span style={{ color: "#f59e0b" }}>& Retail Architects</span>
        </h1>
        <p style={{
          fontSize: 13,
          color: "#94a3b8",
          lineHeight: 1.8,
          margin: "0 0 20px 0",
        }}>
          For e-commerce and retail, cards are your primary rail. This lesson
          covers what you need beyond the basics — BIN intelligence, auth rate
          optimization, interchange qualification, routing, and the CP vs CNP
          cost gap.
        </p>
        <div style={{
          padding: "12px 16px",
          background: "rgba(245,158,11,0.08)",
          border: "1px solid rgba(245,158,11,0.2)",
          borderRadius: 8,
          fontSize: 11,
          color: "#f59e0b",
        }}>
          ⚡ Focus area: E-commerce and retail architects. These concepts
          directly affect your authorization rates, processing costs, and
          fraud exposure every day.
        </div>
      </div>

      {/* Who Controls What */}
      <Section title="Who Controls What — The Control Map" color="#f59e0b">
        <p style={{ marginBottom: 16 }}>
          Before optimizing anything, you need to know whose decision it is.
          The payment stack has four zones of control. When something goes
          wrong, this map tells you who to talk to and what levers you have.
        </p>
        {[
          {
            zone: "Zone 1 — Issuer",
            color: "#ef4444",
            controls: "Approve/decline decisions, fraud scoring, hold duration, cardholder communication",
            yourLever: "Send better signals — network tokens, 3DS, clean AVS data. You cannot talk to the issuer but you can influence their inputs.",
          },
          {
            zone: "Zone 2 — Network (Visa/MC/NPCI)",
            color: "#ec4899",
            controls: "Interchange rates, chargeback rules, operating regulations, scheme fees",
            yourLever: "Qualify for better interchange tiers (Level 2/3 data, network tokens). Stay below chargeback ratio threshold. Choose right MCC.",
          },
          {
            zone: "Zone 3 — Processor",
            color: "#f59e0b",
            controls: "Fraud engine rules, 3DS trigger thresholds, routing logic, retry logic, settlement timing",
            yourLever: "Configure Stripe Radar rules, Adyen RevenueProtect settings, routing rules, retry strategies via processor dashboard and API.",
          },
          {
            zone: "Zone 4 — Merchant (You)",
            color: "#10b981",
            controls: "Checkout experience, tokenization strategy, pre-auth fraud rules, reconciliation, analytics",
            yourLever: "Full control. Design, build, A/B test, and operate. This is where your architectural decisions live.",
          },
        ].map((item) => (
          <div key={item.zone} style={{
            padding: "14px 16px",
            marginBottom: 10,
            background: "#0f172a",
            border: `1px solid ${item.color}30`,
            borderLeft: `3px solid ${item.color}`,
            borderRadius: 8,
          }}>
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              color: item.color,
              marginBottom: 6,
            }}>
              {item.zone}
            </div>
            <div style={{ fontSize: 10, color: "#64748b", marginBottom: 6 }}>
              <span style={{ color: "#94a3b8" }}>Controls: </span>
              {item.controls}
            </div>
            <div style={{ fontSize: 10, color: "#64748b" }}>
              <span style={{ color: "#10b981" }}>Your lever: </span>
              {item.yourLever}
            </div>
          </div>
        ))}
      </Section>

      {/* BIN Intelligence */}
      <Section title="1. BIN Intelligence — The First 6-8 Digits Tell You Everything" color="#00d4ff">
        <p>
          Every card number starts with a BIN — Bank Identification Number.
          Before you even send an authorization request, the BIN tells you
          the issuing bank, card network, card type, card product, country
          of issuance, and 3DS support.
        </p>

        <div style={{
          padding: "16px",
          background: "#0f172a",
          border: "1px solid #1e2d45",
          borderRadius: 8,
          marginBottom: 16,
          fontFamily: "monospace",
        }}>
          <div style={{ fontSize: 10, color: "#64748b", marginBottom: 10 }}>
            CARD NUMBER ANATOMY
          </div>
          <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
            {[
              { digits: "4532 81", label: "BIN (6-8 digits)", color: "#00d4ff" },
              { digits: "XX XXXX", label: "Account number", color: "#64748b" },
              { digits: "XXXX", label: "Check digit", color: "#374151" },
            ].map((part) => (
              <div key={part.label} style={{ textAlign: "center" }}>
                <div style={{
                  padding: "6px 10px",
                  background: `${part.color}15`,
                  border: `1px solid ${part.color}40`,
                  borderRadius: 4,
                  fontSize: 13,
                  color: part.color,
                  fontWeight: 700,
                  marginBottom: 4,
                  letterSpacing: "0.1em",
                }}>
                  {part.digits}
                </div>
                <div style={{ fontSize: 9, color: "#64748b" }}>{part.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { starts: "4xxx", network: "Visa" },
              { starts: "5xxx / 2xxx", network: "Mastercard" },
              { starts: "3xxx", network: "Amex" },
              { starts: "60xx", network: "RuPay (India)" },
            ].map((item) => (
              <div key={item.starts} style={{
                padding: "6px 10px",
                background: "#0a0e1a",
                borderRadius: 4,
                fontSize: 10,
                color: "#94a3b8",
              }}>
                <span style={{ color: "#00d4ff" }}>{item.starts}</span>
                {" → "}{item.network}
              </div>
            ))}
          </div>
        </div>

        <KeyInsight color="#00d4ff">
          BINs drive three architectural decisions simultaneously: interchange
          cost (premium rewards BIN = higher interchange), fraud signals
          (BIN country ≠ shipping country = fraud signal), and routing
          (BIN-based routing to preferred acquirer).
        </KeyInsight>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
          <MarketExample flag="🇺🇸" market="US" color="#00d4ff"
            example="Chase Sapphire Reserve BIN carries higher interchange than Chase basic debit BIN. Route Visa BINs to your Visa-preferred acquirer."
          />
          <MarketExample flag="🇮🇳" market="India" color="#7c3aed"
            example="NPCI maintains RuPay BIN registry. BINs starting with 60 are RuPay. Route to NPCI-connected acquirer for best approval rates."
          />
        </div>
      </Section>

      {/* Auth Rate Optimization */}
      <Section title="2. Authorization Rate Optimization — The Metric That Affects Revenue" color="#10b981">
        <p>
          Authorization rate is the percentage of attempted transactions
          approved by the issuer. Most e-commerce companies track conversion
          rate obsessively but ignore authorization rate. This is a mistake.
          A drop from 92% to 88% is 4% of your revenue disappearing —
          not from fraud or bad products, but from payment infrastructure.
        </p>

        <div style={{ marginBottom: 16 }}>
          <div style={{
            fontSize: 10,
            fontWeight: 700,
            color: "#64748b",
            letterSpacing: "0.08em",
            marginBottom: 10,
          }}>
            DECLINE TYPES
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{
              padding: "14px",
              background: "#0f172a",
              border: "1px solid rgba(16,185,129,0.3)",
              borderRadius: 8,
            }}>
              <div style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#10b981",
                marginBottom: 8,
              }}>
                Soft Declines — Recoverable
              </div>
              {[
                "Insufficient funds — retry with different payment method",
                "Do not honor — retry with 3DS added",
                "Card velocity exceeded — retry later",
                "Incorrect CVV — prompt user to re-enter",
              ].map((item) => (
                <div key={item} style={{
                  fontSize: 10,
                  color: "#64748b",
                  padding: "4px 0",
                  borderBottom: "1px solid #1e2d45",
                  lineHeight: 1.5,
                }}>
                  · {item}
                </div>
              ))}
            </div>
            <div style={{
              padding: "14px",
              background: "#0f172a",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 8,
            }}>
              <div style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#ef4444",
                marginBottom: 8,
              }}>
                Hard Declines — Stop Retrying
              </div>
              {[
                "Stolen card — issuer flagged as compromised",
                "Invalid card number — card doesn't exist",
                "Card permanently blocked — no retry",
                "Pickup card — physically flagged",
              ].map((item) => (
                <div key={item} style={{
                  fontSize: 10,
                  color: "#64748b",
                  padding: "4px 0",
                  borderBottom: "1px solid #1e2d45",
                  lineHeight: 1.5,
                }}>
                  · {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          fontSize: 10,
          fontWeight: 700,
          color: "#64748b",
          letterSpacing: "0.08em",
          marginBottom: 10,
          marginTop: 20,
        }}>
          YOUR TOOLKIT FOR IMPROVING AUTHORIZATION RATES
        </div>

        {[
          {
            tool: "Network Tokenization",
            color: "#00d4ff",
            impact: "+2–4% auth rate",
            desc: "Replace raw PANs with network-issued tokens (Visa Token Service, Mastercard DEMS). Issuers approve token transactions at higher rates because the token is more secure. Stripe, Adyen, and Razorpay all support this.",
            effort: "Medium — processor config + API change",
          },
          {
            tool: "Account Updater",
            color: "#7c3aed",
            impact: "Prevents subscription churn",
            desc: "Automatically updates stored card details when a cardholder gets a new card number or expiry. Without this, subscriptions fail every time a card is replaced. Critical for any subscription business.",
            effort: "Low — enable in processor settings",
          },
          {
            tool: "Smart Retry Logic",
            color: "#10b981",
            impact: "+15–30% soft decline recovery",
            desc: "When a soft decline returns, don't retry immediately with same parameters. Wait. Change something — add 3DS, try a different acquirer, prompt CVV re-entry. Use the decline reason code to decide what to change.",
            effort: "High — build in your application layer",
          },
          {
            tool: "Decline Reason Surfacing",
            color: "#f59e0b",
            impact: "Measurable conversion recovery",
            desc: "Show the actual decline reason in your UI — not a generic 'payment failed'. 'Insufficient funds — try a different card?' recovers customers. The issuer response code tells you exactly what happened.",
            effort: "Low — UI/UX change using existing response codes",
          },
        ].map((item) => (
          <div key={item.tool} style={{
            padding: "14px 16px",
            marginBottom: 10,
            background: "#0f172a",
            border: `1px solid ${item.color}20`,
            borderLeft: `3px solid ${item.color}`,
            borderRadius: 8,
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 6,
            }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: item.color }}>
                {item.tool}
              </span>
              <span style={{
                fontSize: 9,
                color: item.color,
                padding: "2px 6px",
                background: `${item.color}15`,
                borderRadius: 3,
              }}>
                {item.impact}
              </span>
            </div>
            <p style={{ fontSize: 11, color: "#94a3b8", margin: "0 0 6px", lineHeight: 1.7 }}>
              {item.desc}
            </p>
            <div style={{ fontSize: 10, color: "#64748b" }}>
              Effort: {item.effort}
            </div>
          </div>
        ))}

        <NuanceBox title="India-Specific Auth Rate Challenge">
          RBI's mandatory AFA (Additional Factor of Authentication) requirement
          means every online card transaction above ₹5,000 needs an OTP.
          This adds friction and creates OTP failure drop-off that doesn't
          exist in the US. Indian e-commerce architects must design for OTP
          retry flows, expired OTP handling, and fallback authentication options.
        </NuanceBox>
      </Section>

      {/* Interchange Optimization */}
      <Section title="3. Interchange Optimization — Qualifying for Lower Rates" color="#7c3aed">
        <p>
          Interchange is set by Visa and Mastercard but varies dramatically
          based on how you process a transaction. The same card can qualify
          for different interchange rates depending on what data you send.
          This is called interchange qualification.
        </p>

        <div style={{ marginBottom: 16 }}>
          {[
            {
              level: "Level 1",
              color: "#64748b",
              data: "Basic — transaction amount + merchant category code",
              rate: "Standard interchange rate",
              who: "Most consumer e-commerce",
              saving: "Baseline",
            },
            {
              level: "Level 2",
              color: "#7c3aed",
              data: "Adds sales tax amount, customer PO number, merchant tax ID",
              rate: "~0.5% lower than Level 1",
              who: "Corporate and purchasing cards",
              saving: "~$500 per $100k processed",
            },
            {
              level: "Level 3",
              color: "#00d4ff",
              data: "Adds line-item detail — product codes, quantities, unit prices, shipping",
              rate: "~1%+ lower than Level 1",
              who: "Corporate purchasing cards only",
              saving: "~$1,000+ per $100k processed",
            },
          ].map((item) => (
            <div key={item.level} style={{
              display: "grid",
              gridTemplateColumns: "80px 1fr",
              gap: 12,
              padding: "12px 14px",
              marginBottom: 8,
              background: "#0f172a",
              border: `1px solid ${item.color}30`,
              borderRadius: 8,
            }}>
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <div style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: item.color,
                  marginBottom: 4,
                }}>
                  {item.level}
                </div>
                <div style={{
                  fontSize: 10,
                  color: "#10b981",
                  fontWeight: 700,
                }}>
                  {item.saving}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 4 }}>
                  {item.data}
                </div>
                <div style={{ fontSize: 10, color: "#64748b", marginBottom: 2 }}>
                  Rate: <span style={{ color: item.color }}>{item.rate}</span>
                </div>
                <div style={{ fontSize: 10, color: "#64748b" }}>
                  Who: {item.who}
                </div>
              </div>
            </div>
          ))}
        </div>

        <KeyInsight color="#7c3aed">
          For a B2B e-commerce merchant processing corporate card payments,
          sending Level 3 data can save hundreds of thousands of dollars
          annually in interchange. Adyen and Stripe both support Level 2
          and 3 data submission. Most merchants don't use it because their
          engineers don't know it exists.
        </KeyInsight>

        <div style={{ marginTop: 16 }}>
          <div style={{
            fontSize: 10,
            fontWeight: 700,
            color: "#64748b",
            letterSpacing: "0.08em",
            marginBottom: 10,
          }}>
            MERCHANT CATEGORY CODE (MCC)
          </div>
          <p style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.7 }}>
            Your MCC — the 4-digit code classifying your business — affects
            interchange rates and fraud rules. A grocery store has different
            interchange than a jewelry store. A charity gets lower rates than
            retail. Some corporate cards block certain MCCs entirely.
            Choosing the right MCC is an architectural decision made once
            with ongoing cost implications.
          </p>
        </div>
      </Section>

      {/* Routing Intelligence */}
      <Section title="4. Routing Intelligence — The Right Acquirer for Every Transaction" color="#ec4899">
        <p>
          Large merchants with high volume don't send every transaction to
          one acquirer. They route transactions intelligently to optimize
          authorization rates, minimize cost, and build resilience.
        </p>

        {[
          {
            type: "Geographic Routing",
            color: "#ec4899",
            desc: "A transaction from a UK cardholder routes to a UK acquirer because issuers approve locally-acquired transactions at higher rates. Called local acquiring — can lift auth rates 5–10% for cross-border merchants.",
            example: "US merchant expands to India → adds Indian acquirer (HDFC/Axis) → Indian card auth rates improve immediately",
          },
          {
            type: "Performance Routing",
            color: "#00d4ff",
            desc: "If Acquirer A approves Visa at 94% and Acquirer B at 91%, route Visa to Acquirer A. Track in real time and adjust. Adyen does this automatically within their network.",
            example: "Real-time dashboard shows Acquirer B degrading → traffic shifts to Acquirer A within minutes",
          },
          {
            type: "Failover Routing",
            color: "#10b981",
            desc: "If primary acquirer API returns an error, automatically retry through secondary acquirer. This is payment resiliency — the routing layer is where it's implemented.",
            example: "Primary acquirer timeout → Aurus detects → routes to secondary → cardholder sees no failure",
          },
          {
            type: "Cost-Based Routing",
            color: "#f59e0b",
            desc: "Route debit transactions through cheapest acquirer. Route high-value credit through best-performing acquirer even if slightly more expensive — auth rate improvement may be worth more than cost difference.",
            example: "Debit BIN → cheapest acquirer. Premium Visa Infinite BIN → highest auth-rate acquirer.",
          },
        ].map((item) => (
          <div key={item.type} style={{
            padding: "14px 16px",
            marginBottom: 10,
            background: "#0f172a",
            border: `1px solid ${item.color}20`,
            borderRadius: 8,
          }}>
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              color: item.color,
              marginBottom: 6,
            }}>
              {item.type}
            </div>
            <p style={{ fontSize: 11, color: "#94a3b8", margin: "0 0 8px", lineHeight: 1.7 }}>
              {item.desc}
            </p>
            <div style={{
              padding: "6px 10px",
              background: "#0a0e1a",
              borderRadius: 4,
              fontSize: 10,
              color: "#64748b",
              fontStyle: "italic",
            }}>
              Example: {item.example}
            </div>
          </div>
        ))}

        <div style={{
          marginTop: 16,
          padding: "16px",
          background: "#0f172a",
          border: "1px solid #1e2d45",
          borderRadius: 8,
        }}>
          <div style={{
            fontSize: 10,
            fontWeight: 700,
            color: "#64748b",
            letterSpacing: "0.08em",
            marginBottom: 12,
          }}>
            PROCESSOR ROUTING CONTROL SPECTRUM
          </div>
          {[
            {
              processor: "Stripe",
              control: "Low",
              color: "#64748b",
              desc: "Routes internally. You get simplicity in exchange for control. Local acquiring is a setting you can enable.",
            },
            {
              processor: "Adyen",
              control: "High",
              color: "#10b981",
              desc: "Configure acquiring entity per market, preferred network, retry routing, dynamic 3DS threshold.",
            },
            {
              processor: "Aurus",
              control: "Maximum",
              color: "#00d4ff",
              desc: "Write routing rules. Bring your own acquirers. BIN-based, cost-based, performance-based routing all configurable.",
            },
            {
              processor: "Razorpay (India)",
              control: "Medium",
              color: "#7c3aed",
              desc: "Smart routing handled internally across banking partners. Growing merchant-level configurability.",
            },
          ].map((item) => (
            <div key={item.processor} style={{
              display: "flex",
              gap: 12,
              padding: "8px 0",
              borderBottom: "1px solid #1e2d45",
              alignItems: "flex-start",
            }}>
              <div style={{ minWidth: 80 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#e2e8f0" }}>
                  {item.processor}
                </div>
                <div style={{
                  fontSize: 9,
                  color: item.color,
                  fontWeight: 700,
                  marginTop: 2,
                }}>
                  {item.control} control
                </div>
              </div>
              <div style={{ fontSize: 10, color: "#64748b", lineHeight: 1.6 }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* CP vs CNP Gap */}
      <Section title="5. Card Present vs Card Not Present — The Cost & Risk Gap" color="#ef4444">
        <p>
          You know this distinction from Lesson 1. But as an e-commerce
          architect you need the full business implications — especially
          for omnichannel retailers operating both physical and online.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginBottom: 16,
        }}>
          {[
            {
              type: "Card Present",
              color: "#10b981",
              icon: "🏪",
              interchange: "1.5–1.8% US credit",
              fraud: "LOW — EMV chip solved counterfeit fraud",
              threeDS: "Not required",
              authCapture: "Single message — auto at batch close",
              us: "Starbucks POS, Target checkout",
              india: "Reliance Smart swipe terminal",
            },
            {
              type: "Card Not Present",
              color: "#ef4444",
              icon: "🛒",
              interchange: "1.8–2.5% US credit (same card, higher rate)",
              fraud: "HIGH — fraudsters migrated from CP after EMV",
              threeDS: "US: optional but recommended. India: RBI mandates above ₹5,000",
              authCapture: "Dual message — auth now, capture at shipment",
              us: "Amazon, DoorDash checkout",
              india: "Flipkart, Myntra checkout",
            },
          ].map((item) => (
            <div key={item.type} style={{
              padding: "14px",
              background: "#0f172a",
              border: `1px solid ${item.color}30`,
              borderRadius: 8,
            }}>
              <div style={{
                fontSize: 12,
                fontWeight: 700,
                color: item.color,
                marginBottom: 12,
              }}>
                {item.icon} {item.type}
              </div>
              {[
                { label: "Interchange", value: item.interchange },
                { label: "Fraud risk", value: item.fraud },
                { label: "3DS", value: item.threeDS },
                { label: "Auth/Capture", value: item.authCapture },
              ].map((row) => (
                <div key={row.label} style={{
                  marginBottom: 6,
                  paddingBottom: 6,
                  borderBottom: "1px solid #1e2d45",
                }}>
                  <div style={{
                    fontSize: 9,
                    color: "#64748b",
                    fontWeight: 700,
                    marginBottom: 2,
                  }}>
                    {row.label.toUpperCase()}
                  </div>
                  <div style={{ fontSize: 10, color: "#94a3b8", lineHeight: 1.5 }}>
                    {row.value}
                  </div>
                </div>
              ))}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 8 }}>
                <div style={{ fontSize: 9, color: "#64748b" }}>🇺🇸 {item.us}</div>
                <div style={{ fontSize: 9, color: "#64748b" }}>🇮🇳 {item.india}</div>
              </div>
            </div>
          ))}
        </div>

        <KeyInsight color="#ef4444">
          The fraud migration effect is well-documented. Every time physical
          card security improves (EMV chip adoption in US post-2015), CNP
          fraud increases proportionally because that's where the attack
          surface moves. This is why 3DS, device fingerprinting, and
          behavioral biometrics exist — they are the CNP response to the
          physical card's chip.
        </KeyInsight>
      </Section>

      {/* Processor Selection */}
      <Section title="The Processor Choice Is a Control Choice" color="#00d4ff">
        <p style={{ marginBottom: 16 }}>
          The processor you choose determines how much control you have.
          The right choice depends on your stage, volume, and how much
          optimization matters at your current scale.
        </p>
        <div style={{
          padding: "14px 16px",
          background: "#0f172a",
          border: "1px solid #1e2d45",
          borderRadius: 8,
          fontFamily: "monospace",
        }}>
          {[
            {
              stage: "Early Stage",
              processor: "Stripe / Razorpay",
              color: "#64748b",
              why: "Simple, fast, great DX. Less optimal routing. Accept the tradeoff.",
            },
            {
              stage: "Growth Stage",
              processor: "Adyen",
              color: "#10b981",
              why: "More routing control, IC++ pricing transparency, local acquiring.",
            },
            {
              stage: "Enterprise",
              processor: "Adyen + Aurus",
              color: "#00d4ff",
              why: "Maximum control. Custom routing rules. Own acquirer relationships.",
            },
          ].map((item, idx) => (
            <div key={item.stage} style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 0",
              borderBottom: idx < 2 ? "1px solid #1e2d45" : "none",
            }}>
              <div style={{ minWidth: 100 }}>
                <div style={{ fontSize: 9, color: "#64748b" }}>{item.stage}</div>
                <div style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: item.color,
                }}>
                  {item.processor}
                </div>
              </div>
              <div style={{ fontSize: 10, color: "#64748b", lineHeight: 1.6 }}>
                → {item.why}
              </div>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: 12,
          padding: "12px 14px",
          background: "rgba(0,212,255,0.05)",
          border: "1px solid rgba(0,212,255,0.15)",
          borderRadius: 8,
          fontSize: 11,
          color: "#94a3b8",
          lineHeight: 1.7,
          fontStyle: "italic",
        }}>
          A processor that charges 0.1% more but authorizes 3% more
          transactions is worth significantly more at any real volume.
          Always evaluate on authorization rate, not just pricing.
        </div>
      </Section>

      {/* Sources */}
      <Section title="Primary Sources" color="#64748b">
        {[
          { name: "Visa — Interchange Rates (US)", url: "https://usa.visa.com/support/merchant/library/visa-merchant-business-news-digest.html" },
          { name: "Mastercard — Interchange Rates", url: "https://www.mastercard.us/en-us/business/overview/support/merchant-interchange-rates.html" },
          { name: "Stripe Radar — Custom Rules", url: "https://stripe.com/docs/radar/rules" },
          { name: "Adyen — Revenue Protect", url: "https://docs.adyen.com/risk-management" },
          { name: "Visa Token Service", url: "https://developer.visa.com/capabilities/vts" },
          { name: "Razorpay — Smart Routing", url: "https://razorpay.com/docs/payments/smart-routing" },
          { name: "PCI Security Standards — Level 2/3 Data", url: "https://www.pcisecuritystandards.org" },
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
              color: "#f59e0b",
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

function Section({ title, children, color = "#64748b" }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{
        fontSize: 11,
        fontWeight: 700,
        color,
        letterSpacing: "0.12em",
        marginBottom: 20,
        paddingBottom: 10,
        borderBottom: `1px solid ${color}30`,
      }}>
        {title.toUpperCase()}
      </div>
      <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.9 }}>
        {children}
      </div>
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
      <div style={{ fontSize: 10, fontWeight: 700, color, marginBottom: 6 }}>
        {flag} {market}
      </div>
      <div style={{ fontSize: 10, color: "#64748b", lineHeight: 1.7 }}>
        {example}
      </div>
    </div>
  );
}
