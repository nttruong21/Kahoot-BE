interface UserModel {
  id: number
  username: string
  name: string
  image: string
  created_at: Date
  updated_at: Date | null
}

export { UserModel }
