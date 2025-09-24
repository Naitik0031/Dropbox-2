import fetch from "node-fetch";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    const { fileName, fileContent } = JSON.parse(event.body);

    if (!fileName || !fileContent) {
      return { statusCode: 400, body: JSON.stringify({ error: "fileName and fileContent required" }) };
    }

    const dropboxToken = process.env.DROPBOX_ACCESS_TOKEN;

    const response = await fetch("https://content.dropboxapi.com/2/files/upload", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${dropboxToken}`,
        "Dropbox-API-Arg": JSON.stringify({
          path: `/${fileName}`,
          mode: "overwrite",
          autorename: true,
        }),
        "Content-Type": "application/octet-stream",
      },
      body: Buffer.from(fileContent, "base64"),
    });

    const data = await response.json();
    return { statusCode: 200, body: JSON.stringify({ success: true, data }) };

  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
}