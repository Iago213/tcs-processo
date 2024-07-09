import express from 'express';
import bodyParser from 'body-parser';
import { EmailService } from './emailService';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/getDocuments', async (req, res) => {
  const { email, password, host, port } = req.body;

  if (!email || !password || !host || !port) {
    console.log('Campos obrigatórios não preenchidos:', req.body);
    return res.status(400).send({ error: 'Campos obrigatórios não preenchidos' });
  }

  const emailService = new EmailService({ email, password, host, port });

  try {
    console.log(':', req.body);
    const processedFiles = await emailService.processEmails();
    console.log('Arquivos Procesados:', processedFiles);
    return res.status(200).send(processedFiles);
  } catch (error) {
    console.error('Erro ao processar e-mails:', error);
    return res.status(500).send({ error: 'Erro ao processar e-mails' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`);
});
