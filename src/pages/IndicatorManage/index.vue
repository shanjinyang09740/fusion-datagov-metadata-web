<template>
  <div class="content">
    <div class="operateLan">
      <div class="fenqu" v-if="selectProjectOption.length > 1">
        <span class="label">分区</span>
        <fu-select
          v-model="selectProjectValue"
          @change="changeSelectProject"
          clearable
          placeholder="请选择"
        >
          <fu-option
            v-for="item in selectProjectOption"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          >
          </fu-option>
        </fu-select>
      </div>
      <div class="groupBtns">
        <fu-button type="primary" size="medium" @click="importVariable"
          >导入指标</fu-button
        >
        <fu-button type="primary" size="medium" @click="exportVariable"
          >导出指标</fu-button
        >
        <fu-button type="primary" size="medium" @click="exportModel"
          >模板下载</fu-button
        >
      </div>
    </div>
    <div class="main">
      <div class="leftArea">
        <variable-tree
          ref="variableTree"
          @treeNodeClick="treeNodeClick"
          :selectedProjectItem="selectedProjectItem"
          :selectProjectValue="selectProjectValue"
        ></variable-tree>
      </div>
      <div class="rightArea">
        <div class="operateLan">
          <div class="groupBtns">
            <fu-button type="primary" size="mini" @click="createVariable"
              >新建指标</fu-button
            > 
            <fu-button type="primary" size="mini" @click="moveVariable"
              >移动</fu-button
            >
            <fu-button type="primary" size="mini" @click="batchDeleteRows"
              >删除</fu-button
            >
          </div>
          <fu-form :inline="true" class="form">
            <fu-form-item label="指标名称/编码">
              <fu-input
                size="medium"
                v-model="formData.statIndctLabel"
                placeholder="请输入"
                clearable
              ></fu-input>
            </fu-form-item>
            <fu-form-item label="指标类型">
              <fu-select
                v-model="formData.selectVariableTypeValue"
                clearable
                placeholder="请选择"
              >
                <fu-option
                  v-for="item in selectVariableTypeOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </fu-option>
              </fu-select>
            </fu-form-item>
            <fu-form-item label="指标状态">
              <fu-select
                v-model="formData.selectVariableStatusValue"
                clearable
                placeholder="请选择"
              >
                <fu-option
                  v-for="item in selectVariableStatusOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </fu-option>
              </fu-select>
            </fu-form-item>
            <fu-form-item>
              <fu-button
                size="mini"
                type="primary"
                clearable
                @click="onSubmitQuery"
                >查询</fu-button
              >
            </fu-form-item>
          </fu-form>
        </div>
        <main-table
          @upDateTableData="upDateTableData"
          :postTableData="postTableData"
          :tableOperateBtnGroup="tableOperateBtnGroup"
          :tableCompType="tableCompType"
          :rowKey="rowKey"
          :isEdit="true"
          ref="MainTable"
        ></main-table>
      </div>
    </div>
    <custom-dialog
      v-if="isShowDialog"
      :isShowDialog="isShowDialog"
      :title="dialogTitle"
      :width="'50%'"
      @on-result-change="changeIsShowDialog"
      @child-operation="operation"
    >
      <div slot="body">
        <component
          :selectTreeNode="selectTreeNode"
          ref="dialogForm"
          :is="dialogComp"
        ></component>
      </div>
    </custom-dialog>
  </div>
