<template>
  <fu-form ref="modifyGroupForm" :rules="diaFormRules" :fu-data="formData">
    <fu-form-item
      label="上级主题或分类："
      prop="statIndctFolderName"
      label-width="140px"
    >
      <select-tree
        v-model="formData.statIndctFolderName"
        :treeData="selectTreeData"
        @getSelectData="getSelectData"
      ></select-tree>
    </fu-form-item>
    <fu-form-item
      label="分类名称："
      prop="statIndctTypeName"
      label-width="120px"
    >
      <fu-input v-model="formData.statIndctTypeName" clearable></fu-input>
    </fu-form-item>
    <fu-form-item
      label="分类代码："
      prop="statIndctTypeCode"
      label-width="120px"
    >
      <fu-input v-model="formData.statIndctTypeCode" clearable></fu-input>
    </fu-form-item>
    <fu-form-item
      label="顺序号"
      prop="statIndctTypeSortNum"
      label-width="120px"
    >
      <fu-input-number
        v-model="formData.statIndctTypeSortNum"
        controls-position="right"
        :min="1"
        clearable
      ></fu-input-number>
    </fu-form-item>
  </fu-form>
</template>

<script>
import SelectTree from "../SelectTree";
import http from "@/utils/http";
import { FlatToNested } from "@/utils/tool";
import {
  Radio,
  RadioGroup,
  Input,
  Form,
  FormItem,
  Message,
  InputNumber,
} from "fusion-ui";
export default {
  name: "diaForm",
  components: {
    FuInput: Input,
    FuForm: Form,
    FuFormItem: FormItem,
    FuRadio: Radio,
    FuRadioGroup: RadioGroup,
    FuInputNumber: InputNumber,
    SelectTree,
  },
  props: {},
  data() {
    return {
      formData: {},
      selectTreeData: [],
      selectCallData: {},
      diaFormRules: {
        statIndctFolderName: {
          required: true,
          message: "请选择",
          trigger: "blur",
        },
        statIndctTypeName: {
          required: true,
          message: "请输入分类名称",
          trigger: "blur",
        },
        statIndctTypeCode: {
          required: true,
          message: "请输入分类代码",
          trigger: "blur",
        },
        statIndctTypeSortNum: {
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
  created() {
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
     * @description 初始化数据
     */
    initData() {
      //渲染下拉框树
      http.post("/api/meta/v1/indct/folder/getFolderTree.do").then((res) => {
        let result = res.data[0].data;
        result = result.map((item) => {
          return {
            ...item,
            id: item.statIndctFolderId,
            pId: item.statIndctFolderPid,
            label: item.statIndctFolderName,
          };
        });
        this.selectTreeData = FlatToNested(result);
      });
    },
    /**
     * @description 获取下拉树选中数据
     * @param {Object} data
     */
    getSelectData(data) {
      this.selectCallData = data;
    },
    /**
     * @description 提交表单数据
     * @params {Function} callback
     */
    submit(callback) {
      this.$refs["modifyGroupForm"].$refs.el.validate((valid) => {
        if (valid) {
          let postData = {};
          if (Object.keys(this.selectCallData).length > 0) {
            if (this.selectCallData.statIndctFolderType == "1") {
              postData = {
                statIndctThemeId: this.selectCallData.statIndctThemeId,
                statIndctTypePid: this.selectCallData.statIndctFolderId,
                statIndctTypeName: this.formData.statIndctTypeName,
                statIndctTypeCode: this.formData.statIndctTypeCode,
                statIndctTypeSortNum: this.formData.statIndctTypeSortNum,
                statIndctTypeId: "",
              };
            } else {
              postData = {
                statIndctThemeId: this.selectCallData.statIndctThemeId,
                statIndctTypeName: this.formData.statIndctTypeName,
                statIndctTypeCode: this.formData.statIndctTypeCode,
                statIndctTypeSortNum: this.formData.statIndctTypeSortNum,
                statIndctTypeId: "",
                statIndctTypePid: "",
              };
            }
          }
          callback(postData, "AddFolder");
        } else {
          Message.warning("请检查输入是否符合规则");
        }
      });
    },
  },
};
</script>

<style lang="less" scoped></style>
