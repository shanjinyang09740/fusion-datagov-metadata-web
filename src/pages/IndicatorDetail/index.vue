<template>
  <div>
    <fu-dialog
      class="dialog-form"
      @close="closeDialog"
      :title="
        type === 'add' ? '新建指标' : type === 'check' ? '查看指标' : '编辑指标'
      "
      width="80%"
      top="5vh"
      :visible="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal-append-to-body="false"
      append-to-body
    >
      <div class="dialog-body">
        <fu-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <fu-tab-pane label="基本属性" name="basicProperty">
            <basic-property
              ref="basicProperty"
              :basicPropertyForm="formData"
            ></basic-property>
          </fu-tab-pane>
          <fu-tab-pane label="管理属性" name="manageProperty">
            <manage-property
              ref="manageProperty"
              :managePropertyForm="formData"
            ></manage-property>
          </fu-tab-pane>
          <fu-tab-pane label="数据属性" name="dataProperty">
            <data-property
              ref="dataProperty"
              :dataPropertyForm="formData"
            ></data-property>
          </fu-tab-pane>
        </fu-tabs>
      </div>
      <div slot="footer" class="dialog-footer">
        <fu-button type="primary" size="medium" @click="handleClickSave"
          >保存</fu-button
        >
        <fu-button plain size="medium" @click="closeDialog">取消</fu-button>
      </div>
    </fu-dialog>
  </div>
</template>

<script>
import { Dialog, Button, Tabs, TabPane } from "fusion-ui";
import BasicProperty from "./components/BasicProperty.vue";
import ManageProperty from "./components/ManageProperty.vue";
import DataProperty from "./components/DataProperty.vue";

import {} from "@/service";

export default {
  name: "mainTable",
  components: {
    FuDialog: Dialog,
    FuButton: Button,
    FuTabs: Tabs,
    FuTabPane: TabPane,
    BasicProperty,
    ManageProperty,
    DataProperty,
  },
  props: {
    dialogVisible: {
      type: Boolean,
    },
    type: {
      type: String,
      default: "add",
    },
    currentData: {
      type: Object,
    },
  },
  data() {
    return {
      activeName: "basicProperty",
      formData: {},
      disabled: false,
    };
  },
  computed: {
    codeListOption() {
      return function (id) {
        return this.$store.state.reqData[id] || [];
      };
    },
  },
  watch: {
    dialogVisible(newVal) {
      if (newVal) {
        if (this.type === "edit") {
          // this.$set(this, "formData", this.currentData);
          // this.$set(
          //   this.formData,
          //   "roomType",
          //   this.currentData.roomType.split(",")
          // );
          // console.log(this.formData);
          // this.disabled = false;
        } else {
          // this.disabled = false;
        }
      }
    },
  },
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
     * @description  切换tab签
     */
    handleClick(tab, event) {
      console.log(tab, event);
    },
    /**
     * @description 保存
     */
    handleClickSave() {
      //表单校验
      this.$refs.formData.$refs.el.validate(async (valid) => {
        if (valid) {
          // const postData = JSON.parse(JSON.stringify(this.formData));
          // postData.roomType = postData.roomType.join(",");
          // console.log("postData", postData);
          //调接口
          // const { data } = await addBasicAttribute(postData);
          // console.log("data", data);
          // if (data[0].data.msg === "success") {
          //   Message.success("操作成功");
          //   this.closeDialog("success");
          // }
        }
      });
    },

    /**
     * @description 返回
     */
    closeDialog(type) {
      this.$emit("closeDialog", type);
      this.$refs.formData.$refs.el.resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
.dialog-body {
  overflow: auto;
  height: 620px;
}
// .add-form {
//   display: flex;
//   flex-wrap: wrap;
//   .add-form-item {
//     width: 100%;
//   }
// }
.input-number {
  /deep/input {
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
    -moz-appearance: textfield;
  }
}
/deep/ .el-dialog__header {
  text-align: center;
  background-color: #409eff;
  .el-dialog__title {
    color: #fff;
  }
}
/deep/ .el-dialog__footer {
  padding: 10px 20px 10px;
  text-align: right;
  background-color: #ebeef5;
}
/deep/ .el-dialog__body {
  padding: 10px 10px;
}
</style>
