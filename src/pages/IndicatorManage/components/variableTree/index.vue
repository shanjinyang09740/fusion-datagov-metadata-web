<template>
  <div class="content">
    <div class="treeHead">
      <fu-button type="primary" size="medium" @click="createTheme"
        >新建主题</fu-button
      >
      <fu-button type="primary" size="medium" @click="createFolder"
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
      :title="dialogTitle"
      :width="'50%'"
      @on-result-change="changeIsShowDialog"
      @child-operation="operation"
    >
      <div slot="body">
        <component
          :postFormData="postFormData"
          ref="dialogForm"
          :is="dialogComp"
        ></component>
        <!-- <edit-tree
          v-if="dialogComp == 'editTree'"
          ref="editTreeForm"
          :postFormData="postFormData"
        ></edit-tree>
        <add-theme v-if="dialogComp == 'addTheme'"></add-theme>
        <add-folder v-if="dialogComp == 'addFolder'"></add-folder> -->
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
  props: {},
  data() {
    return {
      treeId: "variableTree",
      treeListData: [],
      treeData: [],
      expandNodes: [],
      filterText: "",
      isShowDialog: false,
      dialogTitle: "编辑",
      dialogComp: "",
      postFormData: {},
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
  watch: {},
  beforeCreate() {},
  created() {
    this.initTreeData();
  },
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    /**
     * @description 弹窗操作按钮事件
     * @param {String} val ---- confirm/cancel 确认/取消
     * @param {Object} data 表单数据
     */
    operation(val) {
      if (val == "confirm") {
        //确认处理逻辑---data 表单数据   type 弹窗组件类型
        this.$refs.dialogForm.submit((data, type) => {
          console.log("获取到弹窗表单数据了", data);
          if (type == "EditTree") {
            console.log("编辑......", data);
            this.editTreeDialogCallback(data);
          } else if (type == "AddTheme") {
            this.createThemeDialogCallback(data);
          } else if (type == "AddFolder") {
            this.createFolderDialogCallback(data);
          }
        });
      } else {
        //取消处理逻辑
        this.isShowDialog = false;
      }
    },
    /**
     * @description 新建主题回调
     * @param {}
     * @returns {}
     */
    createThemeDialogCallback(data) {
      let postData = {
        data: [
          {
            data: {
              statIndctThemeCode: data.statIndctThemeCode,
              statIndctThemeName: data.statIndctThemeName,
              statIndctThemeSortNum: data.statIndctThemeSortNum,
            },
            name: "indctTheme",
            vtype: "formpanel",
          },
        ],
      };
      http
        .post("/api/meta/v1/indct/folder/saveIndctTheme.do", {
          postData: JSON.stringify(postData),
        })
        .then((res) => {
          if (res.data[0].data) {
            Message.success("新增成功");
            this.isShowDialog = false;
            this.initTreeData();
          }
        })
        .catch((err) => {
          Message.error(`新增失败!，${err.errorMessage}`);
        });
    },
    /**
     * @description 新建文件夹回调
     * @param {}
     * @returns {}
     */
    createFolderDialogCallback(data) {
      let postData = {
        data: [
          {
            data: {
              ...data,
            },
            name: "indctType",
            vtype: "formpanel",
          },
        ],
      };
      http
        .post("/api/meta/v1/indct/folder/saveIndctType.do", {
          postData: JSON.stringify(postData),
        })
        .then((res) => {
          this.isShowDialog = false;
          Message.success(res.data[0].data);
          this.initTreeData();
        })
        .catch((err) => {
          Message.error(`新增失败!，${err.errorMessage}`);
        });
    },
    /**
     * @description 编辑树节点回调
     * @param {Object} data
     */
    editTreeDialogCallback(data) {
      let { statIndctFolderType } = data;
      let postData = {},
        url = "";
      if (statIndctFolderType == 1) {
        //文件夹
        url = "/api/meta/v1/indct/folder/saveIndctType.do";
        postData = {
          data: [
            {
              data: {
                statIndctThemeId: data.statIndctThemeId,
                statIndctTypeCode: data.statIndctFolderCode,
                statIndctTypeId: data.statIndctFolderId,
                statIndctTypeName: data.statIndctFolderName,
                statIndctTypePid: data.statIndctFolderPid,
                statIndctTypeSortNum: data.sortNum,
              },
              name: "indctType",
              vtype: "formpanel",
            },
          ],
        };
      } else {
        //主题
        url = "/api/meta/v1/indct/folder/saveIndctTheme.do";
        postData = {
          data: [
            {
              data: {
                statIndctThemeCode: data.statIndctFolderCode,
                statIndctThemeId: data.statIndctFolderId,
                statIndctThemeName: data.statIndctFolderName,
                statIndctThemeSortNum: data.sortNum,
              },
              name: "indctTheme",
              vtype: "formpanel",
            },
          ],
        };
      }
      http
        .post(url, { postData: JSON.stringify(postData) })
        .then((res) => {
          Message.success(res.data[0].data);
          this.isShowDialog = false;
          this.initTreeData();
        })
        .catch((err) => {
          Message.error(`修改失败!，${err.errorMessage}`);
        });
    },
    /**
     * @description 新建主题
     * @param {}
     * @returns {}
     */
    createTheme() {
      this.isShowDialog = true;
      this.dialogTitle = "新建主题";
      this.dialogComp = "AddTheme";
    },
    /**
     * @description 新建分类
     * @param {}
     * @returns {}
     */
    createFolder() {
      this.isShowDialog = true;
      this.dialogTitle = "新建分类";
      this.dialogComp = "AddFolder";
    },
    /**
     * @description 编辑树节点
     * @param {Object} node
     */
    editTree(node) {
      this.dialogComp = "EditTree";
      this.dialogTitle = "编辑";
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
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let postData = {
            data: [
              {
                name: "folderType",
                vtype: "attr",
                data: node.statIndctFolderType,
              },
              {
                name: "id",
                vtype: "attr",
                data: node.statIndctFolderId,
              },
            ],
          };

          http
            .post("/api/meta/v1/indct/folder/removeIndctFolder.do", {
              postData: JSON.stringify(postData),
            })
            .then((res) => {
              if (res.data[0].data) {
                Message.success("删除成功!");
                this.initTreeData();
              }
            })
            .catch((err) => {
              Message.error(`删除失败!，${err.errorMessage}`);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    /**
     * @description 初始化数据
     */
    initTreeData() {
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
        this.treeListData = result;
        this.treeData = FlatToNested(result);
        if (this.treeData.length) {
          this.$nextTick(() => {
            // 默认高亮选中节点
            if (this.treeData[0].children && this.treeData[0].children.length) {
              let highLightNode = this.treeData[0].children[0];
              this.expandNodes.push(this.treeData[0].id);
              this.$refs.treeChild.setCurrentKeyHeightLight(highLightNode.id);
              this.handleNodeClick(highLightNode);
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
