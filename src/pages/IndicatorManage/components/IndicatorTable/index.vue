<template>
  <fu-table
    id="mainTable"
    :fu-data="tableData"
    :row-key="rowKey"
    :row-class-name="tableRowClassName"
    max-height="700px"
    border
    @row-click="rowClick"
    @selection-change="handleSelectionChange"
  >
    <fu-table-column type="selection" width="55"> </fu-table-column>
    <fu-table-column label="序号" type="index" width="50"> </fu-table-column>
    <fu-table-column
      v-for="(item, index) in tableData.column"
      :key="index"
      :prop="item.prop"
      :label="item.label"
      :minWidth="item.width"
    >
      <template slot-scope="scope">
        <div
          v-if="item.isIndent"
          :style="{
            paddingLeft: (Number(scope.row.statIndctLevel) - 1) * 20 + 'px',
          }"
        >
          {{ scope.row[item.prop] }}
        </div>
        <div v-else>{{ scope.row[item.prop] }}</div>
      </template>
    </fu-table-column>
    <fu-table-column fixed="right" label="操作" width="200">
      <template slot-scope="scope">
        <div class="operateBtns">
          <span
            v-if="index < 2"
            v-for="(item, index) in tableOperateBtnGroup"
            :key="index"
            @click.stop="handleRowBtnClick(scope.row, scope.$index, item.value)"
          >
            <i :class="['iconfont', item.icon]"></i>
            <span>{{ item.label }}</span>
          </span>

          <fu-dropdown>
            <span class="el-dropdown-link">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <fu-dropdown-menu slot="dropdown">
              <fu-dropdown-item
                v-for="(item, index) in tableOperateBtnGroup"
                :key="index"
                ><div
                  @click="
                    handleRowBtnClick(scope.row, scope.$index, item.value)
                  "
                >
                  {{ item.label }}
                </div></fu-dropdown-item
              >
            </fu-dropdown-menu>
          </fu-dropdown>
        </div>
      </template>
    </fu-table-column>
  </fu-table>
</template>

