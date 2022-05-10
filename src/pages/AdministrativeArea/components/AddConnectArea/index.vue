<template>
  <fu-dialog
    ref="areaDialog"
    :visible="areaDialogVisible"
    @close="closeDialog"
    top="2vh"
    title="新增附属行政区划"
    class="areaDialog"
    :close-on-click-modal="false"
  >
    <common-tree
      ref="tree"
      treeId="areaTree"
      class="treecontainer"
      :tree-req="addAreaTreeReq"
      @node-click="handleNodeClick"
      :defaultProps="defaultProps"
      :showCheckbox="true"
      :isNeedFilter="true"
    ></common-tree>
    <div class="footer-btn">
      <fu-button type="primary" size="medium" @click="handleSave"
        >确认</fu-button
      >
      <fu-button size="medium" @click="closeDialog">关闭</fu-button>
    </div>
  </fu-dialog>
</template>
<script>
import { Dialog, Button, Message } from "fusion-ui";
import { postJSON } from "@/utils/post.js";
import CommonTree from "@/components/CommonTree";
export default {
  components: {
    FuDialog: Dialog,
    FuButton: Button,
    CommonTree,
  },
  props: {
    areaDialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "name",
        id: "id",
      },
    };
  },
  computed: {
    addAreaTreeReq() {
      return {
        url: "/api/meta/v1/area/queryAreaAddrRel.do",
        params: [
          { vtype: "attr", name: "value", data: "F000101" },
          { vtype: "attr", name: "label", data: "" },
        ],
      };
    },
  },
  created() {},
  methods: {
    handleNodeClick(data) {
      this.$emit("node-click", data);
      //   this.documentType = data.id;
    },
    handleSave() {
      let postData = {
        data: [
          { vtype: "attr", name: "value", data: "" },
          { vtype: "attr", name: "addrs", data: "" },
        ],
      };
      postJSON("/api/meta/v1/area/saveAreaAddrRel.do", {
        postData: JSON.stringify(postData),
      }).then((res) => {
        this.$emit("close");
        Message.success("保存成功");
      });
    },
    closeDialog() {
      this.$emit("close");
    },
  },
};
</script>
<style lang="less" scoped></style>
