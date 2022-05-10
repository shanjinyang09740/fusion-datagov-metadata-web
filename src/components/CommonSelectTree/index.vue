<template>
  <!-- 下拉树 -->
  <div>
    <fu-select
      :popper-append-to-body="false"
      class="select-tree"
      :placeholder="placeholder"
      size="medium"
      v-model="selectTreeValue"
      clearable
      :disabled="disabled"
      :ref="'search-select'"
      @clear="clearSelect()"
    >
      <fu-option
        :key="selectTreeValue"
        :value="selectTreeValue"
        :label="selectTreeLabel"
      >
        <fu-tree
          size="medium"
          :fu-data="fuData"
          :ref="'SelectTreeComponent'"
          node-key="id"
          :props="{ label: 'text', value: 'id' }"
          :show-checkbox="isMultiple"
          :check-strictly="checkStrictly"
          :check-on-click-node="true"
          :default-expanded-keys="defaultExpand"
          :default-checked-keys="defaultDeptAll"
          :highlight-current="true"
          :render-after-expand="true"
          :filter-node-method="filterNode"
          @node-click="handleNodeClick"
          @check-change="(data, checked) => handleCheckChange(data, checked)"
        >
        </fu-tree>
      </fu-option>
    </fu-select>
  </div>
</template>

<script>
import { Select, Option, Tree } from "fusion-ui";
export default {
  components: {
    FuSelect: Select,
    FuOption: Option,
    FuTree: Tree,
  },
  props: {
    //请求回来第一次读取的数据
    readValue: {
      type: String,
      default: "",
    },
    //请求回来 未经处理的数据
    normalData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    //请求回来处理过的数据
    fuData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    defaultExpand: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 显示复选框情况下，是否严格遵循父子不互相关联
    checkStrictly: {
      type: Boolean,
      default() {
        return false;
      },
    },
    // 单选是否只选中叶子节点
    onlyCheckleaf: {
      type: Boolean,
      default() {
        return true;
      },
    },

    placeholder: {
      type: String,
      default: "请选择",
    },
    isMultiple: {
      type: Boolean,
      default: false,
    },
    modelChangeArray: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      selectTreeValue: "",
      selectTreeLabel: "",
      filterText: "",
      defaultDeptAll: [],
    };
  },
  created() {},
  watch: {
    // readValue() {
    //   this.Echo();
    // },
    // normalData() {
    //   this.Echo();
    // },
    readValue: {
      immediate: true,
      handler: function (newVal) {
        this.Echo();
      },
    },
    normalData: {
      immediate: true,
      handler: function (newVal) {
        this.Echo();
      },
    },
    filterText(val) {
      this.$refs["SelectTreeComponent"].$refs.el.filter(val);
    },
    defaultExpand(val) {
      console.log("defaultExpand", val);
    },
    selectTreeValue: {
      immediate: true,
      handler: function (val) {
        this.defaultDeptAll = val.split(",");
      },
    },
  },
  methods: {
    //回显逻辑 由于请求会存在滞后的问题
    Echo() {
      if (this.normalData.length === 0 || this.readValue === "") return;
      //处理下拉树的回显逻辑
      let readValue = this.readValue.split(",");
      let label = [];
      this.normalData.forEach((ele) => {
        if (this.readValue.split(",").includes(ele.id)) {
          label.push(ele.text);
        }
      });
      this.selectTreeLabel = label.join(",");
      this.$nextTick(() => {
        // this.$refs["SelectTreeComponent"].$refs.el.setCheckedKeys(readValue);
        this.$refs["SelectTreeComponent"].$refs.el.setCurrentKey(readValue[0]);
      });
    },
    // 单选，节点被点击时的回调,返回被点击的节点数据
    handleNodeClick(data, node) {
      if (!this.isMultiple) {
        if (data.children && this.onlyCheckleaf && data.children.length !== 0) {
          return;
        }
        // this.selectTreeLabel = node.label;
        // this.selectTreeValue = node.key;
        this.selectTreeLabel = data.text;
        this.selectTreeValue = data.id;
        this.change();
        this.$refs["search-select"].blur();
      }
    },
    change() {
      if (this.modelChangeArray.length === 0) {
        this.$emit("selectTreeChange", {
          value: this.selectTreeValue,
          label: this.selectTreeLabel,
        });
      } else {
        this.$emit(
          "selectTreeChange",
          { value: this.selectTreeValue, label: this.selectTreeLabel },
          this.modelChangeArray
        );
      }
    },
    /**清空下拉树内的值 */
    clearSelect() {
      //清空树的选中节点
      this.selectTreeValue = "";
      this.selectTreeLabel = "";
      this.filterText = "";
      this.$refs["SelectTreeComponent"].$refs.el.setCheckedNodes([]);
      this.change();
    },
    setLabelValue() {
      //单选时，因为这个方法在重新点击其他复选框时会触发两次，所以只能通过获取ckeys的方式清空
      let ckeys = this.$refs["SelectTreeComponent"].$refs.el.getCheckedNodes();
      let texts = [],
        values = [];
      ckeys.forEach((item) => {
        texts.push(item.text);
        values.push(item.value);
      });
      this.selectTreeValue = values.join(",");
      this.selectTreeLabel = texts.join(",");
    },
    handleCheckChange() {
      if (this.isMultiple) {
        this.setLabelValue();
        // if (!this.isMultiple) {
        //   //单选的逻辑
        //   if (checked == true) {
        //     //选择其他选项  控制单选
        //     this.$refs["SelectTreeComponent"].$refs.el.setCheckedNodes([data]);
        //   }
        // }
        this.change();
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.text.indexOf(value) !== -1;
    },
  },
};
</script>

<style lang="less" scoped>
.select-tree {
  //改变下拉树的样式
  /deep/.el-select-dropdown {
    width: 255px;
    .el-select-dropdown__item {
      max-height: 281px;
      padding: 0;
      overflow-y: auto;
      height: 100%;
      width: 250px;
    }
    .el-scrollbar {
      overflow-y: auto;
      overflow-x: hidden;
      width: 293px;
      .el-scrollbar__wrap {
        overflow: hidden;
      }
      .el-select-dropdown__list {
        margin: 0 0 0 3px;
        .el-input {
          width: 77%;
          height: 28px;
        }
      }
    }

    .el-scrollbar__bar.is-vertical {
      display: none;
    }
    .el-select-dropdown__wrap {
      max-height: 314px;
      margin-bottom: 0 !important; //覆盖行内样式
    }
  }
}
</style>
