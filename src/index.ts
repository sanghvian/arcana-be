// src/index.ts
import { createApp } from './app';
import { connectDb } from './db';
import stockRoutes from './routes/stock.routes';


const PORT = process.env.PORT || 3000;
(async () => {
    await connectDb();

    // ...initialize and start your Express app here...
    const app = createApp();

    app.use('/stocks', stockRoutes);

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})();
