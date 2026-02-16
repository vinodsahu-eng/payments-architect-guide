import { useState } from "react";

const COLORS = {
  bg: "#0a0e1a",
  surface: "#111827",
  border: "#1e2d45",
  accent: "#00d4ff",
  text: "#e2e8f0",
  textMuted: "#64748b",
  textDim: "#94a3b8",
  cardBg: "#0f172a",
};

const OPERATIONS = {
  auth: { label: "Authorization", color: "#00d4ff", icon: "🔒" },
  capture: { label: "Capture", color: "#7c3aed", icon: "📋" },
  void: { label: "Void", color: "#10b981", icon: "✕" },
  settlement: { label: "Settlement", color: "#10b981", icon: "💰" },
  refund: { label: "Refund", color: "#f59e0b", icon: "↩" },
  chargeback: { label: "Chargeback", color: "#ef4444", icon: "⚠" },
};

const PATHS = [
  {
    id: "happy",
    label: "Happy Path",
    sublabel: "Normal purchase flow",
    color: "#10b981",
    icon: "✓",
    steps: [
      {
        op: "auth",
        title: "Authorization",
        timing: "~2 seconds",
        moneyMoves: false,
        description: "Issuer approves and reserves funds. Authorization code generated. Hold placed on cardholder account.",
        us: "Chase Sapphire tapped at Starbucks — $6.00 hold placed. Auth code: 483920",
        india: "HDFC Visa at Reliance Smart — ₹500 hold placed. Valid 30 days.",
        apiStripe: "status: requires_capture OR requires_confirmation",
        apiRazorpay: "status: authorized",
        architectNote: "Store the auth code and authorization ID. You will need both for capture and for dispute evidence.",
      },
      {
        op: "capture",
        title: "Capture",
        timing: "Immediate or days later",
        moneyMoves: false,
        description: "Merchant confirms final amount. Transaction enters settlement batch. No money has moved yet — but it's now committed.",
        us: "Single message: Starbucks POS auto-captures at transaction. Dual message: Amazon captures when item ships.",
        india: "Flipkart captures at dispatch. Swiggy captures when delivery is confirmed.",
        apiStripe: "status: succeeded (after capture call)",
        apiRazorpay: "status: captured",
        architectNote: "Dual message flows require you to track which authorizations still need capture. Build a job that checks for uncaptured auths approaching expiry.",
      },
      {
        op: "settlement",
        title: "Settlement",
        timing: "T+1 / T+2",
        moneyMoves: true,
        description: "Actual money moves. Issuer transfers to acquirer via network. Acquirer pays merchant minus all fees. MDR deducted.",
        us: "Starbucks receives $5.65 of original $6.00. Stripe deposits T+2.",
        india: "Reliance Smart receives ₹488 of ₹500. Razorpay deposits T+1.",
        apiStripe: "charge.status: succeeded, balance_transaction shows net amount",
        apiRazorpay: "settlement report shows net payout",
        architectNote: "Settlement amounts differ from captured amounts due to fees. Your reconciliation logic must account for MDR deductions.",
      },
    ],
  },
  {
    id: "void",
    label: "Void Path",
    sublabel: "Cancellation before settlement",
    color: "#00d4ff",
    icon: "✕",
    steps: [
      {
        op: "auth",
        title: "Authorization",
        timing: "~2 seconds",
        moneyMoves: false,
        description: "Same as happy path. Issuer approves and reserves funds.",
        us: "Customer places order on Amazon. Chase authorizes $150.",
        india: "Customer orders on Flipkart. HDFC authorizes ₹3,500.",
        apiStripe: "status: requires_capture",
        apiRazorpay: "status: authorized",
        architectNote: "At this point the path is identical to the happy path. The void decision comes later.",
      },
      {
        op: "void",
        title: "Void",
        timing: "Before settlement batch",
        moneyMoves: false,
        description: "Authorization cancelled. Hold released immediately. No money moved. No fees charged. Transaction is as if it never happened financially.",
        us: "Amazon: item out of stock. Void sent before EOD batch. Chase releases $150 hold immediately.",
        india: "Flipkart: seller cancels order. Razorpay void call. HDFC releases ₹3,500 hold.",
        apiStripe: "cancel PaymentIntent → status: canceled",
        apiRazorpay: "POST /payments/{id}/cancel",
        architectNote: "CRITICAL: Check settlement status before deciding void vs refund. If already settled, void will fail — you must refund instead. Build this check into your cancellation flow.",
      },
    ],
  },
  {
    id: "refund",
    label: "Refund Path",
    sublabel: "Return after settlement",
    color: "#f59e0b",
    icon: "↩",
    steps: [
      {
        op: "auth",
        title: "Authorization",
        timing: "~2 seconds",
        moneyMoves: false,
        description: "Normal authorization flow completed.",
        us: "Customer buys $100 jacket on Amazon.",
        india: "Customer buys ₹2,000 kurta on Myntra.",
        apiStripe: "status: requires_capture",
        apiRazorpay: "status: authorized",
        architectNote: "Nothing special here — this becomes a refund path only after settlement.",
      },
      {
        op: "capture",
        title: "Capture",
        timing: "At order/shipment",
        moneyMoves: false,
        description: "Normal capture flow completed.",
        us: "Amazon captures $100 when jacket ships.",
        india: "Myntra captures ₹2,000 when kurta dispatches.",
        apiStripe: "status: succeeded",
        apiRazorpay: "status: captured",
        architectNote: "At capture, the transaction is committed to settlement. Void is no longer possible after this point.",
      },
      {
        op: "settlement",
        title: "Settlement",
        timing: "T+1 / T+2",
        moneyMoves: true,
        description: "Funds settled to merchant. Amazon receives ~$97 after fees.",
        us: "Amazon receives ~$97 after Stripe fee (2.9% + $0.30).",
        india: "Myntra receives ~₹1,960 after MDR.",
        apiStripe: "charge.status: succeeded",
        apiRazorpay: "settlement completed",
        architectNote: "Interchange already paid to issuer. This cannot be recovered even if a refund follows.",
      },
      {
        op: "refund",
        title: "Refund",
        timing: "T+5 to T+10",
        moneyMoves: true,
        description: "NEW credit transaction created flowing back through same rails. Merchant loses interchange paid on original. Money returns to cardholder in 5-10 business days.",
        us: "Customer returns jacket. Amazon initiates $100 refund. Chase credits cardholder in 5-7 days. Amazon loses ~$3 interchange permanently.",
        india: "Customer returns kurta. Myntra refunds ₹2,000. HDFC credits in 5-7 days for cards, 24-48hrs for UPI.",
        apiStripe: "POST /v1/refunds with charge ID",
        apiRazorpay: "POST /payments/{id}/refund",
        architectNote: "Map every refund to its original payment in your database. Track whether interchange was recovered (it wasn't). Your P&L must account for this cost.",
      },
    ],
  },
  {
    id: "chargeback",
    label: "Chargeback Path",
    sublabel: "Issuer-forced reversal",
    color: "#ef4444",
    icon: "⚠",
    steps: [
      {
        op: "auth",
        title: "Authorization",
        timing: "~2 seconds",
        moneyMoves: false,
        description: "Normal authorization — merchant has no indication this will become a chargeback.",
        us: "Fraudster uses stolen Chase card to buy $500 electronics online.",
        india: "Fraudster uses stolen HDFC card for ₹10,000 purchase on e-commerce site.",
        apiStripe: "status: succeeded (no warning yet)",
        apiRazorpay: "status: captured",
        architectNote: "At this point everything looks normal. The chargeback may come 30-120 days later.",
      },
      {
        op: "capture",
        title: "Capture + Settlement",
        timing: "T+1 / T+2",
        moneyMoves: true,
        description: "Transaction settles normally. Merchant receives funds. Real cardholder notices fraudulent charge on statement — days or weeks later.",
        us: "Merchant receives $485 after fees. Real Chase cardholder sees $500 charge they didn't make.",
        india: "Merchant receives ₹9,750. Real HDFC cardholder notices ₹10,000 unauthorized charge.",
        apiStripe: "charge.status: succeeded",
        apiRazorpay: "payment settled",
        architectNote: "This is why storing evidence at transaction time matters. You need IP, device, 3DS result, and delivery proof from the original transaction — not when the dispute arrives.",
      },
      {
        op: "chargeback",
        title: "Chargeback Filed",
        timing: "Up to 120 days later",
        moneyMoves: true,
        description: "Cardholder disputes with issuer. Issuer reverses funds from acquirer. Acquirer reverses from processor. Processor reverses from merchant. Merchant also pays chargeback fee $15-$25.",
        us: "Chase reverses $500 from merchant. Merchant loses $500 + $20 chargeback fee + original interchange. Total loss: ~$523.",
        india: "HDFC reverses ₹10,000. Merchant loses full amount + chargeback fee. If 3DS was used and passed, HDFC absorbs the loss instead.",
        apiStripe: "dispute object created, charge.disputed: true",
        apiRazorpay: "dispute webhook fired",
        architectNote: "You have 30 days to respond with evidence. Without 3DS authentication record, delivery proof, and customer communication, you lose automatically. This is why evidence retention is non-negotiable.",
      },
    ],
  },
];

