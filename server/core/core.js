import { fetchServersFromBattlemetricsAndRustMaps as fetchServersFromBattlemetricsAndRustMaps, getLastRefreshTime, setLastRefreshTime, REFRESH_INTERVAL_HOURS } from './web.js';
import { loadServers } from './objects.js';
import { applyAbsolute, applyCluster, applyDirectionalRelationship, parseFilterString } from './filtering.js';

export async function refreshServers() {

    try {
        const lastRefresh = await getLastRefreshTime();
        const now = Date.now();

        if (lastRefresh) {
            const hoursSinceLastRefresh = (now - lastRefresh) / (1000 * 60 * 60);
            if (hoursSinceLastRefresh < REFRESH_INTERVAL_HOURS) {
                const remainingTime = REFRESH_INTERVAL_HOURS - hoursSinceLastRefresh;
                return {
                    success: false,
                    message: `Refresh allowed only once every ${REFRESH_INTERVAL_HOURS} hours. Try again in ${remainingTime.toFixed(
                        2
                    )} hours.`,
                };
            }
        }

        await setLastRefreshTime();
        await fetchServersFromBattlemetricsAndRustMaps();

        return {
            success: true,
            message: 'Servers refreshed successfully.',
        };
    } catch (error) {
        console.error('Error in refreshServers:', error);
        return {
            success: false,
            message: 'An error occurred while refreshing servers.',
        };
    }
}

export async function getFilteredServers(filter) {

    const filterList = parseFilterString(filter);
    let servers = await loadServers();

    filterList.forEach(filter => {
        const { type, params } = filter;

        if (type === 'cluster') {
            servers = applyCluster(servers, params);
        } else if (type === 'absolute') {
            servers = applyAbsolute(servers, params);
        } else if (type === 'relational') {
            servers = applyDirectionalRelationship(servers, params);
        }
    });

    return servers;
}

