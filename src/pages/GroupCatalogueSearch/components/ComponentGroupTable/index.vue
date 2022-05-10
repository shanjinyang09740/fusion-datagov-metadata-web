<template>
  <fu-table
    id="zbTable"
    :fu-data="tableData"
    row-key="statItemId"
    border
    @row-click="rowClick"
    @selection-change="handleSelectionChange"
    @filter-change="filterChange"
  >
    <fu-table-column label="序号" type="index" width="50"> </fu-table-column>
    <fu-table-column
      v-for="(item, index) in tableData.column"
      :key="index"
      :prop="item.prop"
      :label="item.label"
      :minWidth="item.width"
      :column-key="item.prop"
    >
      <template slot-scope="scope">
        <div v-if="item.isInput">
          <fu-input
            v-if="scope.row.statItemId === rowId"
            v-model="scope.row[item.prop]"
            size="mini"
            @change="valueChange(scope.row, item.prop)"
          ></fu-input>
          <div v-else>
            <div v-if="item.prop == 'zbName'">
              <div :class="`zbName${scope.row.level}`">
                {{ scope.row[item.prop] }}
              </div>
            </div>
            <div v-else>
              {{ scope.row[item.prop] }}
            </div>
          </div>
        </div>
        <div v-else>
          {{ scope.row[item.prop] }}
        </div>
      </template>
    </fu-table-column>
  </fu-table>
</template>

