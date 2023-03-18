import { TemplateFunction } from "../interface";

export async function parseFromJs(template: string): Promise<TemplateFunction> {
  const module = await import(template);
  return module.default;
}
