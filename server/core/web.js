import fetch from 'node-fetch';
import { promises as fs } from 'fs';
import { JSDOM } from 'jsdom';
import { Server, Player, Streamer, Map, Monument, getMonumentFromAlias } from './objects.js';

const BATTLEMETRICS_SERVER_API_URL = 'https://api.battlemetrics.com/servers';
// const BATTLEMETRICS_PLAYER_API_URL = 'https://api.battlemetrics.com/players';

export async function fetchServersFromBattlemetricsAndRustMaps() {

    let battlemetricsServers = {
        data: [],
        links: {}
    };

    try {
        const url = new URL(BATTLEMETRICS_SERVER_API_URL);
        url.searchParams.append('sort', '-players');
        url.searchParams.append('page[size]', '100');
        url.searchParams.append('filter[game]', 'rust');
        url.searchParams.append('filter[players][min]', '1');

        for (let i = 0; i < 5; i++) {
            const response = await fetch(url.toString());
            const data = await response.json();
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Append fetched data to the battlemetricsServers data array
            battlemetricsServers.data.push(...data.data); // Assuming 'data' is the array holding servers
            console.log('Page', i + 1, 'fetched successfully.');

            // Check if there is a next page link and if so, update the URL
            if (data.links && data.links.next) {
                url.href = data.links.next;
            } else {
                break; // Exit the loop if no more pages are available
            }
        }
    } catch (error) {
        console.error('Error getting servers:', error);
        return 1; // Return 1 to signify failure in the fetching process
    }

    console.log('fetched 5 pages of battlemetrics.');

    await fs.writeFile('data/battlemetrics_servers.json', JSON.stringify(battlemetricsServers, null, 2));

    // for each server, get their map
    const serverPromises = battlemetricsServers.data.map(async serverData => {
        // check for valid map url
        if (serverData.attributes.details.rust_maps === undefined) {
            return null;
        }

        let map = new Map()
        map.url = serverData.attributes.details.rust_maps.url

        let rustmapsInText = null;
        try {
            const response = await fetch(map.url);

            rustmapsInText = await response.text();
            console.log(rustmapsInText);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            console.log('Map has been fetched successfully.');
        } catch (error) {
            console.error('Error getting rustmap html file.');
            return null;
        }

        let rustmapsInHTML = null
        try {
            const dom = new JSDOM(rustmapsInText);
            rustmapsInHTML = dom.window.document;
            if (!rustmapsInHTML) {
                console.log('Error parsing to HTML.');
                return null;
            }
        } catch (error) {
            console.error('Error parsing to HTML:', error);
            return null;
        }

        // Get map size
        const mapSizeMetatag = rustmapsInHTML.querySelectorAll('meta[property^="og:title"]');
        if (mapSizeMetatag.length === 0) {
            console.log('Error finding meta tag in html.');
            return null;
        }
        mapSizeMetatag.forEach(metaTag => {
            const content = metaTag.getAttribute('content');
            const lastColonIndex = content.lastIndexOf(':');

            if (lastColonIndex !== -1 && lastColonIndex < content.length - 1) {
                let numericString = content.substring(lastColonIndex + 1);
                numericString = numericString.replace(/\D/g, '');

                if (numericString) {
                    map.size = parseInt(numericString, 10);
                }
            }
        });

        // Get monuments
        let monumentsHTML = null;
        const scripts = rustmapsInHTML.getElementsByTagName('script');
        for (let script of scripts) {
            const scriptContent = script.textContent;
            const pattern = /window\.pageData = (\{.*?\});/s;
            const match = scriptContent.match(pattern);

            if (match) {
                monumentsHTML = match[1];
                break;
            }
        }

        let monumentsJSON;
        try {
            monumentsJSON = JSON.parse(monumentsHTML);
        } catch (error) {
            console.error("Cannot read JSON response properly");
            return null;
        }

        map.monumentList = [];
        const dataNode = monumentsJSON?.data?.monuments;
        if (Array.isArray(dataNode)) {
            dataNode.forEach(subNode => {
                const monument = new Monument();
                monument.name = getMonumentFromAlias(subNode.type);
                if (monument.name != "NONE") {
                    monument.x = subNode.coordinates.x;
                    monument.y = subNode.coordinates.y;
                    map.monumentList.push(monument);
                }
            });
        }

        const attributes = serverData.attributes;
        return new Server(
            serverData.attributes.name,
            serverData.attributes.ip,
            map,
            serverData.attributes.players,
            null, // fix later
            serverData.attributes.country,
            30, // fix later
            serverData.attributes.details.rust_last_wipe
        );
    });

    const servers = (await Promise.all(serverPromises)).filter(server => server !== null);

    console.log(JSON.stringify(servers, null, 2))

    await fs.writeFile('data/serverlist.json', JSON.stringify(servers, null, 2));
}

export async function retrieveMapFromRustMaps() {
    return;
}


export function removeNullFields(obj) {
    if (Array.isArray(obj)) {
        return obj
            .map(removeNullFields)
            .filter(item => item !== null);
    } else if (typeof obj === 'object' && obj !== null) {
        return Object.fromEntries(
            Object.entries(obj)
                .filter(([_, value]) => value !== null)
                .map(([key, value]) => [key, removeNullFields(value)])
        );
    }
    return obj;
}