<template>
  <div>
    <fu-form
      class="form-style"
      ref="indexForm"
      :rules="indexFormRules"
      :fu-data="dataPropertyForm"
    >
      <template v-for="formI in indexFormPage">
        <fu-form-item
          v-if="
            formI.type !== 'regionCheckbox' &&
            formI.type !== 'dataAcquisitionCheckbox' &&
            formI.type !== 'dataUsageCheckbox'
          "
          class="form-item-style"
          :label="formI.label"
          label-width="150px"
          :key="formI.model"
          :prop="formI.model"
        >
          <fu-select
            v-if="formI.type === 'select'"
            :placeholder="'请选择' + formI.label"
            clearable
            v-model="dataPropertyForm[formI.model]"
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
            v-model="dataPropertyForm[formI.model]"
            style="width: 75.5%"
            :placeholder="'请输入' + formI.label"
            :disabled="disabled"
          ></fu-input>
          <span v-else>
            {{ dataPropertyForm[formI.model] }}
          </span>
        </fu-form-item>
        <div
          v-if="formI.type === 'regionCheckbox'"
          :key="formI.label"
          style="width: 100%"
        >
          <fu-form-item
            :label="formI.label"
            label-width="150px"
            :key="formI.model"
            :prop="formI.model"
          >
            <fu-checkbox-group v-model="formI.checkboxArr">
              <fu-checkbox
                v-for="item in formI.options"
                :key="item.value"
                :label="item.value"
                :disabled="disabled"
                >{{ item.text }}</fu-checkbox
              >
            </fu-checkbox-group>
          </fu-form-item>
        </div>
        <div
          v-if="formI.type === 'dataAcquisitionCheckbox'"
          :key="formI.label"
          style="width: 100%"
        >
          <fu-form-item
            :label="formI.label"
            label-width="150px"
            :key="formI.model"
            :prop="formI.model"
          >
            <fu-checkbox-group v-model="formI.checkboxArr">
              <fu-checkbox
                v-for="item in formI.options"
                :key="item.value"
                :label="item.value"
                :disabled="disabled"
                >{{ item.text }}</fu-checkbox
              >
            </fu-checkbox-group>
          </fu-form-item>
        </div>
        <div
          v-if="formI.type === 'dataUsageCheckbox'"
          :key="formI.label"
          style="width: 100%"
        >
          <fu-form-item
            :label="formI.label"
            label-width="150px"
            :key="formI.model"
            :prop="formI.model"
          >
            <template v-for="item in formI.options"
              ><div :label="item.label" :prop="item.model" :key="item.model">
                <span>{{ item.label }}</span>
                <fu-checkbox-group
                  v-model="formI.checkboxArr"
                  :key="item.model"
                >
                  <fu-checkbox
                    :disabled="disabled"
                    v-for="item in item.options"
                    :key="item.value"
                    :label="item.value"
                    >{{ item.text }}</fu-checkbox
                  >
                </fu-checkbox-group>
              </div>
            </template>
          </fu-form-item>
        </div>
      </template>
    </fu-form>
  </div>
</template>

