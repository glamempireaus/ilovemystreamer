import { fetchServersFromBattlemetricsAndRustMaps as fetchServersFromBattlemetricsAndRustMaps } from './web.js';
import { loadServers } from './objects.js';
import { applyAbsolute, applyCluster, applyDirectionalRelationship, parseFilterString } from './filtering.js';
import { promises as fs } from 'fs';

export async function refreshServers() {
    await fetchServersFromBattlemetricsAndRustMaps();
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

