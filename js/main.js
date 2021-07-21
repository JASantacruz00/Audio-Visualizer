const playButton = document.getElementById("playButton");
const audio = document.getElementById("audio");
audio.crossorigin = "anonymous";
let isPlaying = false;
var context = new AudioContext();

document.addEventListener("readystatechange", (event) => {
  if (event.target.readyState === "complete") {
    initApp();
  }
});

const initApp = () => {
  playFunction();
  playButton.addEventListener("click", function () {
    context.resume();
    isPlaying = !isPlaying;
    if (isPlaying) {
      playButton.textContent = "Pause";
      audio.play();
    } else {
      playButton.textContent = "Play";
      audio.pause();
    }
  });
};
const playFunction = () => {
  audio.load();
  var src = context.createMediaElementSource(audio);
  var analyser = context.createAnalyser();

  var canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var ctx = canvas.getContext("2d");

  src.connect(analyser);
  analyser.connect(context.destination);

  analyser.fftSize = 256;
  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength);

  var WIDTH = canvas.width;
  var HEIGHT = canvas.height;

  var barWidth = (WIDTH / bufferLength) * 2.5;
  var barHeight;
  var x = 0;

  function renderFrame() {
    requestAnimationFrame(renderFrame);
    x = 0;
    analyser.getByteFrequencyData(dataArray);

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    for (var i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i];
      var r = barHeight + 25 * (i / bufferLength);
      var g = 250 * (i / bufferLength);
      var b = 450;
      ctx.fillStyle = rgb(r, g, b);
      ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
      x += barWidth + 1;
    }
  }
  renderFrame();
};

function rgb(r, g, b) {
  return "rgb(" + [r || 0, g || 0, b || 0].join(",") + ")";
}