export default function Lesson2_Diagram() {
  const [activePath, setActivePath] = useState("happy");
  const [activeStep, setActiveStep] = useState(null);
  const [market, setMarket] = useState("us");

  const currentPath = PATHS.find((p) => p.id === activePath);

  return (
    <div style={{
      background: COLORS.bg,
      minHeight: "100vh",
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      color: COLORS.text,
      padding: "0",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
        borderBottom: `1px solid ${COLORS.border}`,
        padding: "24px 32px",
      }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 24 }}>🔄</span>
            <h1 style={{
              fontSize: 20,
              fontWeight: 700,
              color: COLORS.accent,
              margin: 0,
              letterSpacing: "0.05em",
            }}>
              TRANSACTION LIFECYCLE — LESSON 02
            </h1>
          </div>
          <p style={{ color: COLORS.textDim, fontSize: 12, margin: 0 }}>
            Authorization · Capture · Void · Settlement · Refund · Chargeback
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 32px" }}>

        {/* Controls */}
        <div style={{
          display: "flex",
          gap: 12,
          marginBottom: 24,
          flexWrap: "wrap",
          alignItems: "center",
        }}>
          {/* Market toggle */}
          <div style={{
            display: "flex",
            background: COLORS.surface,
            borderRadius: 8,
            border: `1px solid ${COLORS.border}`,
            overflow: "hidden",
            marginLeft: "auto",
          }}>
            {[{ id: "us", label: "🇺🇸 US" }, { id: "india", label: "🇮🇳 India" }].map((m) => (
              <button
                key={m.id}
                onClick={() => setMarket(m.id)}
                style={{
                  padding: "8px 16px",
                  background: market === m.id ? "#1e3a5f" : "transparent",
                  color: market === m.id ? COLORS.accent : COLORS.textMuted,
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
        </div>

        {/* Path Selector */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 10,
          marginBottom: 24,
        }}>
          {PATHS.map((path) => (
            <button
              key={path.id}
              onClick={() => { setActivePath(path.id); setActiveStep(null); }}
              style={{
                padding: "14px 12px",
                background: activePath === path.id ? `${path.color}15` : COLORS.surface,
                border: `1px solid ${activePath === path.id ? path.color : COLORS.border}`,
                borderRadius: 8,
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "inherit",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{
                  fontSize: 14,
                  color: path.color,
                }}>
                  {path.icon}
                </span>
                <span style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: activePath === path.id ? path.color : COLORS.textDim,
                }}>
                  {path.label}
                </span>
              </div>
              <div style={{ fontSize: 10, color: COLORS.textMuted, paddingLeft: 22 }}>
                {path.sublabel}
              </div>
            </button>
          ))}
        </div>

        {/* Operations Legend */}
        <div style={{
          display: "flex",
          gap: 16,
          marginBottom: 20,
          flexWrap: "wrap",
          padding: "12px 16px",
          background: COLORS.surface,
          borderRadius: 8,
          border: `1px solid ${COLORS.border}`,
        }}>
          {Object.entries(OPERATIONS).map(([key, op]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: op.color,
              }} />
              <span style={{ fontSize: 10, color: COLORS.textDim }}>{op.label}</span>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
            <span style={{ fontSize: 10, color: COLORS.textMuted }}>Click any step to expand →</span>
          </div>
        </div>

        {/* Steps */}
        <div style={{
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 12,
          overflow: "hidden",
        }}>
          {/* Path header */}
          <div style={{
            padding: "16px 24px",
            background: `${currentPath.color}10`,
            borderBottom: `1px solid ${currentPath.color}30`,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}>
            <span style={{ fontSize: 20 }}>{currentPath.icon}</span>
            <div>
              <div style={{
                fontSize: 13,
                fontWeight: 700,
                color: currentPath.color,
              }}>
                {currentPath.label}
              </div>
              <div style={{ fontSize: 11, color: COLORS.textMuted }}>
                {currentPath.sublabel} · {currentPath.steps.length} steps
              </div>
            </div>
          </div>

          {/* Step list */}
          {currentPath.steps.map((step, idx) => {
            const op = OPERATIONS[step.op];
            const isActive = activeStep === idx;
            const isLast = idx === currentPath.steps.length - 1;

            return (
              <div key={idx}>
                <div
                  onClick={() => setActiveStep(isActive ? null : idx)}
                  style={{
                    padding: "20px 24px",
                    cursor: "pointer",
                    background: isActive ? "#1e3a5f" : "transparent",
                    borderLeft: isActive
                      ? `4px solid ${op.color}`
                      : "4px solid transparent",
                    transition: "all 0.2s",
                    borderBottom: isLast && !isActive ? "none" : `1px solid ${COLORS.border}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                    {/* Step number + connector */}
                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 0,
                      flexShrink: 0,
                    }}>
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: `${op.color}20`,
                        border: `2px solid ${op.color}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                        color: op.color,
                        fontWeight: 700,
                      }}>
                        {idx + 1}
                      </div>
                      {!isLast && (
                        <div style={{
                          width: 2,
                          height: 20,
                          background: COLORS.border,
                          marginTop: 4,
                        }} />
                      )}
                    </div>

                    {/* Step content */}
                    <div style={{ flex: 1, paddingTop: 4 }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 4,
                      }}>
                        <span style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: op.color,
                        }}>
                          {op.icon} {step.title}
                        </span>
                        <span style={{
                          fontSize: 9,
                          color: COLORS.textMuted,
                          padding: "2px 6px",
                          background: COLORS.cardBg,
                          borderRadius: 3,
                          border: `1px solid ${COLORS.border}`,
                        }}>
                          {step.timing}
                        </span>
                        {step.moneyMoves && (
                          <span style={{
                            fontSize: 9,
                            color: "#ffd700",
                            padding: "2px 6px",
                            background: "rgba(255,215,0,0.1)",
                            borderRadius: 3,
                            border: "1px solid rgba(255,215,0,0.3)",
                          }}>
                            💰 MONEY MOVES
                          </span>
                        )}
                      </div>
                      <p style={{
                        fontSize: 11,
                        color: COLORS.textMuted,
                        margin: 0,
                        lineHeight: 1.7,
                      }}>
                        {step.description}
                      </p>
                    </div>

                    {/* Expand indicator */}
                    <div style={{
                      fontSize: 10,
                      color: COLORS.textMuted,
                      paddingTop: 8,
                      flexShrink: 0,
                    }}>
                      {isActive ? "▲" : "▼"}
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isActive && (
                    <div style={{
                      marginTop: 16,
                      marginLeft: 52,
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}>
                      {/* Market examples */}
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 10,
                      }}>
                        <div style={{
                          padding: "10px 14px",
                          background: market === "us"
                            ? "rgba(0,212,255,0.08)"
                            : COLORS.cardBg,
                          border: `1px solid ${market === "us"
                            ? "rgba(0,212,255,0.3)"
                            : COLORS.border}`,
                          borderRadius: 6,
                        }}>
                          <div style={{
                            fontSize: 9,
                            fontWeight: 700,
                            color: "#00d4ff",
                            marginBottom: 6,
                            letterSpacing: "0.08em",
                          }}>
                            🇺🇸 US EXAMPLE
                          </div>
                          <div style={{
                            fontSize: 10,
                            color: COLORS.textDim,
                            lineHeight: 1.7,
                          }}>
                            {step.us}
                          </div>
                        </div>
                        <div style={{
                          padding: "10px 14px",
                          background: market === "india"
                            ? "rgba(124,58,237,0.08)"
                            : COLORS.cardBg,
                          border: `1px solid ${market === "india"
                            ? "rgba(124,58,237,0.3)"
                            : COLORS.border}`,
                          borderRadius: 6,
                        }}>
                          <div style={{
                            fontSize: 9,
                            fontWeight: 700,
                            color: "#7c3aed",
                            marginBottom: 6,
                            letterSpacing: "0.08em",
                          }}>
                            🇮🇳 INDIA EXAMPLE
                          </div>
                          <div style={{
                            fontSize: 10,
                            color: COLORS.textDim,
                            lineHeight: 1.7,
                          }}>
                            {step.india}
                          </div>
                        </div>
                      </div>

                      {/* API States */}
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 10,
                      }}>
                        <div style={{
                          padding: "10px 14px",
                          background: COLORS.cardBg,
                          border: `1px solid ${COLORS.border}`,
                          borderRadius: 6,
                        }}>
                          <div style={{
                            fontSize: 9,
                            fontWeight: 700,
                            color: COLORS.textMuted,
                            marginBottom: 6,
                            letterSpacing: "0.08em",
                          }}>
                            STRIPE API STATE
                          </div>
                          <code style={{
                            fontSize: 10,
                            color: "#00d4ff",
                          }}>
                            {step.apiStripe}
                          </code>
                        </div>
                        <div style={{
                          padding: "10px 14px",
                          background: COLORS.cardBg,
                          border: `1px solid ${COLORS.border}`,
                          borderRadius: 6,
                        }}>
                          <div style={{
                            fontSize: 9,
                            fontWeight: 700,
                            color: COLORS.textMuted,
                            marginBottom: 6,
                            letterSpacing: "0.08em",
                          }}>
                            RAZORPAY API STATE
                          </div>
                          <code style={{
                            fontSize: 10,
                            color: "#7c3aed",
                          }}>
                            {step.apiRazorpay}
                          </code>
                        </div>
                      </div>

                      {/* Architect note */}
                      <div style={{
                        padding: "10px 14px",
                        background: "rgba(245,158,11,0.05)",
                        border: "1px dashed rgba(245,158,11,0.3)",
                        borderRadius: 6,
                      }}>
                        <div style={{
                          fontSize: 9,
                          fontWeight: 700,
                          color: "#f59e0b",
                          marginBottom: 6,
                          letterSpacing: "0.08em",
                        }}>
                          🏗 ARCHITECT NOTE
                        </div>
                        <div style={{
                          fontSize: 10,
                          color: COLORS.textDim,
                          lineHeight: 1.7,
                        }}>
                          {step.architectNote}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick comparison table */}
        <div style={{
          marginTop: 24,
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 12,
          overflow: "hidden",
        }}>
          <div style={{
            padding: "14px 20px",
            background: COLORS.cardBg,
            borderBottom: `1px solid ${COLORS.border}`,
            fontSize: 11,
            fontWeight: 700,
            color: COLORS.textDim,
            letterSpacing: "0.08em",
          }}>
            OPERATION COMPARISON
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 10,
            }}>
              <thead>
                <tr style={{ background: COLORS.cardBg }}>
                  {["Operation", "Who Initiates", "Money Moves", "Reversible", "Fee", "Window"].map((h) => (
                    <th key={h} style={{
                      padding: "10px 16px",
                      textAlign: "left",
                      color: COLORS.textMuted,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      borderBottom: `1px solid ${COLORS.border}`,
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    op: "Authorization",
                    color: "#00d4ff",
                    who: "Processor → Issuer",
                    money: false,
                    reversible: "Yes (void)",
                    fee: "None",
                    window: "Up to 30 days",
                  },
                  {
                    op: "Capture",
                    color: "#7c3aed",
                    who: "Merchant",
                    money: false,
                    reversible: "No",
                    fee: "None",
                    window: "Before auth expiry",
                  },
                  {
                    op: "Void",
                    color: "#10b981",
                    who: "Merchant",
                    money: false,
                    reversible: "N/A",
                    fee: "Free",
                    window: "Before settlement",
                  },
                  {
                    op: "Settlement",
                    color: "#10b981",
                    who: "Automatic",
                    money: true,
                    reversible: "No",
                    fee: "MDR deducted",
                    window: "T+1 / T+2",
                  },
                  {
                    op: "Refund",
                    color: "#f59e0b",
                    who: "Merchant",
                    money: true,
                    reversible: "No",
                    fee: "Interchange lost",
                    window: "After settlement",
                  },
                  {
                    op: "Chargeback",
                    color: "#ef4444",
                    who: "Issuing Bank",
                    money: true,
                    reversible: "Can dispute",
                    fee: "$15-$25 + loss",
                    window: "Up to 120 days",
                  },
                ].map((row) => (
                  <tr key={row.op} style={{
                    borderBottom: `1px solid ${COLORS.border}`,
                  }}>
                    <td style={{
                      padding: "10px 16px",
                      color: row.color,
                      fontWeight: 700,
                    }}>
                      {row.op}
                    </td>
                    <td style={{ padding: "10px 16px", color: COLORS.textDim }}>
                      {row.who}
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      <span style={{
                        color: row.money ? "#ffd700" : COLORS.textMuted,
                        fontWeight: row.money ? 700 : 400,
                      }}>
                        {row.money ? "💰 Yes" : "No"}
                      </span>
                    </td>
                    <td style={{ padding: "10px 16px", color: COLORS.textDim }}>
                      {row.reversible}
                    </td>
                    <td style={{
                      padding: "10px 16px",
                      color: row.fee.includes("lost") || row.fee.includes("$15")
                        ? "#ef4444"
                        : row.fee === "Free"
                          ? "#10b981"
                          : COLORS.textDim,
                    }}>
                      {row.fee}
                    </td>
                    <td style={{ padding: "10px 16px", color: COLORS.textDim }}>
                      {row.window}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
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
          💡 Select a path above to explore each flow · Click any step to expand API states, market examples, and architect notes
        </div>
      </div>
    </div>
  );
}