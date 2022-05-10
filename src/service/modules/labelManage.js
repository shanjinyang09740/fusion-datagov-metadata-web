import { postJSON } from "@/utils/post";
import { REQ } from "../requestUrl";
import { get } from "@/utils/http";

/**=========================标签管理========================== */
/**
 * @description 查询分区下拉列表
 * @returns
 */
const getPartitionSelect = () => {
  return postJSON("/api/meta/v1/partition/queryDropDownBox.do", {
    postData: JSON.stringify({
      data: [],
    }),
  });
};
/**
 * @description 获取分组目录树
 * @param partCode 分区code
 * @param type 分组 group 目录 catalog
 * @returns
 */
const getGroupTree = (partCode, type) => {
  return postJSON("/api/meta/v1/baseCodeList/queryFolderTree.do", {
    postData: JSON.stringify({
      data: [
        { name: "partCode", vtype: "attr", data: partCode },
        { name: "type", vtype: "attr", data: type },
      ],
    }),
  });
};
/**
 * @description 查询文件夹信息
 * @param partCode 分区code
 * @param folderId
 * @returns
 */
const getFolderInfo = ({ partCode, folderId }) => {
  return postJSON("/api/meta/v1/baseCodeList/queryFolder.do", {
    postData: JSON.stringify({
      data: [
        { name: "folderId", vtype: "attr", data: folderId },
        { name: "partCode", vtype: "attr", data: partCode },
      ],
    }),
  });
};
/**
 * @description 保存文件夹
 * @returns
 */
const saveFolder = (
  url,
  {
    level,
    partitionCode,
    partitionName,
    statGroupFolderId,
    statGroupFolderLabel,
    statGroupFolderCode,
    statGroupFolderPid,
    statGroupFolderType,
  }
) => {
  return postJSON(url, {
    postData: JSON.stringify({
      data: [
        {
          name: "folder",
          vtype: "json",
          data: {
            level: level,
            partitionCode: partitionCode,
            partitionName: partitionName,
            statGroupFolderId: statGroupFolderId,
            statGroupFolderLabel: statGroupFolderLabel,
            statGroupFolderCode: statGroupFolderCode,
            statGroupFolderPid: statGroupFolderPid,
            statGroupFolderType: statGroupFolderType,
          },
        },
      ],
    }),
  });
};
/**
 * @description 保存主题
 * @returns
 */
const saveTheme = (themeFrom) => {
  return postJSON(REQ.saveThemeUrl, {
    postData: JSON.stringify({
      data: [
        {
          vtype: "formpanel",
          name: "form",
          data: themeFrom,
        },
      ],
    }),
  });
};
/**
 * @description 保存分组
 * @returns
 */
const saveGroup = (url, name, from) => {
  return postJSON(url, {
    postData: JSON.stringify({
      data: [
        {
          name: name,
          vtype: "json",
          data: from,
        },
      ],
    }),
  });
};
/**
 * @description 获取新建分组表单
 * @returns
 */
const getCreateGroupFrom = () => {
  return postJSON("/api/metadata/basic/page.do", {
    postData: JSON.stringify({
      data: [
        {
          name: "type",
          vtype: "attr",
          data: "指标",
        },
      ],
    }),
  });
};
/**
 * @description 获取新建分项表单
 * @returns
 */
const getCreateItemizeFrom = () => {
  return get(REQ.createItemizeUrl);
};
/**
 * @description 获取分项列表表头信息
 * @param {String} id
 * @returns
 */
const getItemizeTableColumn = (id) => {
  return postJSON("/api/meta/v1/codelist/getItems.do", {
    postData: JSON.stringify({
      data: [{ vtype: "attr", name: "id", data: id }],
    }),
  });
};
/**
 * @description 获取分项列表
 * @param {String} id
 * @returns
 */
const getItemizeTableData = (id) => {
  return postJSON("/api/meta/v1/codelist/getItems.do", {
    postData: JSON.stringify({
      data: [{ vtype: "attr", name: "id", data: id }],
    }),
  });
};
/**
 * @description 获取分项详情
 * @param {String} id
 * @returns
 */
const getItemizeDetail = (id) => {
  return postJSON("", {
    postData: JSON.stringify({
      data: [{ vtype: "attr", name: "id", data: id }],
    }),
  });
};
/**
 * @description 删除分组
 * @param {String} id
 * @returns
 */
const deleteGroup = (id) => {
  return postJSON("/api/meta/v1/baseCodeList/delGroup.do", {
    postData: JSON.stringify({
      data: [{ vtype: "attr", name: "groupId", data: id }],
    }),
  });
};
/**
 * @description 上移下移分组
 * @param
 * @returns
 */
