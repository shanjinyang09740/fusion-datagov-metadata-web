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
 * @returns
 */
const getGroupTree = () => {
  return postJSON("/api/meta/v1/groups/t2tree/query.do", {
    postData: JSON.stringify({
      data: [],
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
 * @description 保存分类
 * @returns
 */
const saveFolder = (url, data) => {
  return postJSON(url, {
    postData: JSON.stringify({
      data: [
        {
          name: "type",
          vtype: "json",
          data: data,
        },
      ],
    }),
  });
};
/**
 * @description 保存主题
 * @returns
 */
const saveTheme = (url, data) => {
  return postJSON(url, {
    postData: JSON.stringify({
      data: [
        {
          name: "theme",
          vtype: "json",
          data: data,
        },
      ],
    }),
  });
};
/**
 * @description 保存分组
 * @returns
 */
const saveGroup = (url, type, from) => {
  return postJSON(url, {
    postData: JSON.stringify({
      data: [
        {
          name: "group",
          vtype: "formpanel",
          data: from,
        },
        {
          name: "statGroupType",
          vtype: "attr",
          data: type,
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
 * @description 复制分组
 * @param {String} statGroupId
 * @param {String} uplevel
 * @returns
 */
const copyGroup = (statGroupId, uplevel) => {
  return postJSON("/api/meta/v1/groups/group/copy.do", {
    postData: JSON.stringify({
      data: [
        {
          name: "statGroupId",
          vtype: "attr",
          data: statGroupId,
        },
        {
          name: "uplevel",
          vtype: "attr",
          data: uplevel,
        },
      ],
    }),
  });
};
/**
 * @description 删除分组
 * @param {String} id
 * @returns
 */
const deleteGroup = (id) => {
  return postJSON("/api/meta/v1/groups/group/delete.do", {
    postData: JSON.stringify({
      data: [{ vtype: "attr", name: "statGroupId", data: id }],
    }),
  });
};
/**
 * @description 分组移动至其他文件夹
 * @param
 * @returns
 */
const move = ({ folderId, ids }) => {
  return postJSON("/api/meta/v1/groups/group/move.do", {
    postData: JSON.stringify({
      data: [
        {
          name: "statGroupTypeId",
          vtype: "attr",
          data: folderId,
        },
        {
          name: "ids",
          vtype: "attr",
          data: ids,
        },
      ],
    }),
  });
};
/**
 * @description 删除分类
 * @param {String} id
 * @returns
 */
const deleteFolder = (id) => {
  return postJSON("/api/meta/v1/groups/type/delete.do", {
    postData: JSON.stringify({
      data: [
        {
          name: "statGroupTypeId",
          vtype: "attr",
          data: id,
        },
      ],
    }),
  });
};
/**
 * @description 删除主题
 * @param {String} id
 * @returns
 */
const deleteTheme = (id) => {
  return postJSON("/api/meta/v1/groups/theme/delete.do", {
    postData: JSON.stringify({
      data: [
        {
          name: "statGroupThemeId",
          vtype: "attr",
          data: id,
        },
      ],
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
const getCodeId = () => {
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
 * @description 保存分项列表
 * @param {Array} tableData
 * @param {Array} ids 初始化分项id 的集合
 * @returns
 */
const saveItemize = ({ tableData, ids, statGroupId, statGroupCode }) => {
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
        {
          name: "statGroupCode",
          vtype: "attr",
          data: statGroupCode,
        },
        { name: "statGroupId", vtype: "attr", data: statGroupId },
      ],
    }),
  });
};
/**
 * @description 查询分项详情
 * @returns
 */
const queryItemizeDetail = (queryId) => {
  return postJSON(`/api/meta/v1/group/detail.do`, {
    postData: JSON.stringify({
      data: [
        {
          name: "statGroupId",
          vtype: "attr",
          data: queryId,
        },
      ],
    }),
  });
};

export {
  queryItemizeDetail,
  saveItemize,
  getCodeId,
  getPartitionSelect,
  getFolderInfo,
  saveFolder,
  saveTheme,
  saveGroup,
  copyGroup,
  getCreateGroupFrom,
  getCreateItemizeFrom,
  getGroupTree,
  getItemizeTableData,
  getItemizeTableColumn,
  deleteGroup,
  deleteFolder,
  deleteTheme,
  getAreaTree,
  saveAreaTree,
  deleteAreaTree,
  deleteAreacontent,
  move,
  getItemizeTable,
  getAttributeTable,
  saveAttribute,
};
