<template>
  <div class="content">
    <div class="leftBox">
      <common-tree
        treeId="divisionTree"
        :tree-req="treeReq"
        @node-click="handleNodeClick"
        :defaultProps="defaultProps"
        :rightClickList="rightClickList"
        @addTree="addTree"
        @editTree="editTree"
        @deleteTree="deleteTree"
        :isNeedFilter="true"
      ></common-tree>
    </div>
    <div class="rightBox">
      <control-bar>
        <template slot="left">
          <fu-button size="medium" type="primary" @click="handleDivisionMerge"
            >区划合并</fu-button
          >
        </template>
        <!-- 控制条右侧区域插槽 -->
        <template slot="right">
          <advanced-query
            :columns="queryColumns"
            :hideAdvancedQuery="true"
            @tableSearch="tableSearch"
          ></advanced-query>
        </template>
      </control-bar>
      <common-table
        ref="divisionTable"
        tableId="divisionTable"
        :reqUrl="tableReqUrl"
        :reqParams="reqParams"
        :fu-column="tableColumn"
        :dynamicSlotName="dynamicSlotName"
        :isHasSelection="true"
        operationWidth="120px"
        @deliverySelection="deliverySelection"
      >
        <template slot-scope="myscope" slot="one">
          <i
            class="iconfont icon_bianji"
            title="编辑"
            @click="handleEditItem(myscope.data)"
          ></i>
          <i
            class="iconfont iconbiaoge_shanchu"
            title="删除"
            @click="handleDeleteItem(myscope.data)"
          ></i>
        </template>
      </common-table>
    </div>
    <!-- 新增、编辑、区划合并弹框 -->
    <merge-division-dialog
      v-if="mergeDivisionDialogVisible"
      @close="closeMergeDivisionDialog"
      :type="nodeType"
      :mergeDivisionDialogVisible="mergeDivisionDialogVisible"
    ></merge-division-dialog>
  </div>
</template>
<script>
import CommonTree from "@/components/CommonTree";
import AdvancedQuery from "@/components/AdvancedQuery";
import ControlBar from "@/components/ControlBar";
import CommonTable from "@/components/CommonTable";
import MergeDivisionDialog from "./components/MergeDivision";
import { Button } from "fusion-ui";
export default {
  components: {
    CommonTree,
    AdvancedQuery,
    ControlBar,
    CommonTable,
    MergeDivisionDialog,
    FuButton: Button,
  },
  props: {},
  data() {
    return {
      nodeType: "",
      mergeDivisionDialogVisible: false,
      tableReqUrl: "", // 表格url
      dynamicSlotName: "one",
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
          width: "200",
        },
        {
          label: "开始时间",
          prop: "startTime",
          width: "200",
        },
        {
          label: "结束时间",
          prop: "endTime",
          width: "200",
        },
        {
          label: "曾用区划名称",
          prop: "usedName",
          width: "200",
        },
        {
          label: "曾用区划代码",
          prop: "usedCode",
          width: "200",
        },
        {
          label: "说明",
          prop: "explain",
          width: "200",
        },
      ],
      queryForm: {
        name: "",
        status: "",
      },
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
        {
          label: "状态",
          labelWidth: "80px",
          placeholder: "请选择",
          type: "select",
          searchShow: true,
          defaultValue: "",
          modelData: "status",
          selectrequest: {
            url: "", // 状态接口地址
            params: [],
          },
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
        children: "children",
        label: "name",
        id: "id",
      },
    };
  },
  computed: {
    treeReq() {
      return {
        url: "",
        params: [{ vtype: "", name: "", data: "" }],
      };
    },
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
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    handleEditItem(row) {
      this.nodeType = "edit";
      this.mergeDivisionDialogVisible = true;
    },
    handleDeleteItem(row) {},
    // 表格多选的集合
    deliverySelection(selection) {},
    //查询
    tableSearch(form) {
      this.queryForm = JSON.parse(
        JSON.stringify(Object.assign(this.queryForm, form))
      );
    },
    // 点击树节点
    handleNodeClick(data) {
      console.log("点击树节点");
    },
    // 新增节点
    addTree() {
      this.nodeType = "add";
      this.mergeDivisionDialogVisible = true;
    },
    // 编辑节点
    editTree() {
      this.nodeType = "nodeEdit";
      this.mergeDivisionDialogVisible = true;
    },
    // 删除节点
    deleteTree() {},
    // 区划合并
    handleDivisionMerge() {
      this.nodeType = "merge";
      this.mergeDivisionDialogVisible = true;
    },
    closeMergeDivisionDialog() {
      this.mergeDivisionDialogVisible = false;
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
  .leftBox {
    width: 20%;
    padding-top: 14px;
  }
  .rightBox {
    width: 80%;
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