const moveUpDownItem = ({ upId, upNum, downId, downNum }) => {
  return postJSON("/api/meta/v1/baseCodeList/exchangeGroup.do", {
    postData: JSON.stringify({
      data: [
        { name: "upId", vtype: "attr", data: upId },
        { name: "upNum", vtype: "attr", data: upNum },
        { name: "downId", vtype: "attr", data: downId },
        { name: "downNum", vtype: "attr", data: downNum },
      ],
    }),
  });
};
/**
 * @description 删除文件夹
 * @param {String} id
 * @returns
 */
const deleteFolder = (id) => {
  return postJSON("/api/meta/v1/baseCodeList/delFolder.do", {
    postData: JSON.stringify({
      data: [{ vtype: "attr", name: "folderId", data: id }],
    }),
  });
};
/**
 * @description 获取行政区域树
 * @returns
 */
const getAreaTree = () => {
  return postJSON("/api/meta/v1/area/queryAreaTree.do", {
    postData: JSON.stringify({
      data: [],
    }),
  });
};
/**
 * @description 保存行政区域树节点
 * @returns
 */
const saveAreaTree = ({ isNew, value, label, type, pCode, num }) => {
  return postJSON("/api/meta/v1/area/saveAreaTree.do", {
    postData: JSON.stringify({
      data: [
        {
          vtype: "formpanel",
          name: "area",
          data: {
            isNew: isNew,
            value: value,
            label: label,
            type: type,
            pCode: pCode,
            num: num,
          },
        },
      ],
    }),
  });
};
/**
 * @description 删除行政区域树节点
 * @returns
 */
const deleteAreaTree = (id) => {
  return postJSON("/api/meta/v1/area/delAreaTree.do", {
    postData: JSON.stringify({
      data: [{ vtype: "attr", name: "value", data: id }],
    }),
  });
};
/**
 * @description 行政区域关联行政区划删除
 * @returns
 */
const deleteAreacontent = (id) => {
  return postJSON("/api/meta/v1/area/delAreaAddrRel.do", {
    postData: JSON.stringify({
      data: [{ vtype: "attr", name: "value", data: id }],
    }),
  });
};
/**
 * @description 获取分项新增时生成对应的编码和id值
 * @returns
 */
const getCodeId = (id) => {
  return postJSON("/api/meta/v1/group/item/random.do", {
    postData: JSON.stringify({
      data: [
        {
          name: "info",
          vtype: "attr",
          data: "",
        },
      ],
    }),
  });
};
/**
 * @description 查询分项列表
 * @param {String} id 分组id
 * @returns
 */
const getItemizeTable = (id) => {
  return postJSON("/api/meta/v1/group/item/select.do", {
    postData: JSON.stringify({
      data: [
        {
          name: "statGroupId",
          vtype: "attr",
          data: id,
        },
      ],
    }),
  });
};
/**
 * @description 获取分项管理属性列表
 * @returns
 */
const getAttributeTable = (statGroupId) => {
  return postJSON("/api/meta/v1/basic/query.do", {
    postData: JSON.stringify({
      data: [
        {
          name: "statGroupId",
          vtype: "attr",
          data: statGroupId,
        },
      ],
    }),
  });
};
/**
 * @description 保存分项管理属性列表
 * @returns
 */
const saveAttribute = ({ statGroupId, statGroupCode, tableData }) => {
  return postJSON("/api/meta/v1/group/item/struct.do", {
    postData: JSON.stringify({
      data: [
        {
          name: "group",
          vtype: "json",
          data: tableData,
        },
        { name: "statGroupId", vtype: "attr", data: statGroupId },
        { name: "statGroupCode", vtype: "attr", data: statGroupCode },
      ],
    }),
  });
};
/**
 * @description 保存分项管理属性列表
 * @param {Array} tableData
 * @param {Array} ids 初始化分项id 的集合
 * @returns
 */
const saveItemize = ({ tableData, ids }) => {
  return postJSON("/api/meta/v1/group/item/save.do", {
    postData: JSON.stringify({
      data: [
        {
          name: "group",
          vtype: "json",
          data: tableData,
        },
        {
          name: "ids",
          vtype: "json",
          data: ids,
        },
      ],
    }),
  });
};

export {
  saveItemize,
  getCodeId,
  getPartitionSelect,
  getFolderInfo,
  saveFolder,
  saveTheme,
  saveGroup,
  getCreateGroupFrom,
  getCreateItemizeFrom,
  getGroupTree,
  getItemizeTableData,
  getItemizeTableColumn,
  getItemizeDetail,
  deleteGroup,
  deleteFolder,
  getAreaTree,
  saveAreaTree,
  deleteAreaTree,
  deleteAreacontent,
  moveUpDownItem,
  getItemizeTable,
  getAttributeTable,
  saveAttribute,
};
