import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Halo, Dunia!');
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
