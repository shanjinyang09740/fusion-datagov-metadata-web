<template>
  <div class="main">
    <div class="header">
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
    <component-group-table
      ref="itemizeTable"
      :postTableData="postTableData"
      :isShowOperate="false"
      :isShowCheckBox="false"
      :tableCompType="tableCompType"
      :rowKey="rowKey"
    ></component-group-table>
  </div>
</template>
<script>
import { Button, Input, Form, FormItem } from "fusion-ui";
import ComponentGroupTable from "@/components/ComponentGroupTable";
import {
  getItemizeTable,
  queryItemizeDetail,
} from "@/service/modules/labelManage.js";
export default {
  components: {
    FuButton: Button,
    FuInput: Input,
    FuForm: Form,
    FuFormItem: FormItem,
    ComponentGroupTable,
  },
  props: {
    queryId: {
      type: String,
      default: "",
    },
    queryType: {
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
      queryForm: {},
      /**分项表格相关数据 begin********************/
      //表格行key
      rowKey: "statGroupItemId",
      //表格组件类别
      tableCompType: "itemize",
      //表格数据
      postTableData: {
        column: [],
        rows: [],
      },
      /**分项表格相关数据 begin********************/
      createFormItems: [],
      title: "",
      selectionId: [],
      // 属性管理
      attrDialogVisible: false,
    };
  },
  created() {
    if (this.queryType === "分项") {
      this.queryItemizeDetail();
    } else {
      this.getTableInfo();
    }
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
     * @description 查询分项详情
     */
    queryItemizeDetail() {
      queryItemizeDetail(this.queryId).then((res) => {
        let result = res.data[0].data;
        if (result) {
          this.$set(this.postTableData, "rows", result.tableData);
          this.ids = result.tableData.map((i) => {
            return i.statGroupItemId;
          });
          let data = result.tableHead;
          let column = [];
          for (const key in data) {
            column.push({
              label: data[key],
              prop: key,
              isInput: false,
              isIndent: key === "StatGroupItemName" ? true : false,
            });
          }
          this.$set(this.postTableData, "column", column);
        }
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
    getTableInfo() {
      getItemizeTable(this.queryId).then((res) => {
        let result = res.data[0].data;
        if (result) {
          this.$set(this.postTableData, "rows", result.tableData);
          this.ids = result.tableData.map((i) => {
            return i.statGroupItemId;
          });
          let data = result.tableHead;
          let column = [];
          for (const key in data) {
            column.push({
              label: data[key],
              prop: key,
              isInput: false,
              isIndent: key === "StatGroupItemName" ? true : false,
            });
          }
          this.$set(this.postTableData, "column", column);
        }
      });
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
  justify-content: flex-end;
}
.attrSubmit {
  margin: 0 10px 10px;
}
</style>
