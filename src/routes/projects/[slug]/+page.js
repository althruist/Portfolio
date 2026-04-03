import { client } from "$lib/logic/data.js";
import { error } from "@sveltejs/kit";

export async function load({ params }) {
  const project = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      slug,
      mainImage{asset->{_id,url},alt},
      categories[]->{title},
      collaborators,
      created,
      body,
      links
    }`,
    {
      slug: params.slug
    }
  );

  if (!project) {
    throw error(404, "Not found");
  }

  return { project };
}