let currentIntervalId = null;

const RunScroll = (Ypixels, delay) => {
  const scrollInterval = setInterval(() => {
    window.scrollBy(0, Number(Ypixels));
  }, Number(delay));
  return scrollInterval;
};

const StopScroll = () => {
  if (currentIntervalId != null) {
    clearInterval(currentIntervalId);
    currentIntervalId = null;
  }
};

const StartScroll = (obj) => {
  StopScroll();
  const intervalid = RunScroll(obj.Ypixels, obj.delay);
  currentIntervalId = intervalid;
  return intervalid;
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { obj } = request;

  if (!obj) {
    sendResponse(null);
    return true;
  }

  switch (obj.action) {
    case "start":
    case "resume":
      if (obj.Ypixels != null && obj.delay != null) {
        const intervalid = StartScroll(obj);
        sendResponse({
          ...obj,
          intervalid: intervalid,
        });
      } else {
        sendResponse(null);
      }
      break;

    case "pause":
    case "stop":
      StopScroll();
      sendResponse({ success: true });
      break;

    default:
      // Legacy support for old message format
      if (obj.toggle != null && obj.Ypixels != null && obj.delay != null) {
        const intervalid = StartScroll(obj);
        sendResponse({
          ...obj,
          intervalid: intervalid,
        });
      } else {
        sendResponse(null);
      }
      break;
  }

  return true;
});

// Keyboard shortcut support on the page itself
document.addEventListener("keydown", (e) => {
  // Only trigger if not in an input field
  if (
    e.target.tagName === "INPUT" ||
    e.target.tagName === "TEXTAREA" ||
    e.target.isContentEditable
  ) {
    return;
  }

  // Escape key stops scrolling
  if (e.code === "Escape" && currentIntervalId != null) {
    StopScroll();
  }
});
