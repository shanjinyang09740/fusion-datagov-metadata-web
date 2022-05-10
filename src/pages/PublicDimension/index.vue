<template>
  <div class="main">
    <div class="header">
      <div>
        <fu-button size="medium" class="right" type="primary" @click="create"
          >新建</fu-button
        >
        <fu-button
          size="medium"
          class="right"
          type="primary"
          @click="deleteItemize('ids')"
          >删除</fu-button
        >
        <fu-button size="medium" class="right" type="primary">导入</fu-button>
        <fu-button size="medium" class="right" type="primary">导出</fu-button>
        <fu-button
          size="medium"
          class="right"
          type="primary"
          @click="manageAttr"
          >管理分项属性</fu-button
        >
      </div>
      <div>
        <advanced-query
          :columns="queryColumns"
          :showTopResetButton="true"
          :hideAdvancedQuery="true"
          @search="tableSearch"
        ></advanced-query>
      </div>
    </div>
    <fu-table
      :fu-data="tableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      @selection-change="handleSelectionChange"
    >
      <fu-table-column type="selection" width="55" align="center">
      </fu-table-column>
      <fu-table-column type="index" width="55" label="序号" align="center">
      </fu-table-column>
      <fu-table-column
        v-for="(item, index) in tableColumns"
        :key="index"
        :label="item.label"
        :prop="item.prop"
        :min-width="item.width"
        align="center"
        header-align="center"
      >
      </fu-table-column>
      <fu-table-column fixed="right" label="操作" width="250">
        <template slot-scope="scope">
          <fu-button type="text" @click="editItemize(scope.row)"
            >编辑</fu-button
          >
          <fu-button type="text" @click="deleteItemize('id', scope.row)"
            >删除</fu-button
          >
        </template>
      </fu-table-column>
    </fu-table>
    <fu-dialog
      :title="title"
      width="500px"
      :visible.sync="isShowDialog"
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <fu-form
        :rules="rules"
        ref="sjgsdForm"
        label-width="100px"
        :fu-data="sjgsdForm"
      >
        <fu-form-item label="中文名称：" prop="sjgsdName">
          <fu-input
            v-model="sjgsdForm.sjgsdName"
            placeholder="请输入"
          ></fu-input>
        </fu-form-item>
        <fu-form-item label="代码：" prop="sjgsdCode">
          <fu-input
            v-model="sjgsdForm.sjgsdCode"
            placeholder="请输入"
          ></fu-input>
        </fu-form-item>
        <fu-form-item label="别称：" prop="sjgsdCode">
          <fu-input
            v-model="sjgsdForm.sjgsdCode"
            placeholder="请输入"
          ></fu-input>
        </fu-form-item>
        <fu-form-item label="解释：" prop="sjgsdCode">
          <fu-input
            v-model="sjgsdForm.sjgsdCode"
            placeholder="请输入"
          ></fu-input>
        </fu-form-item>
      </fu-form>
      <span slot="footer">
        <fu-button type="primary" @click="submit">确定</fu-button>
        <fu-button @click="closeDialog">取消</fu-button>
      </span>
    </fu-dialog>
  </div>
