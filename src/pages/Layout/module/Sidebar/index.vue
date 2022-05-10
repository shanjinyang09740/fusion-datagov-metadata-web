<template>
  <div>
    <fu-menu
      background-color="#21304D"
      active-text-color="#ffd04b"
      text-color="#fff"
      style="width: 100%"
      :unique-opened="true"
      :default-active="defaultActiveMenue"
      :default-openeds="['1']"
      @select="select"
    >
      <aside-child :menuList="menuList"></aside-child>
    </fu-menu>
  </div>
</template>

<script>
import AsideChild from "./AsideChild";
import { Menu } from "fusion-ui";

export default {
  components: {
    FuMenu: Menu,
    AsideChild,
  },
  data() {
    return {
      //默认激活高亮菜单
      defaultActiveMenue: "/itemizedManage.html",
      //侧边栏菜单
      menuList: [
        {
          id: "1",
          text: "基础属性管理",
          children: [
            {
              id: "1-1",
              text: "指标",
              src: "/basicAttribute.html?type=target",
            },
            {
              id: "1-2",
              text: "分组",
              src: "/basicAttribute.html?type=group",
            },
            {
              id: "1-3",
              text: "分项",
              src: "/basicAttribute.html?type=subitem",
            },
            {
              id: "1-4",
              text: "变量",
              src: "/basicAttribute.html?type=variable",
            },
            {
              id: "1-5",
              text: "数据归属地",
              src: "/basicAttribute.html?type=dataOwnership",
            },
            {
              id: "1-6",
              text: "时间框架",
              src: "/basicAttribute.html?type=timeFrame",
            },
            {
              id: "1-7",
              text: "报告期别",
              src: "/basicAttribute.html?type=reportPeriod",
            },
            {
              id: "1-8",
              text: "数据可信度",
              src: "/basicAttribute.html?type=dataCredibility",
            },
            {
              id: "1-9",
              text: "数据密级",
              src: "/basicAttribute.html?type=dataSecurityLevel",
            },
          ],
        },
        {
          id: "2",
          text: "宏观标签管理",
          children: [
            {
              id: "2-1",
              text: "指标",
              src: "/indicatorManage.html?type=macro",
            },
            {
              id: "2-2",
              text: "分组",
              src: "/groupCatalogue.html?type=group",
            },
            {
              id: "2-5",
              text: "目录",
              src: "/groupCatalogue.html?type=catalog",
            },
            {
              id: "2-3",
              text: "时间框架",
              src: "/TimeFrame.html?type=macro",
            },
            {
              id: "2-4",
              text: "维度",
              src: "",
              children: [
                {
                  id: "2-4-1",
                  text: "地理区划",
                  src: "",
                  children: [
                    {
                      id: "2-4-1-1",
                      text: "行政区划",
                      src: "/administrativeDivision.html?type=macro",
                    },
                    {
                      id: "2-4-1-2",
                      text: "行政区域",
                      src: "/administrativeArea.html",
                    },
                  ],
                },
                {
                  id: "2-4-2",
                  text: "公共维度",
                  src: "",
                  children: [
                    {
                      id: "2-4-2-1",
                      text: "数据归属地",
                      src: "/PublicDimension.html?type=macro&page=dataOwnership",
                    },
                    {
                      id: "2-4-2-2",
                      text: "报告期别",
                      src: "/PublicDimension.html?type=macro&page=reportDate",
                    },
                    {
                      id: "2-4-2-3",
                      text: "数据可信度",
                      src: "/PublicDimension.html?type=macro&page=dataCredibility",
                    },
                    {
                      id: "2-4-2-4",
                      text: "数据密级",
                      src: "/PublicDimension.html?type=macro&page=dataSecurity",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "3",
          text: "微观标签管理",
          children: [
            {
              id: "3-1",
              text: "指标",
              src: "",
            },
            {
              id: "3-2",
              text: "分组目录",
              src: "/groupCatalogue.html?type=micro",
            },
            {
              id: "3-3",
              text: "时间框架",
              src: "/TimeFrame.html?type=micro",
            },
            {
              id: "3-4",
              text: "维度",
              src: "",
              children: [
                {
                  id: "3-4-1",
                  text: "地理区划",
                  src: "",
                  children: [
                    {
                      id: "3-4-1-1",
                      text: "行政区划",
                      src: "",
                    },
                    {
                      id: "3-4-1-2",
                      text: "行政区域",
                      src: "",
                    },
                  ],
                },
                {
                  id: "3-2",
                  text: "公共维度",
                  src: "",
                },
              ],
            },
          ],
        },
        {
          id: "4",
          text: "变量管理",
          children: [
            {
              id: "4-1",
              text: "变量管理列表",
              src: "/variableManage.html",
            },
          ],
        },
        {
          id: "5",
          text: "数据冲突",
          children: [
            {
              id: "5-1",
              text: "数据冲突检查",
              src: "/dataConflictCheck.html",
            },
            {
              id: "5-2",
              text: "数据波动性检查",
              src: "/dataVolatilityCheck.html",
            },
            {
              id: "5-3",
              text: "指标检查配置",
              src: "/measureVerificationSetting.html",
            },
          ],
        },
        {
          id: "6",
          text: "元数据查询",
          children: [
            {
              id: "6-1",
              text: "指标查询",
              src: "",
            },
            {
              id: "6-2",
              text: "分组查询",
              src: "/GroupCatalogueSearch.html?type=group",
            },
            {
              id: "6-3",
              text: "目录查询",
              src: "/GroupCatalogueSearch.html?type=catalog",
            },
          ],
        },
      ],
    };
  },
  mounted() {
    //初始化菜单
    this.initMenuActive();
  },
  methods: {
    /**
     * @description 初始化菜单
     */
    initMenuActive() {
      //默认显示第一个父节点下第一个子节点
      this.menuList.some((item, index) => {
        if (index == 0) {
          let src = item.children ? item.children[0]["src"] : item["src"];
          this.defaultActiveMenue = item.children
            ? item.children[0]["id"]
            : item["id"];
          this.$emit("changeMenue", src);
          return true;
        }
      });
    },
    /**
     * @description 菜单切换事件
     * @param {String} $index
     */
    select($index) {
      this.findMenu($index, this.menuList, (data) => {
        this.$emit("changeMenue", data);
      });
    },
    /**
     * @description 递归获取当前菜单路径
     * @param {String} $index 当前菜单的索引id
     * @returns {Array} arr 菜单列
     */
    findMenu($index, arr, callback) {
      if (!arr.length) return;
      arr.some((item) => {
        let $src = item.src;
        if (item.children) {
          this.findMenu($index, item.children, callback);
        } else {
          if (item.id === $index && $src) {
            callback($src);
            return true;
          }
        }
      });
    },
  },
};
</script>
