

var makerjs = require('makerjs');

//FOR OBJs
// const objList = objString.split('\n').filter((item) =>
//     item.substring(0, 2) === 'v ').map((item) =>
//         item.split(' ')).map((item) =>
//             [parseFloat(item[1]), parseFloat(item[2]), parseFloat(item[3])]);

// console.log(objList);

let objList = parsedList;

const miniObjList = [];

objList.forEach((item) => {

    const newRad = Math.sqrt(Math.pow(item[0], 2) + Math.pow(item[1], 2));

    if (newRad < 0.640 && newRad > 0.620) {
        miniObjList.push([item[0], item[1], item[2]]);
    }

});

console.log(objList.length, miniObjList.length);


objList = miniObjList;


document.addEventListener('DOMContentLoaded', (event) => {
    const canvas = document.querySelector('#canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1000;
    canvas.height = 1000;

    const xy = [];
    const r = 0.63;
    const tol = 0.01;
    const zTol = 0.01;
    const test = [];
    const maxes = [];
    const mins = [];
    let zMax = -Infinity;
    let zMin = +Infinity;
    const angleDelta = 0.001;
    const deltaC = r * angleDelta;

    objList.forEach((item) => {
        if (item[2] > zMax) {
            zMax = item[2];
        }
        if (item[2] < zMin) {
            zMin = item[2];
        }
    });

    console.log(zMax, zMin);

    const objLength = objList.length;
    for (let rot = 0; rot <= 2 * Math.PI; rot += angleDelta) {

        const x = r * Math.cos(rot);
        const y = r * Math.sin(rot);
        let max = -Infinity;

        loop1:
        for (let z = zMax; z >= 0; z -= 0.003) {
            for (let i = 0; i < objLength; i += 1) {
                if (objList[i][0] < x + tol &&
                    objList[i][0] > x - tol &&
                    objList[i][1] < y + tol &&
                    objList[i][1] > y - tol &&
                    objList[i][2] < z + zTol &&
                    objList[i][2] > z - zTol) {
                    max = z;
                    break loop1;
                };
            };
        }

        if (max === -Infinity) {
            maxes.push(maxes[maxes.length - 1]);
        } else {
            maxes.push(max);
        }

        let min = +Infinity;
        loop2:
        for (let z = zMin; z <= 0; z += 0.005) {
            for (let i = 0; i < objLength; i += 1) {
                if (objList[i][0] < x + tol &&
                    objList[i][0] > x - tol &&
                    objList[i][1] < y + tol &&
                    objList[i][1] > y - tol &&
                    objList[i][2] < z + zTol &&
                    objList[i][2] > z - zTol) {
                    min = z;
                    break loop2;
                };
            };
        }
        if (min === Infinity) {
            mins.push(mins[mins.length - 1]);
        } else {
            mins.push(min);
        }

    }

    const points = [];
    const pointsMin = [];

    (function addXCoordinates() {
        for (let i = 0; i < maxes.length; i += 1) {
            points.push([i * deltaC, maxes[i]])
        }
        for (let i = 0; i < mins.length; i += 1) {
            pointsMin.push([i * deltaC, (mins[i])])
        }
    })();



    ctx.beginPath();


    (function drawCanvas() {

        ctx.moveTo(pointsMin[0][0] * 70, pointsMin[0][1] * 70 + 1000);
        pointsMin.forEach((point) => {
            ctx.lineTo(point[0] * 70, point[1] * 70 + 1000);
        });

        points.reverse().forEach((point) => {
            ctx.lineTo(point[0] * 70, point[1] * 70);
        });

        ctx.lineTo(pointsMin[0][0] * 70, pointsMin[0][1] * 70 + 1000);

    })();

    ctx.stroke();



    console.log(pointsMin);
    const allPoints = [...pointsMin, ...points];
    let pointsString = '';
    allPoints.forEach((point) => {
        pointsString += ` ${point[0].toFixed(5)} ${point[1].toFixed(5)},`
    })

    console.log(pointsString);

    var model = new makerjs.models.ConnectTheDots(true, pointsString);
    console.log(makerjs.exporter.toDXF(model));

})



