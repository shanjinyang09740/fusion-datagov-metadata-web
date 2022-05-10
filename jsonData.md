# 组件数据格式

## 下拉单选列表 --- radio_drop_list

```
[
    {
        "value": "选项1",
        "label": "黄金糕"
    },
    {
        "value": "选项2",
        "label": "双皮奶"
    },
    {
        "value": "选项3",
        "label": "蚵仔煎"
    },
    {
        "value": "选项4",
        "label": "龙须面"
    },
    {
        "value": "选项5",
        "label": "北京烤鸭"
    }
]
```

## 下拉多选列表 --- mult_drop_list
```
[
    {
        "value": "选项1",
        "label": "黄金糕"
    },
    {
        "value": "选项2",
        "label": "双皮奶"
    },
    {
        "value": "选项3",
        "label": "蚵仔煎"
    },
    {
        "value": "选项4",
        "label": "龙须面"
    },
    {
        "value": "选项5",
        "label": "北京烤鸭"
    }
]
```

## 下拉单选树列表 --- radio_tree
```
[
    {
        "id": 1,
        "pId": 0,
        "label": "一级 1",
        "children": [
            {
                "id": 11,
                "pId": 1,
                "label": "二级 1-1",
                "children": [
                    {
                        "id": 111,
                        "pId": 11,
                        "label": "三级 1-1-1"
                    }
                ]
            }
        ]
    },
    {
        "id": 2,
        "pId": 0,
        "label": "一级 2",
        "children": [
            {
                "id": 21,
                "pId": 2,
                "label": "二级 2-1",
                "children": [
                    {
                        "id": 211,
                        "pId": 21,
                        "label": "三级 2-1-1"
                    }
                ]
            },
            {
                "id": 22,
                "pId": 2,
                "label": "二级 2-2",
                "children": [
                    {
                        "id": 221,
                        "pId": 22,
                        "label": "三级 2-2-1"
                    }
                ]
            }
        ]
    },
    {
        "id": 3,
        "pId": 0,
        "label": "一级 3",
        "children": [
            {
                "id": 31,
                "pId": 3,
                "label": "二级 3-1",
                "children": [
                    {
                        "id": 311,
                        "pId": 31,
                        "label": "三级 3-1-1"
                    }
                ]
            },
            {
                "id": 32,
                "pId": 3,
                "label": "二级 3-2",
                "children": [
                    {
                        "id": 321,
                        "pId": 32,
                        "label": "三级 3-2-1"
                    }
                ]
            }
        ]
    }
]

```