<script>
import {
  Table,
  TableColumn,
  Input,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Message,
} from "fusion-ui";
import http from "@/utils/http";
import { arraySortByProp } from "@/utils/tool";
export default {
  name: "mainTable",
  components: {
    FuTable: Table,
    FuTableColumn: TableColumn,
    FuInput: Input,
    FuDropdown: Dropdown,
    FuDropdownItem: DropdownItem,
    FuDropdownMenu: DropdownMenu,
  },
  props: {
    //表格行单元格是否可编辑
    isEdit: {
      type: Boolean,
      default: false,
    },
    //表格行操作按钮组
    tableOperateBtnGroup: {
      type: Array,
      default: () => [],
    },
    //表格头和行数据
    postTableData: {
      type: Object,
      default: () => {},
    },
    //行数据唯一标记
    rowKey: {
      type: String,
      required: true,
    },
    //表格组件类别
    tableCompType: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      //选中的表格数据
      selectedTableData: [],
    };
  },
  computed: {
    tableData() {
      //处理拿到的数据---按照sortNum行排序
      let newTableData = JSON.parse(JSON.stringify(this.postTableData));
      newTableData["rows"] = arraySortByProp("sortNum", newTableData.rows);
      return newTableData;
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
    /**
     * @description 自定义行样式
     */
    tableRowClassName({ row, rowIndex }) {
      if (row) {
        if (row.highLight) {
          return "highLight-row";
        }
      } else {
        return "";
      }
    },
    /**
     * @description 表格行操作按钮点击事件
     * @param {Object} row 行数据
     * @param {Nunmber} $index 行索引
     * @param {String} type 按钮类型
     */
    handleRowBtnClick(row, $index, type) {
      switch (type) {
        case "editRow":
          this.editRow(row, $index);
          break;
        case "deleteRow":
          this.deleteRow(row, $index);
          break;
        case "addRow":
          this.addRow(row, $index);
          break;
        case "copyRow":
          this.copyRow(row, $index);
          break;
        case "createVersion":
          this.createVersion(row, $index);
          break;
        case "viewBloodItem":
          this.viewBloodItem(row, $index);
          break;
      }
    },
    /**
     * @description 查看血缘关系
     * @param {}
     * @returns {}
     */
    viewBloodItem(row) {
      //TODO
    },
    /**
     * @description 表格行点击事件
     * @param {}
     * @returns {}
     */
    rowClick(row, column, event) {
      //阻止事件冒泡
      event.stopPropagation();
      let newTableData = this.tableData.rows.map((item) => {
        let $item = { ...item };
        $item.isClick = item[this.rowKey] == row[this.rowKey] ? true : false;
        return $item;
      });
      this.$set(this.tableData, "rows", newTableData);
    },
    /**
     * @description 表格模糊查询---根据某些字段
     * @param {Array} codeArr 所要匹配的字段数组
     * @param {String} label 所要匹配的字段数组
     */
    tableBlurredQuery(codeArr, label) {
      let tableData = this.tableData.rows;
      if (!label) {
        tableData.forEach((item) => {
          this.$set(item, "highLight", false);
        });
      } else {
        codeArr.forEach((code) => {
          tableData.forEach((item) => {
            if (item[code].indexOf(label) !== -1) {
              this.$set(item, "highLight", true);
            }
          });
        });
      }
    },
    /**
     * @description 多选表格change事件
     * @param {Array} val
     */
    handleSelectionChange(val) {
      this.selectedTableData = val;
      this.$emit("changeMoveBtnStatus", val.length ? false : true);
    },

    /**
     * @description 文本框change事假
     * @param {Object} row
     */
    valueChange(row, prop) {
      let { isChange } = row;
      if (!isChange) {
        this.$set(row, "isChange", true);
      }
    },
    /**
     * @description 编辑
     * @param {Object} row
     */
    editRow(row) {
      this.$emit("editIndicator", row);
    },
    /**
     * @description 复制
     * @param {Object} row
     */
    copyRow(row, $index) {
      //获取新编码
      http
        .post("/api/meta/v1/indct/randomCode.do", {
          postData: `{"data":[{"name":"info","vtype":"attr","data":""}]}`,
        })
        .then((res) => {
          let result = res.data[0].data[0];
          let postData = {
            data: [
              {
                name: "statIndctId",
                vtype: "attr",
                data: row.statIndctId,
              },
              { name: "type", vtype: "attr", data: "1" },
              {
                name: "statIndctCode",
                vtype: "attr",
                data: result.code,
              },
            ],
          };
          http
            .post("/api/meta/v1/indct/indctCopyOrNewVersion.do", {
              postData: JSON.stringify(postData),
            })
            .then((res) => {
              if (res.message == "success") {
                Message.success("复制成功");
                this.$emit("upDateTableData");
              }
            })
            .catch((err) => {
              Message.error(`复制失败!，${err.errorMessage}`);
            });
        });
    },
    /**
     * @description 创建新版本
     * @param {Object} row
     */
    createVersion(row, $index) {
      http
        .post("/api/meta/v1/indct/randomCode.do", {
          postData: `{"data":[{"name":"info","vtype":"attr","data":""}]}`,
        })
        .then((res) => {
          let result = res.data[0].data[0];
          let postData = {
            data: [
              {
                name: "statIndctId",
                vtype: "attr",
                data: row.statIndctId,
              },
              { name: "type", vtype: "attr", data: "2" },
              {
                name: "statIndctCode",
                vtype: "attr",
                data: result.code,
              },
            ],
          };
          http
            .post("/api/meta/v1/indct/indctCopyOrNewVersion.do", {
              postData: JSON.stringify(postData),
            })
            .then((res) => {
              if (res.message == "success") {
                Message.success("创建成功");
                this.$emit("upDateTableData");
              }
            })
            .catch((err) => {
              Message.error(`创建失败!，${err.errorMessage}`);
            });
        });
    },
    /**
     * @description 添加
     * @param {Object} row
     */
    addRow(row, $index) {
      //TODO begin 测试待删除
      let result = {
        code: 123,
        statIndctId: "1122233",
      };
      let newRow = {};
      for (let key in row) {
        newRow[key] = "";
      }
      newRow.statIndctCode = result.code;
      newRow.isClick = true;
      newRow[this.rowKey] = result[this.rowKey];
      this.tableData.rows.splice($index, 0, newRow);
      this.tableData.rows.forEach((item, index) => {
        item.sortNum = index + 1;
      });
      //TODO end 测试待删除
      //获取新编码
      // http
      //   .post("/api/meta/v1/indct/randomCode.do", {
      //     postData: `{"data":[{"name":"info","vtype":"attr","data":""}]}`,
      //   })
      //   .then((res) => {
      //     let result = res.data[0].data[0];
      //     let newRow = {};
      //     for (let key in row) {
      //       newRow[key] = "";
      //     }
      //     newRow.statIndctCode = result.code;
      //     newRow.isClick = true;
      //     newRow[this.rowKey] = result.id;
      //     this.tableData.rows.splice($index - 1, 0, newRow);
      //     this.tableData.rows.forEach((item, index) => {
      //       item.sortNum = index + 1;
      //     });
      //   });
    },
    /**
     * @description 查看血缘
     * @param {Object} row
     */
    viewBlood(row) {},
    /**
     * @description 单行删除
     * @param {Object} row
     */
    deleteRow(row, $index) {
      let tableRows = this.tableData.rows,
        ids = "";
      ids = row.statIndctId;
      this.delRowsPostFunc(ids, () => {
        let newArr = tableRows.filter((item, index) => index != $index);
        this.$set(this.tableData, "rows", newArr);
      });
    },
    /**
     * @description 批量删除
     */
    batchDeleteRow() {
      let tableRows = this.tableData.rows,
        selectTableRows = this.selectedTableData,
        idsArr = [],
        ids = "";
      selectTableRows.forEach((item) => {
        idsArr.push(item.statIndctId);
      });
      ids = idsArr.join(",");
      this.delRowsPostFunc(ids, () => {
        selectTableRows.forEach((item) => {
          tableRows.some((ite, index) => {
            if (item.id == ite.id) {
              tableRows.splice(index, 1);
              return true;
            }
          });
        });
        this.$set(this.tableData, "rows", tableRows);
      });
    },
    /**
     * @description 删除指标请求接口
     * @param {String} ids
     * @returns {Function} callback
     */
    delRowsPostFunc(ids, callback) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let postData = { data: [{ name: "ids", vtype: "attr", data: ids }] };
          http
            .post("/api/meta/v1/indct/removeIndcts.do", {
              postData: JSON.stringify(postData),
            })
            .then((res) => {
              if (res.message == "success") {
                Message.success("删除成功");
                callback();
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
  },
};
</script>

<style lang="less" scoped>
.operateBtns {
  font-size: 16px;
  color: #409eff;
  display: flex;
  white-space: nowrap;
  > span {
    display: flex;
    align-items: center;
    flex-direction: row;
    margin-right: 10px;
    cursor: pointer;
  }
  i {
    cursor: pointer;
  }
  img {
    cursor: pointer;
    margin-right: 10px;
  }
}
/deep/ .el-table .operateBtns .iconfont {
  margin-right: 5px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 14px;
}
/deep/.el-table .highLight-row {
  background: rgb(236, 245, 255);
}
/deep/.el-table .edit-row {
  .el-table__cell {
    border: 1px solid green;
  }
}
</style>
