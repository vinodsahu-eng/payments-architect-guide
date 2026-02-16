import { useState } from "react";

const US_RAILS = [
  {
    id: "card_credit",
    name: "Credit Card",
    network: "Visa / Mastercard / Amex",
    icon: "💳",
    color: "#00d4ff",
    speed: "Instant auth · T+2 settle",
    speedScore: 85,
    cost: "1.5–3% MDR",
    costScore: 20,
    finality: "Reversible",
    finalityScore: 20,
    reach: "Universal",
    reachScore: 100,
    bestFor: ["Consumer e-commerce", "Retail POS", "International payments"],
    notFor: ["High-value B2B", "Recurring payroll"],
    architectNote: "Default choice for consumer-facing payments. Optimize with network tokens and smart retry to improve authorization rates.",
    us: "Amazon checkout · Starbucks tap",
    india: "Flipkart card payment · Reliance Smart terminal",
  },
  {
    id: "card_debit",
    name: "Debit Card (Durbin)",
    network: "Visa / Mastercard",
    icon: "💳",
    color: "#7c3aed",
    speed: "Instant auth · T+2 settle",
    speedScore: 85,
    cost: "~$0.21 + 0.05% (large banks)",
    costScore: 75,
    finality: "Reversible",
    finalityScore: 20,
    reach: "Very High",
    reachScore: 90,
    bestFor: ["Lower-cost consumer payments", "Debit-preferred markets"],
    notFor: ["Chargeback protection needed", "Credit-using consumers"],
    architectNote: "Durbin Amendment caps debit interchange for large issuers. Route debit BINs separately to optimize cost. Significantly cheaper than credit for high-volume merchants.",
    us: "Grocery store checkout · Gas station pump",
    india: "N/A — debit interchange not Durbin-regulated in India",
  },
  {
    id: "ach",
    name: "ACH",
    network: "FedACH · EPN",
    icon: "🏦",
    color: "#10b981",
    speed: "T+1 standard · Same-day available",
    speedScore: 45,
    cost: "$0.20–$1.50 flat",
    costScore: 95,
    finality: "Reversible (60 days)",
    finalityScore: 15,
    reach: "High (US bank accounts)",
    reachScore: 85,
    bestFor: ["Payroll", "B2B invoices", "Subscriptions", "Large payments"],
    notFor: ["Retail POS", "International", "When speed is critical"],
    architectNote: "ACH reversibility is its biggest risk. Design hold periods before releasing goods. A returned ACH after shipping is a real loss. Same-day ACH available for a fee.",
    us: "Netflix billing · Employer payroll · Rent collection",
    india: "NEFT is the conceptual equivalent",
  },
  {
    id: "rtp",
    name: "RTP",
    network: "The Clearing House",
    icon: "⚡",
    color: "#f59e0b",
    speed: "Seconds · 24/7/365",
    speedScore: 100,
    cost: "$0.25–$1.00 flat",
    costScore: 85,
    finality: "Irrevocable",
    finalityScore: 100,
    reach: "~60% US bank accounts",
    reachScore: 60,
    bestFor: ["Gig economy payouts", "Insurance claims", "Urgent disbursements"],
    notFor: ["Universal consumer payments (coverage gap)", "International"],
    architectNote: "The US answer to UPI — but 7 years later and not yet universal. $1M limit per transaction. Use when speed and finality matter more than reach.",
    us: "DoorDash instant driver payout · Insurance claim settlement",
    india: "UPI is equivalent — but universal and free",
  },
  {
    id: "fednow",
    name: "FedNow",
    network: "Federal Reserve",
    icon: "⚡",
    color: "#ec4899",
    speed: "Seconds · 24/7/365",
    speedScore: 100,
    cost: "$0.25–$1.00 flat",
    costScore: 85,
    finality: "Irrevocable",
    finalityScore: 100,
    reach: "Growing — not all banks yet",
    reachScore: 45,
    bestFor: ["Same as RTP — depends on bank support"],
    notFor: ["Where bank doesn't participate"],
    architectNote: "Launched July 2023. Architects may need to support both RTP and FedNow and route based on which one the receiving bank participates in. Coverage will grow.",
    us: "Government disbursements · Small business payouts",
    india: "UPI equivalent — launched 7 years after UPI",
  },
  {
    id: "wire",
    name: "Wire (Fedwire)",
    network: "Federal Reserve",
    icon: "🏛️",
    color: "#ef4444",
    speed: "Same day · Banking hours",
    speedScore: 70,
    cost: "$25–$35 per transaction",
    costScore: 5,
    finality: "Irrevocable",
    finalityScore: 100,
    reach: "Universal (any US bank)",
    reachScore: 100,
    bestFor: ["Real estate", "Large B2B", "Treasury operations"],
    notFor: ["Consumer payments", "Small amounts", "Recurring billing"],
    architectNote: "Never for consumer payments — cost is prohibitive. Each transaction settles gross (individually). Use only when high-value, time-critical finality is required.",
    us: "Home purchase closing · Corporate M&A",
    india: "RTGS equivalent (min ₹2 lakh)",
  },
];

