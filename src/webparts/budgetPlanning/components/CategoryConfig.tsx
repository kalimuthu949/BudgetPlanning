import * as React from "react";
import { useState, useEffect } from "react";
import styles from "./CategoryConfig.module.scss";
import {
  Label,
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  IDetailsListStyles,
  Dropdown,
  IDropdownStyles,
  IColumn,
  Icon,
  IModalStyles,
} from "@fluentui/react";
import {
  ICategory,
  ICategoryListColumn,
  IDrop,
  IDropdowns,
  INewCate,
} from "../../../globalInterFace/BudgetInterFaces";
import { TextField, makeStyles } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import Loader from "./Loader";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import { _getFilterDropValues } from "../../../CommonServices/DropFunction";
import { Config } from "../../../globals/Config";
import SPServices from "../../../CommonServices/SPServices";
import { Modal } from "office-ui-fabric-react";
import commonServices from "../../../CommonServices/CommonServices";
import Pagination from "office-ui-fabric-react-pagination";

let propDropValue: IDropdowns;
let _isBack: boolean = false;
let _preparCareArray: ICategory[] = [];
let _strCountry: string = "All";
let _strCateType: string = "All";
let _numCate: any[] = [];
let _masterCateOption: IDrop[] = [];
let _isSubmit: boolean = false;
let _preNewCate: INewCate[] = [];
let _curItem: ICategory;
let _isCateMulti: boolean = false;

