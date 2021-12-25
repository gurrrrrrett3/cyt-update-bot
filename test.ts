import Town from "./modules/town";
import { commandHandler } from "./modules/commandHandler";
import ProcessTown from "./modules/processTown";


ProcessTown.Run()

const town = ProcessTown.getTown("Hillwood");

console.log(town);