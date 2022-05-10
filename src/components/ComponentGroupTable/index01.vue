<template>
  <fu-table
    id="mainTable"
    :fu-data="tableData"
    row-key="id"
    border
    @row-click="rowClick"
    @selection-change="handleSelectionChange"
    v-clickoutside="triggerHideRowInputEvent"
    default-expand-all
    :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
  >
    <fu-table-column type="selection" width="40"> </fu-table-column>
    <fu-table-column label="序号" type="index" width="50"> </fu-table-column>
    <fu-table-column
      v-for="(item, index) in tableData.column"
      :key="index"
      :prop="item.prop"
      :label="item.label"
      :minWidth="item.width"
    >
      <template slot-scope="scope">
        <div v-if="item.isInput">
          <fu-input
            v-if="scope.row.isClick"
            v-model="scope.row[item.prop]"
            size="mini"
            @change="valueChange(scope.row, item.prop)"
          ></fu-input>
          <div v-else>
            {{ scope.row[item.prop] }}
          </div>
        </div>
        <div v-else>
          {{ scope.row[item.prop] }}
        </div>
      </template>
    </fu-table-column>
    <fu-table-column fixed="right" label="操作" width="300">
      <template slot-scope="scope">
        <div class="operateBtns">
          <i
            class="iconfont iconqita_tianjia"
            title="添加"
            @click.stop="addItem(scope.row, scope.$index)"
          ></i>
          <i
            class="iconfont iconbiaoge_bianji"
            title="编辑"
            @click.stop="editItem(scope.row)"
          ></i>
          <i
            class="iconfont iconqita_yingshe"
            title="复制"
            @click.stop="copyItem(scope.row, scope.$index)"
          ></i>
          <i
            class="iconfont iconqita_zidingyi"
            title="创建新版本"
            @click.stop="createItem(scope.row, scope.$index)"
          ></i>
          <i
            class="iconfont iconbiaoge_shanchu"
            title="删除"
            @click.stop="deleteItem(scope.$index)"
          ></i>
          <i
            class="iconfont iconbiaoge_xieyuanguanxi"
            title="查看血缘"
            @click.stop="viewBloodItem(scope.row)"
          ></i>
          <img
            title="上移"
            :src="require('@/assets/images/move-up.svg')"
            @click.stop="moveUpItem(scope.row, scope.$index)"
          />
          <img
            title="下移"
            :src="require('@/assets/images/move-down.svg')"
            @click.stop="moveDownItem(scope.row, scope.$index)"
          />
          <img
            title="升级"
            :src="require('@/assets/images/level-up.svg')"
            @click.stop="upLevelItem(scope.row, scope.$index)"
          />
          <img
            title="降级"
            :src="require('@/assets/images/level-down.svg')"
            @click.stop="downLevelItem(scope.row, scope.$index)"
          />
        </div>
      </template>
    </fu-table-column>
  </fu-table>
</template>

