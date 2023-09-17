const RunScroll = (Ypixels, delay) => {
  const scrollInterval = setInterval(() => {
    window.scrollBy(0, Number(Ypixels));
  }, Number(delay));
  return scrollInterval;
};

const StartScroll = async (obj) => {
  if (obj.intervalid != null) {
    clearInterval(obj.intervalid);
  }
  const intervalid = RunScroll(obj.Ypixels, obj.delay);
  return intervalid;
};

const EventListenerRegisteration = {
  onMessage: () => {
    chrome.runtime.onMessage.addListener(async (request, sender, response) => {
      const { obj } = request;
      if (obj.toggle != null && obj.Ypixels != null && obj.delay != null) {
        const res = await StartScroll(obj);
        obj.intervalid = res;
        response(obj);
      }
    });
  },
};

EventListenerRegisteration.onMessage();
