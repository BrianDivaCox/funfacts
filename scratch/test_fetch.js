async function test() {
  const url = "https://script.google.com/macros/s/AKfycbxy4eoe4_VceSJrSxzX-tstmnLuRGKKkMr_VNoarVgRf5Qh-ByEGQwwJb9qqtmSIpI/exec?action=getFacts";
  const res = await fetch(url, { redirect: "follow" });
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Final URL:", res.url);
  console.log("Body preview:\n", text.substring(0, 500));
  
  const redirectMatch = text.match(/href="([^"]+)"/i) || text.match(/location\.href\s*=\s*"([^"]+)"/i) || text.match(/(https:\/\/script\.googleusercontent\.com[^\s"']+)/i);
  if (redirectMatch) {
    console.log("Found redirect URL:", redirectMatch[1]);
    const echoRes = await fetch(redirectMatch[1]);
    const echoText = await echoRes.text();
    console.log("Echo status:", echoRes.status);
    console.log("Echo text preview:\n", echoText.substring(0, 500));
  }
}
test();
