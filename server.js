import express from 'express';
import routeController from './routes';

const app = express();

app.use(express.json());

routeController(app);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default app;
