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
  Modal,
  IModalStyles,
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
  IGroupUsers,
} from "../../../globalInterFace/BudgetInterFaces";
import { _getFilterDropValues } from "../../../CommonServices/DropFunction";
import SPServices from "../../../CommonServices/SPServices";
import Loader from "./Loader";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import styles from "./BudgetPlanning.module.scss";
import { _filterArray } from "../../../CommonServices/filterCommonArray";

let propDropValue: IDropdowns;
let _Items: ICurBudgetItem[] = [];
let _groupItem: IOverAllItem[] = [];
let alertifyMSG: string = "";
let _isBack: boolean = false;
let _isCurYear: boolean = true;
let isUserPermissions: IGroupUsers;

const BudgetPlan = (props: any): JSX.Element => {
  /* Variable creation */
  propDropValue = { ...props.dropValue };
  let _curYear: string =
    propDropValue.Period[propDropValue.Period.length - 1].text;
  isUserPermissions = { ...props.groupUsers };

  const _budgetPlanColumns: IColumn[] = [
    {
      key: "column1",
      name: "Category",
      fieldName: Config.BudgetListColumns.CategoryId.toString(),
      minWidth: 200,
      maxWidth: _isCurYear ? 200 : 280,
      onRender: (item: ICurBudgetItem): any => {
        return item.ID ? item.Category : item.isEdit && item.Category;
      },
    },
    {
      key: "column2",
      name: "Area",
      fieldName: Config.BudgetListColumns.Area,
      minWidth: 150,
      maxWidth: _isCurYear ? 150 : 230,
      onRender: (item: ICurBudgetItem): any => {
        return item.ID ? item.Area : item.isEdit && item.Area;
      },
    },
    {
      key: "column3",
      name: "Description",
      fieldName: Config.BudgetListColumns.Description,
      minWidth: 300,
      maxWidth: _isCurYear ? 330 : 400,
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
                  _getEditItem(item, "Add");
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
      name: "Comment",
      fieldName: Config.BudgetListColumns.Comments,
      minWidth: 280,
      maxWidth: 300,
      onRender: (item: ICurBudgetItem): any => {
        return item.isDummy && !item.isEdit ? null : !item.isEdit ? (
          <div>{item.Comments.trim() ? item.Comments : "N/A"}</div>
        ) : (
          <div>
            <TextField
              multiline
              value={curData.Comments ? curData.Comments : ""}
              placeholder="Enter Here"
              styles={multilineStyle}
              className={styles.multilinePlaceHolder}
              onChange={(e: any) => {
                curData.Comments = e.target.value;
                setCurData({ ...curData });
              }}
            />
          </div>
        );
      },
    },
    {
      key: "column5",
      name: "Budget Required",
      fieldName: Config.BudgetListColumns.BudgetAllocated,
      minWidth: 100,
      maxWidth: 130,
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
      key: "column6",
      name: "Used",
      minWidth: 100,
      maxWidth: 130,
      onRender: (item: any) => {
        return <div style={{ color: "#AC455E" }}>{item.Used}</div>;
      },
    },
    {
      key: "column7",
      name: "Remaining",
      minWidth: 100,
      maxWidth: 130,
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
      key: "column8",
      name: "Action",
      minWidth: 50,
      maxWidth: 80,
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
                        _getEditItem(item, "Edit");
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
                        _getEditItem(item, "Deleted");
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
    propDropValue.Period[propDropValue.Period.length - 1].text
  );
  const [filCountryDrop, setFilCountryDrop] = useState<string>("All");
  const [filTypeDrop, setFilTypeDrop] = useState<string>("All");
  const [filAreaDrop, setFilAreaDrop] = useState<string>("All");
  const [curData, setCurData] = useState<ICurBudgetItem>(Config.curBudgetItem);
  const [isValidation, setIsValidation] = useState<IBudgetValidation>(
    Config.budgetValidation
  );
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);

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
  const multilineStyle: Partial<ITextFieldStyles> = {
    fieldGroup: {
      minHeight: 18,
      "::after": {
        border: "1px solid rgb(96, 94, 92)",
      },
    },
    field: {
      padding: "0px 8px",
    },
    root: {
      textarea: {
        resize: "none",
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

  const modalStyles: Partial<IModalStyles> = {
    main: {
      width: "20%",
      minHeight: 128,
      background: "#f7f9fa",
      padding: 10,
      height: "auto",
      borderRadius: 4,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
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
    _getCategoryDatas(filPeriodDrop);
  };

  const _getCategoryDatas = (year: string): void => {
    SPServices.SPReadItems({
      Listname: Config.ListNames.CategoryList,
      Select:
        "*, Year/ID, Year/Title, Country/ID, Country/Title, MasterCategory/ID",
      Expand: "Year, Country, MasterCategory",
      Filter: [
        {
          FilterKey: "isDeleted",
          Operator: "ne",
          FilterValue: "1",
        },
        {
          FilterKey: "Year/Title",
          Operator: "eq",
          FilterValue: year,
        },
      ],
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
              Area: resCate[i].Area ? resCate[i].Area : "",
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
              OverAllBudgetCost: resCate[i].OverAllBudgetCost
                ? resCate[i].OverAllBudgetCost
                : null,
              TotalProposed: resCate[i].TotalProposed
                ? resCate[i].TotalProposed
                : null,
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
    let _filArray: ICurCategoryItem[] = [];
    // tempArr = tempArr.filter((arr: ICurCategoryItem) => {
    //   return arr.YearAcc.Text == filPeriodDrop;
    // });
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
    if (filAreaDrop != "All" && tempArr.length) {
      tempArr = tempArr.filter((arr: ICurCategoryItem) => {
        return arr.Area == filAreaDrop;
      });
    }

    _filArray = _filterArray(
      isUserPermissions,
      [...tempArr],
      Config.Navigation.BudgetPlanning
    );

    if (_filArray.length) {
      _getBudgetDatas([..._filArray]);
    } else {
      setItems([]);
      setGroup([]);
      setIsLoader(false);
    }
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
        {
          FilterKey: "Year/Title",
          Operator: "eq",
          FilterValue: _arrCate[0].YearAcc.Text,
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
              Area: resBudget[i].Area ? resBudget[i].Area : "",
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
              Comments: resBudget[i].Comments ? resBudget[i].Comments : "",
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
          Area: _arrCate[i].Area,
          ID: _arrCate[i].ID,
          yearID: _arrCate[i].YearAcc.ID,
          countryID: _arrCate[i].CountryAcc.ID,
          OverAllBudgetCost: _arrCate[i].OverAllBudgetCost,
          TotalProposed: _arrCate[i].TotalProposed,
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
          _arrCateDatas[i].Type == _arrBudget[j].Type &&
          _arrCateDatas[i].Area == _arrBudget[j].Area
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
      Area: _arrCateDatas.Area,
      BudgetAllocated: null,
      BudgetProposed: null,
      Used: null,
      RemainingCost: null,
      ApproveStatus: "",
      Description: "",
      Comments: "",
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
                  e1.Country === e2.CountryAcc &&
                  e1.Type === e2.Type &&
                  e1.CateId === e2.ID &&
                  e1.Area === e2.Area
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
              arr.CateId === ul.ID &&
              arr.Type === ul.Type &&
              arr.Area === ul.Area
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
        Type: arr.Type ? arr.Type : "",
        Area: arr.Area ? arr.Area : "",
        ID: arr.ID ? arr.ID : null,
        OverAllBudgetCost: arr.OverAllBudgetCost ? arr.OverAllBudgetCost : null,
        TotalProposed: arr.TotalProposed ? arr.TotalProposed : null,
        indexValue: _recordsLength,
      });
      _recordsLength += arr.subCategory.length;
    });
    newRecords.forEach((ur: any, index: number) => {
      let recordLength: number = records.filter((arr: ICurBudgetItem) => {
        return (
          arr.CateId === ur.ID && arr.Type === ur.Type && arr.Area === ur.Area
        );
      }).length;
      let _totalAmount: string = ur.OverAllBudgetCost
        ? ur.OverAllBudgetCost.toString()
        : ur.TotalProposed
        ? ur.TotalProposed.toString()
        : "0";
      varGroup.push({
        key: ur.Category,
        name: ur.Country
          ? `${
              ur.Category +
              " - " +
              ur.Country +
              " ( " +
              ur.Type +
              " ) ~ " +
              _totalAmount
            }`
          : ur.Category,
        startIndex: ur.indexValue,
        count: recordLength,
      });
      if (index == newRecords.length - 1) {
        _Items = [...records];
        _isBack = false;
        setItems([...records]);
        setGroup([...varGroup]);
        setIsDeleteModal(false);
        alertifyMSG && alertify.success(`Item ${alertifyMSG} successfully`);
        setIsLoader(false);
      }
    });
  };

  const _getEditItem = (_curItem: ICurBudgetItem, type: string): void => {
    curData.Category = _curItem.Category;
    curData.Year = _curItem.Year;
    curData.Type = _curItem.Type;
    curData.Country = _curItem.Country;
    curData.ApproveStatus = _curItem.ApproveStatus;
    curData.Description = _curItem.Description;
    curData.Comments = _curItem.Comments;
    curData.Area = _curItem.Area;
    curData.ID = _curItem.ID;
    curData.CateId = _curItem.CateId;
    curData.CounId = _curItem.CounId;
    curData.YearId = _curItem.YearId;
    curData.BudgetAllocated = _curItem.BudgetAllocated;
    curData.BudgetProposed = _curItem.BudgetAllocated;
    curData.Used = _curItem.Used;
    curData.RemainingCost = _curItem.RemainingCost;
    curData.isDeleted = false;
    curData.isEdit = false;
    setCurData({ ...curData });

    if (type == "Deleted") {
      setIsDeleteModal(true);
    } else {
      for (let i: number = 0; _Items.length > i; i++) {
        if (
          _Items[i].Category === _curItem.Category &&
          _Items[i].Country === _curItem.Country &&
          _Items[i].Year === _curItem.Year &&
          _Items[i].Type === _curItem.Type &&
          _Items[i].ID === _curItem.ID &&
          _Items[i].Area === _curItem.Area
        ) {
          _Items[i].isEdit = true;
        } else {
          _Items[i].isEdit = false;
        }
        i + 1 == _Items.length && setItems([..._Items]);
      }
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
      data[columns.BudgetProposed] = Number(curData.BudgetAllocated);
      data[columns.BudgetAllocated] = Number(curData.BudgetAllocated);
      data[columns.Comments] = curData.Comments;
      data[columns.Area] = curData.Area;
      _getValidation({ ...data }, "Updated");
    } else {
      data[columns.CategoryId] = curData.CateId;
      data[columns.CountryId] = curData.CounId;
      data[columns.YearId] = curData.YearId;
      data[columns.Description] = curData.Description;
      data[columns.CategoryType] = curData.Type;
      data[columns.BudgetProposed] = Number(curData.BudgetAllocated);
      data[columns.BudgetAllocated] = Number(curData.BudgetAllocated);
      data[columns.Comments] = curData.Comments;
      data[columns.Area] = curData.Area;
      _getValidation({ ...data }, "");
    }
  };

  const _getValidation = (data: any, type: string): void => {
    let _isValid: boolean = true;
    let _isDuplicate: boolean = false;
    let _arrDuplicate: ICurBudgetItem[] = _Items.filter(
      (e: ICurBudgetItem) => e.CateId === curData.CateId && e.ID != curData.ID
    );
    _isDuplicate = [..._arrDuplicate].some(
      (e: ICurBudgetItem) =>
        e.Description.toLowerCase().trim() ===
        curData.Description.toLowerCase().trim()
    );

    if (!curData.Description.trim() || _isDuplicate) {
      _isValid = false;
      isValidation.isDescription = _isDuplicate ? _isDuplicate : true;
      isValidation.isBudgetAllocated = curData.BudgetAllocated ? false : true;
    }
    if (!curData.BudgetAllocated || _isDuplicate) {
      _isValid = false;
      isValidation.isBudgetAllocated = curData.BudgetAllocated ? false : true;
      isValidation.isDescription = _isDuplicate
        ? _isDuplicate
        : curData.Description.trim()
        ? false
        : true;
    }

    if (!curData.Description.trim() && !curData.BudgetAllocated) {
      alertify.error("Please enter description and budget allocated");
    } else if (
      (!curData.Description.trim() || _isDuplicate) &&
      !curData.BudgetAllocated
    ) {
      _isDuplicate && !curData.BudgetAllocated
        ? alertify.error(
            "Already description exists and Please enter budget allocated"
          )
        : !curData.Description.trim()
        ? alertify.error("Please enter description")
        : _isDuplicate
        ? alertify.error("Already description exists")
        : !curData.Description.trim() &&
          alertify.error("Please enter description");
    } else if (_isDuplicate || !curData.Description.trim()) {
      !curData.Description.trim()
        ? alertify.error("Please enter description")
        : alertify.error("Already description exists");
    } else if (!curData.BudgetAllocated) {
      alertify.error("Please enter budget allocated");
    } else if (!curData.Description.trim()) {
      alertify.error("Please enter description");
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
        let _TotalAmount: number = 0;
        curData.ID = _resAdd.data.ID;
        _Items.push({ ...curData });
        for (let i: number = 0; _Items.length > i; i++) {
          if (
            _Items[i].CateId == curData.CateId &&
            _Items[i].Category == curData.Category &&
            _Items[i].Country == curData.Country &&
            _Items[i].Year == curData.Year &&
            _Items[i].Type == curData.Type &&
            _Items[i].Area == curData.Area
          ) {
            _TotalAmount +=
              _Items[i].ID == curData.ID
                ? Number(curData.BudgetAllocated)
                : _Items[i].BudgetAllocated
                ? Number(_Items[i].BudgetAllocated)
                : 0;
          }
          if (_Items[i].ID) {
            _arrNewBudget.push(_Items[i]);
          }
          i + 1 == _Items.length &&
            ((alertifyMSG = "Added"),
            _getUpdateCategoryTotal(_TotalAmount, [..._arrNewBudget]));
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
        let _TotalAmount: number = 0;
        let _message: string = "";
        let isDeleted: boolean = true;
        for (let i: number = 0; _Items.length > i; i++) {
          if (
            _Items[i].CateId == curData.CateId &&
            _Items[i].Category == curData.Category &&
            _Items[i].Country == curData.Country &&
            _Items[i].Year == curData.Year &&
            _Items[i].Type == curData.Type &&
            _Items[i].Area == curData.Area &&
            isDeleted
          ) {
            if (type == "Updated") {
              isDeleted = true;
              _TotalAmount +=
                _Items[i].ID == curData.ID
                  ? Number(curData.BudgetAllocated)
                  : _Items[i].BudgetAllocated
                  ? Number(_Items[i].BudgetAllocated)
                  : 0;
            } else {
              isDeleted = false;
              _TotalAmount =
                Number(
                  _groupItem.filter(
                    (e: IOverAllItem) => e.ID == curData.CateId
                  )[0].TotalProposed
                ) - Number(curData.BudgetProposed);
            }
          }

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
            _getUpdateCategoryTotal(_TotalAmount, [..._arrNewBudget]));
        }
      })
      .catch((err: any) => {
        _getErrorFunction(err);
      });
  };

  const _getUpdateCategoryTotal = (
    Total: number,
    _arrNewBudget: ICurBudgetItem[]
  ): void => {
    SPServices.SPUpdateItem({
      Listname: Config.ListNames.CategoryList,
      ID: curData.CateId,
      RequestJSON: {
        TotalProposed: Total,
      },
    })
      .then((res: any) => {
        let _emptyGroup: IOverAllItem[] = [];
        for (let i: number = 0; _groupItem.length > i; i++) {
          if (
            _groupItem[i].ID == curData.CateId &&
            _groupItem[i].CategoryAcc == curData.Category &&
            _groupItem[i].CountryAcc == curData.Country &&
            _groupItem[i].YearAcc == curData.Year &&
            _groupItem[i].Type == curData.Type &&
            _groupItem[i].Area == curData.Area
          ) {
            _groupItem[i].TotalProposed = Total;
            _emptyGroup.push({ ..._groupItem[i] });
          } else {
            _emptyGroup.push(_groupItem[i]);
          }
        }
        _prepareArrMasterDatas([..._emptyGroup], [..._arrNewBudget]);
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
          _getEditItem(_item, "Deleted");
        }
      } else if (
        confirm("You have unsaved changes, are you sure you want to leave?")
      ) {
        isValidation.isBudgetAllocated = false;
        isValidation.isDescription = false;
        setIsValidation({ ...isValidation });
        _getEditItem(_item, "Add");
      } else null;
    } else {
      _isBack = false;
    }
  };

  /* Life cycle of onload */
  useEffect(() => {
    _getDefaultFunction();
  }, [filCountryDrop, filPeriodDrop, filTypeDrop, filAreaDrop]);

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

          {/* Area section */}
          <div style={{ width: "16%" }}>
            <Label>Area</Label>
            <Dropdown
              styles={DropdownStyle}
              options={[...propDropValue.Area]}
              selectedKey={_getFilterDropValues(
                "Area",
                { ...propDropValue },
                filAreaDrop
              )}
              onChange={(e: any, text: IDrop) => {
                _isCurYear = filPeriodDrop == _curYear ? true : false;
                setFilAreaDrop(text.text as string);
              }}
            />
          </div>

          {/* Over all refresh section */}
          <div
            className={styles.refIcon}
            onClick={() => {
              _isCurYear = true;
              _getCancelItems();
              setFilPeriodDrop(
                propDropValue.Period[propDropValue.Period.length - 1].text
              );
              setFilCountryDrop("All");
              setFilTypeDrop("All");
              setFilAreaDrop("All");
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

      {/* Delete Modal section */}
      <Modal isOpen={isDeleteModal} isBlocking={false} styles={modalStyles}>
        <div>
          {/* Content section */}
          <Label
            style={{
              color: "red",
              fontSize: 16,
            }}
          >
            Do you want to delete this item?
          </Label>

          {/* btn section */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "6%",
              marginTop: "20px",
            }}
          >
            <button
              style={{
                width: "26%",
                height: 32,
                background: "#dc3120",
                border: "none",
                color: "#FFF",
                borderRadius: "3px",
                cursor: "pointer",
                padding: "4px 0px",
              }}
              onClick={() => {
                setIsDeleteModal(false);
              }}
            >
              No
            </button>
            <button
              style={{
                width: "26%",
                height: 32,
                color: "#FFF",
                background: "#2580e0",
                border: "none",
                borderRadius: "3px",
                cursor: "pointer",
                padding: "4px 0px",
              }}
              onClick={() => {
                setIsLoader(true);
                let data: any = {};
                const _deletedColumn: IBudgetListColumn =
                  Config.BudgetListColumns;
                data[_deletedColumn.isDeleted] = true;
                _getEditData({ ...data }, "Deleted");
              }}
            >
              Yes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BudgetPlan;
