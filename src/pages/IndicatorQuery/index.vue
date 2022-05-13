<template>
  <div id="projectContainer" class="basic-page-container">
    <div class="left-area">
      <variable-tree
        ref="variableTree"
        @treeNodeClick="treeNodeClick"
      ></variable-tree>
    </div>
    <div class="right-area">
      <div class="search-area">
        <fu-form class="search-form" ref="searchForm" :fu-data="searchForm">
          <template v-for="formI in searchFormColumn">
            <fu-form-item
              class="search-form-item"
              :label="formI.label"
              :key="formI.model"
              :prop="formI.model"
              size="medium"
            >
              <fu-select
                class="search-inner"
                v-if="formI.type === 'select'"
                :placeholder="'请选择' + formI.label"
                v-model="searchForm[formI.model]"
                :fu-request="formI.req"
                :fu-id="formI.model"
                clearable
              >
                <fu-option
                  v-for="item in codeListOption(formI.model)"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value"
                >
                </fu-option>
              </fu-select>
              <fu-input
                v-else
                class="search-inner"
                v-model="searchForm[formI.model]"
                :placeholder="'请输入' + formI.label"
                clearable
              ></fu-input
            ></fu-form-item>
          </template>
          <fu-form-item class="search-form-button">
            <fu-button
              type="primary"
              size="medium"
              title="查询"
              class="form-button"
              @click="handleClickSearch"
              >查询</fu-button
            >
            <fu-button
              type="success"
              size="medium"
              class="form-button"
              title="重置"
              @click="handleClickReset"
              >重置</fu-button
            >
          </fu-form-item>
        </fu-form>
      </div>
      <div>
        <common-table
          v-if="this.changeTable === false"
          :fuColumn="indicatorQueryBeforeTable.column"
          :reqUrl="indicatorQueryBeforeReqUrl"
          :reqParams="indicatorQueryBeforeReqParams"
          ref="indicatorQueryBefore"
          :tableId="'indicatorQueryBeforeId'"
        >
          <template slot-scope="myscope" slot="one">
            <fu-button type="text" @click="handleClickCheck(myscope.data)">
              查看详情
            </fu-button>
          </template>
        </common-table>
      </div>
      <div>
        <common-table
          v-if="this.changeTable === true"
          :fuColumn="indicatorQueryAftereTable.column"
          :reqUrl="indicatorQueryAftereReqUrl"
          :reqParams="indicatorQueryAftereReqParams"
          ref="indicatorQueryAftere"
          :tableId="'indicatorQueryAftereId'"
        >
          <template slot-scope="myscope" slot="one">
            <fu-button type="text" @click="handleClickCheck(myscope.data)">
              查看详情
            </fu-button>
          </template>
        </common-table>
      </div>
    </div>
    <indicator-detail
      :dialogVisible="detailDialogVisible"
      @closeDialog="closeDialog"
      :type="dialogType"
    ></indicator-detail>
  </div>
</template>

<script>
import { Button, Form, FormItem, Select, Input } from "fusion-ui";
import CommonTable from "@/components/CommonTable";
// import ControlBar from "@/components/ControlBar";
// import AdvancedQuery from "@/components/AdvancedQuery";
import VariableTree from "./components/VariableTree";
import IndicatorDetail from "@/pages/IndicatorDetail";
import http from "@/utils/http";

