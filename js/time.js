let lastFrameTime = performance.now();
let fps = 0;
const smoothingFactor = 0.9; // Hệ số làm mượt giá trị FPS

export function calculateFPS() {
    const now = performance.now();
    const deltaTime = now - lastFrameTime;

    // Giới hạn giá trị deltaTime tối thiểu để tránh giá trị FPS quá lớn
    const minDeltaTime = 1; // 1ms
    const limitedDeltaTime = Math.max(deltaTime, minDeltaTime);

    // Tính toán FPS (1000ms / deltaTime) và làm mượt giá trị FPS
    const currentFPS = 1000 / limitedDeltaTime;
    fps = smoothingFactor * fps + (1 - smoothingFactor) * currentFPS;

    lastFrameTime = now;
    return fps;
}

function createTime(maxFps = 165) {
    if (maxFps <= 0) {
        console.warn("maxFps must be greater than 0. Setting to default value (60).");
        maxFps = 60; // Hoặc giá trị an toàn khác
    }

    let previousTime = performance.now(); // Khởi tạo với giá trị hiện tại
    let deltaTime = 0;
    let running = false; // Trạng thái chạy của bộ đếm thời gian
    let minFrameTime = 1000 / maxFps; // Thời gian tối thiểu cho mỗi khung hình

    function start() {
        previousTime = performance.now();
        running = true;
    }

    function stop() {
        running = false;
    }

    function reset() {
        previousTime = performance.now();
        deltaTime = 0;
    }

    function setMaxFps(newMaxFps) {
        if (newMaxFps <= 0) {
            console.warn("maxFps must be greater than 0. Setting to default value (60).");
            newMaxFps = 60; // Hoặc giá trị an toàn khác
        }
        maxFps = newMaxFps;
        minFrameTime = 1000 / maxFps; // Cập nhật thời gian tối thiểu cho mỗi khung hình
    }

    function update(currentTime) {
        if (!running) return;
        
        // Tính deltaTime
        const elapsedTime = currentTime - previousTime;
        if (elapsedTime >= minFrameTime) {
            deltaTime = elapsedTime / 1000; // Chuyển đổi từ milliseconds sang seconds
            previousTime = currentTime;
        } else {
            deltaTime = 0;
        }
    }

    function getDeltaTime() {
        return deltaTime;
    }

    function isRunning() {
        return running;
    }

    function getMaxFps() {
        return maxFps;
    }

    return {
        start,
        stop,
        reset,
        setMaxFps,
        update,
        getDeltaTime,
        isRunning,
        getMaxFps
    };
}

export default createTime;