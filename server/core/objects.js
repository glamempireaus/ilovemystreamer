import { promises as fs } from 'fs';

export class Server {
    constructor(name, ip, map, playerCount, playerList, country, ping, wipeDate) {
        this.name = name;
        this.ip = ip;
        this.map = map;
        this.playerCount = playerCount;
        this.playerList = playerList;
        this.country = country;
        this.ping = ping;
        this.wipeDate = wipeDate;
    }
}

export class Player {
    constructor(name, timePlayed) {
        this.name = name;
        this.timePlayed = timePlayed;
    }
}

export class Streamer {
    constructor(playerList) {
        this.playerList = playerList;
    }
}

export class Map {
    constructor(size, url, monumentList) {
        this.size = size;
        this.url = url;
        this.monumentList = monumentList;
    }
}

export class Monument {
    constructor(name, x, y, biomeList) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.biomeList = biomeList;
    }
}

export async function loadServers() {
    const data = await fs.readFile('data/serverlist.json', 'utf-8');
    const serverData = JSON.parse(data);

    const servers = serverData.map(server => {
        // const playerList = server.playerList.map(player =>
        //     new Player(player.name, player.timePlayed)
        // );

        const monumentList = server.map.monumentList
            .filter(monument => monument !== null && monument !== undefined)
            .map(monument =>
                new Monument(
                    monument.name,
                    monument.x,
                    monument.y,
                    monument.biomeList
                )
            );

        const map = new Map(
            server.map.size,
            server.map.url,
            monumentList
        );

        return new Server(
            server.name,
            server.ip,
            map,
            server.playerCount,
            null,
            server.country,
            server.ping,
            server.wipeDate
        );
    });

    return servers;
}

export const MonumentEnum = {
    NONE: 'NONE',
    ARCTIC_RESEARCH_BASE: 'ARCTIC_RESEARCH_BASE',
    AIRFIELD: 'AIRFIELD',
    LARGE_BARN: 'LARGE_BARN',
    BANDIT_CAMP: 'BANDIT_CAMP',
    CAVE: 'CAVE',
    THE_DOME: 'THE_DOME',
    EXCAVATOR: 'EXCAVATOR',
    FISHING_VILLAGE: 'FISHING_VILLAGE',
    GAS_STATION: 'GAS_STATION',
    HARBOR: 'HARBOR',
    ICE_LAKE: 'ICE_LAKE',
    JUNKYARD: 'JUNKYARD',
    LIGHTHOUSE: 'LIGHTHOUSE',
    LAUNCH_SITE: 'LAUNCH_SITE',
    MILITARY_BASE: 'MILITARY_BASE',
    MILITARY_TUNNELS: 'MILITARY_TUNNELS',
    MINING_OUTPOST: 'MINING_OUTPOST',
    SMALL_OIL_RIG: 'SMALL_OIL_RIG',
    LARGE_OIL_RIG: 'LARGE_OIL_RIG',
    OIL_RIG: 'OIL_RIG',
    NUCLEAR_MISSILE_SILO: 'NUCLEAR_MISSILE_SILO',
    POWER_PLANT: 'POWER_PLANT',
    SUB_STATION: 'SUB_STATION',
    RANCH: 'RANCH',
    SATELLITE_DISH: 'SATELLITE_DISH',
    SCIENTIST_COMPOUND: 'SCIENTIST_COMPOUND',
    SEWER_BRANCH: 'SEWER_BRANCH',
    SUPERMARKET: 'SUPERMARKET',
    TRAIN_YARD: 'TRAIN_YARD',
    TUNNEL_ENTRANCE: 'TUNNEL_ENTRANCE',
    UNDERWATER_LAB: 'UNDERWATER_LAB',
    WATER_TREATMENT_PLANT: 'WATER_TREATMENT_PLANT',
    QUARRY: 'QUARRY',
    ICEBERG: 'ICEBERG',
    POWERLINE: 'POWERLINE',
    FERRY_TERMINAL: 'FERRY_TERMINAL',
    SWAMP: 'SWAMP',
};

