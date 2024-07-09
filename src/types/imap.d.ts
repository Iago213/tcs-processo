declare module 'imap' {
  export interface Config {
    user: string;
    password: string;
    host: string;
    port: number;
    tls: boolean;
    authTimeout?: number;
  }

  export interface ImapMessageAttributes {
    struct: any;
  }

  export interface ImapMessage {
    attributes: ImapMessageAttributes;
  }

  export interface ImapFetchOptions {
    bodies: string[];
    struct: boolean;
  }

  export interface ImapConnection {
    openBox(boxName: string, callback: (error: Error | null, box: any) => void): void;
    search(criteria: string[], callback: (error: Error | null, results: number[]) => void): void;
    fetch(
      source: number[],
      options: ImapFetchOptions
    ): NodeJS.EventEmitter;
    end(): void;
  }

  export function connect(config: Config): Promise<ImapConnection>;
}
