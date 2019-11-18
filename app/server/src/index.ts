import { default as express } from 'express';
import { default as process } from 'process';
import { default as path } from 'path';

const app = express();

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
