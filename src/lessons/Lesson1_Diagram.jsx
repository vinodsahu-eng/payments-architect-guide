import { useState, useEffect } from "react";

const COLORS = {
  bg: "#0a0e1a",
  surface: "#111827",
  border: "#1e2d45",
  accent: "#00d4ff",
  accent2: "#7c3aed",
  accent3: "#10b981",
  accentWarn: "#f59e0b",
  accentRed: "#ef4444",
  text: "#e2e8f0",
  textMuted: "#64748b",
  textDim: "#94a3b8",
  cardBg: "#0f172a",
  highlight: "#1e3a5f",
};

const PARTIES_CP = [
  { id: "cardholder", label: "Cardholder", sub: "You", icon: "👤", color: "#00d4ff" },
  { id: "terminal", label: "POS Terminal", sub: "Chip/Tap Reader", icon: "💳", color: "#7c3aed" },
  { id: "processor", label: "Processor", sub: "Adyen / Razorpay", icon: "⚙️", color: "#10b981" },
  { id: "acquirer", label: "Acquirer", sub: "Chase / Axis Bank", icon: "🏦", color: "#f59e0b" },
  { id: "network", label: "Network", sub: "Visa / RuPay", icon: "🌐", color: "#ec4899" },
  { id: "issuer", label: "Issuer", sub: "Chase / HDFC Bank", icon: "🏛️", color: "#ef4444" },
];

const PARTIES_CNP = [
  { id: "cardholder", label: "Cardholder", sub: "Browser/App", icon: "👤", color: "#00d4ff" },
  { id: "merchant", label: "Merchant Site", sub: "Checkout Page", icon: "🛒", color: "#7c3aed" },
  { id: "processor", label: "Processor", sub: "Stripe / Razorpay", icon: "⚙️", color: "#10b981" },
  { id: "fraud", label: "Fraud Engine", sub: "3DS / Risk Score", icon: "🛡️", color: "#f59e0b" },
  { id: "network", label: "Network", sub: "Visa / Mastercard", icon: "🌐", color: "#ec4899" },
  { id: "issuer", label: "Issuer", sub: "BofA / HDFC Bank", icon: "🏛️", color: "#ef4444" },
];

