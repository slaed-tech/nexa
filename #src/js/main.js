// VARS
const SLIDER_ACTIVE = true;
const CUSTOM_CURSORS_ACTIVE = true;

// ON LOAD DOAM
document.addEventListener("DOMContentLoaded", () => {
    try {
        initSplide()
    } catch (error) {
        console.log(`CAN'T INIT SPLIDE: ${error}`);
    }

    try {
        if (CUSTOM_CURSORS_ACTIVE) cursorInit();
    } catch (error) {
        console.log(`CAN'T INIT CURSORS: ${error}`);
    }
})

// FUNCTIONS
// header behaviour
window.addEventListener("scroll", () => {
    let nav = document.querySelector('header');
    if (nav != undefined || nav != null) {
        let offsetTop = nav.offsetTop + window.scrollY;
        
        if (offsetTop > 0) {
            nav.classList.add("fixed");
        }
        else {
            nav.classList.remove("fixed");
        }
    } else {
        console.log("CAN'T FIND HEADER");
    }
})

// slider
function initSplide() {
    let options = {
        "default__slider": {
            type: "slide",
            rewindByDrag: true,
            gap: "30px",
            autoWidth: true,
            arrows: false,
            pagination: false,
            drag: "free",
            speed: 50,
        },
    };
    let splides = document.querySelectorAll('.splide');
    if (splides.length != 0) {
        for (let i = 0; i < splides.length; i++) {
            let style = splides[i].classList[0];
            let op = options[style];  
            new Splide(splides[i], op).mount();
        }
    } else {
        console.log("CAN'T FIND SPLIDE");
    }
}

// custom cursors
function cursorInit() {
    let cursor = {
        delay: 8,
        _x: 0,
        _y: 0,
        endX: (window.innerWidth / 2),
        endY: (window.innerHeight / 2),
        cursorVisible: false,
        cursorEnlarged: false,
        $dot: document.querySelectorAll('.cursor'),
        
        init: function() {
            this.setupEventListeners();
            this.animateDot();
        },

        setupEventListeners: function() {
            let self = this;
            
            document.addEventListener('mousedown', function() {
                self.cursorEnlarged = true;
                self.toggleCursorSize();
            });
            document.addEventListener('mouseup', function() {
                self.cursorEnlarged = false;
                self.toggleCursorSize();
            })
    
            document.addEventListener('mousemove', function(e) {
                self.endX = e.clientX;
                self.endY = e.clientY;

                self.$dot.forEach(el => {
                    el.style.top = self.endY + 'px';
                    el.style.left = self.endX + 'px';
                })
            });

            document.querySelectorAll(".drag-hover").forEach(function(el) {
                el.addEventListener('mouseenter', function(e) {
                    self.cursorVisible = true;
                    self.toggleCursorVisibility();
                });
                el.addEventListener('mouseleave', function(e) {
                    self.cursorVisible = false;
                    self.toggleCursorVisibility();
                });
            });
        },
        
        animateDot: function() {
            let self = this;
            
            self._x += (self.endX - self._x) / self.delay;
            self._y += (self.endY - self._y) / self.delay;

            self.$dot.forEach(el => {
                el.style.top = self._y + 'px';
                el.style.left = self._x + 'px';
            })
            
            requestAnimationFrame(this.animateDot.bind(self));
        },
        
        toggleCursorSize: function() {
            let self = this;

            self.$dot.forEach(el => {
                if (self.cursorEnlarged) {
                    el.style.transform = 'translate(-50%, -50%) scale(0.8)';
                } else {
                    el.style.transform = 'translate(-50%, -50%) scale(1)';
                }
            })
        },
        
        toggleCursorVisibility: function() {
            let self = this;

            self.$dot.forEach(el => {
                if (self.cursorVisible) {
                    el.style.opacity = "80%";
                } else {
                    el.style.opacity = "0";
                }
            })
        }
    }
    if (cursor.$dot.length != 0) {
        cursor.init();
    } else {
        console.log("CAN'T FIND THE CURSOR");
    }
}