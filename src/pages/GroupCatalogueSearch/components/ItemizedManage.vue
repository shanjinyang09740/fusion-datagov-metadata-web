<template>
  <div class="main">
    <div class="header">
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
    ></component-group-table>
  </div>
</template>
<script>
import { Message } from "fusion-ui";
import AdvancedQuery from "@/components/AdvancedQuery";
import ComponentGroupTable from "./ComponentGroupTable";
import {
  getItemizeDetail,
  getItemizeTable,
  saveAttribute,
} from "@/service/modules/labelManage.js";
export default {
  components: {
    AdvancedQuery,
    ComponentGroupTable,
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
  justify-content: flex-end;
}
</style>
