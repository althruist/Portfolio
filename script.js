import { createClient } from 'https://esm.sh/@sanity/client';

const background = document.getElementById("background");
const welcomeHeader = document.getElementById("welcomeHeader");
const content = document.getElementById("content");
const header = document.getElementById("header");

let xPos = 0, yPos = 0;
let isAnimating = false;
let isHovering = false;

const client = createClient({
    projectId: 'xvksarfe',
    dataset: 'production',
    apiVersion: '2023-01-01',
    useCdn: false,
});

const posts = await client.fetch('*[_type == "post"]{title, slug, mainImage, categories, collaborators, link, created, body}');

ScrollTrigger.create({
    start: 100,
    onUpdate: self => {
        if (self.scroll() > 100) {
            gsap.to(header, { width: '0%', duration: 1, ease: 'circ.out' });
        } else {
            gsap.to(header, { width: '80%', duration: 1, ease: 'circ.out' });
        }
    }
});

posts.forEach(post => {
    console.log(post.title);
    let card = document.createElement("div");
    let title = document.createElement("h1");

    card.id = post.slug;
    card.classList.add("card", "instantShow");
    title.innerText = post.title;

    content.appendChild(card);
    card.appendChild(title);
});

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

const darkFavicon = 'Images/Favicons/Light.ico';
const lightFavicon = 'Images/Favicons/Dark.ico';

function updateFavicon() {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDark) {
        setFavicon(darkFavicon);
    } else {
        setFavicon(lightFavicon);
    }
}

updateFavicon();

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateFavicon);