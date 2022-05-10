<template>
  <fu-table
    id="mainTable"
    :fu-data="tableData"
    :row-key="rowKey"
    border
    @row-click="rowClick"
    @selection-change="handleSelectionChange"
    v-clickoutside="triggerHideRowInputEvent"
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
        <div v-if="isEdit">
          <fu-input
            v-if="scope.row.isClick && item.isInput"
            v-model="scope.row[item.prop]"
            size="mini"
            @change="valueChange(scope.row, item.prop)"
          ></fu-input>
          <div v-else>
            <div v-if="item.isIndent">
              <div
                :style="{
                  paddingLeft: (Number(scope.row.level) - 1) * 20 + 'px',
                }"
              >
                {{ scope.row[item.prop] }}
              </div>
            </div>
            <div v-else>
              {{ scope.row[item.prop] }}
            </div>
          </div>
        </div>
        <div v-else>
          <div
            v-if="item.isIndent"
            :style="{ paddingLeft: (Number(scope.row.level) - 1) * 20 + 'px' }"
          >
            {{ scope.row[item.prop] }}
          </div>
          <div v-else>{{ scope.row[item.prop] }}</div>
        </div>
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
} from "fusion-ui";
import http from "@/utils/http";
import { arraySortByProp } from "@/utils/tool";
import Vue from "vue";
//自定义事件---点击除目标容器外空白区域触发
Vue.directive("clickoutside", {
  bind(el, binding) {
    function documentHandler(e) {
      if (el.contains(e.target)) {
        return false;
      }
      if (binding.expression) {
        binding.value(e);
      }
    }
    el.__vueClickOutside__ = documentHandler;
    document.addEventListener("click", documentHandler);
  },
  unbind(el) {
    document.removeEventListener("click", el.__vueClickOutside__);
    delete el.__vueClickOutside__;
  },
});
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
     * @description 点击表格外空白区域触发事件---隐藏表格行内表单
     */
    triggerHideRowInputEvent() {
      let newTableData = this.tableData.rows.map((item) => {
        return {
          ...item,
          isClick: false,
        };
      });
      this.$set(this.tableData, "rows", newTableData);
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
     * @description 多选表格change事件
     * @param {}
     * @returns {}
     */
    handleSelectionChange(val) {
      console.log("选中的行", val);
      this.selectedTableData = val;
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
    editRow(row) {},
    /**
     * @description 复制
     * @param {Object} row
     */
    copyRow(row) {},
    /**
     * @description 创建新版本
     * @param {Object} row
     */
    createVersion(row) {},
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
      let newArr = this.tableData.rows.filter((item, index) => index != $index);
      this.$set(this.tableData, "rows", newArr);
    },
    /**
     * @description 批量删除
     */
    batchDeleteRow() {
      let tableRows = this.tableData.rows;
      this.selectedTableData.forEach((item) => {
        this.tableData.rows.some((ite, index) => {
          if (item.id == ite.id) {
            tableRows.splice(index, 1);
            return true;
          }
        });
      });
      this.$set(this.tableData, "rows", tableRows);
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
</style>
