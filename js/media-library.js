// media-library.js
// Просте управління формою-меню і елементами <audio>/<video>

document.addEventListener('DOMContentLoaded', function(){
  const menu = document.getElementById('libraryMenu');
  const audioPlayer = document.getElementById('audioPlayer');
  const videoPlayer = document.getElementById('videoPlayer');
  const meta = document.getElementById('meta');
  const audioSrcMp3 = document.getElementById('audioSourceMp3');
  const audioSrcOgg = document.getElementById('audioSourceOgg');
  const videoSrcMp4 = document.getElementById('videoSourceMp4');
  const videoSrcWebm = document.getElementById('videoSourceWebm');
  const audioField = document.getElementById('audioListField');
  const videoField = document.getElementById('videoListField');
  const playlist = document.getElementById('playlist');

  function showSection(type){
    if (type === 'audio'){
      audioPlayer.hidden = false; videoPlayer.hidden = true; playlist.hidden = true;
      audioField.hidden = false; videoField.hidden = true;
    } else if (type === 'video'){
      audioPlayer.hidden = true; videoPlayer.hidden = false; playlist.hidden = true;
      audioField.hidden = true; videoField.hidden = false;
    } else {
      audioPlayer.hidden = true; videoPlayer.hidden = true; playlist.hidden = false;
      audioField.hidden = true; videoField.hidden = true;
    }
  }

  // initialize visibility from selected radio
  const typeRadios = menu.elements['mediaType'];
  let initialType = 'audio';
  if (typeRadios){
    for (const r of typeRadios) if (r.checked) initialType = r.value;
  }
  showSection(initialType);

  // listen for changes in the media type
  menu.addEventListener('change', function(e){
    if (e.target.name === 'mediaType'){
      showSection(e.target.value);
    }
  });

  // Load button: set source of audio or video from selected mediaItem value
  document.getElementById('loadBtn').addEventListener('click', function(){
    const type = menu.elements['mediaType'].value;
    // find selected mediaItem
    const items = menu.elements['mediaItem'];
    let selected = null;
    if (items){
      if (items.length) {
        for (const it of items) if (it.checked) selected = it.value;
      } else { selected = items.value; }
    }

    if (!selected){ meta.textContent = 'Не вибрано елемент для завантаження.'; return; }

    // If type is audio, populate audio <source> elements. Student should replace filenames with actual URLs.
    if (type === 'audio'){
      // try to set both source slots; student can set one or more with correct types
      audioSrcMp3.src = selected.endsWith('.mp3') ? selected : '';
      audioSrcOgg.src = selected.endsWith('.ogg') ? selected : '';
      audioPlayer.load();
      meta.textContent = 'Завантажено аудіо: ' + selected + '\n(замініть шлях у формі ліворуч на ваш файл)';
    } else if (type === 'video'){
      videoSrcMp4.src = selected.endsWith('.mp4') ? selected : '';
      videoSrcWebm.src = selected.endsWith('.webm') ? selected : '';
      videoPlayer.load();
      meta.textContent = 'Завантажено відео: ' + selected + '\n(замініть шлях у формі ліворуч на ваш файл)';
    } else {
      meta.textContent = 'Плейлист: ' + selected;
    }
  });

  document.getElementById('playBtn').addEventListener('click', function(){
    if (!audioPlayer.hidden) audioPlayer.play();
    if (!videoPlayer.hidden) videoPlayer.play();
  });
  document.getElementById('pauseBtn').addEventListener('click', function(){
    if (!audioPlayer.hidden) audioPlayer.pause();
    if (!videoPlayer.hidden) videoPlayer.pause();
  });

});
