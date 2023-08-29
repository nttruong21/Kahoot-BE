interface PlaySummary {
  id: number
  userId: number
  createdAt: number
  kahootId: number | null
  kahootTitle: string
  assignmentId: number | null
  type: PlayType
  point: number
  numberOfPlayer: number
}

enum PlayType {
  practice = 'practice',
  assignment = 'assignment'
}

export type { PlaySummary }
export { PlayType }
