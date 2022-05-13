<template>
  <div class="content">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane
        v-for="item in formItems"
        :label="item.label"
        :name="item.name"
        :key="item.name"
      >
        <fu-form :rules="item.rules" :ref="item.name" :inline="true">
          <fu-form-item
            v-for="(ite, index) in item.data"
            :key="index"
            :label="ite.label"
            :prop="ite.prop"
          >
            <fu-input
              v-if="ite.type == 'input'"
              :disabled="ite.disabled"
              v-model="formData[ite.prop]"
              size="medium"
            ></fu-input>
            <fu-input
              v-else-if="ite.type == 'textarea'"
              type="textarea"
              :disabled="ite.disabled"
              v-model="formData[ite.prop]"
              size="medium"
              style="width: 100%"
            ></fu-input>
            <fu-select
              v-else-if="ite.type == 'select'"
              v-model="formData[ite.prop]"
              :disabled="ite.disabled"
              placeholder="请选择"
              size="medium"
            >
              <fu-option
                v-for="i in ite.option"
                :key="i.value"
                :label="i.text"
                :value="i.value"
              >
              </fu-option>
            </fu-select>
          </fu-form-item>
        </fu-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { Select, Option, Input, Form, FormItem, Message } from "fusion-ui";
import { formItems } from "./js/formItems";
export default {
  components: {
    FuSelect: Select,
    FuOption: Option,
    FuInput: Input,
    FuForm: Form,
    FuFormItem: FormItem,
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    postIndicatorForm: {
      type: Object,
      default: () => {},
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      activeName: "baseForm",
      formItems: formItems,
      formData: {},
    };
  },
  created() {
    if (this.isEdit) {
      this.formData = this.postIndicatorForm;
    }
  },
  methods: {
    /**
     * @description 提交表单数据
     * @params {Function} callback
     */
    submit(callback) {
      callback(
        {
          ...this.formData,
        },
        "AddVariable"
      );
      // this.$refs["modifyForm"].$refs.el.validate((valid) => {
      //   if (valid) {
      //     callback(
      //       {
      //         ...this.formData,
      //       },
      //       "AddTheme"
      //     );
      //   } else {
      //     Message.warning("请检查输入是否合法");
      //   }
      // });
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  max-height: 500px;
  overflow: auto;
  /deep/ .el-form-item__label {
    white-space: nowrap;
  }
}
</style>
