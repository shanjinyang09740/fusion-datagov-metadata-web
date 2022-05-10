<template>
  <div class="page">
    <control-bar :left-config="leftConfig">
      <template slot="right">
        <advanced-query
          :columns="queryColumns"
          :hide-advanced-query="true"
          @search="search"
        ></advanced-query>
      </template>
    </control-bar>
    <common-table
      table-id="MeasureVerificationSetting_table"
      :is-need-paging="true"
      :is-has-selection="true"
      :fu-column="column"
      :static-table-data="tableData"
      operation-width="300px"
      @select="select"
      @select-all="select"
    >
      <template slot-scope="rowData" slot="one">
        <i class="iconfont" @click="detailRow(rowData)">查看</i>
        <i class="iconfont" @click="editRow(rowData)">编辑</i>
        <i class="iconfont" @click="deleteRow(rowData)">删除</i>
      </template>
    </common-table>
    <common-dialog
      title=""
      :is-show-dialog="isShowDialog"
      @on-result-change="changeIsShowDialog"
      @cancel="detailCancel"
      @confirm="detailConfirm"
      width="600px"
    >
      <template slot="body">
        <fu-form
          class="add-form"
          ref="addForm"
          :rules="addFormRules"
          :fu-data="addForm"
        >
          <template v-for="formI in addFormPage">
            <fu-form-item
              class="add-form-item"
              v-if="formI.type !== 'textarea'"
              :label="formI.label"
              label-width="130px"
              :key="formI.model"
              :prop="formI.model"
            >
              <fu-select
                v-if="formI.type === 'select'"
                :placeholder="'请选择' + formI.label"
                clearable
                v-model="addForm[formI.model]"
                :fu-request="formI.req"
                :fu-id="formI.model"
                size="medium"
                style="width: 100%"
                :disabled="dialogDisabled"
                :multiple="formI.multiple"
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
                v-else-if="formI.type === 'input'"
                size="medium"
                v-model="addForm[formI.model]"
                style="width: 100%"
                :placeholder="'请输入' + formI.label"
                :disabled="dialogDisabled"
              ></fu-input>
              <fu-input
                v-else-if="formI.type === 'num'"
                size="medium"
                type="number"
                class="input-number"
                v-model="addForm[formI.model]"
                style="width: 100%"
                :placeholder="'请输入' + formI.label"
                :disabled="dialogDisabled"
              ></fu-input>

              <span v-else>
                {{ addForm[formI.model] }}
              </span>
            </fu-form-item>
            <fu-form-item
              v-if="formI.type === 'textarea'"
              :label="formI.label"
              label-width="130px"
              :key="formI.model"
              :prop="formI.model"
            >
              <fu-input
                style="width: 100%"
                :autosize="{ minRows: 4, maxRows: 10 }"
                size="medium"
                type="textarea"
                placeholder="请输入内容"
                v-model="addForm[formI.model]"
                :disabled="dialogDisabled"
              ></fu-input>
            </fu-form-item>
          </template>
        </fu-form>
      </template>
    </common-dialog>
  </div>
</template>
<script>
import AdvancedQuery from "@/components/AdvancedQuery"
import CommonDialog from "@/components/CommonDialog"
import CommonTable from "@/components/CommonTable"
import ControlBar from "@/components/ControlBar"

import {
  Input as FuInput,
  Select as FuSelect,
  Form as FuForm,
  FormItem as FuFormItem,
  Option as FuOption,
} from "fusion-ui"

import { fakeDeepClone } from "@/utils/tool"

const EmptyTable = [
  {
    cnName: "",
    enName: "",
    alias: "",
    atype: "",
    lianggang: "",
    unit: "",
    desc: "",
    time: "",
  },
]

