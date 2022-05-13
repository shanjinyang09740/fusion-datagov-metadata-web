<template>
  <div class="content">
    <component-tree
      class="treecontainerMain"
      :treeData="treeData"
      @node-click="handleNodeClick"
      :defaultProps="defaultProps"
      :expandNodes="expandNodes"
      :treeId="treeId"
      ref="treeChild"
    ></component-tree>
  </div>
</template>

<script>
// import { Message } from "fusion-ui";
import ComponentTree from "@/components/CommonTree/index.vue";
import http from "@/utils/http";
import { FlatToNested } from "@/utils/tool";
export default {
  name: "variableTree",
  components: {
    ComponentTree,
  },
  props: {},
  data() {
    return {
      treeId: "variableTree",
      treeListData: [],
      treeData: [],
      expandNodes: [],

      defaultProps: {
        children: "children",
        label: "label",
        id: "id",
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
     * @description 初始化数据
     */
    initData() {
      let postData = `{"data": [{"vtype": "attr",  "name": "partitionCode",  "data": "${this.selectProjectValue}"}]}`;
      http
        .post("/api/meta/v1/indctFolder/getFolderTree.do", {
          postData: postData,
        })
        .then((res) => {
          let result = res.data[0].data;
          result = result.map((item) => {
            return {
              ...item,
              id: item.statIndctFolderId,
              pId: item.statIndctFolderPid,
              label: item.statIndctFolderLabel,
            };
          });
          this.treeListData = result;
          this.treeData = FlatToNested(result);
          if (this.treeData.length) {
            this.$nextTick(() => {
              // 默认高亮选中节点
              if (this.$refs.treeChild) {
                this.expandNodes.push(this.treeData[0].id);
                this.$refs.treeChild.setCurrentKeyHeightLight(
                  this.treeData[0].id
                );
                this.handleNodeClick(this.treeData[0]);
              }
            });
          }
        });
    },
    //树节点点击事件
    handleNodeClick(data) {
      this.$emit("treeNodeClick", data);
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  height: 100%;
}
.operate {
  display: flex;
  align-items: center;
  padding: 10px;
  justify-content: space-between;
}
.treecontainerMain {
  height: calc(100% - 60px);
}
.input-with-select {
  width: 98%;
}
</style>
