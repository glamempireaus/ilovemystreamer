import express from 'express';
import cors from 'cors';
import { refreshServers, getFilteredServers } from './core/core.js';
import apiRoutes from './api.js';

const app = express();
const PORT = 3000;

app.use(cors({ origin: '*' })); // Allow requests from any origin
app.use(express.json());
app.use('/api', apiRoutes);

async function startServer() {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

    setInterval(() => {
        try {
            refreshServers();
        } catch (error) {
            console.error('Error refreshing servers:', error);
        }
    }, 7200000);

    //await refreshServers();
    //await getFilteredServers('cluster(airfield, outpost, water treatment, east, 800), relational(small oil, south, airfield)');
}

await startServer();