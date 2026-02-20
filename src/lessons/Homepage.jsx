import { useState } from "react";

const COLORS = {
  bg: "#0a0e1a",
  surface: "#111827",
  border: "#1e2d45",
  accent: "#00d4ff",
  text: "#e2e8f0",
  textMuted: "#64748b",
};

const PAYMENT_ACTORS = [
  { id: "cardholder", label: "Cardholder", icon: "👤", color: "#00d4ff", lesson: "lesson1", x: 10, y: 50 },
  { id: "terminal", label: "Terminal", icon: "💳", color: "#7c3aed", lesson: "lesson1", x: 25, y: 50 },
  { id: "processor", label: "Processor", icon: "⚙️", color: "#10b981", lesson: "lesson1", x: 40, y: 35 },
  { id: "acquirer", label: "Acquirer", icon: "🏦", color: "#f59e0b", lesson: "lesson1", x: 55, y: 35 },
  { id: "network", label: "Network", icon: "🌐", color: "#ec4899", lesson: "lesson1", x: 70, y: 50 },
  { id: "issuer", label: "Issuer", icon: "🏛️", color: "#ef4444", lesson: "lesson1", x: 85, y: 50 },
];

const LIFECYCLE_STATES = [
  { id: "auth", label: "Authorization", color: "#00d4ff", lesson: "lesson2", angle: 0 },
  { id: "capture", label: "Capture", color: "#7c3aed", lesson: "lesson2", angle: 60 },
  { id: "settlement", label: "Settlement", color: "#10b981", lesson: "lesson2", angle: 120 },
  { id: "void", label: "Void", color: "#94a3b8", lesson: "lesson2", angle: 180 },
  { id: "refund", label: "Refund", color: "#f59e0b", lesson: "lesson2", angle: 240 },
  { id: "chargeback", label: "Chargeback", color: "#ef4444", lesson: "lesson2", angle: 300 },
];

const RAILS = [
  { id: "card", label: "Cards", icon: "💳", color: "#00d4ff", lesson: "lesson3", angle: 0 },
  { id: "ach", label: "ACH", icon: "🏦", color: "#10b981", lesson: "lesson3", angle: 60 },
  { id: "rtp", label: "RTP", icon: "⚡", color: "#f59e0b", lesson: "lesson3", angle: 120 },
  { id: "upi", label: "UPI", icon: "📱", color: "#7c3aed", lesson: "lesson3", angle: 180 },
  { id: "wire", label: "Wire", icon: "🏛️", color: "#ef4444", lesson: "lesson3", angle: 240 },
  { id: "neft", label: "NEFT", icon: "🔄", color: "#ec4899", lesson: "lesson3", angle: 300 },
];

const DECISION_TREE = [
  {
    q: "I need to pay a driver instantly after delivery",
    answer: "RTP (US) or UPI (India)",
    rails: ["rtp", "upi"],
    lesson: "lesson3",
    color: "#f59e0b",
  },
  {
    q: "I need to bill a subscription monthly",
    answer: "ACH (US) or UPI autopay (India)",
    rails: ["ach", "upi"],
    lesson: "lesson3",
    color: "#10b981",
  },
  {
    q: "I need to accept consumer purchases online",
    answer: "Cards or UPI — both work, UPI is free in India",
    rails: ["card", "upi"],
    lesson: "lesson3",
    color: "#00d4ff",
  },
  {
    q: "I need to move $500,000 for a real estate closing",
    answer: "Wire (Fedwire) — only rail for high-value urgent finality",
    rails: ["wire"],
    lesson: "lesson3",
    color: "#ef4444",
  },
];

