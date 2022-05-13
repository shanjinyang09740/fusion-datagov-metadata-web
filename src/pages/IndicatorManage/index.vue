<template>
  <div class="content">
    <div class="main">
      <div class="leftArea">
        <variable-tree
          ref="variableTree"
          @treeNodeClick="treeNodeClick"
        ></variable-tree>
      </div>
      <div class="rightArea">
        <div class="operateLan">
          <div class="groupBtns">
            <fu-button type="primary" size="medium" @click="importVariable"
              >导入指标</fu-button
            >
            <fu-button type="primary" size="medium" @click="exportVariable"
              >导出指标</fu-button
            >
            <fu-button type="primary" size="medium" @click="createVariable"
              >新建指标</fu-button
            >
            <fu-button
              type="primary"
              :disabled="isMoveDisable"
              size="medium"
              @click="moveVariable"
              >移动</fu-button
            >
            <fu-button
              :disabled="isMoveDisable"
              type="primary"
              size="medium"
              @click="batchDeleteRows"
              >删除</fu-button
            >
          </div>
          <fu-form :inline="true" class="form">
            <fu-form-item label="指标名称/编码">
              <fu-input
                size="medium"
                v-model="formData.label"
                placeholder="请输入"
                clearable
              ></fu-input>
            </fu-form-item>
            <fu-form-item>
              <fu-button
                size="medium"
                type="primary"
                clearable
                @click="tableSearch"
                >查询</fu-button
              >
            </fu-form-item>
          </fu-form>
        </div>
        <main-table
          @upDateTableData="upDateTableData"
          :postTableData="postTableData"
          :tableOperateBtnGroup="tableOperateBtnGroup"
          :tableCompType="tableCompType"
          :rowKey="rowKey"
          :isEdit="false"
          @changeMoveBtnStatus="changeMoveBtnStatus"
          @editIndicator="editIndicator"
          ref="MainTable"
        ></main-table>
      </div>
    </div>
    <custom-dialog
      v-if="isShowDialog"
      :isShowDialog="isShowDialog"
      :title="dialogTitle"
      :width="'80%'"
      @on-result-change="changeIsShowDialog"
      @child-operation="operation"
    >
      <div slot="body">
        <component
          :selectTreeNode="selectTreeNode"
          :postIndicatorForm="postIndicatorForm"
          :isEdit="isEdit"
          ref="dialogForm"
          :is="dialogComp"
        ></component>
      </div>
    </custom-dialog>
  </div>