</template>
<script>
import {
  Button,
  Input,
  Form,
  FormItem,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Select,
  Option,
  Message,
} from "fusion-ui";
import variableTree from "./components/variableTree";
import MainTable from "@/components/ComponentGroupTable";
import CustomDialog from "@/components/CommonDialog";
import AddVariable from "./components/AddVariable";
import http from "@/utils/http";
export default {
  name: "variableManage",
  props: {},
  data() {
    return {
      //表单数据
      formData: {},
      //是否显示弹窗组件
      isShowDialog: false,
      //弹窗内容组件
      dialogComp: "",
      dialogTitle: "",
      //变量弹窗
      isShowDynamicFormDialog: false,
      formItems: [
        {
          label: "名称",
          controlType: "text",
          controlJson: "",
          code: "vcode",
          datType: "String",
          displayHide: "1",
          length: "20",
          sort: "sort",
        },
      ],
      //分区数据下拉菜单
      selectProjectOption: [],
      selectedProjectItem: {},
      selectProjectValue: "",
      //指标类型下拉菜单
      selectVariableTypeOption: [
        {
          label: "衍生",
          value: "0",
        },
        {
          label: "非衍生",
          value: "1",
        },
      ],
      //指标状态下拉菜单
      selectVariableStatusOption: [
        {
          label: "启用",
          value: "0",
        },
        {
          label: "停用",
          value: "1",
        },
      ],
      //当前选中的指标树节点
      selectTreeNode: {},
      //当前选中的表格数据
      selectTableData: [],
      //表格行key
      rowKey: "statIndctId",
      //表格组件类别
      tableCompType: "indicator",
      //表格操作列显示按钮类型
      tableOperateBtnGroup: [
        {
          label: "编辑",
          value: "editRow",
          icon: "iconbiaoge_bianji",
          imgPath: ""
        },
        {
          label: "删除",
          value: "deleteRow",
          icon: "iconbiaoge_shanchu",
          imgPath: ""
        },
        {
          label: "添加",
          value: "addRow",
          icon: "iconqita_tianjia",
          imgPath: ""
        },
        {
          label: "复制",
          value: "copyRow",
          icon: "iconqita_yingshe",
          imgPath: ""
        },
        {
          label: "创建新版本",
          value: "createVersion",
          icon: "iconqita_zidingyi",
          imgPath: ""
        },
        {
          label: "查看血缘",
          value: "viewBloodItem",
          icon: "iconbiaoge_xieyuanguanxi",
          imgPath: ""
        },
      ],
      //表格数据
      postTableData: {
        column: [
          {
            label: "指标名称",
            prop: "statIndctNameCh",
            width: "150",
            isInput: true,
            //是否缩进
            isIndent: true
          },
          {
            label: "层级",
            prop: "level",
            width: "50",
            isInput: true,
          },
          {
            label: "顺序号",
            prop: "sortNum",
            width: "50",
          },
          {
            label: "指标编码",
            prop: "statIndctCode",
            width: "80",
            isInput: true,
          },

          {
            label: "指标别名",
            prop: "statIndctNicknameCh",
            width: "150",
            reqUrl: "",
            isInput: true,
          },
          {
            label: "量纲",
            prop: "statIndctUmDimensionLabel",
            width: "100",
            reqUrl: "",
            isInput: true,
          },
          {
            label: "计量单位",
            prop: "statIndctUmLabel",
            width: "100",
            isInput: true,
          },
          {
            label: "指标类型",
            prop: "statIndctType2",
            width: "100",
            reqUrl: "",
            isInput: true,
          },
          {
            label: "版本",
            prop: "statIndctVersion",
            width: "100",
            isInput: true,
          },
        ],
        rows: [
          {
            aggregateType: "",
            level: 1,
            partitionCode: "1",
            partitionName: "1",
            sortNum: 1,
            statIndctAlgorithm: "",
            statIndctCode: "DCTEGFA87",
            statIndctCreatDate: "",
            statIndctDataLength: 1,
            statIndctDataPrecison: 1,
            statIndctDataRangeMax: "",
            statIndctDataRangeMin: "",
            statIndctDataStyle: "",
            statIndctDataType: "",
            statIndctDesc: "update",
            statIndctFolderId: "1",
            statIndctId: "1522736981985333248",
            statIndctNameCh: "指标名称测试",
            statIndctNicknameCh: "",
            statIndctPurpose: "",
            statIndctSource: "",
            statIndctStartDate: "",
            statIndctStatus: "",
            statIndctStopDate: "",
            statIndctType2: "",
            statIndctUmDimensionId: "1",
            statIndctUmDimensionLabel: "",
            statIndctUmId: "1",
            statIndctUmLabel: "",
            statIndctUpdateDate: "",
            statIndctVersion: "1",
            statIndctVersionDesc: "xxx",
          },
          {
            aggregateType: "",
            level: 2,
            partitionCode: "1",
            partitionName: "1",
            sortNum: 2,
            statIndctAlgorithm: "",
            statIndctCode: "1",
            statIndctCreatDate: "",
            statIndctDataLength: 1,
            statIndctDataPrecison: 1,
            statIndctDataRangeMax: "",
            statIndctDataRangeMin: "",
            statIndctDataStyle: "",
            statIndctDataType: "",
            statIndctDesc: "update",
            statIndctFolderId: "1",
            statIndctId: "1",
            statIndctNameCh: "指标名称测试",
            statIndctNicknameCh: "1",
            statIndctPurpose: "",
            statIndctSource: "",
            statIndctStartDate: "",
            statIndctStatus: "",
            statIndctStopDate: "",
            statIndctType2: "",
            statIndctUmDimensionId: "1",
            statIndctUmDimensionLabel: "",
            statIndctUmId: "1",
            statIndctUmLabel: "",
            statIndctUpdateDate: "",
            statIndctVersion: "1",
            statIndctVersionDesc: "xxx",
          },
          {
            aggregateType: "",
            level: 3,
            partitionCode: "1",
            partitionName: "1",
            sortNum: 3,
            statIndctAlgorithm: "",
            statIndctCode: "DCTX0ZPEX",
            statIndctCreatDate: "",
            statIndctDataLength: 1,
            statIndctDataPrecison: 1,
            statIndctDataRangeMax: "",
            statIndctDataRangeMin: "",
            statIndctDataStyle: "",
            statIndctDataType: "",
            statIndctDesc: "update",
            statIndctFolderId: "1",
            statIndctId: "1522551541252624384",
            statIndctNameCh: "指标名称测试",
            statIndctNicknameCh: "1",
            statIndctPurpose: "",
            statIndctSource: "",
            statIndctStartDate: "",
            statIndctStatus: "",
            statIndctStopDate: "",
            statIndctType2: "",
            statIndctUmDimensionId: "1",
            statIndctUmDimensionLabel: "",
            statIndctUmId: "1",
            statIndctUmLabel: "",
            statIndctUpdateDate: "",
            statIndctVersion: "1",
            statIndctVersionDesc: "xxx",
          },
          {
            aggregateType: "",
            level: 2,
            partitionCode: "1",
            partitionName: "1",
            sortNum: 4,
            statIndctAlgorithm: "",
            statIndctCode: "DCTJG5W3C",
            statIndctCreatDate: "",
            statIndctDataLength: 1,
            statIndctDataPrecison: 1,
            statIndctDataRangeMax: "",
            statIndctDataRangeMin: "",
            statIndctDataStyle: "",
            statIndctDataType: "",
            statIndctDesc: "update",
            statIndctFolderId: "1",
            statIndctId: "1522736995784593408",
            statIndctNameCh: "1222",
            statIndctNicknameCh: "1",
            statIndctPurpose: "",
            statIndctSource: "",
            statIndctStartDate: "",
            statIndctStatus: "",
            statIndctStopDate: "",
            statIndctType2: "",
            statIndctUmDimensionId: "1",
            statIndctUmDimensionLabel: "",
            statIndctUmId: "1",
            statIndctUmLabel: "",
            statIndctUpdateDate: "",
            statIndctVersion: "1",
            statIndctVersionDesc: "xxx",
          },
          {
            aggregateType: "",
            level: 1,
            partitionCode: "1",
            partitionName: "1",
            sortNum: 5,
            statIndctAlgorithm: "",
            statIndctCode: "DCTOZM78W",
            statIndctCreatDate: "",
            statIndctDataLength: 1,
            statIndctDataPrecison: 1,
            statIndctDataRangeMax: "",
            statIndctDataRangeMin: "",
            statIndctDataStyle: "",
            statIndctDataType: "",
            statIndctDesc: "update",
            statIndctFolderId: "1",
            statIndctId: "1522737731754921984",
            statIndctNameCh: "2",
            statIndctNicknameCh: "1",
            statIndctPurpose: "",
            statIndctSource: "",
            statIndctStartDate: "",
            statIndctStatus: "",
            statIndctStopDate: "",
            statIndctType2: "",
            statIndctUmDimensionId: "1",
            statIndctUmDimensionLabel: "",
            statIndctUmId: "1",
            statIndctUmLabel: "",
            statIndctUpdateDate: "",
            statIndctVersion: "1",
            statIndctVersionDesc: "xxx",
          },
          {
            aggregateType: "",
            level: 1,
            partitionCode: "1",
            partitionName: "1",
            sortNum: 6,
            statIndctAlgorithm: "",
            statIndctCode: "DCTLIHBBN",
            statIndctCreatDate: "",
            statIndctDataLength: 1,
            statIndctDataPrecison: 1,
            statIndctDataRangeMax: "",
            statIndctDataRangeMin: "",
            statIndctDataStyle: "",
            statIndctDataType: "",
            statIndctDesc: "update",
            statIndctFolderId: "1",
            statIndctId: "1522737003296591872",
            statIndctNameCh: "3",
            statIndctNicknameCh: "1",
            statIndctPurpose: "",
            statIndctSource: "",
            statIndctStartDate: "",
            statIndctStatus: "",
            statIndctStopDate: "",
            statIndctType2: "",
            statIndctUmDimensionId: "1",
            statIndctUmDimensionLabel: "",
            statIndctUmId: "1",
            statIndctUmLabel: "",
            statIndctUpdateDate: "",
            statIndctVersion: "1",
            statIndctVersionDesc: "xxx",
          },
          {
            aggregateType: "",
            level: 2,
            partitionCode: "1",
            partitionName: "1",
            sortNum: 7,
            statIndctAlgorithm: "",
            statIndctCode: "DCTCN1UJ7",
            statIndctCreatDate: "",
            statIndctDataLength: 1,
            statIndctDataPrecison: 1,
            statIndctDataRangeMax: "",
            statIndctDataRangeMin: "",
            statIndctDataStyle: "",
            statIndctDataType: "",
            statIndctDesc: "update",
            statIndctFolderId: "1",
            statIndctId: "1522737593749737472",
            statIndctNameCh: "1222",
            statIndctNicknameCh: "1",
            statIndctPurpose: "",
            statIndctSource: "",
            statIndctStartDate: "",
            statIndctStatus: "",
            statIndctStopDate: "",
            statIndctType2: "",
            statIndctUmDimensionId: "1",
            statIndctUmDimensionLabel: "",
            statIndctUmId: "1",
            statIndctUmLabel: "",
            statIndctUpdateDate: "",
            statIndctVersion: "1",
            statIndctVersionDesc: "xxx",
          },
          {
            aggregateType: "",
            level: 2,
            partitionCode: "1",
            partitionName: "1",
            sortNum: 8,
            statIndctAlgorithm: "",
            statIndctCode: "DCTR7WJAH",
            statIndctCreatDate: "",
            statIndctDataLength: 1,
            statIndctDataPrecison: 1,
            statIndctDataRangeMax: "",
            statIndctDataRangeMin: "",
            statIndctDataStyle: "",
            statIndctDataType: "",
            statIndctDesc: "update",
            statIndctFolderId: "1",
            statIndctId: "1522737607683215360",
            statIndctNameCh: "1222",
            statIndctNicknameCh: "1",
            statIndctPurpose: "",
            statIndctSource: "",
            statIndctStartDate: "",
            statIndctStatus: "",
            statIndctStopDate: "",
            statIndctType2: "",
            statIndctUmDimensionId: "1",
            statIndctUmDimensionLabel: "",
            statIndctUmId: "1",
            statIndctUmLabel: "",
            statIndctUpdateDate: "",
            statIndctVersion: "1",
            statIndctVersionDesc: "xxx",
          },
          {
            aggregateType: "",
            level: 2,
            partitionCode: "1",
            partitionName: "1",
            sortNum: 9,
            statIndctAlgorithm: "",
            statIndctCode: "DCTO3MYBH",
            statIndctCreatDate: "",
            statIndctDataLength: 1,
            statIndctDataPrecison: 1,
            statIndctDataRangeMax: "",
            statIndctDataRangeMin: "",
            statIndctDataStyle: "",
            statIndctDataType: "",
            statIndctDesc: "update",
            statIndctFolderId: "1",
            statIndctId: "1522737612884152320",
            statIndctNameCh: "1222",
            statIndctNicknameCh: "1",
            statIndctPurpose: "",
            statIndctSource: "",
            statIndctStartDate: "",
            statIndctStatus: "",
            statIndctStopDate: "",
            statIndctType2: "",
            statIndctUmDimensionId: "1",
            statIndctUmDimensionLabel: "",
            statIndctUmId: "1",
            statIndctUmLabel: "",
            statIndctUpdateDate: "",
            statIndctVersion: "1",
            statIndctVersionDesc: "xxx",
          },
          {
            aggregateType: "",
            level: 2,
            partitionCode: "1",
            partitionName: "1",
            sortNum: 10,
            statIndctAlgorithm: "",
            statIndctCode: "DCTSLXO4M",
            statIndctCreatDate: "",
            statIndctDataLength: 1,
            statIndctDataPrecison: 1,
            statIndctDataRangeMax: "",
            statIndctDataRangeMin: "",
            statIndctDataStyle: "",
            statIndctDataType: "",
            statIndctDesc: "update",
            statIndctFolderId: "1",
            statIndctId: "1522737958507384832",
            statIndctNameCh: "1222",
            statIndctNicknameCh: "1",
            statIndctPurpose: "",
            statIndctSource: "",
            statIndctStartDate: "",
            statIndctStatus: "",
            statIndctStopDate: "",
            statIndctType2: "",
            statIndctUmDimensionId: "1",
            statIndctUmDimensionLabel: "",
            statIndctUmId: "1",
            statIndctUmLabel: "",
            statIndctUpdateDate: "",
            statIndctVersion: "1",
            statIndctVersionDesc: "xxx",
          },
        ],
      },
    };
  },
  components: {
    FuButton: Button,
    FuInput: Input,
    FuForm: Form,
    FuFormItem: FormItem,
    FuDropdown: Dropdown,
    FuDropdownItem: DropdownItem,
    FuDropdownMenu: DropdownMenu,
    FuSelect: Select,
    FuOption: Option,
    variableTree,
    MainTable,
    CustomDialog,
    AddVariable,
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {
    //初始化数据
    this.initData();
  },
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    /**
     * @description 移动指标
    */
    moveVariable() {

    },
    /**
     * @description 新建指标
    */
    createVariable() {
      this.dialogComp = "AddVariable";
      this.isShowDialog = true;
      this.dialogTitle = "新建指标";
    },
    /**
     * @description 初始化数据
     */
    initData() {
      //获取分区数据
      http.get("/api/meta/v1/partition/queryDropDownBox.do").then((res) => {
        let result = res.data[0].data;
        this.selectProjectOption = result;
        this.selectedProjectItem = result[0];
        this.selectProjectValue = result[0].value;
      });
    },
    /**
     * @description 分区下拉change事件
     * @param {String} val
     */
    changeSelectProject(val) {
      this.selectProjectOption.some((item) => {
        if (item.value == val) {
          this.selectedProjectItem = item;
          return true;
        }
      });
    },
    /**
     * @description 表格修改保存事件
     */
    saveData() {
      //获取当前表格的数据
      let tableData = this.$refs.MainTable.tableData.rows.map((item) => {
        return {
          ...item,
          statIndctCreatDate: item.statIndctCreatDate
            ? item.statIndctCreatDate
            : null,
          statIndctStartDate: item.statIndctStartDate
            ? item.statIndctStartDate
            : null,
          statIndctStopDate: item.statIndctStopDate
            ? item.statIndctStopDate
            : null,
          statIndctUpdateDate: item.statIndctUpdateDate
            ? item.statIndctUpdateDate
            : null,
        };
      });
      let idsArr = tableData.map((item) => {
        return item.statIndctId;
      });

      let postData = {
        data: [
          {
            name: "indcts",
            vtype: "json",
            data: [...tableData],
          },
          {
            name: "ids",
            vtype: "attr",
            data: idsArr.join(","),
          },
        ],
      };
      console.log("获取到当前表格的数据", tableData);
      http
        .post("/api/meta/v1/indct/saveIndcts.do", {
          postData: JSON.stringify(postData),
        })
        .then((res) => {
          let result = res.data[0].data;
          if (result == "success") {
            Message.success("保存成功");
          } else {
            Message.error("保存失败");
          }
        })
        .catch(() => {
          Message.error("保存失败");
        });
    },
    /**
     * @description 拷贝事件
     */
    copyData() {},
    /**
     * @description 变量弹窗提交回调事件
     * @param {Object} data
     */
    submitData(data) {
      console.log("成功提交数据了", data);
      this.isShowDynamicFormDialog = false;
    },
    // /**
    //  * @description 下拉切换事件
    //  * @param {String} command
    //  */
    // handleCommand(command) {
    //   this.dialogComp = command;
    //   this.isShowDialog = true;
    //   this.dropMenuOption.some((item) => {
    //     if (command == item.value) {
    //       this.dialogTitle = item.label;
    //       return true;
    //     }
    //   });
    // },
    /**
     * @description 导入变量
     */
    importVariable() {},
    /**
     * @description 导出变量
     */
    exportVariable() {},
    /**
     * @description 导出模板
     */
    exportModel() {},
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

    /**
     * @description 切换弹窗显示状态
     * @param {Boolean} val
     */
    changeIsShowDialog(val) {
      this.isShowDialog = val;
    },
    /**
     * @description 弹窗操作按钮事件
     * @param {String} val ---- confirm/cancel 确认/取消
     * @param {Object} data 表单数据
     */
    operation(val) {
      if (val == "confirm") {
        //确认处理逻辑
        this.$refs.dialogForm.submit((data) => {
          console.log("获取到弹窗表单数据了", data);
          let postData = {
            data: [
              {
                data: {
                  ...data,
                  partitionCode: this.selectedProjectItem.value,
                  partitionName: this.selectedProjectItem.text,
                },
                name: "indctFolder",
                vtype: "formpanel",
              },
            ],
          };
          http
            .post("/api/meta/v1/indctFolder/saveIndctFolder.do", {
              postData: JSON.stringify(postData),
            })
            .then((res) => {
              Message.success("新建成功");
              //刷新树数据
              this.$refs.variableTree.initData();
            })
            .catch(() => {
              Message.error("新建失败");
            });
          this.isShowDialog = false;
        });
      } else {
        //取消处理逻辑
        this.isShowDialog = false;
      }
    },
    /**
     * @description 新增
     */
    addNode() {
      this.isShowDialog = true;
    },
    /**
     * @description 批量删除
     */
    batchDeleteRows() {
      this.$refs.MainTable.batchDeleteRow();
    },
    /**
     * @description 表单查询事件
     */
    onSubmitQuery() {
      this.afrashTableData();
    },
    /**
     * @description 修改表格数据操作
     * @param {Array} data
     */
    upDateTableData(data) {
      this.postTableData.rows = data;
    },
    /**
     * @description 表单重置事件
     */
    onResetQuery() {
      this.formData = {};
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  height: 100vh;
  .fenqu {
    .label {
      font-size: 16px;
      color: #666;
      padding-right: 10px;
    }
  }
}
.dropDown {
  margin-right: 10px;
}

.operateLan {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #cecece;
  justify-content: space-between;
  /deep/ .el-form .el-form-item {
    margin-bottom: 0;
  }
}
.main {
  display: flex;
  justify-content: space-between;
  height: calc(100% - 62px);
  .leftArea {
    width: 300px;
    border-right: 1px solid #cecece;
  }
  .rightArea {
    width: calc(100% - 310px);
  }
}
</style>
