"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const Imap = __importStar(require("imap-simple"));
class EmailService {
    constructor(credentials) {
        this.credentials = credentials;
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
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Connecting to IMAP server...');
                const connection = yield Imap.connect(this.config);
                console.log('Connected to IMAP server.');
                return connection;
            }
            catch (error) {
                console.error('Error connecting to IMAP server:', error);
                throw error;
            }
        });
    }
    fetchUnreadEmails(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Opening INBOX...');
                yield connection.openBox('INBOX');
                const searchCriteria = ['UNSEEN'];
                const fetchOptions = { bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'], struct: true };
                console.log('Searching for unread emails...');
                const messages = yield connection.search(searchCriteria, fetchOptions);
                console.log(`Found ${messages.length} unread emails.`);
                return messages;
            }
            catch (error) {
                console.error('Error fetching unread emails:', error);
                throw error;
            }
        });
    }
    processEmails() {
        return __awaiter(this, void 0, void 0, function* () {
            let connection;
            try {
                connection = yield this.connect();
                const messages = yield this.fetchUnreadEmails(connection);
                const processedFiles = [];
                for (const message of messages) {
                    const parts = Imap.getParts(message.attributes.struct);
                    for (const part of parts) {
                        if (part.disposition && part.disposition.type.toUpperCase() === 'ATTACHMENT') {
                            if (part.disposition.params.filename.endsWith('.xml')) {
                                console.log(`Processing attachment: ${part.disposition.params.filename}`);
                                const content = yield connection.getPartData(message, part);
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
                console.log('Processed emails successfully.');
                return processedFiles;
            }
            catch (error) {
                console.error('Error processing emails:', error);
                throw error;
            }
            finally {
                if (connection) {
                    yield connection.end();
                    console.log('Closed connection to IMAP server.');
                }
            }
        });
    }
}
exports.EmailService = EmailService;
