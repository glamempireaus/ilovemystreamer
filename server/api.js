import express from 'express';
import { getFilteredServers, refreshServers } from './core/core.js'

const router = express.Router();

router.get('/filter', async (req, res) => {
    const input = req.query.filter;

    try {
        const servers = await getFilteredServers(input);

        return res.status(200).json({
            error: false,
            message: 'Filtered servers returned.',
            data: servers
        });
    } catch (error) {
        return res.status(400).json({
            error: true,
            message: 'Error processing filter string.',
            details: error.message
        });
    }
});

router.get('/refreshdata', async (req, res) => {
    try {
        const result = await refreshServers();

        if (result.success) {
            return res.status(200).json({
                error: false,
                message: result.message,
            });
        } else {
            return res.status(429).json({
                error: true,
                message: result.message,
            });
        }
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: 'Error refreshing data.',
            details: error.message,
        });
    }
});

export default router;