import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
  projectId: "xvksarfe",
  dataset: "production",
  apiVersion: "2025-09-17",
  useCdn: false,
});

const builder = imageUrlBuilder(client);

export function getImage(ref) {
  if (!ref) return "";

  return builder.image(ref).quality(70).format("webp").fit("max").url();
}

export function getImageSize(ref) {
  if (!ref) return "";
  const parts = ref.split("-");
  if (parts.length < 4) return "";
  return parts[2].split("x");
}

export function getModel(ref) {
  const [, id, ext] = ref.split("-"); // ["file", "6f955f28170aa3462d562127af332fd00894deb4", "glb"]
  const projectId = "xvksarfe"; // your real project ID
  const dataset = "production"; // your real dataset
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${id}.${ext}`;
}
