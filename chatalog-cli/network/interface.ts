import { ConvMessage } from "../interface/commons";

export interface RequestConversation {
  messages: ConvMessage[];
}

export interface ResponseConversation {
  messages: ConvMessage[];
}
