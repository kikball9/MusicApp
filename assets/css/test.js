'use strict';

/**
 * A music player ... cause why not.
 * Hotkeys:
 *   a - previous
 *   d / n - next
 *   s / p - play / pause
 *   e / r - repeat
 *   q - shuffle
 *
 * @author Holly Springsteen
 */

const colors = {
  aqua: {
    25: '#A7DCCD',
    50: '#5FBFA4',
    80: '#2F7561',
  },
  metal: {
    5: '#F3F3F1',
    20: '#CFD0C8',
    50: '#868975',
    80: '#E983D8',
    90: '#E983D8',
  },
};

// Control button elements
const buttons = {
  shuffle: document.querySelector('#controls .shuffle'),
  previous: document.querySelector('#controls .previous'),
  playPause: document.querySelector('#controls .play-pause'),
  next: document.querySelector('#controls .next'),
  repeat: document.querySelector('#controls .repeat'),
};

// Range & Time elements
const songCurrentTime = document.querySelector('.song-current-time');
const songLength = document.querySelector('.song-length');
const trackingSlider = document.querySelector('.tracking-slider');
const volumeSlider = document.querySelector('.volume-slider');

// Art
const artPlayer = document.querySelector('#art .player');
const playerArt = document.querySelector('#art .player img');
const wideArt = document.querySelector('#art .wide img');

// Playlist
const playlistBody = document.querySelector('#playlist tbody');
let playlistPlay = document.querySelectorAll('#playlist .play-pause');
let listItems = document.querySelectorAll('#playlist tbdoy tr');

// Audio Element
const audio = document.getElementById('player');

// Base route for archive url
const archiveBase = 'http://archive.org/download/';

/**
 * A base list of songs and the meta data for them.
 *
{
  title: '',
  artist: '',
  duration: 0,
  album: {
    title: '',
    art: {
      square: '',
      wide: '',
    },
  },
  url: `${archiveBase}`,
},
 */
