interface Kahoot {
  id?: number
  userId: number
  username: string
  userImage: string
  title: string
  coverImage: string
  theme: string
  description?: string
  media?: string
  visibleScope: string
  language?: string
  questions: Array<QuizQuestion | TrueOrFalseQuestion>
}

interface Question {
  id?: number
  type: string
  media?: string
  timeLimit: number
  point: number
  question: string
  inOrder?: number
  answer?: boolean
  answers?: Array<QuizAnswer>
}

interface QuizQuestion extends Question {
  answers: Array<QuizAnswer>
}

interface TrueOrFalseQuestion extends Question {
  answer: boolean
}

interface QuizAnswer {
  id?: number
  text?: string
  image?: string
  isCorrect: boolean
  inOrder?: number
}

export { Kahoot, Question, QuizAnswer, QuizQuestion, TrueOrFalseQuestion }
