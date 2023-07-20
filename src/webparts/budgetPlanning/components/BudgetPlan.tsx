import * as React from "react";
import { useState, useEffect } from "react";
import {
  Label,
  Dropdown,
  DetailsList,
  SelectionMode,
  IColumn,
  DetailsListLayoutMode,
  Icon,
  TextField,
  IDropdownStyles,
  IDetailsListStyles,
  ITextFieldStyles,
} from "@fluentui/react";
import { Config } from "../../../globals/Config";
import {
  IDrop,
  IDropdowns,
  ICurBudgetItem,
  ICurCategoryItem,
  IOverAllItem,
  IBudgetListColumn,
  IBudgetValidation,
} from "../../../globalInterFace/BudgetInterFaces";
import * as moment from "moment";
import { _getFilterDropValues } from "../../../CommonServices/DropFunction";
import SPServices from "../../../CommonServices/SPServices";
import Loader from "./Loader";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import styles from "./BudgetPlanning.module.scss";

let propDropValue: IDropdowns;
let _curYear: string = moment().format("YYYY");
let _Items: ICurBudgetItem[] = [];
let _groupItem: IOverAllItem[] = [];
let alertifyMSG: string = "";
let _isBack: boolean = false;
let _isCurYear: boolean = true;

const BudgetPlan = (props: any): JSX.Element => {
  /* Variable creation */
  propDropValue = { ...props.dropValue };

  const _budgetPlanColumns: IColumn[] = [
    {
      key: "column1",
      name: "Category",
      fieldName: Config.BudgetListColumns.CategoryId.toString(),
      minWidth: 200,
      maxWidth: _isCurYear ? 300 : 350,
      onRender: (item: ICurBudgetItem): any => {
        return item.ID ? item.Category : item.isEdit && item.Category;
      },
    },
    {
      key: "column2",
      name: "Country",
      fieldName: Config.BudgetListColumns.CountryId.toString(),
      minWidth: 150,
      maxWidth: _isCurYear ? 200 : 250,
      onRender: (item: ICurBudgetItem): any => {
        return item.ID ? item.Country : item.isEdit && item.Country;
      },
    },
    {
      key: "column3",
      name: "Description",
      fieldName: Config.BudgetListColumns.Description,
      minWidth: 300,
      maxWidth: _isCurYear ? 380 : 450,
      onRender: (item: ICurBudgetItem): any => {
        return item.isDummy && !item.isEdit ? (
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              width: "100%",
            }}
          >
            <div
              style={{
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14,
                background: "#4d546a",
                display: "inline",
                padding: 4,
                color: "#fff",
                borderRadius: 4,
              }}
              onClick={() => {
                if (!_isBack) {
                  _isBack = !item.isEdit;
                  _getEditItem(item);
                } else {
                  _getPageErrorMSG(item, "Add");
                }
              }}
            >
              Click here to create a subcategory
            </div>
          </div>
        ) : !item.isEdit ? (
          <div title={item.Description} style={{ cursor: "pointer" }}>
            {item.Description}
          </div>
        ) : (
          <div>
            <TextField
              value={curData.Description ? curData.Description : ""}
              styles={
                isValidation.isDescription ? errtxtFieldStyle : textFieldStyle
              }
              placeholder="Enter Here"
              onChange={(e: any) => {
                curData.Description = e.target.value;
                setCurData({ ...curData });
              }}
            />
          </div>
        );
      },
    },
    {
      key: "column4",
      name: "Budget",
      fieldName: Config.BudgetListColumns.BudgetAllocated,
      minWidth: 150,
      maxWidth: 200,
      onRender: (item: ICurBudgetItem): any => {
        return !item.isEdit ? (
          <div style={{ color: "#E39C5A" }}>{item.BudgetAllocated}</div>
        ) : (
          <div>
            <TextField
              value={
                curData.BudgetAllocated
                  ? curData.BudgetAllocated.toString()
                  : ""
              }
              placeholder="Enter Here"
              styles={
                isValidation.isBudgetAllocated
                  ? errtxtFieldStyle
                  : textFieldStyle
              }
              onChange={(e: any, value: any) => {
                if (/^[0-9]+$|^$/.test(value)) {
                  curData.BudgetAllocated = value;
                  setCurData({ ...curData });
                }
              }}
            />
          </div>
        );
      },
    },
    {
      key: "column5",
      name: "Used",
      minWidth: 100,
      maxWidth: 200,
      onRender: (item: any) => {
        return <div style={{ color: "#AC455E" }}>{item.Used}</div>;
      },
    },
    {
      key: "column6",
      name: "Remaining",
      minWidth: 100,
      maxWidth: 200,
      onRender: (item: any) => {
        return (
          <div
            style={
              item.Year != _curYear
                ? {
                    padding: "4px 12px",
                    backgroundImage:
                      "linear-gradient(to right, #59e27f, #f1f1f1)",
                    display: "inline",
                    borderRadius: 4,
                    color: "#000",
                  }
                : {
                    padding: 0,
                  }
            }
          >
            {item.RemainingCost}
          </div>
        );
      },
    },
    {
      key: "column7",
      name: "Action",
      fieldName: "",
      minWidth: 100,
      maxWidth: 150,
      onRender: (item: any) => {
        return (
          <div>
            {item.isEdit ? (
              <div
                style={{
                  display: "flex",
                  gap: "6%",
                }}
              >
                <Icon
                  iconName="CheckMark"
                  style={{
                    color: "green",
                    fontSize: "20px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    _getPrepareDatas();
                  }}
                />
                <Icon
                  iconName="Cancel"
                  style={{
                    color: "red",
                    fontSize: "20px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    _isBack = !item.isEdit;
                    _getCancelItems();
                  }}
                />
              </div>
            ) : (
              item.ID &&
              item.Year == _curYear && (
                <div
                  style={{
                    display: "flex",
                    gap: "6%",
                  }}
                >
                  <Icon
                    iconName="Edit"
                    style={{
                      color: "blue",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      if (!_isBack) {
                        _isBack = !item.isEdit;
                        _getEditItem(item);
                      } else {
                        _getPageErrorMSG(item, "Edit");
                      }
                    }}
                  />
                  <Icon
                    iconName="Delete"
                    style={{
                      color: "red",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      if (!_isBack) {
                        setIsLoader(true);
                        let data: any = {};
                        const _deletedColumn: IBudgetListColumn =
                          Config.BudgetListColumns;
                        curData.ID = item.ID;
                        setCurData({ ...curData });
                        data[_deletedColumn.isDeleted] = true;
                        _getEditData({ ...data }, "Deleted");
                      } else {
                        _getPageErrorMSG(item, "Deleted");
                      }
                    }}
                  />
                </div>
              )
            )}
          </div>
        );
      },
    },
  ];

  /* State creation */
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [detailColumn, setDetailColumn] = useState<IColumn[]>([]);
  const [items, setItems] = useState<ICurBudgetItem[]>([]);
  const [group, setGroup] = useState<any[]>([]);
  const [filPeriodDrop, setFilPeriodDrop] = useState<string>(
    moment().format("YYYY")
  );
  const [filCountryDrop, setFilCountryDrop] = useState<string>("All");
  const [filTypeDrop, setFilTypeDrop] = useState<string>("All");
  const [curData, setCurData] = useState<ICurBudgetItem>(Config.curBudgetItem);
  const [isValidation, setIsValidation] = useState<IBudgetValidation>(
    Config.budgetValidation
  );

  /* Style Section */
  const _DetailsListStyle: Partial<IDetailsListStyles> = {
    root: {
      marginTop: "20px",
      ".ms-DetailsHeader": {
        backgroundColor: "#ededed",
        padding: "0px",
      },
      ".ms-DetailsHeader-cell": {
        ":first-child": {
          color: "#202945",
          cursor: "pointer",
        },
        ":hover": {
          backgroundColor: "#ededed",
        },
      },
      ".ms-DetailsHeader-cellName": {
        color: "#202945",
        fontWeight: "700 !important",
        fontSize: "16px !important",
      },
      ".ms-GroupHeader-title": {
        "span:nth-child(2)": {
          display: "none",
        },
      },
      "[data-automationid=DetailsRowFields]": {
        alignItems: "center !important",
      },
      ".ms-DetailsRow-cell": {
        fontSize: 14,
      },
      ".ms-DetailsList-contentWrapper": {
        height: items.length ? "58vh" : 20,
        overflowY: "auto",
        overflowX: "hidden",
      },
    },
  };

  const DropdownStyle: Partial<IDropdownStyles> = {
    dropdown: {
      ":focus::after": {
        border: "1px solid rgb(96, 94, 92)",
      },
    },
  };

  const textFieldStyle: Partial<ITextFieldStyles> = {
    fieldGroup: {
      "::after": {
        border: "1px solid rgb(96, 94, 92)",
      },
    },
  };

  const errtxtFieldStyle: Partial<ITextFieldStyles> = {
    fieldGroup: {
      border: "1px solid red",
      "::after": {
        border: "1px solid red",
      },
      ":hover": {
        border: "1px solid red",
      },
    },
  };

  /* function creation */
  const _getErrorFunction = (errMsg: any): void => {
    alertify.error("Error Message");
    setIsLoader(false);
  };

  window.onbeforeunload = (e: any): string => {
    if (_isBack) {
      let dialogText =
        "You have unsaved changes, are you sure you want to leave?";
      e.returnValue = dialogText;
      isValidation.isBudgetAllocated = false;
      isValidation.isDescription = false;
      setIsValidation({ ...isValidation });
      return dialogText;
    }
  };

  const _getDefaultFunction = (): void => {
    alertifyMSG = "";
    _isBack = false;
    isValidation.isBudgetAllocated = false;
    isValidation.isDescription = false;
    setIsValidation({ ...isValidation });
    setIsLoader(true);
    filPeriodDrop == _curYear ? _budgetPlanColumns : _budgetPlanColumns.pop();
    setDetailColumn([..._budgetPlanColumns]);
    _getCategoryDatas();
  };

  const _getCategoryDatas = (): void => {
    SPServices.SPReadItems({
      Listname: Config.ListNames.CategoryList,
      Select: "*, Year/ID, Year/Title, Country/ID, Country/Title",
      Filter: [
        {
          FilterKey: "isDeleted",
          Operator: "ne",
          FilterValue: "1",
        },
      ],
      Expand: "Year, Country",
      Topcount: 5000,
    })
      .then((resCate: any) => {
        let _curCategory: ICurCategoryItem[] = [];
        if (resCate.length) {
          for (let i: number = 0; resCate.length > i; i++) {
            _curCategory.push({
              ID: resCate[i].ID,
              CategoryAcc: resCate[i].Title
                ? {
                    ID: resCate[i].ID,
                    Text: resCate[i].Title,
                  }
                : undefined,
              Type: resCate[i].CategoryType ? resCate[i].CategoryType : "",
              YearAcc: resCate[i].YearId
                ? {
                    ID: resCate[i].Year.ID,
                    Text: resCate[i].Year.Title,
                  }
                : undefined,
              CountryAcc: resCate[i].CountryId
                ? {
                    ID: resCate[i].Country.ID,
                    Text: resCate[i].Country.Title,
                  }
                : undefined,
            });
            i + 1 == resCate.length && _getFilterFunction([..._curCategory]);
          }
        } else {
          _getFilterFunction([..._curCategory]);
        }
      })
      .catch((err: any) => {
        _getErrorFunction(err);
      });
  };

  const _getFilterFunction = (_filData: ICurCategoryItem[]): void => {
    let tempArr: ICurCategoryItem[] = [..._filData];
    tempArr = tempArr.filter((arr: ICurCategoryItem) => {
      return arr.YearAcc.Text == filPeriodDrop;
    });
    if (filCountryDrop != "All" && tempArr.length) {
      tempArr = tempArr.filter((arr: ICurCategoryItem) => {
        return arr.CountryAcc.Text == filCountryDrop;
      });
    }
    if (filTypeDrop != "All" && tempArr.length) {
      tempArr = tempArr.filter((arr: ICurCategoryItem) => {
        return arr.Type == filTypeDrop;
      });
    }
    _getBudgetDatas(tempArr);
  };

  const _getBudgetDatas = (_arrCate: ICurCategoryItem[]): void => {
    SPServices.SPReadItems({
      Listname: Config.ListNames.BudgetList,
      Select:
        "*, Category/ID, Category/Title, Year/ID, Year/Title, Country/ID, Country/Title",
      Expand: "Category, Year, Country",
      Filter: [
        {
          FilterKey: "isDeleted",
          FilterValue: "1",
          Operator: "ne",
        },
      ],
      Topcount: 5000,
      Orderbydecorasc: false,
    })
      .then((resBudget: any) => {
        let _curItem: ICurBudgetItem[] = [];
        if (resBudget.length) {
          for (let i: number = 0; resBudget.length > i; i++) {
            _curItem.push({
              ID: resBudget[i].ID,
              Category: resBudget[i].CategoryId
                ? resBudget[i].Category.Title
                : "",
              Country: resBudget[i].CountryId ? resBudget[i].Country.Title : "",
              Year: resBudget[i].YearId ? resBudget[i].Year.Title : "",
              Type: resBudget[i].CategoryType ? resBudget[i].CategoryType : "",
              CateId: resBudget[i].CategoryId ? resBudget[i].Category.ID : null,
              CounId: resBudget[i].CountryId ? resBudget[i].Country.ID : null,
              YearId: resBudget[i].YearId ? resBudget[i].Year.ID : null,
              BudgetAllocated: resBudget[i].BudgetAllocated
                ? resBudget[i].BudgetAllocated
                : null,
              BudgetProposed: resBudget[i].BudgetProposed
                ? resBudget[i].BudgetProposed
                : null,
              Used: resBudget[i].Used ? resBudget[i].Used : null,
              ApproveStatus: resBudget[i].ApproveStatus
                ? resBudget[i].ApproveStatus
                : "",
              Description: resBudget[i].Description
                ? resBudget[i].Description
                : "",
              RemainingCost: resBudget[i].RemainingCost
                ? resBudget[i].RemainingCost
                : null,
              isDeleted: resBudget[i].isDeleted,
              isEdit: false,
              isDummy: false,
            });
            i + 1 == resBudget.length &&
              _arrMasterCategoryData([..._arrCate], [..._curItem]);
          }
        } else {
          _arrMasterCategoryData([..._arrCate], [..._curItem]);
        }
      })
      .catch((err: any) => {
        _getErrorFunction(err);
      });
  };

  const _arrMasterCategoryData = (
    _arrCate: ICurCategoryItem[],
    _arrBudget: ICurBudgetItem[]
  ): void => {
    let _arrMasterCategory: IOverAllItem[] = [];
    if (_arrCate.length) {
      for (let i: number = 0; _arrCate.length > i; i++) {
        _arrMasterCategory.push({
          CategoryAcc: _arrCate[i].CategoryAcc.Text,
          YearAcc: _arrCate[i].YearAcc.Text,
          CountryAcc: _arrCate[i].CountryAcc.Text,
          Type: _arrCate[i].Type,
          ID: _arrCate[i].ID,
          yearID: _arrCate[i].YearAcc.ID,
          countryID: _arrCate[i].CountryAcc.ID,
          subCategory: [],
        });
        i + 1 == _arrCate.length &&
          (_prepareArrMasterDatas([..._arrMasterCategory], [..._arrBudget]),
          (_groupItem = [..._arrMasterCategory]));
      }
    } else {
      setItems([]);
      setGroup([]);
      setIsLoader(false);
    }
  };

  const _prepareArrMasterDatas = (
    _arrCateDatas: IOverAllItem[],
    _arrBudget: ICurBudgetItem[]
  ): void => {
    let _arrOfMaster: IOverAllItem[] = [];
    let _curEmptyItem: ICurBudgetItem;

    for (let i: number = 0; _arrCateDatas.length > i; i++) {
      let isDatas: boolean = true;
      _arrCateDatas[i].subCategory = [];
      for (let j: number = 0; _arrBudget.length > j; j++) {
        if (
          _arrCateDatas[i].ID == _arrBudget[j].CateId &&
          _arrCateDatas[i].YearAcc == _arrBudget[j].Year &&
          _arrCateDatas[i].CategoryAcc == _arrBudget[j].Category &&
          _arrCateDatas[i].CountryAcc == _arrBudget[j].Country &&
          _arrCateDatas[i].Type == _arrBudget[j].Type
        ) {
          isDatas = false;
          _arrCateDatas[i].subCategory.push(_arrBudget[j]);
        }
        if (!isDatas && j + 1 == _arrBudget.length) {
          _curEmptyItem =
            _arrCateDatas[i].YearAcc == _curYear &&
            _getPrepareArrangedDatas(_arrCateDatas[i]);
          _arrCateDatas[i].subCategory.push({ ..._curEmptyItem });
          _arrOfMaster.push(_arrCateDatas[i]);
        }
      }
      if (isDatas && _arrCateDatas[i].YearAcc == _curYear) {
        _curEmptyItem = _getPrepareArrangedDatas({ ..._arrCateDatas[i] });
        _arrCateDatas[i].subCategory.push({ ..._curEmptyItem });
        _arrOfMaster.push(_arrCateDatas[i]);
      }
      i + 1 == _arrCateDatas.length && groups([..._arrOfMaster]);
    }
  };

  const _getPrepareArrangedDatas = (
    _arrCateDatas: IOverAllItem
  ): ICurBudgetItem => {
    let _curSampleData: ICurBudgetItem;
    _curSampleData = {
      ID: null,
      Category: _arrCateDatas.CategoryAcc,
      Country: _arrCateDatas.CountryAcc,
      Year: _arrCateDatas.YearAcc,
      Type: _arrCateDatas.Type,
      CateId: _arrCateDatas.ID,
      CounId: _arrCateDatas.countryID,
      YearId: _arrCateDatas.yearID,
      BudgetAllocated: null,
      BudgetProposed: null,
      Used: null,
      ApproveStatus: "",
      Description: "",
      RemainingCost: null,
      isDeleted: false,
      isEdit: false,
      isDummy: true,
    };
    return _curSampleData;
  };

  const groups = (_filRecord: IOverAllItem[]): void => {
    let reOrderedRecords: ICurBudgetItem[] = [];
    let Uniquelessons: ICurBudgetItem[] = [];
    let matches: ICurBudgetItem[] = [];
    let _overAllCategoryArr: ICurBudgetItem[] = [];

    if (_filRecord.length == 0) {
      setItems([]);
      setGroup([]);
      setIsLoader(false);
    } else {
      for (let i: number = 0; _filRecord.length > i; i++) {
        if (_filRecord[i].subCategory.length) {
          Uniquelessons = _filRecord[i].subCategory.reduce(
            (item: any, e1: any) => {
              matches = item.filter((e2: any) => {
                return (
                  e1.Category === e2.CategoryAcc &&
                  e1.Year === e2.YearAcc &&
                  e1.Country === e2.CountryAcc
                );
              });
              if (matches.length == 0) {
                _overAllCategoryArr.push(e1);
              }
              return _overAllCategoryArr;
            },
            []
          );
        }
      }
      _filRecord.forEach((ul: any) => {
        let FilteredData: ICurBudgetItem[] = Uniquelessons.filter(
          (arr: any) => {
            return (
              arr.Category === ul.CategoryAcc &&
              arr.Year === ul.YearAcc &&
              arr.Country === ul.CountryAcc
            );
          }
        );
        let sortingRecord = reOrderedRecords.concat(FilteredData);
        reOrderedRecords = sortingRecord;
      });
      groupsforDL([...reOrderedRecords], [..._filRecord]);
    }
  };

  const groupsforDL = (records: ICurBudgetItem[], arrCate: IOverAllItem[]) => {
    let newRecords: any[] = [];
    let varGroup: any[] = [];
    let _recordsLength: number = 0;
    arrCate.forEach((arr: IOverAllItem, i: number) => {
      newRecords.push({
        Category: arr.CategoryAcc ? arr.CategoryAcc : "",
        Country: arr.CountryAcc ? arr.CountryAcc : "",
        Year: arr.YearAcc ? arr.YearAcc : "",
        indexValue: _recordsLength,
      });
      _recordsLength += arr.subCategory.length;
    });
    newRecords.forEach((ur: any, index: number) => {
      let recordLength: number = records.filter((arr: ICurBudgetItem) => {
        return (
          arr.Category === ur.Category &&
          arr.Country === ur.Country &&
          arr.Year === ur.Year
        );
      }).length;
      varGroup.push({
        key: ur.Category,
        name: ur.Country ? `${ur.Category + " - " + ur.Country}` : ur.Category,
        startIndex: ur.indexValue,
        count: recordLength,
      });
      if (index == newRecords.length - 1) {
        _Items = [...records];
        _isBack = false;
        setItems([...records]);
        setGroup([...varGroup]);
        alertifyMSG && alertify.success(`Item ${alertifyMSG} successfully`);
        setIsLoader(false);
      }
    });
  };

  const _getEditItem = (_curItem: ICurBudgetItem): void => {
    curData.Category = _curItem.Category;
    curData.Year = _curItem.Year;
    curData.Type = _curItem.Type;
    curData.Country = _curItem.Country;
    curData.ApproveStatus = _curItem.ApproveStatus;
    curData.Description = _curItem.Description;
    curData.ID = _curItem.ID;
    curData.CateId = _curItem.CateId;
    curData.CounId = _curItem.CounId;
    curData.YearId = _curItem.YearId;
    curData.BudgetAllocated = _curItem.BudgetAllocated;
    curData.BudgetProposed = _curItem.BudgetProposed;
    curData.Used = _curItem.Used;
    curData.RemainingCost = _curItem.RemainingCost;
    curData.isDeleted = false;
    curData.isEdit = false;
    setCurData({ ...curData });

    for (let i: number = 0; _Items.length > i; i++) {
      if (
        _Items[i].Category === _curItem.Category &&
        _Items[i].Country === _curItem.Country &&
        _Items[i].Year === _curItem.Year &&
        _Items[i].ID === _curItem.ID
      ) {
        _Items[i].isEdit = true;
      } else {
        _Items[i].isEdit = false;
      }
      i + 1 == _Items.length && setItems([..._Items]);
    }
  };

  const _getCancelItems = (): void => {
    isValidation.isBudgetAllocated = false;
    isValidation.isDescription = false;
    setIsValidation({ ...isValidation });
    setCurData({ ...Config.curBudgetItem });
    for (let i: number = 0; _Items.length > i; i++) {
      _Items[i].isEdit = false;
      i + 1 == _Items.length && setItems([..._Items]);
    }
  };

  const _getPrepareDatas = (): void => {
    let data: any = {};
    const columns: IBudgetListColumn = Config.BudgetListColumns;
    if (curData.ID) {
      _isBack = !curData.isEdit;
      data[columns.Description] = curData.Description;
      data[columns.BudgetAllocated] = Number(curData.BudgetAllocated);
      _getValidation({ ...data }, "Updated");
    } else {
      data[columns.CategoryId] = curData.CateId;
      data[columns.CountryId] = curData.CounId;
      data[columns.YearId] = curData.YearId;
      data[columns.Description] = curData.Description;
      data[columns.CategoryType] = curData.Type;
      data[columns.BudgetAllocated] = Number(curData.BudgetAllocated);
      _getValidation({ ...data }, "");
    }
  };

  const _getValidation = (data: any, type: string): void => {
    let _isValid: boolean = true;
    if (!curData.Description.trim()) {
      _isValid = false;
      isValidation.isDescription = true;
      isValidation.isBudgetAllocated = curData.BudgetAllocated ? false : true;
    }
    if (!curData.BudgetAllocated) {
      _isValid = false;
      isValidation.isBudgetAllocated = true;
      isValidation.isDescription = curData.Description.trim() ? false : true;
    }
    if (_isValid) {
      _isBack = !curData.isEdit;
      setIsLoader(true);
      type != "Updated"
        ? _getAddData({ ...data })
        : _getEditData({ ...data }, type);
      isValidation.isBudgetAllocated = false;
      isValidation.isDescription = false;
      setIsValidation({ ...isValidation });
    } else {
      setIsValidation({ ...isValidation });
    }
  };

  const _getAddData = (_addData: any): void => {
    SPServices.SPAddItem({
      Listname: Config.ListNames.BudgetList,
      RequestJSON: _addData,
    })
      .then((_resAdd: any) => {
        let _arrNewBudget: ICurBudgetItem[] = [];
        curData.ID = _resAdd.data.ID;
        _Items.push({ ...curData });
        for (let i: number = 0; _Items.length > i; i++) {
          if (_Items[i].ID) {
            _arrNewBudget.push(_Items[i]);
          }
          i + 1 == _Items.length &&
            ((alertifyMSG = "Added"),
            _prepareArrMasterDatas([..._groupItem], [..._arrNewBudget]));
        }
      })
      .catch((err: any) => {
        _getErrorFunction(err);
      });
  };

  const _getEditData = (_editData: any, type: string): void => {
    SPServices.SPUpdateItem({
      Listname: Config.ListNames.BudgetList,
      ID: curData.ID,
      RequestJSON: _editData,
    })
      .then((_resEdit: any) => {
        let _arrNewBudget: ICurBudgetItem[] = [];
        let _message: string = "";
        for (let i: number = 0; _Items.length > i; i++) {
          if (_Items[i].ID) {
            if (type == "Updated" && _Items[i].ID == curData.ID) {
              _message = type;
              _arrNewBudget.push({ ...curData });
            } else if (type == "Deleted" && _Items[i].ID == curData.ID) {
              _message = type;
            } else {
              _arrNewBudget.push(_Items[i]);
            }
          }
          i + 1 == _Items.length &&
            ((alertifyMSG = _message),
            _prepareArrMasterDatas([..._groupItem], [..._arrNewBudget]));
        }
      })
      .catch((err: any) => {
        _getErrorFunction(err);
      });
  };

  const _getPageErrorMSG = (_item: ICurBudgetItem, _type: string): void => {
    if (_isBack) {
      if (_type == "Deleted") {
        if (
          confirm("You have unsaved changes, are you sure you want to leave?")
        ) {
          isValidation.isBudgetAllocated = false;
          isValidation.isDescription = false;
          setIsValidation({ ...isValidation });
          _isBack = false;
          setIsLoader(true);
          let data: any = {};
          const _deletedColumn: IBudgetListColumn = Config.BudgetListColumns;
          curData.ID = _item.ID;
          setCurData({ ...curData });
          data[_deletedColumn.isDeleted] = true;
          _getEditData({ ...data }, _type);
        }
      } else if (
        confirm("You have unsaved changes, are you sure you want to leave?")
      ) {
        isValidation.isBudgetAllocated = false;
        isValidation.isDescription = false;
        setIsValidation({ ...isValidation });
        _getEditItem(_item);
      } else null;
    } else {
      _isBack = false;
    }
  };

  /* Life cycle of onload */
  useEffect(() => {
    _getDefaultFunction();
  }, [filCountryDrop, filPeriodDrop, filTypeDrop]);

  return isLoader ? (
    <Loader />
  ) : (
    <div style={{ width: "100%" }}>
      {/* Heading section */}
      <Label className={styles.HeaderLable}>Budget Planning</Label>

      {/* Filter section */}
      <div className={styles.filterSection}>
        {/* Left side section */}
        <div className={styles.filters}>
          {/* Period section */}
          <div style={{ width: "16%" }}>
            <Label>Period</Label>
            <Dropdown
              styles={DropdownStyle}
              options={[...propDropValue.Period]}
              selectedKey={_getFilterDropValues(
                "Period",
                { ...propDropValue },
                filPeriodDrop
              )}
              onChange={(e: any, text: IDrop) => {
                _isCurYear = (text.text as string) == _curYear ? true : false;
                setFilPeriodDrop(text.text as string);
              }}
            />
          </div>

          {/* Country section */}
          <div style={{ width: "16%" }}>
            <Label>Country</Label>
            <Dropdown
              styles={DropdownStyle}
              options={[...propDropValue.Country]}
              selectedKey={_getFilterDropValues(
                "Country",
                {
                  ...propDropValue,
                },
                filCountryDrop
              )}
              onChange={(e: any, text: IDrop) => {
                _isCurYear = filPeriodDrop == _curYear ? true : false;
                setFilCountryDrop(text.text as string);
              }}
            />
          </div>

          {/* Type section */}
          <div style={{ width: "16%" }}>
            <Label>Type</Label>
            <Dropdown
              styles={DropdownStyle}
              options={[...propDropValue.Type]}
              selectedKey={_getFilterDropValues(
                "Type",
                { ...propDropValue },
                filTypeDrop
              )}
              onChange={(e: any, text: IDrop) => {
                _isCurYear = filPeriodDrop == _curYear ? true : false;
                setFilTypeDrop(text.text as string);
              }}
            />
          </div>

          {/* Over all refresh section */}
          <div
            className={styles.refIcon}
            onClick={() => {
              _isCurYear = true;
              _getCancelItems();
              setFilPeriodDrop(moment().format("YYYY"));
              setFilCountryDrop("All");
              setFilTypeDrop("All");
            }}
          >
            <Icon iconName="Refresh" style={{ color: "#ffff" }} />
          </div>
        </div>
      </div>

      {/* Dashboard Detail list section */}
      <DetailsList
        items={[...items]}
        groups={[...group]}
        columns={[...detailColumn]}
        styles={_DetailsListStyle}
        setKey="set"
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.none}
      />
      {items.length == 0 && (
        <div className={styles.noRecords}>No data found !!!</div>
      )}
    </div>
  );
};

export default BudgetPlan;
