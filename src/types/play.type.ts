interface PlaySummary {
  id: number
  userId: number
  createdAt: number
  kahootId: number | null
  kahootTitle: string
  assignmentId: number | null
}

export type { PlaySummary }
