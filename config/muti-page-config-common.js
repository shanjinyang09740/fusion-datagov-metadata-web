//配置页面
var productPages = {
  index: {
    entry: "src/main.js",
    template: "public/index.html",
    filename: "index.html",
    title: "首页",
  },
  basicAttribute: {
    entry: "src/pages/BasicAttribute/index.js",
    template: "public/index.html",
    filename: "basicAttribute.html",
    title: "基础属性管理",
  },
  variableManage: {
    entry: "src/pages/VariableManage/index.js",
    template: "public/index.html",
    filename: "variableManage.html",
    title: "变量管理列表",
  },
  indicatorManage: {
    entry: "src/pages/IndicatorManage/index.js",
    template: "public/index.html",
    filename: "indicatorManage.html",
    title: "指标管理",
  },
  dataConflictCheck: {
    entry: "src/pages/DataConflictCheck/main.js",
    template: "public/index.html",
    filename: "dataConflictCheck.html",
    title: "数据冲突检查",
  },
  dataVolatilityCheck: {
    entry: "src/pages/DataVolatilityCheck/main.js",
    template: "public/index.html",
    filename: "dataVolatilityCheck.html",
    title: "数据波动性检查",
  },
  measureVerificationSetting: {
    entry: "src/pages/MeasureVerificationSetting/index.js",
    template: "public/index.html",
    filename: "measureVerificationSetting.html",
    title: "指标检查配置",
  },
  administrativeDivision: {
    entry: "src/pages/AdministrativeDivision/index.js",
    template: "public/index.html",
    filename: "administrativeDivision.html",
    title: "行政区划",
  },
  administrativeArea: {
    entry: "src/pages/AdministrativeArea/index.js",
    template: "public/index.html",
    filename: "administrativeArea.html",
    title: "行政区域",
  },
  groupCatalogue: {
    entry: "src/pages/GroupCatalogue/index.js",
    template: "public/index.html",
    filename: "groupCatalogue.html",
    title: "分组目录",
  },
  groupCatalogueSearch: {
    entry: "src/pages/GroupCatalogueSearch/index.js",
    template: "public/index.html",
    filename: "GroupCatalogueSearch.html",
    title: "分组目录查询",
  },
  timeFrame: {
    entry: "src/pages/TimeFrame/index.js",
    template: "public/index.html",
    filename: "TimeFrame.html",
    title: "时间框架",
  },
  publicDimension: {
    entry: "src/pages/PublicDimension/index.js",
    template: "public/index.html",
    filename: "PublicDimension.html",
    title: "公共维度",
  },
  IndicatorQuery: {
    entry: "src/pages/IndicatorQuery/index.js",
    template: "public/index.html",
    filename: "IndicatorQuery.html",
    title: "元数据查询",
  },
};

//打包
var pages = Object.assign({}, productPages);

module.exports = pages;
