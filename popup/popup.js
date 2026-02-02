import { Utils, Ui, Messages, Storaging } from "../scripts/Helper.js";

let isScrolling = false;
let isPaused = false;

const updateStatus = (status) => {
  const statusIcon = document.getElementById("statusIcon");
  const statusText = document.getElementById("statusText");
  const startBtn = document.getElementById("start");
  const pauseBtn = document.getElementById("pause");

  statusIcon.className = "status-icon";

  switch (status) {
    case "scrolling":
      statusIcon.classList.add("active");
      statusText.textContent = chrome.i18n.getMessage("status_scrolling") || "Scrolling...";
      startBtn.style.display = "none";
      pauseBtn.style.display = "block";
      pauseBtn.textContent = chrome.i18n.getMessage("button_pause") || "Pause";
      pauseBtn.className = "button warning";
      isScrolling = true;
      isPaused = false;
      break;
    case "paused":
      statusIcon.classList.add("paused");
      statusText.textContent = chrome.i18n.getMessage("status_paused") || "Paused";
      startBtn.style.display = "none";
      pauseBtn.style.display = "block";
      pauseBtn.textContent = chrome.i18n.getMessage("button_resume") || "Resume";
      pauseBtn.className = "button success";
      isScrolling = false;
      isPaused = true;
      break;
    case "ready":
    default:
      statusText.textContent = chrome.i18n.getMessage("status_ready") || "Ready";
      startBtn.style.display = "block";
      pauseBtn.style.display = "none";
      isScrolling = false;
      isPaused = false;
      break;
  }
};

const initContent = () => {
  document.getElementById("reset").textContent =
    chrome.i18n.getMessage("context_menu_stop") || "Reset";
  document.getElementById("start").textContent =
    chrome.i18n.getMessage("context_menu_start") || "Start";
  document.getElementById("yPixelsLabel").textContent =
    chrome.i18n.getMessage("default_label_yAxis") || "Distance (px)";
  document.getElementById("delayLabel").textContent =
    chrome.i18n.getMessage("default_label_delay") || "Speed (ms)";
  document.getElementById("toggleLabel").textContent =
    chrome.i18n.getMessage("default_label_toggle") || "Sync";

  const toggleIn = document.getElementById("toggle");
  toggleIn.checked = chrome.i18n.getMessage("default_toggle") === "true";

  const delayIn = document.getElementById("delay");
  delayIn.value = chrome.i18n.getMessage("default_delay") || "300";
  delayIn.max = Number(chrome.i18n.getMessage("default_max_delay") || "2000");
  delayIn.min = 10;

  const yAxisIn = document.getElementById("Ypixels");
  yAxisIn.value = chrome.i18n.getMessage("default_yAxis") || "30";
  const maxY = Number(chrome.i18n.getMessage("default_max_yAxis") || "1000");
  yAxisIn.max = maxY;
  yAxisIn.min = -maxY;

  updateStatus("ready");
};

const initContent_storage = async (ActiveTab) => {
  await Messages.StorageRunOnLoad(ActiveTab, ["delay", "Ypixels", "toggle"]);

  const oldObj = await Storaging.GetStorage(ActiveTab.url);

  if (oldObj && oldObj.isScrolling) {
    updateStatus("scrolling");
  } else if (oldObj && oldObj.isPaused) {
    updateStatus("paused");
  }

  const InputListener = async () => {
    const currentObj = await Storaging.GetStorage(ActiveTab.url);
    if (!document.getElementById("toggle").checked) {
      return;
    }
    await Messages.UpdateScroll({
      _tabid: ActiveTab.id,
      _url: ActiveTab.url,
      oldObj: currentObj,
    });
    updateStatus("scrolling");
  };

  if (document.getElementById("toggle").checked) {
    Ui.HideElementsById(["reset", "start", "pause"]);
    Utils.AddValuesListener(["delay", "Ypixels"], "change", InputListener);
  } else {
    Ui.ShowElementsById(["reset"]);
    Utils.RemoveValueListener(["delay", "Ypixels"], "change", InputListener);
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  initContent();
  const ActiveTab = await Utils.getActiveTab();
  await initContent_storage(ActiveTab);

  const startScroll = async () => {
    const delay = document.getElementById("delay").value;
    const Ypixels = document.getElementById("Ypixels").value;

    if (!delay || !Ypixels || delay < 10) {
      alert(chrome.i18n.getMessage("error_invalid_values") || "Please enter valid values (Speed must be at least 10ms)");
      return;
    }

    const oldObj = await Storaging.GetStorage(ActiveTab.url);
    const result = await Messages.UpdateScroll({
      _tabid: ActiveTab.id,
      _url: ActiveTab.url,
      oldObj: oldObj,
    });

    if (result) {
      updateStatus("scrolling");
    }
  };

  const pauseScroll = async () => {
    const oldObj = await Storaging.GetStorage(ActiveTab.url);
    const result = await Messages.PauseScroll({
      _tabid: ActiveTab.id,
      _url: ActiveTab.url,
      oldObj: oldObj,
    });

    if (result) {
      updateStatus("paused");
    }
  };

  const resumeScroll = async () => {
    const oldObj = await Storaging.GetStorage(ActiveTab.url);
    const result = await Messages.ResumeScroll({
      _tabid: ActiveTab.id,
      _url: ActiveTab.url,
      oldObj: oldObj,
    });

    if (result) {
      updateStatus("scrolling");
    }
  };

  const resetScroll = async () => {
    const oldObj = await Storaging.GetStorage(ActiveTab.url);
    await Messages.StopScroll({
      _tabid: ActiveTab.id,
      _url: ActiveTab.url,
      oldObj: oldObj,
    });
    updateStatus("ready");
  };

  document.getElementById("start").addEventListener("click", startScroll);

  document.getElementById("pause").addEventListener("click", async () => {
    if (isPaused) {
      await resumeScroll();
    } else {
      await pauseScroll();
    }
  });

  document.getElementById("reset").addEventListener("click", async () => {
    await resetScroll();
  });

  document.getElementById("toggle").addEventListener("click", async (e) => {
    const isToggled = e.target.checked;

    const InputListener = async () => {
      const currentObj = await Storaging.GetStorage(ActiveTab.url);
      await Messages.UpdateScroll({
        _tabid: ActiveTab.id,
        _url: ActiveTab.url,
        oldObj: currentObj,
      });
      updateStatus("scrolling");
    };

    if (isToggled) {
      await startScroll();
      Ui.HideElementsById(["reset", "start", "pause"]);
      Utils.AddValuesListener(["delay", "Ypixels"], "change", InputListener);
    } else {
      await resetScroll();
      Ui.ShowElementsById(["reset"]);
      Utils.RemoveValueListener(["delay", "Ypixels"], "change", InputListener);
    }
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", async (e) => {
    if (e.code === "Space" && document.activeElement.tagName !== "INPUT") {
      e.preventDefault();
      if (isScrolling) {
        await pauseScroll();
      } else if (isPaused) {
        await resumeScroll();
      } else {
        await startScroll();
      }
    } else if (e.code === "Escape") {
      await resetScroll();
    }
  });
});
