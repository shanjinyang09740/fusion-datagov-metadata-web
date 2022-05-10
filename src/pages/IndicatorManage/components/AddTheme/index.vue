<template>
  <fu-form
    ref="modifyForm"
    :rules="diaFormRules"
    :fu-data="formData"
  >
    <fu-form-item
      label="主题名称"
      prop="statIndctFolderLabel"
      label-width="120px"
    >
      <fu-input v-model="formData.statIndctFolderLabel" clearable></fu-input>
    </fu-form-item>
    <fu-form-item
      label="主题编码"
      prop="statIndctFolderCode"
      label-width="120px"
    >
      <fu-input v-model="formData.statIndctFolderCode" clearable></fu-input>
    </fu-form-item>
  </fu-form>
</template>

<script>
import { Input, Form, FormItem, Message } from "fusion-ui";
export default {
  name: "diaForm",
  components: {
    FuInput: Input,
    FuForm: Form,
    FuFormItem: FormItem,
  },
  props: {
    selectTreeNode: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      formData: {},
      diaFormRules: {
        statIndctFolderLabel: {
          required: true,
          message: "请输入主题名称",
          trigger: "blur",
        },
        statIndctFolderCode: {
          required: true,
          message: "请输入主题编码",
          trigger: "blur",
        },
      },
    };
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
     * @description 提交表单数据
     * @params {Function} callback
     */
    submit(callback) {
      this.$refs["modifyForm"].$refs.el.validate((valid) => {
        if (valid) {
          callback({
            ...this.formData,
            statIndctFolderId: "",
            statIndctFolderPid: "",
            statIndctFolderType: 0
          });
        } else {
          Message.warning("请检查输入是否合法");
        }
      });
    },
  },
};
</script>

<style lang="less" scoped></style>
