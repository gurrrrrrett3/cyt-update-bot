import Town from '../resources/town';
import MapInterface from './mapInterface';
import MarkerParser from './parse';
import { bot } from '../..';

export default class MapUpdate {

    public interval = setInterval(() => {
        this.update().then((towns) => {

        });
    }
    , 10000);
    
    constructor() {
        this.update();
    }

    public async update(): Promise<Town[]> {

        const worldMarkers = await MapInterface.getWorldMarkers();
        const earthMarkers = await MapInterface.getEarthMarkers();

        const towns: Town[] = [];

        towns.push(...MarkerParser.parseMarkerFile("world", worldMarkers));
        towns.push(...MarkerParser.parseMarkerFile("earth", earthMarkers));

        bot.townDataManager.check(towns);

        return towns;
    }

}