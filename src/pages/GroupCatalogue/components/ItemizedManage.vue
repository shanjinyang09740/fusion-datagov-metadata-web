<template>
  <div class="main">
    <div class="header">
      <div>
        <fu-button
          size="medium"
          class="right"
          type="primary"
          @click="deleteItemize('ids')"
          >删除</fu-button
        >
        <fu-button
          size="medium"
          class="right"
          type="primary"
          @click="manageAttr"
          >管理分项属性</fu-button
        >
      </div>
      <div>
        <advanced-query
          :columns="queryColumns"
          :hideAdvancedQuery="true"
          @search="tableSearch"
        ></advanced-query>
      </div>
    </div>
    <component-group-table
      ref="itemizeTable"
      :tableData="tableData"
      :tableType="'itemize'"
      @addItem="addItem"
    ></component-group-table>
    <fu-dialog
      title="分项属性管理"
      width="80%"
      top="1vh"
      :visible.sync="attrDialogVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      @close="closeAttrDialog"
    >
      <fu-button class="attrSubmit" type="primary" @click="submitAttr"
        >保存</fu-button
      >
      <attr-table
        v-if="attrDialogVisible"
        :statGroupId="groupId"
        ref="attrDialog"
      ></attr-table>
    </fu-dialog>
  </div>
</template>
<script>
import { Button, Dialog, Message } from "fusion-ui";
import AdvancedQuery from "@/components/AdvancedQuery";
import ComponentGroupTable from "./ComponentGroupTable";
import attrTable from "./attributeManageTable.vue";
import {
  getCreateItemizeFrom,
  deleteItemize,
  saveItemize,
  getItemizeDetail,
  getItemizeTable,
  getCodeId,
  saveAttribute,
} from "@/service/modules/labelManage.js";
export default {
  components: {
    FuButton: Button,
    FuDialog: Dialog,
    AdvancedQuery,
    ComponentGroupTable,
    attrTable,
  },
  props: {
    groupId: {
      type: String,
      default: "",
    },
    groupCode: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      // 初始化分项id的集合
      ids: [],
      // 分项id
      ItemizeId: "",
      // 查询表单
      queryForm: {
        groupNameCode: "",
        statGroupType: "",
      },
      queryColumns: [
        {
          label: "分项名称/编码：",
          modelData: "groupNameCode",
          type: "input",
          labelWidth: "150px",
          defaultValue: "",
          isSearchShow: true,
        },
      ],

      tableData: {
        column: [
          {
            label: "分项名称",
            prop: "zbName",
            width: "100px",
          },
          {
            label: "层级",
            prop: "code",
            width: "100px",
          },
          {
            label: "顺序号",
            prop: "code",
            width: "100px",
          },
          {
            label: "分项编码",
            prop: "code",
            width: "100px",
          },
          {
            label: "别名",
            prop: "",
            width: "100px",
          },
          {
            label: "计量单位量纲",
            prop: "",
            width: "100px",
          },
          {
            label: "计量单位",
            prop: "",
            width: "100px",
          },
          {
            label: "类型",
            prop: "",
            width: "100px",
          },
          {
            label: "说明",
            prop: "",
            width: "100px",
          },
        ],
        page: 1,
        pagerows: 0,
        rows: [],
        totalrows: 0,
      },
      createFormItems: [],
      isShowDialog: false,
      title: "",
      selectionId: [],
      // 属性管理
      attrDialogVisible: false,
    };
  },
  created() {
    this.getTableInfo();
  },
  methods: {
    getTableInfo() {
      getItemizeTable(this.groupId).then((res) => {
        let result = res.data[0].data;
        if (result) {
          this.$set(this.tableData, "rows", result.tableData);
          this.ids = result.tableData.map((i) => {
            return i.statItemId;
          });
          let data = result.tableHead;
          let column = [];
          for (const key in data) {
            column.push({
              label: data[key],
              prop: key,
            });
          }
          this.$set(this.tableData, "column", column);
        }
      });
    },
    /**
     * @description 添加
     * @param {Object} row
     */
    addItem(row) {
      getCodeId()
        .then((res) => {
          let result = res.data[0].data;
          if (result) {
            this.tableData.rows.push({
              code: result.code,
              id: result.id,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /**
     * @description 新建分项
     */
    create() {
      this.title = "新建分项";
      getCreateItemizeFrom().then((res) => {
        let data = res.data[0].data;
        if (data) {
          this.createFormItems = data;
          this.isShowDialog = true;
        }
      });
    },
    /**
     * @description 保存新建分项
     */
    submit(form) {
      saveItemize(form)
        .then((res) => {
          this.$refs["itemizeDialog"].closeDialog();
          Message.success("保存成功");
          this.isShowDialog = false;
        })
        .catch((err) => {
          Message.error(`保存失败，${err.errorMessage}`);
        });
    },
    /**
     * @description 编辑
     */
    editItemize(row) {
      this.title = "编辑分项";
      this.getItemizeDetail(row.id);
    },
    /**
     * @description 查看
     */
    lookItemize(row) {
      this.title = "查看分项";
      this.getItemizeDetail(row.id);
    },
    /**
     * @description 获取分项信息
     */
    getItemizeDetail(id) {
      getItemizeDetail(id).then((res) => {
        let data = res.data[0].data;
        if (data) {
          this.createFormItems = data;
          this.isShowDialog = true;
        }
      });
    },
    /**
     * @description 删除
     */
    deleteItemize(type, row) {
      let params = "";
      if (type === "ids") {
        params = this.selectionId.join(",");
      } else {
        params = row.id;
      }
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteItemize(params)
            .then((res) => {
              if (res.data[0].data) {
                Message.success("删除成功!");
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
    handleSelectionChange(selection) {
      this.selectionId = selection.map((item) => {
        return item.id;
      });
    },
    /**
     * @description 表单查询
     */
    tableSearch(form) {
      this.queryForm = JSON.parse(JSON.stringify(form));
    },
    /**
     * @description 管理分项属性
     */
    manageAttr() {
      this.attrDialogVisible = true;
    },
    addAttr() {
      this.$refs.attrDialog.add();
    },
    submitAttr() {
      console.log(this.groupId, "属性列表");
      let params = {
        statGroupId: this.groupId,
        statGroupCode: this.groupCode,
        tableData: this.$refs.attrDialog.tableData.rows,
      };
      saveAttribute(params)
        .then((res) => {
          let result = res.data[0].data;
          if (result) {
            this.$set(this.tableData, "rows", result.tableData);
            let data = result.tableHead;
            let column = [];
            for (const key in data) {
              column.push({
                label: data[key],
                prop: key,
              });
            }
            this.$set(this.tableData, "column", column);
            console.log(this.tableData);
            Message.success("保存成功!");
            this.attrDialogVisible = false;
          }
        })
        .catch((err) => {
          Message.error(`保存失败!，${err.errorMessage}`);
        });
    },
    closeAttrDialog() {
      this.attrDialogVisible = false;
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
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
}
.attrSubmit {
  margin: 0 10px 10px;
}
</style>
