<template>
  <div>
    <div class="index-main">
      <template
        ><fu-form
          class="form-style"
          ref="indexForm"
          :rules="indexFormRules"
          :fu-data="managePropertyForm"
        >
          <template v-for="formI in indexFormPage">
            <fu-form-item
              v-if="formI.type !== 'radio'"
              class="form-item-style"
              :label="formI.label"
              label-width="130px"
              :key="formI.model"
              :prop="formI.model"
            >
              <fu-date-picker
                :disabled="disabled"
                v-if="formI.type === 'datetime'"
                v-model="managePropertyForm[formI.model]"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm"
                placeholder="选择日期时间"
                style="width: 75.5%"
                clearable
              >
              </fu-date-picker>
              <span v-else>
                {{ managePropertyForm[formI.model] }}
              </span>
            </fu-form-item>
            <div
              v-if="formI.type === 'radio'"
              :key="formI.label"
              style="width: 100%"
            >
              <fu-form-item
                :label="formI.label"
                label-width="130px"
                :key="formI.model"
                :prop="formI.model"
              >
                <fu-radio-group
                  v-model="managePropertyForm[formI.model]"
                  :disabled="disabled"
                >
                  <fu-radio
                    v-for="item in formI.options"
                    :key="item.value"
                    :label="item.value"
                    >{{ item.text }}</fu-radio
                  >
                </fu-radio-group>
              </fu-form-item>
            </div>
          </template>
        </fu-form>
      </template>
    </div>
    <div class="create-main">
      <div class="title-style">
        <span>创建信息</span>
      </div>
      <fu-divider class="divider-style"></fu-divider>
      <template>
        <div>
          <fu-form
            class="form-style"
            ref="createFrom"
            :rules="createFromRules"
            :fu-data="managePropertyForm"
          >
            <template v-for="formI in createFromPage">
              <fu-form-item
                class="form-item-style"
                :label="formI.label"
                label-width="130px"
                :key="formI.model"
                :prop="formI.model"
              >
                <fu-date-picker
                  :disabled="disabled"
                  v-if="formI.type === 'datetime'"
                  v-model="managePropertyForm[formI.model]"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm"
                  placeholder="选择日期时间"
                  style="width: 75.5%"
                  clearable
                >
                </fu-date-picker>
                <fu-input
                  v-else-if="formI.type === 'input'"
                  size="medium"
                  v-model="managePropertyForm[formI.model]"
                  style="width: 75.5%"
                  :placeholder="'请输入' + formI.label"
                  :disabled="disabled"
                ></fu-input>
                <span v-else>
                  {{ managePropertyForm[formI.model] }}
                </span>
              </fu-form-item>
            </template>
          </fu-form>
        </div>
      </template>
    </div>
    <div class="manage-main">
      <div class="title-style">
        <span>管理信息</span>
      </div>
      <fu-divider class="divider-style"></fu-divider>
      <template>
        <div>
          <fu-form
            class="form-style"
            ref="manageFrom"
            :rules="manageFromRules"
            :fu-data="managePropertyForm"
          >
            <template v-for="formI in manageFromPage">
              <fu-form-item
                v-if="formI.type !== 'textarea'"
                class="form-item-style"
                :label="formI.label"
                label-width="130px"
                :key="formI.model"
                :prop="formI.model"
              >
                <fu-select
                  v-if="formI.type === 'select'"
                  :placeholder="'请选择' + formI.label"
                  clearable
                  v-model="manageFromPage[formI.model]"
                  :fu-request="formI.req"
                  :fu-id="formI.model"
                  size="medium"
                  style="width: 75.5%"
                  :disabled="disabled"
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
                  v-model="managePropertyForm[formI.model]"
                  style="width: 75.5%"
                  :placeholder="'请输入' + formI.label"
                  :disabled="disabled"
                ></fu-input>
                <span v-else>
                  {{ managePropertyForm[formI.model] }}
                </span>
              </fu-form-item>
              <div
                v-if="formI.type === 'textarea'"
                :key="formI.model"
                style="width: 90%"
              >
                <fu-form-item
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
                    v-model="manageFromPage[formI.model]"
                    :disabled="disabled"
                  ></fu-input>
                </fu-form-item>
              </div>
            </template>
          </fu-form>
        </div>
      </template>
    </div>
    <div class="approval-main">
      <div class="title-style">
        <span>审批信息</span>
      </div>
      <fu-divider class="divider-style"></fu-divider>
      <template>
        <div>
          <fu-form
            class="form-style"
            ref="approvalFrom"
            :rules="approvalFromRules"
            :fu-data="managePropertyForm"
          >
            <template v-for="formI in approvalFromPage">
              <fu-form-item
                class="form-item-style"
                :label="formI.label"
                label-width="130px"
                :key="formI.model"
                :prop="formI.model"
              >
                <fu-select
                  v-if="formI.type === 'select'"
                  :placeholder="'请选择' + formI.label"
                  clearable
                  v-model="manageFromPage[formI.model]"
                  :fu-request="formI.req"
                  :fu-id="formI.model"
                  size="medium"
                  style="width: 75.5%"
                  :disabled="disabled"
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
                <fu-date-picker
                  :disabled="disabled"
                  v-else-if="formI.type === 'datetime'"
                  v-model="managePropertyForm[formI.model]"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm"
                  placeholder="选择日期时间"
                  style="width: 75.5%"
                  clearable
                >
                </fu-date-picker>
                <fu-input
                  v-else-if="formI.type === 'input'"
                  size="medium"
                  v-model="managePropertyForm[formI.model]"
                  style="width: 75.5%"
                  :placeholder="'请输入' + formI.label"
                  :disabled="disabled"
                ></fu-input>
                <span v-else>
                  {{ managePropertyForm[formI.model] }}
                </span>
              </fu-form-item>
            </template>
          </fu-form>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import {
  Input,
  Form,
  FormItem,
  Select,
  Radio,
  RadioGroup,
  Divider,
  Option,
  DatePicker,
} from "fusion-ui";
export default {
  name: "managePropertyForm",
  props: {
    managePropertyForm: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    FuInput: Input,
    FuSelect: Select,
    FuForm: Form,
    FuFormItem: FormItem,
    FuRadio: Radio,
    FuRadioGroup: RadioGroup,
    FuDivider: Divider,
    FuOption: Option,
    FuDatePicker: DatePicker,
  },
  data() {
    return {
      disabled: false,
      /** 指标信息开始 */
      indexFormPage: [
        {
          label: "指标状态",
          type: "radio",
          options: [
            {
              value: "0",
              text: "停用",
            },
            {
              value: "1",
              text: "启用",
            },
          ],
          model: "statIndctStatus",
        },
        {
          label: "启用时间",
          type: "datetime",
          options: [],
          model: "statIndctStartDate",
        },
        {
          label: "停用时间",
          type: "datetime",
          options: [],
          model: "statIndctStopDate",
        },
      ],
      //表单验证规则
      indexFormRules: {
        statIndctStatus: [
          { required: true, message: "请选择指标状态", trigger: "change" },
        ],
        statIndctStartDate: [
          { required: true, message: "请选择启用时间", trigger: "change" },
        ],
        statIndctStopDate: [
          { required: true, message: "请选择停用时间", trigger: "change" },
        ],
      },
      /** 指标信息结束 */

      /** 创建信息开始 */
      createFromPage: [
        {
          label: "创建时间",
          type: "datetime",
          options: [],
          model: "statIndctCreatDate",
        },
        {
          label: "创建机构版本",
          type: "input",
          options: [],
          model: "statIndctCreatOrgVersion",
        },
        {
          label: "创建机构名称",
          type: "input",
          options: [],
          model: "statIndctCreatOrgName",
        },
        {
          label: "创建机构电子邮箱",
          type: "input",
          options: [],
          model: "statIndctCreatOrgEmail",
        },
        {
          label: "创建机构联系人",
          type: "input",
          options: [],
          model: "statIndctCreatOrgContact",
        },
        {
          label: "创建机构联系电话",
          type: "input",
          options: [],
          model: "statIndctCreatOrgPhone",
        },
      ],
      //表单验证规则
      createFromRules: {
        statIndctCreatDate: [
          { required: true, message: "请选择创建时间", trigger: "change" },
        ],
        statIndctCreatOrgVersion: [
          { required: true, message: "请输入创建机构版本", trigger: "blur" },
        ],
      },
      /** 创建信息结束 */

      /** 管理信息开始 */
      manageFromPage: [
        {
          label: "指标管理级别",
          type: "select",
          options: [],
          model: "statIndctManageLevel",
        },
        {
          label: "管理机构版本",
          type: "input",
          options: [],
          model: "statIndctManageOrgVersion",
        },
        {
          label: "管理机构名称",
          type: "input",
          options: [],
          model: "statIndctManageOrgName",
        },
        {
          label: "管理机构联系人",
          type: "input",
          options: [],
          model: "statIndctManageOrgContact",
        },
        {
          label: "管理机构联系电话",
          type: "input",
          options: [],
          model: "statIndctManageOrgPhone",
        },
        {
          label: "管理结构电子邮箱",
          type: "input",
          options: [],
          model: "statIndctManageOrgEmail",
        },
        {
          label: "管理机构修订记录",
          type: "textarea",
          options: [],
          model: "statIndctManageOrgRevRec",
        },
      ],
      manageFromRules: {
        statIndctManageLevel: [
          { required: true, message: "请选择指标管理级别", trigger: "change" },
        ],
        statIndctManageOrgVersion: [
          { required: true, message: "请输入管理机构版本", trigger: "blur" },
        ],
      },
      /** 管理信息结束 */

      /** 审批信息开始 */
      approvalFromPage: [
        {
          label: "审批状态",
          type: "select",
          options: [],
          model: "statIndctCheckStatus",
        },
        {
          label: "审批意见",
          type: "input",
          options: [],
          model: "statIndctCheckOpinion",
        },
        {
          label: "审批时间",
          type: "datetime",
          options: [],
          model: "statIndctCheckDate",
        },
        {
          label: "审批机构审批人",
          type: "input",
          options: [],
          model: "statIndctCheckOrgApprover",
        },
      ],
      approvalFromRules: {
        statIndctCheckStatus: [
          { required: true, message: "请选择审批状态", trigger: "change" },
        ],
      },
      /** 审批信息结束 */
    };
  },
  computed: {
    codeListOption() {
      return function (id) {
        return this.$store.state.reqData[id] || [];
      };
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
};
</script>
<style lang="less" scoped>
.title-style {
  font-size: 18px;
}
.divider-style {
  margin: 15px 0;
}
.form-style {
  display: flex;
  flex-wrap: wrap;
  .form-item-style {
    width: 50%;
  }
}
</style>
