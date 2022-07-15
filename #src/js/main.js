    // VARS
const SLIDER_ACTIVE = true;
const CUSTOM_CURSORS_ACTIVE = true;
const ANIMATIONS_ACTIVE = true;
const MAPS_ACTIVE = true;

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

    try {
        if (ANIMATIONS_ACTIVE) initAos();
    } catch (error) {
        console.log(`CAN'T INIT AOS: ${error}`);
    }

    try {
        headerBehaviour();
    } catch (error) {
        console.log(`CAN'T FIND HEADER: ${error}`);
    }

    try {
        burgerMenu();
    } catch (error) {
        console.log(`CAN'T FIND BURGER: ${error}`);
    }

    try {
        formValidateInit();
    } catch (error) {
        console.log(`CAN'T FIND FORM: ${error}`);
    }
})

// FUNCTIONS
// header behaviour
function headerBehaviour() {
    let lastScrollTop = 0;
    window.addEventListener("scroll", () => {
        let nav = document.querySelector('header');
        if (nav != undefined || nav != null) {
            let offsetTop = nav.offsetTop + window.scrollY;
            let st = window.pageYOffset || document.documentElement.scrollTop;

            if (st > lastScrollTop && offsetTop != 0){
                nav.classList.remove("fixed");
                nav.classList.remove("static");
            } else if (st < lastScrollTop && offsetTop != 0) {
                nav.classList.remove("static");
                nav.classList.add("fixed");
            } else {
                nav.classList.add("static");
                nav.classList.remove("fixed");
            }
            lastScrollTop = st <= 0 ? 0 : st;
        } else {
            console.log("CAN'T FIND HEADER");
        }
    })
}

// burger menu
function burgerMenu() {
    let nav = document.querySelector("nav");
    let nav_list = nav.querySelector(".nav__wrap");
    let nav_btn = nav.querySelector(".burger-menu__btn");

    let body = document.querySelector("body");

    if (nav != undefined || nav != null) {
        
        nav_btn.addEventListener("click", () => {
            nav_btn.classList.toggle("active");
            nav_list.classList.toggle("active");
        
            body.classList.toggle("stop-scroll");
        })

    } else {
        console.log("CAN'T FIND NAV");
    }    
}

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

// init aos
function initAos() {
    AOS.init({
        duration: 700,
        easing: 'ease-in-out',
        offset: 60,
        once: true,
    });
}

// form validation init
function formValidateInit() {
    // form
    const form_selector = ".feedback__form";
    const form = document.querySelectorAll(form_selector);

    if (form.length != 0) {
        // on submit
        for (let i = 0; i < form.length; i++) {
            form[i].addEventListener("submit", (e) => { e.preventDefault(); formSend(form[i]) });
        }
    }

    // form send
    function formSend(form) {
        // test for valid
        let valid = isValid(form);

        // callback
        if (valid) {
            alert("Submited!");
        } else {
            console.log(`ERROR ON: ${form}`);
        }
    }

    // is valid
    function isValid(form) {
        let error = 0;
        let req_selector = "._req";
        let formReq = form.querySelectorAll(req_selector);

        formReq.forEach(input => {
            formRemoveError(input);

            if (input.getAttribute('type') == 'email') {
                if (!emailTest(input)) {
                    formAddError(input);
                    error++;
                }
            } else if (input.getAttribute('type') == 'tel') {
                if(!telTest(input)) {
                    formAddError(input);
                    error++;
                }
            } else if (input.getAttribute('name') == 'name') {
                if(!nameTest(input)) {
                    formAddError(input);
                    error++;
                }
            } else {
                if (input.value == '') {
                    formAddError(input);
                    error++;
                }
            }
        })

        console.log(`${error} ERRORS ON: ${form}`);
        return (error > 0) ? false : true;
    }
    
    // form add error
    function formAddError(input) {
        input.parentNode.classList.add("_error");
        input.classList.add("_error");
    }

    // form remove error
    function formRemoveError(input) {
        input.parentNode.classList.remove("_error");
        input.classList.remove("_error");
    }

    // email test
    function emailTest(input) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(input.value);
    }

    // tel test
    function telTest(input) {
        return /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/g.test(input.value);
    }

    // name test
    function nameTest(input) {
        return /(^[a-zA-Z][a-zA-Z\s]{0,20}[a-zA-Z]$)/g.test(input.value);
    }
}