export interface Block {
    block: string;
    x: number;
    z: number;
}

export default class Blocks {
    public static readonly BLOCKS = [
        {
          block: "Note Block",
          x: 5939,
          z: 1562,
        },
          {
          block: "Cobblestone",
          x: 5940,
          z: 1564,
          },
          {
          block: "Gold Block",
          x: 5940,
          z: 1562,
          },
          {
          block: "Crafting Table",
          x: 5941,
          z: 1562,
          },
          {
          block: "Sea Lantern",
          x: 5940,
          z: 1563,
          },
          {
          block: "Diamond Block",
          x: 5941,
          z: 1563,
          },
          {
          block: "Emerald Block",
          x: 5939,
          z: 1564,
          },
          {
          block: "Dirt",
          x: 5941,
          z: 1564,
          },
          {
          block: "Sand",
          x: 5939,
          z: 1563,
          }
      ]

      public static pick() {
        return this.BLOCKS[Math.floor(Math.random() * this.BLOCKS.length)];
      }
}