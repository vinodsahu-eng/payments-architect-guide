import { useState } from "react"
import Sidebar from "./components/Sidebar"
import Intro from "./lessons/Intro"
import Lesson1_Content from "./lessons/Lesson1_Content"
import Lesson1_Diagram from "./lessons/Lesson1_Diagram"
import Lesson2_Content from "./lessons/Lesson2_Content"
import Lesson2_Diagram from "./lessons/Lesson2_Diagram"
import Lesson3_Content from "./lessons/Lesson3_Content"
import Lesson3B_Content from "./lessons/Lesson3B_Content"
import Lesson3_Diagram from "./lessons/Lesson3_Diagram"



const LESSONS = {
  intro: <Intro />,
  lesson1: <Lesson1_Content />,
  "lesson1-diagram": <Lesson1_Diagram />,
  lesson2: <Lesson2_Content />,
  "lesson2-diagram": <Lesson2_Diagram />,
  lesson3: <Lesson3_Content />,
  "lesson3b": <Lesson3B_Content />,
  "lesson3-diagram": <Lesson3_Diagram />,
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