import { Module } from "../../interface/commons";

export type TemplateFunction<T> = (args: T) => string;

export type TemplateType = "souffle" | "string-trans";

export interface TemplateOptions {
  type: TemplateType;
  template: string;
  outDir: string;
}

export interface DerivedTemplateOptios<D = {}> {
  templateFn: TemplateFunction<Module<D>>;
  outDir: string;
}

export type TemplateAction<D> = (
  targets: string[],
  options: DerivedTemplateOptios<D>
) => void;
