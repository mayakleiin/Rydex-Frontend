const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const SERVER_URL = API_URL.replace(/\/api$/, "");

export function getUploadUrl(fileName?: string) {
  if (!fileName) return "";
  if (fileName.startsWith("http")) return fileName;
  return `${SERVER_URL}/uploads/${fileName}`;
}

