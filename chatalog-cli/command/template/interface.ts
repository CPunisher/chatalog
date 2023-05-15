import { Module, ModuleType } from "../../../chatalog/interface/commons";

export type TemplateFunction<T> = (args: T) => string;

export interface TemplateOptions {
  type: ModuleType;
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
