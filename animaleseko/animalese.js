// animalese.js
// (C) 2014 Josh Simmons
// http://github.com/acedio/animalese.js

var Animalese = function(letters_file, onload) {
  this.Animalese = function(script, shorten) {
    function firstLast(str) {
      if (str.length > 1) {
        return str[0] + str[str.length - 1];
      }
      return str;
    }

    var processed_script = script;
    var temp = Hangul.d(script);
    
    temp.forEach(function(item, index, arr2){
        if(item == "ㅏ") temp[index] = "a";
        if(item == "ㅓ") temp[index] = "eo";
        if(item == "ㅗ") temp[index] = "o";
        if(item == "ㅜ") temp[index] = "u";
        if(item == "ㅡ") temp[index] = "u";
        if(item == "ㅣ") temp[index] = "i";
        if(item == "ㅐ") temp[index] = "ae";
        if(item == "ㅔ") temp[index] = "e";
        if(item == "ㅑ") temp[index] = "ya";
        if(item == "ㅕ") temp[index] = "yeo";
        if(item == "ㅛ") temp[index] = "yo";
        if(item == "ㅠ") temp[index] = "yu";
        if(item == "ㅒ") temp[index] = "yae";
        if(item == "ㅖ") temp[index] = "ye";
        
        if(item == "ㄱ") temp[index] = "g";
        if(item == "ㄲ") temp[index] = "kk";
        if(item == "ㅋ") temp[index] = "k";
        if(item == "ㄷ") temp[index] = "d";
        if(item == "ㄸ") temp[index] = "tt";
        if(item == "ㅌ") temp[index] = "t";
        if(item == "ㅂ") temp[index] = "b";
        if(item == "ㅃ") temp[index] = "pp";
        if(item == "ㅍ") temp[index] = "p";
        if(item == "ㅈ") temp[index] = "j";
        if(item == "ㅉ") temp[index] = "jj";
        if(item == "ㅊ") temp[index] = "ch";
        if(item == "ㅅ") temp[index] = "s";
        if(item == "ㅆ") temp[index] = "ss";
        if(item == "ㅎ") temp[index] = "h";
        if(item == "ㄴ") temp[index] = "n";
        if(item == "ㅁ") temp[index] = "m";
        if(item == "ㅇ") temp[index] = "";
        if(item == "ㄹ") temp[index] = "r";
    });

    processed_script = temp.join('')
    console.log(processed_script)

    if (shorten) {
      processed_script =
        script.replace(/[^a-z]/gi, ' ').split(' ').map(firstLast).join('');
    }

    var data = [];

    var sample_freq = 44100;
    var channels = 1;
    var letter_secs = 0.15;
    var letter_spoken_secs = 0.075;
    var letter_size = Math.floor(letter_secs * channels * sample_freq);
    var letter_spoken_size =
      Math.floor(letter_spoken_secs * channels * sample_freq);

    for (var c_index = 0; c_index < processed_script.length; c_index++) {
      var c_value = processed_script.toUpperCase()[c_index];
      if (c_value >= 'A' && c_value <= 'Z') {
        var letter_loc =
          letter_size * (c_value.charCodeAt(0) - 'A'.charCodeAt(0));

        for (var i = 0; i < letter_spoken_size; i++) {
          data[c_index*letter_spoken_size + i] =
            this.letters[44 + letter_loc + i];
        }
      } else { // non pronouncable character or space
        for (var i = 0; i < letter_spoken_size; i++) {
          data[c_index*letter_spoken_size + i] = 127;
        }
      }
    }

    var wave = new RIFFWAVE();
    wave.header.sampleRate = sample_freq;
    wave.header.numChannels = channels;
    wave.Make(data);

    return wave;
  }

  var xhr = new XMLHttpRequest();
  xhr.open('GET', letters_file);
  xhr.responseType = 'arraybuffer';
  var req = this;
  xhr.onload = function(e) {
    req.letters = new Uint8Array(this.response);
    onload();
  }
  xhr.send();
}
