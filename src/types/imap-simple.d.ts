declare module 'imap-simple' {
  import { Config } from 'imap';

  export function connect(config: Config): Promise<any>;
  export function getParts(struct: any): any[];

  export interface SearchCriteria {
    [key: string]: any;
  }

  export interface FetchOptions {
    bodies: string[];
    struct: boolean;
  }

  export interface Message {
    parts: any[];
    attributes: {
      struct: any;
    };
  }
}
