export async function downloadImage(imageUrl: string): Promise<Buffer> {
  const response = await fetch(imageUrl);

  if (!response.ok) {
    throw new Error(`Failed to download image ${imageUrl}: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
