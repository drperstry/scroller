export const Utils = {
  getActiveTab: async () => {
    const tabs = await chrome.tabs.query({
      currentWindow: true,
      active: true,
    });
    return tabs[0];
  },
  ResetAttributes: (attlist) => {
    attlist.forEach((element) => {
      document.getElementById(element).value = 0;
    });
  },
  GetAttributes: (attlist) => {
    let returobj = {};
    attlist.forEach((element) => {
      if (element !== "toggle") {
        returobj[element] = document.getElementById(element).value;
      } else {
        returobj[element] = document.getElementById(element).checked;
      }
    });
    return returobj;
  },
  SetAttribute: (element, va) => {
    if (va === undefined) return;
    if (element !== "toggle") {
      document.getElementById(element).value = va;
    } else {
      document.getElementById(element).checked = va;
    }
  },
  AddValuesListener: (attlist, eventType, listener) => {
    attlist.forEach((element) => {
      document.getElementById(element).addEventListener(eventType, listener);
    });
  },
  RemoveValueListener: (attlist, eventType, listener) => {
    attlist.forEach((element) => {
      document.getElementById(element).removeEventListener(eventType, listener);
    });
  },
};

export const Ui = {
  HideElementsById: (attlist) => {
    attlist.forEach((element) => {
      const el = document.getElementById(element);
      if (el) el.style.display = "none";
    });
  },
  ShowElementsById: (attlist) => {
    attlist.forEach((element) => {
      const el = document.getElementById(element);
      if (el) el.style.display = "block";
    });
  },
};

export const Messages = {
  UpdateScroll: async (param) => {
    const { _tabid, _url, oldObj } = param;
    const { delay, Ypixels, toggle } = Utils.GetAttributes([
      "delay",
      "Ypixels",
      "toggle",
    ]);

    const obj = {
      action: "start",
      delay: delay,
      Ypixels: Ypixels,
      toggle: toggle,
      isScrolling: true,
      isPaused: false,
    };

    if (oldObj && oldObj.intervalid != null) {
      obj.intervalid = oldObj.intervalid;
    }

    if (_tabid == null || _url == null) {
      console.error("Invalid parameters");
      return false;
    }

    try {
      const returnobj = await chrome.tabs.sendMessage(_tabid, { obj: obj });
      if (returnobj) {
        returnobj.isScrolling = true;
        returnobj.isPaused = false;
        Storaging.SaveStorage(_url, returnobj);
        return returnobj;
      }
      return false;
    } catch (err) {
      alert(chrome.i18n.getMessage("error_connection") || "Could not connect. Try refreshing the page.");
      return false;
    }
  },

  PauseScroll: async (param) => {
    const { _tabid, _url, oldObj } = param;

    if (_tabid == null || _url == null) {
      console.error("Invalid parameters");
      return false;
    }

    const obj = {
      action: "pause",
      intervalid: oldObj ? oldObj.intervalid : null,
    };

    try {
      const returnobj = await chrome.tabs.sendMessage(_tabid, { obj: obj });
      if (returnobj) {
        const savedObj = {
          ...oldObj,
          isScrolling: false,
          isPaused: true,
          intervalid: null,
        };
        Storaging.SaveStorage(_url, savedObj);
        return savedObj;
      }
      return false;
    } catch (err) {
      console.error("Pause error:", err);
      return false;
    }
  },

  ResumeScroll: async (param) => {
    const { _tabid, _url, oldObj } = param;

    if (_tabid == null || _url == null || !oldObj) {
      console.error("Invalid parameters");
      return false;
    }

    const obj = {
      action: "resume",
      delay: oldObj.delay,
      Ypixels: oldObj.Ypixels,
      toggle: oldObj.toggle,
    };

    try {
      const returnobj = await chrome.tabs.sendMessage(_tabid, { obj: obj });
      if (returnobj) {
        returnobj.isScrolling = true;
        returnobj.isPaused = false;
        Storaging.SaveStorage(_url, returnobj);
        return returnobj;
      }
      return false;
    } catch (err) {
      console.error("Resume error:", err);
      return false;
    }
  },

  StopScroll: async (param) => {
    const { _tabid, _url, oldObj } = param;

    if (_tabid == null || _url == null) {
      console.error("Invalid parameters");
      return false;
    }

    const obj = {
      action: "stop",
      intervalid: oldObj ? oldObj.intervalid : null,
    };

    try {
      await chrome.tabs.sendMessage(_tabid, { obj: obj });
      const savedObj = {
        delay: oldObj ? oldObj.delay : null,
        Ypixels: oldObj ? oldObj.Ypixels : null,
        toggle: false,
        isScrolling: false,
        isPaused: false,
        intervalid: null,
      };
      Storaging.SaveStorage(_url, savedObj);
      return true;
    } catch (err) {
      console.error("Stop error:", err);
      return false;
    }
  },

  StorageRunOnLoad: async (tab, attlist) => {
    const _url = tab.url;
    const _tabid = tab.id;
    try {
      const oldObj = await Storaging.GetStorage(_url);
      if (oldObj != null) {
        attlist.forEach((element) => {
          Utils.SetAttribute(element, oldObj[element]);
        });
        if (oldObj.toggle !== true) {
          return;
        }
      } else {
        return;
      }
      await Messages.UpdateScroll({ _tabid, _url, oldObj });
    } catch (e) {
      console.log(e);
      return;
    }
  },
};

export const Storaging = {
  SaveStorage: async (url, obj) => {
    await chrome.storage.sync.set({
      [url]: JSON.stringify(obj),
    });
  },
  GetStorage: async (url) => {
    const result = await chrome.storage.sync.get(url);
    const obj = result[url] ? JSON.parse(result[url]) : null;
    return obj;
  },
  ClearStorage: async (url) => {
    await chrome.storage.sync.remove(url);
  },
};