export const monumentEnumAliasMap = new globalThis.Map([
    ['airfield', MonumentEnum.AIRFIELD],
    ['airport', MonumentEnum.AIRFIELD],
    ['airstrip', MonumentEnum.AIRFIELD],
    ['bandit town', MonumentEnum.BANDIT_CAMP],
    ['bandit camp', MonumentEnum.BANDIT_CAMP],
    ['banditcamp', MonumentEnum.BANDIT_CAMP],
    ['bandit', MonumentEnum.BANDIT_CAMP],
    ['large barn', MonumentEnum.LARGE_BARN],
    ['largebarn', MonumentEnum.LARGE_BARN],
    ['stable', MonumentEnum.LARGE_BARN],
    ['barn', MonumentEnum.LARGE_BARN],
    ['ferry', MonumentEnum.FERRY_TERMINAL],
    ['ferry terminal', MonumentEnum.FERRY_TERMINAL],
    ['sphere tank', MonumentEnum.THE_DOME],
    ['the dome', MonumentEnum.THE_DOME],
    ['dome', MonumentEnum.THE_DOME],
    ['gas station', MonumentEnum.GAS_STATION],
    ['gasstation', MonumentEnum.GAS_STATION],
    ['gas', MonumentEnum.GAS_STATION],
    ['oxums gas station', MonumentEnum.GAS_STATION],
    ['oxums gas', MonumentEnum.GAS_STATION],
    ['oxums', MonumentEnum.GAS_STATION],
    ['oxum', MonumentEnum.GAS_STATION],
    ['petrol', MonumentEnum.GAS_STATION],
    ['petrol station', MonumentEnum.GAS_STATION],
    ['large harbor', MonumentEnum.HARBOR],
    ['harbor', MonumentEnum.HARBOR],
    ['large harbour', MonumentEnum.HARBOR],
    ['harbour', MonumentEnum.HARBOR],
    ['small harbor', MonumentEnum.HARBOR],
    ['small harbour', MonumentEnum.HARBOR],
    ['hqm quarry', MonumentEnum.QUARRY],
    ['stone quarry', MonumentEnum.QUARRY],
    ['sulfur quarry', MonumentEnum.QUARRY],
    ['quarry', MonumentEnum.QUARRY],
    ['fishing village a', MonumentEnum.FISHING_VILLAGE],
    ['fishing village b', MonumentEnum.FISHING_VILLAGE],
    ['fishing village c', MonumentEnum.FISHING_VILLAGE],
    ['fishing village', MonumentEnum.FISHING_VILLAGE],
    ['fishingvillage', MonumentEnum.FISHING_VILLAGE],
    ['fishing vill', MonumentEnum.FISHING_VILLAGE],
    ['fishingvill', MonumentEnum.FISHING_VILLAGE],
    ['fishing', MonumentEnum.FISHING_VILLAGE],
    ['excavator', MonumentEnum.EXCAVATOR],
    ['excav', MonumentEnum.EXCAVATOR],
    ['junkyard', MonumentEnum.JUNKYARD],
    ['junk yard', MonumentEnum.JUNKYARD],
    ['lighthouse', MonumentEnum.LIGHTHOUSE],
    ['light house', MonumentEnum.LIGHTHOUSE],
    ['launch site', MonumentEnum.LAUNCH_SITE],
    ['launchsite', MonumentEnum.LAUNCH_SITE],
    ['launch', MonumentEnum.LAUNCH_SITE],
    ['nuclear missile silo', MonumentEnum.NUCLEAR_MISSILE_SILO],
    ['nuclear missile', MonumentEnum.NUCLEAR_MISSILE_SILO],
    ['missile silo', MonumentEnum.NUCLEAR_MISSILE_SILO],
    ['missile', MonumentEnum.NUCLEAR_MISSILE_SILO],
    ['silo', MonumentEnum.NUCLEAR_MISSILE_SILO],
    ['nuke', MonumentEnum.NUCLEAR_MISSILE_SILO],
    ['military base d', MonumentEnum.MILITARY_BASE],
    ['military base', MonumentEnum.MILITARY_BASE],
    ['mil base', MonumentEnum.MILITARY_BASE],
    ['milbase', MonumentEnum.MILITARY_BASE],
    ['military tunnels', MonumentEnum.MILITARY_TUNNELS],
    ['military tunnel', MonumentEnum.MILITARY_TUNNELS],
    ['mil tunnel', MonumentEnum.MILITARY_TUNNELS],
    ['mil tunnels', MonumentEnum.MILITARY_TUNNELS],
    ['mil tuns', MonumentEnum.MILITARY_TUNNELS],
    ['miltuns', MonumentEnum.MILITARY_TUNNELS],
    ['tunnel entrance', MonumentEnum.TUNNEL_ENTRANCE],
    ['arctic research base a', MonumentEnum.ARCTIC_RESEARCH_BASE],
    ['arctic research base', MonumentEnum.ARCTIC_RESEARCH_BASE],
    ['arctic research', MonumentEnum.ARCTIC_RESEARCH_BASE],
    ['arctic', MonumentEnum.ARCTIC_RESEARCH_BASE],
    ['warehouse', MonumentEnum.MINING_OUTPOST],
    ['mining outpost', MonumentEnum.MINING_OUTPOST],
    ['powerline a', MonumentEnum.POWERLINE],
    ['powerline b', MonumentEnum.POWERLINE],
    ['powerline c', MonumentEnum.POWERLINE],
    ['powerline d', MonumentEnum.POWERLINE],
    ['powerline', MonumentEnum.POWERLINE],
    ['power line', MonumentEnum.POWERLINE],
    ['compound', MonumentEnum.SCIENTIST_COMPOUND],
    ['outpost', MonumentEnum.SCIENTIST_COMPOUND],
    ['safe zone', MonumentEnum.SCIENTIST_COMPOUND],
    ['safezone', MonumentEnum.SCIENTIST_COMPOUND],
    ['large oilrig', MonumentEnum.LARGE_OIL_RIG],
    ['large oil', MonumentEnum.LARGE_OIL_RIG],
    ['oil', MonumentEnum.LARGE_OIL_RIG],
    ['oilrig', MonumentEnum.LARGE_OIL_RIG],
    ['oil rig', MonumentEnum.LARGE_OIL_RIG],
    ['small oilrig', MonumentEnum.SMALL_OIL_RIG],
    ['small oil rig', MonumentEnum.SMALL_OIL_RIG],
    ['small oil', MonumentEnum.SMALL_OIL_RIG],
    ['smoil', MonumentEnum.SMALL_OIL_RIG],
    ['smoilrig', MonumentEnum.SMALL_OIL_RIG],
    ['powerplant', MonumentEnum.POWER_PLANT],
    ['power plant', MonumentEnum.POWER_PLANT],
    ['substation', MonumentEnum.SUB_STATION],
    ['power substation big 1', MonumentEnum.SUB_STATION],
    ['power substation big 2', MonumentEnum.SUB_STATION],
    ['power substation small 1', MonumentEnum.SUB_STATION],
    ['power substation small 2', MonumentEnum.SUB_STATION],
    ['ranch', MonumentEnum.RANCH],
    ['satellite dish', MonumentEnum.SATELLITE_DISH],
    ['satellite', MonumentEnum.SATELLITE_DISH],
    ['satelite', MonumentEnum.SATELLITE_DISH],
    ['sat', MonumentEnum.SATELLITE_DISH],
    ['sewer branch', MonumentEnum.SEWER_BRANCH],
    ['sewers', MonumentEnum.SEWER_BRANCH],
    ['sewer', MonumentEnum.SEWER_BRANCH],
    ['supermarket', MonumentEnum.SUPERMARKET],
    ['super market', MonumentEnum.SUPERMARKET],
    ['spermket', MonumentEnum.SUPERMARKET],
    ['trainyard', MonumentEnum.TRAIN_YARD],
    ['train yard', MonumentEnum.TRAIN_YARD],
    ['train', MonumentEnum.TRAIN_YARD],
    ['underwater lab c', MonumentEnum.UNDERWATER_LAB],
    ['underwater lab', MonumentEnum.UNDERWATER_LAB],
    ['underwater', MonumentEnum.UNDERWATER_LAB],
    ['water treatment', MonumentEnum.WATER_TREATMENT_PLANT],
    ['water treatment plant', MonumentEnum.WATER_TREATMENT_PLANT],
    ['watertreatment', MonumentEnum.WATER_TREATMENT_PLANT],
    ['water', MonumentEnum.WATER_TREATMENT_PLANT],
    ['iceberg', MonumentEnum.ICEBERG],
    ['iceberg 1', MonumentEnum.ICEBERG],
    ['iceberg 2', MonumentEnum.ICEBERG],
    ['iceberg 3', MonumentEnum.ICEBERG],
    ['iceberg 4', MonumentEnum.ICEBERG],
]);

export function getMonumentFromAlias(alias) {
    const cleanedAlias = alias.trim().toLowerCase();
    return monumentEnumAliasMap.get(cleanedAlias) || MonumentEnum.NONE;
}

export const DirectionEnum = Object.freeze({
    NONE: 0,
    NORTH: 1,
    SOUTH: 2,
    EAST: 3,
    WEST: 4
});