<script>
import { Table, TableColumn, Input } from "fusion-ui";
export default {
  name: "mainTable",
  components: {
    FuTable: Table,
    FuTableColumn: TableColumn,
    FuInput: Input,
  },
  props: {
    tableData: {
      type: Object,
      default: () => {},
    },
    tableType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      multipleSelection: [],
      checkedAll: false,
      // 当前点击行的id
      rowId: "",
      //最大层级
      maxLevel: 5,
    };
  },
  computed: {
    params() {
      return [
        {
          name: "queryParam",
          vtype: "formpanel",
          data: {
            projectYear: "",
          },
        },
      ];
    },
  },
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    filterChange(filters) {},
    /**
     * @description 表格行点击事件
     * @param {}
     * @returns {}
     */
    rowClick(row, column, event) {
      console.log(row);
      // 当前点击行的id
      this.rowId = row.statItemId;
    },
    /**
     * @description 表格多选事件
     * @param {}
     * @returns {}
     */
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    /**
     * @description 文本框change事假
     * @param {Object} row
     */
    valueChange(row, prop) {
      let { statItemId, isChange } = row;
      if (!isChange) {
        this.$set(row, "isChange", true);
      }
    },
    /**
     * @description 上移
     * @param {Number} $index 行索引
     */
    moveUpItem(row, $index) {
      let { level } = row;
      if ($index == 0) return;
      let newArr = [],
        delIds = [],
        insertId = "",
        tempTableDataRows = JSON.parse(JSON.stringify(this.tableData.rows));
      tempTableDataRows.some((ite, index) => {
        if (index > $index && ite.level <= level) {
          return true;
        }
        if (index == $index - 1) {
          insertId = ite.statItemId;
        }
        if (index == $index || (index > $index && ite.level > level)) {
          newArr.push(ite);
          delIds.push(ite.statItemId);
        }
      });

      tempTableDataRows = tempTableDataRows.filter(
        (tep, index) => delIds.indexOf(tep.statItemId) == -1
      );
      let insertIndex = tempTableDataRows.findIndex(
        (ele) => ele.statItemId == insertId
      );
      tempTableDataRows.splice(insertIndex, 0, ...newArr);
      tempTableDataRows.forEach((it, index) => {
        it.sort = index + 1;
      });
      this.$set(this.tableData, "rows", tempTableDataRows);
    },
    /**
     * @description 下移
     * @param {Number} $index 行索引
     */
    moveDownItem(row, $index) {
      let { level } = row;
      if ($index == this.tableData.rows.length - 1) return;
      let newArr = [],
        delIds = [],
        insertId = "",
        tempTableDataRows = JSON.parse(JSON.stringify(this.tableData.rows));
      tempTableDataRows.some((ite, index) => {
        if (index > $index && ite.level <= level) {
          insertId = ite.statItemId;
          return true;
        }
        if (index == $index || (index > $index && ite.level > level)) {
          newArr.push(ite);
          delIds.push(ite.statItemId);
        }
      });
      tempTableDataRows = tempTableDataRows.filter(
        (tep, index) => delIds.indexOf(tep.statItemId) == -1
      );
      let insertIndex = tempTableDataRows.findIndex(
        (ele) => ele.statItemId == insertId
      );
      tempTableDataRows.splice(insertIndex + 1, 0, ...newArr);
      tempTableDataRows.forEach((it, index) => {
        it.sort = index + 1;
      });
      this.$set(this.tableData, "rows", tempTableDataRows);
    },
    /**
     * @description 升级 level--
     * @param {Number} $index 行索引
     */
    upLevelItem(row, $index) {
      let { level } = row;
      if (level == 1) {
        return;
      } else {
        this.tableData.rows.some((ite, index) => {
          if (index > $index && ite.level <= level) return true;
          if (index == $index || (index > $index && ite.level > level)) {
            ite.level = ite.level - 1;
          }
        });
        this.$set(this.tableData, "rows", this.tableData.rows);
      }
    },
    /**
     * @description 降级 level++
     * @param {Number} $index 行索引
     */
    downLevelItem(row, $index) {
      let { level } = row;
      if (level == this.maxLevel) return;
      this.tableData.rows.some((ite, index) => {
        if (index > $index && ite.level <= level) return true;
        if (index == $index || (index > $index && ite.level > level)) {
          ite.level = ite.level >= this.maxLevel ? ite.level : ite.level + 1;
        }
      });
      this.$set(this.tableData, "rows", this.tableData.rows);
    },
    /**
     * @description 添加
     * @param {Object} row
     */
    addItem(row) {
      this.$emit("addItem", row);
    },
    /**
     * @description 编辑
     * @param {Object} row
     */
    editItem(row) {},
    /**
     * @description 删除
     * @param {Object} row
     */
    deleteItem($index) {
      let newArr = this.tableData.rows.filter((item, index) => index != $index);
      this.$set(this.tableData, "rows", newArr);
    },
    /**
     * @description 批量删除
     * @param {Object} row
     */
    deleteItems(id) {
      let newArr = this.tableData.rows;
      this.multipleSelection.forEach((i) => {
        newArr = newArr.filter((item) => item[id] != i[id]);
      });
      this.$set(this.tableData, "rows", newArr);
    },
    /**
     * @description 查看
     * @param {Object} row
     */
    viewItem(row) {},
    /**
     * @description 查看血缘
     * @param {Object} row
     */
    viewBloodItem(row) {},
    // 选择表格(全选)
    changeAllSelect(val) {
      const loop = (data) => {
        data.forEach((ite) => {
          ite.checked = val;
          if ("indeterminate" in ite) {
            ite.indeterminate = false;
          }
          if (ite.children) {
            loop(ite.children);
          }
        });
      };
      loop(this.tableData.rows);
      this.$set(this.tableData, "rows", this.tableData.rows);
    },
    // 选择表格(表格行选择)
    // changeRowSelect(val) {
    //   // console.log(val)
    //   if (val.children && val.children.length) {
    //     val.children.forEach((ss) => {
    //       ss.checked = val.checked;
    //     });
    //   } else {
    //     let checkedLeg = 0;
    //     this.tableData.rows.some((item) => {
    //       if (item.id === val.pId) {
    //         // 获取当前父级下子级选中条数
    //         const leg = item.children.length;
    //         checkedLeg = item.children.filter((ss) => ss.checked).length;
    //         // 根据条数改变父级的indeterminate和checked
    //         if (checkedLeg === 0) {
    //           item.indeterminate = false;
    //           item.checked = false;
    //         } else if (checkedLeg < leg) {
    //           item.indeterminate = true;
    //           item.checked = false;
    //         } else if (checkedLeg === leg) {
    //           item.indeterminate = false;
    //           item.checked = true;
    //         }
    //         return;
    //       }
    //     });
    //   }
    //   // 判断是否全部选择了,改变全选框的样式
    //   let flag = true;
    //   this.tableData.rows.some((item) => {
    //     if (!item.checked) {
    //       flag = false;
    //       return;
    //     }
    //   });
    //   this.checkedAll = flag;
    // },

    // 点击提交选中的表格
    getSelectTable() {
      const selectedItems = [];
      const loop = (data) => {
        data.forEach((item) => {
          if (item.checked) {
            selectedItems.push(item);
          }
          if (item.children) {
            loop(item.children);
          }
        });
      };
      loop(this.tableData.rows);
      return selectedItems;
    },
  },
};
</script>

<style lang="less" scoped>
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
.el-table {
  .zbName1 {
    padding-left: 20px;
    background: url(~@/assets/images/zb-theme.svg) no-repeat left center;
  }
  .zbName2 {
    padding-left: 30px;
    background: url(~@/assets/images/zb.svg) no-repeat 10px center;
  }
  .zbName3 {
    padding-left: 40px;
    background: url(~@/assets/images/zb.svg) no-repeat 20px center;
  }
  .zbName4 {
    padding-left: 50px;
    background: url(~@/assets/images/zb.svg) no-repeat 30px center;
  }
  .zbName5 {
    padding-left: 60px;
    background: url(~@/assets/images/zb.svg) no-repeat 40px center;
  }
}
</style>
