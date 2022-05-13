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
      <div class="header-left">
        <fu-button type="primary" size="medium" @click="createTheme"
          >新建主题</fu-button
        >
        <fu-button type="primary" size="medium" @click="createFolder"
          >新建分类</fu-button
        >
      </div>
      <fu-button type="primary" size="medium" @click="createGroup"
        >新建{{ typeCh }}</fu-button
      >
      <fu-button size="medium" type="primary" class="left-mg10" @click="move"
        >移动</fu-button
      >
      <fu-button
        size="medium"
        type="primary"
        class="left-mg10"
        @click="deleteGroup('ids')"
        >删除</fu-button
      >
      <fu-button size="medium" class="right" type="text" @click="exportGroup"
        >导出{{ typeCh }}</fu-button
      >
      <fu-button size="medium" class="right" type="text" @click="importGroup"
        >导入{{ typeCh }}</fu-button
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
          :operationWidth="'320px'"
          @deliverySelection="deliverySelection"
        >
          <template slot-scope="row" slot="one">
            <div class="operateBtns">
              <fu-button
                type="text"
                icon="iconfont iconbiaoge_bianji"
                @click.stop="editGroup(row.data)"
                >编辑</fu-button
              >
              <fu-button
                type="text"
                icon="iconfont iconbiaoge_shujuduizhao"
                @click.stop="itemizedManage(row.data)"
                >管理分项</fu-button
              >
              <fu-button
                type="text"
                icon="iconfont iconbiaoge_shanchu"
                @click.stop="deleteGroup('id', row.data)"
                >删除</fu-button
              >
              <el-dropdown>
                <span class="el-dropdown-link">
                  更多<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    ><fu-button
                      @click.stop="copyGroup(row.data, 'no', '复制')"
                      type="text"
                      icon="iconfont iconqita_yingshe"
                      >复制</fu-button
                    ></el-dropdown-item
                  >
                  <el-dropdown-item
                    ><fu-button
                      @click.stop="copyGroup(row.data, 'yes', '创建')"
                      type="text"
                      icon="iconfont iconqita_zidingyi"
                      >创建新版本</fu-button
                    ></el-dropdown-item
                  >
                  <el-dropdown-item
                    ><fu-button
                      @click.stop="viewBloodItem(row.data)"
                      type="text"
                      icon="iconfont iconbiaoge_xieyuanguanxi"
                      >查看血缘</fu-button
                    ></el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </template>
        </component-table>
      </div>
    </div>
    <fu-dialog
      :title="themeTitle"
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
            size="medium"
          ></fu-input>
        </fu-form-item>
        <fu-form-item label="主题代码：" prop="themeCode">
          <fu-input
            v-model="themeForm.themeCode"
            placeholder="请输入"
            size="medium"
            :disabled="themeTitle === '编辑主题'"
          ></fu-input>
        </fu-form-item>
        <fu-form-item label="顺序：" prop="sortNum">
          <fu-input-number
            v-model="themeForm.sortNum"
            controls-position="right"
            :min="0"
            size="medium"
          ></fu-input-number>
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
        <fu-form-item label="上级主题或分类：" prop="selectTreeValue">
          <common-select-tree
            v-model="folderForm.selectTreeValue"
            :treeData="treeData"
            :defaultProps="defaultProps"
            :checkedNode="folder"
            @getThemeId="getThemeId"
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
            :disabled="folderTitle === '编辑分类'"
          ></fu-input>
        </fu-form-item>
        <fu-form-item label="顺序：" prop="sortNum">
          <fu-input-number
            v-model="folderForm.sortNum"
            controls-position="right"
            :min="0"
            size="medium"
          ></fu-input-number>
        </fu-form-item>
      </fu-form>
      <span slot="footer">
        <fu-button type="primary" @click="submitFolder">确定</fu-button>
        <fu-button @click="closeFolderDialog">取消</fu-button>
      </span>
    </fu-dialog>
    <fu-dialog
      title="分组移动"
      width="500px"
      :visible.sync="moveDialogVisible"
      :close-on-click-modal="false"
      @close="closeMoveDialog"
    >
      <fu-form ref="moveForm" label-width="140px" :fu-data="moveForm">
        <fu-form-item label="当前文件夹：" prop="folderName">
          {{ folder.label }}
        </fu-form-item>
        <fu-form-item label="目标文件夹：" prop="selectTreeValue">
          <common-select-tree
            ref="ComSelectTree"
            :treeData="moveTreeData"
            v-model="moveForm.selectTreeValue"
            :defaultProps="defaultProps"
            :checkedNode="folder"
          ></common-select-tree>
        </fu-form-item>
      </fu-form>
      <span slot="footer">
        <fu-button type="primary" @click="submitMove">确定</fu-button>
        <fu-button @click="closeMoveDialog">取消</fu-button>
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
      v-if="isShowItemizedManage"
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
    </fu-dialog>
    <fu-dialog
      :title="`导入${typeCh}`"
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
        action="/api/meta/v1/attach/upload.do"
        :data="uploadData"
        :on-success="onSuccess"
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
  Message,
  InputNumber,
} from "fusion-ui";
import CommonSelectTree from "./components/selectTree.vue";
import ComponentTree from "@/components/CommonTree";
import ComponentTable from "@/components/CommonTable";
import GroupTabs from "@/components/CreateGroupFrom";
import ItemizedManage from "./components/ItemizedManage.vue";
import { getUrl } from "@/utils/tool.js";
import {
  getPartitionSelect,
  saveFolder,
  saveGroup,
  copyGroup,
  deleteFolder,
  deleteTheme,
  deleteGroup,
  getGroupTree,
  saveItemize,
  saveTheme,
  move,
} from "@/service/modules/labelManage.js";
import { postJSON } from "@/utils/post";
export default {
  name: "",
  components: {
    FuButton: Button,
    FuInput: Input,
    FuForm: Form,
    FuFormItem: FormItem,
    FuDialog: Dialog,
    FuInputNumber: InputNumber,
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
      // 上传的文件id
      upLoadId: "",
      // 区分微观与宏观页面
      pageType: "",
      // 区分分组与目录
      type: "",
      typeCh: "分组",
      // 分区
      partition: "",
      partitionOptions: [],
      // 搜索字段
      searchText: "",
      defaultProps: {
        children: "children",
        label: "label",
        id: "id",
      },
      treeData: [],
      moveTreeData: [],
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
      folder: {},
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
          prop: "statGroupType",
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
          prop: "statGroupStatus",
          label: "状态",
          width: "50px",
          align: "center",
        },
      ],
      // 新建主题弹框
      themeDialogVisible: false,
      themeForm: {
        sortNum: "",
        themeName: "",
        themeCode: "",
      },
      themeTitle: "",
      themeRules: {
        themeName: [
          { required: true, message: "请填写主题名称", trigger: "blur" },
        ],
        themeCode: [
          { required: true, message: "请填写主题代码", trigger: "blur" },
        ],
        sortNum: [{ required: true, message: "请填写顺序", trigger: "blur" }],
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
        sortNum: "",
        folderName: "",
        folderCode: "",
        selectTreeValue: "",
      },
      folderRules: {
        selectTreeValue: [
          {
            required: true,
            message: "请选择上级分类或主题",
            trigger: "change",
          },
        ],
        folderName: [
          { required: true, message: "请填写分类名称", trigger: "blur" },
        ],
        folderCode: [
          { required: true, validator: validatePass, trigger: "blur" },
        ],
        sortNum: [{ required: true, message: "请填写顺序", trigger: "blur" }],
      },
      // 管理分项
      isShowItemizedManage: false,
      // 导入分组
      isShowUpload: false,
      // 移动弹框显示控制
      moveDialogVisible: false,
      moveForm: {
        folderName: "",
        selectTreeValue: "",
      },
      themeId: "",
      // 分组树list数据，方便遍历
      GroupTreedata: "",
      // 分组表格选中行的id集合
      selectionId: [],
    };
  },
  computed: {
    uploadData() {
      return {};
    },
    // 表格
    reqTableUrl() {
      if (!this.nodeId) {
        return "";
      }
      return `/api/meta/v1/groups/group/list.do`;
    },
    reqTableParams() {
      if (this.nodeId) {
        return [
          {
            name: "id",
            vtype: "attr",
            data: this.nodeId,
          },
          {
            name: "nameCode",
            vtype: "attr",
            data: this.queryForm.label,
          },
          {
            name: "hasChildren",
            vtype: "attr",
            data: "no",
          },
          {
            name: "statGroupType",
            vtype: "attr",
            data: this.type === "group" ? "1,3" : "2",
          },
        ];
      } else {
        return [];
      }
    },
  },
  watch: {
    type: {
      handler(val) {
        if (val === "group") {
          this.typeCh = "分组";
        } else if (val === "catalog") {
          this.typeCh = "目录";
        }
      },
    },
    // GroupTreedata: {
    //   handler(val) {},
    //   immediate: true,
    // },
  },
  created() {
    this.type = getUrl("type");
    this.getGroupTree();
  },
  mounted() {},
  methods: {
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
      getGroupTree()
        .then((res) => {
          this.GroupTreedata = res.data[0].data;
          let tree = JSON.parse(JSON.stringify(this.GroupTreedata));
          let moveTree = JSON.parse(JSON.stringify(this.GroupTreedata));
          this.treeData = this.transformTozTreeFormat(tree);
          moveTree.forEach((item) => {
            if (item.id === item.statGroupThemeId) {
              this.$set(item, "disabled", true);
            }
          });
          this.moveTreeData = this.transformTozTreeFormat(moveTree);
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
      this.nodeId = data.id;
      this.nodeType = data.statGroupFolderType;
      this.folder = data;
    },
    // 编辑节点
    editTree(data) {
      this.folder = data;
      if (data.id === data.statGroupThemeId) {
        this.themeTitle = "编辑主题";
        this.themeDialogVisible = true;
        this.$set(this.themeForm, "id", data.id);
        this.themeForm.themeName = data.label;
        this.themeForm.themeCode = data.statGroupThemeCode;
        this.themeForm.sortNum = data.statGroupThemeSortNum;
      } else {
        this.folderTitle = "编辑分类";
        this.folderDialogVisible = true;
        this.$set(this.folderForm, "id", data.id);
        this.folderForm.folderName = data.label;
        this.folderForm.folderCode = data.statGroupTypeCode;
        this.folderForm.sortNum = data.statGroupTypeSortNum;
        this.folderForm.selectTreeValue = data.pId;
      }
    },
    // 删除节点
    deleteTree(data) {
      this.$confirm("此操作将删除该文件及其子文件夹, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (data.id === data.statGroupThemeId) {
            deleteTheme(data.id)
              .then((res) => {
                if (res.data[0].data) {
                  Message.success("删除成功!");
                  this.getGroupTree();
                }
              })
              .catch((err) => {
                Message.error(`删除失败!，${err.errorMessage}`);
              });
          } else {
            deleteFolder(data.id)
              .then((res) => {
                if (res.data[0].data) {
                  Message.success("删除成功!");
                  this.getGroupTree();
                }
              })
              .catch((err) => {
                Message.error(`删除失败!，${err.errorMessage}`);
              });
          }
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
      this.themeTitle = "新建主题";
      this.themeDialogVisible = true;
    },
    /**
     * @description 新建分类
     */
    createFolder() {
      this.folderTitle = "新建分类";
      this.folderDialogVisible = true;
      if (this.folder) {
        this.folderForm.selectTreeValue = this.folder.id;
      }
    },
    /**
     * @description 新建分组
     */
    createGroup() {
      if (!this.folder || this.folder.id === this.folder.statGroupThemeId) {
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
     * @description 保存新建编辑主题
     */
    submitTheme() {
      this.$refs["themeForm"].$refs.el.validate(async (valid) => {
        if (valid) {
          let url = "/api/meta/v1/groups/theme/create.do";
          if (this.themeForm.id) {
            url = "/api/meta/v1/groups/theme/update.do";
          }
          let params = {
            statGroupThemeId: this.themeForm.id || "",
            statGroupThemeName: this.themeForm.themeName,
            statGroupThemeCode: this.themeForm.themeCode,
            statGroupThemeSortNum: this.themeForm.sortNum,
          };
          saveTheme(url, params)
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
      let statGroupType = "";
      let baseForm = this.$refs["groupDialog"].baseForm;
      Object.assign(data, baseForm);
      if (this.type === "catalog") {
        statGroupType = "2"; // 目录
      } else {
        statGroupType = data.stat_group_type;
      }
      this.$set(data, "stat_group_type_id", this.nodeId);
      let url = "/api/meta/v1/groups/group/create.do";
      if (baseForm.stat_group_id) {
        url = "/api/meta/v1/groups/group/update.do";
      }
      saveGroup(url, statGroupType, data)
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
     * @description 保存新建编辑分类
     */
    submitFolder() {
      this.$refs["folderForm"].$refs.el.validate(async (valid) => {
        if (valid) {
          let params = {
            statGroupTypeId: this.folderForm.id || "",
            statGroupTypeName: this.folderForm.folderName,
            statGroupTypeCode: this.folderForm.folderCode,
            statGroupTypeSortNum: this.folderForm.sortNum,
            statGroupTypePid: this.folderForm.selectTreeValue,
            statGroupThemeId: this.themeId,
          };
          let url = "/api/meta/v1/groups/type/create.do";
          if (this.folderForm.id) {
            url = "/api/meta/v1/groups/type/update.do";
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
    // 获取主题id
    getThemeId(val) {
      this.themeId = val;
    },
    /**
     * @description 删除
     */
    deleteGroup(type, row) {
      let params = "";
      if (type === "ids") {
        if (this.selectionId.length === 0) {
          Message.warning("请选择要删除的分组");
          return;
        }
        params = this.selectionId.join(",");
      } else {
        params = row.statGroupId;
      }
      this.$confirm(`此操作将永久删除该${this.typeCh}, 是否继续?`, "提示", {
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
     * @description 复制
     */
    copyGroup(row, uplevel, msg) {
      copyGroup(row.statGroupId, uplevel)
        .then((res) => {
          Message.success(msg + "成功");
          this.$refs["groupTable"].$children[0].queryData();
        })
        .catch((err) => {
          Message.error(msg + "失败");
        });
    },
    /**
     * @description 编辑
     */
    editGroup(row) {
      this.title = `编辑${this.typeCh}详情`;
      this.group = row;
      postJSON("/api/meta/v1/groups/group/select.do", {
        postData: JSON.stringify({
          data: [
            {
              name: "statGroupId",
              vtype: "attr",
              data: row.statGroupId,
            },
          ],
        }),
      }).then((res) => {
        this.group = res.data[0].data;
        this.isShowDialog = true;
      });
    },
    /**
     * @description 表单查询
     */
    tableSearch() {
      this.queryForm = JSON.parse(JSON.stringify(this.searchForm));
    },
    /**
     * @description 重置查询表单
     */
    resetForm() {
      let tableData = this.$refs["groupTable"].$children[0].data.rows;
      tableData.forEach((item) => {
        this.$set(item, "highLight", false);
      });
    },
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
    /**
     * @description 分组移动
     */
    move() {
      if (this.selectionId.length === 0) {
        Message.warning("请选择要移动的分组");
        return;
      }
      this.moveDialogVisible = true;
    },
    closeMoveDialog() {
      this.moveDialogVisible = false;
      this.$refs["moveForm"].$refs.el.resetFields();
    },
    submitMove() {
      let params = {
        folderId: this.moveForm.selectTreeValue,
        ids: this.selectionId.join(","),
      };
      move(params)
        .then((res) => {
          if (res.data[0].data) {
            this.closeMoveDialog();
            Message.success(res.data[0].data.msg);
            this.$refs["groupTable"].$children[0].queryData();
          }
        })
        .catch((err) => {
          Message.error(`移动失败，${err.errorMessage}`);
        });
    },
    /**
     * @description 表格选择触发事件
     */
    deliverySelection(val) {
      console.log(val, "selection");
      this.selectionId = val.map((i) => {
        return i.statGroupId;
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
    submitUpload() {
      postJSON("/api/meta/v1/groups/import.do?fileId=" + this.upLoadId)
        .then((res) => {
          Message.success(res.data[0].data);
          this.closeUpload();
          this.$refs["groupTable"].$children[0].queryData();
          this.getGroupTree();
        })
        .catch((err) => {
          Message.error(`导入失败，${err.errorMessage}`);
        });
    },
    // 分组上传成功回调
    onSuccess(res) {
      this.upLoadId = res.id;
    },
    /**
     * @description 导出分组
     */
    exportGroup() {
      let isGroup = this.type === "group" ? true : false;
      let folderIdType =
        this.folder.id === this.folder.statGroupThemeId ? "theme" : "type";
      window.open(
        `/api/meta/v1/groups/export.do?isGroup=${isGroup}&folderId=${this.nodeId}&folderIdType=${folderIdType}`
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
  .header-left {
    display: inline-block;
    width: 360px;
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
.operateBtns {
  .el-button--text {
    padding: 0;
    margin: 0 5px;

    /deep/ .iconfont {
      margin-right: 2px;
    }
    span {
      height: 21px;
      line-height: 21px;
    }
  }
  /deep/ .el-dropdown {
    height: 19px;
    margin-left: 5px;
    color: #409eff;
  }
  /deep/.el-dropdown-menu {
    /deep/.el-button {
      width: 100%;
      text-align: left;
    }
  }
}
</style>
