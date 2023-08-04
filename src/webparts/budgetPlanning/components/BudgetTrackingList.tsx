import * as React from "react";
import { useState, useEffect } from "react";
import styles from "./BudgetTrackingList.module.scss";
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
  IconButton,
  DefaultButton,
  IButtonStyles,
  DatePicker,
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
  IBudTrackDistribution,
  IOverAllTrackItem,
} from "../../../globalInterFace/BudgetInterFaces";
import { _getFilterDropValues } from "../../../CommonServices/DropFunction";
import SPServices from "../../../CommonServices/SPServices";
import { _filterArray } from "../../../CommonServices/filterCommonArray";
import { Accordion } from "@pnp/spfx-controls-react/lib/Accordion";
import Loader from "./Loader";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import * as moment from "moment";

let propDropValue: IDropdowns;
let isUserPermissions: IGroupUsers;
let _arrCategory: ICurCategoryItem[] = [];
let _arrBudget: ICurBudgetItem[] = [];
let _arrDistribution: IBudTrackDistribution[] = [];

const BudgetTrackingList = (props: any): JSX.Element => {
  /* Variable creation */
  propDropValue = { ...props.dropValue };
  isUserPermissions = { ...props.groupUsers };

  /* State creation */
  const [isLoader, setIsLoader] = useState<boolean>(true);
  const [filPeriodDrop, setFilPeriodDrop] = useState<string>(
    propDropValue.Period[propDropValue.Period.length - 1].text
  );
  const [filCountryDrop, setFilCountryDrop] = useState<string>("All");
  const [filTypeDrop, setFilTypeDrop] = useState<string>("All");
  const [filAreaDrop, setFilAreaDrop] = useState<string>("All");
  const [trackItems, setTrackItems] = useState<IOverAllTrackItem[]>([]);

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
      ".ms-DetailsHeader-cellTitle": {
        display: "flex",
        justifyContent: "start",
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

  const disabledDropdownStyles: Partial<IDropdownStyles> = {
    title: {
      background: "#fff",
      border: "1px solid #000",
    },
    root: {
      width: "100%",
    },
    dropdown: {
      ":focus::after": {
        border: "1px solid #000",
      },
    },
  };

  const buttonStyles: Partial<IButtonStyles> = {
    root: {
      ".ms-Button-label": {
        fontWeight: "500",
      },
    },
  };

  /* function creation */
  const _getErrorFunction = (errMsg: any): void => {
    alertify.error("Error Message");
    setIsLoader(false);
  };

  const _getDefaultFunction = (): void => {
    setIsLoader(true);
    _getCategoryDatas();
  };

  const _getCategoryDatas = (): void => {
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
          FilterValue: filPeriodDrop,
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
            i + 1 == resCate.length && _getBudgetDatas([..._curCategory]);
          }
        } else {
          setTrackItems([]);
          setIsLoader(false);
        }
      })
      .catch((err: any) => {
        _getErrorFunction(err);
      });
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
          FilterValue: filPeriodDrop,
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
              _getDistributionDatas([..._arrCate], [..._curItem]);
          }
        } else {
          setTrackItems([]);
          setIsLoader(false);
        }
      })
      .catch((err: any) => {
        _getErrorFunction(err);
      });
  };

  const _getDistributionDatas = (
    _arrCate: ICurCategoryItem[],
    _arrBud: ICurBudgetItem[]
  ): void => {
    SPServices.SPReadItems({
      Listname: Config.ListNames.DistributionList,
      Select: "*, Year/ID, Year/Title, Budget/ID, Budget/Title",
      Expand: "Year, Budget",
      Filter: [
        {
          FilterKey: "isDeleted",
          FilterValue: "1",
          Operator: "ne",
        },
        {
          FilterKey: "Status",
          FilterValue: "Approved",
          Operator: "eq",
        },
        {
          FilterKey: "Year/Title",
          Operator: "eq",
          FilterValue: filPeriodDrop,
        },
      ],
      Topcount: 5000,
      Orderbydecorasc: false,
    })
      .then((resDis: any) => {
        let _arrDis: IBudTrackDistribution[] = [];

        if (resDis.length) {
          resDis.forEach((e: any) => {
            _arrDis.push({
              ID: e.ID,
              BudgetId: e.BudgetId ? e.Budget.ID : null,
              Cost: e.Pricing ? e.Pricing : null,
              Vendor: e.Vendor ? e.Vendor : "",
              Po: e.PO ? e.PO : "",
              PoCurrency: "",
              InvoiceNo: "",
              Area: e.Area ? e.Area : "",
              EntryDate: moment(e.Created).format("MM/DD/YYYY"),
              StartDate: null,
              ToDate: null,
            });
          });

          resDis.length == _arrDis.length &&
            _areaFilterFun([..._arrCate], [..._arrBud], [..._arrDis]);
        } else {
          setTrackItems([]);
          setIsLoader(false);
        }
      })
      .catch((err: any) => {
        _getErrorFunction(err);
      });
  };

  const _areaFilterFun = (
    _arrCate: ICurCategoryItem[],
    _arrBud: ICurBudgetItem[],
    _arrDis: any[]
  ): void => {
    if (_arrCate.length && _arrBud.length && _arrDis.length) {
      _arrCategory = _filterArray(
        isUserPermissions,
        [..._arrCate],
        Config.Navigation.BudgetTrackingList
      );

      _arrBudget = _filterArray(
        isUserPermissions,
        [..._arrBud],
        Config.Navigation.BudgetTrackingList
      );

      _arrDistribution = _filterArray(
        isUserPermissions,
        [..._arrDis],
        Config.Navigation.BudgetTrackingList
      );

      if (_arrCategory.length && _arrBudget.length && _arrDistribution.length) {
        _getFilterFunction();
      } else {
        setTrackItems([]);
        setIsLoader(false);
      }
    } else {
      setTrackItems([]);
      setIsLoader(false);
    }
  };

  const _getFilterFunction = (): void => {
    let tempArr: ICurCategoryItem[] = [..._arrCategory];

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

    if (tempArr.length) {
      _arrMasterCategoryData([...tempArr]);
    } else {
      setTrackItems([]);
      setIsLoader(false);
    }
  };

  const _arrMasterCategoryData = (tempArr: ICurCategoryItem[]): void => {
    let _arrMasterCategory: IOverAllTrackItem[] = [];

    for (let i: number = 0; tempArr.length > i; i++) {
      _arrMasterCategory.push({
        CategoryAcc: tempArr[i].CategoryAcc.Text,
        YearAcc: tempArr[i].YearAcc.Text,
        CountryAcc: tempArr[i].CountryAcc.Text,
        Type: tempArr[i].Type,
        Area: tempArr[i].Area,
        ID: tempArr[i].ID,
        yearID: tempArr[i].YearAcc.ID,
        countryID: tempArr[i].CountryAcc.ID,
        OverAllBudgetCost: tempArr[i].OverAllBudgetCost,
        TotalProposed: tempArr[i].TotalProposed,
        VendorDetails: [],
      });
      i + 1 == tempArr.length && _getPrepareArray([..._arrMasterCategory]);
    }
  };

  const _getPrepareArray = (_cateArray: IOverAllTrackItem[]): void => {
    let _arrTrack: IOverAllTrackItem[] = [];

    for (let i: number = 0; _cateArray.length > i; i++) {
      for (let j: number = 0; _arrBudget.length > j; j++) {
        if (
          _cateArray[i].ID === _arrBudget[j].CateId &&
          _cateArray[i].CategoryAcc === _arrBudget[j].Category &&
          _cateArray[i].CountryAcc === _arrBudget[j].Country &&
          _cateArray[i].YearAcc === _arrBudget[j].Year &&
          _cateArray[i].Type === _arrBudget[j].Type &&
          _cateArray[i].Area === _arrBudget[j].Area
        ) {
          let _isTrack: Boolean = false;

          for (let k: number = 0; _arrDistribution.length > k; k++) {
            if (_arrBudget[j].ID === _arrDistribution[k].BudgetId) {
              _isTrack = true;
              _arrDistribution[k].Item = _arrBudget[j].Description;
              _arrDistribution[k].Type = _arrBudget[j].Type;

              _cateArray[i].VendorDetails.push({ ..._arrDistribution[k] });
            }

            if (_isTrack && k + 1 === _arrDistribution.length) {
              _arrTrack.push({ ..._cateArray[i] });
            }
          }
        }
      }
    }

    if (_arrTrack.length) {
      console.log([..._arrTrack]);
      setTrackItems([..._arrTrack]);
      setIsLoader(false);
    } else {
      setTrackItems([]);
      setIsLoader(false);
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
      <Label className={styles.HeaderLable}>Budget Tracking List</Label>

      {/* Dropdown and btn section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        {/* Dropdown section */}
        <div
          style={{
            display: "flex",
            gap: "2%",
            width: "95%",
          }}
        >
          {/* Country dropdown section */}
          <div style={{ width: "15%" }}>
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
                setFilCountryDrop(text.text as string);
              }}
            />
          </div>

          {/* Area dropdown section */}
          <div style={{ width: "15%" }}>
            <Label>Area</Label>
            <Dropdown
              styles={DropdownStyle}
              options={[...propDropValue.Area]}
              selectedKey={_getFilterDropValues(
                "Area",
                {
                  ...propDropValue,
                },
                filAreaDrop
              )}
              onChange={(e: any, text: IDrop) => {
                setFilAreaDrop(text.text as string);
              }}
            />
          </div>

          {/* Category type dropdown section */}
          <div style={{ width: "8%" }}>
            <Label>Category Type</Label>
            <Dropdown
              styles={disabledDropdownStyles}
              options={[...propDropValue.Type]}
              selectedKey={_getFilterDropValues(
                "Type",
                {
                  ...propDropValue,
                },
                filTypeDrop
              )}
              onChange={(e: any, text: IDrop) => {
                setFilTypeDrop(text.text as string);
              }}
            />
          </div>

          {/* Year dropdown section */}
          <div style={{ width: "8%" }}>
            <Label>Year</Label>
            <Dropdown
              styles={DropdownStyle}
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

          {/* Over all refresh section */}
          <div style={{ display: "flex", alignItems: "end" }}>
            <div
              className={styles.refIcon}
              onClick={() => {
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

        {/* btn section */}
        <div style={{ display: "flex", alignItems: "end", width: "5%" }}>
          <DefaultButton
            text="Submit"
            styles={buttonStyles}
            className={styles.export}
            style={{
              cursor: true ? "pointer" : "not-allowed",
            }}
            onClick={() => {
              setIsLoader(false);
            }}
          />
        </div>
      </div>

      {/* Accordion section */}
      {trackItems.length ? (
        trackItems.map((item: IOverAllTrackItem, index: number) => {
          return (
            <Accordion
              title={`${item.CategoryAcc} - ${item.CountryAcc} ( ${item.Type} ) ~ ${item.OverAllBudgetCost}`}
              defaultCollapsed={true}
              collapsedIcon={"ChevronRight"}
              expandedIcon={"ChevronDown"}
              key={index}
            >
              <div
                style={{
                  width: "100%",
                }}
              >
                {/* Table section */}
                <table
                  style={{
                    width: "100%",
                    marginBottom: "20px",
                  }}
                >
                  {/* table header section */}
                  <tr>
                    <th>Entry Date</th>
                    <th>Item</th>
                    <th>Cost</th>
                    <th>Type</th>
                    <th>Vendor</th>
                    <th>Starting Date</th>
                    <th>To Date</th>
                    <th>PO#</th>
                    <th>PO Currency</th>
                    <th>Invoice No</th>
                  </tr>

                  {/* table body section */}
                  {item.VendorDetails.map(
                    (data: IBudTrackDistribution, i: number) => {
                      return (
                        <tr>
                          <td>{data.EntryDate}</td>
                          <td>{data.Item}</td>
                          <td>{data.Cost}</td>
                          <td>{data.Type}</td>
                          <td>{data.Vendor}</td>
                          <td>
                            <DatePicker
                              placeholder="MM/DD/YYYY"
                              value={
                                data.StartDate ? new Date(data.StartDate) : null
                              }
                              formatDate={(date) =>
                                moment(date).format("MM/DD/YYYY")
                              }
                              onSelectDate={() => {}}
                            />
                          </td>
                          <td>
                            <DatePicker
                              placeholder="MM/DD/YYYY"
                              value={data.ToDate ? new Date(data.ToDate) : null}
                              formatDate={(date) =>
                                moment(date).format("MM/DD/YYYY")
                              }
                              onSelectDate={() => {}}
                            />
                          </td>
                          <td>{data.Po}</td>
                          <td>{data.PoCurrency}</td>
                          <td>{data.InvoiceNo}</td>
                        </tr>
                      );
                    }
                  )}
                </table>

                {/* Over All Amount Details */}
                <div>Deva</div>
              </div>
            </Accordion>
          );
        })
      ) : (
        <div className={styles.noRecords}>No data found !!!</div>
      )}
    </div>
  );
};

export default BudgetTrackingList;