<script>
import {
  Input,
  Form,
  FormItem,
  Select,
  // Radio,
  // RadioGroup,
  // Divider,
  Option,
  Checkbox,
  CheckboxGroup,
} from "fusion-ui";
export default {
  name: "dataPropertyForm",
  props: {
    dataPropertyForm: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    FuInput: Input,
    FuSelect: Select,
    FuForm: Form,
    FuFormItem: FormItem,
    // FuRadio: Radio,
    // FuRadioGroup: RadioGroup,
    // FuDivider: Divider,
    FuOption: Option,
    FuCheckbox: Checkbox,
    FuCheckboxGroup: CheckboxGroup,
  },
  data() {
    return {
      disabled: false,
      indexFormPage: [
        {
          label: "数据类型",
          type: "select",
          options: [],
          model: "statIndctDataType",
        },
        {
          label: "数据表示格式",
          type: "select",
          options: [],
          model: "statIndctDataStyle",
        },
        {
          label: "数据精度",
          type: "input",
          options: [],
          model: "statIndctDataPrecison",
        },
        {
          label: "数据长度",
          type: "input",
          options: [],
          model: "statIndctDataLength",
        },
        {
          label: "数据取值范围_最大值",
          type: "input",
          options: [],
          model: "statIndctDataRangeMax",
        },
        {
          label: "数据取值范围_最小值",
          type: "input",
          options: [],
          model: "statIndctDataRangeMin",
        },
        {
          label: "分地区数据级别",
          type: "regionCheckbox",
          options: [
            {
              value: "0",
              text: "省级",
            },
            {
              value: "1",
              text: "地级",
            },
            {
              value: "2",
              text: "县级",
            },
            {
              value: "3",
              text: "乡级",
            },
            {
              value: "4",
              text: "无",
            },
          ],
          model: "statIndctDataRegionLevel",
          checkboxArr: [],
        },
        {
          label: "数据获取渠道",
          type: "dataAcquisitionCheckbox",
          options: [
            {
              value: "0",
              text: "统计局调查",
            },
            {
              value: "1",
              text: "调查队调查",
            },
            {
              value: "2",
              text: "部门调查",
            },
            {
              value: "3",
              text: "部门行政记录",
            },
            {
              value: "4",
              text: "计算(估算、推算)",
            },
            {
              value: "5",
              text: "大数据抓取",
            },
            {
              value: "6",
              text: "其他",
            },
          ],
          model: "statIndctDataAcquisitionChannel",
          checkboxArr: [],
        },
        {
          label: "数据使用",
          type: "dataUsageCheckbox",
          options: [
            {
              label: "对外公布",
              options: [
                {
                  value: "0",
                  text: "年鉴",
                },
                {
                  value: "1",
                  text: "统计公报",
                },
                {
                  value: "2",
                  text: "统计资料",
                },
                {
                  value: "3",
                  text: "内网",
                },
                {
                  value: "4",
                  text: "外网",
                },
                {
                  value: "5",
                  text: "其他",
                },
              ],
              model: "duiwai",
            },
            {
              label: "内部使用",
              options: [
                {
                  value: "0",
                  text: "提供上级部门",
                },
                {
                  value: "1",
                  text: "提供同级部门",
                },
                {
                  value: "2",
                  text: "反馈下级统计机构",
                },
                {
                  value: "3",
                  text: "数据质量评估",
                },
                {
                  value: "4",
                  text: "统计资料",
                },
                {
                  value: "5",
                  text: "其他",
                },
              ],
              model: "neibu",
            },
          ],
          model: "statIndctDataPurpose",
          checkboxArr: [],
        },
      ],
      //表单验证规则
      indexFormRules: {
        statIndctDataType: [
          { required: true, message: "请选择数据类型", trigger: "change" },
        ],
        statIndctDataStyle: [
          { required: true, message: "请选择数据表示格式", trigger: "change" },
        ],
        statIndctDataRegionLevel: [
          {
            required: true,
            message: "请选择分地区数据级别",
            trigger: "change",
          },
        ],
        statIndctDataAcquisitionChannel: [
          { required: true, message: "请选择数据获取渠道", trigger: "change" },
        ],
        statIndctDataPurpose: [
          { required: true, message: "请选择数据使用", trigger: "change" },
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
  },
  watch: {},
  beforeCreate() {},
  created() {
    // this.initCheckbox();
  },
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    initCheckbox() {
      for (const formI of this.indexFormPage) {
        if (
          formI.type === "regionCheckbox" ||
          formI.type === "dataAcquisitionCheckbox" ||
          formI.type === "dataUsageCheckbox"
        ) {
          for (const item of formI.options) {
            formI.checkboxArr.push(item.value);
          }
        }
      }
    },
  },
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
