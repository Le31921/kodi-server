export const createSlug = (str: string): string => {
  const slug = str
    .toLowerCase()
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with dash.
    .replace(/[^\w-]+/g, '') // Remove non-word chars except dashes.
    .replace(/--+/g, '-') // Replace multiple dashes with a dash.
    .replace(/^-+|-+$/g, '') // Remove trailing dashes.

  return `${slug}-${Math.random().toString(16).substring(2, 8)}`
}