export default function Homepage({ onNavigate }) {
  const [activeSection, setActiveSection] = useState(null);
  const [hoveredActor, setHoveredActor] = useState(null);
  const [selectedDecision, setSelectedDecision] = useState(null);

  const handleNavigate = (lessonId) => {
    if (onNavigate) onNavigate(lessonId);
  };

  return (
    <div style={{
      background: COLORS.bg,
      minHeight: "100vh",
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      color: COLORS.text,
    }}>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)",
        padding: "64px 32px 48px",
        borderBottom: `1px solid ${COLORS.border}`,
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <div style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#ffffff",
            marginBottom: 16,
            lineHeight: 1.2,
          }}>
            Payments Architect
            <br />
            <span style={{
              background: "linear-gradient(90deg, #00d4ff, #7c3aed, #ec4899)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Interactive Guide
            </span>
          </div>
          <p style={{
            fontSize: 16,
            color: "#94a3b8",
            maxWidth: 600,
            margin: "0 auto 32px",
            lineHeight: 1.8,
          }}>
            Don't read documentation. Explore the system.
            Click any part of the payment stack to understand how it works.
          </p>
          <div style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}>
            {["The Flow", "Lifecycle", "Rails", "Decisions"].map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section.toLowerCase())}
                style={{
                  padding: "12px 24px",
                  background: activeSection === section.toLowerCase()
                    ? COLORS.accent
                    : "rgba(255,255,255,0.05)",
                  color: activeSection === section.toLowerCase()
                    ? "#000"
                    : COLORS.text,
                  border: `1px solid ${activeSection === section.toLowerCase()
                    ? COLORS.accent
                    : "rgba(255,255,255,0.1)"}`,
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.2s",
                }}
              >
                {section}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 32px" }}>

        {/* Section 1: The Payment Flow */}
        {(!activeSection || activeSection === "the flow") && (
          <div style={{ marginBottom: 64 }}>
            <div style={{
              fontSize: 11,
              color: COLORS.accent,
              letterSpacing: "0.15em",
              marginBottom: 12,
              fontWeight: 700,
            }}>
              01 — THE PAYMENT FLOW
            </div>
            <h2 style={{
              fontSize: 24,
              color: "#ffffff",
              marginBottom: 32,
            }}>
              Click any actor to explore their role
            </h2>

            <div style={{
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 16,
              padding: "48px 32px",
              position: "relative",
              height: 400,
            }}>
              <svg
                width="100%"
                height="100%"
                style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
              >
                {/* Connection lines */}
                {PAYMENT_ACTORS.map((actor, idx) => {
                  if (idx === PAYMENT_ACTORS.length - 1) return null;
                  const next = PAYMENT_ACTORS[idx + 1];
                  return (
                    <line
                      key={`line-${actor.id}`}
                      x1={`${actor.x}%`}
                      y1={`${actor.y}%`}
                      x2={`${next.x}%`}
                      y2={`${next.y}%`}
                      stroke={COLORS.border}
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                  );
                })}
              </svg>

              {/* Actors */}
              {PAYMENT_ACTORS.map((actor) => (
                <div
                  key={actor.id}
                  onMouseEnter={() => setHoveredActor(actor.id)}
                  onMouseLeave={() => setHoveredActor(null)}
                  onClick={() => handleNavigate(actor.lesson)}
                  style={{
                    position: "absolute",
                    left: `${actor.x}%`,
                    top: `${actor.y}%`,
                    transform: "translate(-50%, -50%)",
                    cursor: "pointer",
                    transition: "all 0.3s",
                  }}
                >
                  <div style={{
                    width: hoveredActor === actor.id ? 100 : 80,
                    height: hoveredActor === actor.id ? 100 : 80,
                    borderRadius: "50%",
                    background: `${actor.color}15`,
                    border: `3px solid ${actor.color}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: hoveredActor === actor.id ? 32 : 28,
                    transition: "all 0.3s",
                    boxShadow: hoveredActor === actor.id
                      ? `0 0 30px ${actor.color}80`
                      : "none",
                  }}>
                    {actor.icon}
                  </div>
                  <div style={{
                    position: "absolute",
                    top: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    marginTop: 12,
                    fontSize: 11,
                    fontWeight: 700,
                    color: hoveredActor === actor.id ? actor.color : COLORS.textMuted,
                    whiteSpace: "nowrap",
                    transition: "color 0.3s",
                  }}>
                    {actor.label}
                  </div>
                  {hoveredActor === actor.id && (
                    <div style={{
                      position: "absolute",
                      top: "110%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      marginTop: 24,
                      padding: "8px 12px",
                      background: COLORS.surface,
                      border: `1px solid ${actor.color}`,
                      borderRadius: 6,
                      fontSize: 9,
                      color: COLORS.textMuted,
                      whiteSpace: "nowrap",
                      zIndex: 10,
                    }}>
                      Click to explore →
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{
              marginTop: 24,
              padding: "16px 20px",
              background: "rgba(0,212,255,0.05)",
              border: "1px solid rgba(0,212,255,0.15)",
              borderRadius: 8,
              fontSize: 12,
              color: COLORS.textMuted,
              textAlign: "center",
            }}>
              💡 This is the four-party model in action. Every card payment flows through these actors.
              Hover to highlight, click to learn more in Lesson 1.
            </div>
          </div>
        )}

        {/* Section 2: Transaction Lifecycle */}
        {(!activeSection || activeSection === "lifecycle") && (
          <div style={{ marginBottom: 64 }}>
            <div style={{
              fontSize: 11,
              color: "#7c3aed",
              letterSpacing: "0.15em",
              marginBottom: 12,
              fontWeight: 700,
            }}>
              02 — TRANSACTION LIFECYCLE
            </div>
            <h2 style={{
              fontSize: 24,
              color: "#ffffff",
              marginBottom: 32,
            }}>
              Click any state to explore the operation
            </h2>

            <div style={{
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 16,
              padding: "48px 32px",
              position: "relative",
              height: 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <div style={{ position: "relative", width: 400, height: 400 }}>
                {/* Center */}
                <div style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                  zIndex: 1,
                }}>
                  <div style={{
                    fontSize: 48,
                    marginBottom: 8,
                  }}>
                    🔄
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: COLORS.textMuted,
                  }}>
                    Transaction
                    <br />
                    State Machine
                  </div>
                </div>

                {/* States in circle */}
                {LIFECYCLE_STATES.map((state) => {
                  const radius = 180;
                  const angleRad = (state.angle * Math.PI) / 180;
                  const x = 200 + radius * Math.cos(angleRad);
                  const y = 200 + radius * Math.sin(angleRad);

                  return (
                    <div
                      key={state.id}
                      onClick={() => handleNavigate(state.lesson)}
                      style={{
                        position: "absolute",
                        left: x,
                        top: y,
                        transform: "translate(-50%, -50%)",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        background: `${state.color}15`,
                        border: `3px solid ${state.color}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.3s",
                      }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.15)";
                          e.currentTarget.style.boxShadow = `0 0 30px ${state.color}80`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <div style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: state.color,
                          textAlign: "center",
                          lineHeight: 1.3,
                        }}>
                          {state.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{
              marginTop: 24,
              padding: "16px 20px",
              background: "rgba(124,58,237,0.05)",
              border: "1px solid rgba(124,58,237,0.15)",
              borderRadius: 8,
              fontSize: 12,
              color: COLORS.textMuted,
              textAlign: "center",
            }}>
              💡 Not every transaction goes through all states. Click any state to learn when and why it happens.
              Lesson 2 covers the complete lifecycle.
            </div>
          </div>
        )}

        {/* Section 3: Payment Rails Wheel */}
        {(!activeSection || activeSection === "rails") && (
          <div style={{ marginBottom: 64 }}>
            <div style={{
              fontSize: 11,
              color: "#10b981",
              letterSpacing: "0.15em",
              marginBottom: 12,
              fontWeight: 700,
            }}>
              03 — PAYMENT RAILS
            </div>
            <h2 style={{
              fontSize: 24,
              color: "#ffffff",
              marginBottom: 32,
            }}>
              Click any rail to compare speed, cost, and use cases
            </h2>

            <div style={{
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 16,
              padding: "48px 32px",
              position: "relative",
              height: 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <div style={{ position: "relative", width: 400, height: 400 }}>
                {/* Center */}
                <div style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                  zIndex: 1,
                }}>
                  <div style={{ fontSize: 48, marginBottom: 8 }}>🛤️</div>
                  <div style={{ fontSize: 12, color: COLORS.textMuted }}>
                    US & India
                    <br />
                    Rails
                  </div>
                </div>

                {/* Rails in circle */}
                {RAILS.map((rail) => {
                  const radius = 180;
                  const angleRad = (rail.angle * Math.PI) / 180;
                  const x = 200 + radius * Math.cos(angleRad);
                  const y = 200 + radius * Math.sin(angleRad);

                  return (
                    <div
                      key={rail.id}
                      onClick={() => handleNavigate(rail.lesson)}
                      style={{
                        position: "absolute",
                        left: x,
                        top: y,
                        transform: "translate(-50%, -50%)",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: "50%",
                          background: `${rail.color}15`,
                          border: `3px solid ${rail.color}`,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.3s",
                          gap: 4,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.15)";
                          e.currentTarget.style.boxShadow = `0 0 30px ${rail.color}80`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <div style={{ fontSize: 24 }}>{rail.icon}</div>
                        <div style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: rail.color,
                        }}>
                          {rail.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{
              marginTop: 24,
              padding: "16px 20px",
              background: "rgba(16,185,129,0.05)",
              border: "1px solid rgba(16,185,129,0.15)",
              borderRadius: 8,
              fontSize: 12,
              color: COLORS.textMuted,
              textAlign: "center",
            }}>
              💡 Each rail has different tradeoffs between speed, cost, finality, and reach.
              Lesson 3 breaks down when to use which rail.
            </div>
          </div>
        )}

        {/* Section 4: Decision Tree */}
        {(!activeSection || activeSection === "decisions") && (
          <div style={{ marginBottom: 64 }}>
            <div style={{
              fontSize: 11,
              color: "#f59e0b",
              letterSpacing: "0.15em",
              marginBottom: 12,
              fontWeight: 700,
            }}>
              04 — ARCHITECTURE DECISIONS
            </div>
            <h2 style={{
              fontSize: 24,
              color: "#ffffff",
              marginBottom: 32,
            }}>
              What do you need to do? Click to see which rail to use.
            </h2>

            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}>
              {DECISION_TREE.map((decision, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedDecision(selectedDecision === idx ? null : idx)}
                  style={{
                    padding: "20px",
                    background: selectedDecision === idx
                      ? `${decision.color}15`
                      : COLORS.surface,
                    border: `1px solid ${selectedDecision === idx
                      ? decision.color
                      : COLORS.border}`,
                    borderRadius: 12,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: COLORS.text,
                    marginBottom: 12,
                    lineHeight: 1.6,
                  }}>
                    "{decision.q}"
                  </div>

                  {selectedDecision === idx && (
                    <>
                      <div style={{
                        padding: "12px 14px",
                        background: COLORS.bg,
                        borderRadius: 8,
                        marginBottom: 12,
                      }}>
                        <div style={{
                          fontSize: 10,
                          color: decision.color,
                          fontWeight: 700,
                          marginBottom: 6,
                          letterSpacing: "0.08em",
                        }}>
                          RECOMMENDED RAIL
                        </div>
                        <div style={{
                          fontSize: 12,
                          color: COLORS.text,
                          lineHeight: 1.6,
                        }}>
                          {decision.answer}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNavigate(decision.lesson);
                        }}
                        style={{
                          padding: "10px 16px",
                          background: decision.color,
                          color: "#000",
                          border: "none",
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: "pointer",
                          fontFamily: "inherit",
                          width: "100%",
                        }}
                      >
                        Learn More in Lesson 3 →
                      </button>
                    </>
                  )}

                  {selectedDecision !== idx && (
                    <div style={{
                      fontSize: 10,
                      color: COLORS.textMuted,
                      fontStyle: "italic",
                    }}>
                      Click to see recommendation
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{
              marginTop: 24,
              padding: "16px 20px",
              background: "rgba(245,158,11,0.05)",
              border: "1px solid rgba(245,158,11,0.15)",
              borderRadius: 8,
              fontSize: 12,
              color: COLORS.textMuted,
              textAlign: "center",
            }}>
              💡 Every architecture decision is a tradeoff. Lesson 3 teaches you how to evaluate
              speed, cost, finality, and reach for your specific use case.
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div style={{
          marginTop: 80,
          padding: "48px 32px",
          background: "linear-gradient(135deg, rgba(0,212,255,0.1) 0%, rgba(124,58,237,0.1) 100%)",
          border: "1px solid rgba(0,212,255,0.2)",
          borderRadius: 16,
          textAlign: "center",
        }}>
          <h3 style={{
            fontSize: 24,
            color: "#ffffff",
            marginBottom: 16,
          }}>
            Ready to go deeper?
          </h3>
          <p style={{
            fontSize: 14,
            color: COLORS.textMuted,
            marginBottom: 32,
            maxWidth: 600,
            margin: "0 auto 32px",
          }}>
            Use the sidebar to navigate lessons sequentially, or jump into
            diagrams for interactive exploration. Every lesson builds on the previous one.
          </p>
          <div style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}>
            {[
              { label: "Start with Lesson 1", lesson: "lesson1", color: "#00d4ff" },
              { label: "Explore Payment Rails", lesson: "lesson3-diagram", color: "#10b981" },
              { label: "See Transaction Flow", lesson: "lesson1-diagram", color: "#7c3aed" },
            ].map((btn) => (
              <button
                key={btn.lesson}
                onClick={() => handleNavigate(btn.lesson)}
                style={{
                  padding: "14px 24px",
                  background: btn.color,
                  color: "#000",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
