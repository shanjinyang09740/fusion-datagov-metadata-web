/**数据冲突检查主页面 */
<template>
  <div class="content">
    <div class="header">
      <div class="query">
        <fu-form :inline="true" :model="form">
          <fu-form-item label="主题名称" label-width="100px">
            <fu-input size="medium" v-model="form.themeName"></fu-input>
          </fu-form-item>
          <fu-form-item label="报告期" label-width="100px">
            <fu-input size="medium" v-model="form.bgq"></fu-input>
          </fu-form-item>
          <fu-form-item label="地区" label-width="60px">
            <fu-select
              size="medium"
              placeholder="请选择"
              :fu-request="selectRequest"
              v-model="form.area"
              fu-id="fu-select-3"
              clearable
            >
              <fu-option
                v-for="item in fuSelect3"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              >
              </fu-option>
            </fu-select>
          </fu-form-item>

          <fu-form-item label="指标" label-width="60px">
            <fu-input size="medium" v-model="form.indct"></fu-input>
          </fu-form-item>
          <fu-form-item>
            <fu-button type="success" @click="queryTable" size="medium"
              ><i class="iconfont iconchaxun"></i>查询</fu-button
            >
          </fu-form-item>
          <fu-form-item>
            <fu-button type="primary" @click="queryTable" size="medium"
              >更新</fu-button
            > </fu-form-item
          ><fu-form-item>
            <fu-button type="primary" @click="exportTable" size="medium"
              >导出</fu-button
            >
          </fu-form-item>
        </fu-form>
      </div>
    </div>
    <div class="fu-table-wrapper">
      <fu-table
        :fu-request="tableReq"
        ref="mainTable"
        border
        fu-id="table-id-4"
      >
        <fu-table-column
          type="index"
          width="55"
          label="序号"
          align="center"
        ></fu-table-column>
        <fu-table-column
          v-for="item in table.column"
          :key="item.prop"
          :label="item.label"
          :prop="item.prop"
          :min-width="item.width"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div v-if="item.codeListId && item.codeListId != ''">
              {{ tableChangeCode(scope.row[item.prop], item.changeArr) }}
            </div>
            <div v-else>{{ scope.row[item.prop] }}</div>
          </template>
        </fu-table-column>
      </fu-table>
      <fu-pagination
        ref="page"
        @current-change="handleCurrentChange"
        :fu-request="tableReq"
        @size-change="handleSizeChange"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="table.data.pagerows"
        layout="total, sizes, prev, pager, next, jumper"
        :total="table.data.totalrows"
      ></fu-pagination>
    </div>
  </div>
</template>