const CategoryConfig = (props: any): JSX.Element => {
  /* Variable creation */
  propDropValue = { ...props.dropValue };
  _masterCateOption = [...propDropValue.masterCate];

  const _categoryListColumns: IColumn[] = [
    {
      key: "column1",
      name: "Category",
      fieldName: "Title",
      minWidth: 200,
      maxWidth: 600,
    },
    {
      key: "column2",
      name: "Country",
      fieldName: "Country",
      minWidth: 200,
      maxWidth: 500,
    },
    {
      key: "column3",
      name: "Category Type",
      fieldName: "CategoryType",
      minWidth: 200,
      maxWidth: 400,
    },
    {
      key: "column4",
      name: "Action",
      fieldName: "",
      minWidth: 100,
      maxWidth: 150,
      onRender: (item: any) => {
        return (
          <div>
            <Icon
              iconName="Edit"
              style={{
                color: "blue",
                fontSize: "16px",
                cursor: "pointer",
              }}
              onClick={() => {
                _curItem = item;
                setIsModal(true);
              }}
            />
          </div>
        );
      },
    },
  ];

  /* State creation */
  const [isLoader, setIsLoader] = useState<boolean>(true);
  const [filCountryDrop, setFilCountryDrop] = useState<string>("All");
  const [filTypeDrop, setFilTypeDrop] = useState<string>("All");
  const [filMasCateKey, setFilMasCateKey] = useState<IDrop[]>([]);
  const [items, setItems] = useState<ICategory[]>([]);
  const [master, setMaster] = useState<ICategory[]>([]);
  const [cateOpt, setCateOpt] = useState<IDrop[]>([]);
  const [isModal, setIsModal] = useState<boolean>(false);
  const [pagination, setPagination] = useState<any>({
    totalPageItems: 10,
    pagenumber: 1,
  });

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
  };

  const modalStyles: Partial<IModalStyles> = {
    main: {
      width: "20%",
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
      return dialogText;
    }
  };

  const _getDefaultFunction = (): void => {
    setIsLoader(true);
    _isBack = false;
    _isSubmit = false;
    getCategoryRecords();
  };

  const getCategoryRecords = (): void => {
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
      Orderbydecorasc: false,
    })
      .then((res: any) => {
        _preparCareArray = [];
        let _lastYear: string =
          propDropValue.Period[propDropValue.Period.length - 1].text;
        if (res.length) {
          for (let i: number = 0; res.length > i; i++) {
            if (res[i].Year.Title == _lastYear) {
              let data: ICategory = {
                Title: res[i].Title ? res[i].Title : "",
                Country: res[i].CountryId ? res[i].Country.Title : "",
                Year: res[i].YearId ? res[i].Year.Title : "",
                CategoryType: res[i].CategoryType ? res[i].CategoryType : "",
                ID: res[i].ID,
              };
              _preparCareArray.push({ ...data });
            }
          }
        }
        _filterCategoryArray();
      })
      .catch((err: any) => {
        _getErrorFunction(err);
      });
  };

  const _filterCategoryArray = (): void => {
    let _filterdArray: ICategory[] = [..._preparCareArray];
    let _masterCateArray: IDrop[] = [...propDropValue.masterCate];

    if (_strCountry != "All") {
      _filterdArray = _filterdArray.filter((e: ICategory) => {
        return e.Country == _strCountry;
      });
    }
    if (_strCateType != "All") {
      _filterdArray = _filterdArray.filter((e: ICategory) => {
        return e.CategoryType == _strCateType;
      });
    }

    if (
      _masterCateArray.length &&
      _filterdArray.length &&
      (_strCountry != "All" || _strCateType != "All")
    ) {
      for (let i: number = 0; _filterdArray.length > i; i++) {
        _masterCateArray = _masterCateArray.filter((e: IDrop) => {
          return e.text.toLowerCase() != _filterdArray[i].Title.toLowerCase();
        });
        if (_filterdArray.length == i + 1) {
          setCateOpt([..._masterCateArray]);
          setItems([..._filterdArray]);
          setIsLoader(false);
        }
      }
    } else {
      setCateOpt([..._masterCateArray]);
      setItems([..._filterdArray]);
      setIsLoader(false);
    }
  };

  const _getOnChange = (): void => {
    let cunID: number = null;
    let yearID: number = null;
    let cateType: string = "";
    let _strMasCate: string[] = [];
    _preNewCate = [];

    cunID = propDropValue.Country.filter((e: IDrop) => e.text == _strCountry)[0]
      .ID;

    yearID = propDropValue.Period.filter(
      (e: IDrop) =>
        e.text == propDropValue.Period[propDropValue.Period.length - 1].text
    )[0].ID;

    cateType = propDropValue.Type.filter(
      (e: IDrop) => e.text == _strCateType
    )[0].text;

    if (_numCate.length) {
      for (let i: number = 0; _numCate.length > i; i++) {
        let _samString: string = "";
        _samString = propDropValue.masterCate.filter(
          (e: IDrop) => e.key == _numCate[i]
        )[0].text;
        _samString && _strMasCate.push(_samString);
      }
    }

    if (cunID && yearID && cateType != "All") {
      _isCateMulti = true;
    } else {
      _isCateMulti = false;
    }

    if (cunID && yearID && cateType != "All" && _strMasCate.length) {
      _isSubmit = true;
      for (let i: number = 0; _strMasCate.length > i; i++) {
        let data: any = {};
        const cloumn: ICategoryListColumn = Config.CategoryListColumns;
        data[cloumn.Title] = _strMasCate[i];
        data[cloumn.Country] = cunID;
        data[cloumn.Year] = yearID;
        data[cloumn.CategoryType] = cateType;
        _preNewCate.push({ ...data });
      }
    } else {
      _isSubmit = false;
    }
    console.log([..._preNewCate]);
  };

  const _getBulkInsert = (): void => {
    SPServices.batchInsert({
      ListName: Config.ListNames.CategoryList,
      responseData: _preNewCate,
    })
      .then((res: any) => {
        _isSubmit = false;
        _strCountry = "All";
        _strCateType = "All";
        _numCate = [];
        setFilMasCateKey([]);
        setFilCountryDrop("All");
        setFilTypeDrop("All");
        _getOnChange();
        getCategoryRecords();
        alertify.success("Category config's done");
      })
      .catch((err: any) => {
        _getErrorFunction(err);
      });
  };

  const _getUnlink = (): void => {
    SPServices.SPUpdateItem({
      Listname: Config.ListNames.CategoryList,
      ID: _curItem.ID,
      RequestJSON: {
        isDeleted: true,
      },
    })
      .then((res: any) => {
        getCategoryRecords();
        setIsModal(false);
        alertify.success("Category config unlink success");
      })
      .catch((err: any) => {
        _getErrorFunction(err);
      });
  };

  /* Life cycle of onload */
  useEffect(() => {
    props.dropValue.Period.length && _getDefaultFunction();
  }, [props.dropValue]);

  useEffect(() => {
    let masterData: any = commonServices.paginateFunction(
      pagination.totalPageItems,
      pagination.pagenumber,
      items
    );

    setMaster(masterData.displayitems);
  }, [pagination, items]);

  return isLoader ? (
    <Loader />
  ) : (
    <div style={{ width: "100%" }}>
      {/* Heading section */}
      <Label className={styles.HeaderLable}>Category Configuration</Label>

      {/* Dropdown and btn section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
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
                _strCountry = text.text as string;
                _getOnChange();
                _filterCategoryArray();
              }}
            />
          </div>

          {/* Category type dropdown section */}
          <div style={{ width: "15%" }}>
            <Label>Category Type</Label>
            <Dropdown
              styles={DropdownStyle}
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
                _strCateType = text.text as string;
                _getOnChange();
                _filterCategoryArray();
              }}
            />
          </div>

          {/* Year dropdown section */}
          <div style={{ width: "8%" }}>
            <Label>Year</Label>
            <Dropdown
              styles={disabledDropdownStyles}
              disabled={true}
              options={[...propDropValue.Period]}
              selectedKey={
                propDropValue.Period.length &&
                propDropValue.Period[propDropValue.Period.length - 1].key
              }
            />
          </div>

          {/* Category dropdown section */}
          {_isCateMulti && (
            // <div style={{ width: "15%" }}>
            <div style={{ width: "40%" }}>
              <Label>Category</Label>
              <Autocomplete
                size="small"
                multiple
                disableCloseOnSelect
                options={cateOpt.length ? [...cateOpt] : [..._masterCateOption]}
                getOptionLabel={(option) => option.text}
                value={[...filMasCateKey]}
                defaultValue={[...filMasCateKey]}
                onChange={(e: any, text: any) => {
                  let _filMasCateKeys: IDrop[] = [];
                  _numCate = [];
                  if (text.length) {
                    text.forEach((e: any) => {
                      _filMasCateKeys.push(e);
                    });
                    if (text.length == _filMasCateKeys.length) {
                      _filMasCateKeys.forEach((data: IDrop, i: number) => {
                        _numCate.push(data.key);
                        i + 1 == _filMasCateKeys.length && _getOnChange();
                      });
                      setFilMasCateKey([..._filMasCateKeys]);
                    }
                  } else {
                    _getOnChange();
                    setFilMasCateKey([..._filMasCateKeys]);
                  }
                }}
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" placeholder="All" />
                )}
              />
            </div>
          )}

          {/* Over all refresh section */}
          <div style={{ display: "flex", alignItems: "end" }}>
            <div
              className={styles.refIcon}
              onClick={() => {
                _strCountry = "All";
                _strCateType = "All";
                _numCate = [];
                setFilMasCateKey([]);
                setFilCountryDrop("All");
                setFilTypeDrop("All");
                _getOnChange();
                _filterCategoryArray();
                setPagination({ ...pagination, pagenumber: 1 });
              }}
            >
              <Icon iconName="Refresh" style={{ color: "#ffff" }} />
            </div>
          </div>
        </div>

        {/* btn section */}
        <div style={{ display: "flex", alignItems: "end", width: "5%" }}>
          <button
            className={styles.btns}
            style={{
              cursor: _isSubmit ? "pointer" : "not-allowed",
            }}
            onClick={() => {
              if (_isSubmit) {
                setIsLoader(true);
                _getBulkInsert();
              }
            }}
          >
            Save
          </button>
        </div>
      </div>

      {/* Details list section */}
      <DetailsList
        items={[...master]}
        columns={[..._categoryListColumns]}
        styles={_DetailsListStyle}
        setKey="set"
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.none}
      />
      {!items.length && (
        <div className={styles.noRecords}>No data found !!!</div>
      )}
      {items.length ? (
        <Pagination
          currentPage={pagination.pagenumber}
          totalPages={Math.ceil(items.length / pagination.totalPageItems)}
          onChange={(page: number) =>
            setPagination({ ...pagination, pagenumber: page })
          }
        />
      ) : (
        ""
      )}

      {/* Modal section */}
      <Modal isOpen={isModal} isBlocking={false} styles={modalStyles}>
        <div>
          {/* Content section */}
          <Label
            style={{
              color: "red",
              fontSize: 16,
            }}
          >
            Do you want to unlink the category config?
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
                width: "16%",
                background: "#ffffff",
                border: "1px solid",
                borderRadius: "3px",
                cursor: "pointer",
                padding: "4px 0px",
              }}
              onClick={() => {
                _curItem = undefined;
                setIsModal(false);
              }}
            >
              No
            </button>
            <button
              style={{
                width: "16%",
                background: "#f6db55",
                border: "none",
                borderRadius: "3px",
                cursor: "pointer",
                padding: "4px 0px",
              }}
              onClick={() => {
                setIsLoader(true);
                _getUnlink();
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

export default CategoryConfig;
