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
      element != "toggle"
        ? (returobj[element] = document.getElementById(element).value)
        : (returobj[element] = document.getElementById(element).checked);
    });
    return returobj;
  },
  SetAttribute: (element, va) => {
    if (va == undefined) return;
    element != "toggle"
      ? (document.getElementById(element).value = va)
      : (document.getElementById(element).checked = va);
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
      document.getElementById(element).style.display = "none";
    });
  },
  ShowElementsById: (attlist) => {
    attlist.forEach((element) => {
      document.getElementById(element).style.display = "block";
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
    let returnobj = "false";
    const obj = { delay: delay, Ypixels: Ypixels, toggle: toggle };
    if (oldObj) {
      if (oldObj.intervalid != null) {
        obj.intervalid = oldObj.intervalid;
      }
    }
    if (_tabid == null || _url == null) {
      console.error("Invalid parameters");
      return false;
    }
    try {
      returnobj = await chrome.tabs.sendMessage(_tabid, {
        obj: obj,
      });
    } catch (err) {
      alert(err + " Try refresh page and try again or Site is blocking");
      return false;
    }
    if (returnobj == false) {
      return false;
    } else {
      Storaging.SaveStorage(_url, returnobj);
      return returnobj;
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
        if (oldObj.toggle != true) {
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
  }
};
