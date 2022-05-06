const button = document.getElementById("button");
const audio = document.getElementById("audio");
let joke = "";

const API_url =
  "https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist";
//---------------------------------------------------------------------
const VoiceRSS = {
  speech(e) {
    this._validate(e), this._request(e);
  },
  _validate(e) {
    if (!e) throw "The settings are undefined";
    if (!e.key) throw "The API key is undefined";
    if (!e.src) throw "The text is undefined";
    if (!e.hl) throw "The language is undefined";
    if (e.c && "auto" != e.c.toLowerCase()) {
      let a = !1;
      switch (e.c.toLowerCase()) {
        case "mp3":
          a = new Audio().canPlayType("audio/mpeg").replace("no", "");
          break;
        case "wav":
          a = new Audio().canPlayType("audio/wav").replace("no", "");
          break;
        case "aac":
          a = new Audio().canPlayType("audio/aac").replace("no", "");
          break;
        case "ogg":
          a = new Audio().canPlayType("audio/ogg").replace("no", "");
          break;
        case "caf":
          a = new Audio().canPlayType("audio/x-caf").replace("no", "");
      }
      if (!a) throw `The browser does not support the audio codec ${e.c}`;
    }
  },
  _request(e) {
    const a = this._buildRequest(e),
      t = this._getXHR();
    (t.onreadystatechange = function () {
      if (4 == t.readyState && 200 == t.status) {
        if (0 == t.responseText.indexOf("ERROR")) throw t.responseText;
        let newAudio = t.responseText;
        (audio.src = newAudio),
          (audio.onloadedmetadata = () => {
            audio.play();
          });
      }
    }),
      t.open("POST", "https://api.voicerss.org/", !0),
      t.setRequestHeader(
        "Content-Type",
        "application/x-www-form-urlencoded; charset=UTF-8"
      ),
      t.send(a);
  },
  _buildRequest(e) {
    const a = e.c && "auto" != e.c.toLowerCase() ? e.c : this._detectCodec();
    return `key=${e.key || ""}&src=${e.src || ""}&hl=${e.hl || ""}&r=${
      e.r || ""
    }&c=${a || ""}&f=${e.f || ""}&ssml=${e.ssml || ""}&b64=true`;
  },
  _detectCodec() {
    const e = new Audio();
    return e.canPlayType("audio/mpeg").replace("no", "")
      ? "mp3"
      : e.canPlayType("audio/wav").replace("no", "")
      ? "wav"
      : e.canPlayType("audio/aac").replace("no", "")
      ? "aac"
      : e.canPlayType("audio/ogg").replace("no", "")
      ? "ogg"
      : e.canPlayType("audio/x-caf").replace("no", "")
      ? "caf"
      : "";
  },
  _getXHR() {
    try {
      return new XMLHttpRequest();
    } catch (e) {}
    try {
      return new ActiveXObject("Msxml3.XMLHTTP");
    } catch (e) {}
    try {
      return new ActiveXObject("Msxml2.XMLHTTP.6.0");
    } catch (e) {}
    try {
      return new ActiveXObject("Msxml2.XMLHTTP.3.0");
    } catch (e) {}
    try {
      return new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {}
    try {
      return new ActiveXObject("Microsoft.XMLHTTP");
    } catch (e) {}
    throw "The browser does not support HTTP request";
  },
};

//---------------------------------------------------------------

// const toggleDisableButton = function () {
//   button.disabled = !button.disabled;
// };

const tellJoke = function (joke) {
  console.log(joke);
  VoiceRSS.speech({
    key: "f3bb6539c0d749edba5d877fdc59785c",
    src: joke,
    hl: "en-us",
    v: "Linda",
    r: 0,
    c: "mp3",
    f: "44khz_16bit_stereo",
    ssml: false,
  });
};

const getJoke = async function () {
  try {
    const response = await fetch(API_url);
    if (!response.ok)
      throw new Error(
        "API is not fetching at this moment: Please Inform me about this"
      );
    const data = await response.json();

    data.joke
      ? (joke = data.joke)
      : (joke = `${data.setup}...${data.delivery}`);
  } catch (err) {
    console.error(err.message);
  }
};

getJoke();

button.addEventListener("click", function () {
  button.disabled = true;
  tellJoke(joke);
  getJoke();
});

audio.addEventListener("ended", function () {
  button.disabled = false;
});
