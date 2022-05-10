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
      operation-width="300px"
      @select="select"
      @select-all="select"
    >
      <template slot-scope="rowData" slot="one">
        <i
          class="iconfont icon-peizhi"
          title="明细"
          @click="detailRow(rowData)"
        ></i>
        <i
          class="iconfont iconbiaoge_shanchu"
          title="删除"
          @click="deleteRow(rowData)"
        ></i>
      </template>
    </common-table>
    <common-dialog
      title="阈值范围设置"
      :is-show-dialog="isShowDialog"
      @on-result-change="changeIsShowDialog"
      @cancel="detailCancel"
      @confirm="detailConfirm"
    >
      <template slot="body">
        <control-bar :left-config="detailLeftConfig"> </control-bar>
        <common-table
          table-id="MeasureVerificationSetting_detail_table"
          ref="detail_table"
          :is-has-selection="true"
          :is-need-operation="false"
          :is-need-paging="false"
          :fu-column="detailColumn"
          :static-table-data="detailTableData"
          maxHeight="400px"
          @select="detailSelect"
          @select-all="detailSelect"
        >
          <template slot-scope="{ value, columnName, rowIndex }" slot="range">
            <fu-input
              v-model="value"
              @input="updateDetail(rowIndex, columnName, value)"
            />
          </template>
        </common-table>
      </template>
    </common-dialog>
  </div>
</template>
<script>
import AdvancedQuery from "@/components/AdvancedQuery"
import CommonDialog from "@/components/CommonDialog"
import CommonTable from "@/components/CommonTable"
import ControlBar from "@/components/ControlBar"

import { Input as FuInput, Select as FuSelect } from "fusion-ui"

import { fakeDeepClone } from "@/utils/tool"

const EmptyDetailTable = [{ operator: "", range: "", color: "" }]

export default {
  name: "MeasureVerificationSetting",
  components: {
    AdvancedQuery,
    CommonDialog,
    CommonTable,
    ControlBar,
    FuInput,
    FuSelect,
  },
  data() {
    return {
      column: [
        {
          label: "主题",
          prop: "pName",
          width: "600",
          headerAlign: "center",
          align: "center",
        },
        {
          label: "指标",
          prop: "pYear",
          width: "300",
          headerAlign: "center",
          align: "center",
        },

        {
          label: "指标code",
          prop: "applicationUserId",
          width: "300",
          headerAlign: "center",
          align: "center",
        },
      ],
      detailColumn: [
        {
          label: "判断逻辑",
          prop: "operator",
          width: "120",
          // reqUrl: "/api/oa/userManage/userInfoList.do",
          headerAlign: "center",
          align: "center",
        },
        {
          label: "阈值范围",
          prop: "range",
          width: "120",
          headerAlign: "center",
          align: "center",
          slot: "range",
        },
        {
          label: "提示颜色",
          prop: "color",
          width: "120",
          // reqUrl: "/api/oa/userManage/userInfoList.do",
          headerAlign: "center",
          align: "center",
        },
      ],
      detailTableData: {
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
      // 细节控制条
      detailLeftConfig: [
        {
          label: "新增",
          type: "primary",
          handler: () => {
            this.detailTableData.rows.push(fakeDeepClone(EmptyDetailTable)[0])
          },
        },
        {
          label: "删除",
          type: "primary",
          handler: () => {
            // TODO. 根据 detailSelect 删除选中行
          },
        },
      ],
      queryColumns: [
        {
          label: "主题", //表单名称
          placeholder: "请选择年度",
          isSearchShow: true,
          type: "select", // select/input两种类型，不传默认input类型
          labelWidth: "110px", //名称宽度值,默认68px
          modelDataKey: "projectYear", //双向绑定数据
          defaultValue: "", //默认值
          selectrequest: {
            //只有select需要传
            url: "/api/core/v1/dictionary/queryData.do?dicId=pStatus",
            params: [],
          },
        },
        {
          label: "指标",
          placeholder: "指标名称",
          isSearchShow: true,
          labelWidth: "110px", //名称宽度值,默认68px
          modelDataKey: "projectName",
          type: "input",
          defaultValue: "",
        },
      ],
      // 是否展示细节表格
      isShowDialog: false,
    }
  },
  methods: {
    search(filter) {
      console.log("filter", filter)
      // TODO. 对表格筛选
    },
    /**
     * @description 查看主表的行
     */
    detailRow(data) {
      this.isShowDialog = true
      // 根据data中的xx值更新查询detail的数据
      this.detailTableData = fakeDeepClone(EmptyDetailTable)
      console.log("detailRow", data)
    },
    /**
     * @description 删除主表的行
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
     * @description 更新临时detail表格的数据
     * @param {Int} rowIndex 行号
     * @param {String} columnName 列名
     * @param {String} value 值
     */
    updateDetail(rowIndex, columnName, value) {
      // TODO. 如果列的值有格式要求则此处应该对value进行强制类型装换，或者在编辑的插件上设置
      this.detailTableData.rows[rowIndex][columnName] = value
    },
    /**
     * @description detail表选中
     * @param {Array<Row>} selection 选中行的数组
     */
    detailSelect(selection) {
      console.log("detailSelect", selection)
      // TODO. 遍历 selection 获得 细节表选中列的唯一id
    },
    /**
     * @description detail表弹窗关闭
     */
    detailCancel() {
      this.isShowDialog = false
      console.log("detailCancel")
    },
    /**
     * @description detail表弹窗确认
     */
    detailConfirm() {
      this.isShowDialog = false
      // TODO. 调用@砻德的接口将 detailTableData 传过去
      console.log("detailConfirm", this.detailTableData)
    },
    /**
     * @description 切换弹窗显示状态
     * @param {Boolean} val
     */
    changeIsShowDialog(val) {
      this.isShowDialog = val
    },
  },
}
</script>
<style lang="less">
.page {
  margin: 0 10px;
}
</style>