<script>
import { Table, TableColumn, Input, Message } from "fusion-ui";
import { transformTozTreeFormat, FlatToNested, treeToArray, swapArr } from "@/utils/tool";
import http from "@/utils/http";
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
  },
  props: {
    postTableData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      checkedAll: false,
      // 当前点击行的id
      rowId: "",
      //最低层级---数字最大
      maxLevel: 1,
      //选中的表格数据
      selectedTableData: [],
    };
  },
  computed: {
    tableData() {
      let tableData = JSON.parse(JSON.stringify(this.postTableData));
      tableData.rows = this.initTransTreeData(tableData.rows);
      return tableData;
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
    //将返回的列表数据初始化转换成树形数据
    initTransTreeData(listData) {
      //1.现将数据添加id
      listData.forEach((item) => {
        item.id = item.statIndctId
      });
      //2.再将数据添加pId, 并转成新的树形结构---根据层级level
      return this.transNewTreeData(listData);
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
        $item.isClick = item.id == row.id ? true : false;
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
      let { id, isChange } = row;
      if (!isChange) {
        this.$set(row, "isChange", true);
      }
    },
    /**
     * @description 上移
     * @param {Object} row 行数据
     * @param {Number} $index 行索引
     */
    moveUpItem(row, $index) {
      let { level, id, pId } = row;
      if (this.moveUpNoAllow($index, level, id)) {
        Message.warning("不能进行上移操作");
        return;
      }
      //1.当前行层级处于最高层级level=1,则直接交换与之相邻上一个同级父级位置
      //2.当前同一层级内部向上遍历，如果找到兄弟节点，则与其调换位置，pId保持不变
      //3.如果情况1中没有找到兄弟节点，则继续在其父级节点内部向上遍历进行查找，如果找到则将当前移动的节点的pId修改为查找到的节点的id
      let tempTableDataRows = this.tableData.rows;
      if (level == 1 || pId == 0) {
        let findItemIndex = tempTableDataRows.findIndex(
          (item) => item.id == id
        );
        if (findItemIndex > 0) {
          tempTableDataRows = swapArr(
            tempTableDataRows,
            findItemIndex - 1,
            findItemIndex
          );
        }
      } else {
        const loop = (data) => {
          data.some((item, pIndex) => {
            if (item.id == pId) {
              if (item.children && item.children.length) {
                let findIndex = item.children.findIndex((ite) => ite.id == id);
                if (findIndex > -1) {
                  if (findIndex > 0) {
                    item.children = swapArr(
                      item.children,
                      findIndex - 1,
                      findIndex
                    );
                  } else {
                    //位于该父级下第一个子节点，则上移至该父级同级上一个父节点下
                    item.children[findIndex].pId = data[pIndex - 1].id;
                  }
                }
              }
              return true;
            } else {
              if (item.children) {
                loop(item.children);
              }
            }
          });
        };
        loop(tempTableDataRows);
      }

      this.$set(
        this.tableData,
        "rows",
        transformTozTreeFormat(treeToArray(tempTableDataRows))
      );
    },
    /**
     * @description 上移禁用条件
     * @param {Number} $index 行索引
     * @param {Number} level 层级
     * @param {Array}  row 表格行数据
     * @returns {Boolean}
     */
    moveUpNoAllow($index, level, id) {
      //当前点击的行处于以下2种状态，不可上移：
      //1. 当前行处于表格第一行
      //2. 当前行处于第一个一级节点下的第一个子节点
      if ($index == 0) return true;
      let tableRows = this.tableData.rows;
      if (tableRows[0].children) {
        if (tableRows[0].children.length && tableRows[0].children[0].id == id)
          return true;
      }
    },

    /**
     * @description 下移
     * @param {Object} row 行数据
     * @param {Number} $index 行索引
     */
    moveDownItem(row, $index) {
      let { level, id, pId } = row;
      //校验是否符合下移条件
      if (this.moveDownNoAllow($index, level)) {
        Message.warning("不能进行下移操作");
        return;
      }
      //1.当前行层级处于最高层级level=1,则直接交换与之相邻下一个同级父级位置
      //2.当前同一层级内部向下遍历，如果找到兄弟节点，则与其调换位置，pId保持不变
      //3.如果情况1中没有找到兄弟节点，则继续在其父级节点内部向下遍历进行查找，如果找到则将当前移动的节点的pId修改为查找到的节点的id
      let tempTableDataRows = this.tableData.rows;
      if (level == 1 || pId == 0) {
        let findItemIndex = tempTableDataRows.findIndex(
          (item) => item.id == id
        );
        if (findItemIndex > -1) {
          tempTableDataRows = swapArr(
            tempTableDataRows,
            findItemIndex,
            findItemIndex + 1
          );
        }
      } else {
        const loop = (data) => {
          data.some((item, pIndex) => {
            if (item.id == pId) {
              if (item.children && item.children.length) {
                let findIndex = item.children.findIndex((ite) => ite.id == id);
                if (findIndex > -1) {
                  if (findIndex < item.children.length - 1) {
                    item.children = swapArr(
                      item.children,
                      findIndex,
                      findIndex + 1
                    );
                  } else {
                    //位于该父级下第一个子节点，则下移至该父级同级下一个父节点下
                    item.children[findIndex].pId = data[pIndex + 1].id;
                  }
                }
              }
              return true;
            } else {
              if (item.children) {
                loop(item.children);
              }
            }
          });
        };
        loop(tempTableDataRows);
      }

      this.$set(
        this.tableData,
        "rows",
        transformTozTreeFormat(treeToArray(tempTableDataRows))
      );
    },

    /**
     * @description 下移禁用条件
     * @param {Number} $index 行索引
     * @param {Number} level 层级
     * @returns {Boolean}
     */
    moveDownNoAllow($index, level) {
      //当前点击的行处于以下2种状态，不可下移：
      //1. 当前行处于表格最后一行
      //2. 当前行的后面几行的层级都比该行低
      let tempTableRows = treeToArray(
        JSON.parse(JSON.stringify(this.tableData.rows))
      );
      if ($index == tempTableRows.length - 1) return true;
      let flag = true;
      tempTableRows.some((ite, index) => {
        if (index > $index && ite.level <= level) {
          flag = false;
        }
      });
      return flag;
    },
    /**
     * @description 升级 level--
     * @param {Number} $index 行索引
     */
    upLevelItem(row, $index) {
      let { level, id } = row;
      if (level == 1) {
        return;
      } else {
        //遍历树节点，找到当前点击的节点并修改层级
        let tableRows = this.tableData.rows;
        const changeLevelFunc = (data) => {
          data.some((item) => {
            if (item.id == id) {
              const loop = (data) => {
                data.forEach((ite) => {
                  ite.level = ite.level - 1;
                  if (ite.children) {
                    loop(ite.children);
                  }
                });
              };
              loop([item]);
              return true;
            } else {
              if (item.children) {
                changeLevelFunc(item.children);
              }
            }
          });
        };
        changeLevelFunc(tableRows);
        //根据层级修改pId
        tableRows = this.transNewTreeData(treeToArray(tableRows));
        this.$set(this.tableData, "rows", tableRows);
      }
    },
    /**
     * @description 根据层级修改pId,并返回最新的树形结构
     * @param {Array} listData
     * @returns {Array}
     */
    transNewTreeData(listData) {
      listData.forEach((item, index) => {
        let _level = item.level;
        if (_level == 1) {
          item.pId = 0;
        } else if (_level > 1 && index > 0) {
          for (let i = index - 1; i >= 0; i--) {
            if (listData[i].level < _level) {
              item.pId = listData[i].id;
              break;
            }
          }
        }
      });
      return FlatToNested(listData);
    },
    /**
     * @description 降级 level++
     * @param {Number} $index 行索引
     */
    downLevelItem(row, $index) {
      let { level, id } = row;
      //获取当前结构的最大层级---即最低层级数字最大
      let listData = treeToArray(
        JSON.parse(JSON.stringify(this.tableData.rows))
      );
      this.maxLevel = this.getMaxLevel(listData);
      let filterMaxLevelArr = listData.filter(
        (item) => item.level == this.maxLevel
      );
      if (level == this.maxLevel && filterMaxLevelArr.length == 1) return;
      //遍历树节点，找到当前点击的节点并修改层级
      let tableRows = this.tableData.rows;
      const changeLevelFunc = (data) => {
        data.some((item) => {
          if (item.id == id) {
            const loop = (data) => {
              data.forEach((ite) => {
                ite.level = ite.level + 1;
                if (ite.children) {
                  loop(ite.children);
                }
              });
            };
            loop([item]);
            return true;
          } else {
            if (item.children) {
              changeLevelFunc(item.children);
            }
          }
        });
      };
      changeLevelFunc(tableRows);
      //根据层级修改pId
      tableRows = this.transNewTreeData(treeToArray(tableRows));
      this.$set(this.tableData, "rows", tableRows);
    },
    /**
     * @description 获取当前树结构最大层级
     * @param {Array} listData
     * @returns {Number}
     */
    getMaxLevel(listData) {
      let levelArr = listData.map((item) => item.level);
      return Math.max.apply(null, levelArr);
    },
    /**
     * @description 编辑
     * @param {Object} row
     */
    editItem(row) {},
    /**
     * @description 复制
     * @param {Object} row
     */
    copyItem(row) {},
    /**
     * @description 创建新版本
     * @param {Object} row
     */
    createItem(row) {},
    /**
     * @description 添加
     * @param {Object} row
     */
    addItem(row, $index) {
      //获取新编码
      http
        .post("/api/meta/v1/indct/randomCode.do", {
          postData: `{"data":[{"name":"info","vtype":"attr","data":""}]}`,
        })
        .then((res) => {
          let result = res.data[0].data[0];
          this.tableData.rows.splice($index + 1, 0, {
            ...row,
            id: result.id,
            statIndctCode: result.code,
            isClick: true,
          });
          this.tableData.rows.forEach((item, index) => {
            item.sortNum = index + 1;
          });
          this.$emit("upDateTableData", this.tableData.rows);
        });
    },
    /**
     * @description 查看血缘
     * @param {Object} row
     */
    viewBloodItem(row) {},
    /**
     * @description 删除
     * @param {Object} row
     */
    deleteItem($index) {
      let newArr = this.tableData.rows.filter((item, index) => index != $index);
      this.$set(this.tableData, "rows", newArr);
    },
    /**
     * @description 批量删除当前表格选中的数据
     */
    batchDelTableData() {
      let tempTableData = JSON.parse(JSON.stringify(this.tableData.rows));
      tempTableData = tempTableData.filter((item, index) => {
        let flag = true;
        this.selectedTableData.some((ite) => {
          if (item.id == ite.id) {
            flag = false;
            return true;
          }
        });
        return flag;
      });
      this.$set(this.tableData, "rows", tempTableData);
    },

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
/deep/ .el-table {
  .cell {
    display: flex;
  }
}
</style>
