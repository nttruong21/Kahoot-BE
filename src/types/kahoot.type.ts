interface SummaryKahoot {
  id: number
  title: string
  coverImage: string
  numberOfQuestion: number
}

interface SummaryUserKahoot extends SummaryKahoot {
  createdAt: string
  visibleScope: string
}

interface SummaryPublicKahoot extends SummaryKahoot {
  userId: number
  username: string
  userImage: string
}

export type { SummaryUserKahoot, SummaryPublicKahoot }