const songList = [
  {
    title: 'Lost On You',
    artist: 'LP',
    duration: 268,
    album: {
      title: 'Lost On You',
      art: {
        square: 'https://images.genius.com/bacae5471acb7b1a4ef445c92e049848.1000x1000x1.jpg',
        wide: 'https://i.ytimg.com/vi/boeuk8N_Gsw/maxresdefault.jpg',
      },
    },
    url: `${archiveBase}/LostOnYou_201610/Lost On You.mp3`,
  },
  {
    title: 'Bad Liar',
    artist: 'Selena Gomez',
    duration: 215,
    album: {
      title: 'Bad Liar',
      art: {
        square: 'http://coverlandia.net/sites/default/files/styles/music_artwork_page/public/artworks/music/231861497612215.jpg?itok=oX-DueHT',
        wide: 'http://www.idolator.com/wp-content/uploads/sites/10/2017/05/selena-gomez-bad-liar-single-cover.jpg',
      },
    },
    url: `${archiveBase}/01BadLiar/01 Bad Liar.mp3`,
  },
  {
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    duration: 233,
    album: {
      title: '÷ (Divide)',
      art: {
        square: 'http://streamd.hitparade.ch/cdimages/ed_sheeran-%C3%B7_[divide]_a_1.jpg',
        wide: 'http://cdn2.hercampus.com/maxresdefault_0_34.jpg',
      },
    },
    url: `${archiveBase}/EdSheeranShapeOfYouOfficialLyricVideo.imack.co/Ed_Sheeran_-_Shape_Of_You_Official_Lyric_Video.imack_.co_.mp3`,
  },
  {
    title: 'Ride',
    artist: 'Twentry One Pilots',
    duration: 215,
    album: {
      title: 'Blurryface',
      art: {
        square: 'https://images-na.ssl-images-amazon.com/images/I/71Vl-qLrVtL._SL1203_.jpg',
        wide: 'https://garagemusicnews.files.wordpress.com/2015/05/gngxf0f.png',
      },
    },
    url: `${archiveBase}/Twenty_one_pilots_ride_/twenty_one_pilots_ride_(NaitiMP3.ru).mp3`,
  },
  {
    title: 'Set Fire to the Rain',
    artist: 'Adele',
    duration: 242,
    album: {
      title: '21',
      art: {
        square: 'http://fontmeme.com/images/21-by-Adele.jpg',
        wide: 'http://4.bp.blogspot.com/-TwEpqLGkEm0/T37Yb8-Fq4I/AAAAAAAAEBQ/aje5H832afw/s1600/adele+21+(1).jpg',
      },
    },
    url: `${archiveBase}/azeplaylist/Adele%20-%20Set%20Fire%20to%20the%20Rain%20Lyrics.mp3`,
  },
  {
    title: 'Girl on Fire',
    artist: 'Alicia Keys',
    duration: 225,
    album: {
      title: 'Girl on Fire',
      art: {
        square: 'http://hiphop-n-more.com/wp-content/uploads/2012/08/alicia-keys-girl-on-fire-single.jpg',
        wide: 'http://staticpopopics.popopics.com/uploads/original/alicia_keys_girl_on_fire-wallpaper-1920x1200.jpg',
      },
    },
    url: `${archiveBase}/azeplaylist/Alicia%20Keys%20-%20Girl%20On%20Fire%20%28Lyrics%29.mp3`,
  },
  {
    title: 'Swing, Swing',
    artist: 'The All American Rejects',
    duration: 233,
    album: {
      title: 'The All-American Rejects',
      art: {
        square: 'https://upload.wikimedia.org/wikipedia/en/a/a6/AAR-AAR.JPG',
        wide: 'http://s10.postimg.org/qjki5zf1l/The_All_American_Rejects_the_all_american_reject.jpg',
      },
    },
    url: `${archiveBase}/azeplaylist/All%20American%20Rejects%20-%20Swing%20Swing.mp3`,
  },
  {
    title: 'Jamie All Over',
    artist: 'Mayday Parade',
    duration: 216,
    album: {
      title: 'A Lesson in Romantics',
      art: {
        square: 'https://upload.wikimedia.org/wikipedia/en/5/53/Mpalircover.jpg',
        wide: 'http://fc08.deviantart.net/fs71/i/2012/347/3/b/a_lesson_in_romantics_1600x900_hd_wallpaper_by_cheapthrillsglmrklls-d5nypir.jpg',
      },
    },
    url: `${archiveBase}/azeplaylist/Mayday%20Parade%20-%20Jamie%20All%20Over.mp3`,
  },
  {
    title: 'Titanium',
    artist: 'David Guetta ft. Sia',
    duration: 245,
    album: {
      title: 'Nothing but the Beat',
      art: {
        square: 'http://4.bp.blogspot.com/-HJ1iG3uzVn8/TgSLn6uwRXI/AAAAAAAAAJg/qkaGRP4Lg2Q/s1600/David-Guetta-Nothing-But-The-Beat-Official-Album-Cover.jpg',
        wide: 'https://kssunews.files.wordpress.com/2011/08/davidguetta.jpg',
      },
    },
    url: `${archiveBase}/azeplaylist/David%20Guetta%20feat.%20Sia%20-%20Titanium.mp3`,
  },
];

/**
 * Based on the class list for a given element toggle the class(es) received.
 * Can accept both string with classes separated by spaces and an array of classes.
 *
 * @param {} element The dom element for which to toggle classes.
 * @param {string|string[]} classes The classes to be toggled on or off.
 */
function toggleClasses(element, classes) {
  const currentClasses = new Set(element.classList);
  // Separate string formatted classes into an array or accept array param
  const newClasses = (_.isString(classes)) ? classes.split(' ') : classes;

  for (const className of newClasses) {
    if (currentClasses.has(className)) {
      element.classList.remove(className);
    } else {
      element.classList.add(className);
    }
  }
}

/**
 * Toggle a boolean value.
 *
 * @param {boolean} boolean The boolean value to be toggled true or false.
 * @return {boolean} Returns the opposite boolean value to the received.
 */
function toggleBoolean(boolean) {
  return (!boolean);
}

/**
 * Convert seconds into a usable format for time.
 *
 * @param {number|string} seconds The amount of seconds to convert.
 * @return {string} Returns a time formatted string (--:--:--).
 */
function secondsToHms(seconds) {
  const time = {
    hours: String(Math.floor(Number(seconds) / 3600)),
    minutes: String(Math.floor(Number(seconds) % 3600 / 60)),
    seconds: String(Math.floor(Number(seconds) % 3600 % 60)),
  };

  if (time.hours && time.hours < 10) {
    time.hours = `0${time.hours}`;
  }
  if (time.minutes && time.minutes < 10) {
    time.minutes = `0${time.minutes}`;
  }
  if (time.seconds && time.seconds < 10) {
    time.seconds = `0${time.seconds}`;
  }

  if (time.hours !== '00') {
    return `${time.hours}:${time.minutes}:${time.seconds}`;
  } else {
    return `${time.minutes}:${time.seconds}`;
  }
}

