<template>
  <div class="main">
    <!-- <div class="header">
      <template v-if="partitionOptions.length > 1">
        分区:
        <fu-select
          class="partition-select"
          v-model="partition"
          size="medium"
          clearable
          filterable
        >
          <fu-option
            v-for="item in partitionOptions"
            :value="item.value"
            :key="item.value"
            :label="item.text"
          ></fu-option>
        </fu-select>
      </template>
    </div> -->
    <div class="content">
      <component-tree
        ref="groupCatalogueTree"
        class="groupCatalogueTree"
        treeId="groupCatalogueTree"
        :treeData="treeData"
        :defaultProps="defaultProps"
        :expandNodes="expandNodes"
        :default-expand-all="true"
        @node-click="nodeClick"
      ></component-tree>
      <div class="mainTable">
        <div class="table-header">
          <advanced-query
            :columns="queryColumns"
            :showTopResetButton="true"
            :hideAdvancedQuery="true"
            @search="tableSearch"
          ></advanced-query>
        </div>
        <component-table
          v-if="isShowSearchTable"
          row-key="statGroupId"
          :reqUrl="reqGroupItemTableUrl"
          :reqParams="reqGroupItemTableParams"
          :tableId="'groupItemTable'"
          :fuColumn="GroupItemColumn"
          :operationWidth="'100px'"
        >
          <template slot-scope="row" slot="one">
            <div class="operateBtns">
              <i
                v-if="row.data.groupType === '1' || row.data.groupType === '3'"
                class="iconfont iconbiaoge_chakanshuju"
                title="查看分组详情"
                @click.stop="lookGroup(row.data)"
              ></i>
              <i
                class="iconfont iconbiaoge_shujuduizhao"
                title="查看分项详情"
                @click.stop="itemizedManage(row.data)"
              ></i>
            </div>
          </template>
        </component-table>
        <component-table
          v-if="!isShowSearchTable"
          row-key="statGroupId"
          :reqUrl="reqTableUrl"
          :reqParams="reqTableParams"
          :tableId="'tableId'"
          :fuColumn="fuColumn"
          :operationWidth="'100px'"
        >
          <template slot-scope="row" slot="one">
            <div class="operateBtns">
              <i
                class="iconfont iconbiaoge_chakanshuju"
                title="查看分组详情"
                @click.stop="lookGroup(row.data)"
              ></i>
              <i
                class="iconfont iconbiaoge_shujuduizhao"
                title="查看分项详情"
                @click.stop="itemizedManage(row.data)"
              ></i>
            </div>
          </template>
        </component-table>
      </div>
    </div>
    <fu-dialog
      :title="title"
      top="1vh"
      width="80%"
      :visible.sync="isShowDialog"
      :close-on-click-modal="false"
      @close="closeGroupDialog"
    >
      <group-tabs
        ref="groupDialog"
        :disabled="groupDisabled"
        :groupId="groupId"
        :type="type"
      ></group-tabs>
      <span slot="footer">
        <fu-button @click="closeGroupDialog">取消</fu-button>
      </span>
    </fu-dialog>
    <fu-dialog
      title="管理分项"
      top="1vh"
      width="90%"
      :visible.sync="isShowItemizedManage"
      :close-on-click-modal="false"
      :append-to-body="true"
      @close="closeItemizedManage"
    >
      <itemized-manage
        ref="itemizedManage"
        :groupId="groupId"
        :groupCode="group.statGroupCode"
      ></itemized-manage>
    </fu-dialog>
  </div>
