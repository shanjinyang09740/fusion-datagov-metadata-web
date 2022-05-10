<template>
  <div class="content">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="基本属性" name="first">
        <fu-form
          :rules="baseRules"
          ref="baseForm"
          label-width="100px"
          :fu-data="baseForm"
        >
          <fu-form-item label="中文名称" prop="themeName">
            <fu-input
              :disabled="disabled"
              v-model="baseForm.baseName"
              placeholder="请输入"
            ></fu-input>
          </fu-form-item>
          <fu-form-item label="英文名称" prop="themeName">
            <fu-input
              :disabled="disabled"
              v-model="baseForm.baseName"
              placeholder="请输入"
            ></fu-input>
          </fu-form-item>
          <fu-form-item label="别称" prop="themeCode">
            <fu-input
              :disabled="disabled"
              v-model="baseForm.baseCode"
              placeholder="请输入"
            ></fu-input>
          </fu-form-item>
          <fu-form-item label="分组代码" prop="themeCode">
            <fu-input
              :disabled="disabled"
              v-model="baseForm.baseCode"
              placeholder="请输入"
            ></fu-input>
          </fu-form-item>
          <fu-form-item label="标准分类标识" prop="themeCode">
            <fu-select
              :disabled="disabled"
              v-model="baseForm.code"
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
          <fu-form-item label="分组类型" prop="themeCode">
            <fu-select
              v-model="baseForm.code"
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
          <fu-form-item label="计算方法" prop="themeCode">
            <fu-input
              v-model="baseForm.baseCode"
              :disabled="disabled"
              placeholder="请输入"
            ></fu-input>
          </fu-form-item>
          <fu-form-item label="汇总类型" prop="themeCode">
            <fu-select
              v-model="baseForm.code"
              :disabled="disabled"
              placeholder="请选择"
              style="width: 100%"
              size="medium"
            >
              <fu-option
                v-for="i in summaryOptions"
                :key="i.value"
                :label="i.text"
                :value="i.value"
              >
              </fu-option>
            </fu-select>
          </fu-form-item>
          <fu-form-item label="版本" prop="themeCode">
            <fu-input
              v-model="baseForm.baseCode"
              :disabled="disabled"
              placeholder="请输入"
            ></fu-input>
          </fu-form-item>
          <fu-form-item label="版本说明" prop="themeCode">
            <fu-input
              v-model="baseForm.baseCode"
              :disabled="disabled"
              placeholder="请输入"
            ></fu-input>
          </fu-form-item>
          <fu-form-item label="分组编码规则" prop="themeCode">
            <fu-input
              v-model="baseForm.baseCode"
              :disabled="disabled"
              placeholder="请输入"
            ></fu-input>
          </fu-form-item>
        </fu-form>
      </el-tab-pane>
      <el-tab-pane label="管理属性" name="second"
        ><fu-form
          :rules="manageRules"
          ref="manageForm"
          label-width="100px"
          :fu-data="manageForm"
        >
          <fu-form-item label="分组状态" prop="state">
            <fu-select
              v-model="manageForm.code"
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
          <fu-form-item label="分组启用时间" prop="themeName">
            <fu-input
              v-model="manageForm.manageName"
              :disabled="disabled"
              placeholder="请输入"
            ></fu-input>
          </fu-form-item>
          <fu-form-item label="分组停用时间" prop="themeCode">
            <fu-input
              v-model="manageForm.manageCode"
              :disabled="disabled"
              placeholder="请输入"
            ></fu-input>
          </fu-form-item> </fu-form
      ></el-tab-pane>
      <el-tab-pane label="数据属性" name="third"
        ><fu-form
          :rules="dataRules"
          ref="dataForm"
          label-width="150px"
          :fu-data="dataForm"
        >
          <fu-form-item label="数据类型" prop="statIndctDataType">
            <fu-select
              v-model="dataForm.statIndctDataType"
              :disabled="disabled"
              placeholder="请选择"
              style="width: 100%"
              size="medium"
            >
              <fu-option
                v-for="i in statIndctDataTypeOptions"
                :key="i.value"
                :label="i.text"
                :value="i.value"
              >
              </fu-option>
            </fu-select>
          </fu-form-item>
          <fu-form-item label="数据表示格式" prop="statIndctDataStyle">
            <fu-select
              v-model="dataForm.statIndctDataStyle"
              :disabled="disabled"
              placeholder="请选择"
              style="width: 100%"
              size="medium"
            >
              <fu-option
                v-for="i in statIndctDataStyleOptions"
                :key="i.value"
                :label="i.text"
                :value="i.value"
              >
              </fu-option>
            </fu-select>
          </fu-form-item>
          <fu-form-item label="数据精度" prop="statIndctDataPrecison">
            <fu-input
              v-model="dataForm.statIndctDataPrecison"
              :disabled="disabled"
              placeholder="请输入"
            ></fu-input>
          </fu-form-item>
          <fu-form-item label="数据长度" prop="statIndctDataLength">
            <fu-input
              v-model="dataForm.statIndctDataLength"
              :disabled="disabled"
              placeholder="请输入"
            ></fu-input>
          </fu-form-item>
          <fu-form-item label="数据取值范围_最大值" prop="Stat_Indct_Data_Range_Max">
            <fu-input
              v-model="dataForm.Stat_Indct_Data_Range_Max"
              :disabled="disabled"
              placeholder="请输入"
            ></fu-input>
          </fu-form-item>
          <fu-form-item label="数据取值范围_最小值" prop="statIndctDataRangeMin">
            <fu-input
              v-model="dataForm.statIndctDataRangeMin"
              :disabled="disabled"
              placeholder="请输入"
            ></fu-input>
          </fu-form-item>
        </fu-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { Select, Option, Input, Form, FormItem } from "fusion-ui";
