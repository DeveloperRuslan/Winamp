// Получение элементов из DOM
const wrapper = document.querySelector(".wrapper"),
  musicImg = wrapper.querySelector(".img-area img"),
  musicName = wrapper.querySelector(".song-details .name"),
  musicArtist = wrapper.querySelector(".song-details .artist"),
  playPauseBtn = wrapper.querySelector(".play-pause"),
  prevBtn = wrapper.querySelector("#prev"),
  nextBtn = wrapper.querySelector("#next"),
  mainAudio = wrapper.querySelector("#main-audio"),
  progressArea = wrapper.querySelector(".progress-area"),
  progressBar = progressArea.querySelector(".progress-bar"),
  musicList = wrapper.querySelector(".music-list"),
  moreMusicBtn = wrapper.querySelector("#more-music"),
  closeMoreMusic = musicList.querySelector("#close"),
  repeatBtn = wrapper.querySelector("#repeat-plist"),
  ulTag = wrapper.querySelector("ul");

// Устанавливаем индекс текущей музыкальной композиции случайным образом
let musicIndex = Math.floor(Math.random() * allMusic.length);
let isMusicPaused = true;

// Событие при загрузке страницы
window.addEventListener("load", () => {
  loadMusic(musicIndex); // Загружаем выбранную музыку
  updatePlayingSong();   // Обновляем список текущей композиции
});

// Функция загрузки деталей музыки
function loadMusic(index) {
  const song = allMusic[index]; // Получаем информацию о песне
  musicName.innerText = song.name; // Устанавливаем имя песни
  musicArtist.innerText = song.artist; // Устанавливаем имя исполнителя
  musicImg.src = `images/${song.src}.jpg`; // Устанавливаем изображение
  mainAudio.src = `songs/${song.src}.mp3`; // Устанавливаем источник аудио
}

// Функция воспроизведения музыки
function playMusic() {
  wrapper.classList.add("paused"); // Добавляем класс 'paused', чтобы изменить стиль
  playPauseBtn.querySelector("i").innerText = "pause"; // Меняем иконку на 'пауза'
  mainAudio.play(); // Воспроизводим аудио
}

// Функция паузы музыки
function pauseMusic() {
  wrapper.classList.remove("paused"); // Убираем класс 'paused'
  playPauseBtn.querySelector("i").innerText = "play_arrow"; // Меняем иконку на 'воспроизведение'
  mainAudio.pause(); // Ставим на паузу аудио
}

// Функция для воспроизведения предыдущей песни
function prevMusic() {
  musicIndex = (musicIndex - 1 + allMusic.length) % allMusic.length; // Вычисляем индекс предыдущей песни
  loadMusic(musicIndex); // Загружаем информацию о песне
  playMusic(); // Воспроизводим ее
  updatePlayingSong(); // Обновляем список текущей композиции
}

// Функция для воспроизведения следующей песни
function nextMusic() {
  musicIndex = (musicIndex + 1) % allMusic.length; // Вычисляем индекс следующей песни
  loadMusic(musicIndex); // Загружаем информацию о песне
  playMusic(); // Воспроизводим ее
  updatePlayingSong(); // Обновляем список текущей композиции
}

// Функция выбора песни из списка
function selectSong(element) {
  const selectedIndex = element.getAttribute("li-index"); // Получаем индекс выбранной песни
  musicIndex = selectedIndex - 1; // Устанавливаем индекс
  loadMusic(musicIndex); // Загружаем информацию о песне
  playMusic(); // Воспроизводим ее
  updatePlayingSong(); // Обновляем список текущей композиции
}

// Событие для кнопки воспроизведения/паузы
playPauseBtn.addEventListener("click", () => {
  const isPlaying = wrapper.classList.contains("paused"); // Проверяем, воспроизводится ли музыка
  isPlaying ? pauseMusic() : playMusic(); // Пауза или воспроизведение
  updatePlayingSong(); // Обновляем список текущей композиции
});

// События для кнопок предыдущей и следующей песни
prevBtn.addEventListener("click", prevMusic);
nextBtn.addEventListener("click", nextMusic);

// Обновляем прогресс-бар, пока музыка играет
mainAudio.addEventListener("timeupdate", (e) => {
  if (mainAudio.duration) {
    // Вычисляем ширину прогресс-бара
    const progressWidth = (e.target.currentTime / mainAudio.duration) * 100;
    progressBar.style.width = `${progressWidth}%`; // Устанавливаем ширину прогресс-бара

    updateCurrentTime(e.target.currentTime); // Обновляем текущее время
  }
});

// Обновление текущего времени и продолжительности
function updateCurrentTime(currentTime) {
  const currentMin = Math.floor(currentTime / 60); // Вычисляем минуты
  const currentSec = Math.floor(currentTime % 60) // Вычисляем секунды
    .toString()
    .padStart(2, "0"); // Убедитесь, что секунды всегда состоят из 2 цифр
  wrapper.querySelector(".current-time").innerText = `${currentMin}:${currentSec}`; // Обновляем текст текущего времени
}

