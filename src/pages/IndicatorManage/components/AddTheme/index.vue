<template>
  <fu-form ref="modifyForm" :rules="diaFormRules" :fu-data="formData">
    <fu-form-item
      label="主题名称"
      prop="statIndctThemeName"
      label-width="120px"
    >
      <fu-input v-model="formData.statIndctThemeName" clearable></fu-input>
    </fu-form-item>
    <fu-form-item
      label="主题代码"
      prop="statIndctThemeCode"
      label-width="120px"
    >
      <fu-input v-model="formData.statIndctThemeCode" clearable></fu-input>
    </fu-form-item>
    <fu-form-item
      label="顺序号"
      prop="statIndctThemeSortNum"
      label-width="120px"
    >
      <fu-input-number
        v-model="formData.statIndctThemeSortNum"
        controls-position="right"
        :min="1"
        clearable
      ></fu-input-number>
    </fu-form-item>
  </fu-form>
</template>

<script>
import { Input, Form, FormItem, Message, InputNumber } from "fusion-ui";
export default {
  name: "diaForm",
  components: {
    FuInput: Input,
    FuForm: Form,
    FuFormItem: FormItem,
    FuInputNumber: InputNumber,
  },
  props: {},
  data() {
    return {
      formData: {},
      diaFormRules: {
        statIndctThemeName: {
          required: true,
          message: "请输入主题名称",
          trigger: "blur",
        },
        statIndctThemeCode: {
          required: true,
          message: "请输入主题编码",
          trigger: "blur",
        },
        statIndctThemeSortNum: {
          required: true,
          message: "请输入顺序号",
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
          callback(
            {
              ...this.formData,
            },
            "AddTheme"
          );
        } else {
          Message.warning("请检查输入是否合法");
        }
      });
    },
  },
};
</script>

<style lang="less" scoped></style>
