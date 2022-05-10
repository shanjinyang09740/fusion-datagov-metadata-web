<template>
  <div>
    <div class="operate">
      <fu-input
        placeholder="请输入内容"
        v-model="filterText"
        class="input-with-select"
      >
        <fu-button slot="append" icon="el-icon-search"></fu-button>
      </fu-input>
      <fu-checkbox v-model="isDragable">允许拖拽</fu-checkbox>
    </div>
    <component-tree
      class="treecontainer"
      :treeData="treeData"
      :searchText="filterText"
      @node-click="handleNodeClick"
      :defaultProps="defaultProps"
      :expandNodes="expandNodes"
      :treeId="treeId"
      :isDragable="isDragable"
      ref="treeChild"
    ></component-tree>
  </div>
</template>

<script>
import { Input, Button, Checkbox } from "fusion-ui";
import ComponentTree from "@/components/CommonTree/index.vue";
export default {
  name: "variableTree",
  components: {
    FuInput: Input,
    FuButton: Button,
    FuCheckbox: Checkbox,
    ComponentTree,
  },
  props: {},
  data() {
    return {
      //是否允许拖拽
      isDragable: false,
      treeId: "variableTree",
      treeData: [
        {
          id: "1",
          label: "一级 1",
          children: [
            { id: "1-1", label: "二级 1-1", children: [{id: "1-1-1", label: "三级 1-1-1" }] },
          ],
        },
      ],
      expandNodes: [],
      filterText: "",
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
    initData() {},
    //树节点点击事件
    handleNodeClick(data) {
      this.$emit("treeNodeClick", data);
    },
  },
};
</script>

<style lang="less" scoped>
.operate {
  display: flex;
  align-items: center;
  padding: 10px;
  justify-content: space-between;
}
.input-with-select {
  width: 70%;
}
</style>