// Событие, когда аудио загружено
mainAudio.addEventListener("loadeddata", () => {
  const totalMin = Math.floor(mainAudio.duration / 60); // Вычисляем общие минуты
  const totalSec = Math.floor(mainAudio.duration % 60) // Вычисляем общие секунды
    .toString()
    .padStart(2, "0"); 
  wrapper.querySelector(".max-duration").innerText = `${totalMin}:${totalSec}`; // Обновляем текст продолжительности
});

// Перемотка через прогресс-бар
progressArea.addEventListener("click", (e) => {
  const progressWidth = progressArea.clientWidth; // Получаем ширину прогресс-бара
  const clickedOffsetX = e.offsetX; // Получаем нажатую позицию
  mainAudio.currentTime = (clickedOffsetX / progressWidth) * mainAudio.duration; // Устанавливаем новое текущее время
  playMusic(); // Воспроизводим музыку
  updatePlayingSong(); // Обновляем список текущей композиции
});

// Событие кнопки повтора/перемешивания
repeatBtn.addEventListener("click", () => {
  // Переключение состояния кнопки повтора/перемешивания
  switch (repeatBtn.innerText) {
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffled");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped");
      break;
  }
});

// Обработка события конца песни
mainAudio.addEventListener("ended", () => {
  // В зависимости от состояния кнопки повторения выполняем соответствующее действие
  switch (repeatBtn.innerText) {
    case "repeat":
      nextMusic(); // Воспроизводим следующую песню
      break;
    case "repeat_one":
      mainAudio.currentTime = 0; // Ставим текущую песню на начало
      playMusic(); // Воспроизводим ее
      break;
    case "shuffle":
      shuffleMusic(); // Перемешиваем музыку
      break;
  }
});

// Функция для перемешивания музыки
function shuffleMusic() {
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * allMusic.length); // Получаем случайный индекс
  } while (randomIndex === musicIndex); // Убедитесь, что это не текущий индекс
  musicIndex = randomIndex; // Устанавливаем новый индекс
  loadMusic(musicIndex); // Загружаем информацию о песне
  playMusic(); // Воспроизводим ее
  updatePlayingSong(); // Обновляем список текущей композиции
}

// Отображение/скрытие списка музыки
moreMusicBtn.addEventListener("click", () => {
  musicList.classList.toggle("show"); // Переключаем видимость списка
});

closeMoreMusic.addEventListener("click", () => {
  musicList.classList.remove("show"); // Скрываем список
});

// Генерация списка песен динамически
allMusic.forEach((song, index) => {
  const liTag = `
    <li li-index="${index + 1}">
      <div class="row">
        <span>${song.name}</span>
        <p>${song.artist}</p>
      </div>
      <span id="${song.src}" class="audio-duration">3:40</span>
      <audio class="${song.src}" src="songs/${song.src}.mp3"></audio>
    </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag); // Добавляем элементы списка

  const liAudioTag = ulTag.querySelector(`.${song.src}`);
  liAudioTag.addEventListener("loadeddata", () => {
    const duration = liAudioTag.duration; // Получаем продолжительность
    const totalMin = Math.floor(duration / 60); // Вычисляем минуты
    const totalSec = Math.floor(duration % 60) // Вычисляем секунды
      .toString()
      .padStart(2, "0");
    const durationTag = ulTag.querySelector(`#${song.src}`);
    durationTag.innerText = `${totalMin}:${totalSec}`; // Обновляем текст продолжительности
    durationTag.setAttribute("t-duration", `${totalMin}:${totalSec}`); // Устанавливаем атрибут с продолжительностью
  });

  // Добавляем событие клика для каждого элемента списка
  const liItem = ulTag.querySelector(`li[li-index="${index + 1}"]`);
  liItem.addEventListener("click", () => selectSong(liItem)); // Выбор песни
});

// Обновление информации о текущей воспроизводимой песне в списке
function updatePlayingSong() {
  const allLiTags = ulTag.querySelectorAll("li");

  // Удаляем класс 'playing' у всех элементов списка
  allLiTags.forEach((li) => {
    li.classList.remove("playing"); 
    const audioTag = li.querySelector(".audio-duration");
    const songDuration = audioTag.getAttribute("t-duration");
    audioTag.innerText = songDuration; // Сбрасываем на оригинальную продолжительность
  });

  // Добавляем класс 'playing' к текущей песне
  const currentLi = ulTag.querySelector(`li[li-index="${musicIndex + 1}"]`);
  currentLi.classList.add("playing");

  // Обновляем текст продолжительности на "Playing"
  const currentAudioTag = currentLi.querySelector(".audio-duration");
  currentAudioTag.innerText = "Playing";
}
