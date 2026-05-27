/** @returns {File | null} */
export function getImageFileFromClipboardEvent(event) {
  const items = event.clipboardData?.items;
  if (!items) return null;

  const imageItem = Array.from(items).find((item) => item.type?.startsWith('image/'));
  if (!imageItem) return null;

  return imageItem.getAsFile() || null;
}
