export async function parseFromJs(template: string) {
  const templateFn = await import(template).then((module) => module.default);
  return templateFn;
}
