export const createButtonString = (url: string, alt: string, href: string) => {
  return `<a href="${href}"><img src="${url}" alt="${alt}" width="88" height="31" /></a>`
}