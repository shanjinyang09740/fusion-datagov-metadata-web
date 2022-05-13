<template>
  <div class="main">
    <div class="header">
      <div>
        <fu-button
          size="medium"
          class="right"
          type="primary"
          @click="manageAttr"
          >管理分项属性</fu-button
        >
        <fu-button
          size="medium"
          class="right"
          type="primary"
          @click="deleteItemize()"
          >删除</fu-button
        >
        <fu-button
          size="medium"
          class="right"
          type="primary"
          @click="saveTableData"
          >保存</fu-button
        >
        <fu-button
          v-if="this.postTableData.rows.length === 0"
          size="medium"
          class="right"
          type="primary"
          @click="addTableData"
          >新增</fu-button
        >
      </div>
      <div>
        <fu-form :inline="true" class="form">
          <fu-form-item label="分项名称/编码">
            <fu-input
              size="medium"
              v-model="queryForm.label"
              placeholder="请输入"
              clearable
            ></fu-input>
          </fu-form-item>
          <fu-form-item>
            <fu-button
              size="medium"
              type="primary"
              clearable
              @click="formTableSearch"
              >查询</fu-button
            >
          </fu-form-item>
        </fu-form>
      </div>
    </div>
    <component-group-table
      ref="itemizeTable"
      :postTableData="postTableData"
      :tableOperateBtnGroup="tableOperateBtnGroup"
      :tableCompType="tableCompType"
      :rowKey="rowKey"
      @addRow="addRow"
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
import { Button, Dialog, Message, Input, Form, FormItem } from "fusion-ui";
import ComponentGroupTable from "@/components/ComponentGroupTable";
import attrTable from "./attributeManageTable.vue";
import {
  getCodeId,
  saveItemize,
  getItemizeTable,
  saveAttribute,
} from "@/service/modules/labelManage.js";
import { postJSON } from "@/utils/post";
export default {
  components: {
    FuButton: Button,
    FuDialog: Dialog,
    FuInput: Input,
    FuForm: Form,
    FuFormItem: FormItem,
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
      // 实结点、虚节点
      statItemType: [],
      // 初始化分项id的集合
      ids: [],
      // 查询表单
      queryForm: {},
      /**分项表格相关数据 begin********************/
      //表格行key
      rowKey: "statGroupItemId",
      //表格组件类别
      tableCompType: "itemize",
      //表格操作列显示按钮类型
      tableOperateBtnGroup: [
        {
          label: "添加",
          value: "addRow",
          icon: "iconqita_tianjia",
          imgPath: "",
        },
        {
          label: "删除",
          value: "deleteRow",
          icon: "iconbiaoge_shanchu",
          imgPath: "",
        },
        {
          label: "复制",
          value: "copyRow",
          icon: "iconqita_yingshe",
          imgPath: "",
        },
        {
          label: "查看血缘",
          value: "viewBloodItem",
          icon: "iconbiaoge_xieyuanguanxi",
          imgPath: "",
        },
      ],
      //表格数据
      postTableData: {
        column: [],
        rows: [],
      },
      selectionId: [],
      // 属性管理
      attrDialogVisible: false,
      tableHead: {},
    };
  },
  created() {
    this.getTableInfo();
    this.getSelectData();
  },
  watch: {
    queryForm: {
      handler(newVal, oldVal) {
        if (!newVal.label) {
          this.formTableSearch();
        }
      },
      deep: true,
    },
  },
  methods: {
    /**
     * @description 分项新增时生成对应的编码和id值
     */
    getCodeId() {
      getCodeId()
        .then((res) => {
          return res.code;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /**
     * @description 表单查询表格
     * @param {}
     * @returns {}
     */
    formTableSearch() {
      this.$refs.itemizeTable.tableBlurredQuery(
        ["statGroupItemName", "statGroupItemCode"],
        this.queryForm.label
      );
    },
    /**
     * @description 保存表格数据
     */
    saveTableData() {
      let params = {
        tableData: this.$refs["itemizeTable"].tableData.rows,
        ids: this.ids,
        statGroupCode: this.groupCode,
        statGroupId: this.groupId,
      };
      saveItemize(params)
        .then((res) => {
          Message.success("保存成功");
          console.log("分项表格保存了");
          //若保存成功，恢复表格初始状态
          this.$refs.itemizeTable.emptyTableEditStatus();
        })
        .catch((err) => {
          console.log(err);
          Message.error("保存失败");
        });
    },
    getTableInfo() {
      getItemizeTable(this.groupId).then((res) => {
        let result = res.data[0].data;
        if (result) {
          this.$set(this.postTableData, "rows", result.tableData);
          this.ids = result.tableData.map((i) => {
            return i.statGroupItemId;
          });
          this.tableHead = result.tableHead;
          let column = [];
          for (const key in this.tableHead) {
            if (key === "statItemType") {
              column.push({
                label: this.tableHead[key],
                prop: key,
                type: "select",
                option: this.statItemType,
              });
            } else {
              column.push({
                label: this.tableHead[key],
                prop: key,
                type: "input",
                isIndent: key === "StatGroupItemName" ? true : false,
              });
            }
          }
          this.$set(this.postTableData, "column", column);
        }
      });
    },
    getSelectData() {
      this.getCodeTableData("MD_ITEM_TYPE")
        .then((res) => {
          if (res.data[0].data) {
            this.statItemType = res.data[0].data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
      // this.getCodeTableData("MD_ITEM_TYPE")
      //   .then((res) => {
      //     if (res.data[0].data) {
      //       this.statItemType = res.data[0].data;
      //     }
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
    },
    // 查询代码表
    getCodeTableData(code) {
      return postJSON(`/api/core/v1/dictionary/queryData.do?dicId=${code}`, {
        postData: JSON.stringify({
          data: [],
        }),
      });
    },
    /**
     * @description 初始化新建分项
     */
    addTableData() {
      let newCode = this.getCodeId();
      let data = {
        statGroupItemCode: newCode,
        statGroupItemSortNum: 1,
      };
      for (const key in this.tableHead) {
        this.$set(data, key, "");
      }
      this.postTableData.rows.push(data);
    },
    /**
     * @description 新建分项
     */
    addRow(row, $index) {
      let newCode = this.getCodeId();
      let data = {
        statGroupItemCode: newCode,
        isClick: true,
      };
      for (const key in this.tableHead) {
        this.$set(data, key, "");
      }
      this.$refs["itemizeTable"].rows.splice($index, 0, data);
      this.$refs["itemizeTable"].rows.forEach((item, index) => {
        item.statGroupItemSortNum = index + 1;
      });
    },
    /**
     * @description 删除
     */
    deleteItemize() {
      this.selectionId = this.$refs["itemizeTable"].selectedTableData.map(
        (item) => {
          return item[this.rowKey];
        }
      );
      if (this.selectionId.length === 0) {
        Message.warning("请选择要删除的分项");
        return;
      }
      this.$confirm("确定删除分项?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$refs["itemizeTable"].batchDeleteRow();
          Message.success("删除成功!");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    /**
     * @description 管理分项属性
     */
    manageAttr() {
      this.attrDialogVisible = true;
    },
    submitAttr() {
      console.log(this.groupId, "属性列表");
      this.$refs.attrDialog.tableData.rows.forEach((item, index) => {
        this.$set(item, "sortNum", index);
      });
      let params = {
        statGroupId: this.groupId,
        statGroupCode: this.groupCode,
        tableData: this.$refs.attrDialog.tableData.rows,
      };
      saveAttribute(params)
        .then((res) => {
          let result = res.data[0].data;
          if (result) {
            this.$set(this.postTableData, "rows", result.tableData);
            this.tableHead = result.tableHead;
            let column = [];
            for (const key in this.tableHead) {
              column.push({
                label: this.tableHead[key],
                prop: key,
              });
            }
            this.$set(this.postTableData, "column", column);
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
