"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const emailService_1 = require("./emailService");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(body_parser_1.default.json());
app.post('/getDocuments', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, host, port } = req.body;
    if (!email || !password || !host || !port) {
        console.log('Missing required fields:', req.body);
        return res.status(400).send({ error: 'Missing required fields' });
    }
    const emailService = new emailService_1.EmailService({ email, password, host, port });
    try {
        console.log('Received request:', req.body);
        const processedFiles = yield emailService.processEmails();
        console.log('Processed files:', processedFiles);
        return res.status(200).send(processedFiles);
    }
    catch (error) {
        console.error('Error processing emails:', error);
        return res.status(500).send({ error: 'Error processing emails' });
    }
}));
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
