import Vue from "vue";

// TODO. 找个真的deepClone去
export const fakeDeepClone = (source) => {
  return JSON.parse(JSON.stringify(source));
};

const _fakeLoopAssign = (target, source) => {
  for (var key in source) {
    if (key == "subOfVariables") {
      Vue.set(target, "subOfVariables", source["subOfVariables"]);
    } else if (key == "requestConfig") {
      Vue.set(target, "requestConfig", source["requestConfig"]);
    } else if (typeof source[key] == "object") {
      // TODO. 如果有空可以细化Object的内容
      if (
        Array.isArray(source[key]) ||
        !Object.hasOwnProperty.call(target, key)
      ) {
        target[key] = fakeDeepClone(source[key]);
      } else {
        _fakeLoopAssign(target[key], source[key]);
      }
    } else {
      target[key] = source[key];
    }
  }
};

// TODO. 找个真的Object.assign去
export const fakeAssign = (...args) => {
  let target = args.splice(0, 1)[0];
  let sources = args;
  sources.forEach((source) => {
    _fakeLoopAssign(target, source);
  });
  return target;
};

export function debounce(func, wait) {
  let timeout;
  return function () {
    let context = this;
    let args = arguments;

    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

export function throttle(func, wait) {
  let timeout;
  return function () {
    let context = this;
    let args = arguments;
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null;
        func.apply(context, args);
      }, wait);
    }
  };
}

export function saveFile(filename, filecontent) {
  let URL = window.URL || window.webkitURL;

  // `a.click()` doesn't work for all browsers (#465)
  function click(node) {
    try {
      node.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );
    } catch (e) {
      var evt = document.createEvent("MouseEvents");
      evt.initMouseEvent(
        "click",
        true,
        true,
        window,
        0,
        0,
        0,
        80,
        20,
        false,
        false,
        false,
        false,
        0,
        null
      );
      node.dispatchEvent(evt);
    }
  }

  function saveAs(blob, filename) {
    let type = blob.type;
    let force_saveable_type = "application/octet-stream";
    if (type && type != force_saveable_type) {
      // 强制下载，而非在浏览器中打开
      let slice = blob.slice || blob.webkitSlice || blob.mozSlice;
      blob = slice.call(blob, 0, blob.size, force_saveable_type);
    }

    let url = URL.createObjectURL(blob);

    // https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS#Valid Namespace URIs
    // 此处不要修改http协议为https, namespace URI仅支持4种固定写法
    let save_link = document.createElementNS(
      "http://www.w3.org/1999/xhtml",
      "a"
    );
    save_link.href = url;
    save_link.download = filename;
    save_link.rel = "noopener"; // tabnabbing
    click(save_link);
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1e4); // 10s
  }

  function rightSave(filename, filecontent) {
    let blob = new Blob([filecontent], { type: "text/plain" });

    saveAs(blob, filename);
  }
  rightSave(filename, filecontent);
}

/**
 * @description 公共方法：把扁平化的树变成立体树的结构
 * @param {Object<data>} data 传入目标数据
 * @param {Object<option>} option 传入的依据key值
 * @returns {Tree}
 */
export function FlatToNested(data, option) {
  option = option || {};
  let idProperty = option.idProperty || "id";
  let parentProperty = option.parentProperty || "pId";
  let childrenProperty = option.childrenProperty || "children";
  let res = [],
    tmpMap = [];
  for (let i = 0; i < data.length; i++) {
    tmpMap[data[i][idProperty]] = data[i];
    if (
      tmpMap[data[i][parentProperty]] &&
      data[i][idProperty] != data[i][parentProperty]
    ) {
      if (!tmpMap[data[i][parentProperty]][childrenProperty])
        tmpMap[data[i][parentProperty]][childrenProperty] = [];
      tmpMap[data[i][parentProperty]][childrenProperty].push(data[i]);
    } else {
      res.push(data[i]);
    }
  }
  return res;
}

/**
 * @description 公共方法：把立体树转换成扁平化的结构
 * @param {Array<tree>} tree 传入目标数据
 * @returns {Array} newArr
 */ 
export function treeToArray(tree, newArr = []) {
  tree.forEach((item) => {
    const { children } = item;
    if (children) {
      delete item.children;

      if (children.length) {
        newArr.push(item);
        return treeToArray(children, newArr);
      }
    }
    newArr.push(item);
  });
  return newArr;
}

/**
 * @description 获取url参数
 * @param {String} name
 */
export function getUrl(name) {
  var reg = new RegExp("[^?&]?" + encodeURI(name) + "=[^&]+");
  var arr = window.location.href.match(reg);
  if (arr != null) {
    return decodeURI(arr[0].substring(arr[0].search("=") + 1));
  }
  return "";
}

/**
 * @description 根据对象中的某个属性进行排序---默认升序
 * @param {String} prop 排序字段
 * @param {Array} arr 排序数组
 * @param {String} type 排序类型
 * @returns {Array}
 */
 export const arraySortByProp = (prop, arr, type = "up") => {
  const sortBy = (property) => {
    return function (value1, value2) {
      let a = value1[property];
      let b = value2[property];
      return type == "up"
        ? a > b
          ? 1
          : a < b
          ? -1
          : 0
        : a < b
        ? 1
        : a > b
        ? -1
        : 0;
    };
  };
  return arr.sort(sortBy(prop));
};

//index1是要替换元素的索引，index2是要被替换元素的索引，index1和index2互换位置
export function swapArr(arr, index1, index2) {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0];
  return arr;
}
