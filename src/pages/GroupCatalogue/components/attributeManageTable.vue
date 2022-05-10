<template>
  <div class="main">
    <fu-table
      ref="attrTable"
      :fu-data="tableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      default-expand-all
      node
    >
      <fu-table-column
        label="是否启用"
        prop="useScope"
        min-width="60px"
        align="center"
      >
        <template slot-scope="scope">
          <fu-checkbox
            v-model="scope.row.useScope"
            true-label="0"
            false-label=""
            @change="useChange(scope.row)"
          >
          </fu-checkbox>
        </template>
      </fu-table-column>
      <fu-table-column type="index" width="55" label="序号" align="center">
      </fu-table-column>
      <fu-table-column
        v-for="(item, index) in tableData.column"
        :key="index"
        :label="item.label"
        :prop="item.prop"
        :min-width="item.width"
        align="center"
      >
        <template slot-scope="scope">
          <fu-select
            v-if="item.isSelect && scope.row.flag && scope.row.flag === '1'"
            clearable
            v-model="scope.row[item.prop]"
            size="mini"
            @change="valueChange(scope.row)"
          >
            <fu-option
              v-for="i in item.option"
              :key="i.value"
              :value="i.value"
              :label="i.text"
            ></fu-option>
          </fu-select>
          <div v-else-if="item.prop === 'attrType' && !scope.row.flag">
            {{ transformType(scope.row[item.prop]) }}
          </div>
          <fu-input
            v-else-if="item.isInput && scope.row.flag && scope.row.flag === '1'"
            v-model="scope.row[item.prop]"
            size="mini"
            @change="valueChange(scope.row)"
          ></fu-input>
          <div v-else>
            {{ scope.row[item.prop] }}
          </div>
        </template>
      </fu-table-column>
      <fu-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <div class="operateBtns">
            <img
              title="上移"
              :src="require('@/assets/images/move-up.svg')"
              @click.stop="upMove(scope.row, scope.$index)"
            />
            <img
              title="下移"
              :src="require('@/assets/images/move-down.svg')"
              @click.stop="downMove(scope.row, scope.$index)"
            />
            <i
              v-if="scope.row.flag === '1'"
              class="iconfont iconbiaoge_shanchu"
              title="删除"
              @click.stop="deleteZb(scope.$index)"
            ></i>
          </div>
        </template>
      </fu-table-column>
    </fu-table>
  </div>
</template>
<script>
import {
  Select,
  Option,
  Button,
  Input,
  TableColumn,
  Table,
  Checkbox,
  Message,
} from "fusion-ui";
import {
  getItemizeDetail,
  getAttributeTable,
} from "@/service/modules/labelManage.js";
export default {
  components: {
    FuSelect: Select,
    FuOption: Option,
    FuButton: Button,
    FuInput: Input,
    FuTableColumn: TableColumn,
    FuTable: Table,
    FuCheckbox: Checkbox,
  },
  props: {
    // 分组id
    statGroupId: {
      type: String,
      default: "",
    },
    // 分组编码
    statGroupCode: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      tableData: {
        column: [
          // {
          //   label: "代码",
          //   prop: "attrCode",
          //   width: "100px",
          // },
          {
            label: "中文名",
            prop: "attrName",
            width: "100px",
            isInput: true,
          },
          {
            label: "简称",
            prop: "attrAlias",
            width: "100px",
            isInput: true,
          },
          {
            label: "英文名",
            prop: "attrCode",
            width: "100px",
            isInput: true,
          },
          {
            label: "说明",
            prop: "attrExplain",
            width: "100px",
            isInput: true,
          },
          {
            label: "数据类型",
            prop: "attrType",
            width: "100px",
            isSelect: true,
            option: [
              {
                text: "基础属性",
                value: "1",
              },
              {
                text: "数据属性",
                value: "2",
              },
              {
                text: "管理属性",
                value: "3",
              },
              {
                text: "技术属性",
                value: "4",
              },
            ],
          },
          {
            label: "最大长度",
            prop: "attrLength",
            width: "100px",
            isInput: true,
          },
        ],
        page: 1,
        pagerows: 0,
        rows: [],
        totalrows: 0,
      },
      createFormItems: [],
      rowId: "",
      selectionId: [],
    };
  },
  created() {
    this.getTableData(this.queryId);
  },
  methods: {
    transformType(val) {
      switch (val) {
        case "1":
          return "基础属性";
        case "2":
          return "数据属性";
        case "3":
          return "管理属性";
        case "4":
          return "技术属性";
        default:
          return val;
      }
    },
    /**
     * @description 是否启用修改
     */
    useChange(row) {
      // if (row.useScope) {
      //   this.selectionId.push(row.id);
      // } else {
      //   for (let i = 0; i < this.selectionId.length; i++) {
      //     if (this.selectionId[i] === row.id) {
      //       this.selectionId.splice(i, 1);
      //     }
      //   }
      // }
    },
    rowClick(row, column, event) {
      // 当前点击行的id
    },
    /**
     * @description 表格修改
     */
    valueChange(row) {
      if (!row.isChange) {
        this.$set(row, "isChange", true);
      }
    },
    /**
     * @description 获取表格信息
     */
    getTableData() {
      getAttributeTable(this.statGroupId).then((res) => {
        if (res.data[0].data) {
          this.tableData.rows = res.data[0].data.rows;
        }
      });
    },
    /**
     * @description 添加属性
     */
    add() {
      let length = this.tableData.rows.length;
      let sortNum = 1;
      if (this.tableData.rows[length - 1].sortNum) {
        sortNum = this.tableData.rows[length - 1].sortNum + 1;
      }
      this.tableData.rows.push({
        flag: "1",
        sortNum: sortNum,
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
        }
      });
    },
    /**
     * @description 上移
     */
    upMove(row, index) {
      let data = this.tableData.rows[index - 1];
      let sort1 = row.sortNum;
      let sort2 = data.sortNum;
      this.$set(row, "sortNum", sort2);
      this.$set(data, "sortNum", sort1);
      this.tableData.rows.splice(index - 1, 1);
      this.tableData.rows.splice(index, 0, data);
    },
    /**
     * @description 下移
     */
    downMove(row, index) {
      let data = this.tableData.rows[index + 1];
      let sort1 = row.sortNum;
      let sort2 = data.sortNum;
      this.$set(row, "sortNum", sort2);
      this.$set(data, "sortNum", sort1);
      this.tableData.rows.splice(index, 1);
      this.tableData.rows.splice(index + 1, 0, row);
    },
    /**
     * @description 删除
     */
    deleteZb(index) {
      this.$confirm("确定删除该属性?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.tableData.rows.splice(index, 1);
          Message.success("删除成功!");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
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
  justify-content: space-between;
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
