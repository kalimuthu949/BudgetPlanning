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
  Modal,
  TextField,
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

let propDropValue: IDropdowns;
let _curYear: string = moment().format("YYYY");
let _Items: ICurBudgetItem[] = [];
let _groupItem: IOverAllItem[] = [];
let alertifyMSG: string = "";
let _isBack: boolean = false;

const BudgetPlan = (props: any): JSX.Element => {
  /* Variable creation */
  propDropValue = { ...props.dropValue };

  const _budgetPlanColumns: IColumn[] = [
    {
      key: "column1",
      name: "Category",
      fieldName: Config.BudgetListColumns.CategoryId.toString(),
      minWidth: 100,
      maxWidth: 200,
      onRender: (item: ICurBudgetItem): any => {
        return item.ID ? item.Category : item.isEdit && item.Category;
      },
    },
    {
      key: "column2",
      name: "Country",
      fieldName: Config.BudgetListColumns.CountryId.toString(),
      minWidth: 100,
      maxWidth: 200,
      onRender: (item: ICurBudgetItem): any => {
        return item.ID ? item.Country : item.isEdit && item.Country;
      },
    },
    {
      key: "column3",
      name: "Description",
      fieldName: Config.BudgetListColumns.Description,
      minWidth: 100,
      maxWidth: 200,
      onRender: (item: ICurBudgetItem): any => {
        return !item.isEdit ? (
          item.Description
        ) : (
          <div>
            <TextField
              value={curData.Description ? curData.Description : ""}
              styles={isValidation.isDescription ? {} : {}}
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
      minWidth: 100,
      maxWidth: 250,
      onRender: (item: ICurBudgetItem): any => {
        return item.isDummy && !item.isEdit ? (
          <div
            style={{
              cursor: "pointer",
              color: "#202945",
              fontWeight: "600",
              fontSize: "14px",
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
        ) : !item.isEdit ? (
          item.BudgetAllocated
        ) : (
          <div>
            <TextField
              value={
                curData.BudgetAllocated
                  ? curData.BudgetAllocated.toString()
                  : ""
              }
              placeholder="Enter Here"
              styles={isValidation.isBudgetAllocated ? {} : {}}
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
      fieldName: Config.BudgetListColumns.Used,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      key: "column6",
      name: "Remaining",
      fieldName: Config.BudgetListColumns.RemainingCost,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      key: "column7",
      name: "Action",
      fieldName: "",
      minWidth: 100,
      maxWidth: 200,
      onRender: (item: any) => {
        return (
          <div>
            {item.isEdit ? (
              <div
                style={{
                  display: "flex",
                  gap: "3%",
                }}
              >
                <Icon
                  iconName="CheckMark"
                  style={{
                    color: "green",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    _isBack = !item.isEdit;
                    _getPrepareDatas();
                  }}
                />
                <Icon
                  iconName="Cancel"
                  style={{
                    color: "red",
                    fontSize: "14px",
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
                    gap: "3%",
                  }}
                >
                  <Icon
                    iconName="Edit"
                    style={{
                      color: "blue",
                      fontSize: "14px",
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
                      fontSize: "14px",
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
  const [isModal, setIsModal] = useState<boolean>(false);
  const [curData, setCurData] = useState<ICurBudgetItem>(Config.curBudgetItem);
  const [isValidation, setIsValidation] = useState<IBudgetValidation>(
    Config.budgetValidation
  );

  /* Style creation */
  const _DetailsListStyle = {
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
      ".ms-DetailsHeader-cellTitle .cellName-139": {
        color: "#202945",
        fontWeight: "700 !important",
        fontSize: "16px !important",
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
      return dialogText;
    }
  };

  const _getCategoryDatas = (): void => {
    SPServices.SPReadItems({
      Listname: Config.ListNames.CategoryList,
      Select: "*, Year/ID, Year/Title, Country/ID, Country/Title",
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
        if (_arrCateDatas[i].ID == _arrBudget[j].CateId) {
          isDatas = false;
          _arrCateDatas[i].subCategory.push(_arrBudget[j]);
        }
        if (!isDatas && j + 1 == _arrBudget.length) {
          _arrCateDatas[i].subCategory.push({
            Category: _arrCateDatas[i].CategoryAcc,
            Year: _arrCateDatas[i].YearAcc,
            Type: _arrCateDatas[i].Type,
            Country: _arrCateDatas[i].CountryAcc,
            ApproveStatus: "",
            Description: "",
            ID: null,
            CateId: _arrCateDatas[i].ID,
            CounId: _arrCateDatas[i].countryID,
            YearId: _arrCateDatas[i].yearID,
            BudgetAllocated: null,
            BudgetProposed: null,
            Used: null,
            RemainingCost: null,
            isDeleted: false,
            isEdit: false,
            isDummy: true,
          });
          _arrOfMaster.push(_arrCateDatas[i]);
        }
      }
      if (isDatas) {
        _curEmptyItem = {
          Category: _arrCateDatas[i].CategoryAcc,
          Year: _arrCateDatas[i].YearAcc,
          Type: _arrCateDatas[i].Type,
          Country: _arrCateDatas[i].CountryAcc,
          ApproveStatus: "",
          Description: "",
          ID: null,
          CateId: _arrCateDatas[i].ID,
          CounId: _arrCateDatas[i].countryID,
          YearId: _arrCateDatas[i].yearID,
          BudgetAllocated: null,
          BudgetProposed: null,
          Used: null,
          RemainingCost: null,
          isDeleted: false,
          isEdit: false,
          isDummy: true,
        };
        _arrCateDatas[i].subCategory.push({ ..._curEmptyItem });
        _arrOfMaster.push(_arrCateDatas[i]);
      }
      i + 1 == _arrCateDatas.length && groups([..._arrOfMaster]);
    }
  };

  const groups = (_filRecord: IOverAllItem[]): void => {
    let reOrderedRecords: ICurBudgetItem[] = [];
    let Uniquelessons: ICurBudgetItem[] = [];
    let matches: ICurBudgetItem[] = [];
    let _overAllCategoryArr: ICurBudgetItem[] = [];

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
      let FilteredData: ICurBudgetItem[] = Uniquelessons.filter((arr: any) => {
        return (
          arr.Category === ul.CategoryAcc &&
          arr.Year === ul.YearAcc &&
          arr.Country === ul.CountryAcc
        );
      });
      let sortingRecord = reOrderedRecords.concat(FilteredData);
      reOrderedRecords = sortingRecord;
    });
    groupsforDL([...reOrderedRecords], [..._filRecord]);
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
        indexValue: i == 0 ? i : _recordsLength,
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
      data[columns.Description] = curData.Description;
      data[columns.BudgetAllocated] = Number(curData.BudgetAllocated);
      _getEditData({ ...data }, "Updated");
    } else {
      data[columns.CategoryId] = curData.CateId;
      data[columns.CountryId] = curData.CounId;
      data[columns.YearId] = curData.YearId;
      data[columns.Description] = curData.Description;
      data[columns.CategoryType] = curData.Type;
      data[columns.BudgetAllocated] = Number(curData.BudgetAllocated);
      _getValidation({ ...data });
    }
  };

  const _getValidation = (data: any): void => {
    let _isValid: boolean = true;
    if (!curData.Description) {
      _isValid = false;
      isValidation.isDescription = true;
    }
    if (!curData.BudgetAllocated) {
      _isValid = false;
      isValidation.isBudgetAllocated = true;
    }
    if (_isValid) {
      setIsLoader(true);
      _getAddData({ ...data });
      setIsValidation({ ...Config.budgetValidation });
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
        _getEditItem(_item);
      } else null;
    } else {
      _isBack = false;
    }
  };

  /* Life cycle of onload */
  useEffect(() => {
    alertifyMSG = "";
    _isBack = false;
    setIsValidation({ ...Config.budgetValidation });
    setIsLoader(true);
    filPeriodDrop == _curYear ? _budgetPlanColumns : _budgetPlanColumns.pop();
    setDetailColumn([..._budgetPlanColumns]);
    _getCategoryDatas();
  }, [filCountryDrop, filPeriodDrop, filTypeDrop]);

  return isLoader ? (
    <Loader />
  ) : (
    <div style={{ width: "100%" }}>
      {/* Heading section */}
      <Label className="HeaderLable">Budget Planning</Label>

      {/* Filter section */}
      <div className="filterSection">
        {/* Left side section */}
        <div className="filters">
          {/* Period section */}
          <div style={{ width: "16%" }}>
            <Label>Period</Label>
            <Dropdown
              options={[...propDropValue.Period]}
              selectedKey={_getFilterDropValues(
                "Period",
                { ...propDropValue },
                filPeriodDrop
              )}
              onChange={(e: any, text: IDrop) => {
                setFilPeriodDrop(text.text as string);
              }}
            />
          </div>

          {/* Country section */}
          <div style={{ width: "16%" }}>
            <Label>Country</Label>
            <Dropdown
              options={[...propDropValue.Country]}
              selectedKey={_getFilterDropValues(
                "Country",
                {
                  ...propDropValue,
                },
                filCountryDrop
              )}
              onChange={(e: any, text: IDrop) => {
                setFilCountryDrop(text.text as string);
              }}
            />
          </div>

          {/* Type section */}
          <div style={{ width: "16%" }}>
            <Label>Type</Label>
            <Dropdown
              options={[...propDropValue.Type]}
              selectedKey={_getFilterDropValues(
                "Type",
                { ...propDropValue },
                filTypeDrop
              )}
              onChange={(e: any, text: IDrop) => {
                setFilTypeDrop(text.text as string);
              }}
            />
          </div>

          {/* Over all refresh section */}
          <div
            className="refIcon"
            onClick={() => {
              _getCancelItems();
              setFilPeriodDrop(moment().format("YYYY"));
              setFilCountryDrop("All");
              setFilTypeDrop("All");
            }}
          >
            <Icon iconName="Refresh" style={{ color: "#ffff" }} />
          </div>
        </div>

        {/* Right side section */}
        {filPeriodDrop == _curYear && (
          <div className="btnSection">
            <button
              className="btns"
              style={{ background: "#c5c5c5", display: "none" }}
            >
              Cancel
            </button>
            <button
              className="btns"
              style={{ background: "#f6db55" }}
              onClick={() => {
                setIsModal(true);
              }}
            >
              New
            </button>
          </div>
        )}
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

      {/* New Form Modal section */}
      <Modal
        isOpen={isModal}
        isBlocking={false}
        styles={{
          main: {
            width: "25%",
            minHeight: 75,
            borderRadius: 4,
            padding: "10px",
          },
        }}
      >
        <div className="_newForm">
          <Label>New Category Form</Label>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Icon
              iconName="Cancel"
              style={{
                cursor: "pointer",
                fontWeight: 500,
              }}
              onClick={() => {
                setIsModal(false);
              }}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            color: "red",
          }}
        >
          Develop comming soon...
        </div>
      </Modal>
    </div>
  );
};

export default BudgetPlan;