const STEPS_CP = [
  {
    from: "cardholder", to: "terminal", direction: "right",
    phase: "auth", phaseLabel: "AUTHORIZATION",
    label: "Tap / Insert / Swipe Card",
    detail: "EMV chip sends encrypted card data. Contactless uses NFC. Mag stripe (legacy) sends raw PAN — less secure.",
    us: "Chase Sapphire tapped at Starbucks NYC",
    india: "HDFC Visa chip inserted at Reliance Smart Mumbai",
    time: "0ms", money: false,
  },
  {
    from: "terminal", to: "processor", direction: "right",
    phase: "auth", phaseLabel: "AUTHORIZATION",
    label: "Authorization Request (ISO 8583)",
    detail: "Terminal sends encrypted auth request via ISO 8583 message format. Includes: PAN, amount, merchant ID, terminal ID, CVV (encrypted).",
    us: "Adyen terminal sends to Adyen processor",
    india: "HDFC acquiring terminal sends to processor",
    time: "~100ms", money: false,
  },
  {
    from: "processor", to: "acquirer", direction: "right",
    phase: "auth", phaseLabel: "AUTHORIZATION",
    label: "Forward Auth Request",
    detail: "Processor routes request to acquirer. If processor IS the acquirer (Adyen), this is internal. Otherwise it's a network hop.",
    us: "Adyen (processor+acquirer) handles internally",
    india: "Razorpay → Axis Bank Acquiring",
    time: "~150ms", money: false,
  },
  {
    from: "acquirer", to: "network", direction: "right",
    phase: "auth", phaseLabel: "AUTHORIZATION",
    label: "Route via Card Network",
    detail: "Acquirer sends to Visa/Mastercard/RuPay network. Network identifies issuing bank from BIN (first 6-8 digits of card number).",
    us: "→ Visa VisaNet infrastructure",
    india: "→ Visa network OR NPCI (RuPay cards)",
    time: "~200ms", money: false,
  },
  {
    from: "network", to: "issuer", direction: "right",
    phase: "auth", phaseLabel: "AUTHORIZATION",
    label: "Auth Request to Issuer",
    detail: "Network delivers to issuing bank. Issuer runs fraud checks: velocity rules, geo-mismatch, spending patterns, available balance.",
    us: "Chase Bank fraud engine evaluates",
    india: "HDFC Bank fraud + balance check",
    time: "~400ms", money: false,
  },
  {
    from: "issuer", to: "network", direction: "left",
    phase: "auth", phaseLabel: "AUTHORIZATION",
    label: "Auth Response: APPROVED ✓",
    detail: "Issuer responds with approval code + authorization code. Funds are RESERVED (hold placed). No money has moved yet.",
    us: "Chase approves, holds $6.00",
    india: "HDFC approves, holds ₹500",
    time: "~600ms", money: false,
    isReturn: true,
  },
  {
    from: "network", to: "acquirer", direction: "left",
    phase: "auth", phaseLabel: "AUTHORIZATION",
    label: "Approval forwarded",
    detail: "Network routes approval back through the chain. Authorization code recorded at each hop.",
    us: "Visa → Chase Acquiring",
    india: "Visa/NPCI → Axis Bank",
    time: "~700ms", money: false,
    isReturn: true,
  },
  {
    from: "acquirer", to: "processor", direction: "left",
    phase: "auth", phaseLabel: "AUTHORIZATION",
    label: "Approval to Processor",
    detail: "Acquirer confirms authorization to processor. Record kept for settlement batch.",
    us: "Chase Acquiring → Adyen",
    india: "Axis Bank → Razorpay",
    time: "~750ms", money: false,
    isReturn: true,
  },
  {
    from: "processor", to: "terminal", direction: "left",
    phase: "auth", phaseLabel: "AUTHORIZATION",
    label: "APPROVED — Terminal Receipt",
    detail: "Terminal receives approval. Prints/displays receipt. Transaction complete from customer perspective. Total elapsed: ~1-2 seconds.",
    us: "Starbucks terminal shows ✓ Approved",
    india: "Reliance Smart terminal beeps ✓",
    time: "~1-2s", money: false,
    isReturn: true,
  },
  {
    from: "terminal", to: "processor", direction: "right",
    phase: "clearing", phaseLabel: "CLEARING",
    label: "Batch Submission (End of Day)",
    detail: "Merchant closes batch at end of business day. All authorized transactions submitted for clearing. Final amounts confirmed — important for tips, fuel, hotels where amount may differ from auth.",
    us: "Starbucks submits daily batch ~11pm",
    india: "Reliance Smart submits EOD batch",
    time: "End of day", money: false,
  },
  {
    from: "processor", to: "acquirer", direction: "right",
    phase: "clearing", phaseLabel: "CLEARING",
    label: "Clearing File to Acquirer",
    detail: "Processor bundles transactions into clearing file format (VisaNet Clearing, Mastercard CIS). Sent to acquirer for settlement processing.",
    us: "Adyen → Chase Acquiring clearing file",
    india: "Razorpay → Axis Bank clearing",
    time: "T+0 night", money: false,
  },
  {
    from: "acquirer", to: "network", direction: "right",
    phase: "clearing", phaseLabel: "CLEARING",
    label: "Clearing via Network",
    detail: "Acquirer submits to Visa/Mastercard clearing system. Network calculates net positions — how much each bank owes each other.",
    us: "Visa calculates: Chase Acquiring owes / owed",
    india: "NPCI calculates net interbank positions",
    time: "T+0 → T+1", money: false,
  },
  {
    from: "network", to: "issuer", direction: "right",
    phase: "clearing", phaseLabel: "CLEARING",
    label: "Clearing to Issuer",
    detail: "Network sends clearing records to issuing bank. Issuer converts authorization hold into actual debit on cardholder account.",
    us: "Chase Bank: hold → actual debit on account",
    india: "HDFC Bank: converts hold to debit",
    time: "T+1", money: false,
  },
  {
    from: "issuer", to: "acquirer", direction: "left",
    phase: "settlement", phaseLabel: "SETTLEMENT",
    label: "💰 Funds Transfer (Actual Money Moves)",
    detail: "MONEY MOVES HERE. Issuer transfers funds to acquirer via interbank settlement. In US: via Fed Settlement or Visa's own settlement service. Interchange fee deducted.",
    us: "Chase Bank → Chase Acquiring via Fed. Chase keeps ~$0.14 interchange.",
    india: "HDFC Issuer → Axis Acquiring via RBI settlement",
    time: "T+1 / T+2", money: true,
    isReturn: true,
  },
  {
    from: "acquirer", to: "processor", direction: "left",
    phase: "settlement", phaseLabel: "SETTLEMENT",
    label: "💰 Net Settlement to Processor",
    detail: "Acquirer pays processor minus acquirer margin. Processor reconciles all merchant settlements.",
    us: "Chase Acquiring → Adyen (minus acquirer margin ~$0.08)",
    india: "Axis Bank → Razorpay (minus margin)",
    time: "T+1 / T+2", money: true,
    isReturn: true,
  },
  {
    from: "processor", to: "terminal", direction: "left",
    phase: "settlement", phaseLabel: "SETTLEMENT",
    label: "💰 Merchant Payout",
    detail: "Processor deposits net amount into merchant's bank account. Processor fee deducted. Merchant receives total minus all fees (MDR).",
    us: "Starbucks receives $5.65 of original $6.00",
    india: "Reliance Smart receives ₹488 of ₹500",
    time: "T+1 / T+2", money: true,
    isReturn: true,
  },
];