// import {
//   getConference,
//   deleteConferenceRoom,
//   queryDataByType,
// } from "@/utils/service";
export default {
  name: "indicatorQuery",
  components: {
    FuButton: Button,
    FuForm: Form,
    FuFormItem: FormItem,
    FuSelect: Select,
    FuInput: Input,
    CommonTable,
    // ControlBar,
    // AdvancedQuery,
    VariableTree,
    IndicatorDetail,
  },
  props: {},
  data() {
    return {
      //查看弹窗
      currentInformatiion: {},
      detailDialogVisible: false,
      dialogType: "",
      //查询
      changeTable: false,
      submitQueryForm: {},
      searchForm: {
        projectName: "",
        zhibiaolx: "",
        zhibiaozt: "",
        banben: "",
      },
      searchFormColumn: [
        {
          label: "名称/编码",
          type: "input",
          options: [],
          model: "statIndctNameCh",
        },
        {
          label: "指标类型",
          type: "select",
          options: [],
          model: "statIndctType2",
          req: {
            url: "",
            params: [],
          },
        },
        {
          label: "指标状态",
          type: "select",
          options: [],
          model: "statIndctStatus",
          req: {
            url: "",
            params: [],
          },
        },
        {
          label: "版本",
          type: "select",
          options: [],
          model: "statIndctVersion",
          req: {
            url: "",
            params: [],
          },
        },
      ],
      //查询前表格
      indicatorQueryBeforeReqUrl: "",
      indicatorQueryBeforeTable: {
        column: [
          {
            label: "名称",
            prop: "statIndctNameCh",
          },
          {
            label: "编码",
            prop: "statIndctCode",
          },
          {
            label: "别名",
            prop: "statIndctNicknameCh",
          },

          {
            label: "版本",
            prop: "statIndctVersion",
          },
          {
            label: "汇总类型",
            prop: "statIndctAggregateType",
          },
          {
            label: "量纲",
            prop: "statIndctUmDimension",
          },
          {
            label: "计量单位",
            prop: "statIndctUm",
          },
          {
            label: "指标类型",
            prop: "statIndctType2",
          },
          {
            label: "计算方法",
            prop: "statIndctAlgorithm",
          },
          {
            label: "数据类型",
            prop: "statIndctDataType",
          },
          {
            label: "指标状态",
            prop: "statIndctStatus",
          },
        ],
      },
      //查询后表格
      indicatorQueryAftereReqUrl: "",
      indicatorQueryAftereTable: {
        column: [
          {
            label: "名称",
            prop: "statIndctNameCh",
          },
          {
            label: "编码",
            prop: "statIndctCode",
          },
          {
            label: "别名",
            prop: "statIndctNicknameCh",
          },

          {
            label: "版本",
            prop: "statIndctVersion",
          },
          {
            label: "汇总类型",
            prop: "statIndctAggregateType",
          },
          {
            label: "量纲",
            prop: "statIndctUmDimension",
          },
          {
            label: "计量单位",
            prop: "statIndctUm",
          },
          {
            label: "指标类型",
            prop: "statIndctType2",
          },
          {
            label: "计算方法",
            prop: "statIndctAlgorithm",
          },
          {
            label: "数据类型",
            prop: "statIndctDataType",
          },
          {
            label: "指标状态",
            prop: "statIndctStatus",
          },
          {
            label: "所在文件夹",
            prop: "statIndctThemeName",
          },
        ],
      },
    };
  },
  computed: {
    codeListOption() {
      return function (id) {
        return this.$store.state.reqData[id] || [];
      };
    },
    indicatorQueryBeforeReqParams() {
      return [
        //     {
        //       vtype: "attr",
        //       name: "type",
        //       data: this.submitSearchForm
        //     },
      ];
    },
    indicatorQueryAftereReqParams() {
      return [
        //     {
        //       vtype: "attr",
        //       name: "type",
        //       data: this.submitSearchForm,
        //     },
      ];
    },
  },
  watch: {},
  beforeCreate() {},
  created() {
    // this.getMeetingRoomType();
  },
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    /**
     * @description 表单查询
     */
    handleClickSearch() {
      this.submitSearchForm = JSON.parse(JSON.stringify(this.searchForm));
      this.changeTable = true;
    },

    /**
     * @description 重置
     */
    handleClickReset() {
      this.$set(this, "searchForm", {});
      this.changeTable = false;
    },
    /**
     * @description 查看详情
     */
    handleClickCheck() {
      this.dialogType = "check";
      this.detailDialogVisible = true;
    },
    /**
     * @description 关闭详情页
     */
    closeDialog() {
      this.detailDialogVisible = false;
    },
    /**
     * @description 树节点点击事件触发回调
     * @param {Object} data
     */
    treeNodeClick(node) {
      console.log("节点点击事件回来了", node);
      this.selectTreeNode = node;
      //刷新表格数据
      this.afrashTableData();
    },
    //刷新表格数据
    afrashTableData() {
      // let postData = {
      //   data: [
      //     {
      //       name: "indct",
      //       vtype: "json",
      //       data: {
      //         partitionCode: this.selectedProjectItem.value,
      //         statIndctFolderId: this.selectTreeNode.statIndctFolderId,
      //         statIndctType2: this.formData.selectVariableTypeValue,
      //         statIndctStatus: this.formData.selectVariableStatusValue,
      //         statIndctLabel: this.formData.statIndctLabel,
      //       },
      //     },
      //   ],
      // };
      //TODO begin---测试数据待删除
      let postData = {
        data: [
          {
            name: "indct",
            vtype: "json",
            data: {
              partitionCode: "1",
              statIndctFolderId: "1",
              statIndctType2: "",
              statIndctStatus: "",
              statIndctLabel: "1",
            },
          },
        ],
      };
      //TODO end---测试数据待删除

      http
        .post("/api/meta/v1/indct/queryIndctlist.do", {
          postData: JSON.stringify(postData),
        })
        .then((res) => {
          let result = res.data[0].data.rows;
          this.postTableData.rows = result;
        });
    },
  },
};
</script>

<style lang="less" scoped>
.basic-page-container {
  padding: 0 10px;
  height: 100%;
  display: flex;
  justify-content: space-between;
  .left-area {
    width: 300px;
    border-right: 1px solid #cecece;
  }
  .right-area {
    width: calc(100% - 310px);
    .search-area {
      margin-top: 20px;
      .search-form {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        .search-form-item {
          flex: 1;
          margin-right: 10px;
        }
        .search-form-button {
          width: 210px;
          text-align: right;
        }
        .search-inner {
          width: 180px;
        }
      }
    }
  }
}
</style>
