<template>
  <fu-form ref="modifyGroupForm" :rules="diaFormRules" :fu-data="formData">
    <fu-form-item label="层级：" prop="level" label-width="120px">
      <fu-radio-group v-model="formData.level">
        <fu-radio
          v-for="(item, index) in levelOption"
          :key="index"
          :label="item.value"
          >{{ item.label }}</fu-radio
        >
      </fu-radio-group>
    </fu-form-item>
    <fu-form-item label="主题名称：" prop="themeName" label-width="120px">
      <fu-input v-model="formData.themeName" clearable></fu-input>
    </fu-form-item>
    <fu-form-item label="主题编码：" prop="themeCode" label-width="120px">
      <fu-input v-model="formData.themeCode" clearable></fu-input>
    </fu-form-item>
  </fu-form>
</template>

<script>
import { Radio, RadioGroup, Input, Form, FormItem, Message } from "fusion-ui";
export default {
  name: "diaForm",
  components: {
    FuInput: Input,
    FuForm: Form,
    FuFormItem: FormItem,
    FuRadio: Radio,
    FuRadioGroup: RadioGroup
  },
  props: {},
  data() {
    return {
      formData: {
          level: "children"
      },
      levelOption: [
        {
          label: "同级",
          value: "same",
        },
        {
          label: "下级",
          value: "children",
        },
      ],
      diaFormRules: {
        level: {
          required: true,
        },
        themeName: {
          required: true,
          message: "请输入主题名称",
          trigger: "blur",
        },
        themeCode: {
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
      this.$refs["modifyGroupForm"].$refs.el.validate((valid) => {
        if (valid) {
          callback(this.formData);
        } else {
          Message.warning("请检查输入是否符合规则");
        }
      });
    },
  },
};
</script>

<style lang="less" scoped></style>