</template>
<script>
import {
  Button,
  Input,
  Form,
  FormItem,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Select,
  Option,
  Message,
} from "fusion-ui";
import variableTree from "./components/variableTree";
import MainTable from "./components/IndicatorTable";
import CustomDialog from "@/components/CommonDialog";
import AddVariable from "./components/AddVariable";
import MoveVariable from "./components/MoveVariable";
import http from "@/utils/http";
export default {
  name: "variableManage",
  props: {},
  data() {
    return {
      //表单数据
      formData: {},
      //是否显示弹窗组件
      isShowDialog: false,
      //弹窗内容组件
      dialogComp: "",
      dialogTitle: "",
      //变量弹窗
      isShowDynamicFormDialog: false,
      formItems: [
        {
          label: "名称",
          controlType: "text",
          controlJson: "",
          code: "vcode",
          datType: "String",
          displayHide: "1",
          length: "20",
          sort: "sort",
        },
      ],
      //是否禁用移动按钮
      isMoveDisable: true,
      //当前选中的指标树节点
      selectTreeNode: {},
      //表格行key
      rowKey: "statIndctId",
      //表格组件类别
      tableCompType: "indicator",
      //指标属性参数
      postIndicatorForm: {},
      //指标弹窗是否编辑
      isEdit: false,
      //表格操作列显示按钮类型
      tableOperateBtnGroup: [
        {
          label: "编辑",
          value: "editRow",
          icon: "iconbiaoge_bianji",
          imgPath: "",
        },
        {
          label: "删除",
          value: "deleteRow",
          icon: "iconbiaoge_shanchu",
          imgPath: "",
        },
        {
          label: "复制",
          value: "copyRow",
          icon: "iconqita_yingshe",
          imgPath: "",
        },
        {
          label: "创建新版本",
          value: "createVersion",
          icon: "iconqita_zidingyi",
          imgPath: "",
        },
        {
          label: "查看血缘",
          value: "viewBloodItem",
          icon: "iconbiaoge_xieyuanguanxi",
          imgPath: "",
        },
      ],
      //表格数据
      postTableData: {
        column: [
          {
            label: "名称",
            prop: "statIndctNameCh",
            width: "150",
            //是否缩进
            isIndent: true,
          },
          {
            label: "编码",
            prop: "statIndctCode",
            width: "100",
          },
          {
            label: "别名",
            prop: "statIndctNicknameCh",
            width: "150",
            reqUrl: "",
          },
          {
            label: "层级",
            prop: "statIndctLevel",
            width: "50",
          },
          {
            label: "顺序号",
            prop: "statIndctSortNum",
            width: "80",
          },
          {
            label: "版本",
            prop: "statIndctVersion",
            width: "80",
          },
          {
            label: "汇总类型",
            prop: "statIndctAggregateType",
            width: "80",
          },
          {
            label: "量纲",
            prop: "statIndctUmDimension",
            width: "100",
            reqUrl: "",
          },
          {
            label: "计量单位",
            prop: "statIndctUm",
            width: "100",
            isInput: true,
          },
          {
            label: "指标类型",
            prop: "statIndctType2",
            width: "100",
            reqUrl: "",
          },
          {
            label: "数据类型",
            prop: "statIndctDataType",
            width: "100",
            reqUrl: "",
          },
          {
            label: "指标状态",
            prop: "statIndctStatus",
            width: "100",
            reqUrl: "",
          },
        ],
        rows: [],
      },
    };
  },
  components: {
    FuButton: Button,
    FuInput: Input,
    FuForm: Form,
    FuFormItem: FormItem,
    FuDropdown: Dropdown,
    FuDropdownItem: DropdownItem,
    FuDropdownMenu: DropdownMenu,
    FuSelect: Select,
    FuOption: Option,
    variableTree,
    MainTable,
    CustomDialog,
    AddVariable,
    MoveVariable,
  },
  computed: {},
  watch: {
    //查询表单
    formData: {
      handler(newVal, oldVal) {
        if (!newVal.label) {
          this.tableSearch();
        }
      },
      deep: true,
    },
  },
  beforeCreate() {},
  created() {
    //初始化数据
    this.initData();
  },
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    /**
     * @description 编辑指标属性事件
     * @param {Object} row
     */
    editIndicator(row) {
      this.isEdit = true;
      this.postIndicatorForm = row;
      this.dialogComp = "AddVariable";
      this.isShowDialog = true;
      this.dialogTitle = "编辑指标";
    },
    /**
     * @description 修改移动按钮禁用状态
     * @param {Boolean} bool
     */
    changeMoveBtnStatus(bool) {
      this.isMoveDisable = bool;
    },
    /**
     * @description 移动指标
     */
    moveVariable() {
      this.dialogComp = "MoveVariable";
      this.isShowDialog = true;
      this.dialogTitle = "分组移动";
    },
    /**
     * @description 新建指标
     */
    createVariable() {
      this.isEdit = false;
      this.dialogComp = "AddVariable";
      this.isShowDialog = true;
      this.dialogTitle = "新建指标";
    },
    /**
     * @description 初始化数据
     */
    initData() {},
    /**
     * @description 表格修改保存事件
     */
    saveData() {
      //获取当前表格的数据
      let tableData = this.$refs.MainTable.tableData.rows.map((item) => {
        return {
          ...item,
          statIndctCreatDate: item.statIndctCreatDate
            ? item.statIndctCreatDate
            : null,
          statIndctStartDate: item.statIndctStartDate
            ? item.statIndctStartDate
            : null,
          statIndctStopDate: item.statIndctStopDate
            ? item.statIndctStopDate
            : null,
          statIndctUpdateDate: item.statIndctUpdateDate
            ? item.statIndctUpdateDate
            : null,
        };
      });
      let idsArr = tableData.map((item) => {
        return item.statIndctId;
      });

      let postData = {
        data: [
          {
            name: "indcts",
            vtype: "json",
            data: [...tableData],
          },
          {
            name: "ids",
            vtype: "attr",
            data: idsArr.join(","),
          },
        ],
      };
      console.log("获取到当前表格的数据", tableData);
      http
        .post("/api/meta/v1/indct/saveIndcts.do", {
          postData: JSON.stringify(postData),
        })
        .then((res) => {
          let result = res.data[0].data;
          if (result == "success") {
            Message.success("保存成功");
          } else {
            Message.error("保存失败");
          }
        })
        .catch(() => {
          Message.error("保存失败");
        });
    },
    /**
     * @description 拷贝事件
     */
    copyData() {},
    /**
     * @description 变量弹窗提交回调事件
     * @param {Object} data
     */
    submitData(data) {
      console.log("成功提交数据了", data);
      this.isShowDynamicFormDialog = false;
    },
    /**
     * @description 导入变量
     */
    importVariable() {},
    /**
     * @description 导出变量
     */
    exportVariable() {},
    /**
     * @description 导出模板
     */
    exportModel() {},
    /**
     * @description 树节点点击事件触发回调
     * @param {Object} data
     */
    treeNodeClick(node) {
      console.log("节点点击事件回来了", node);
      this.selectTreeNode = node;
      //刷新表格数据
      if (node.statIndctFolderType && node.statIndctFolderType == "1")
        this.afrashTableData();
    },
    //刷新表格数据
    afrashTableData() {
      let postData = {
        data: [
          {
            name: "indct",
            vtype: "json",
            data: {
              statIndctTypeId: this.selectTreeNode.statIndctFolderId,
            },
          },
          { name: "searchType", vtype: "attr", data: "1" },
        ],
      };
      //TODO begin---测试数据待删除
      // let postData = {
      //   data: [
      //     {
      //       name: "indct",
      //       vtype: "json",
      //       data: {
      //         statIndctId: "1",
      //         statIndctTypeId: "11",
      //         statIndctType2: "",
      //         statIndctStatus: "",
      //         statIndctLabel: "1",
      //         statIndctVersion: "1",
      //       },
      //     },
      //     { name: "searchType", vtype: "attr", data: "1" },
      //   ],
      // };
      //TODO end---测试数据待删除
      http
        .post("/api/meta/v1/indct/queryIndctlist.do", {
          postData: JSON.stringify(postData),
        })
        .then((res) => {
          let result = res.data[0].data.rows;
          this.postTableData.rows = result;
        });
    },

    /**
     * @description 切换弹窗显示状态
     * @param {Boolean} val
     */
    changeIsShowDialog(val) {
      this.isShowDialog = val;
    },
    /**
     * @description 弹窗操作按钮事件
     * @param {String} val ---- confirm/cancel 确认/取消
     * @param {Object} data 表单数据
     */
    operation(val) {
      if (val == "confirm") {
        //确认处理逻辑---data 表单数据   type 弹窗组件类型
        this.$refs.dialogForm.submit((data, type) => {
          console.log("获取到弹窗表单数据了", data);
          if (type == "AddVariable") {
            this.createVariableDialogCallback(data);
          } else if (type == "MoveVariable") {
            this.moveVariableDialogCallback(data);
          }
        });
      } else {
        //取消处理逻辑
        this.isShowDialog = false;
      }
    },
    //移动指标弹窗回调函数
    moveVariableDialogCallback(data) {
      let selectIndicatorNodesArr = this.$refs.MainTable.selectedTableData;
      let ids = selectIndicatorNodesArr.map((item) => item.statIndctId);
      let postData = {
        data: [
          { name: "folderId", vtype: "attr", data: data.folderId },
          { name: "ids", vtype: "attr", data: ids.join(",") },
        ],
      };
      http
        .post("/api/meta/v1/indct/moveIndct.do", {
          postData: JSON.stringify(postData),
        })
        .then((res) => {
          Message.success("移动成功");
          this.isShowDialog = false;
          //刷新树数据
          this.$refs.variableTree.initTreeData();
        })
        .catch(() => {
          Message.error("移动失败");
        });
    },
    //新建指标弹窗回调函数
    createVariableDialogCallback(data) {
      let postData = {
        data: [
          {
            data: {
              ...data,
            },
            name: "formpanel",
            vtype: "formpanel",
          },
        ],
      };
      http
        .post("/api/meta/v1/indct/saveIndct.do", {
          postData: JSON.stringify(postData),
        })
        .then((res) => {
          this.isShowDialog = false;
          Message.success("新建成功");
          //刷新树数据
          this.$refs.variableTree.initTreeData();
        })
        .catch(() => {
          Message.error("新建失败");
        });
    },
    /**
     * @description 新增
     */
    addNode() {
      this.isShowDialog = true;
    },
    /**
     * @description 批量删除
     */
    batchDeleteRows() {
      this.$refs.MainTable.batchDeleteRow();
    },
    /**
     * @description 表单查询事件
     */
    tableSearch() {
      let codeArr = ["statIndctNameCh", "statIndctCode"];
      this.$refs.MainTable.tableBlurredQuery(codeArr, this.formData.label);
    },
    /**
     * @description 修改表格数据操作
     * @param {Array} data
     */
    upDateTableData() {
      this.afrashTableData();
      // this.postTableData.rows = data;
    },
    /**
     * @description 表单重置事件
     */
    onResetQuery() {
      this.formData = {};
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  height: 100%;
  display: flex;
  flex-direction: column;
  .fenqu {
    .label {
      font-size: 16px;
      color: #666;
      padding-right: 10px;
    }
  }
}
.dropDown {
  margin-right: 10px;
}

.operateLan {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #cecece;
  justify-content: space-between;
  /deep/ .el-form .el-form-item {
    margin-bottom: 0;
  }
}
.main {
  display: flex;
  justify-content: space-between;
  height: calc(100% - 62px);
  .leftArea {
    width: 300px;
    border-right: 1px solid #cecece;
  }
  .rightArea {
    width: calc(100% - 310px);
  }
}
</style>
