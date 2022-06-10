import Player from "../resources/player"
import Shop from "./shop"
import ShopRegionManager from "./shopRegionManager"
import { ShopSession } from "./types"

export default class ShopManager {


        constructor() {
            ShopRegionManager.loadShops()
        }

        public onUpdate(playerList: Player[]) {


        }

}