<template>
  <fu-dialog
    ref="mergeDivisionDialog"
    :visible="mergeDivisionDialogVisible"
    @close="closeDialog"
    width="90%"
    :title="dialogTitle"
    class="mergeDivisionDialog"
    :close-on-click-modal="false"
  >
    <fu-form class="form">
      <fu-form-item
        v-for="item in formItems"
        :key="item.prop"
        :label="item.label"
        :label-width="item.width"
        class="formItem"
      >
        <fu-input
          size="medium"
          :disabled="item.disabled"
          v-model="formData[item.prop]"
          v-if="item.type === 'input'"
          clearable
        ></fu-input>
        <fu-select
          size="medium"
          :disabled="item.disabled"
          v-model="formData[item.prop]"
          style="width: 100%"
          v-if="item.type === 'select'"
          clearable
          filterable
        >
          <fu-option
            v-for="item in selectOptions[item.prop]"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          ></fu-option>
        </fu-select>
        <common-select-tree
          class="selectTree"
          v-if="item.type === 'selectTree'"
          :placeholder="item.placeholder || ''"
          :read-value="formData[item.prop]"
          :fu-data="selectOptions.higherTreeData"
          :model-change-array="[formData, item.prop]"
          @selectTreeChange="
            (val) => {
              selectTreeChange(val, formData, item.prop);
            }
          "
          :defaultExpand="defaultExpand"
          :normal-data="selectOptions[item.prop]"
        ></common-select-tree>
        <fu-date-picker
          style="width: 100%"
          type="date"
          placeholder="选择日期"
          format="yyyy 年 MM 月 dd 日"
          :disabled="item.disabled"
          value-format="yyyy-MM-dd"
          v-model="formData[item.prop]"
          v-if="item.type === 'datePicker'"
        >
        </fu-date-picker>
      </fu-form-item>
      <fu-form-item label="说明" label-width="120px" class="textareaFormItem">
        <fu-input
          size="medium"
          type="textarea"
          :rows="3"
          v-model="formData['explain']"
          clearable
        ></fu-input>
      </fu-form-item>
    </fu-form>
    <div class="footer-btn">
      <fu-button type="primary" size="medium" @click="handleSave"
        >保存</fu-button
      >
      <fu-button size="medium" @click="closeDialog">取消</fu-button>
    </div>
  </fu-dialog>
</template>
<script>
import {
  Dialog,
  Form,
  FormItem,
  Input,
  Select,
  Option,
  Button,
  DatePicker,
} from "fusion-ui";
import { postJSON } from "@/utils/post.js";
import CommonSelectTree from "@/components/CommonSelectTree";
export default {
  components: {
    FuDialog: Dialog,
    FuForm: Form,
    FuFormItem: FormItem,
    FuInput: Input,
    FuSelect: Select,
    FuOption: Option,
    FuButton: Button,
    FuDatePicker: DatePicker,
    CommonSelectTree,
  },
  props: {
    mergeDivisionDialogVisible: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      selectOptions: {
        is: [],
        higher: [], //请求回来未处理的数据
        higherTreeData: [], // 处理成父子结构的数据
      },
      defaultExpand: [],
      formData: {
        name: "",
        code: "",
        usedName: "",
        usedCode: "",
        higher: "",
        is: "",
        startTime: "",
        endTime: "",
        explain: "",
      },
      formItems: [
        {
          label: "名称",
          width: "120px",
          prop: "name",
          type: "input",
          disabled: false,
          placeholder: "请输入名称",
        },
        {
          label: "编码",
          width: "120px",
          prop: "code",
          type: "input",
          disabled: false,
          placeholder: "请输入编码",
        },
        {
          label: "曾用名",
          width: "120px",
          prop: "usedName",
          type: "input",
          disabled: true,
          placeholder: "请输入曾用名",
        },
        {
          label: "曾用编码",
          width: "120px",
          prop: "usedCode",
          type: "input",
          disabled: false,
          placeholder: "请输入曾用编码",
        },
        {
          label: "上级",
          width: "120px",
          prop: "higher",
          type: "selectTree",
          disabled: false,
          placeholder: "请选择上级",
        },
        {
          label: "是否",
          width: "120px",
          prop: "is",
          type: "select",
          disabled: false,
          placeholder: "请选择",
          selectrequest: {
            url: "", // 接口地址
            params: [],
          },
        },
        {
          label: "开始时间",
          width: "120px",
          prop: "startTime",
          type: "datePicker",
          disabled: false,
          placeholder: "请选择开始时间",
        },
        {
          label: "结束时间",
          width: "120px",
          prop: "endTime",
          type: "datePicker",
          disabled: true,
          placeholder: "请选择结束时间",
        },
        // {
        //   label: "说明",
        //   width: "120px",
        //   prop: "explain",
        //   type: "textarea",
        //   disabled: false,
        //   placeholder: "请输入说明",
        // },
      ],
    };
  },
  computed: {
    dialogTitle() {
      let title = "";
      switch (this.type) {
        case "add":
          title = "新增行政区划";
          break;
        case "edit":
        case "nodeEdit":
          title = "编辑行政区划";
          break;
        default:
          title = "行政区划";
          break;
      }
      return title;
    },
  },
  created() {
    // 请求form表单中下拉框的可选值
    this.formItems.forEach((item) => {
      if (item.type === "select") {
        postJSON(item.selectrequest.url, {
          postData: JSON.stringify(item.selectrequest.params),
        }).then((res) => {
          this.selectOptions[item.prop] = res.data[0].data;
        });
      }
    });
  },
  methods: {
    //下拉树选择的值改变之后，将当前选择的value赋值
    selectTreeChange(val, model, value) {
      this.$set(model, value, val.value);
    },
    handleSave() {
      console.log("保存接口");
      this.$emit("close");
    },
    getMenuList() {
      let that = this;
      //获取上级菜单的数据
      postJSON("").then((res) => {
        this.selectOptions.higher = res.data[0].data;
        let selectTree = this.transformTozTreeFormat(res.data[0].data);
        let defaultExpand = [];
        //   selectTree.forEach((item, index) => {
        selectTree[0].children &&
          selectTree[0].children.forEach((ele) => {
            defaultExpand.push(ele.id);
          });
        that.defaultExpand.splice(
          0,
          that.defaultExpand.length,
          ...defaultExpand
        );
        //   });
        this.$nextTick(() => {
          this.$set(this.selectOptions, "higherTreeData", selectTree);
        });
      });
    },
    //将普通的数组转换为父子结构
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
    closeDialog() {
      this.$emit("close");
    },
  },
};
</script>
<style lang="less" scoped>
.mergeDivisionDialog {
  .form {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }
  .formItem {
    width: 50%;
  }
  .textareaFormItem {
    width: 100%;
  }
  .selectTree {
    width: 100%;
    /deep/ .select-tree {
      width: 100%;
    }
  }
}
</style>