</template>
<script>
import { Button, Dialog, Message } from "fusion-ui";
import ComponentTree from "@/components/CommonTree";
import ComponentTable from "@/components/CommonTable";
import AdvancedQuery from "@/components/AdvancedQuery";
import GroupTabs from "@/components/CreateGroupFrom";
import ItemizedManage from "./components/ItemizedManage.vue";
import { getUrl } from "@/utils/tool.js";
import {
  // getPartitionSelect,
  getGroupTree,
  saveItemize,
} from "@/service/modules/labelManage.js";
export default {
  name: "",
  components: {
    FuButton: Button,
    FuDialog: Dialog,
    ComponentTree,
    ComponentTable,
    AdvancedQuery,
    GroupTabs,
    ItemizedManage,
  },
  data() {
    return {
      // 区分微观与宏观页面
      pageType: "",
      // 区分分组与目录
      type: "",
      // 分区
      partition: "",
      partitionOptions: [],
      // 搜索字段
      searchText: "",
      defaultProps: {
        children: "children",
        label: "statGroupFolderLabel",
        id: "statGroupFolderId",
      },
      treeData: [
        {
          statGroupFolderId: "1-1",
          statGroupFolderLabel: "主题",
          children: [
            {
              id: "1-1",
              statGroupFolderId: "1-1",
              statGroupFolderLabel: "111",
              statGroupFolderType: "0",
            },
            {
              id: "1-2",
              statGroupFolderId: "1-2",
              statGroupFolderLabel: "1112",
              statGroupFolderType: "1",
            },
            {
              id: "1-3",
              statGroupFolderId: "1-3",
              statGroupFolderLabel: "1113",
              statGroupFolderType: "1",
            },
            {
              id: "1-4",
              statGroupFolderId: "1-4",
              statGroupFolderLabel: "1114",
              statGroupFolderType: "1",
            },
          ],
        },
      ],
      expandNodes: [],
      // 当前节点id
      nodeId: "",
      // 当前节点类型
      nodeType: "",
      isShowSearchTable: true,
      // 查询表单
      queryForm: {
        label: "",
      },
      queryColumns: [
        {
          label: "名称/编码：",
          modelData: "label",
          type: "input",
          labelWidth: "120px",
          defaultValue: "",
          isSearchShow: true,
        },
      ],
      searchForm: {
        name: "",
        type: "",
        state: "",
      },
      // 分组表格列
      fuColumn: [
        {
          prop: "statGroupNameCh",
          label: "名称",
          width: "50px",
          align: "center",
        },
        {
          prop: "statGroupCode",
          label: "编码",
          width: "50px",
          align: "center",
        },
        {
          prop: "statGroupAlias",
          label: "别名",
          width: "50px",
          align: "center",
        },
        {
          prop: "groupType",
          label: "类型",
          width: "50px",
          align: "center",
        },
        {
          prop: "statGroupVersion",
          label: "版本",
          width: "50px",
          align: "center",
        },
        {
          prop: "creatorId",
          label: "汇总类型",
          width: "50px",
          align: "center",
        },
        {
          prop: "createTime",
          label: "状态",
          width: "50px",
          align: "center",
        },
      ],
      // 分组分项表格列
      GroupItemColumn: [
        {
          prop: "statGroupNameCh",
          label: "名称",
          width: "50px",
          align: "center",
        },
        {
          prop: "statGroupCode",
          label: "编码",
          width: "50px",
          align: "center",
        },
        {
          prop: "statGroupAlias",
          label: "别名",
          width: "50px",
          align: "center",
        },
        {
          prop: "groupType",
          label: "类型",
          width: "50px",
          align: "center",
        },
        {
          prop: "unit",
          label: "计量单位",
          width: "80px",
          align: "center",
        },
        {
          prop: "computed",
          label: "计算公式",
          width: "80px",
          align: "center",
        },
        {
          prop: "statGroupVersion",
          label: "版本",
          width: "50px",
          align: "center",
        },
        {
          prop: "creatorId",
          label: "汇总类型",
          width: "80px",
          align: "center",
        },
        {
          prop: "createTime",
          label: "状态",
          width: "50px",
          align: "center",
        },
        {
          prop: "folder",
          label: "所在文件夹",
          width: "100px",
          align: "center",
        },
        {
          prop: "group",
          label: "所在分组",
          width: "80px",
          align: "center",
        },
      ],
      // 分组
      title: "",
      isShowDialog: false,
      groupDisabled: false,
      groupId: "",
      group: { statGroupCode: "" },
      // 管理分项
      isShowItemizedManage: false,
    };
  },
  computed: {
    uploadData() {
      return { fileId: this.nodeId };
    },
    // 树点击查询
    reqTableUrl() {
      if (!this.nodeId) {
        return "";
      }
      return `/api/meta/v1/group/list.do`;
    },
    reqTableParams() {
      if (this.nodeId) {
        return [
          {
            name: "group",
            vtype: "json",
            data: {
              folderType: this.type === "group" ? "0" : "1", //目录还是分组 0
              partitionCode: this.partition, //当前的分区code 1
              nodeId: this.nodeId, //当前的结点id
              groupTag: "", //动态查询条件名称或者编码
              groupStatus: "", //动态查询条件分组的状态
              groupType: "", //动态查询条件分组的类型
            },
          },
        ];
      } else {
        return [];
      }
    },

    // 表单查询
    reqGroupItemTableUrl() {
      if (!this.nodeId) {
        return "";
      }
      return `/api/meta/v1/group/list.do`;
    },
    reqGroupItemTableParams() {
      if (this.nodeId) {
        return [
          {
            name: "group",
            vtype: "json",
            data: {
              folderType: this.type === "group" ? "0" : "1", //目录还是分组 0
              partitionCode: this.partition, //当前的分区code 1
              nodeId: this.nodeId, //当前的结点id
              groupTag: this.queryForm.label, //动态查询条件名称或者编码
            },
          },
        ];
      } else {
        return [];
      }
    },
  },
  created() {
    this.type = getUrl("type");
    // this.getPartitionSelect();
    // this.getGroupTree();
  },
  methods: {
    /**
     * @description 分区
     */
    // getPartitionSelect() {
    //   getPartitionSelect()
    //     .then((res) => {
    //       this.partitionOptions = res.data[0].data;
    //       console.log(this.partitionOptions);
    //       this.partition = this.partitionOptions[0].value;
    //       this.getGroupTree();
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // },
    /**
     * @description 分组树
     */
    getGroupTree() {
      getGroupTree(this.partition, this.type)
        .then((res) => {
          let data = res.data[0].data;
          this.treeData = this.transformTozTreeFormat(data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /**
     * @description 将普通的数组转换为父子结构
     */
    transformTozTreeFormat(sNodes) {
      let i, l;
      let r = [];
      let tmpMap = {};
      for (i = 0, l = sNodes.length; i < l; i++) {
        tmpMap[sNodes[i].id] = sNodes[i];
      }
      for (i = 0, l = sNodes.length; i < l; i++) {
        let p = tmpMap[sNodes[i].pId];
        if (p && sNodes[i].id != sNodes[i].pId) {
          let children = this.nodeChildren(p);
          if (!children) {
            children = this.nodeChildren(p, []);
          }
          children.push(sNodes[i]);
        } else {
          r.push(sNodes[i]);
        }
      }
      return r;
    },
    nodeChildren(node, newChildren) {
      if (typeof newChildren !== "undefined") {
        node.children = newChildren;
      }
      return node.children;
    },
    nodeClick(data) {
      this.isShowSearchTable = false;
      this.nodeId = data.id;
      this.nodeType = data.statGroupFolderType;
    },
    /**
     * @description 关闭新建分组弹框
     */
    closeGroupDialog() {
      this.isShowDialog = false;
      this.$refs["groupDialog"].activeName = "first";
      this.$refs["groupDialog"].$refs["baseForm"].$refs.el.resetFields();
      this.$refs["groupDialog"].$refs["manageForm"].$refs.el.resetFields();
    },
    /**
     * @description 查看
     */
    lookGroup(row) {
      this.title = "查看详情";
      this.isShowDialog = true;
      this.groupDisabled = true;
      this.group = row;
    },
    /**
     * @description 表单查询
     */
    tableSearch(form) {
      this.isShowSearchTable = true;
      this.queryForm = JSON.parse(JSON.stringify(form));
    },
    /**
     * @description 重置查询表单
     */
    resetForm() {},
    /**
     * @description 管理分项
     */
    itemizedManage(row) {
      this.groupId = row.statGroupId;
      this.group = row;
      this.isShowItemizedManage = true;
    },
    closeItemizedManage() {
      this.isShowItemizedManage = false;
    },
    submitItemizedManage() {
      console.log(this.$refs["itemizedManage"], 'this.$refs["itemizedManage"]');
      let params = {
        tableData: this.$refs["itemizedManage"].$refs["itemizeTable"].tableData,
        ids: this.$refs["itemizedManage"].ids,
      };
      saveItemize(params)
        .then((res) => {
          Message.success("保存成功");
          this.closeItemizedManage();
        })
        .catch((err) => {
          Message.error(`保存失败，${err.errorMessage}`);
        });
    },
    /**
     * @description 导入分组
     */
    importGroup() {
      this.isShowUpload = true;
    },
    closeUpload() {
      this.isShowUpload = false;
    },
    submitUpload() {},
    /**
     * @description 导出分组
     */
    exportGroup() {
      window.open(
        `/api/meta/v1/codelist/export.do?partitionCode=${this.partition}&folderId=${this.nodeId}`
      );
    },
  },
};
</script>
<style lang="less" scoped>
.main {
  padding: 10px 10px 0;
}
.header {
  height: 40px;
  margin: 10px 0;
  border-bottom: 1px solid #ccc;
  box-sizing: border-box;
  .partition-select {
    margin-right: 10px;
  }
}
.right {
  float: right;
  margin-right: 10px;
}
.left-mg10 {
  margin-left: 10px;
}
.content {
  display: flex;
  .groupCatalogueTree {
    width: 350px;
    padding: 0 5px;
  }
  .mainTable {
    flex: 1;
    .table-header {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 5px;
    }
  }
}
.operateBtns {
  display: flex;
  i {
    cursor: pointer;
  }
  img {
    cursor: pointer;
    margin-right: 10px;
  }
}
</style>
