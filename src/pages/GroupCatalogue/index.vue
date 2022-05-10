<template>
  <div class="main">
    <div class="header">
      <!-- <template v-if="partitionOptions.length > 1">
        分区:
        <fu-select
          class="partition-select"
          v-model="partition"
          size="medium"
          clearable
          filterable
        >
          <fu-option
            v-for="item in partitionOptions"
            :value="item.value"
            :key="item.value"
            :label="item.text"
          ></fu-option>
        </fu-select>
      </template> -->
      <fu-button type="primary" size="medium" @click="createTheme"
        >新建主题</fu-button
      >
      <fu-button type="primary" size="medium" @click="createFolder"
        >新建分类</fu-button
      >
      <fu-button type="primary" size="medium" @click="createGroup"
        >新建分组</fu-button
      >
      <fu-button
        size="medium"
        type="primary"
        class="left-mg10"
        @click="deleteGroup('ids')"
        >删除</fu-button
      >
      <fu-button size="medium" class="right" type="text" @click="exportGroup"
        >导出分组</fu-button
      >
      <fu-button size="medium" class="right" type="text" @click="importGroup"
        >导入分组</fu-button
      >
    </div>
    <div class="content">
      <component-tree
        :isNeedFilter="true"
        ref="groupCatalogueTree"
        class="groupCatalogueTree"
        treeId="groupCatalogueTree"
        :treeData="treeData"
        :defaultProps="defaultProps"
        :expandNodes="expandNodes"
        :rightClickList="rightClickList"
        :default-expand-all="true"
        @editTree="editTree"
        @deleteTree="deleteTree"
        @node-click="nodeClick"
      ></component-tree>
      <div class="mainTable">
        <div class="table-header">
          <fu-form :inline="true" ref="searchForm" :fu-data="searchForm">
            <fu-form-item label="名称/编码：" prop="label" label-width="120px">
              <fu-input
                v-model="searchForm.label"
                placeholder="请输入"
                size="medium"
                clearable
              ></fu-input>
            </fu-form-item>
            <fu-form-item>
              <fu-button type="primary" size="medium" @click="tableSearch"
                >查询</fu-button
              >
            </fu-form-item>
          </fu-form>
        </div>
        <component-table
          ref="groupTable"
          row-key="statGroupId"
          :tableId="'groupTable'"
          :reqUrl="reqTableUrl"
          :reqParams="reqTableParams"
          :fuColumn="fuColumn"
          :isHasSelection="true"
          :operationWidth="'300px'"
        >
          <template slot-scope="row" slot="one">
            <div class="operateBtns">
              <i
                class="iconfont iconbiaoge_chakanshuju"
                title="查看"
                @click.stop="lookGroup(row.data)"
              ></i>
              <i
                class="iconfont iconbiaoge_bianji"
                title="编辑"
                @click.stop="editGroup(row.data)"
              ></i>
              <i
                class="iconfont iconbiaoge_shujuduizhao"
                title="管理分项"
                @click.stop="itemizedManage(row.data)"
              ></i>
              <i
                class="iconfont iconbiaoge_xieyuanguanxi"
                title="查看血缘"
                @click.stop="viewBloodItem(row.data)"
              ></i>
              <i
                class="iconfont iconbiaoge_shanchu"
                title="删除"
                @click.stop="deleteGroup('id', row.data)"
              ></i>
              <img
                title="上移"
                :src="require('@/assets/images/move-up.svg')"
                @click.stop="moveUpItem(row.data, row.index)"
              />
              <img
                title="下移"
                :src="require('@/assets/images/move-down.svg')"
                @click.stop="moveDownItem(row.data, row.index)"
              />
            </div>
          </template>
        </component-table>
      </div>
    </div>
    <fu-dialog
      title="新建主题"
      width="500px"
      :visible.sync="themeDialogVisible"
      :close-on-click-modal="false"
      @close="closeThemeDialog"
    >
      <fu-form
        :rules="themeRules"
        ref="themeForm"
        label-width="100px"
        :fu-data="themeForm"
      >
        <fu-form-item label="主题名称：" prop="themeName">
          <fu-input
            v-model="themeForm.themeName"
            placeholder="请输入"
          ></fu-input>
        </fu-form-item>
        <fu-form-item label="主题代码：" prop="themeCode">
          <fu-input
            v-model="themeForm.themeCode"
            placeholder="请输入"
          ></fu-input>
        </fu-form-item>
      </fu-form>
      <span slot="footer">
        <fu-button type="primary" @click="submitTheme">确定</fu-button>
        <fu-button @click="closeThemeDialog">取消</fu-button>
      </span>
    </fu-dialog>
    <fu-dialog
      :title="folderTitle"
      width="500px"
      :visible.sync="folderDialogVisible"
      :close-on-click-modal="false"
      @close="closeFolderDialog"
    >
      <fu-form
        :rules="folderRules"
        ref="folderForm"
        label-width="140px"
        :fu-data="folderForm"
      >
        <fu-form-item
          v-if="folderTitle === '新建分类'"
          label="上级主题或分类："
          prop="selectTreeValue"
          required
        >
          <common-select-tree
            ref="CommonSelectTree"
            :checkStrictly="true"
            :onlyCheckleaf="false"
            :fuData="selectTreeData"
          ></common-select-tree>
        </fu-form-item>
        <fu-form-item label="分类名称：" prop="folderName">
          <fu-input
            v-model="folderForm.folderName"
            placeholder="请输入"
            size="medium"
          ></fu-input>
        </fu-form-item>
        <fu-form-item label="分类代码：" prop="folderCode">
          <fu-input
            v-model="folderForm.folderCode"
            placeholder="请输入"
            size="medium"
          ></fu-input>
        </fu-form-item>
      </fu-form>
      <span slot="footer">
        <fu-button type="primary" @click="submitFolder">确定</fu-button>
        <fu-button @click="closeFolderDialog">取消</fu-button>
      </span>
    </fu-dialog>
    <fu-dialog
      v-if="isShowDialog"
      :title="title"
      top="1vh"
      width="80%"
      :visible.sync="isShowDialog"
      :close-on-click-modal="false"
      @close="closeGroupDialog"
    >
      <group-tabs
        ref="groupDialog"
        :type="type"
        :disabled="groupDisabled"
        :groupId="groupId"
        :group="group"
      ></group-tabs>
      <span slot="footer">
        <fu-button
          v-if="title.indexOf('查看') === -1"
          type="primary"
          @click="submit"
          >确定</fu-button
        >
        <fu-button @click="closeGroupDialog">取消</fu-button>
      </span>
    </fu-dialog>
    <fu-dialog
      title="管理分项"
      top="1vh"
      width="90%"
      :visible.sync="isShowItemizedManage"
      :close-on-click-modal="false"
      :append-to-body="true"
      @close="closeItemizedManage"
    >
      <itemized-manage
        ref="itemizedManage"
        :groupId="groupId"
        :groupCode="group.statGroupCode"
      ></itemized-manage>
      <span slot="footer">
        <fu-button type="primary" @click="submitItemizedManage">确定</fu-button>
        <fu-button @click="closeItemizedManage">取消</fu-button>
      </span>
    </fu-dialog>
    <fu-dialog
      title="导入分组"
      top="5vh"
      width="400px"
      :visible.sync="isShowUpload"
      :close-on-click-modal="false"
      :append-to-body="true"
      @close="closeUpload"
    >
      <el-upload
        class="upload-demo"
        drag
        action="/api/meta/v1/codelist/import.do"
        :data="uploadData"
        multiple
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
      <span slot="footer">
        <fu-button type="primary" @click="submitUpload">确定</fu-button>
        <fu-button @click="closeUpload">取消</fu-button>
      </span>
    </fu-dialog>
  </div>