## 下拉多选树列表 --- mult_tree
```
[
    {
        "id": 1,
        "pId": 0,
        "label": "一级 1",
        "children": [
            {
                "id": 11,
                "pId": 1,
                "label": "二级 1-1",
                "children": [
                    {
                        "id": 111,
                        "pId": 11,
                        "label": "三级 1-1-1"
                    }
                ]
            }
        ]
    },
    {
        "id": 2,
        "pId": 0,
        "label": "一级 2",
        "children": [
            {
                "id": 21,
                "pId": 2,
                "label": "二级 2-1",
                "children": [
                    {
                        "id": 211,
                        "pId": 21,
                        "label": "三级 2-1-1"
                    }
                ]
            },
            {
                "id": 22,
                "pId": 2,
                "label": "二级 2-2",
                "children": [
                    {
                        "id": 221,
                        "pId": 22,
                        "label": "三级 2-2-1"
                    }
                ]
            }
        ]
    },
    {
        "id": 3,
        "pId": 0,
        "label": "一级 3",
        "children": [
            {
                "id": 31,
                "pId": 3,
                "label": "二级 3-1",
                "children": [
                    {
                        "id": 311,
                        "pId": 31,
                        "label": "三级 3-1-1"
                    }
                ]
            },
            {
                "id": 32,
                "pId": 3,
                "label": "二级 3-2",
                "children": [
                    {
                        "id": 321,
                        "pId": 32,
                        "label": "三级 3-2-1"
                    }
                ]
            }
        ]
    }
]

```
## 普通表格---table
```
[
    {
        "date": "2016-05-02",
        "name": "王小虎",
        "address": "上海市普陀区金沙江路 1518 弄"
    },
    {
        "date": "2016-05-04",
        "name": "王小虎",
        "address": "上海市普陀区金沙江路 1517 弄"
    },
    {
        "date": "2016-05-01",
        "name": "王小虎",
        "address": "上海市普陀区金沙江路 1519 弄"
    },
    {
        "date": "2016-05-03",
        "name": "王小虎",
        "address": "上海市普陀区金沙江路 1516 弄"
    }
]
```
## 树形表格---tree_table
```
[
    {
        "aggregateType": "",
        "level": 1,
        "partitionCode": "1",
        "partitionName": "1",
        "sortNum": 1,
        "statIndctAlgorithm": "",
        "statIndctCode": "1",
        "statIndctCreatDate": "",
        "statIndctDataLength": 1,
        "statIndctDataPrecison": 1,
        "statIndctDataRangeMax": "",
        "statIndctDataRangeMin": "",
        "statIndctDataStyle": "",
        "statIndctDataType": "",
        "statIndctDesc": "update",
        "statIndctFolderId": "1",
        "statIndctId": "1",
        "statIndctNameCh": "1",
        "statIndctNicknameCh": "1",
        "statIndctPurpose": "",
        "statIndctSource": "",
        "statIndctStartDate": "",
        "statIndctStatus": "",
        "statIndctStopDate": "",
        "statIndctType2": "",
        "statIndctUmDimensionId": "1",
        "statIndctUmDimensionLabel": "",
        "statIndctUmId": "1",
        "statIndctUmLabel": "",
        "statIndctUpdateDate": "",
        "statIndctVersion": "1",
        "statIndctVersionDesc": "xxx"
    },
    {
        "aggregateType": "",
        "level": 1,
        "partitionCode": "1",
        "partitionName": "1",
        "sortNum": 2,
        "statIndctAlgorithm": "",
        "statIndctCode": "DCTEGFA87",
        "statIndctCreatDate": "",
        "statIndctDataLength": 1,
        "statIndctDataPrecison": 1,
        "statIndctDataRangeMax": "",
        "statIndctDataRangeMin": "",
        "statIndctDataStyle": "",
        "statIndctDataType": "",
        "statIndctDesc": "update",
        "statIndctFolderId": "1",
        "statIndctId": "1522736981985333248",
        "statIndctNameCh": "1",
        "statIndctNicknameCh": "1",
        "statIndctPurpose": "",
        "statIndctSource": "",
        "statIndctStartDate": "",
        "statIndctStatus": "",
        "statIndctStopDate": "",
        "statIndctType2": "",
        "statIndctUmDimensionId": "1",
        "statIndctUmDimensionLabel": "",
        "statIndctUmId": "1",
        "statIndctUmLabel": "",
        "statIndctUpdateDate": "",
        "statIndctVersion": "1",
        "statIndctVersionDesc": "xxx"
    },
    {
        "aggregateType": "",
        "level": 2,
        "partitionCode": "1",
        "partitionName": "1",
        "sortNum": 3,
        "statIndctAlgorithm": "",
        "statIndctCode": "DCTX0ZPEX",
        "statIndctCreatDate": "",
        "statIndctDataLength": 1,
        "statIndctDataPrecison": 1,
        "statIndctDataRangeMax": "",
        "statIndctDataRangeMin": "",
        "statIndctDataStyle": "",
        "statIndctDataType": "",
        "statIndctDesc": "update",
        "statIndctFolderId": "1",
        "statIndctId": "1522551541252624384",
        "statIndctNameCh": "1222",
        "statIndctNicknameCh": "1",
        "statIndctPurpose": "",
        "statIndctSource": "",
        "statIndctStartDate": "",
        "statIndctStatus": "",
        "statIndctStopDate": "",
        "statIndctType2": "",
        "statIndctUmDimensionId": "1",
        "statIndctUmDimensionLabel": "",
        "statIndctUmId": "1",
        "statIndctUmLabel": "",
        "statIndctUpdateDate": "",
        "statIndctVersion": "1",
        "statIndctVersionDesc": "xxx"
    },
    {
        "aggregateType": "",
        "level": 2,
        "partitionCode": "1",
        "partitionName": "1",
        "sortNum": 4,
        "statIndctAlgorithm": "",
        "statIndctCode": "DCTJG5W3C",
        "statIndctCreatDate": "",
        "statIndctDataLength": 1,
        "statIndctDataPrecison": 1,
        "statIndctDataRangeMax": "",
        "statIndctDataRangeMin": "",
        "statIndctDataStyle": "",
        "statIndctDataType": "",
        "statIndctDesc": "update",
        "statIndctFolderId": "1",
        "statIndctId": "1522736995784593408",
        "statIndctNameCh": "1222",
        "statIndctNicknameCh": "1",
        "statIndctPurpose": "",
        "statIndctSource": "",
        "statIndctStartDate": "",
        "statIndctStatus": "",
        "statIndctStopDate": "",
        "statIndctType2": "",
        "statIndctUmDimensionId": "1",
        "statIndctUmDimensionLabel": "",
        "statIndctUmId": "1",
        "statIndctUmLabel": "",
        "statIndctUpdateDate": "",
        "statIndctVersion": "1",
        "statIndctVersionDesc": "xxx"
    },
    {
        "aggregateType": "",
        "level": 1,
        "partitionCode": "1",
        "partitionName": "1",
        "sortNum": 5,
        "statIndctAlgorithm": "",
        "statIndctCode": "DCTOZM78W",
        "statIndctCreatDate": "",
        "statIndctDataLength": 1,
        "statIndctDataPrecison": 1,
        "statIndctDataRangeMax": "",
        "statIndctDataRangeMin": "",
        "statIndctDataStyle": "",
        "statIndctDataType": "",
        "statIndctDesc": "update",
        "statIndctFolderId": "1",
        "statIndctId": "1522737731754921984",
        "statIndctNameCh": "2",
        "statIndctNicknameCh": "1",
        "statIndctPurpose": "",
        "statIndctSource": "",
        "statIndctStartDate": "",
        "statIndctStatus": "",
        "statIndctStopDate": "",
        "statIndctType2": "",
        "statIndctUmDimensionId": "1",
        "statIndctUmDimensionLabel": "",
        "statIndctUmId": "1",
        "statIndctUmLabel": "",
        "statIndctUpdateDate": "",
        "statIndctVersion": "1",
        "statIndctVersionDesc": "xxx"
    },
    {
        "aggregateType": "",
        "level": 1,
        "partitionCode": "1",
        "partitionName": "1",
        "sortNum": 6,
        "statIndctAlgorithm": "",
        "statIndctCode": "DCTLIHBBN",
        "statIndctCreatDate": "",
        "statIndctDataLength": 1,
        "statIndctDataPrecison": 1,
        "statIndctDataRangeMax": "",
        "statIndctDataRangeMin": "",
        "statIndctDataStyle": "",
        "statIndctDataType": "",
        "statIndctDesc": "update",
        "statIndctFolderId": "1",
        "statIndctId": "1522737003296591872",
        "statIndctNameCh": "3",
        "statIndctNicknameCh": "1",
        "statIndctPurpose": "",
        "statIndctSource": "",
        "statIndctStartDate": "",
        "statIndctStatus": "",
        "statIndctStopDate": "",
        "statIndctType2": "",
        "statIndctUmDimensionId": "1",
        "statIndctUmDimensionLabel": "",
        "statIndctUmId": "1",
        "statIndctUmLabel": "",
        "statIndctUpdateDate": "",
        "statIndctVersion": "1",
        "statIndctVersionDesc": "xxx"
    },
    {
        "aggregateType": "",
        "level": 2,
        "partitionCode": "1",
        "partitionName": "1",
        "sortNum": 7,
        "statIndctAlgorithm": "",
        "statIndctCode": "DCTCN1UJ7",
        "statIndctCreatDate": "",
        "statIndctDataLength": 1,
        "statIndctDataPrecison": 1,
        "statIndctDataRangeMax": "",
        "statIndctDataRangeMin": "",
        "statIndctDataStyle": "",
        "statIndctDataType": "",
        "statIndctDesc": "update",
        "statIndctFolderId": "1",
        "statIndctId": "1522737593749737472",
        "statIndctNameCh": "1222",
        "statIndctNicknameCh": "1",
        "statIndctPurpose": "",
        "statIndctSource": "",
        "statIndctStartDate": "",
        "statIndctStatus": "",
        "statIndctStopDate": "",
        "statIndctType2": "",
        "statIndctUmDimensionId": "1",
        "statIndctUmDimensionLabel": "",
        "statIndctUmId": "1",
        "statIndctUmLabel": "",
        "statIndctUpdateDate": "",
        "statIndctVersion": "1",
        "statIndctVersionDesc": "xxx"
    },
    {
        "aggregateType": "",
        "level": 2,
        "partitionCode": "1",
        "partitionName": "1",
        "sortNum": 8,
        "statIndctAlgorithm": "",
        "statIndctCode": "DCTR7WJAH",
        "statIndctCreatDate": "",
        "statIndctDataLength": 1,
        "statIndctDataPrecison": 1,
        "statIndctDataRangeMax": "",
        "statIndctDataRangeMin": "",
        "statIndctDataStyle": "",
        "statIndctDataType": "",
        "statIndctDesc": "update",
        "statIndctFolderId": "1",
        "statIndctId": "1522737607683215360",
        "statIndctNameCh": "1222",
        "statIndctNicknameCh": "1",
        "statIndctPurpose": "",
        "statIndctSource": "",
        "statIndctStartDate": "",
        "statIndctStatus": "",
        "statIndctStopDate": "",
        "statIndctType2": "",
        "statIndctUmDimensionId": "1",
        "statIndctUmDimensionLabel": "",
        "statIndctUmId": "1",
        "statIndctUmLabel": "",
        "statIndctUpdateDate": "",
        "statIndctVersion": "1",
        "statIndctVersionDesc": "xxx"
    },
    {
        "aggregateType": "",
        "level": 2,
        "partitionCode": "1",
        "partitionName": "1",
        "sortNum": 9,
        "statIndctAlgorithm": "",
        "statIndctCode": "DCTO3MYBH",
        "statIndctCreatDate": "",
        "statIndctDataLength": 1,
        "statIndctDataPrecison": 1,
        "statIndctDataRangeMax": "",
        "statIndctDataRangeMin": "",
        "statIndctDataStyle": "",
        "statIndctDataType": "",
        "statIndctDesc": "update",
        "statIndctFolderId": "1",
        "statIndctId": "1522737612884152320",
        "statIndctNameCh": "1222",
        "statIndctNicknameCh": "1",
        "statIndctPurpose": "",
        "statIndctSource": "",
        "statIndctStartDate": "",
        "statIndctStatus": "",
        "statIndctStopDate": "",
        "statIndctType2": "",
        "statIndctUmDimensionId": "1",
        "statIndctUmDimensionLabel": "",
        "statIndctUmId": "1",
        "statIndctUmLabel": "",
        "statIndctUpdateDate": "",
        "statIndctVersion": "1",
        "statIndctVersionDesc": "xxx"
    },
    {
        "aggregateType": "",
        "level": 2,
        "partitionCode": "1",
        "partitionName": "1",
        "sortNum": 10,
        "statIndctAlgorithm": "",
        "statIndctCode": "DCTSLXO4M",
        "statIndctCreatDate": "",
        "statIndctDataLength": 1,
        "statIndctDataPrecison": 1,
        "statIndctDataRangeMax": "",
        "statIndctDataRangeMin": "",
        "statIndctDataStyle": "",
        "statIndctDataType": "",
        "statIndctDesc": "update",
        "statIndctFolderId": "1",
        "statIndctId": "1522737958507384832",
        "statIndctNameCh": "1222",
        "statIndctNicknameCh": "1",
        "statIndctPurpose": "",
        "statIndctSource": "",
        "statIndctStartDate": "",
        "statIndctStatus": "",
        "statIndctStopDate": "",
        "statIndctType2": "",
        "statIndctUmDimensionId": "1",
        "statIndctUmDimensionLabel": "",
        "statIndctUmId": "1",
        "statIndctUmLabel": "",
        "statIndctUpdateDate": "",
        "statIndctVersion": "1",
        "statIndctVersionDesc": "xxx"
    }
]


[
    {
        "id": 1,
        "pId": 0,
        "date": "2016-05-02",
        "name": "王小虎",
        "address": "上海市普陀区金沙江路 1518 弄"
    },
    {
        "id": 2,
        "pId": 0,
        "date": "2016-05-04",
        "name": "王小虎",
        "address": "上海市普陀区金沙江路 1517 弄"
    },
    {
        "id": 3,
        "pId": 0,
        "date": "2016-05-01",
        "name": "王小虎",
        "address": "上海市普陀区金沙江路 1519 弄",
        "children": [
            {
                "id": 31,
                "pId": 3,
                "date": "2016-05-01",
                "name": "王小虎",
                "address": "上海市普陀区金沙江路 1519 弄"
            },
            {
                "id": 32,
                "pId": 3,
                "date": "2016-05-01",
                "name": "王小虎",
                "address": "上海市普陀区金沙江路 1519 弄"
            }
        ]
    },
    {
        "id": 4,
        "pId": 0,
        "date": "2016-05-03",
        "name": "王小虎",
        "address": "上海市普陀区金沙江路 1516 弄"
    }
]
```