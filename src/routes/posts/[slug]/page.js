import sanityClient from '$lib/sanityClient';

export async function load({ params }) {
  const { slug } = params;

  const post = await sanityClient.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      mainImage,
      body
    }`,
    { slug }
  );

  if (!post) {
    return {
      status: 404,
      error: new Error('Post not found')
    };
  }

  return { post };
}