const STEPS_CNP = [
  {
    from: "cardholder", to: "merchant", direction: "right",
    phase: "auth", phaseLabel: "AUTHORIZATION",
    label: "Enter Card Details on Checkout",
    detail: "Cardholder enters PAN, expiry, CVV on merchant checkout page. Merchant must be PCI-DSS compliant. Best practice: use processor-hosted fields (iframes) so raw card data never touches merchant servers.",
    us: "Amazon checkout — card number entered",
    india: "Flipkart checkout — card details entered",
    time: "User action", money: false,
  },
  {
    from: "merchant", to: "processor", direction: "right",
    phase: "auth", phaseLabel: "AUTHORIZATION",
    label: "Tokenized Auth Request via API",
    detail: "Merchant sends tokenized card data to processor via HTTPS API. Raw PAN is never stored by merchant. Processor issues a token representing the card for future use.",
    us: "Amazon → Stripe API (card tokenized)",
    india: "Flipkart → Razorpay API (token)",
    time: "~50ms", money: false,
  },
  {
    from: "processor", to: "fraud", direction: "right",
    phase: "auth", phaseLabel: "AUTHORIZATION",
    label: "Fraud & Risk Scoring",
    detail: "THIS STEP DOESN'T EXIST IN CARD PRESENT. CNP fraud is much higher because card not physically present. Processor runs ML risk models: device fingerprint, IP geo, velocity checks, behavioral biometrics, order amount vs history.",
    us: "Stripe Radar scores transaction 0-100",
    india: "Razorpay fraud engine + BIN checks",
    time: "~100ms", money: false,
    cnpOnly: true,
  },
  {
    from: "fraud", to: "processor", direction: "left",
    phase: "auth", phaseLabel: "AUTHORIZATION",
    label: "Risk Score: LOW — Proceed",
    detail: "If risk score is low, transaction proceeds. If HIGH, may trigger 3DS challenge or decline. Processor decides whether to apply 3DS based on risk score, merchant config, and issuer requirements.",
    us: "Stripe Radar: low risk → proceed",
    india: "RBI mandates 3DS for all card transactions above ₹5000",
    time: "~150ms", money: false,
    cnpOnly: true,
    isReturn: true,
  },
  {
    from: "processor", to: "fraud", direction: "right",
    phase: "threeDS", phaseLabel: "3DS AUTHENTICATION",
    label: "Initiate 3D Secure Challenge",
    detail: "3DS (3D Secure) is an additional authentication layer. Processor initiates 3DS flow with card network's Access Control Server (ACS). This is EMV 3DS 2.x in modern implementations.",
    us: "Visa Secure / Mastercard Identity Check",
    india: "RBI MANDATES 3DS for all online card txns (AFA)",
    time: "~200ms", money: false,
    cnpOnly: true,
  },
  {
    from: "fraud", to: "issuer", direction: "right",
    phase: "threeDS", phaseLabel: "3DS AUTHENTICATION",
    label: "ACS Challenges Cardholder",
    detail: "Issuer's Access Control Server sends OTP to cardholder's registered mobile number, or requests biometric authentication. Cardholder must prove identity.",
    us: "Chase sends OTP to phone OR Visa approves frictionlessly",
    india: "HDFC sends OTP — mandatory by RBI regulation",
    time: "User waits", money: false,
    cnpOnly: true,
  },
  {
    from: "issuer", to: "fraud", direction: "left",
    phase: "threeDS", phaseLabel: "3DS AUTHENTICATION",
    label: "3DS Auth: PASSED ✓",
    detail: "Cardholder enters OTP correctly. Issuer responds with authentication value (CAVV). Liability now shifts to issuer — key commercial implication. If fraud occurs post-3DS, merchant is NOT liable.",
    us: "Chase confirms identity — liability shifts",
    india: "HDFC OTP verified — RBI compliance met",
    time: "~30 seconds total", money: false,
    cnpOnly: true,
    isReturn: true,
  },
  {
    from: "processor", to: "network", direction: "right",
    phase: "auth", phaseLabel: "AUTHORIZATION",
    label: "Auth Request with CAVV to Network",
    detail: "Processor sends authorization request to network including CAVV (Cardholder Authentication Verification Value) from 3DS. Network uses this to route and validate.",
    us: "Stripe → Visa with CAVV attached",
    india: "Razorpay → Visa/Mastercard with auth value",
    time: "~300ms", money: false,
  },
  {
    from: "network", to: "issuer", direction: "right",
    phase: "auth", phaseLabel: "AUTHORIZATION",
    label: "Auth Request to Issuer",
    detail: "Network delivers to issuer. Issuer validates CAVV matches what they issued in 3DS. Runs final fraud checks. Checks available balance/credit.",
    us: "BofA validates CAVV + credit limit check",
    india: "HDFC validates OTP token + balance",
    time: "~450ms", money: false,
  },
  {
    from: "issuer", to: "network", direction: "left",
    phase: "auth", phaseLabel: "AUTHORIZATION",
    label: "Auth Response: APPROVED ✓",
    detail: "Issuer approves and reserves funds. Auth code generated. Funds held. No money moved yet.",
    us: "BofA approves, holds $150.00",
    india: "HDFC approves, holds ₹3,500",
    time: "~600ms", money: false,
    isReturn: true,
  },
  {
    from: "network", to: "processor", direction: "left",
    phase: "auth", phaseLabel: "AUTHORIZATION",
    label: "Approval to Processor",
    detail: "Network routes approval back. Processor receives authorization code.",
    us: "Visa → Stripe: Approved",
    india: "Visa → Razorpay: Approved",
    time: "~700ms", money: false,
    isReturn: true,
  },
  {
    from: "processor", to: "merchant", direction: "left",
    phase: "auth", phaseLabel: "AUTHORIZATION",
    label: "Payment Success Response",
    detail: "Processor returns success to merchant. Merchant shows order confirmation. IMPORTANT: in many e-commerce flows, capture happens separately — merchant may authorize now and capture when item ships.",
    us: "Stripe → Amazon: payment_intent succeeded",
    india: "Razorpay → Flipkart: payment captured",
    time: "~800ms", money: false,
    isReturn: true,
  },
  {
    from: "merchant", to: "cardholder", direction: "left",
    phase: "auth", phaseLabel: "AUTHORIZATION",
    label: "Order Confirmed ✓",
    detail: "Cardholder sees order confirmation. Total elapsed: 1-3 seconds (longer if 3DS OTP step involved).",
    us: "Amazon: Your order has been placed!",
    india: "Flipkart: Order confirmed!",
    time: "~1-3s total", money: false,
    isReturn: true,
  },
  {
    from: "merchant", to: "processor", direction: "right",
    phase: "capture", phaseLabel: "CAPTURE",
    label: "Capture Request (may be delayed)",
    detail: "KEY CNP DIFFERENCE: In e-commerce, authorization and capture are often SEPARATE. Amazon may authorize when you order but only CAPTURE when item ships. Hotels authorize at check-in, capture at check-out.",
    us: "Amazon captures when item ships (T+3 days)",
    india: "Myntra captures at dispatch",
    time: "Immediate or days later", money: false,
  },
  {
    from: "processor", to: "network", direction: "right",
    phase: "settlement", phaseLabel: "SETTLEMENT",
    label: "💰 Clearing & Settlement",
    detail: "Same as card present — clearing file submitted, network calculates positions, funds move between banks. CNP transactions typically settle T+1 or T+2.",
    us: "Stripe → Visa → BofA → Amazon bank account",
    india: "Razorpay → Visa → HDFC → Flipkart account",
    time: "T+1 / T+2", money: true,
  },
  {
    from: "processor", to: "merchant", direction: "left",
    phase: "settlement", phaseLabel: "SETTLEMENT",
    label: "💰 Merchant Payout",
    detail: "Net funds deposited to merchant. Higher fees than card-present because of higher fraud risk. Stripe charges 2.9% + $0.30 per transaction in US (vs lower rates for CP).",
    us: "Amazon receives net after Stripe fee: 2.9% + $0.30",
    india: "Flipkart receives net after ~1.5-2% MDR",
    time: "T+1 / T+2", money: true,
    isReturn: true,
  },
];

