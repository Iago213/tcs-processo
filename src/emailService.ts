import * as Imap from 'imap-simple';

//O que mandar na requisão
interface EmailCredentials {
  email: string;
  password: string;
  host: string;
  port: number;
}
//O que receber na request
interface ProcessedFile {
  date: Date;
  filename: string;
  contentFile: string;
}

export class EmailService {
  private config: any;

  constructor(private credentials: EmailCredentials) {
    this.config = {
      imap: {
        user: credentials.email,
        password: credentials.password,
        host: credentials.host,
        port: credentials.port,
        tls: true,
        authTimeout: 3000
      }
    };
  }
  //Conectando ao e-mail
  public async connect() {
    try {
      console.log('Connecting to IMAP server...');
      const connection = await Imap.connect(this.config);
      console.log('Connected to IMAP server.');
      return connection;
    } catch (error) {
      console.error('Error connecting to IMAP server:', error);
      throw error;
    }
  }

  //Função para verficiar emails nao lidos
  public async fetchUnreadEmails(connection: any) {
    try {
      console.log('Abrindo caixa de entrada...');
      await connection.openBox('INBOX');
      const searchCriteria = ['UNSEEN'];
      const fetchOptions = { bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'], struct: true };
      console.log('Buscando e-mails não lidos...');
      const messages = await connection.search(searchCriteria, fetchOptions);
      console.log(`Encontramos ${messages.length} e-mails que não foram lidos.`);
      return messages;
    } catch (error) {
      console.error('Error fetching unread emails:', error);
      throw error;
    }
  }

  //Função para processar Emails
  public async processEmails() {
    let connection;
    try {
      connection = await this.connect();
      const messages = await this.fetchUnreadEmails(connection);
      const processedFiles: ProcessedFile[] = [];

      for (const message of messages) {
        const parts = Imap.getParts(message.attributes.struct);
        for (const part of parts) {
          if (part.disposition && part.disposition.type.toUpperCase() === 'ATTACHMENT') {
            if (part.disposition.params.filename.endsWith('.xml')) {
              console.log(`Processing attachment: ${part.disposition.params.filename}`);
              const content = await connection.getPartData(message, part);
              const contentFile = content.toString('utf8');
              const filename = part.disposition.params.filename;

              processedFiles.push({
                date: new Date(),
                filename: filename,
                contentFile: contentFile
              });
            }
          }
        }
      }

      console.log('Emails processados com sucesso!.');
      return processedFiles;
    } catch (error) {
      console.error('Houve um erro ao processar os emails:', error);
      throw error;
    } finally {
      if (connection) {
        await connection.end();
        console.log('Closed connection to IMAP server.');
      }
    }
  }
}
