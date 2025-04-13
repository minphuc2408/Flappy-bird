const video = document.querySelector('video');
const handCanvas = document.querySelector('#handCanvas');
const handCtx = handCanvas.getContext("2d");

class Handgesture {
    constructor(game) {
        this.game = game;
        this.handCtx = handCtx;
        this.handCanvas = handCanvas;
        this.hold = false;
        this.isRunning = false;
        this.landmarks = [];
        this.handle = new Array(5).fill(0);
        this.handness = [];

        this.hands = new Hands({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/${file}`;
            }
        });

        this.hands.setOptions({
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        this.hands.onResults(this.onResults.bind(this));

        this.camera = null;
    }

    async start() {
        if (this.isRunning) {
            return;
        }
        this.camera = new Camera(video, {
            onFrame: async () => {
                if (this.isRunning) {
                    await this.hands.send({ image: video });
                }
            },
            width: 640,
            height: 480
        });

        await this.camera.start();
        this.isRunning = true;
    }

    async stop() {
        this.landmarks = []; // 1 bug 3 hours (Loi 1P tat gameover dot ngot)
        if (!this.isRunning) {
            return;
        }
        if (this.camera) {
            await this.camera.stop();
            this.camera = null;
        }
        this.handCtx.clearRect(0, 0, this.handCanvas.width, this.handCanvas.height);
        this.isRunning = false;
    }

    numberOne() {
        if (this.landmarks.length === 0) return false;
        let sum = this.handle.reduce((a, b) => a + b, 0);
        return sum === 1;
    }

    numberTwo() {
        if (this.landmarks.length === 0) return false;
        let sum = this.handle.reduce((a, b) => a + b, 0);
        return sum === 2;
        
    }

    pauseGame() {
        if (this.landmarks.length === 0) return false;
        return this.landmarks.every(landmarks => landmarks[0].y >= 1);
    }

    isHandClosed() {
        if (this.landmarks.length === 0) return false;
        return this.handle.every((i) => i === 0);
    }

    swapRightLeft() {
        let handLabel  = null;
        this.handness.forEach((i) => { // Swap right and left
            handLabel = i.label;
            if (handLabel === 'Left') {
                handLabel = 'Right';
            } else if (handLabel === 'Right') {
                handLabel = 'Left';
            }
        });
        return handLabel;
    }

    handleArray() {
        const up = [4, 8, 12, 16, 20];
        const down = [3, 7, 11, 15, 19];
        for (const landmarks of this.landmarks) {
            for (let i = 0; i < up.length; i++) {
                if (landmarks[up[i]].y > landmarks[down[i]].y) {
                    this.handle[i] = 0;
                } else {
                    this.handle[i] = 1;
                }
                if(this.swapRightLeft() == "Right") {
                    this.handle[0] = landmarks[up[0]].x > landmarks[down[0]].x ? 1 : 0;
                } else {
                    this.handle[0] = landmarks[up[0]].x > landmarks[down[0]].x ? 0 : 1;
                }
            }
        }
    }

    startGame() {
        this.game.startTime = performance.now();
        this.game.isGameStarted = true;
        this.game.render();
    }

    drawHandLandmarks(results) {
        this.handCtx.save();
        // this.handCtx.translate(this.handCanvas.width, 0);
        // this.handCtx.scale(-1, 1);
        this.handCtx.drawImage(results.image, 0, 0, this.handCanvas.width, this.handCanvas.height);
    
        if (results.multiHandLandmarks) {
            for (const landmarks of results.multiHandLandmarks) {
                drawConnectors(this.handCtx, landmarks, HAND_CONNECTIONS, {
                    color: "00ff00",
                    lineWidth: 2, 
                });
                drawLandmarks(this.handCtx, landmarks, {
                    color: "#FF0000",
                    radius: 3, 
                });
            }
        }
        this.handCtx.restore();
    }
    

    handleHandGestures(results) {
        if (results.multiHandLandmarks) {
            this.landmarks = results.multiHandLandmarks;
        } else {
            this.landmarks = [];
        }
        this.handness = results.multiHandedness;
    }

    onResults(results) {
        if (!this.isRunning) return;
        this.handleHandGestures(results);
        this.drawHandLandmarks(results);
        this.handleArray();
    }
}

export default Handgesture;