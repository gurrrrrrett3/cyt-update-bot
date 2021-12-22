import PolygonUtil from "./modules/polygon";

const polygon = {
    points: [
        {
            x: 0,
            z: 0,
        },
        {
            x: 100,
            z: 100,
        },
        {
            x: 100,
            z: 0,
        },
        {
            x: 0,
            z: 100,
        },
    ],
};

for (var i = 0; i < 1000; i++) {

    const point = {
        x: Math.round(Math.random() * 200 - 100),
        z: Math.round(Math.random() * 200 - 100),
    };

    if (PolygonUtil.isPointInPolygon(point, polygon)) {
        console.log(`${point.x}, ${point.z} is inside the polygon`);
    } else {
        console.log(`${point.x}, ${point.z} is outside the polygon`);
    }

}