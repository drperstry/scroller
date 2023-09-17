import { Utils, Ui, Messages, Storaging } from "../scripts/Helper.js";

const initContent = () => {
  document.getElementById("reset").innerHTML =
    chrome.i18n.getMessage("context_menu_stop");
  document.getElementById("start").innerHTML =
    chrome.i18n.getMessage("context_menu_start");
  document.getElementById("yPixelsLabel").innerHTML = chrome.i18n.getMessage(
    "default_label_yAxis"
  );
  document.getElementById("delayLabel").innerHTML = chrome.i18n.getMessage(
    "default_label_delay"
  );
  document.getElementById("toggleLabel").innerHTML = chrome.i18n.getMessage(
    "default_label_toggle"
  );

  const toggleIn = document.getElementById("toggle");
  toggleIn.checked =
    chrome.i18n.getMessage("default_toggle") == "true" ? true : false;

  const delayIn = document.getElementById("delay");
  delayIn.value = chrome.i18n.getMessage("default_delay");
  delayIn.max = Number(chrome.i18n.getMessage("default_max_delay"));
  delayIn.min = 0;

  const yAxisIn = document.getElementById("Ypixels");
  yAxisIn.value = chrome.i18n.getMessage("default_yAxis");
  yAxisIn.max = Number(chrome.i18n.getMessage("default_max_yAxis"));
  yAxisIn.min = -1 * Number(chrome.i18n.getMessage("default_max_yAxis"));

  document.getElementById("toggle").checked == false
    ? Ui.ShowElementsById(["reset", "start"])
    : Ui.HideElementsById(["reset", "start"]);
};

const initContent_storage = async (ActiveTab) => {
  await Messages.StorageRunOnLoad(ActiveTab, ["delay", "Ypixels", "toggle"]);

  const InputListener = async () => {
    const oldObj = await Storaging.GetStorage(ActiveTab.url);
    if (!oldObj.toggle) {
      return;
    }
    await Messages.UpdateScroll({
      _tabid: ActiveTab.id,
      _url: ActiveTab.url,
      oldObj: oldObj,
    });
  };

  if (document.getElementById("toggle").checked) {
    Ui.HideElementsById(["reset", "start"]);
    Utils.AddValuesListener(["delay", "Ypixels"], "change", InputListener);
  } else {
    Ui.ShowElementsById(["reset", "start"]);
    Utils.RemoveValueListener(["delay", "Ypixels"], "change", InputListener);
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  initContent();
  const ActiveTab = await Utils.getActiveTab();
  await initContent_storage(ActiveTab);

  const InputListener = async () => {
    const oldobj = await Storaging.GetStorage(ActiveTab.url);
    await Messages.UpdateScroll({
      _tabid: ActiveTab.id,
      _url: ActiveTab.url,
      oldObj: oldobj,
    });
  };
  document.getElementById("start").addEventListener("click", InputListener);

  document.getElementById("reset").addEventListener("click", async () => {
    Utils.ResetAttributes(["Ypixels", "delay"]);
    await InputListener();
  });

  document.getElementById("toggle").addEventListener("click", async (e) => {
    const isToggled = e.target.checked;
    await InputListener();

    if (isToggled) {
      Ui.HideElementsById(["reset", "start"]);
      Utils.AddValuesListener(["delay", "Ypixels"], "change", InputListener);
    } else {
      Ui.ShowElementsById(["reset", "start"]);
      Utils.RemoveValueListener(["delay", "Ypixels"], "change", InputListener);
    }
  });
});