export default {
  components: {
    FuSelect: Select,
    FuOption: Option,
    FuInput: Input,
    FuForm: Form,
    FuFormItem: FormItem,
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
  },
  data() {
    return {
      activeName: "first",
      baseForm: {},
      manageForm: {},
      dataForm: {},
      baseRules: {
        folderName: [
          { required: true, message: "请填写中文名称", trigger: "blur" },
        ],
        folderCode: [
          { required: true, message: "请填写分组代码", trigger: "blur" },
        ],
        version: [{ required: true, message: "请填写版本", trigger: "blur" }],
        state: [
          { required: true, message: "请选择标准分类标识", trigger: "change" },
        ],
        type: [
          { required: true, message: "请选择分组类型", trigger: "change" },
        ],
        typesum: [
          { required: true, message: "请选择汇总类型", trigger: "change" },
        ],
      },
      manageRules: {
        state: [
          { required: true, message: "请选择分组状态", trigger: "change" },
        ],
      },
      dataRules: {},
      statIndctDataTypeOptions: [],
      statIndctDataStyleOptions: [],
      standardOptions: [
        {
          text: "国家统计标准",
          value: "",
        },
        {
          text: "部门统计标准",
          value: "",
        },
        {
          text: "专业统计标准",
          value: "",
        },
        {
          text: "地方统计标准",
          value: "",
        },
        {
          text: "其他",
          value: "",
        },
      ],
      groupOptions: [
        {
          text: "分组",
          value: "",
        },
        {
          text: "派生分组",
          value: "",
        },
      ],
      summaryOptions: [
        {
          text: "最大值",
          value: "",
        },
        {
          text: "最小值",
          value: "",
        },
        {
          text: "平均值",
          value: "",
        },
        {
          text: "求和",
          value: "",
        },
        {
          text: "计数",
          value: "",
        },
        {
          text: "其他(请在备注注明)",
          value: "",
        },
      ],
      StateOptions: [
        {
          text: "启用",
          value: "",
        },
        {
          text: "停用",
          value: "",
        },
      ],
    };
  },
  created() {
    this.baseForm.Stat_Group_Code = "FZ" + this.getRandomSixDigit();
  },
  methods: {
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
<style lang="less" scoped>
.content {
  max-height: 500px;
  overflow: auto;
}
</style>
