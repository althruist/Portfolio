const background = document.getElementById("background");

const welcomeHeader = document.getElementById("welcomeHeader");
const currentProject = document.getElementById("currentProject");

const content = document.getElementById("content");
const header = document.getElementById("header");
const logoBox = document.getElementById('logoHeader').getBoundingClientRect();

let xPos = 0, yPos = 0;
let isAnimating = false;
let isHovering = false;

function handleResize(e) {
    if (e.matches) {
        gsap.to(header, {
            width: logoBox.width,
            duration: 0.5,
            ease: "circ.out"
        });
    } else {
        gsap.to(header, {
            width: "80%",
            duration: 0.5,
            ease: "circ.out"
        });
    }
}

const mediaQuery = window.matchMedia("(max-width: 1023px)");
mediaQuery.addEventListener("change", handleResize);
handleResize(mediaQuery);

document.addEventListener('mousemove', e => {
    const { innerWidth: w, innerHeight: h } = window;
    xPos = (e.clientX / w - 0.5) * 100;
    yPos = (e.clientY / h - 0.5) * 100;

    if (!isAnimating) {
        isAnimating = true;
        requestAnimationFrame(() => {
            gsap.to(background, {
                backgroundPosition: `calc(50% + ${xPos}px) calc(50% + ${yPos}px)`,
                duration: 0.5,
                ease: "circ.out"
            });
            isAnimating = false;
        });
    }
});

gsap.utils.toArray('.card').forEach(card => {
    if (card.classList.contains("noBounce")) return;
    card.addEventListener('mouseenter', () => {
        card.style['z-index'] = 2;
        gsap.to(card,
            { scale: 1.1, duration: 0.5, ease: 'circ.out' }
        );
    })

    card.addEventListener('mouseleave', () => {
        card.style['z-index'] = 1;
        gsap.to(card,
            { scale: 1, duration: 0.5, ease: 'circ.out' }
        );
    })

    card.addEventListener('click', () => {
        let tlClick = gsap.timeline()
        tlClick.to(card,
            { rotation: gsap.utils.random(-4, 4), scale: 1, duration: 0.1, ease: 'sine.out' }
        );
        tlClick.to(card,
            { rotation: 0, scale: 1.1, duration: 0.2, ease: 'sine.out' }
        );
    })

    if (card.classList.contains("instantShow")) return;
    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: card,
            start: "top 70%",
            toggleActions: "play none none none"
        }
    });

    tl.fromTo(card,
        { scale: 0.9, opacity: 0, y: 50 },
        { scale: 1.1, opacity: 1, y: 0, duration: 0.3 }
    )
        .to(card,
            { scale: 1, duration: 0.5, }
        );
});

welcomeHeader.addEventListener('mouseenter', () => {
    if (isHovering) return;
    isHovering = true;
    gsap.to(welcomeHeader.querySelector('.name'), {
        duration: 1,
        scrambleText: {
            text: "althruist",
            chars: "kailetrhaunist",
            revealDelay: 0,
            speed: 1,
        }
    });
})

welcomeHeader.addEventListener('mouseleave', () => {
    isHovering = false;
    gsap.to(welcomeHeader.querySelector('.name'), {
        duration: 1,
        scrambleText: {
            text: "Kieran",
            chars: "kailetrhaunist",
            revealDelay: 0,
            speed: 1,
        }
    });
})

function setFavicon(src) {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    link.href = src;
}

const darkFavicon = 'Images/SVG/Favicons/Light.ico';
const lightFavicon = 'Images/SVG/Favicons/Dark.ico';

function updateFavicon() {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDark) {
        setFavicon(lightFavicon);
    } else {
        setFavicon(darkFavicon);
    }
}

updateFavicon();

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateFavicon);