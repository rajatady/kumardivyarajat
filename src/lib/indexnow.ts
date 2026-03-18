const INDEXNOW_KEY = "0901247967086fcaf9c812cedf4eae47";
const SITE_URL = "https://kumardivyarajat.com";

export async function submitToIndexNow(urls: string[]) {
  if (process.env.NODE_ENV !== "production") return;

  try {
    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: "kumardivyarajat.com",
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
      }),
    });
  } catch {
    // Silent fail — indexing is best-effort
  }
}