</template>
<script>
import {
  Select,
  Option,
  Button,
  Input,
  Form,
  FormItem,
  TableColumn,
  Dialog,
  Table,
  Message,
} from "fusion-ui";
import AdvancedQuery from "@/components/AdvancedQuery";
import { getItemizeDetail } from "@/service/modules/labelManage.js";
import { getUrl } from "@/utils/tool.js";
export default {
  components: {
    FuSelect: Select,
    FuOption: Option,
    FuButton: Button,
    FuInput: Input,
    FuForm: Form,
    FuFormItem: FormItem,
    FuTableColumn: TableColumn,
    FuDialog: Dialog,
    FuTable: Table,
    AdvancedQuery,
  },
  data() {
    return {
      // 分组id
      pageId: "",
      // 查询表单
      queryForm: {
        groupNameCode: "",
        statGroupType: "",
      },
      queryColumns: [
        {
          label: "数据归属地名称/编码：",
          modelData: "groupNameCode",
          type: "input",
          labelWidth: "150px",
          defaultValue: "",
          isSearchShow: true,
        },
      ],
      tableColumns: [
        {
          label: "中文名称",
          prop: "label",
          width: "100px",
        },
        {
          label: "分项编码",
          prop: "code",
          width: "100px",
        },
        {
          label: "别称",
          prop: "",
          width: "100px",
        },
        {
          label: "解释",
          prop: "",
          width: "100px",
        },
        {
          label: "更新人",
          prop: "",
          width: "100px",
        },
        {
          label: "更新时间",
          prop: "",
          width: "100px",
        },
      ],
      tableData: {
        page: 1,
        pagerows: 0,
        rows: [
          {
            id: 1,
            date: "2016-05-02",
            label: "王小虎",
            code: "上海市普陀区金沙江路 1518 弄",
          },
          {
            id: 2,
            date: "2016-05-04",
            label: "王小虎",
            code: "上海市普陀区金沙江路 1517 弄",
          },
          {
            id: 3,
            date: "2016-05-01",
            label: "王小虎",
            code: "上海市普陀区金沙江路 1519 弄",
          },
          {
            id: 4,
            date: "2016-05-03",
            label: "王小虎",
            code: "上海市普陀区金沙江路 1516 弄",
          },
        ],
        totalrows: 0,
      },
      isShowDialog: false,
      title: "",
      selectionId: [],
      sjgsdForm: {
        sjgsdName: "",
        sjgsdCode: "",
      },
      rules: {
        sjgsdName: [
          { required: true, message: "请填写中文名称", trigger: "blur" },
        ],
        sjgsdCode: [{ required: true, message: "请填写代码", trigger: "blur" }],
      },
    };
  },
  created() {
    this.pageId = getUrl("id");
    this.page;
    // this.getItemizeTableData(this.pageId);
  },
  methods: {
    /**
     * @description 获取表格信息
     */
    getItemizeTableData(id) {
      getTableData(id).then((res) => {
        if (res.data[0].data) {
          this.tableData = res.data[0].data;
        }
      });
    },
    /**
     * @description 新建
     */
    create() {
      this.title = "数据归属地";
      this.isShowDialog = true;
    },
    /**
     * @description 保存新建分项
     */
    submit(form) {},
    /**
     * @description 编辑
     */
    editItemize(row) {
      this.title = "编辑公共维度";
      this.isShowDialog = true;
      this.getItemizeDetail(row.id);
    },
    /**
     * @description 获取分项信息
     */
    getItemizeDetail(id) {
      getItemizeDetail(id).then((res) => {
        let data = res.data[0].data;
        if (data) {
          this.sjgsdForm = data;
          this.isShowDialog = true;
        }
      });
    },
    /**
     * @description 删除
     */
    deleteItemize(type, row) {
      let params = "";
      if (type === "ids") {
        params = this.selectionId.join(",");
      } else {
        params = row.id;
      }
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // deleteItemize(params)
          //   .then((res) => {
          //     if (res.data[0].data) {
          //       Message.success("删除成功!");
          //     }
          //   })
          //   .catch((err) => {
          //     Message.error(`删除失败!，${err.errorMessage}`);
          //   });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    closeDialog() {
      this.isShowDialog = false;
    },
    handleSelectionChange(selection) {
      this.selectionId = selection.map((item) => {
        return item.id;
      });
    },
    /**
     * @description 表单查询
     */
    tableSearch(form) {
      this.queryForm = JSON.parse(JSON.stringify(form));
    },
    /**
     * @description 管理分项属性
     */
    manageAttr() {
      // window.location.href = "./itemizedAttributeManage.html";
    },
  },
};
</script>
<style lang="less" scoped>
.main {
  padding: 0 10px;
}
.header {
  height: 40px;
  margin: 10px 0;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
}
</style>