const INDIA_RAILS = [
  {
    id: "upi",
    name: "UPI",
    network: "NPCI",
    icon: "📱",
    color: "#00d4ff",
    speed: "Seconds · 24/7/365",
    speedScore: 100,
    cost: "Zero MDR",
    costScore: 100,
    finality: "Final (NPCI dispute process)",
    finalityScore: 90,
    reach: "Near universal (300M+ users)",
    reachScore: 100,
    bestFor: ["Everything", "Consumer payments", "Merchant QR", "P2P transfers"],
    notFor: ["International payments", "Above ₹1 lakh limit"],
    architectNote: "No auth-capture split — UPI is atomic. Money moves or it doesn't. Design refund flows separately. Zero MDR is government policy. India processes more real-time transactions than US+UK+Europe combined.",
    us: "RTP + FedNow — but universal and free",
    india: "Street vendor QR · Flipkart checkout · Electricity bill",
  },
  {
    id: "imps",
    name: "IMPS",
    network: "NPCI",
    icon: "⚡",
    color: "#7c3aed",
    speed: "Instant · 24/7/365",
    speedScore: 100,
    cost: "₹2–₹25 flat",
    costScore: 90,
    finality: "Final",
    finalityScore: 95,
    reach: "Any bank account (IFSC)",
    reachScore: 90,
    bestFor: ["Bank-to-bank transfers", "UPI backbone infrastructure"],
    notFor: ["Direct integration — UPI provides better UX on top"],
    architectNote: "IMPS is the settlement infrastructure UPI is built on. Launched 2010 — 6 years before UPI. Understanding IMPS explains why UPI can settle in real time. Direct integration rarely needed now.",
    us: "RTP infrastructure equivalent",
    india: "Sending money using account + IFSC from bank app",
  },
  {
    id: "neft",
    name: "NEFT",
    network: "RBI",
    icon: "🏦",
    color: "#10b981",
    speed: "Next 30-min batch · 24/7",
    speedScore: 60,
    cost: "₹2–₹25 flat",
    costScore: 90,
    finality: "Final (returns for failures)",
    finalityScore: 80,
    reach: "Any bank account (IFSC)",
    reachScore: 95,
    bestFor: ["Vendor payments", "Loan disbursements", "Medium B2B", "Above UPI limit"],
    notFor: ["Urgent payments", "Consumer retail"],
    architectNote: "Moved to 24/7 half-hourly batches in 2019. Effectively within 30 minutes any time. Good when UPI's ₹1 lakh limit is a constraint. Think of it as Indian ACH but faster.",
    us: "ACH conceptual equivalent",
    india: "Paying vendor invoice from net banking",
  },
  {
    id: "rtgs",
    name: "RTGS",
    network: "RBI",
    icon: "🏛️",
    color: "#f59e0b",
    speed: "Real time · 24/7",
    speedScore: 95,
    cost: "₹25–₹50 flat",
    costScore: 60,
    finality: "Final",
    finalityScore: 100,
    reach: "Any bank account (min ₹2 lakh)",
    reachScore: 70,
    bestFor: ["Large corporate transfers", "Real estate", "Treasury operations"],
    notFor: ["Below ₹2 lakh minimum", "Consumer payments"],
    architectNote: "India's Fedwire equivalent. ₹2 lakh hard minimum — cannot use for smaller amounts. Each transaction settles gross. Available 24/7 since December 2020.",
    us: "Fedwire equivalent",
    india: "CFO paying ₹5 crore to supplier",
  },
  {
    id: "rupay",
    name: "RuPay Cards",
    network: "NPCI",
    icon: "💳",
    color: "#ec4899",
    speed: "Instant auth · T+1/T+2",
    speedScore: 85,
    cost: "Lower MDR than Visa/MC",
    costScore: 75,
    finality: "Reversible (chargeback)",
    finalityScore: 20,
    reach: "High and growing",
    reachScore: 80,
    bestFor: ["Cost-sensitive merchants", "Government-promoted use cases", "Rural banking"],
    notFor: ["International payments", "Premium card benefits"],
    architectNote: "India's domestic network. Lower interchange by government design. Routes through NPCI. Works identically to Visa/MC structurally. Jan Dhan accounts and Kisan Credit Cards drive volume.",
    us: "No direct equivalent — closest is regulated domestic debit",
    india: "Jan Dhan account payments · Kisan Credit Card",
  },
];

