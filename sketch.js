
const wallW = 5;
let apertureSize = 50;
let objectX = 150;
let objectH = 200;
let resolution = 1;
let angleRes = 0.002;
let targetX = 150;
let b = 0.1;

let prevMillis = 0;

let apertureSlider, targetXSlider, objectXSlider, objectHSlider, brightnessSlider;

function setup() {
    let cnv = createCanvas(600, 400);
    noStroke();
    apertureSlider = createSlider(5, 200, 50);
    targetXSlider = createSlider(50, 250, 150);
    objectXSlider = createSlider(50, 250, 150);
    objectHSlider = createSlider(50, 300, 200);
    brightnessSlider = createSlider(0, 1, 0.1, 0.01);

    cnv.parent(document.getElementById('canvas-container'));
    apertureSlider.parent(document.getElementById('aperture-slider'));
    objectXSlider.parent(document.getElementById('obj-x-slider'));
    objectHSlider.parent(document.getElementById('obj-h-slider'));
    targetXSlider.parent(document.getElementById('wall-x-slider'));
    brightnessSlider.parent(document.getElementById('brightness-slider'));
}

let img;

function draw() {

    apertureSize = apertureSlider.value();
    targetX = targetXSlider.value();
    objectX = objectXSlider.value();
    objectH = objectHSlider.value();
    b = brightnessSlider.value();

    let delta = (millis() - prevMillis) / 1000.0;
    prevMillis = millis();
    let fps = 1 / delta;

    background(255);
    noStroke();
    
    fill(0);
    rect((width - wallW) / 2, 0, wallW, (height - apertureSize) / 2);
    rect((width - wallW) / 2, height - (height - apertureSize) / 2, wallW, (height - apertureSize) / 2);
    rect(targetX + width / 2, 0, width / 2 - targetX, height);

    img = [];
    for(let y = 0; y < height; y ++) img.push([0, 0, 0]);

    let objectY = (height - objectH) / 2;
    for(let y = 0.0; y < objectH; y += resolution) {
        let color = getObjectColor(y / objectH);
        fill(color[0], color[1], color[2]);
        rect(objectX - 20, y + objectY, 20, resolution);

        let angle = getAngle(y);
        for(let a = angle[0]; a < angle[1]; a += angleRes) {
            let yDiff = tan(-a) * (width / 2 - objectX + targetX);
            let hitY = objectY + y + yDiff;
            let col = getObjectColor(y / objectH);

            if(hitY > 2 && hitY < height - 2) {

                let cFirst = hitY - floor(hitY);
                
                img[floor(hitY)][0] += cFirst * resolution * b * 0.1 * col[0];
                img[ceil(hitY)][0] += (1 - cFirst) * resolution * b * 0.1 * col[0];
                img[floor(hitY)][1] += cFirst * resolution * b * 0.1 * col[1];
                img[ceil(hitY)][1] += (1 - cFirst) * resolution * b * 0.1 * col[1];
                img[floor(hitY)][2] += cFirst * resolution * b * 0.1 * col[2];
                img[ceil(hitY)][2] += (1 - cFirst) * resolution * b * 0.1 * col[2];
            }
        }
    }

    for(let y = 0; y < height; y += resolution) {
        fill(img[y][0], img[y][1], img[y][2]);
        rect(width / 2 + targetX, y, 10, resolution);
    }

}

function getAngle(y) {
    let objectY = height / 2 - objectH / 2;
    
    let topRayApertureX;
    if(y + objectY > height / 2 - apertureSize / 2) {
        topRayApertureX = width / 2 + wallW / 2;
    } else {
        topRayApertureX = width / 2 - wallW / 2;
    }

    let bottomRayApertureX;
    if(y + objectY < height / 2 + apertureSize / 2) {
        bottomRayApertureX = width / 2 + wallW / 2;
    } else {
        bottomRayApertureX = width / 2 - wallW / 2;
    }

    let topAngle = atan((y + objectY - (height / 2 - apertureSize / 2)) / (topRayApertureX - objectX));
    let bottomAngle = atan((y + objectY - (height / 2 + apertureSize / 2)) / (bottomRayApertureX - objectX));
    return [bottomAngle, topAngle];

}

function getObjectColor(y) {
    if(y < 0.5) return [255, 0, 0];
    else return [0, 255, 0];
}