<template>
  <div class="content">
    <div class="treeHead">
      <fu-button type="primary" size="mini" @click="createTheme"
          >新建主题</fu-button
        >
      <fu-button type="primary" size="mini" @click="createFolder"
          >新建分类</fu-button
        >
    </div>
    <div class="operate">
      <fu-input
        placeholder="请输入内容"
        v-model="filterText"
        class="input-with-select"
      >
        <fu-button slot="append" icon="el-icon-search"></fu-button>
      </fu-input>
    </div>
    <component-tree
      class="treecontainerMain"
      :treeData="treeData"
      :searchText="filterText"
      @node-click="handleNodeClick"
      :defaultProps="defaultProps"
      :expandNodes="expandNodes"
      :treeId="treeId"
      :rightClickList="rightClickList"
      @editTree="editTree"
      @deleteTree="deleteTree"
      ref="treeChild"
    ></component-tree>
    <custom-dialog
      v-if="isShowDialog"
      :isShowDialog="isShowDialog"
      :isShowOperation="dialogType != 'editTree'"
      :title="dialogTitle"
      :width="'50%'"
      @on-result-change="changeIsShowDialog"
    >
      <div slot="body">
        <edit-tree
          v-if="dialogType == 'editTree'"
          ref="editTreeForm"
          :selectedProjectItem="selectedProjectItem"
          :postFormData="postFormData"
          @close="closeDialog"
        ></edit-tree>
        <add-theme v-if="dialogType == 'addTheme'"></add-theme>
        <add-folder v-if="dialogType == 'addFolder'"></add-folder>
      </div>
    </custom-dialog>
  </div>
</template>

<script>
import { Input, Button, Message } from "fusion-ui";
import ComponentTree from "@/components/CommonTree/index.vue";
import http from "@/utils/http";
import { FlatToNested } from "@/utils/tool";
import CustomDialog from "@/components/CommonDialog";
import EditTree from "./EditTree";
import AddTheme from "../AddTheme";
import AddFolder from "../AddFolder";
export default {
  name: "variableTree",
  components: {
    FuInput: Input,
    FuButton: Button,
    ComponentTree,
    CustomDialog,
    EditTree,
    AddTheme,
    AddFolder,
  },
  props: {
    selectProjectValue: {
      type: String,
      required: true,
    },
    selectedProjectItem: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      treeId: "variableTree",
      treeListData: [],
      treeData: [],
      expandNodes: [],
      filterText: "",
      isShowDialog: false,
      dialogTitle: "编辑",
      dialogType: "",
      postFormData: {
        statIndctFolderLabel: "",
        statIndctFolderCode: "",
      },
      rightClickList: [
        {
          id: 2,
          label: "编辑",
          callBack: "editTree",
        },
        {
          id: 3,
          label: "删除",
          callBack: "deleteTree",
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
        id: "id",
      },
    };
  },
  computed: {},
  watch: {
    selectProjectValue: {
      handler(newValue, oldValue) {
        if (newValue) {
          this.initData();
        }
      },
      immediate: true,
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
     * @description 新建主题
     * @param {} 
     * @returns {} 
    */
    createTheme() {
      this.isShowDialog = true;
      this.dialogType = "addTheme";
    },
    /**
     * @description 新建分类
     * @param {} 
     * @returns {} 
    */
    createFolder() {
      this.isShowDialog = true;
      this.dialogType = "addFolder";
    },
    /**
     * @description 编辑树节点
     * @param {Object} node
     */
    editTree(node) {
      this.dialogType = "editTree";
      this.isShowDialog = true;
      this.postFormData = {
        ...node,
      };
    },
    /**
     * @description 删除树节点
     * @param {Object} node
     */
    deleteTree(node) {
      let postData = { data: [{ vtype: "attr", name: "ids", data: node.id }] };
      http
        .post("/api/meta/v1/indctFolder/removeIndctFolder.do", {
          postData: JSON.stringify(postData),
        })
        .then((res) => {
          Message.success("删除成功");
          this.initData();
        })
        .catch(() => {
          Message.error("删除失败");
        });
    },
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
    /**
     * @description 切换弹窗显示状态
     * @param {Boolean} val
     */
    changeIsShowDialog(val) {
      this.isShowDialog = val;
    },
    /**
     * @description 关闭弹窗
     * @param {String} val confirm/cancel
     */
    closeDialog(val) {
      this.isShowDialog = false;
      if (val && val == "confirm") {
        //更新树节点
        this.initData();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  height: 100%;
}
.treeHead {
  padding: 10px 0 4px 10px;
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
