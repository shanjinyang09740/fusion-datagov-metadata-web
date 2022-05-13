<template>
  <div class="groupFrom">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="基本属性" name="first">
        <fu-form
          class="form"
          :rules="baseRules"
          ref="baseForm"
          label-width="110px"
          :fu-data="baseForm"
        >
          <fu-row>
            <fu-col :span="8">
              <fu-form-item label="名称" prop="stat_group_name_ch">
                <fu-input
                  :disabled="disabled"
                  v-model="baseForm.stat_group_name_ch"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
            <fu-col :span="8">
              <fu-form-item label="编码" prop="stat_group_code">
                <fu-input
                  :disabled="disabled"
                  v-model="baseForm.stat_group_code"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
            <fu-col :span="8">
              <fu-form-item label="英文名" prop="stat_group_en">
                <fu-input
                  :disabled="disabled"
                  v-model="baseForm.stat_group_en"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
          </fu-row>
          <fu-row>
            <fu-col :span="8">
              <fu-form-item label="别名" prop="stat_group_alias">
                <fu-input
                  :disabled="disabled"
                  v-model="baseForm.stat_group_alias"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
            <fu-col :span="8">
              <fu-form-item label="顺序号" prop="stat_group_sort_num">
                <fu-input
                  :disabled="disabled"
                  v-model="baseForm.stat_group_sort_num"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
            <fu-col :span="8">
              <fu-form-item
                label="标准分类标识"
                prop="stat_catalog_standard_id"
              >
                <fu-select
                  :disabled="disabled"
                  v-model="baseForm.stat_catalog_standard_id"
                  placeholder="请选择"
                  style="width: 100%"
                  size="medium"
                >
                  <fu-option
                    v-for="i in standardOptions"
                    :key="i.value"
                    :label="i.text"
                    :value="i.value"
                  >
                  </fu-option>
                </fu-select>
              </fu-form-item>
            </fu-col>
          </fu-row>
          <fu-row>
            <fu-col :span="8">
              <fu-form-item label="版本" prop="stat_group_version">
                <fu-input
                  v-model="baseForm.stat_group_version"
                  :disabled="disabled"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>

            <fu-col :span="8">
              <fu-form-item
                v-if="type === 'group'"
                label="分组类型"
                prop="stat_group_type"
              >
                <fu-select
                  v-model="baseForm.stat_group_type"
                  :disabled="disabled"
                  placeholder="请选择"
                  style="width: 100%"
                  size="medium"
                >
                  <fu-option
                    v-for="i in groupOptions"
                    :key="i.value"
                    :label="i.text"
                    :value="i.value"
                  >
                  </fu-option>
                </fu-select>
              </fu-form-item>
            </fu-col>
          </fu-row>
          <fu-form-item label="版本说明" prop="stat_group_version_desc">
            <fu-input
              v-model="baseForm.stat_group_version_desc"
              :disabled="disabled"
              placeholder="请输入"
              type="textarea"
              :rows="2"
            ></fu-input>
          </fu-form-item>
          <fu-form-item label="分组编码规则" prop="stat_group_code_rule">
            <fu-input
              v-model="baseForm.stat_group_code_rule"
              :disabled="disabled"
              placeholder="请输入"
              type="textarea"
              :rows="2"
            ></fu-input>
          </fu-form-item>
        </fu-form>
      </el-tab-pane>
      <el-tab-pane label="管理属性" name="second"
        ><fu-form
          :rules="manageRules"
          ref="manageForm"
          label-width="130px"
          :fu-data="baseForm"
        >
          <fu-row>
            <fu-col :span="8">
              <fu-form-item label="状态" prop="stat_group_status">
                <fu-select
                  v-model="baseForm.stat_group_status"
                  :disabled="disabled"
                  placeholder="请选择"
                  style="width: 100%"
                  size="medium"
                >
                  <fu-option
                    v-for="i in StateOptions"
                    :key="i.value"
                    :label="i.text"
                    :value="i.value"
                  >
                  </fu-option>
                </fu-select>
              </fu-form-item>
            </fu-col>
            <fu-col :span="8">
              <fu-form-item label="启用时间" prop="stat_group_start_date">
                <fu-date-picker
                  v-model="baseForm.stat_group_start_date"
                  :disabled="disabled"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                >
                </fu-date-picker>
              </fu-form-item>
            </fu-col>
            <fu-col :span="8">
              <fu-form-item label="停用时间" prop="stat_group_stop_date">
                <fu-date-picker
                  v-model="baseForm.stat_group_stop_date"
                  :disabled="disabled"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                >
                </fu-date-picker>
              </fu-form-item>
            </fu-col>
          </fu-row>
          <fu-row>
            <fu-col :span="8">
              <fu-form-item label="创建时间" prop="stat_group_creat_date">
                <fu-date-picker
                  v-model="baseForm.stat_group_creat_date"
                  :disabled="disabled"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                >
                </fu-date-picker>
              </fu-form-item>
            </fu-col>
            <fu-col :span="8">
              <fu-form-item
                label="创建机构版本"
                prop="stat_group_creat_org_version"
              >
                <fu-input
                  v-model="baseForm.stat_group_creat_org_version"
                  :disabled="disabled"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
            <fu-col :span="8">
              <fu-form-item
                label="创建机构名称"
                prop="stat_group_creat_org_name"
              >
                <fu-input
                  v-model="baseForm.stat_group_creat_org_name"
                  :disabled="disabled"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
          </fu-row>
          <fu-row>
            <fu-col :span="8">
              <fu-form-item
                label="创建机构联系人"
                prop="stat_group_creat_org_contact"
              >
                <fu-input
                  v-model="baseForm.stat_group_creat_org_contact"
                  :disabled="disabled"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
            <fu-col :span="8">
              <fu-form-item
                label="创建机构联系电话"
                prop="stat_group_creat_org_phone"
              >
                <fu-input
                  v-model="baseForm.stat_group_creat_org_phone"
                  :disabled="disabled"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
            <fu-col :span="8">
              <fu-form-item
                label="创建机构电子邮箱"
                prop="stat_group_creat_org_email"
              >
                <fu-input
                  v-model="baseForm.stat_group_creat_org_email"
                  :disabled="disabled"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
          </fu-row>
          <fu-row>
            <fu-col :span="8">
              <fu-form-item label="管理级别" prop="stat_group_manage_level">
                <fu-input
                  v-model="baseForm.stat_group_manage_level"
                  :disabled="disabled"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
            <fu-col :span="8">
              <fu-form-item
                label="管理机构版本"
                prop="stat_group_manage_org_version"
              >
                <fu-input
                  v-model="baseForm.stat_group_manage_org_version"
                  :disabled="disabled"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
            <fu-col :span="8">
              <fu-form-item
                label="管理机构名称"
                prop="stat_group_manage_org_name"
              >
                <fu-input
                  v-model="baseForm.stat_group_manage_org_name"
                  :disabled="disabled"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
          </fu-row>
          <fu-row>
            <fu-col :span="8">
              <fu-form-item
                label="管理机构联系人"
                prop="stat_group_manage_org_contact"
              >
                <fu-input
                  v-model="baseForm.stat_group_manage_org_contact"
                  :disabled="disabled"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
            <fu-col :span="8">
              <fu-form-item
                label="管理机构联系电话"
                prop="stat_group_manage_org_phone"
              >
                <fu-input
                  v-model="baseForm.stat_group_manage_org_phone"
                  :disabled="disabled"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
            <fu-col :span="8">
              <fu-form-item
                label="管理机构电子邮箱"
                prop="stat_group_manage_org_email"
              >
                <fu-input
                  v-model="baseForm.stat_group_manage_org_email"
                  :disabled="disabled"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
          </fu-row>

          <fu-form-item
            label="管理机构修订记录"
            prop="stat_group_manage_org_rev_rec"
          >
            <fu-input
              v-model="baseForm.stat_group_manage_org_rev_rec"
              :disabled="disabled"
              placeholder="请输入"
              type="textarea"
              :rows="2"
            ></fu-input>
          </fu-form-item>
          <fu-row>
            <fu-col :span="8">
              <fu-form-item label="提交审批时间" prop="stat_group_submit_date">
                <fu-date-picker
                  v-model="baseForm.stat_group_submit_date"
                  :disabled="disabled"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                >
                </fu-date-picker>
              </fu-form-item>
            </fu-col>
            <fu-col :span="8">
              <fu-form-item label="审批时间" prop="stat_group_check_date">
                <fu-date-picker
                  v-model="baseForm.stat_group_check_date"
                  :disabled="disabled"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                >
                </fu-date-picker>
              </fu-form-item>
            </fu-col>

            <fu-col :span="8">
              <fu-form-item label="审批状态" prop="stat_group_check_status">
                <fu-select
                  v-model="baseForm.stat_group_check_status"
                  :disabled="disabled"
                  placeholder="请选择"
                  style="width: 100%"
                  size="medium"
                >
                  <fu-option
                    v-for="i in CheckStateOptions"
                    :key="i.value"
                    :label="i.text"
                    :value="i.value"
                  >
                  </fu-option>
                </fu-select>
              </fu-form-item>
            </fu-col>
          </fu-row>
          <fu-row>
            <fu-col :span="8">
              <fu-form-item label="审批意见" prop="stat_group_check_opinion">
                <fu-input
                  v-model="baseForm.stat_group_check_opinion"
                  :disabled="disabled"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
            <fu-col :span="8">
              <fu-form-item
                label="审批机构版本"
                prop="stat_group_check_org_version"
              >
                <fu-input
                  v-model="baseForm.stat_group_check_org_version"
                  :disabled="disabled"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
            <fu-col :span="8">
              <fu-form-item
                label="审批机构名称"
                prop="stat_group_check_org_name"
              >
                <fu-input
                  v-model="baseForm.stat_group_check_org_name"
                  :disabled="disabled"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
          </fu-row>
          <fu-row>
            <fu-col :span="8">
              <fu-form-item
                label="审批机构审批人"
                prop="stat_group_check_org_approver"
              >
                <fu-input
                  v-model="baseForm.stat_group_check_org_approver"
                  :disabled="disabled"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
          </fu-row>
          <fu-form-item
            label="审批机构修订记录"
            prop="stat_group_check_org_rev_rec"
          >
            <fu-input
              v-model="baseForm.stat_group_check_org_rev_rec"
              :disabled="disabled"
              placeholder="请输入"
              type="textarea"
              :rows="2"
            ></fu-input>
          </fu-form-item>
        </fu-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import {
  Row,
  Col,
  Select,
  Option,
  Input,
  Form,
  FormItem,
  DatePicker,
} from "fusion-ui";
import { postJSON } from "@/utils/post";
export default {
  components: {
    FuRow: Row,
    FuCol: Col,
    FuSelect: Select,
    FuOption: Option,
    FuInput: Input,
    FuForm: Form,
    FuFormItem: FormItem,
    FuDatePicker: DatePicker,
  },
  props: {
    groupId: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "group",
    },
    group: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      activeName: "first",
      baseForm: {
        stat_catalog_standard_id: "",
        stat_group_alias: "",
        stat_group_code: "",
        stat_group_code_rule: "",
        stat_group_name_ch: "",
        stat_group_type: "",
        stat_group_version: "",
        stat_group_version_desc: "",
        stat_group_status: "",
        stat_group_start_date: "",
        stat_group_stop_date: "",
        stat_group_creat_date: "",
        stat_group_creat_org_version: "",
        stat_group_creat_org_name: "",
        stat_group_creat_org_contact: "",
        stat_group_creat_org_phone: "",
        stat_group_creat_org_email: "",
        stat_group_manage_level: "",
        stat_group_manage_org_version: "",
        stat_group_manage_org_name: "",
        stat_group_manage_org_contact: "",
        stat_group_manage_org_phone: "",
        stat_group_manage_org_email: "",
        stat_group_manage_org_rev_rec: "",
        stat_group_submit_date: "",
        stat_group_check_date: "",
        stat_group_check_status: "",
        stat_group_check_opinion: "",
        stat_group_check_org_version: "",
        stat_group_check_org_name: "",
        stat_group_check_org_approver: "",
        stat_group_check_org_rev_rec: "",
        stat_group_sort_num: "",
      },
      baseRules: {
        stat_group_sort_num: [
          { required: true, message: "请填写顺序号", trigger: "blur" },
        ],
        stat_group_name_ch: [
          { required: true, message: "请填写名称", trigger: "blur" },
        ],
        stat_group_code: [
          { required: true, message: "请填写编码", trigger: "blur" },
        ],
        stat_group_version: [
          { required: true, message: "请填写版本", trigger: "blur" },
        ],
        stat_catalog_standard_id: [
          { required: true, message: "请选择标准分类标识", trigger: "change" },
        ],
        stat_group_type: [
          { required: true, message: "请选择分组类型", trigger: "change" },
        ],
        // aggregateType: [
        //   { required: true, message: "请选择汇总类型", trigger: "change" },
        // ],
      },
      manageRules: {
        stat_group_status: [
          { required: true, message: "请选择状态", trigger: "change" },
        ],
        stat_group_creat_date: [
          { required: true, message: "请选择创建时间", trigger: "change" },
        ],
        stat_group_creat_org_version: [
          { required: true, message: "请输入创建机构版本", trigger: "blur" },
        ],
        stat_group_manage_level: [
          { required: true, message: "请输入管理级别", trigger: "blur" },
        ],
        stat_group_manage_org_version: [
          { required: true, message: "请输入管理机构版本", trigger: "blur" },
        ],
        stat_group_check_status: [
          { required: true, message: "请选择审批状态", trigger: "change" },
        ],
      },
      // 标准分类标识
      standardOptions: [],
      // 分组类型
      groupOptions: [],
      // 汇总类型
      summaryOptions: [],
      // 启用状态
      StateOptions: [],
      // 审查类型
      CheckStateOptions: [],
    };
  },
  watch: {
    group: {
      handler(val) {
        if (val) {
          this.baseForm = val;
        }
      },
      immediate: true,
    },
  },
  created() {
    this.getSelectData();
  },
  mounted() {
    if (this.type === "group" && this.baseForm.stat_group_code === "") {
      this.baseForm.stat_group_code = "FEN" + this.getRandomSixDigit();
    } else if (this.type === "catalog") {
      this.baseForm.stat_group_code = "CAT" + this.getRandomSixDigit();
    }
  },
  methods: {
    getSelectData() {
      this.getCodeTableData("MD_Catalog_Standard_ID")
        .then((res) => {
          if (res.data[0].data) {
            this.standardOptions = res.data[0].data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
      this.getCodeTableData("MD_COLLECT_TYPE")
        .then((res) => {
          if (res.data[0].data) {
            this.summaryOptions = res.data[0].data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
      this.getCodeTableData("MD_USE_STATE")
        .then((res) => {
          if (res.data[0].data) {
            this.StateOptions = res.data[0].data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
      this.getCodeTableData("MD_Indct_Check_Status")
        .then((res) => {
          if (res.data[0].data) {
            this.CheckStateOptions = res.data[0].data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
      this.getCodeTableData("MD_GROUP_TYPE")
        .then((res) => {
          if (res.data[0].data) {
            let groupType = res.data[0].data;
            if (groupType.length > 0) {
              this.groupOptions = groupType.filter((i) => {
                return i.text !== "目录";
              });
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 查询代码表
    getCodeTableData(code) {
      return postJSON(`/api/core/v1/dictionary/queryData.do?dicId=${code}`, {
        postData: JSON.stringify({
          data: [],
        }),
      });
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    // 生成六位随机数
    getRandomSixDigit() {
      let code = "";
      for (var i = 0; i < 6; i++) {
        code += parseInt(Math.random() * 10);
      }
      return code;
    },
  },
};
</script>
<style scoped lang="less">
.groupFrom {
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
}
</style>
