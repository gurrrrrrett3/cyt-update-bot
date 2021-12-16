import {MapZoom, World } from './types';
import Canvas from 'node-canvas';
import staticData from './staticData';
import fetch from 'node-fetch';
import fs from 'fs';

export default class gameMap {
    
    public world: World;
    public zoom: MapZoom;

     constructor(world: World, zoom: MapZoom) { 

         this.world = world
         this.zoom = zoom

     }

     public async generateImage() {

        const zoom = this.zoom
        const world = this.world

        //Fetch each chunk and draw it on the canvas

        const blocksPerTile = staticData.mapScale[zoom] * staticData.tileSize;

        const tileCount =  {
            x: Math.ceil(staticData.mapSize[world].x / blocksPerTile) + 1,
            z: Math.ceil(staticData.mapSize[world].z / blocksPerTile) + 1
        }


        const canvas = Canvas.createCanvas(tileCount.x * staticData.tileSize, tileCount.z * staticData.tileSize);
        const ctx = canvas.getContext('2d');

       ctx.fillStyle = '#000000';
       ctx.fillRect(0, 0, canvas.width, canvas.height);


        console.log(`Generating map for ${world} at zoom ${zoom}`);
        console.log(`Generating ${tileCount.x} x ${tileCount.z} tiles`);
        console.log(`Generating ${Math.ceil(tileCount.x * tileCount.z)} tiles`);
        console.log(`Generating ${tileCount.x * tileCount.z * staticData.tileSize * staticData.tileSize} pixels`);

        console.log(`Canvas size: ${tileCount.x * staticData.tileSize} x ${tileCount.z * staticData.tileSize}`)

        //download each tile and draw it on the canvas

        let firstTileX = Math.floor(0 - (tileCount.x / 2)) 
        let firstTileZ = Math.floor(0 - (tileCount.z / 2))
        
        let lastTileX = Math.floor(tileCount.x / 2)
        let lastTileZ = Math.floor(tileCount.z / 2) 

        let tileCountX = 0
        let tileCountZ = 0 

        for (let x = firstTileX; x < lastTileX; x++) {
            for (let z = firstTileZ; z < lastTileZ; z++) {

                const tile = await this.getTile(x, z);

                const tileX = tileCountX * staticData.tileSize;
                const tileZ = tileCountZ * staticData.tileSize;

                ctx.drawImage(tile, tileZ, tileX);

                tileCountX++;

            }
            tileCountZ++;
            tileCountX = 0;
        }
        fs.writeFile(`./output/${world}_${zoom}.png`, canvas.toBuffer(), () => {});

        return `./output/${world}_${zoom}.png`

    }

    private async getTile(x: number, z: number) {

        const url = `https://zion.craftyourtown.com/tiles/${this.world}/${this.zoom}/${x}_${z}.png`;

       return fetch(url, {
            method: 'GET',
            headers: staticData.fetch.headers
        }).then(res => {
            return res.buffer()
        }).then(buffer => {

            console.log(`Downloaded tile ${x}_${z}, buffer size ${buffer.length}`);

            return Canvas.loadImage(buffer)
        }).catch(err => {
            console.log(err);
        })


    }


}