export function getFilePath(relativePath: string): string {
  const baseURL = 'https://ya-praktikum.tech/api/v2/resources/'
  return `${baseURL}${relativePath.replace(/^\//, '')}`
}