export default {
  name: "TimeFrame",
  components: {
    AdvancedQuery,
    CommonDialog,
    CommonTable,
    ControlBar,
    FuInput,
    FuSelect,
    FuForm,
    FuFormItem,
    FuOption,
  },
  data() {
    return {
      type: "",
      column: [
        {
          label: "中文名称",
          prop: "cnName",
          width: "200",
          headerAlign: "center",
          align: "center",
        },
        {
          label: "英文名称",
          prop: "enName",
          width: "200",
          headerAlign: "center",
          align: "center",
        },
        {
          label: "别称",
          prop: "alias",
          width: "200",
          headerAlign: "center",
          align: "center",
        },
        {
          label: "汇总类型",
          prop: "atype",
          width: "150",
          headerAlign: "center",
          align: "center",
          // reqUrl: "/api/oa/userManage/userInfoList.do",
        },
        {
          label: "计量单位量纲",
          prop: "lianggang",
          width: "250",
          headerAlign: "center",
          align: "center",
          // reqUrl: "/api/oa/userManage/userInfoList.do",
        },
        {
          label: "计量单位",
          prop: "unit",
          width: "150",
          headerAlign: "center",
          align: "center",
          // reqUrl: "/api/oa/userManage/userInfoList.do",
        },
        {
          label: "解释",
          prop: "desc",
          width: "200",
          headerAlign: "center",
          align: "center",
        },
        {
          label: "创建时间",
          prop: "time",
          width: "200",
          headerAlign: "center",
          align: "center",
        },
      ],
      tableData: {
        rows: [],
      },
      // 页面控制条
      leftConfig: [
        {
          label: "新增",
          type: "primary",
          handler: () => {
            // TODO. 调接口新增一行+刷新表格
          },
        },
        {
          label: "删除",
          type: "primary",
          handler: () => {
            // TODO. 根据 select 删除选中行
          },
        },
      ],
      queryColumns: [
        {
          label: "中文名称", //表单名称
          placeholder: "中文名称",
          isSearchShow: true,
          labelWidth: "110px", //名称宽度值,默认68px
          modelDataKey: "cnName", //双向绑定数据
          defaultValue: "", //默认值
          type: "input",
        },
        {
          label: "英文名称",
          placeholder: "英文名称",
          isSearchShow: true,
          modelDataKey: "enName",
          labelWidth: "110px", //名称宽度值,默认68px
          defaultValue: "",
          type: "input",
        },
      ],
      // 是否展示细节表格
      isShowDialog: true,
      addFormPage: [
        {
          label: "中文名称",
          type: "input",
          model: "cnName",
        },
        {
          label: "英文名称",
          type: "input",
          model: "enName",
        },
        {
          label: "别称",
          type: "input",
          model: "alias",
        },
        {
          label: "汇总类型",
          type: "select",
          options: [],
          model: "atype",
          multiple: true,
          req: {
            url: "/api/core/v1/dictionary/queryData.do?dicId=HYSLX",
            params: [],
          },
        },
        {
          label: "计量单位量纲",
          type: "select",
          options: [],
          model: "linaggang",
          req: {
            url: "/api/core/v1/dictionary/queryData.do?dicId=HYSZT",
            params: [],
          },
        },
        {
          label: "计量单位",
          type: "select",
          options: [],
          model: "unit",
          req: {
            url: "/api/core/v1/dictionary/queryData.do?dicId=HYSZT",
            params: [],
          },
        },
        {
          label: "解释",
          type: "textarea",
          options: [],
          model: "desc",
        },
      ],
      //表单验证规则
      addFormRules: {
        cnName: [
          { required: true, message: "请输入中文名称", trigger: "blur" },
        ],
        enName: [
          { required: true, message: "请输入英文名称", trigger: "blur" },
        ],
      },
      // 弹窗内输入是否可用
      dialogDisabled: true,
      // 当前表单
      addForm: {
        cnName: "",
        enName: "",
        alias: "",
        atype: "",
        lianggang: "",
        unit: "",
        desc: "",
      },
    }
  },
  created() {
    // 根据data中的xx值更新查询detail的数据
    this.tableData.rows = fakeDeepClone(EmptyTable)
    // 从url上获得宏观还是微观
    this.type = new URLSearchParams(location.search).get("type")
  },
  methods: {
    search(filter) {
      console.log("filter", filter)
      // TODO. 对表格筛选
    },
    /**
     * @description 编辑主表的行
     * @param {Object<Row>} data 行数据
     */
    editRow(data) {
      this.dialogDisabled = false
      this.isShowDialog = true
      console.log("detailRow", data)
    },
    /**
     * @description 查看主表的行
     * @param {Object<Row>} data 行数据
     */
    detailRow(data) {
      this.dialogDisabled = true
      this.isShowDialog = true
      console.log("detailRow", data)
    },
    /**
     * @description 删除主表的行
     * @param {Object<Row>} data 行数据
     */
    deleteRow(data) {
      console.log("deleteRow", data)
    },
    /**
     * @description 主表选中
     * @param {Array<Row>} selection 选中行的数组
     */
    select(selection) {
      console.log("select", selection)
      // TODO. 遍历 selection 获得 主表选中列的唯一id
    },
    /**
     * @description detail表弹窗关闭
     */
    detailCancel() {
      this.isShowDialog = false
    },
    /**
     * @description detail表弹窗确认
     */
    detailConfirm() {
      this.isShowDialog = false
    },
    /**
     * @description 切换弹窗显示状态
     * @param {Boolean} val
     */
    changeIsShowDialog(val) {
      this.isShowDialog = val
    },
    codeListOption(id) {
      return function (id) {
        return this.$store.state.reqData[id] || []
      }
    },
  },
}
</script>
<style lang="less">
.page {
  margin: 0 10px;

  .iconfont {
    font-size: 16px !important;
  }
}
</style>
