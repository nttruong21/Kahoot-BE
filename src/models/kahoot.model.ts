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
  answer?: number
  answers?: Array<QuizAnswer>
}

interface QuizQuestion extends Question {
  answers: Array<QuizAnswer>
}

interface TrueOrFalseQuestion extends Question {
  answer: number
}

interface QuizAnswer {
  id?: number
  text?: string
  image?: string
  isCorrect: number
  inOrder?: number
}

export { Kahoot, Question, QuizAnswer, QuizQuestion, TrueOrFalseQuestion }
