/* eslint-disable no-unused-vars */
export interface RouteMeta {
  title: string;
}

export interface WSResponse {
  status: string,
  message: string
}

export type Callback = (response: WSResponse) => void;

export interface WSJoin {
  message: string;
  version: string;
}
export interface WSCommand {
  command: string;
  data: never;
}
