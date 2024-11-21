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
        if (server.map.url == 'https://rustmaps.com/map/4500_672626517') {
            let test = 3;
            test = test + 1;
        }

        const monuments = [];
        let radius = 1000;
        let direction = null;

        params.forEach(element => {
            if (/^\d+$/.test(element)) {
                radius = parseInt(element, 10);
            } else if (['north', 'south', 'east', 'west'].includes(element.toLowerCase())) {
                direction = element.toLowerCase();
            } else {
                const monument = getMonumentFromAlias(element);
                monuments.push(monument);
            }
        });

        if (monuments.length === 0) {
            return false;
        }

        if (!server.map || !Array.isArray(server.map.monumentList)) {
            return false;
        }

        // Filter only the monuments we care about
        const relevantMonuments = server.map.monumentList
            .filter(monument => monuments.includes(monument.name))
            .map(monument => ({ name: monument.name, x: monument.x, y: monument.y }));

        if (relevantMonuments.length === 0) {
            return false;
        }

        // Generate all possible clusters
        const possibleClusters = generateClusters(relevantMonuments, monuments);

        // Check each cluster
        const hasValidCluster = possibleClusters.some(cluster => {
            const centroid = calculateCentroid(cluster);

            // Validate that all monuments in the cluster are within the radius of the centroid
            return cluster.every(coord => {
                const distanceFromCentroid = Math.sqrt(
                    Math.pow(coord.x - centroid.x, 2) + Math.pow(coord.y - centroid.y, 2)
                );
                return distanceFromCentroid <= radius;
            });
        });

        if (!hasValidCluster) {
            return false;
        }

        if (direction) {
            const monumentCentroid = calculateCentroid(relevantMonuments);
            if (direction === 'north' && monumentCentroid.y < 0) {
                return false;
            } else if (direction === 'south' && monumentCentroid.y > 0) {
                return false;
            } else if (direction === 'east' && monumentCentroid.x < 0) {
                return false;
            } else if (direction === 'west' && monumentCentroid.x > 0) {
                return false;
            }
        }

        return true;
    });
}

// Helper function to generate all possible clusters
function generateClusters(relevantMonuments, requiredMonuments) {
    const clusters = [];

    // Group monuments by name
    const groupedByType = requiredMonuments.map(name =>
        relevantMonuments.filter(monument => monument.name === name)
    );

    // Generate all combinations of clusters
    const generateCombinations = (grouped, currentCluster = [], depth = 0) => {
        if (depth === grouped.length) {
            clusters.push(currentCluster);
            return;
        }

        grouped[depth].forEach(monument => {
            generateCombinations(grouped, [...currentCluster, monument], depth + 1);
        });
    };

    generateCombinations(groupedByType);

    return clusters;
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
        // Extract radius if it exists
        let radius = null;
        const filteredParams = params.filter(element => {
            if (/^\d+$/.test(element)) {
                radius = parseInt(element, 10); // Extract radius
                return false; // Exclude radius from filtered params
            }
            return true;
        });

        // Find index of the direction keyword
        const directionIndex = filteredParams.findIndex(element =>
            ['north', 'south', 'east', 'west'].includes(element.toLowerCase())
        );

        if (directionIndex === -1) {
            return false; // No valid direction found
        }

        const direction = filteredParams[directionIndex].toLowerCase();
        const beforeDirection = filteredParams.slice(0, directionIndex);
        const afterDirection = filteredParams.slice(directionIndex + 1);

        if (beforeDirection.length === 0 || afterDirection.length === 0) {
            return false; // Ensure there are monuments both before and after the direction
        }

        const getMonument = name => server.map.monumentList.find(m => m.name === getMonumentFromAlias(name));

        const beforeMonuments = beforeDirection.map(getMonument);
        const afterMonuments = afterDirection.map(getMonument);

        if (beforeMonuments.includes(undefined) || afterMonuments.includes(undefined)) {
            return false; // One or more monuments not found
        }

        // Combine all monuments (before + after)
        const allMonuments = [...beforeMonuments, ...afterMonuments];

        // Calculate the centroid for all monuments
        const centroid = calculateCentroid(
            allMonuments.map(monument => ({ x: monument.x, y: monument.y }))
        );

        // Check directional relationship
        const directionalCheck = beforeMonuments.every(before =>
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

        if (!directionalCheck) {
            return false;
        }

        // If radius is specified, check all monuments are within the radius of the centroid
        if (radius !== null) {
            const withinRadius = allMonuments.every(monument => {
                const distance = Math.sqrt(
                    Math.pow(monument.x - centroid.x, 2) +
                    Math.pow(monument.y - centroid.y, 2)
                );
                return distance <= radius;
            });

            return withinRadius; // Only return true if all monuments are within the radius
        }

        return true; // If no radius is specified, rely only on directional check
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
