

var makerjs = require('makerjs');


const objList = objString.split('\n').filter((item) =>
    item.substring(0, 2) === 'v ').map((item) =>
        item.split(' ')).map((item) =>
            [parseFloat(item[1]), parseFloat(item[2]), parseFloat(item[3])]);

console.log(objList);

document.addEventListener('DOMContentLoaded', (event) => {
    const canvas = document.querySelector('#canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1000;
    canvas.height = 1000;

    const xy = [];
    const r = 1.1 / 2;
    const tol = 0.02;
    const zTol = 0.02;
    const test = [];
    const maxes = [];
    const mins = [];
    let zMax = -Infinity;
    let zMin = +Infinity;
    const angleDelta = 0.005;
    const deltaC = r * angleDelta;

    objList.forEach((item) => {
        if (item[2] > zMax) {
            zMax = item[2];
        }
        if (item[2] < zMin) {
            zMin = item[2];
        }
    });

    const objLength = objList.length;
    for (let rot = 0; rot <= 2 * Math.PI; rot += angleDelta) {

        const x = r * Math.cos(rot);
        const y = r * Math.sin(rot);
        let max = -Infinity;

        loop1:
        for (let z = zMax; z >= 0; z -= 0.005) {
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
        maxes.push(max);

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
        mins.push(min);
    }

    const points = [];
    const pointsMin = [];

    (function addXCoordinates() {
        for (let i = 0; i < maxes.length; i += 1) {
            points.push([i * deltaC, maxes[i]])
        }
        for (let i = 0; i < mins.length; i += 1) {
            pointsMin.push([i * deltaC, (-Math.abs(mins[i]) + 5)])
        }
    })();

    const sparsePoints = [points[0]];

    for (let i = 1; i < points.length; i += 1) {
        if (!(points[i][1] === points[i - 1][1])) {
            sparsePoints.push(points[i]);
        }
    }

    ctx.beginPath();
    let canvasPoints = [];
    let canvasPointsMin = [];
    (function convertPointsToCanvasSpace() {
        canvasPoints = points.map((point) => {
            return [point[0] * 100, point[1] * 100]
        });
        canvasPointsMin = pointsMin.map((point) => {
            return [point[0] * 100, Math.abs(point[1]) * 100 + 50]
        });
    })();


    (function drawSideLines() {
        ctx.moveTo(canvasPointsMin[canvasPointsMin.length - 1][0], canvasPointsMin[canvasPointsMin.length - 1][1]);
        ctx.lineTo(canvasPoints[canvasPoints.length - 1][0], canvasPoints[canvasPoints.length - 1][1]);

        ctx.moveTo(canvasPointsMin[0][0], canvasPointsMin[0][1]);
        ctx.lineTo(canvasPoints[0][0], canvasPoints[0][1]);
    })();


    (function drawCanvas() {
        ctx.moveTo(canvasPoints[0][0], canvasPoints[0][1]);
        canvasPoints.forEach((point) => {
            ctx.lineTo(point[0], point[1]);
        });
        ctx.moveTo(canvasPointsMin[0][0], canvasPointsMin[0][1]);
        canvasPointsMin.forEach((point) => {
            ctx.lineTo(point[0], point[1]);
        });
    })();

    ctx.stroke();



    const allPoints = [...pointsMin, ...points.reverse(), pointsMin[0]];
    let pointsString = '';
    allPoints.forEach((point) => {
        pointsString += ` ${point[0]} ${point[1]},`
    })

    var model = makerjs.model.mirror(new makerjs.models.ConnectTheDots(false, pointsString), false, true);
    console.log(makerjs.exporter.toDXF(model));

})



