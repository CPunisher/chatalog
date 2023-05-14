import { ConvMessage } from "../../chatalog/interface/commons";
import { SouffleData } from "../../chatalog/interface/souffle";
import { StringTransData } from "../../chatalog/interface/string-trans";

export interface RequestConversation {
  messages: ConvMessage[];
}

export interface ResponseConversation {
  messages: ConvMessage[];
}

export interface RequestValidateSouffle {
  code: string;
  data: SouffleData;
}

export interface RequestValidateStringTrans {
  code: string;
  caller: string;
  data: StringTransData;
}

export interface ResponseValidate<Result> {
  result: Result;
}
