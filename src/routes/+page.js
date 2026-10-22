import { client } from "$lib/logic/data.js";

export async function load() {
  const posts = await client.fetch(
    `*[_type == "post" && homepage == true]{
      title,
      slug,
      mainImage{asset->{_id}, alt},
      categories[]->{title},
      featured,
      created
    }`,
  );

  posts.sort((a, b) => {
    if ((b.featured === true) !== (a.featured === true)) {
      return (b.featured === true) - (a.featured === true);
    }
    return new Date(b.created) - new Date(a.created);
  });

  return { posts };
}
