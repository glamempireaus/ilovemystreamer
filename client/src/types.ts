export type FilterType = 'cluster' | 'absolute' | 'relational';

export interface FilterConfig {
  type: FilterType;
  monuments: string[] | [string[], string[]];
  direction: string;
  radius?: number;
}

export interface Monument {
  name: string;
  xCoord: number;
  yCoord: number;
  biomeList: string[];
}

export interface Map {
  size: number;
  url: string;
  monumentList: Monument[];
}

export interface Server {
  name: string;
  ip: string;
  map: Map;
  playerCount: number;
  playerList: null | any[];
  country: string;
  ping: number;
  wipeDate: string;
}