import { useState } from "react"
import Sidebar from "./components/Sidebar"
import Intro from "./lessons/Intro"
import Lesson1_Content from "./lessons/Lesson1_Content"
import Lesson1_Diagram from "./lessons/Lesson1_Diagram"
import Lesson2_Content from "./lessons/Lesson2_Content"
import Lesson2_Diagram from "./lessons/Lesson2_Diagram"

const LESSONS = {
  intro: <Intro />,
  lesson1: <Lesson1_Content />,
  "lesson1-diagram": <Lesson1_Diagram />,
  lesson2: <Lesson2_Content />,
  "lesson2-diagram": <Lesson2_Diagram />,
}

export default function App() {
  const [activeLesson, setActiveLesson] = useState("intro")

  return (
    <div style={{
      display: "flex",
      background: "#0a0e1a",
      minHeight: "100vh",
    }}>
      <Sidebar
        activeLesson={activeLesson}
        onSelect={setActiveLesson}
      />
      <div style={{
        marginLeft: 260,
        flex: 1,
        minHeight: "100vh",
        background: "#0a0e1a",
        overflowY: "auto",
      }}>
        {LESSONS[activeLesson]}
      </div>
    </div>
  )
}