</template>
<script>
import {
  Button,
  Input,
  Form,
  FormItem,
  Dialog,
  Radio,
  Message,
} from "fusion-ui";
import CommonSelectTree from "@/components/CommonSelectTree";
import ComponentTree from "@/components/CommonTree";
import ComponentTable from "@/components/CommonTable";
import GroupTabs from "@/components/CreateGroupFrom";
import ItemizedManage from "./components/ItemizedManage.vue";
import { getUrl } from "@/utils/tool.js";
import {
  getPartitionSelect,
  saveFolder,
  saveGroup,
  deleteFolder,
  deleteGroup,
  getGroupTree,
  getFolderInfo,
  moveUpDownItem,
  saveItemize,
} from "@/service/modules/labelManage.js";
export default {
  name: "",
  components: {
    FuButton: Button,
    FuInput: Input,
    FuForm: Form,
    FuFormItem: FormItem,
    FuDialog: Dialog,
    FuRadio: Radio,
    CommonSelectTree,
    ComponentTree,
    ComponentTable,
    GroupTabs,
    ItemizedManage,
  },
  data() {
    const validatePass = (rule, value, callback) => {
      var ePattern = /^[a-zA-Z0-9]*$/;
      if (value === "") {
        callback(new Error("请输入分类代码"));
      } else {
        if (!ePattern.test(value)) {
          callback(new Error("只能输入字母和数字"));
        }
        callback();
      }
    };
    return {
      saveDragReq: {
        url: "/api/meta/v1/baseCodeList/dragFolderTree.do",
        params: [],
      },
      // 区分微观与宏观页面
      pageType: "",
      // 区分分组与目录
      type: "",
      // 分区
      partition: "",
      partitionOptions: [],
      // 搜索字段
      searchText: "",
      defaultProps: {
        children: "children",
        label: "statGroupFolderLabel",
        id: "statGroupFolderId",
      },
      treeData: [],
      expandNodes: [],
      rightClickList: [
        {
          id: 3,
          label: "编辑",
          callBack: "editTree",
        },
        {
          id: 4,
          label: "删除",
          callBack: "deleteTree",
        },
      ],
      // 当前节点id
      nodeId: "",
      folder: "",
      // 当前节点类型
      nodeType: "",
      // 查询表单
      queryForm: {
        label: "",
        groupType: "",
        isUsed: "",
      },
      searchForm: {
        label: "",
        groupType: "",
        isUsed: "",
      },

      // 分组表格列
      fuColumn: [
        {
          prop: "statGroupNameCh",
          label: "名称",
          width: "50px",
          align: "center",
        },
        {
          prop: "statGroupCode",
          label: "编码",
          width: "50px",
          align: "center",
        },
        {
          prop: "statGroupAlias",
          label: "别称",
          width: "50px",
          align: "center",
        },
        {
          prop: "groupType",
          label: "类型",
          width: "50px",
          align: "center",
        },
        {
          prop: "statGroupVersion",
          label: "版本",
          width: "50px",
          align: "center",
        },
        {
          prop: "creatorId",
          label: "汇总类型",
          width: "50px",
          align: "center",
        },
        {
          prop: "isUsed",
          label: "状态",
          width: "50px",
          align: "center",
        },
      ],
      // 新建主题弹框
      themeDialogVisible: false,
      themeForm: {
        themeName: "",
        themeCode: "",
      },
      themeRules: {
        themeName: [
          { required: true, message: "请填写主题名称", trigger: "blur" },
        ],
        themeCode: [
          { required: true, message: "请填写主题代码", trigger: "blur" },
        ],
      },
      // 新建分组
      title: "",
      isShowDialog: false,
      groupDisabled: false,
      groupId: "",
      group: {},
      // 新建分类
      folderTitle: "",
      folderDialogVisible: false,
      folderForm: {
        state: "",
        folderName: "",
        folderCode: "",
      },
      folderRules: {
        folderName: [
          { required: true, message: "请填写分类名称", trigger: "blur" },
        ],
        folderCode: [
          { required: true, validator: validatePass, trigger: "blur" },
        ],
        state: [{ required: true, message: "请选择层级", trigger: "change" }],
      },
      selectTreeData: [],
      // 管理分项
      isShowItemizedManage: false,
      // 导入分组
      isShowUpload: false,
    };
  },
  computed: {
    uploadData() {
      return { fileId: this.nodeId };
    },
    // 表格
    reqTableUrl() {
      if (!this.nodeId) {
        return "";
      }
      return `/api/meta/v1/group/list.do`;
    },
    reqTableParams() {
      if (this.nodeId) {
        return [
          {
            name: "group",
            vtype: "json",
            data: {
              folderType: this.type === "group" ? "0" : "1", //目录还是分组 0
              partitionCode: this.partition, //当前的分区code 1
              nodeId: this.nodeId, //当前的结点id
              groupTag: this.queryForm.label, //动态查询条件名称或者编码
              groupStatus: this.queryForm.isUsed, //动态查询条件分组的状态
              groupType: this.queryForm.groupType, //动态查询条件分组的类型
            },
          },
        ];
      } else {
        return [];
      }
    },
  },
  created() {
    this.type = getUrl("type");
    this.getPartitionSelect();
  },
  methods: {
    /**
     * @description 上移
     */
    moveUpItem(data, index) {
      let tableData = this.$refs["groupTable"].$children[0].data.rows;
      let params = {
        upId: data.statGroupId,
        upNum: tableData[index - 1].sortNum,
        downId: tableData[index - 1].statGroupId,
        downNum: data.sortNum,
      };
      moveUpDownItem(params).then((res) => {
        this.$refs["groupTable"].$children[0].queryData();
      });
    },
    /**
     * @description 下移
     */
    moveDownItem(data, index) {
      let tableData = this.$refs["groupTable"].$children[0].data.rows;
      let params = {
        upId: data.statGroupId,
        upNum: tableData[index + 1].sortNum,
        downId: tableData[index + 1].statGroupId,
        downNum: data.sortNum,
      };
      moveUpDownItem(params).then((res) => {
        this.$refs["groupTable"].$children[0].queryData();
      });
    },
    /**
     * @description 分区
     */
    getPartitionSelect() {
      getPartitionSelect()
        .then((res) => {
          this.partitionOptions = res.data[0].data;
          this.partition = this.partitionOptions[0].value;
          this.getGroupTree();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /**
     * @description 分组树
     */
    getGroupTree() {
      getGroupTree(this.partition, this.type)
        .then((res) => {
          let data = res.data[0].data;
          this.treeData = this.transformTozTreeFormat(data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /**
     * @description 将普通的数组转换为父子结构
     */
    transformTozTreeFormat(sNodes) {
      let i, l;
      let r = [];
      let tmpMap = {};
      for (i = 0, l = sNodes.length; i < l; i++) {
        tmpMap[sNodes[i].id] = sNodes[i];
      }
      for (i = 0, l = sNodes.length; i < l; i++) {
        let p = tmpMap[sNodes[i].pId];
        if (p && sNodes[i].id != sNodes[i].pId) {
          let children = this.nodeChildren(p);
          if (!children) {
            children = this.nodeChildren(p, []);
          }
          children.push(sNodes[i]);
        } else {
          r.push(sNodes[i]);
        }
      }
      return r;
    },
    nodeChildren(node, newChildren) {
      if (typeof newChildren !== "undefined") {
        node.children = newChildren;
      }
      return node.children;
    },
    nodeClick(data) {
      this.nodeId = data.statGroupFolderId;
      this.nodeType = data.statGroupFolderType;
      this.folder = data;
    },
    // 编辑节点
    editTree(data) {
      console.log(data);
      this.folderTitle = "编辑分类";
      getFolderInfo({
        partCode: this.partition,
        folderId: data.statGroupFolderId,
      }).then((res) => {
        let data = res.data[0].data;
        if (data.statGroupFolderType === "0") {
          this.themeDialogVisible = true;
          this.$set(this.themeForm, "id", data.statGroupFolderId);
          this.themeForm.themeName = data.statGroupFolderLabel;
          this.themeForm.themeCode = data.statGroupFolderCode;
        } else {
          this.folderDialogVisible = true;
          this.$set(this.folderForm, "id", data.statGroupFolderId);
          this.folderForm.folderName = data.statGroupFolderLabel;
          this.folderForm.folderCode = data.statGroupFolderCode;
        }
      });
    },
    // 删除节点
    deleteTree(data) {
      this.$confirm("此操作将删除该文件及其子文件夹, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteFolder(data.statGroupFolderId)
            .then((res) => {
              if (res.data[0].data) {
                Message.success("删除成功!");
                this.getGroupTree();
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
     * @description 新建主题
     */
    createTheme() {
      this.themeDialogVisible = true;
    },
    /**
     * @description 新建分类
     */
    createFolder() {
      this.folderTitle = "新建分类";
      this.folderDialogVisible = true;
      if (this.folder) {
        this.$refs["CommonSelectTree"].$refs[
          "SelectTreeComponent"
        ].setCheckedNodes(this.folder);
      }
    },
    /**
     * @description 新建分组
     */
    createGroup() {
      if (!this.folder) {
        Message.warning("请选择分类");
        return;
      }
      this.groupId = "";
      this.isShowDialog = true;
    },
    /**
     * @description 关闭新建主题弹框
     */
    closeThemeDialog() {
      this.themeDialogVisible = false;
      this.$refs["themeForm"].$refs.el.resetFields();
    },
    /**
     * @description 保存新建主题
     */
    submitTheme() {
      this.$refs["themeForm"].$refs.el.validate(async (valid) => {
        if (valid) {
          let params = {
            level: 1,
            partitionCode: this.folder.partitionCode,
            partitionName: this.folder.partitionName,
            statGroupFolderId: this.themeForm.id || "",
            statGroupFolderLabel: this.themeForm.themeName,
            statGroupFolderCode: this.themeForm.themeCode,
            statGroupFolderPid: "0",
            statGroupFolderType: "0",
          };
          let url = "/api/meta/v1/baseCodeList/addFolder.do";
          if (this.themeForm.id) {
            url = "/api/meta/v1/baseCodeList/editFolder.do";
          }
          saveFolder(url, params)
            .then((res) => {
              this.closeThemeDialog();
              Message.success("保存成功");
              this.getGroupTree();
            })
            .catch((err) => {
              Message.error(`保存失败，${err.errorMessage}`);
            });
        }
      });
    },

    /**
     * @description 保存新建分组
     */
    submit() {
      let data = {};
      let baseForm = this.$refs["groupDialog"].baseForm;
      Object.assign(data, baseForm);
      if (this.type === "catalog") {
        this.$set(data, "statGroupType", "1"); // 目录
      }
      this.$set(data, "statGroupFolderId", this.nodeId);
      this.$set(data, "partitionCode", this.folder.partitionCode);
      this.$set(data, "partitionName", this.folder.partitionName);
      this.$delete(data, "statGroupUpdateDate");
      this.$delete(data, "statGroupCreatDate");
      let url = "/api/meta/v1/baseCodeList/addGroup.do";
      if (baseForm.statGroupId) {
        url = "/api/meta/v1/baseCodeList/editGroup.do";
      }
      saveGroup(url, this.type, data)
        .then((res) => {
          Message.success("保存成功");
          this.$refs["groupTable"].$children[0].queryData();
          this.closeGroupDialog();
        })
        .catch((err) => {
          Message.error(`保存失败，${err.errorMessage}`);
        });
    },
    /**
     * @description 关闭新建分组弹框
     */
    closeGroupDialog() {
      this.isShowDialog = false;
      this.$refs["groupDialog"].activeName = "first";
      this.$refs["groupDialog"].$refs["baseForm"].$refs.el.resetFields();
      this.$refs["groupDialog"].$refs["manageForm"].$refs.el.resetFields();
    },

    /**
     * @description 关闭新建分类弹框
     */
    closeFolderDialog() {
      this.folderDialogVisible = false;
      this.$refs["folderForm"].$refs.el.resetFields();
    },
    /**
     * @description 保存新建分类
     */
    submitFolder() {
      this.$refs["folderForm"].$refs.el.validate(async (valid) => {
        if (valid) {
          let selectTreeValue =
            this.$refs["CommonSelectTree"].$refs[
              "SelectTreeComponent"
            ].getCheckedNodes().statGroupFolderId;
          let params = {};
          let level = this.folder.level;
          if (this.folderForm.state === "0") {
            level = this.folder.level + 1;
          }
          params = {
            level: level,
            partitionCode: this.folder.partitionCode,
            partitionName: this.folder.partitionName,
            statGroupFolderId: this.folderForm.id || "",
            statGroupFolderLabel: this.folderForm.folderName,
            statGroupFolderCode: this.folderForm.folderCode,
            statGroupFolderPid: selectTreeValue,
            statGroupFolderType: "1",
          };
          let url = "/api/meta/v1/baseCodeList/addFolder.do";
          if (this.folderForm.id) {
            url = "/api/meta/v1/baseCodeList/editFolder.do";
          }
          saveFolder(url, params)
            .then((res) => {
              this.closeFolderDialog();
              this.getGroupTree();
              Message.success("保存成功");
            })
            .catch((err) => {
              Message.error(`保存失败，${err.errorMessage}`);
            });
        }
      });
    },
    /**
     * @description 删除
     */
    deleteGroup(type, row) {
      let params = "";
      if (type === "ids") {
        params = this.selectionId.join(",");
      } else {
        params = row.statGroupId;
      }
      this.$confirm("此操作将永久删除该分组, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteGroup(params)
            .then((res) => {
              if (res.data[0].data) {
                Message.success("删除成功!");
                this.$refs["groupTable"].$children[0].queryData();
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
     * @description 查看
     */
    lookGroup(row) {
      this.title = "查看分组详情";
      this.isShowDialog = true;
      this.groupDisabled = true;
      this.group = row;
    },
    /**
     * @description 编辑
     */
    editGroup(row) {
      this.title = "编辑分组详情";
      this.isShowDialog = true;
      this.group = row;
    },
    /**
     * @description 表单查询
     */
    tableSearch() {
      this.queryForm = JSON.parse(JSON.stringify(this.searchForm));
      let tableData = this.$refs["groupTable"].$children[0].data.rows;
      tableData.forEach((item) => {
        if (
          item.statGroupNameCh.indexOf(this.searchForm.label) !== -1 ||
          item.statGroupCode.indexOf(this.searchForm.label) !== -1
        ) {
          this.$set(item, "highLight", true);
        } else {
          this.$set(item, "highLight", false);
        }
      });
      this.$refs["groupTable"].$children[0].data.rows = tableData;
    },
    /**
     * @description 重置查询表单
     */
    resetForm() {},
    /**
     * @description 管理分项
     */
    itemizedManage(row) {
      this.groupId = row.statGroupId;
      this.group = row;
      this.isShowItemizedManage = true;
    },
    closeItemizedManage() {
      this.isShowItemizedManage = false;
    },
    submitItemizedManage() {
      console.log(this.$refs["itemizedManage"], 'this.$refs["itemizedManage"]');
      let params = {
        tableData: this.$refs["itemizedManage"].$refs["itemizeTable"].tableData,
        ids: this.$refs["itemizedManage"].ids,
      };
      saveItemize(params)
        .then((res) => {
          Message.success("保存成功");
          this.closeItemizedManage();
        })
        .catch((err) => {
          Message.error(`保存失败，${err.errorMessage}`);
        });
    },
    /**
     * @description 导入分组
     */
    importGroup() {
      this.isShowUpload = true;
    },
    closeUpload() {
      this.isShowUpload = false;
    },
    submitUpload() {},
    /**
     * @description 导出分组
     */
    exportGroup() {
      window.open(
        `/api/meta/v1/codelist/export.do?partitionCode=${this.partition}&folderId=${this.nodeId}`
      );
    },
  },
};
</script>
<style lang="less" scoped>
.main {
  padding: 0 10px;
}
.header {
  height: 40px;
  margin: 10px 0;
  border-bottom: 1px solid #ccc;
  box-sizing: border-box;
  .partition-select {
    margin-right: 50px;
  }
}
.right {
  float: right;
  margin-right: 10px;
}
.left-mg10 {
  margin-left: 10px;
}
.content {
  display: flex;
  .groupCatalogueTree {
    width: 350px;
    padding: 0 5px;
  }
  .mainTable {
    flex: 1;
    .table-header {
      display: flex;
      justify-content: flex-end;
    }
  }
}
.operateBtns {
  display: flex;
  i {
    cursor: pointer;
  }
  img {
    cursor: pointer;
    margin-right: 10px;
  }
}
</style>
