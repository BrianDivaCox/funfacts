async function testPost() {
  const webAppUrl = "https://script.google.com/macros/s/AKfycbxy4eoe4_VceSJrSxzX-tstmnLuRGKKkMr_VNoarVgRf5Qh-ByEGQwwJb9qqtmSIpI/exec";
  const payload = {
    action: "addFact",
    factText: "Test fact from Node fetch POST " + Date.now(),
    category: "Test",
    keywords: ["test"],
    status: "Posted",
    source: "Node Test"
  };

  console.log("Sending initial POST with redirect: manual...");
  let res = await fetch(webAppUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    redirect: "manual"
  });

  console.log("Initial response status:", res.status);
  const location = res.headers.get("location");
  console.log("Location header:", location);

  if (location) {
    console.log("Following redirect to location with GET...");
    let echoRes = await fetch(location, { method: "GET", redirect: "follow" });
    console.log("Echo status:", echoRes.status);
    let echoText = await echoRes.text();
    console.log("Echo text preview:\n", echoText.substring(0, 300));
  }
}

testPost();