/**
 * The base setup for any given audio player.
 */
class Player {
  constructor() {
    this.playing = (new Set(buttons.playPause.classList).has('on'));
    this.shuffle = (new Set(buttons.shuffle.classList).has('on'));
    this.repeat = (new Set(buttons.repeat.classList).has('on'));

    this.songIndex = 0;
    this.previousSong = songList.length - 1;

    this.song = songList[this.songIndex];

    this.randomOrder = new Set();
    this.randomIndex = 0;

    this.volume = 0.8;
  }

  /**
   * Update the meta data for the current song.
   *
   * @param {number} songIndex Optional param to force set the index of the song.
   */
  updateSong(songIndex) {
    this.previousSong = this.songIndex;
    this.songIndex = songIndex || this.songIndex;
    this.song = songList[this.songIndex];
    const song = this.song;

    audio.src = song.url;
    trackingSlider.value = 0;
    this.updateSongRangeValues();
    songLength.innerHTML = secondsToHms(song.duration);
    trackingSlider.max = song.duration;

    playerArt.src = song.album.art.square;
    wideArt.src = song.album.art.wide;

    document.querySelector(`tr[data-index="${this.previousSong}"]`).classList.remove('playing');
    toggleClasses(document.querySelector(`tr[data-index="${this.songIndex}"]`), 'playing');
  }

  /**
   * Play the audio.
   */
  play() {
    audio.play();
  }

  /**
   * Pause the audio.
   */
  pause() {
    audio.pause();
  }

  /**
   * Seek in the audio, update the time based on range value selected.
   */
  seek() {
    audio.currentTime = Number(trackingSlider.value);
    songCurrentTime.innerHTML = secondsToHms(audio.currentTime);
  }

  /**
   * Update the range values based on the current time in the song.
   */
  updateSongRangeValues() {
    const value = (trackingSlider.value / this.song.duration) * 100;
    const buffer = 0;

    songCurrentTime.innerHTML = secondsToHms(trackingSlider.value);

    trackingSlider.style.background = `linear-gradient(to right, ${colors.aqua[50]} 0%, ${colors.aqua[50]} ${value}%, ${colors.metal[50]} ${value}%, ${colors.metal[50]} ${buffer}%, ${colors.metal[80]} ${buffer}%, ${colors.metal[80]} 100%)`;
  }

  /**
   * Adjust the volume.
   */
  adjustVolume() {
    const {value} = volumeSlider;
    const buffer = 0;

    audio.volume = value;

    volumeSlider.style.background = `linear-gradient(to right, ${colors.aqua[80]} 0%, ${colors.aqua[80]} ${value * 100}%, ${colors.metal[50]} ${value * 100}%, ${colors.metal[50]} ${buffer}%, ${colors.metal[80]} ${buffer}%, ${colors.metal[80]} 100%)`;
  }
}

/**
 * The setup for any set of controls for the player.
 */
class Controls extends Player {
  /**
   * Play or pause the current list item.
   */
  playPause() {
    this.playing = toggleBoolean(this.playing);
    toggleClasses(buttons.playPause, 'on fa-play fa-pause');
    toggleClasses(artPlayer, 'playing');

    const currentClasses = new Set(buttons.playPause.classList);

    if (currentClasses.has('on')) {
      this.play();
    } else {
      this.pause();
    }
  }

  /**
   * Go to the next item in the list.
   */
  next() {
    this.previousSong = this.songIndex;
    let playNext = true;

    toggleClasses(document.querySelector(`tr[data-index="${this.songIndex}"]`), 'playing');

    if (this.shuffle) {
      this.randomIndex++;

      if (this.randomIndex >= this.randomOrder.size) {
        this.randomIndex = 0;

        playNext = (this.repeat);
      }

      this.songIndex = Array.from(this.randomOrder)[this.randomIndex];
    } else {
      this.songIndex++;

      if (this.songIndex >= songList.length) {
        this.songIndex = 0;

        playNext = (this.repeat);
      }
    }

    this.updateSong();

    if (this.playing) {
      if (playNext) {
        this.play();
      } else {
        this.playPause();
      }
    }
  }

