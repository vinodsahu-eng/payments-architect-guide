const lessons = [
  {
    id: "lesson1",
    number: "01",
    title: "The Payment Stack",
    topics: ["Four-party model", "Processors", "US & India"],
  },
  {
    id: "lesson1-diagram",
    number: "01",
    title: "Flow Diagrams",
    topics: ["Card Present", "Card Not Present"],
  },
];

export default function Sidebar({ activeLesson, onSelect }) {
  return (
    <div style={{
      width: 260,
      minHeight: "100vh",
      background: "#0a0e1a",
      borderRight: "1px solid #1e2d45",
      display: "flex",
      flexDirection: "column",
      position: "fixed",
      left: 0,
      top: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: "24px 20px",
        borderBottom: "1px solid #1e2d45",
      }}>
        <div style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#00d4ff",
          letterSpacing: "0.15em",
          fontFamily: "monospace",
        }}>
          PAYMENTS ARCHITECT
        </div>
        <div style={{
          fontSize: 10,
          color: "#64748b",
          marginTop: 4,
          fontFamily: "monospace",
        }}>
          REFERENCE GUIDE
        </div>
      </div>

      {/* Lessons */}
      <div style={{ padding: "16px 0", flex: 1 }}>
        <div style={{
          fontSize: 9,
          color: "#64748b",
          letterSpacing: "0.15em",
          padding: "0 20px 12px",
          fontFamily: "monospace",
        }}>
          LESSONS
        </div>

        {lessons.map((lesson) => {
          const isActive = activeLesson === lesson.id;
          return (
            <div
              key={lesson.id}
              onClick={() => onSelect(lesson.id)}
              style={{
                padding: "12px 20px",
                cursor: "pointer",
                background: isActive ? "#1e3a5f" : "transparent",
                borderLeft: isActive ? "3px solid #00d4ff" : "3px solid transparent",
                transition: "all 0.2s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{
                  fontSize: 10,
                  color: isActive ? "#00d4ff" : "#64748b",
                  fontFamily: "monospace",
                  fontWeight: 700,
                }}>
                  {lesson.number}
                </span>
                <span style={{
                  fontSize: 12,
                  color: isActive ? "#e2e8f0" : "#94a3b8",
                  fontFamily: "monospace",
                  fontWeight: isActive ? 700 : 400,
                }}>
                  {lesson.title}
                </span>
              </div>
              <div style={{ marginTop: 6, paddingLeft: 22 }}>
                {lesson.topics.map((topic) => (
                  <div key={topic} style={{
                    fontSize: 10,
                    color: isActive ? "#64748b" : "#374151",
                    fontFamily: "monospace",
                    marginBottom: 2,
                  }}>
                    · {topic}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{
        padding: "16px 20px",
        borderTop: "1px solid #1e2d45",
        fontSize: 9,
        color: "#374151",
        fontFamily: "monospace",
      }}>
        BUILT WHILE LEARNING · 2024
      </div>
    </div>
  );
}