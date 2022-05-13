<template>
  <div>
    <div class="index-main">
      <div class="title-style">
        <span>指标信息</span>
      </div>
      <fu-divider class="divider-style"></fu-divider>
      <template>
        <div>
          <fu-form
            class="form-style"
            ref="indexForm"
            :rules="indexFormRules"
            :fu-data="basicPropertyForm"
          >
            <template v-for="formI in indexFormPage">
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
                  v-model="basicPropertyForm[formI.model]"
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
                  v-model="basicPropertyForm[formI.model]"
                  style="width: 75.5%"
                  :placeholder="'请输入' + formI.label"
                  :disabled="disabled"
                ></fu-input>
                <span v-else>
                  {{ basicPropertyForm[formI.model] }}
                </span>
              </fu-form-item>
            </template>
          </fu-form>
        </div>
      </template>
    </div>
    <div class="type-main">
      <div class="title-style">
        <span>类型信息</span>
      </div>
      <fu-divider class="divider-style"></fu-divider>
      <template>
        <div>
          <fu-form
            class="type-form"
            ref="typeForm"
            :rules="typeFormRules"
            :fu-data="basicPropertyForm"
          >
            <template v-for="formI in typeFormPage">
              <fu-form-item
                class="type-form-item"
                :label="formI.label"
                label-width="130px"
                :key="formI.model"
                :prop="formI.model"
              >
                <fu-radio-group
                  v-if="formI.type === 'radio'"
                  v-model="basicPropertyForm[formI.model]"
                >
                  <fu-radio
                    :disabled="disabled"
                    v-for="item in formI.options"
                    :key="item.value"
                    :label="item.value"
                    >{{ item.text }}</fu-radio
                  >
                </fu-radio-group>
                <fu-checkbox-group
                  v-else-if="formI.type === 'checkbox'"
                  v-model="formI.checkboxArr"
                >
                  <fu-checkbox
                    v-for="item in formI.options"
                    :key="item.value"
                    :label="item.value"
                    :disabled="disabled"
                    >{{ item.text }}</fu-checkbox
                  >
                </fu-checkbox-group>
                <fu-input
                  v-else-if="formI.type === 'input'"
                  size="medium"
                  v-model="basicPropertyForm[formI.model]"
                  style="width: 75.5%"
                  :placeholder="'请输入' + formI.label"
                  :disabled="disabled"
                ></fu-input>
                <span v-else>
                  {{ basicPropertyForm[formI.model] }}
                </span>
              </fu-form-item>
            </template>
          </fu-form>
        </div>
      </template>
    </div>
    <div class="explain-main">
      <div class="title-style">
        <span>说明信息</span>
      </div>
      <fu-divider class="divider-style"></fu-divider>
      <template>
        <div>
          <fu-form
            class="form-style"
            ref="explainForm"
            :fu-data="basicPropertyForm"
          >
            <template v-for="formI in explainFormPage">
              <fu-form-item
                class="form-item-style"
                :label="formI.label"
                label-width="130px"
                :key="formI.model"
                :prop="formI.model"
              >
                <fu-radio-group
                  v-if="formI.type === 'radio'"
                  v-model="basicPropertyForm[formI.model]"
                  :disabled="disabled"
                >
                  <fu-radio
                    v-for="item in formI.options"
                    :key="item.value"
                    :label="item.value"
                    >{{ item.text }}</fu-radio
                  >
                </fu-radio-group>
                <fu-input
                  v-else-if="formI.type === 'input'"
                  size="medium"
                  v-model="basicPropertyForm[formI.model]"
                  style="width: 75.5%"
                  :placeholder="'请输入' + formI.label"
                  :disabled="disabled"
                ></fu-input>
                <span v-else>
                  {{ basicPropertyForm[formI.model] }}
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
  Checkbox,
  CheckboxGroup,
} from "fusion-ui";
export default {
  name: "basicPropertyForm",
  props: {
    basicPropertyForm: {
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
    FuCheckbox: Checkbox,
    FuCheckboxGroup: CheckboxGroup,
  },
  data() {
    return {
      disabled: false,
      /** 指标信息开始 */
      indexFormPage: [
        {
          label: "名称",
          type: "input",
          options: [],
          model: "statIndctNameCh",
        },
        {
          label: "编码",
          type: "input",
          options: [],
          model: "statIndctCode",
        },
        {
          label: "别名",
          type: "input",
          options: [],
          model: "statIndctNicknameCh",
        },
        {
          label: "英文名",
          type: "input",
          options: [],
          model: "statIndctNameEn",
        },
        {
          label: "层级",
          type: "input",
          options: [],
          model: "statIndctLevel",
        },
        {
          label: "顺序号",
          type: "input",
          options: [],
          model: "statIndctSortNum",
        },
        {
          label: "版本",
          type: "input",
          options: [],
          model: "statIndctVersion",
        },
        {
          label: "版本说明",
          type: "input",
          options: [],
          model: "statIndctVersionDesc",
        },
        {
          label: "量纲",
          type: "select",
          options: [],
          model: "statIndctUmDimension",
          req: {
            // url: "/api/core/v1/dictionary/queryData.do?dicId=HYSLX",
            // params: [],
          },
        },
        {
          label: "计量单位",
          type: "select",
          options: [],
          model: "statIndctUm",
          req: {
            // url: "/api/core/v1/dictionary/queryData.do?dicId=HYSLX",
            // params: [],
          },
        },
        {
          label: "汇总类型",
          type: "select",
          options: [],
          model: "statIndctAggregateType",
          req: {
            // url: "/api/core/v1/dictionary/queryData.do?dicId=HYSLX",
            // params: [],
          },
        },
        {
          label: "指标出处",
          type: "select",
          options: [],
          model: "statIndctSource",
          req: {
            // url: "/api/core/v1/dictionary/queryData.do?dicId=HYSLX",
            // params: [],
          },
        },
      ],
      //表单验证规则
      indexFormRules: {
        statIndctNameCh: [
          { required: true, message: "请输入名称", trigger: "blur" },
        ],
        statIndctCode: [
          { required: true, message: "请输入编码", trigger: "blur" },
        ],
        statIndctLevel: [
          { required: true, message: "请输入层级", trigger: "blur" },
        ],
        statIndctSortNum: [
          { required: true, message: "请输入顺序号", trigger: "blur" },
        ],
        statIndctVersion: [
          { required: true, message: "请输入版本", trigger: "blur" },
        ],
        statIndctAggregateType: [
          { required: true, message: "请选择汇总类型", trigger: "change" },
        ],
      },
      /** 指标信息结束 */

      /** 类型信息开始 */
      typeFormPage: [
        {
          label: "指标类型(一)",
          type: "checkbox",
          options: [
            {
              value: "1",
              text: "调查指标",
            },
            {
              value: "2",
              text: "综合指标",
            },
            {
              value: "3",
              text: "分析指标",
            },
          ],
          model: "statIndctType1",
          checkboxArr: [],
        },
        {
          label: "指标类型(二)",
          type: "radio",
          options: [
            {
              value: "1",
              text: "原生指标",
            },
            {
              value: "2",
              text: "派生指标",
            },
          ],
          model: "statIndctType2",
        },
        {
          label: "指标类型(三)",
          type: "radio",
          options: [
            {
              value: "1",
              text: "实物量指标",
            },
            {
              value: "2",
              text: "价值量指标",
            },
            {
              value: "3",
              text: "相对量指标",
            },
            {
              value: "9",
              text: "其他",
            },
          ],
          model: "statIndctType3",
        },
        {
          label: "计算方法",
          type: "input",
          options: [],
          model: "statIndctAlgorithm",
        },
      ],
      //表单验证规则
      typeFormRules: {
        statIndctType1: [
          { required: true, message: "请选择指标类型(一)", trigger: "change" },
        ],
        statIndctType2: [
          { required: true, message: "请选择指标类型(二)", trigger: "change" },
        ],
        statIndctType3: [
          { required: true, message: "请选择指标类型(三)", trigger: "change" },
        ],
      },
      /** 类型信息结束 */

      /** 说明信息开始 */
      explainFormPage: [
        {
          label: "指标用途",
          type: "input",
          options: [],
          model: "statIndctPurpose",
        },
        {
          label: "指标解释",
          type: "input",
          options: [],
          model: "statIndctDesc",
        },
        {
          label: "内涵定义",
          type: "input",
          options: [],
          model: "statIndctIntensionDefine",
        },
        {
          label: "外延定义",
          type: "input",
          options: [],
          model: "statIndctExtensionDefine",
        },
        {
          label: "资料来源",
          type: "input",
          options: [],
          model: "statIndctDatasource",
        },
        {
          label: "填报说明",
          type: "input",
          options: [],
          model: "statIndctFillDesc",
        },
      ],
      /** 说明信息结束 */
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
