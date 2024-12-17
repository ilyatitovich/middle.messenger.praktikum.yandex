import { compile } from 'handlebars'

export function getTemplate<T>(template: string, props?: T): string {
  return compile(template)(props ?? {})
}
