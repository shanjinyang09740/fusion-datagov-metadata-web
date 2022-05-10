<template>
  <div id="projectContainer" class="basic-page-container">
    <div>
      <control-bar>
        <template slot="left">
          <div>
            <fu-button
              type="primary"
              title="添加属性"
              size="medium"
              @click="handleClickAdd"
              >添加属性</fu-button
            >
          </div>
        </template>
        <template slot="right">
          <div>
            <advanced-query
              :columns="queryColumns"
              :hideAdvancedQuery="true"
              :showTopResetButton="true"
              @search="tableSearch"
            ></advanced-query>
          </div>
        </template>
      </control-bar>
    </div>
    <common-table
      :fuColumn="table.column"
      :reqUrl="basicAttributeReqUrl"
      :reqParams="basicAttributeReqParams"
      ref="basicAttribute"
      :tableId="'basicAttributeId'"
    >
      <template slot-scope="myscope" slot="one">
        <button type="text" @click="handleClickEdit(myscope.data)">编辑</button>
        <button type="text" @click="handleClickMoveUp(myscope.data)">
          上移
        </button>
        <button type="text" @click="handleClickMoveDown(myscope.data)">
          下移
        </button>
        <button type="text" @click="handleClickDelete(myscope.data)">
          删除
        </button>
      </template>
    </common-table>
    <new-attribute
      :dialogVisible="newAttributeDialogVisible"
      @closeDialog="closeDialog"
      :currentData="currentInformatiion"
      :type="dialogType"
    ></new-attribute>
  </div>
</template>

<script>
import { Button } from "fusion-ui";
// import AddMeetingRoom from "@/components/AddMeetingRoom";
import CommonTable from "@/components/CommonTable";
import ControlBar from "@/components/ControlBar";
import AdvancedQuery from "@/components/AdvancedQuery";
import NewAttribute from "@/components/NewAttribute";

// import {
//   getConference,
//   deleteConferenceRoom,
//   queryDataByType,
// } from "@/utils/service";
export default {
  name: "basicAttribute",
  components: {
    FuButton: Button,
    CommonTable,
    ControlBar,
    AdvancedQuery,
    NewAttribute,
  },
  props: {},
  data() {
    return {
      basicAttributeUrl: {
        target: "",
        group: "",
        subitem: "",
        variable: "",
        dataOwnership: "",
        timeFrame: "",
        reportPeriod: "",
        dataCredibility: "",
        dataSecurityLevel: "",
      },
      basicAttributeName: {
        target: "指标",
        group: "分组",
        subitem: "分项",
        variable: "变量",
        dataOwnership: "数据归属地",
        timeFrame: "时间框架",
        reportPeriod: "报告期别",
        dataCredibility: "数据可信度",
        dataSecurityLevel: "数据密级",
      },
      basicAttributeType: "",

      //新建属性
      currentInformatiion: {},
      newAttributeDialogVisible: false,
      dialogType: "add",

      //查询
      submitQueryForm: {},
      queryColumns: [
        {
          label: "名称/编码",
          placeholder: "请输入名称/编码",
          isSearchShow: true,
          modelDataKey: "projectName",
          type: "input",
          labelWidth: "110px",
          defaultValue: "",
        },
        {
          label: "属性名称", //表单名称
          placeholder: "请选择属性名称",
          isSearchShow: true,
          type: "select", // select/input两种类型，不传默认input类型
          labelWidth: "110px", //名称宽度值,默认68px
          modelDataKey: "projectYear", //双向绑定数据
          defaultValue: "", //默认值
          request: {
            //只有select需要传
            // url: "/api/core/v1/dictionary/queryData.do?dicId=pStatus",
            url: "",
            params: [],
          },
        },
      ],
      //表格
      basicAttributeReqUrl: "/api/meta/v1/basic/select.do",
      table: {
        column: [
          // {
          //   label: "代码",
          //   prop: "code",
          // width: "120",
          // },
          {
            label: "名称",
            prop: "proLabel",
            // width: "120",
            // changeCodeType: "array",
            // changeArr: [],
          },
          {
            label: "简称",
            prop: "proAlias",
            // width: "120",
          },
          {
            label: "编码",
            prop: "proCode",
            // width: "120",
          },
          {
            label: "说明",
            prop: "proExplain",
            // width: "120",
            // reqUrl: "/api/core/v1/dictionary/queryData.do?dicId=HYSZT",
            // codeListId: "HYSZT",
          },
          {
            label: "数据类型",
            prop: "proDataType",
            // width: "120",
          },
          {
            label: "属性类型",
            prop: "proBasicType",
            // width: "120",
          },
          {
            label: "最大长度",
            prop: "proLength",
            // width: "120",
          },
        ],
      },
    };
  },
  computed: {
    basicAttributeReqParams() {
      return [
        {
          vtype: "attr",
          name: "type",
          data: this.basicAttributeName[this.basicAttributeType],
        },
      ];
    },
  },
  watch: {},
  beforeCreate() {},
  created() {
    // this.getMeetingRoomType();
    this.basicAttributeType = window.location.href.split("=")[1];
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
    tableSearch(form) {
      console.log(form);
      this.submitQueryForm = JSON.parse(JSON.stringify(form));
    },
    /**
     * @description 获取会议室类型
     */
    async getMeetingRoomType() {
      // const { data } = await queryDataByType("HYSLX");
      // if (data) {
      //   this.$set(this.table.column[1], "changeArr", data[0].data);
      // }
    },
    /**
     * @description 新建
     */
    handleClickAdd() {
      this.dialogType = "add";
      this.newAttributeDialogVisible = true;
    },
    /**
     * @description 关闭新建
     */
    closeDialog(type) {
      if (type === "success") {
        this.$refs.basicAttribute.$refs.operationRef.queryData();
        this.$refs.basicAttribute.$refs.page.queryData();
      }
      this.$set(this, "currentInformatiion", {});
      this.newAttributeDialogVisible = false;
    },

    /**
     * @description 修改
     */
    async handleClickEdit(id) {
      this.dialogType = "edit";
      // const { data } = await getConference(id);
      // this.$set(this, "currentInformatiion", data[0].data);
      this.newAttributeDialogVisible = true;
    },

    /**
     * @description 上移
     */
    async handleClickMoveUp() {},

    /**
     * @description 下移
     */
    async handleClickMoveDown() {},

    /**
     * @description 删除
     */
    handleClickDelete(id) {
      // MessageBox.confirm("此操作将删除选中内容, 是否继续?", "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning",
      // })
      //   .then(async () => {
      //     const { data } = await deleteConferenceRoom(id);
      //     if (data[0].data.msg === "success") {
      //       Message.success("删除完成");
      //       this.$refs.basicAttribute.$refs.operationRef.queryData();
      //       this.$refs.basicAttribute.$refs.page.queryData();
      //     } else {
      //       Message.warning("删除失败");
      //     }
      //   })
      //   .catch(() => {});
    },
  },
};
</script>

<style lang="less" scoped>
.basic-page-container {
  padding: 0 10px;
}
</style>
