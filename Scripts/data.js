import { createClient } from 'https://esm.sh/@sanity/client';

const client = createClient({
    projectId: 'xvksarfe',
    dataset: 'production',
    apiVersion: '2023-01-01',
    useCdn: false,
});

const posts = await client.fetch('*[_type == "post"]{title, slug, mainImage, categories, collaborators, link, created, body}');
const featured = await client.fetch('*[_type == "featured"]{title, mainImage, categories, collaborators, link, updated, body}');

function getImage(imageRef) {
    const [_, id, dimensions, format] = imageRef.split('-');
    return `https://cdn.sanity.io/images/xvksarfe/production/${id}-${dimensions}.${format}`;
}

featured.forEach(post => {
    let [datePart, timePartWithZ] = post.updated.split('T');
    let image = document.createElement("img");

    let timePart = timePartWithZ.replace("Z", "").substring(0, 5);

    currentProject.querySelector('h1').innerText = post.title
    currentProject.querySelector('#date').innerText += (` ${datePart} ${timePart}`);

    post.body.forEach(block => {
        block.children.forEach(paragraph => {
            currentProject.querySelector('#body').innerHTML += `${paragraph.text}<br><br>`
        });
        const imageUrl = getImage(post.mainImage.asset._ref);
        image.src = imageUrl;
        currentProject.appendChild(image);
    });
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