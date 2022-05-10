<template>
  <common-table
    table-id="MeasureVerificationSetting_table"
    :is-need-paging="true"
    :is-has-selection="true"
    :fu-column="column"
    :staticTableData="staticTableData"
    operation-width="150px"
    @select="select"
    @select-all="select"
  >
    <template slot-scope="rowData" slot="one">
      <div class="operateBtns">
        <i
          class="iconfont iconbiaoge_bianji"
          title="编辑"
          @click="deleteItem(rowData)"
        ></i>
        <i
          class="iconfont iconbiaoge_guizepeizhi"
          title="业务构成"
          @click="deleteItem(rowData)"
        ></i>
        <i
          class="iconfont iconbiaoge_chakanshuju"
          title="查看血缘"
          @click="deleteItem(rowData)"
        ></i>
        <i
          class="iconfont iconbiaoge_shanchu"
          title="删除"
          @click="deleteItem(rowData)"
        ></i>
      </div>
    </template>
  </common-table>
</template>

<script>
import CommonTable from "@/components/CommonTable/index.vue";
export default {
  name: "mainTable",
  components: {
    CommonTable,
  },
  props: {},
  data() {
    return {
      //表格静态数据
      staticTableData: {
        page: 1,
        pagerows: 10,
        rows: [
          {
            chName: "中文名1",
          },
          {
            chName: "中文名2",
          },
        ],
        totalrows: 0,
      },
      //表格列头
      column: [
        {
          label: "变量中文名",
          prop: "chName",
          width: "200",
        },

        {
          label: "变量编码",
          prop: "variableCode",
          width: "120",
        },

        {
          label: "变量描述",
          prop: "variableDes",
          width: "120",
          reqUrl: "",
        },
        {
          label: "计量单位",
          prop: "unit",
          width: "120",
          reqUrl: "",
        },
        {
          label: "创建时间",
          prop: "createTime",
          width: "120",
        },
      ],
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
    /**
     * @description 主表选中
     * @param {Array<Row>} selection 选中行的数组
     */
    select(selection) {
      console.log("select", selection);
      // TODO. 遍历 selection 获得 主表选中列的唯一id
    },
    editRow(row) {},
  },
};
</script>

<style lang="less" scoped>
.operateBtns {
  white-space: nowrap;
}
</style>
