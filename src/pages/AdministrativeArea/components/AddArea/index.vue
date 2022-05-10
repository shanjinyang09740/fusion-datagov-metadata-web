<template>
  <fu-dialog
    ref="addAreaDialog"
    :visible="addAreaDialogVisible"
    @close="closeDialog"
    width="90%"
    :title="dialogTitle"
    class="addAreaDialog"
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
        <fu-input
          size="medium"
          type="number"
          v-model="formData[item.prop]"
          v-if="item.type === 'numberInput'"
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
            v-for="item in selectOptions"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          ></fu-option>
        </fu-select>
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
} from "fusion-ui";
export default {
  components: {
    FuDialog: Dialog,
    FuForm: Form,
    FuFormItem: FormItem,
    FuInput: Input,
    FuSelect: Select,
    FuOption: Option,
    FuButton: Button,
  },
  props: {
    addAreaDialogVisible: {
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
      selectOptions: [
        {
          text: "全部",
          value: "0",
        },
        {
          text: "区域分类",
          value: "1",
        },
        {
          text: "分类",
          value: "2",
        },
      ],
      formData: {
        name: "",
        code: "",
        index: "",
        year: "",
        type: "",
      },
      formItems: [
        {
          label: "区划名称",
          width: "120px",
          prop: "name",
          type: "input",
          disabled: false,
          placeholder: "请输入区划名称",
        },
        {
          label: "区域代码",
          width: "120px",
          prop: "code",
          type: "input",
          disabled: false,
          placeholder: "请输入区域代码",
        },
        {
          label: "序号",
          width: "120px",
          prop: "index",
          type: "numberInput",
          disabled: false,
          placeholder: "请输入序号",
        },
        {
          label: "年代分类",
          width: "120px",
          prop: "year",
          type: "input",
          disabled: true,
          placeholder: "请输入年代分类",
        },
        {
          label: "类型",
          width: "120px",
          prop: "type",
          type: "select",
          disabled: true,
          placeholder: "请选择类型",
        },
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
          title = "编辑行政区划";
          break;
        default:
          title = "行政区划";
          break;
      }
      return title;
    },
  },
  methods: {
    handleSave() {
      console.log("保存接口");
      this.$emit("close");
    },
    closeDialog() {
      this.$emit("close");
    },
  },
};
</script>
<style lang="less" scoped>
.addAreaDialog {
  .form {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }
  .formItem {
    width: 33%;
  }
}
</style>
