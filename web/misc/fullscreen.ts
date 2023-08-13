export async function triggerFullscreen() {
  if (document.fullscreenElement) return;
  await document.documentElement.requestFullscreen({
    navigationUI: "hide",
  });
  window.screen.orientation.lock("landscape");
}
