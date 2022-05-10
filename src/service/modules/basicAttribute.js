import { postJSON } from "@/utils/post";
import { REQ } from "../requestUrl";
// import { get } from "@/utils/get";

/**=========================变量管理========================== */
const addBasicAttribute = (data) =>
  postJSON(REQ.addBasicAttributeUrl, {
    postData: JSON.stringify({
      data: [
        {
          vtype: "json",
          name: "pro",
          data,
        },
      ],
    }),
  });

export { addBasicAttribute };
