interface AccountModel {
  id: number
  email: string | null
  password: string | null
  ggid: string | null
  fbid: string | null
  is_active: boolean
  created_at: Date
}

export { AccountModel }
