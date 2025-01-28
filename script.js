const imageInput = document.getElementById("image-input");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const brightnessSlider = document.getElementById("brightness");
const contrastSlider = document.getElementById("contrast");
const applyEnhancementsButton = document.getElementById("apply-enhancements");

const grayscaleButton = document.getElementById("grayscale");
const sepiaButton = document.getElementById("sepia");
const invertButton = document.getElementById("invert");
const resetButton = document.getElementById("reset");

let originalImage = null;

imageInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function () {
            const img = new Image();
            img.onload = function () {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                originalImage = ctx.getImageData(0, 0, img.width, img.height);
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    }
});

function applyEnhancements() {
    if (!originalImage) return;
    const imageData = ctx.createImageData(originalImage);
    const brightness = brightnessSlider.value - 100;
    const contrast = contrastSlider.value - 100;

    for (let i = 0; i < originalImage.data.length; i += 4) {
        for (let j = 0; j < 3; j++) {
            let pixel = originalImage.data[i + j];
            pixel = pixel + brightness;
            pixel = ((pixel - 128) * (contrast / 100 + 1)) + 128;
            imageData.data[i + j] = Math.min(255, Math.max(0, pixel));
        }
        imageData.data[i + 3] = originalImage.data[i + 3]; // alpha
    }
    ctx.putImageData(imageData, 0, 0);
}

applyEnhancementsButton.addEventListener("click", applyEnhancements);

function applyFilter(filter) {
    if (!originalImage) return;
    const imageData = ctx.createImageData(originalImage);
    for (let i = 0; i < originalImage.data.length; i += 4) {
        let r = originalImage.data[i];
        let g = originalImage.data[i + 1];
        let b = originalImage.data[i + 2];

        if (filter === "grayscale") {
            const gray = 0.3 * r + 0.59 * g + 0.11 * b;
            r = g = b = gray;
        } else if (filter === "sepia") {
            const tr = 0.393 * r + 0.769 * g + 0.189 * b;
            const tg = 0.349 * r + 0.686 * g + 0.168 * b;
            const tb = 0.272 * r + 0.534 * g + 0.131 * b;
            r = Math.min(255, tr);
            g = Math.min(255, tg);
            b = Math.min(255, tb);
        } else if (filter === "invert") {
            r = 255 - r;
            g = 255 - g;
            b = 255 - b;
        }

        imageData.data[i] = r;
        imageData.data[i + 1] = g;
        imageData.data[i + 2] = b;
        imageData.data[i + 3] = originalImage.data[i + 3]; // alpha
    }
    ctx.putImageData(imageData, 0, 0);
}

grayscaleButton.addEventListener("click", () => applyFilter("grayscale"));
sepiaButton.addEventListener("click", () => applyFilter("sepia"));
invertButton.addEventListener("click", () => applyFilter("invert"));

resetButton.addEventListener("click", () => {
    if (originalImage) {
        ctx.putImageData(originalImage, 0, 0);
        brightnessSlider.value = 100;
        contrastSlider.value = 100;
    }
});
