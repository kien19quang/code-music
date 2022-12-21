/* 
    1. Render song -> OK
    2. Scroll Top -> OK
    3. Play / pause / seek -> OK
    4. CD rorate -> OK
    5. Next / Prev -> OK
    6. Random -> OK
    7. Next / Repeat when ended -> OK
    8. Active song -> OK
    9. Scroll active song into view -> OK
    10. Play song when click
*/



const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('.progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist');


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: "Chìm Sâu",
            singer: "MCK ft Trung Trần",
            path: './assets/music/sound.mp3',
            image: "https://o.vdoc.vn/data/image/2022/02/28/loi-bai-hat-chim-sau-rpt-mck-700.jpg"
        },
        {
            name: "Va vào giai điệu này",
            singer: "MCK",
            path: "./assets/music/y2mate.com - Va Vào Giai Điệu Này nhưng có tune  MCK aka Nger_320kbps.mp3",
            image:
                "https://i.ytimg.com/vi/CEBJtxYeEwM/0.jpg"
        },
        {
            name: "Your Smile",
            singer: "Obito ft. Hạnh Ngân",
            path:
                "./assets/music/y2mate.com - Obito ft hnhngan live YOUR SMILE  Emma x Seachains x Obito    Collaborative Session 19_320kbps.mp3",
            image: "https://i.ytimg.com/vi/ZqDBgYPpUTg/0.jpg"
        },
        {
            name: "Anh Biết",
            singer: "Nger",
            path: "./assets/music/y2mate.com - Anh Biết  Nger Lyrics_320kbps.mp3",
            image:
                "https://i.ytimg.com/vi/Z-mpDwTLdaQ/0.jpg"
        },
        {
            name: "Lớp 13",
            singer: "Tage",
            path: "./assets/music/y2mate.com - Tage  Lớp 13 Official Lyric Video_320kbps.mp3",
            image:
                "https://i.ytimg.com/vi/Pv7JKxRd7jo/0.jpg"
        },
        {
            name: "Anh yêu vội thế cứ thích buông lời trêu đùa",
            singer: "La La Trần",
            path:
                "./assets/music/y2mate.com - Anh Yêu Vội Thế Cứ Thích Buông Lời Trêu Đùa  Anh Yêu Vội Thế RIN Music Remix  LaLa Trần_320kbps.mp3",
            image:
                "https://i.ytimg.com/vi/FxBR-wUUtAk/0.jpg"
        },
        {
            name: "Là bạn không thể yêu",
            singer: "Lou Hoàng",
            path: "./assets/music/y2mate.com - LÀ BẠN KHÔNG THỂ YÊU  LOU HOÀNG  STAGE VERSION_320kbps (1).mp3",
            image:
                "https://i.ytimg.com/vi/TLVK0iTDev0/0.jpg"
        }
    ],

    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },

    handleEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // Xử lí quay / dừng
        const cdThunbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity,
        })
        cdThunbAnimate.pause();


        // Xử lí phóng to thu nhỏ CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;

            const cdWidthNew = cdWidth - scrollTop

            cd.style.width = cdWidthNew > 0 ? cdWidthNew + 'px' : 0;
            cd.style.opacity = cdWidthNew / cdWidth;

        }

        // Xử lí khi play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            }
            else {
                audio.play();
            }
        }


        // Khi song được play 
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing')
            cdThunbAnimate.play();
        }


        // Khi song được pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing')
            cdThunbAnimate.pause();
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent
            }
        }

        // Xử lí khi tua song
        progress.onchange = function (e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime
        }


        // Khi next song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            }
            else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // Khi prev song
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            }
            else {
                _this.prevSong();
                _this.render();
            }
        }

        // Xử lí random
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        // Xử lí repeat
        repeatBtn.onclick = function (e) {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        // Xử lí khi audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            }
            else {
                nextBtn.click();
            }
        }

        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)');
            if (songNode || e.target.closest('.option')) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
            }
        }
    },

    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path;
    },

    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (this.currentIndex === newIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        }, 300)
    },

    start: function () {

        // Gán cấu hình từ config vào ứng dụng
        this.loadConfig();

        // Định nghĩa các thuộc tính cho Object
        this.defineProperties();


        // Xử lí các sự kiện
        this.handleEvents();

        // Tải thông tin bài hát đầu tiên vào UI khi mới chạy
        this.loadCurrentSong()

        // Render playlist
        this.render();

        // Hiển thị trạng thái ban đầu của button repeat, random
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    }

};

app.start();
