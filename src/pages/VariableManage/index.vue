<template>
  <div class="content">
    <div class="operateLan">
      <fu-select v-model="selectProjectValue" clearable placeholder="请选择">
        <fu-option
          v-for="item in selectProjectOption"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </fu-option>
      </fu-select>
      <div class="groupBtns">
        <fu-button type="primary" size="medium" @click="importVariable"
          >导入变量</fu-button
        >
        <fu-button type="primary" size="medium" @click="exportVariable"
          >导出变量</fu-button
        >
        <fu-button type="primary" size="medium" @click="exportModel"
          >导出模板</fu-button
        >
      </div>
    </div>
    <div class="main">
      <div class="leftArea">
        <variable-tree @treeNodeClick="treeNodeClick"></variable-tree>
      </div>
      <div class="rightArea">
        <div class="operateLan">
          <div class="groupBtns">
            <fu-dropdown class="dropDown" @command="handleCommand">
              <fu-button type="primary" size="medium">
                新增<i class="fu-icon-arrow-down fu-icon--right"></i>
              </fu-button>
              <fu-dropdown-menu slot="dropdown">
                <fu-dropdown-item
                  v-for="(item, index) in dropMenuOption"
                  :key="index"
                  :command="item.value"
                >
                  {{ item.label }}
                </fu-dropdown-item>
              </fu-dropdown-menu>
            </fu-dropdown>
            <fu-button type="primary" size="medium" @click="deleteRow"
              >批量删除</fu-button
            >
          </div>
          <fu-form :inline="true" class="form">
            <fu-form-item label="变量名称">
              <fu-input
                size="medium"
                v-model="formData.cnName"
                placeholder="请输入"
                clearable
              ></fu-input>
            </fu-form-item>
            <fu-form-item label="变量编码">
              <fu-input
                size="medium"
                v-model="formData.enName"
                placeholder="请输入"
                clearable
              ></fu-input>
            </fu-form-item>
            <fu-form-item label="变量类型">
              <fu-select
                v-model="selectVariableTypeValue"
                clearable
                placeholder="请选择"
              >
                <fu-option
                  v-for="item in selectVariableTypeOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </fu-option>
              </fu-select>
            </fu-form-item>
            <fu-form-item>
              <fu-button
                size="medium"
                type="primary"
                clearable
                @click="onSubmitQuery"
                >查询</fu-button
              >
              <fu-button
                size="medium"
                type="primary"
                clearable
                @click="onResetQuery"
                >重置</fu-button
              >
            </fu-form-item>
          </fu-form>
        </div>
        <main-table></main-table>
      </div>
    </div>
    <custom-dialog
      v-if="isShowDialog"
      :isShowDialog="isShowDialog"
      :title="dialogTitle"
      :width="'50%'"
      @on-result-change="changeIsShowDialog"
      @child-operation="operation"
    >
      <div slot="body">
        <component ref="dialogForm" :is="dialogComp"></component>
      </div>
    </custom-dialog>
    <dynamic-form-dialog
      v-if="isShowDynamicFormDialog"
      title="变量"
      :formItems="formItems"
      @submit="submitData"
    ></dynamic-form-dialog>
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
} from "fusion-ui";
import variableTree from "./components/variableTree";
import mainTable from "./components/mainTable";
import CustomDialog from "@/components/CommonDialog";
import variableTheme from "./components/AddTheme";
import variableGroup from "./components/AddGroup";
import DynamicFormDialog from "@/components/DynamicFormDialog";
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
      //调查项目下拉菜单
      selectProjectOption: [
        {
          label: "测试一",
          value: "variableTheme",
        },
        {
          label: "测试二",
          value: "variableGroup",
        },
        {
          label: "测试三",
          value: "variable",
        },
      ],
      selectProjectValue: "",
      //变量类型下拉菜单
      selectVariableTypeOption: [
        {
          label: "测试一",
          value: "variableTheme",
        },
        {
          label: "测试二",
          value: "variableGroup",
        },
        {
          label: "测试三",
          value: "variable",
        },
      ],
      selectVariableTypeValue: "",
      //下拉按钮菜单
      dropMenuOption: [
        {
          label: "变量主题",
          value: "variableTheme",
        },
        {
          label: "变量分组",
          value: "variableGroup",
        },
        {
          label: "变量",
          value: "variable",
        },
      ],
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
    mainTable,
    CustomDialog,
    variableTheme,
    variableGroup,
    DynamicFormDialog,
  },
  computed: {},
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
    /**
     * @description 变量弹窗提交回调事件
     * @param {Object} data
     */
    submitData(data) {
      console.log("成功提交数据了", data);
      this.isShowDynamicFormDialog = false;
    },
    /**
     * @description 下拉切换事件
     * @param {String} command
     */
    handleCommand(command) {
      if (command == "variable") {
        this.isShowDynamicFormDialog = true;
      } else {
        this.dialogComp = command;
        this.isShowDialog = true;
        this.dropMenuOption.some((item) => {
          if (command == item.value) {
            this.dialogTitle = item.label;
            return true;
          }
        });
      }
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
    treeNodeClick(data) {
      console.log("节点点击事件回来了", data);
    },
    /**
     * @description 弹窗关闭之前处理事件
     */
    beforeClose() {
      this.isShowDialog = false;
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
        //确认处理逻辑
        this.$refs.dialogForm.submit((data) => {
          console.log("获取到弹窗表单数据了", data);
          this.isShowDialog = false;
        });
      } else {
        //取消处理逻辑
        this.isShowDialog = false;
      }
    },
    /**
     * @description 新增
     */
    addNode() {
      this.isShowDialog = true;
    },
    /**
     * @description 删除
     */
    deleteRow() {},
    /**
     * @description 表单查询事件
     */
    onSubmitQuery() {},
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
  height: 100vh;
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
    width: 350px;
    border-right: 1px solid #cecece;
  }
  .rightArea {
    width: calc(100% - 312px);
  }
}
</style>
