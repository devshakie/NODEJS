import { getXataClient } from "./xata";
import app from './index';

const port: number = 3000;
const xataClient = getXataClient();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

