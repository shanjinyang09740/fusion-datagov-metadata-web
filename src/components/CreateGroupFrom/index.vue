<template>
  <div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="基本属性" name="first">
        <fu-form
          class="form"
          :rules="baseRules"
          ref="baseForm"
          label-width="100px"
          :fu-data="baseForm"
        >
          <fu-row>
            <fu-col :span="8">
              <fu-form-item label="名称" prop="statGroupNameCh">
                <fu-input
                  :disabled="disabled"
                  v-model="baseForm.statGroupNameCh"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
            <fu-col :span="8">
              <fu-form-item label="编码" prop="statGroupCode">
                <fu-input
                  :disabled="disabled"
                  v-model="baseForm.statGroupCode"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
            <fu-col :span="8">
              <fu-form-item label="英文名" prop="statGroupCode">
                <fu-input
                  :disabled="disabled"
                  v-model="baseForm.statGroupCode"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
          </fu-row>
          <fu-row>
            <fu-col :span="8">
              <fu-form-item label="别名" prop="statGroupAlias">
                <fu-input
                  :disabled="disabled"
                  v-model="baseForm.statGroupAlias"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
            <fu-col :span="8">
              <fu-form-item label="顺序号" prop="sortNum">
                <fu-input
                  :disabled="disabled"
                  v-model="baseForm.sortNum"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
            <fu-col :span="8">
              <fu-form-item label="汇总类型" prop="aggregateType">
                <fu-select
                  v-model="baseForm.aggregateType"
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
            </fu-col>
          </fu-row>
          <fu-row>
            <fu-col :span="8">
              <fu-form-item label="版本" prop="statGroupVersion">
                <fu-input
                  v-model="baseForm.statGroupVersion"
                  :disabled="disabled"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
            <fu-col :span="8">
              <fu-form-item label="标准分类标识" prop="statCatalogStandardId">
                <fu-select
                  :disabled="disabled"
                  v-model="baseForm.statCatalogStandardId"
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
            <fu-col :span="8">
              <fu-form-item
                v-if="type === 'group'"
                label="分组类型"
                prop="statGroupType"
              >
                <fu-select
                  v-model="baseForm.statGroupType"
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
          <fu-form-item label="版本说明" prop="statGroupVersionDesc">
            <fu-input
              v-model="baseForm.statGroupVersionDesc"
              :disabled="disabled"
              placeholder="请输入"
              type="textarea"
              :rows="2"
            ></fu-input>
          </fu-form-item>
          <fu-form-item label="分组编码规则" prop="statGroupCodeRule">
            <fu-input
              v-model="baseForm.statGroupCodeRule"
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
              <fu-form-item label="状态" prop="statGroupStatus">
                <fu-select
                  v-model="baseForm.statGroupStatus"
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
              <fu-form-item label="启用时间" prop="statGroupStartDate">
                <fu-input
                  v-model="baseForm.statGroupStartDate"
                  :disabled="disabled"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
            <fu-col :span="8">
              <fu-form-item label="停用时间" prop="statGroupStopDate">
                <fu-input
                  v-model="baseForm.statGroupStopDate"
                  :disabled="disabled"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
          </fu-row>
          <fu-row>
            <fu-col :span="8">
              <fu-form-item label="创建时间" prop="createTime">
                <fu-input
                  v-model="baseForm.createTime"
                  :disabled="disabled"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
            <fu-col :span="8">
              <fu-form-item label="创建机构版本" prop="createTime">
                <fu-input
                  v-model="baseForm.createTime"
                  :disabled="disabled"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
            <fu-col :span="8">
              <fu-form-item label="创建机构名称" prop="createTime">
                <fu-input
                  v-model="baseForm.createTime"
                  :disabled="disabled"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
          </fu-row>
          <fu-row>
            <fu-col :span="8">
              <fu-form-item label="创建机构联系人" prop="createTime">
                <fu-input
                  v-model="baseForm.createTime"
                  :disabled="disabled"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
            <fu-col :span="8">
              <fu-form-item label="创建机构联系电话" prop="createTime">
                <fu-input
                  v-model="baseForm.createTime"
                  :disabled="disabled"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
            <fu-col :span="8">
              <fu-form-item label="创建机构电子邮箱" prop="createTime">
                <fu-input
                  v-model="baseForm.createTime"
                  :disabled="disabled"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
          </fu-row>
          <fu-row>
            <fu-col :span="8">
              <fu-form-item label="管理级别" prop="createTime">
                <fu-input
                  v-model="baseForm.createTime"
                  :disabled="disabled"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
            <fu-col :span="8">
              <fu-form-item label="管理机构版本" prop="createTime">
                <fu-input
                  v-model="baseForm.createTime"
                  :disabled="disabled"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
            <fu-col :span="8">
              <fu-form-item label="管理机构名称" prop="createTime">
                <fu-input
                  v-model="baseForm.createTime"
                  :disabled="disabled"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
          </fu-row>
          <fu-row>
            <fu-col :span="8">
              <fu-form-item label="管理机构联系人" prop="createTime">
                <fu-input
                  v-model="baseForm.createTime"
                  :disabled="disabled"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
            <fu-col :span="8">
              <fu-form-item label="管理机构联系电话" prop="createTime">
                <fu-input
                  v-model="baseForm.createTime"
                  :disabled="disabled"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
            <fu-col :span="8">
              <fu-form-item label="管理机构电子邮箱" prop="createTime">
                <fu-input
                  v-model="baseForm.createTime"
                  :disabled="disabled"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
          </fu-row>

          <fu-form-item label="管理机构修订记录" prop="createTime">
            <fu-input
              v-model="baseForm.createTime"
              :disabled="disabled"
              placeholder="请输入"
              type="textarea"
              :rows="2"
            ></fu-input>
          </fu-form-item>
          <fu-row>
            <fu-col :span="8">
              <fu-form-item label="提交审批时间" prop="createTime">
                <fu-input
                  v-model="baseForm.createTime"
                  :disabled="disabled"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
            <fu-col :span="8">
              <fu-form-item label="审批时间" prop="createTime">
                <fu-input
                  v-model="baseForm.createTime"
                  :disabled="disabled"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>

            <fu-col :span="8">
              <fu-form-item label="审批状态" prop="createTime">
                <fu-input
                  v-model="baseForm.createTime"
                  :disabled="disabled"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
          </fu-row>
          <fu-row>
            <fu-col :span="8">
              <fu-form-item label="审批意见" prop="createTime">
                <fu-input
                  v-model="baseForm.createTime"
                  :disabled="disabled"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
            <fu-col :span="8">
              <fu-form-item label="审批机构版本" prop="createTime">
                <fu-input
                  v-model="baseForm.createTime"
                  :disabled="disabled"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
            <fu-col :span="8">
              <fu-form-item label="审批机构名称" prop="createTime">
                <fu-input
                  v-model="baseForm.createTime"
                  :disabled="disabled"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
          </fu-row>
          <fu-row>
            <fu-col :span="8">
              <fu-form-item label="审批机构审批人" prop="createTime">
                <fu-input
                  v-model="baseForm.createTime"
                  :disabled="disabled"
                  placeholder="请输入"
                ></fu-input>
              </fu-form-item>
            </fu-col>
          </fu-row>
          <fu-form-item label="审批机构修订记录" prop="createTime">
            <fu-input
              v-model="baseForm.createTime"
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
import { Row, Col, Select, Option, Input, Form, FormItem } from "fusion-ui";
export default {
  components: {
    FuRow: Row,
    FuCol: Col,
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
        aggregateType: "",
        partitionCode: "",
        partitionName: "",
        statCatalogStandardId: "",
        statGroupAlias: "",
        statGroupCode: "",
        statGroupCodeRule: "",
        statGroupFolderId: "",
        statGroupId: "",
        statGroupNameCh: "",
        statGroupType: "",
        statGroupVersion: "",
        statGroupVersionDesc: "",
        statGroupStatus: "",
        statGroupStartDate: "",
        statGroupStopDate: "",
      },
      baseRules: {
        statGroupNameCh: [
          { required: true, message: "请填写名称", trigger: "blur" },
        ],
        statGroupCode: [
          { required: true, message: "请填写代码", trigger: "blur" },
        ],
        statGroupVersion: [
          { required: true, message: "请填写版本", trigger: "blur" },
        ],
        statCatalogStandardId: [
          { required: true, message: "请选择标准分类标识", trigger: "change" },
        ],
        statGroupType: [
          { required: true, message: "请选择分组类型", trigger: "change" },
        ],
        aggregateType: [
          { required: true, message: "请选择汇总类型", trigger: "change" },
        ],
      },
      manageRules: {
        statGroupStatus: [
          { required: true, message: "请选择状态", trigger: "change" },
        ],
      },
      standardOptions: [
        {
          text: "国家统计标准",
          value: "1",
        },
        {
          text: "部门统计标准",
          value: "2",
        },
        {
          text: "专业统计标准",
          value: "3",
        },
        {
          text: "地方统计标准",
          value: "4",
        },
        {
          text: "其他",
          value: "5",
        },
      ],
      groupOptions: [
        {
          text: "分组",
          value: "1",
        },
        {
          text: "派生分组",
          value: "2",
        },
      ],
      summaryOptions: [
        {
          text: "最大值",
          value: "1",
        },
        {
          text: "最小值",
          value: "2",
        },
        {
          text: "平均值",
          value: "3",
        },
        {
          text: "求和",
          value: "4",
        },
        {
          text: "计数",
          value: "5",
        },
        {
          text: "其他",
          value: "9",
        },
      ],
      StateOptions: [
        {
          text: "启用",
          value: "0",
        },
        {
          text: "停用",
          value: "1",
        },
      ],
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
  mounted() {
    if (this.type === "group") {
      this.baseForm.statGroupCode = "FEN" + this.getRandomSixDigit();
    } else if (this.type === "catalog") {
      this.baseForm.statGroupCode = "CAT" + this.getRandomSixDigit();
    }
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
