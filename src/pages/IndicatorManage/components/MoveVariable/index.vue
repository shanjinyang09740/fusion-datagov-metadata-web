<template>
  <div>
    <fu-form ref="moveVariableForm" :fu-data="formData" :rules="diaFormRules">
      <fu-form-item
        label="目标文件夹:"
        prop="statIndctFolderName"
        label-width="120px"
      >
        <fu-input disabled v-model="formData.statIndctFolderName"></fu-input>
      </fu-form-item>
      <fu-form-item label="目标文件夹:" prop="folderId" label-width="120px">
        <fu-select
          :popper-append-to-body="false"
          class="select-tree"
          v-model="formData.folderId"
        >
          <fu-input v-model="filterText" size="mini" clearable></fu-input>
          <fu-option
            :value="selectTreeData.selectId"
            :label="selectTreeData.selectLabel"
            class="options"
          >
            <fu-tree
              :fu-data="selectTreeData.treeData"
              ref="selectTree"
              :node-key="defaultProps.id"
              :props="defaultProps"
              :show-checkbox="true"
              :check-strictly="true"
              @check-change="handleCheckChange"
              @node-click="nodeClick"
              :filter-node-method="filterNode"
              :default-expand-all="true"
            >
            </fu-tree>
          </fu-option>
        </fu-select>
      </fu-form-item>
    </fu-form>
  </div>
</template>

<script>
const debounce = function (fn, delay) {
  let timer = null;
  return function () {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay);
  };
};
import {
  Form,
  FormItem,
  Input,
  Select,
  Option,
  Tree,
  Message,
} from "fusion-ui";
import http from "@/utils/http";
import { FlatToNested } from "@/utils/tool";
export default {
  name: "MoveVariable",
  components: {
    FuForm: Form,
    FuFormItem: FormItem,
    FuInput: Input,
    FuSelect: Select,
    FuOption: Option,
    FuTree: Tree,
  },
  props: {
    selectTreeNode: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      diaFormRules: {
        folderId: {
          required: true,
          message: "请选择目标文件夹",
          trigger: "blur",
        },
      },
      filterText: "",
      selectTreeData: {
        selectId: "",
        selectLabel: "",
        treeData: [],
      },
      defaultProps: {
        children: "children",
        label: "label",
        id: "id",
      },
      formData: {},
    };
  },
  computed: {},
  watch: {
    filterText: debounce(function handler(val) {
      this.$refs.selectTree.$refs.el.filter(val);
    }, 1000),
  },
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
     * @description 提交表单数据
     * @params {Function} callback
     */
    submit(callback) {
      this.$refs["moveVariableForm"].$refs.el.validate((valid) => {
        if (valid) {
          callback(
            {
              folderId: this.formData.folderId,
            },
            "MoveVariable"
          );
        } else {
          Message.warning("请检查输入是否符合规则");
        }
      });
    },
    /**
     * @description 初始化数据
     */
    initData() {
      this.formData.statIndctFolderName =
        this.selectTreeNode.statIndctFolderName;
      //渲染下拉框树
      http.post("/api/meta/v1/indct/folder/getFolderTree.do").then((res) => {
        let result = res.data[0].data;
        result = result.map((item) => {
          return {
            ...item,
            id: item.statIndctFolderId,
            pId: item.statIndctFolderPid,
            label: item.statIndctFolderName,
            disabled: item.statIndctFolderType == "0" ? true : false,
          };
        });
        this.selectTreeData.treeData = FlatToNested(result);
      });
    },
    //优化之后的代码 不管有几级都可以适用
    filterNode(value, data, node) {
      if (!value) {
        return true;
      }
      let _array = []; //这里使用数组存储 只是为了存储值。
      this.getReturnNode(node, _array, value);
      let result = false;
      _array.forEach((item) => {
        result = result || item;
      });
      return result;
    },
    getReturnNode(node, _array, value) {
      let isPass =
        node.data && node.data.label && node.data.label.indexOf(value) !== -1;
      isPass ? _array.push(isPass) : "";
      if (!isPass && node.level != 1 && node.pId) {
        this.getReturnNode(node.pId, _array, value);
      }
    },
    handleCheckChange(data, checked) {
      let ckeys = this.$refs.selectTree.$refs.el.getCheckedNodes();
      if (ckeys.length === 0) {
        this.selectTreeData.selectLabel = "";
        this.selectTreeData.selectId = "";
        this.$set(this.formData, "folderId", "");
      }
      if (checked == true) {
        //选择其他选项  控制单选
        this.$set(this.selectTreeData, "selectId", data.id);
        this.$set(this.selectTreeData, "selectLabel", data.label);
        this.$set(this.formData, "folderId", data.id);
        this.$refs.selectTree.$refs.el.setCheckedNodes([data]);
      }
    },
    // 切换选项
    nodeClick(data) {
      this.$set(this, "selectTreeNode", {
        selectId: data.id,
        selectLabel: data.label,
      });
      this.$refs.selectTree.$refs.el.setCheckedNodes([data]);
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
      // overflow: hidden;
      // overflow-y: auto;
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
