<template>
  <fu-form ref="modifyGroupForm" :rules="diaFormRules" :fu-data="formData">
    <fu-form-item label="层级：" prop="level" label-width="120px">
      <fu-radio-group v-model="level">
        <fu-radio
          v-for="(item, index) in levelOption"
          :key="index"
          :label="item.value"
          >{{ item.label }}</fu-radio
        >
      </fu-radio-group>
    </fu-form-item>
    <fu-form-item
      label="文件夹名称："
      prop="statIndctFolderLabel"
      label-width="120px"
    >
      <fu-input v-model="formData.statIndctFolderLabel" clearable></fu-input>
    </fu-form-item>
    <fu-form-item
      label="文件夹编码："
      prop="statIndctFolderCode"
      label-width="120px"
    >
      <fu-input v-model="formData.statIndctFolderCode" clearable></fu-input>
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
    FuRadioGroup: RadioGroup,
  },
  props: {
    selectTreeNode: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      level: "children",
      formData: {},
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
          callback({
            ...this.formData,
            statIndctFolderId: "",
            statIndctFolderPid:
              this.level == "same"
                ? this.selectTreeNode.statIndctFolderPid
                : this.selectTreeNode.statIndctFolderId,
            statIndctFolderType: 1,
          });
        } else {
          Message.warning("请检查输入是否符合规则");
        }
      });
    },
  },
};
</script>

<style lang="less" scoped></style>