const PHASE_COLORS = {
  auth: "#00d4ff",
  threeDS: "#f59e0b",
  clearing: "#7c3aed",
  capture: "#10b981",
  settlement: "#ef4444",
};

const PHASE_LABELS = {
  auth: "Authorization",
  threeDS: "3DS Auth",
  clearing: "Clearing",
  capture: "Capture",
  settlement: "Settlement",
};

export default function PaymentSequenceDiagrams() {
  const [activeTab, setActiveTab] = useState("cp");
  const [activeStep, setActiveStep] = useState(null);
  const [animStep, setAnimStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [market, setMarket] = useState("us");

  const parties = activeTab === "cp" ? PARTIES_CP : PARTIES_CNP;
  const steps = activeTab === "cp" ? STEPS_CP : STEPS_CNP;

  useEffect(() => {
    let interval;
    if (playing) {
      interval = setInterval(() => {
        setAnimStep((prev) => {
          if (prev >= steps.length - 1) {
            setPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 900);
    }
    return () => clearInterval(interval);
  }, [playing, steps.length]);

  const handlePlay = () => {
    if (animStep >= steps.length - 1) setAnimStep(-1);
    setPlaying(true);
  };

  const handleReset = () => {
    setPlaying(false);
    setAnimStep(-1);
    setActiveStep(null);
  };

  const getPartyIndex = (id) => parties.findIndex((p) => p.id === id);
  const colWidth = 100 / parties.length;

  const visibleSteps = animStep >= 0 ? steps.slice(0, animStep + 1) : [];
  const displaySteps = playing || animStep >= 0 ? visibleSteps : steps;

  const phases = [...new Set(steps.map((s) => s.phase))];

  return (
    <div style={{
      background: COLORS.bg,
      minHeight: "100vh",
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
      color: COLORS.text,
      padding: "0",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
        borderBottom: `1px solid ${COLORS.border}`,
        padding: "24px 32px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 24 }}>💳</span>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: COLORS.accent, margin: 0, letterSpacing: "0.05em" }}>
              PAYMENT FLOW SEQUENCE DIAGRAMS
            </h1>
          </div>
          <p style={{ color: COLORS.textDim, fontSize: 12, margin: 0 }}>
            Lesson 1 Visual Reference — Authorization · Clearing · Settlement
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 32px" }}>
        {/* Controls Row */}
        <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
          {/* Tab selector */}
          <div style={{ display: "flex", background: COLORS.surface, borderRadius: 8, border: `1px solid ${COLORS.border}`, overflow: "hidden" }}>
            {[
              { id: "cp", label: "CARD PRESENT", icon: "🏪" },
              { id: "cnp", label: "CARD NOT PRESENT", icon: "🛒" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); handleReset(); }}
                style={{
                  padding: "10px 20px",
                  background: activeTab === tab.id ? COLORS.accent2 : "transparent",
                  color: activeTab === tab.id ? "#fff" : COLORS.textDim,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  fontFamily: "inherit",
                  transition: "all 0.2s",
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Market selector */}
          <div style={{ display: "flex", background: COLORS.surface, borderRadius: 8, border: `1px solid ${COLORS.border}`, overflow: "hidden" }}>
            {[{ id: "us", label: "🇺🇸 US" }, { id: "india", label: "🇮🇳 India" }].map((m) => (
              <button
                key={m.id}
                onClick={() => setMarket(m.id)}
                style={{
                  padding: "10px 16px",
                  background: market === m.id ? COLORS.highlight : "transparent",
                  color: market === m.id ? COLORS.accent : COLORS.textDim,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily: "inherit",
                }}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Animation controls */}
          <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
            <button
              onClick={handlePlay}
              disabled={playing}
              style={{
                padding: "10px 16px",
                background: playing ? COLORS.border : COLORS.accent3,
                color: playing ? COLORS.textMuted : "#000",
                border: "none",
                borderRadius: 6,
                cursor: playing ? "default" : "pointer",
                fontSize: 11,
                fontWeight: 700,
                fontFamily: "inherit",
              }}
            >
              ▶ ANIMATE
            </button>
            <button
              onClick={handleReset}
              style={{
                padding: "10px 16px",
                background: COLORS.surface,
                color: COLORS.textDim,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 700,
                fontFamily: "inherit",
              }}
            >
              ↺ RESET
            </button>
          </div>
        </div>

        {/* Phase Legend */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          {phases.map((phase) => (
            <div key={phase} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: PHASE_COLORS[phase] }} />
              <span style={{ fontSize: 10, color: COLORS.textDim, letterSpacing: "0.06em" }}>
                {PHASE_LABELS[phase].toUpperCase()}
              </span>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444", border: "2px solid #ffd700" }} />
            <span style={{ fontSize: 10, color: COLORS.textDim, letterSpacing: "0.06em" }}>MONEY MOVES</span>
          </div>
          {activeTab === "cnp" && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b", border: "2px dashed #fff" }} />
              <span style={{ fontSize: 10, color: "#f59e0b", letterSpacing: "0.06em" }}>CNP ONLY STEP</span>
            </div>
          )}
        </div>

        {/* Main Diagram */}
        <div style={{
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 12,
          overflow: "hidden",
        }}>
          {/* Party Headers */}
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${parties.length}, 1fr)`,
            background: COLORS.cardBg,
            borderBottom: `1px solid ${COLORS.border}`,
          }}>
            {parties.map((party) => (
              <div key={party.id} style={{
                padding: "16px 8px",
                textAlign: "center",
                borderRight: `1px solid ${COLORS.border}`,
              }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{party.icon}</div>
                <div style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: party.color,
                  letterSpacing: "0.05em",
                  marginBottom: 2,
                }}>
                  {party.label}
                </div>
                <div style={{ fontSize: 9, color: COLORS.textMuted }}>{party.sub}</div>
              </div>
            ))}
          </div>

          {/* Sequence Steps */}
          <div style={{ padding: "8px 0" }}>
            {displaySteps.map((step, idx) => {
              const fromIdx = getPartyIndex(step.from);
              const toIdx = getPartyIndex(step.to);
              const isActive = activeStep === idx;
              const isLatestAnim = animStep === idx;

              const leftPct = Math.min(fromIdx, toIdx) * colWidth + colWidth / 2;
              const rightPct = Math.max(fromIdx, toIdx) * colWidth + colWidth / 2;
              const widthPct = rightPct - leftPct;

              return (
                <div
                  key={idx}
                  onClick={() => setActiveStep(isActive ? null : idx)}
                  style={{
                    position: "relative",
                    padding: "6px 16px",
                    cursor: "pointer",
                    background: isActive ? COLORS.highlight : isLatestAnim ? "rgba(0,212,255,0.05)" : "transparent",
                    borderLeft: isActive ? `3px solid ${PHASE_COLORS[step.phase]}` : "3px solid transparent",
                    transition: "all 0.2s",
                    borderBottom: `1px solid rgba(30,45,69,0.5)`,
                  }}
                >
                  {/* Phase marker */}
                  {(idx === 0 || steps[idx - 1]?.phase !== step.phase) && (
                    <div style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      background: PHASE_COLORS[step.phase],
                      color: "#000",
                      fontSize: 8,
                      fontWeight: 800,
                      padding: "2px 8px",
                      letterSpacing: "0.1em",
                      borderRadius: "0 0 4px 0",
                    }}>
                      {step.phaseLabel}
                    </div>
                  )}

                  {/* Arrow Row */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${parties.length}, 1fr)`,
                    alignItems: "center",
                    minHeight: 36,
                    marginTop: (idx === 0 || steps[idx - 1]?.phase !== step.phase) ? 12 : 0,
                  }}>
                    {/* Arrow visualization */}
                    {parties.map((_, pIdx) => {
                      const isFrom = pIdx === fromIdx;
                      const isTo = pIdx === toIdx;
                      const isBetween = pIdx > Math.min(fromIdx, toIdx) && pIdx < Math.max(fromIdx, toIdx);
                      const isStart = pIdx === Math.min(fromIdx, toIdx);
                      const isEnd = pIdx === Math.max(fromIdx, toIdx);

                      return (
                        <div key={pIdx} style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                          height: 36,
                        }}>
                          {/* Vertical lifeline */}
                          <div style={{
                            position: "absolute",
                            width: 1,
                            height: "100%",
                            background: `${COLORS.border}`,
                            left: "50%",
                          }} />

                          {/* Node dot at from/to */}
                          {(isFrom || isTo) && (
                            <div style={{
                              position: "absolute",
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background: isFrom ? PHASE_COLORS[step.phase] : parties[pIdx].color,
                              left: "calc(50% - 4px)",
                              zIndex: 2,
                              boxShadow: `0 0 6px ${isFrom ? PHASE_COLORS[step.phase] : parties[pIdx].color}`,
                            }} />
                          )}

                          {/* Horizontal arrow line */}
                          {(isStart || isBetween) && (
                            <div style={{
                              position: "absolute",
                              height: 2,
                              right: 0,
                              left: isStart ? "50%" : 0,
                              background: step.money
                                ? "linear-gradient(90deg, #ffd700, #ef4444)"
                                : step.cnpOnly
                                  ? `repeating-linear-gradient(90deg, ${PHASE_COLORS[step.phase]} 0, ${PHASE_COLORS[step.phase]} 6px, transparent 6px, transparent 10px)`
                                  : PHASE_COLORS[step.phase],
                              zIndex: 1,
                            }} />
                          )}

                          {isEnd && (
                            <div style={{
                              position: "absolute",
                              height: 2,
                              right: "50%",
                              left: 0,
                              background: step.money
                                ? "linear-gradient(90deg, #ef4444, #ffd700)"
                                : PHASE_COLORS[step.phase],
                              zIndex: 1,
                            }} />
                          )}

                          {/* Arrowhead */}
                          {isTo && (
                            <div style={{
                              position: "absolute",
                              left: step.direction === "right" ? "calc(50% - 6px)" : "calc(50% - 2px)",
                              width: 0,
                              height: 0,
                              borderTop: "5px solid transparent",
                              borderBottom: "5px solid transparent",
                              [step.direction === "right" ? "borderLeft" : "borderRight"]: `8px solid ${PHASE_COLORS[step.phase]}`,
                              zIndex: 3,
                            }} />
                          )}

                          {/* Step label in middle */}
                          {pIdx === Math.floor((fromIdx + toIdx) / 2) && (
                            <div style={{
                              position: "absolute",
                              top: -2,
                              left: "50%",
                              transform: "translateX(-50%)",
                              background: COLORS.bg,
                              padding: "1px 6px",
                              fontSize: 9,
                              color: step.money ? "#ffd700" : PHASE_COLORS[step.phase],
                              fontWeight: 700,
                              whiteSpace: "nowrap",
                              zIndex: 4,
                              letterSpacing: "0.03em",
                              maxWidth: 200,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}>
                              {step.label}
                            </div>
                          )}

                          {/* Time badge */}
                          {isFrom && (
                            <div style={{
                              position: "absolute",
                              bottom: 0,
                              left: "50%",
                              transform: "translateX(-50%)",
                              fontSize: 8,
                              color: COLORS.textMuted,
                              whiteSpace: "nowrap",
                              zIndex: 4,
                            }}>
                              {step.time}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Detail Panel */}
                  {isActive && (
                    <div style={{
                      marginTop: 8,
                      padding: "12px 16px",
                      background: COLORS.cardBg,
                      borderRadius: 8,
                      border: `1px solid ${PHASE_COLORS[step.phase]}40`,
                    }}>
                      <p style={{ fontSize: 11, color: COLORS.textDim, lineHeight: 1.7, margin: "0 0 10px 0" }}>
                        {step.detail}
                      </p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <div style={{
                          padding: "8px 12px",
                          background: market === "us" ? "rgba(0,212,255,0.1)" : "transparent",
                          border: `1px solid ${market === "us" ? COLORS.accent : COLORS.border}`,
                          borderRadius: 6,
                        }}>
                          <div style={{ fontSize: 9, color: COLORS.accent, fontWeight: 700, marginBottom: 4 }}>🇺🇸 US EXAMPLE</div>
                          <div style={{ fontSize: 10, color: COLORS.textDim }}>{step.us}</div>
                        </div>
                        <div style={{
                          padding: "8px 12px",
                          background: market === "india" ? "rgba(124,58,237,0.1)" : "transparent",
                          border: `1px solid ${market === "india" ? COLORS.accent2 : COLORS.border}`,
                          borderRadius: 6,
                        }}>
                          <div style={{ fontSize: 9, color: COLORS.accent2, fontWeight: 700, marginBottom: 4 }}>🇮🇳 INDIA EXAMPLE</div>
                          <div style={{ fontSize: 10, color: COLORS.textDim }}>{step.india}</div>
                        </div>
                      </div>
                      {step.cnpOnly && (
                        <div style={{
                          marginTop: 8,
                          padding: "6px 10px",
                          background: "rgba(245,158,11,0.1)",
                          border: "1px dashed #f59e0b",
                          borderRadius: 6,
                          fontSize: 10,
                          color: "#f59e0b",
                        }}>
                          ⚠️ This step exists ONLY in Card Not Present transactions. Card Present skips this entirely.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Key Differences Panel */}
        <div style={{
          marginTop: 24,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
        }}>
          <div style={{
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 12,
            padding: 20,
          }}>
            <h3 style={{ color: COLORS.accent, fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 16, marginTop: 0 }}>
              🏪 CARD PRESENT — KEY FACTS
            </h3>
            {[
              ["Authentication", "Physical card + chip/PIN. Card IS the proof."],
              ["Fraud Risk", "LOW — card must be physically stolen"],
              ["3DS", "NOT required — chip auth is sufficient"],
              ["Auth→Capture", "Usually automatic at batch close"],
              ["Fees (US)", "Lower MDR ~1.5-2.0% (Durbin helps debit)"],
              ["Fees (India)", "~0.5-1.0% MDR. RuPay even lower."],
              ["Settlement", "T+1 / T+2 via card network settlement"],
              ["Dispute risk", "Lower — cardholder present, PIN verified"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 10, color: COLORS.accent, fontWeight: 700, minWidth: 100 }}>{k}</span>
                <span style={{ fontSize: 10, color: COLORS.textDim }}>{v}</span>
              </div>
            ))}
          </div>

          <div style={{
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 12,
            padding: 20,
          }}>
            <h3 style={{ color: COLORS.accent2, fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 16, marginTop: 0 }}>
              🛒 CARD NOT PRESENT — KEY FACTS
            </h3>
            {[
              ["Authentication", "Card details typed. No physical proof."],
              ["Fraud Risk", "HIGH — stolen card data can be typed anywhere"],
              ["3DS", "Required (RBI mandates for India). Optional in US."],
              ["Auth→Capture", "Often SEPARATE — auth now, capture on ship"],
              ["Fees (US)", "Higher MDR ~2.9% + $0.30 (Stripe standard)"],
              ["Fees (India)", "~1.5-2.5% MDR. Higher than card present."],
              ["Settlement", "T+1 / T+2. Same rails, higher chargeback risk."],
              ["Dispute risk", "HIGHER — chargebacks more common in CNP"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 10, color: COLORS.accent2, fontWeight: 700, minWidth: 100 }}>{k}</span>
                <span style={{ fontSize: 10, color: COLORS.textDim }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div style={{
          marginTop: 16,
          padding: "12px 16px",
          background: "rgba(0,212,255,0.05)",
          border: `1px solid ${COLORS.border}`,
          borderRadius: 8,
          fontSize: 10,
          color: COLORS.textMuted,
          textAlign: "center",
        }}>
          💡 Click any step in the diagram to expand details + US/India examples · Press ANIMATE to walk through the flow step by step
        </div>
      </div>
    </div>
  );
}