<script>
import {
  Table,
  TableColumn,
  Pagination,
  Button,
  Input,
  Message,
  Form,
  Select,
  FormItem,
  Option,
} from "fusion-ui";
// import { queryData } from "@/service";
// import { postJSON } from "@/utils/post";
// import { exportData } from "@/utils/tools";
export default {
  name: "",
  components: {
    FuTable: Table,
    FuTableColumn: TableColumn,
    FuPagination: Pagination,
    FuButton: Button,

    FuInput: Input,
    FuForm: Form,
    FuSelect: Select,
    FuFormItem: FormItem,
    FuOption: Option,
  },

  data() {
    return {
      selectRequest: {
        url: "",
        params: [],
      },

      formQuery: {
        themeName: "",
        bgq: "",
        area: "",
        indct: "",
      },
      //查询表单
      form: {
        themeName: "",
        bgq: "",
        area: "",
        indct: "",
      },
      //升降序
      sortFlag: "",
      //排序名称
      sortName: "",
      //表格数据
      table: {
        type: [],
        column: [
          {
            label: "主题",
            prop: "themeName",
            width: "100",
          },
          {
            label: "表名",
            prop: "tableName",
            width: "100",
          },
          {
            label: "报告期",
            prop: "bgq",
            width: "100",
          },
          {
            label: "地区",
            prop: "area",
            width: "100",
          },
          {
            label: "指标",
            prop: "indct",
            width: "100",
          },
          {
            label: "指标code",
            prop: "indctCode",
            width: "100",
          },
          {
            label: "数据值",
            prop: "data",
            width: "100",
          },
          {
            label: "计量单位",
            prop: "unit",
            width: "100",
          },
          {
            label: "生成时间",
            prop: "createTime",
            width: "100",
          },
        ],
        data: {
          page: 1,
          pagerows: 10,
          // rows: [
          //   {
          //     id:"1",
          //     serviceId: "1312312",
          //     treeSortId: "1",
          //     serviceName: "sdfsdf",
          //     serviceAddress: "海南省海口市龙华区",
          //     serviceType: "海南长城建筑工程有限公司",
          //     serviceDatasetId: "",
          //     serviceDes: "机械设备设计",
          //     createTime: "软件开发",
          //     updateTime: "陈闪",
          //     activity:"460106003004",
          //     number:"460106003003",
          //     registration:"剔除",
          //     code:"460108",
          //     checkStatus:"已加入名录"
          //   },
          //    {
          //      id:"2",

          //     serviceId: "1312312",
          //     treeSortId: "1",
          //     serviceName: "sdfsdf",
          //     serviceAddress: "海南省海口市龙华区",
          //     serviceType: "海南长城建筑工程有限公司",
          //     serviceDatasetId: "",
          //     serviceDes: "机械设备设计",
          //     createTime: "软件开发",
          //     updateTime: "陈闪",
          //     activity:"460106003004",
          //     number:"460106003003",
          //     registration:"剔除",
          //     code:"460108",
          //     checkStatus:"已加入名录"
          //   },
          //    {
          //      id:"3",
          //     serviceId: "1312312",
          //     treeSortId: "1",
          //     serviceName: "sdfsdf",
          //     serviceAddress: "海南省海口市龙华区",
          //     serviceType: "海南长城建筑工程有限公司",
          //     serviceDatasetId: "",
          //     serviceDes: "机械设备设计",
          //     createTime: "软件开发",
          //     updateTime: "陈闪",
          //     activity:"460106003004",
          //     number:"460106003003",
          //     registration:"剔除",
          //     code:"460108",
          //     checkStatus:"未加入名录"
          //   },
          //    {
          //      id:"4",
          //     serviceId: "1312312",
          //     treeSortId: "1",
          //     serviceName: "sdfsdf",
          //     serviceAddress: "海南省海口市龙华区",
          //     serviceType: "海南长城建筑工程有限公司",
          //     serviceDatasetId: "",
          //     serviceDes: "机械设备设计",
          //     createTime: "软件开发",
          //     updateTime: "陈闪",
          //     activity:"460106003004",
          //     number:"460106003003",
          //     registration:"剔除",
          //     code:"460108",
          //     checkStatus:"待处理"
          //   },
          // ],
          totalrows: 0,
        },
      },
    };
  },
  computed: {
    fuSelect3() {
      return this.$store.state.reqData["fu-select-3"] || [];
    },
    //表格数据
    fuTableData() {
      return this.$store.state.reqData["table-id-4"] || []; //真正的接口
    },
    tableReq() {
      return {
        url: "",
        params: [
          {
            vtype: "attr",
            name: "checkStatus",
            data: this.formQuery.status,
          },
          {
            vtype: "attr",
            name: "checkTimeTop",
            data: this.formQuery.data ? this.formQuery.data[1] : "",
          },
          {
            vtype: "attr",
            name: "checkTimeBottle",
            data: this.formQuery.data ? this.formQuery.data[0] : "",
          },
          {
            vtype: "attr",
            name: "socialCreditCode",
            data: this.formQuery.liableCode,
          },
          {
            vtype: "attr",
            name: "organizationCode",
            data: this.formQuery.institutionCode,
          },
          {
            vtype: "attr",
            name: "enterpriseName",
            data: this.formQuery.detailedName,
          },
          {
            vtype: "pagination",
            name: "pagerows",
            data: this.table.data.pagerows,
          },
          {
            vtype: "pagination",
            name: "totalrows",
            data: 0,
          },
          {
            vtype: "pagination",
            name: "page",
            data: this.table.data.page,
          },
        ],
      };
    },
  },
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {
    console.log(this.form);
  },
  beforeDestroy() {},
  destroyed() {},
  methods: {
    /**导出按钮 */
    exportTable() {
      exportData(
        "/api/directories/v1/directories/dataCompare/verifyExport.do",
        [
          {
            name: "parameter",
            vtype: "formpanel",
            data: {
              checkStatus: this.formQuery.status,
              checkTimeTop: this.formQuery.data ? this.formQuery.data[0] : "",
              checkTimeBottle: this.formQuery.data
                ? this.formQuery.data[1]
                : "",
              organizationCode: this.formQuery.institutionCode,
              enterpriseName: this.formQuery.detailedName,
              socialCreditCode: this.formQuery.liableCode,
            },
          },
        ]
      );
    },

    /**表格转码 */
    tableChangeCode(data, arr) {
      if (data) {
        let filArr = arr.filter((item) => item.value === data.trim());
        return filArr.length === 1 ? filArr[0].text : data;
      }
    },

    queryTable() {
      this.formQuery = JSON.parse(JSON.stringify(this.form));
    },
    handleCurrentChange(val) {
      this.table.data.page = val;
    },
    //每页多少条
    handleSizeChange(val) {
      this.table.data.pagerows = val;
      console.log(`每页 ${val} 条`);
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  padding: 0 10px;
  .el-select {
    // opacity: 0;
  }
  .header {
    min-width: 1600px;
    width: 100%;
    height: 56px;
    display: flex;
    position: relative;

    .query {
      height: 100%;
      position: absolute;
      top: 10px;
      right: 20px;
    }
  }
  /deep/.el-form {
    .el-form-item {
      .el-input {
        width: 140px;
      }
    }
  }
  // padding: 20px;
  /deep/.el-table {
    min-width: 800px;
  }
}
</style>