const DIMENSIONS = [
  { id: "speed", label: "Speed", icon: "⚡" },
  { id: "cost", label: "Low Cost", icon: "💰" },
  { id: "finality", label: "Finality", icon: "🔒" },
  { id: "reach", label: "Reach", icon: "🌐" },
];

export default function Lesson3_Diagram() {
  const [market, setMarket] = useState("us");
  const [selectedRail, setSelectedRail] = useState(null);
  const [view, setView] = useState("cards");

  const rails = market === "us" ? US_RAILS : INDIA_RAILS;
  const selected = rails.find((r) => r.id === selectedRail);

  return (
    <div style={{
      background: "#0a0e1a",
      minHeight: "100vh",
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      color: "#e2e8f0",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
        borderBottom: "1px solid #1e2d45",
        padding: "24px 32px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 24 }}>🛤️</span>
            <h1 style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#00d4ff",
              margin: 0,
              letterSpacing: "0.05em",
            }}>
              PAYMENT RAILS — LESSON 03
            </h1>
          </div>
          <p style={{ color: "#64748b", fontSize: 12, margin: 0 }}>
            Speed · Cost · Finality · Reach · Use Cases · Architect Notes
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 32px" }}>

        {/* Controls */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
          <div style={{
            display: "flex",
            background: "#111827",
            borderRadius: 8,
            border: "1px solid #1e2d45",
            overflow: "hidden",
          }}>
            {[{ id: "us", label: "🇺🇸 US Rails" }, { id: "india", label: "🇮🇳 India Rails" }].map((m) => (
              <button
                key={m.id}
                onClick={() => { setMarket(m.id); setSelectedRail(null); }}
                style={{
                  padding: "10px 20px",
                  background: market === m.id ? "#1e3a5f" : "transparent",
                  color: market === m.id ? "#00d4ff" : "#64748b",
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

          <div style={{
            display: "flex",
            background: "#111827",
            borderRadius: 8,
            border: "1px solid #1e2d45",
            overflow: "hidden",
          }}>
            {[
              { id: "cards", label: "Rail Cards" },
              { id: "radar", label: "Radar Chart" },
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                style={{
                  padding: "10px 16px",
                  background: view === v.id ? "#7c3aed" : "transparent",
                  color: view === v.id ? "#fff" : "#64748b",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily: "inherit",
                }}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {view === "cards" ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {/* Rail cards */}
            <div>
              <div style={{
                fontSize: 9,
                color: "#64748b",
                letterSpacing: "0.12em",
                marginBottom: 12,
                fontWeight: 700,
              }}>
                SELECT A RAIL TO EXPLORE
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {rails.map((rail) => (
                  <div
                    key={rail.id}
                    onClick={() => setSelectedRail(selectedRail === rail.id ? null : rail.id)}
                    style={{
                      padding: "14px 16px",
                      background: selectedRail === rail.id ? `${rail.color}15` : "#111827",
                      border: `1px solid ${selectedRail === rail.id ? rail.color : "#1e2d45"}`,
                      borderRadius: 8,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 18 }}>{rail.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: selectedRail === rail.id ? rail.color : "#e2e8f0",
                          marginBottom: 2,
                        }}>
                          {rail.name}
                        </div>
                        <div style={{ fontSize: 10, color: "#64748b" }}>
                          {rail.network}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        {DIMENSIONS.map((dim) => (
                          <div key={dim.id} style={{ textAlign: "center" }}>
                            <div style={{
                              width: 28,
                              height: 28,
                              borderRadius: 4,
                              background: `${rail.color}${Math.round(rail[`${dim.id}Score`] / 100 * 200 + 30).toString(16)}`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 9,
                              color: rail.color,
                              fontWeight: 700,
                              border: `1px solid ${rail.color}30`,
                            }}>
                              {rail[`${dim.id}Score`]}
                            </div>
                            <div style={{ fontSize: 7, color: "#374151", marginTop: 2 }}>
                              {dim.icon}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mini bar chart */}
                    <div style={{ marginTop: 10 }}>
                      {DIMENSIONS.map((dim) => (
                        <div key={dim.id} style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 3,
                        }}>
                          <div style={{
                            fontSize: 8,
                            color: "#374151",
                            minWidth: 50,
                          }}>
                            {dim.label}
                          </div>
                          <div style={{
                            flex: 1,
                            height: 4,
                            background: "#1e2d45",
                            borderRadius: 2,
                            overflow: "hidden",
                          }}>
                            <div style={{
                              width: `${rail[`${dim.id}Score`]}%`,
                              height: "100%",
                              background: rail.color,
                              borderRadius: 2,
                              transition: "width 0.5s ease",
                            }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detail panel */}
            <div>
              {selected ? (
                <div style={{
                  background: "#111827",
                  border: `1px solid ${selected.color}30`,
                  borderRadius: 12,
                  overflow: "hidden",
                  position: "sticky",
                  top: 24,
                }}>
                  <div style={{
                    padding: "16px 20px",
                    background: `${selected.color}10`,
                    borderBottom: `1px solid ${selected.color}30`,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}>
                    <span style={{ fontSize: 24 }}>{selected.icon}</span>
                    <div>
                      <div style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: selected.color,
                      }}>
                        {selected.name}
                      </div>
                      <div style={{ fontSize: 10, color: "#64748b" }}>
                        {selected.network}
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: "16px 20px" }}>
                    {/* Stats */}
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 10,
                      marginBottom: 16,
                    }}>
                      {[
                        { label: "Speed", value: selected.speed },
                        { label: "Cost", value: selected.cost },
                        { label: "Finality", value: selected.finality },
                        { label: "Reach", value: selected.reach },
                      ].map((item) => (
                        <div key={item.label} style={{
                          padding: "10px 12px",
                          background: "#0f172a",
                          border: "1px solid #1e2d45",
                          borderRadius: 6,
                        }}>
                          <div style={{
                            fontSize: 9,
                            color: "#64748b",
                            fontWeight: 700,
                            marginBottom: 4,
                            letterSpacing: "0.08em",
                          }}>
                            {item.label.toUpperCase()}
                          </div>
                          <div style={{ fontSize: 10, color: "#94a3b8" }}>
                            {item.value}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Best for / Not for */}
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 10,
                      marginBottom: 16,
                    }}>
                      <div>
                        <div style={{
                          fontSize: 9,
                          fontWeight: 700,
                          color: "#10b981",
                          marginBottom: 6,
                          letterSpacing: "0.08em",
                        }}>
                          ✓ BEST FOR
                        </div>
                        {selected.bestFor.map((item) => (
                          <div key={item} style={{
                            fontSize: 10,
                            color: "#64748b",
                            padding: "3px 0",
                            borderBottom: "1px solid #1e2d45",
                          }}>
                            · {item}
                          </div>
                        ))}
                      </div>
                      <div>
                        <div style={{
                          fontSize: 9,
                          fontWeight: 700,
                          color: "#ef4444",
                          marginBottom: 6,
                          letterSpacing: "0.08em",
                        }}>
                          ✗ NOT FOR
                        </div>
                        {selected.notFor.map((item) => (
                          <div key={item} style={{
                            fontSize: 10,
                            color: "#64748b",
                            padding: "3px 0",
                            borderBottom: "1px solid #1e2d45",
                          }}>
                            · {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Architect note */}
                    <div style={{
                      padding: "12px 14px",
                      background: "rgba(245,158,11,0.05)",
                      border: "1px dashed rgba(245,158,11,0.3)",
                      borderRadius: 6,
                      marginBottom: 12,
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
                        color: "#94a3b8",
                        lineHeight: 1.7,
                      }}>
                        {selected.architectNote}
                      </div>
                    </div>

                    {/* Examples */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <div style={{
                        padding: "8px 10px",
                        background: "#0f172a",
                        border: "1px solid rgba(0,212,255,0.2)",
                        borderRadius: 6,
                      }}>
                        <div style={{
                          fontSize: 9,
                          fontWeight: 700,
                          color: "#00d4ff",
                          marginBottom: 4,
                        }}>
                          🇺🇸 US
                        </div>
                        <div style={{ fontSize: 10, color: "#64748b", lineHeight: 1.5 }}>
                          {selected.us}
                        </div>
                      </div>
                      <div style={{
                        padding: "8px 10px",
                        background: "#0f172a",
                        border: "1px solid rgba(124,58,237,0.2)",
                        borderRadius: 6,
                      }}>
                        <div style={{
                          fontSize: 9,
                          fontWeight: 700,
                          color: "#7c3aed",
                          marginBottom: 4,
                        }}>
                          🇮🇳 India
                        </div>
                        <div style={{ fontSize: 10, color: "#64748b", lineHeight: 1.5 }}>
                          {selected.india}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{
                  background: "#111827",
                  border: "1px solid #1e2d45",
                  borderRadius: 12,
                  padding: "40px 24px",
                  textAlign: "center",
                  color: "#374151",
                }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>🛤️</div>
                  <div style={{ fontSize: 12, marginBottom: 8, color: "#64748b" }}>
                    Select a rail to explore
                  </div>
                  <div style={{ fontSize: 10, color: "#374151" }}>
                    Speed · Cost · Finality · Reach<br />
                    Use cases · Architect notes
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Radar chart view */
          <div>
            <div style={{
              fontSize: 9,
              color: "#64748b",
              letterSpacing: "0.12em",
              marginBottom: 16,
              fontWeight: 700,
            }}>
              RAIL COMPARISON — ALL {market.toUpperCase()} RAILS
            </div>
            <div style={{
              background: "#111827",
              border: "1px solid #1e2d45",
              borderRadius: 12,
              padding: "24px",
              overflowX: "auto",
            }}>
              <table style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 10,
              }}>
                <thead>
                  <tr style={{ background: "#0f172a" }}>
                    <th style={{
                      padding: "10px 14px",
                      textAlign: "left",
                      color: "#64748b",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      borderBottom: "1px solid #1e2d45",
                      minWidth: 120,
                    }}>
                      RAIL
                    </th>
                    {DIMENSIONS.map((dim) => (
                      <th key={dim.id} style={{
                        padding: "10px 14px",
                        textAlign: "center",
                        color: "#64748b",
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        borderBottom: "1px solid #1e2d45",
                      }}>
                        {dim.icon} {dim.label}
                      </th>
                    ))}
                    <th style={{
                      padding: "10px 14px",
                      textAlign: "left",
                      color: "#64748b",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      borderBottom: "1px solid #1e2d45",
                    }}>
                      BEST FOR
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rails.map((rail) => (
                    <tr
                      key={rail.id}
                      onClick={() => setSelectedRail(rail.id)}
                      style={{
                        borderBottom: "1px solid #1e2d45",
                        cursor: "pointer",
                        background: selectedRail === rail.id
                          ? `${rail.color}10`
                          : "transparent",
                      }}
                    >
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span>{rail.icon}</span>
                          <div>
                            <div style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: rail.color,
                            }}>
                              {rail.name}
                            </div>
                            <div style={{ fontSize: 9, color: "#64748b" }}>
                              {rail.network}
                            </div>
                          </div>
                        </div>
                      </td>
                      {DIMENSIONS.map((dim) => {
                        const score = rail[`${dim.id}Score`];
                        const getColor = (s) => {
                          if (s >= 80) return "#10b981";
                          if (s >= 50) return "#f59e0b";
                          return "#ef4444";
                        };
                        return (
                          <td key={dim.id} style={{ padding: "12px 14px" }}>
                            <div style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: 4,
                            }}>
                              <div style={{
                                width: 36,
                                height: 36,
                                borderRadius: 6,
                                background: `${getColor(score)}15`,
                                border: `1px solid ${getColor(score)}30`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 11,
                                fontWeight: 700,
                                color: getColor(score),
                              }}>
                                {score}
                              </div>
                              <div style={{
                                width: 36,
                                height: 3,
                                background: "#1e2d45",
                                borderRadius: 2,
                                overflow: "hidden",
                              }}>
                                <div style={{
                                  width: `${score}%`,
                                  height: "100%",
                                  background: getColor(score),
                                }} />
                              </div>
                            </div>
                          </td>
                        );
                      })}
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ fontSize: 10, color: "#64748b" }}>
                          {rail.bestFor[0]}
                          {rail.bestFor.length > 1 && (
                            <span style={{ color: "#374151" }}>
                              {" "}+{rail.bestFor.length - 1} more
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{
                marginTop: 12,
                display: "flex",
                gap: 16,
                fontSize: 9,
                color: "#374151",
              }}>
                <span>Score: </span>
                <span style={{ color: "#10b981" }}>80–100 = Strong</span>
                <span style={{ color: "#f59e0b" }}>50–79 = Moderate</span>
                <span style={{ color: "#ef4444" }}>0–49 = Weak</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{
          marginTop: 24,
          padding: "12px 16px",
          background: "rgba(0,212,255,0.05)",
          border: "1px solid #1e2d45",
          borderRadius: 8,
          fontSize: 10,
          color: "#64748b",
          textAlign: "center",
        }}>
          💡 Toggle US / India rails · Select a rail for full detail · Switch to Radar Chart for comparison table
        </div>
      </div>
    </div>
  );
}
