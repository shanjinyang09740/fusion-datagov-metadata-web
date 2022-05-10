<template>
  <div class="content">
    <div class="leftBox">
      <common-tree
        treeId="divisionTree"
        :treeData="treeData"
        @node-click="handleNodeClick"
        :defaultProps="defaultProps"
        :rightClickList="rightClickList"
        @addChildTree="addTree"
        @editTree="editTree"
        @deleteTree="deleteTree"
        :isNeedFilter="true"
      ></common-tree>
    </div>
    <div class="rightBox">
      <control-bar>
        <template slot="left">
          <fu-button size="medium" type="primary" @click="addConnectArea"
            >新增连接区划</fu-button
          >
          <fu-button size="medium" type="primary">删除</fu-button>
        </template>
        <!-- 控制条右侧区域插槽 -->
        <template slot="right">
          <advanced-query
            :columns="queryColumns"
            :hideAdvancedQuery="true"
            :showTopResetButton="true"
            @tableSearch="tableSearch"
          ></advanced-query>
        </template>
      </control-bar>
      <common-table
        ref="areaTable"
        tableId="areaTable"
        :reqUrl="tableReqUrl"
        :reqParams="reqParams"
        :fu-column="tableColumn"
        :dynamicSlotName="dynamicSlotName"
        :isHasSelection="true"
        operationWidth="100px"
        @deliverySelection="deliverySelection"
      >
        <template slot-scope="myscope" slot="one">
          <i
            class="iconfont iconbiaoge_shanchu"
            title="删除"
            @click="handleDeleteItem(myscope.data)"
          ></i>
        </template>
      </common-table>
    </div>
    <!-- 新增连接区划 -->
    <add-connect-area
      v-if="areaDialogVisible"
      @close="closeDialog"
      :areaDialogVisible="areaDialogVisible"
    ></add-connect-area>
    <!-- 树上的新增 -->
    <add-area
      v-if="addAreaDialogVisible"
      @close="closeAddAreaDialog"
      :type="nodeType"
      :addAreaDialogVisible="addAreaDialogVisible"
    ></add-area>
  </div>
</template>
<script>
import CommonTree from "@/components/CommonTree";
import AdvancedQuery from "@/components/AdvancedQuery";
import ControlBar from "@/components/ControlBar";
import CommonTable from "@/components/CommonTable";
import AddConnectArea from "./components/AddConnectArea";
import AddArea from "./components/AddArea";
import { Button, Message } from "fusion-ui";
import {
  getAreaTree,
  saveAreaTree,
  deleteAreaTree,
  deleteAreacontent,
} from "@/service/modules/labelManage.js";
export default {
  components: {
    CommonTree,
    ControlBar,
    AdvancedQuery,
    CommonTable,
    AddConnectArea,
    AddArea,
    FuButton: Button,
  },
  props: {},
  data() {
    return {
      nodeType: "",
      addAreaDialogVisible: false,
      areaDialogVisible: false,
      dynamicSlotName: "one",
      tableReqUrl: "", // 表格url
      tableColumn: [
        {
          label: "区划名称",
          prop: "name",
          width: "200",
        },
        {
          label: "区划代码",
          prop: "code",
          width: "200",
        },
        {
          label: "状态",
          prop: "status",
          width: "120",
          reqUrl: "", // 状态接口
        },
      ],
      queryForm: {
        name: "",
      },
      // 表格查询项
      queryColumns: [
        {
          label: "区域名称/代码",
          labelWidth: "120px",
          placeholder: "请输入",
          type: "input",
          searchShow: true,
          defaultValue: "",
          modelData: "name",
        },
      ],
      statusOptions: [
        {
          text: "启用",
          value: "1",
        },
        {
          text: "未启用",
          value: "2",
        },
      ],
      rightClickList: [
        {
          id: 1,
          label: "新增",
          callBack: "addTree",
        },
        {
          id: 2,
          label: "编辑",
          callBack: "editTree",
        },
        {
          id: 3,
          label: "删除",
          callBack: "deleteTree",
        },
      ],
      defaultProps: {
        children: "chileren",
        label: "label",
        id: "value",
      },
      divisionTreeData: [
        {
          id: "1",
          text: "北京市",
          value: "100000",
        },
        {
          id: "2",
          pId: "1",
          text: "海淀区",
          value: "101000",
        },
      ],
      treeData: [],
    };
  },
  computed: {
    reqParams() {
      return [
        {
          name: "",
          vtype: "attr",
          data: "",
        },
      ];
    },
  },
  watch: {},
  created() {
    this.getTree();
  },
  methods: {
    /**
     * @description 左侧树
     */
    getTree() {
      getAreaTree()
        .then((res) => {
          this.treeData = res.data[0].data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    closeAddAreaDialog() {
      this.$refs.areaTable.reloadTable();
      this.addAreaDialogVisible = false;
    },
    closeDialog() {
      // 刷新树数据
      // this.$refs.divisionTree.queryData();
      // 刷新表格数据
      this.$refs.areaTable.reloadTable();
      this.areaDialogVisible = false;
    },
    addConnectArea() {
      this.areaDialogVisible = true;
    },
    // 表格多选的集合
    deliverySelection(selection) {},
    //表格删除行
    handleDeleteItem(row) {
      deleteAreacontent(row.id).then((res) => {
        console.log(res);
      });
    },
    // 点击树节点
    handleNodeClick() {
      console.log("点击树节点");
    },
    // 新增节点
    addTree() {
      this.nodeType = "add";
      this.addAreaDialogVisible = true;
    },
    // 编辑节点
    editTree() {
      this.nodeType = "edit";
      this.addAreaDialogVisible = true;
    },
    // 保存
    saveTree() {
      let params = {
        isNew: "N",
        value: "F000103",
        label: "华南",
        type: "area",
        pCode: "F0001",
        num: "3",
      };
      saveAreaTree(params)
        .then((res) => {
          Message.success("保存成功");
        })
        .catch((err) => {
          console.log(err);
          Message.error("保存失败");
        });
    },
    // 删除节点
    deleteTree(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteAreaTree(id)
            .then((res) => {
              if (res.data[0].data) {
                Message.success("删除成功!");
              }
            })
            .catch((err) => {
              Message.error(`删除失败!，${err.errorMessage}`);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    tableSearch(form) {
      this.queryForm = JSON.parse(
        JSON.stringify(Object.assign(this.queryForm, form))
      );
    },
  },
};
</script>
<style lang="less" scoped>
html,
body,
#app {
  height: 100%;
}
.content {
  width: 100%;
  padding: 10px;
  display: flex;
  box-sizing: border-box;
  height: 100%;
  .leftBox {
    width: 25%;
    padding-top: 14px;
    height: 100%;
  }
  .rightBox {
    width: 75%;
    margin-left: 10px;
    .rightQueryWarp {
      display: flex;
      justify-content: space-between;
    }
  }
  .queryInput {
    width: 120px;
  }
}
</style>
