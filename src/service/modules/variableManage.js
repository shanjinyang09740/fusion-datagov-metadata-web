import { postJSON } from "@/utils/post";
import { REQ } from "../requestUrl";
import { get } from '@/utils/get'


/**=========================变量管理========================== */
const queryMdItemList = () => postJSON(REQ.queryMdItemListUrl, {
  postData: JSON.stringify({
    data: [{
      vtype: "attr",
      name: "itemTypeId",
      data: 'DDIInstance'
    }]
  })
});



export {
  queryMdItemList,
};
