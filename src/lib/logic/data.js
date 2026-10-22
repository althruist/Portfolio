import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const projectId = "xvksarfe";
const dataset = "production";

export const client = createClient({
  projectId: projectId,
  dataset: dataset,
  apiVersion: "2025-09-17",
  useCdn: true,
});

const builder = imageUrlBuilder(client);

export function getImage(ref, width) {
  if (!ref) return "";
  let img = builder.image(ref).quality(75).format("webp").fit("max");
  if (width) img = img.width(width);
  return img.url();
}

export function getSrcSet(ref, widths = [400, 800, 1200, 1600, 2000]) {
  if (!ref) return "";
  return widths.map((w) => `${getImage(ref, w)} ${w}w`).join(", ");
}

export function getImageSize(ref) {
  if (!ref) return "";
  const parts = ref.split("-");
  if (parts.length < 4) return "";
  return parts[2].split("x");
}

export function getAsset(ref) {
  const [, id, ext] = ref.split("-");
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${id}.${ext}`;
}
