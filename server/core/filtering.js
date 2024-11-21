import { getMonumentFromAlias } from './objects.js';

export function parseFilterString(filterString) {
    filterString = filterString.toLowerCase();
    const filters = [];
    let i = 0;
    while (i < filterString.length) {
        let type = '';
        let params = [];

        while (i < filterString.length && filterString[i] !== '(') {
            type += filterString[i];
            i++;
        }
        i++;

        let param = '';
        while (i < filterString.length && filterString[i] !== ')') {
            if (filterString[i] === ',') {
                if (param.trim()) {
                    params.push(param.trim());
                    param = '';
                }
            } else {
                param += filterString[i];
            }
            i++;
        }

        if (param.trim()) {
            params.push(param.trim());
        }
        i++;

        filters.push({
            type: type.trim(),
            params: params
        });

        while (i < filterString.length && (filterString[i] === ' ' || filterString[i] === ',')) {
            i++;
        }
    }

    return filters;
}

export function applyCluster(servers, params) {
    return servers.filter(server => {

        const monuments = [];
        let radius = 1000;
        let direction = null;

        params.forEach(element => {
            if (/^\d+$/.test(element)) {
                radius = parseInt(element, 10);
            } else if (['north', 'south', 'east', 'west'].includes(element.toLowerCase())) {
                direction = element.toLowerCase();
            } else {
                const monument = getMonumentFromAlias(element)

                monuments.push(monument);
            }
        });

        if (monuments.length === 0) {
            return false;
        }

        const monumentCoordinates = server.map.monumentList
            .filter(monument => monuments.includes(monument.name))
            .map(monument => ({ x: monument.x, y: monument.y }));

        if (monumentCoordinates.length === 0 || monumentCoordinates.length !== monuments.length) {
            return false;
        }

        const monumentCentroid = calculateCentroid(monumentCoordinates);

        if (direction === 'north' && monumentCentroid.y < 0) {
            return false;
        } else if (direction === 'south' && monumentCentroid.y > 0) {
            return false;
        } else if (direction === 'east' && monumentCentroid.x < 0) {
            return false;
        } else if (direction === 'west' && monumentCentroid.x > 0) {
            return false;
        }

        return monumentCoordinates.every(coord => {
            const distance = Math.sqrt(
                Math.pow(coord.x - monumentCentroid.x, 2) +
                Math.pow(coord.y - monumentCentroid.y, 2)
            );
            return distance <= radius;
        });
    });
}

export function applyAbsolute(servers, params) {
    return servers.filter(server => {
        const monuments = [];
        let direction = null;

        for (const element of params) {
            if (['north', 'south', 'east', 'west'].includes(element.toLowerCase())) {
                direction = element.toLowerCase();
            } else {
                const monumentName = getMonumentFromAlias(element);
                const monument = server.map.monumentList.find(m => m.name === monumentName);
                if (!monument) {
                    return false;
                }
                monuments.push(monument);
            }
        }

        if (monuments.length === 0) {
            return false;
        }

        return monuments.every(monument => {
            if (direction === 'north') {
                return monument.y >= 0;
            } else if (direction === 'south') {
                return monument.y <= 0;
            } else if (direction === 'east') {
                return monument.x >= 0;
            } else if (direction === 'west') {
                return monument.x <= 0;
            }
            return true;
        });
    });
}

export function applyDirectionalRelationship(servers, params) {
    return servers.filter(server => {
        const directionIndex = params.findIndex(element =>
            ['north', 'south', 'east', 'west'].includes(element.toLowerCase())
        );

        if (directionIndex === -1) {
            return false; // No valid direction found
        }

        const direction = params[directionIndex].toLowerCase();
        const beforeDirection = params.slice(0, directionIndex);
        const afterDirection = params.slice(directionIndex + 1);

        if (beforeDirection.length === 0 || afterDirection.length === 0) {
            return false;
        }

        const getMonument = name => server.map.monumentList.find(m => m.name === getMonumentFromAlias(name));

        const beforeMonuments = beforeDirection.map(getMonument);
        const afterMonuments = afterDirection.map(getMonument);

        if (beforeMonuments.includes(undefined) || afterMonuments.includes(undefined)) {
            return false; // One or more monuments not found
        }

        return beforeMonuments.every(before =>
            afterMonuments.every(after => {
                if (direction === 'north') {
                    return before.y > after.y;
                } else if (direction === 'south') {
                    return before.y < after.y;
                } else if (direction === 'east') {
                    return before.x > after.x;
                } else if (direction === 'west') {
                    return before.x < after.x;
                }
                return true;
            })
        );
    });
}

function calculateCentroid(points) {
    const numPoints = points.length;
    const sum = points.reduce((acc, point) => {
        acc.x += point.x;
        acc.y += point.y;
        return acc;
    }, { x: 0, y: 0 });

    return {
        x: sum.x / numPoints,
        y: sum.y / numPoints
    };
}
