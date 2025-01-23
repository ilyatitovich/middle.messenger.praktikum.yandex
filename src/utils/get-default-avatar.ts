export function getDefaultAvatar(id?: number): string {
  return `https://robohash.org/${id ? id : 'avatar'}`
}
