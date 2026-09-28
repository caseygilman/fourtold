export type Pillar =
  | 'faith'
  | 'fitness'
  | 'finance'
  | 'family'

export type Cross = {
  id: string
  name: string
  pillar: Pillar

  /*
    Optional for backward compatibility.

    Crosses created before this field was
    introduced will continue to work normally.
  */
  createdAt?: string
}