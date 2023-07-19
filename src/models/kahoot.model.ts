interface Kahoot {
  userId: number
  title: string
  coverImage: string
  theme: string
  description?: string
  media?: string
  visibleScope: string
  language: string
  questions: Array<Question>
}

interface Question {
  type: string
  media?: string
  timeLimit: number
  point: number
  question: string
  answers: Array<Answer>
}

interface Answer {
  text?: string
  image?: string
  isCorrect: boolean
}

export { Kahoot, Question, Answer }
