<template>
  <div>
    <fu-form ref="modifyForm" :rules="diaFormRules" :fu-data="formData">
      <fu-form-item
        v-for="item in formItems"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :label-width="item.width"
        class="formItem"
      >
        <fu-input
          size="medium"
          :disabled="item.disabled"
          v-model="formData[item.prop]"
          clearable
        ></fu-input>
      </fu-form-item>
    </fu-form>
  </div>
</template>

<script>
import { Input, Button, Form, FormItem, Message } from "fusion-ui";
import http from "@/utils/http";

export default {
  name: "EditTree",
  components: {
    FuForm: Form,
    FuFormItem: FormItem,
    FuInput: Input,
    FuButton: Button,
  },
  props: {
    postFormData: {
      type: Object,
      default: () => {},
    },
    selectedProjectItem: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      formData: this.postFormData,
      formItems: [
        {
          label: "名称",
          width: "120px",
          prop: "statIndctFolderName",
          type: "input",
          disabled: false,
          placeholder: "请输入名称",
        },
        {
          label: "编码",
          width: "120px",
          prop: "statIndctFolderCode",
          type: "input",
          disabled: false,
          placeholder: "请输入编码",
        },
      ],
      diaFormRules: {
        statIndctFolderName: {
          required: true,
          message: "请输入名称",
          trigger: "blur",
        },
        statIndctFolderCode: {
          required: true,
          message: "请输入编码",
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
            "EditTree"
          );
        } else {
          Message.warning("请检查输入是否符合规则");
        }
      });
    },

    // submit() {
    //   this.$refs.modifyForm.$refs.el.validate((valid) => {
    //     if (valid) {
    //       let postData = {
    //         data: [
    //           {
    //             data: {
    //               level: this.formData.level,
    //               partitionCode: this.selectedProjectItem.value,
    //               partitionName: this.selectedProjectItem.text,
    //               sortNum: this.formData.sortNum,
    //               statIndctFolderCode: this.formData.statIndctFolderCode,
    //               statIndctFolderId: this.formData.statIndctFolderId,
    //               statIndctFolderLabel: this.formData.statIndctFolderLabel,
    //               statIndctFolderPid: this.formData.statIndctFolderPid,
    //               statIndctFolderType: this.formData.statIndctFolderType,
    //             },
    //             name: "indctFolder",
    //             vtype: "formpanel",
    //           },
    //         ],
    //       };
    //       http
    //         .post("/api/meta/v1/indctFolder/saveIndctFolder.do", {
    //           postData: JSON.stringify(postData),
    //         })
    //         .then((res) => {
    //           console.log("res...", res);
    //           this.$emit("close", "confirm");
    //         });
    //     } else {
    //       console.log("error submit!!");
    //       return false;
    //     }
    //   });
    // },
  },
};
</script>

<style lang="less" scoped>
.footer {
  display: flex;
  justify-content: right;
}
</style>