  /**
   * Go to the previous item in the list.
   */
  previous() {
    toggleClasses(document.querySelector(`tr[data-index="${this.songIndex}"]`), 'playing');

    if (this.shuffle) {
      if (this.randomIndex === 0) {
        this.randomIndex = this.randomOrder.size;
      }
      this.randomIndex--;

      this.songIndex = Array.from(this.randomOrder)[this.randomIndex];
    } else {
      if (this.songIndex === 0) {
        this.songIndex = songList.length;
      }
      this.songIndex--;
    }

    this.updateSong();

    if (this.playing) {
      this.play();
    }
  }

  /**
   * Shuffle the list, play in a random order.
   */
  toggleShuffle() {
    this.shuffle = toggleBoolean(this.shuffle);
    toggleClasses(buttons.shuffle, 'on');
    const currentClasses = new Set(buttons.shuffle.classList);

    if (currentClasses.has('on')) {
      this.randomOrder = new Set();
      this.randomIndex = 0;

      let randomIndex = this.songIndex;

      for (let index = 0; index < songList.length; index++) {
        // While loop to ensure that the index being added to the random order is unique, else changes the index value
        while (this.randomOrder.has(randomIndex)) {
          randomIndex = Math.floor(Math.random() * songList.length);
        }

        this.randomOrder.add(randomIndex);
      }
    }
  }

  /**
   * Repeat/loop the list that is currently playing.
   */
  toggleRepeat() {
    this.repeat = toggleBoolean(this.repeat);
    toggleClasses(buttons.repeat, 'on');
  }
}


// Instantiate the controls
const controls = new Controls();

// Add event listeners for the buttons
buttons.playPause.addEventListener('click', () => {
  controls.playPause();
});
buttons.next.addEventListener('click', () => {
  controls.next();
});
buttons.previous.addEventListener('click', () => {
  controls.previous();
});
buttons.shuffle.addEventListener('click', () => {
  controls.toggleShuffle();
});
buttons.repeat.addEventListener('click', () => {
  controls.toggleRepeat();
});


audio.onended = () => {
  // Once a song is over play next song.
  controls.next();
};
audio.ontimeupdate = () => {
  trackingSlider.value = audio.currentTime;
  controls.updateSongRangeValues();
};

// Update the range values on change or moving the scrubber.
trackingSlider.addEventListener('change', () => {
  controls.updateSongRangeValues();
  controls.seek();
});
trackingSlider.addEventListener('mousemove', () => {
  controls.updateSongRangeValues();
});

volumeSlider.addEventListener('change', () => {
  controls.adjustVolume();
});
volumeSlider.addEventListener('mousemove', () => {
  controls.adjustVolume();
});

// That's right ... hotkeys!
document.onkeypress = (event) => {
  switch (event.keyCode) {
    // a - previous
    case 97: {
      controls.previous();
      break;
    }
    // d / n - next
    case 100:
    case 110: {
      controls.next();
      break;
    }
    // s / p - play / pause
    case 115:
    case 112: {
      controls.playPause();
      break;
    }
    // e / r - repeat
    case 101:
    case 114: {
      controls.toggleRepeat();
      break;
    }
    // q - shuffle
    case 113: {
      controls.toggleShuffle();
      break;
    }
  }
};


/**
 * Build the playlist from the give array of songs.
 */
function buildPlaylist() {
  // Add the songs to the dom
  let html = '';
  songList.forEach((song, index) => {
    html += `
<tr data-index="${index}">
  <td class="play-pause"><img src="${song.album.art.square}"></td>
  <td>${song.title}</td>
  <td>${song.artist}</td>
  <td>${song.album.title}</td>
  <td>${secondsToHms(song.duration)}</td>
</tr>
`;
  });
  playlistBody.innerHTML = html;

  // Update the list items
  listItems = document.querySelectorAll('#playlist tbody tr');
  playlistPlay = document.querySelectorAll('#playlist .play-pause');

  // Add event listeners to the list items
  for (const listItem of listItems) {
    listItem.addEventListener('click', (event) => {
      const songIndex = event.target.parentElement.dataset.index;
      controls.updateSong(songIndex);

      if (controls.playing) {
        controls.play();
      }
    });

    listItem.addEventListener('dblclick', (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (!controls.playing) {
        controls.playPause();
      }
    });
  }
  
  for (const playlistPlayButton of playlistPlay) {
    playlistPlayButton.addEventListener('click', (event) => {
      if (!controls.playing) {
        controls.playPause();
      }
    });
  }
}


// Initiate the setup.
window.onload = () => {
  buildPlaylist();
  controls.updateSong();
  controls.adjustVolume();
};