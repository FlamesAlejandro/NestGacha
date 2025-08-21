export interface JikanImageSet {
  jpg?: { image_url?: string }
  webp?: { image_url?: string; small_image_url?: string }
}
export interface JikanCharacterRef {
  mal_id: number
  name: string
  images?: JikanImageSet
}
export interface JikanAnimeCharacterItem {
  character: JikanCharacterRef
  role?: string
  favorites?: number
}
