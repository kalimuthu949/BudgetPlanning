import * as React from "react";
import { useState, useEffect } from "react";
import SPServices from "../../../CommonServices/SPServices";
import { Config } from "../../../globals/Config";
import Pagination from "office-ui-fabric-react-pagination";
import {
  ICurBudgetAnalysis,
  IDrop,
  IDropdowns,
  IEdit,
} from "../../../globalInterFace/BudgetInterFaces";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import styles from "./BudgetAnalysis.module.scss";
import * as Excel from "exceljs/dist/exceljs.min.js";
import * as FileSaver from "file-saver";
import * as moment from "moment";
import Loader from "./Loader";
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
  TextField,
  ITextFieldStyles,
  DefaultButton,
} from "@fluentui/react";
import { _getFilterDropValues } from "../../../CommonServices/DropFunction";
import { IButtonStyles } from "office-ui-fabric-react";

let _isCurYear: boolean = true;
let listItems = [];
let propDropValue: IDropdowns;

interface IPagination {
  perPage: number;
  currentPage: number;
}

const BudgetAnalysis = (props: any): JSX.Element => {
  propDropValue = { ...props.dropValue };
  let currentYear: string =
    propDropValue.Period[propDropValue.Period.length - 1].text;

  const budjetColums: IColumn[] = [
    {
      key: "column1",
      name: "Category",
      fieldName: "Category",
      minWidth: _isCurYear ? 200 : 300,
      maxWidth: 400,
    },
    {
      key: "column2",
      name: "Country",
      fieldName: "Country",
      minWidth: _isCurYear ? 200 : 300,
      maxWidth: 400,
    },
    {
      key: "column3",
      name: "Type",
      fieldName: "Type",
      minWidth: _isCurYear ? 200 : 300,
      maxWidth: 400,
    },
    {
      key: "column4",
      name: "Total",
      fieldName: "Total",
      minWidth: _isCurYear ? 200 : 300,
      maxWidth: 400,
      onRender: (item: ICurBudgetAnalysis, index: number) => {
        if (item.isEdit) {
          return (
            <TextField
              value={edit.data ? edit.data.toString() : ""}
              placeholder="Enter Here"
              styles={isValidation ? errtxtFieldStyle : textFieldStyle}
              onChange={(e: any, value: any) => {
                if (/^[0-9]+$|^$/.test(value)) {
                  setEdit({ ...edit, data: value });
                  setIsvalidation(false);
                }

                if (!value) {
                  setIsvalidation(true);
                }
              }}
            />
          );
        } else {
          return item.Total;
        }
      },
    },
    {
      key: "column5",
      name: "Action",
      fieldName: "action",
      minWidth: 100,
      maxWidth: 300,
      onRender: (item: ICurBudgetAnalysis, index: number) => {
        if (!item.isEdit) {
          return (
            <Icon
              iconName="Edit"
              style={{
                color: "blue",
                fontSize: "16px",
                cursor: "pointer",
              }}
              onClick={() => {
                handelEdit(index, "Edit", item);
              }}
            />
          );
        } else {
          return (
            <div>
              <Icon
                iconName="CheckMark"
                style={{
                  color: "green",
                  fontSize: "20px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  handleEditUpdate(item, index);
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
                  handelEdit(index, "Close", item);
                }}
              />
            </div>
          );
        }
      },
    },
  ];

  const cols = [...budjetColums];
  cols.pop();

  // state creaction
  const [isLoader, setIsLoader] = useState<boolean>(true);
  const [madterData, setMasterData] = useState<ICurBudgetAnalysis[]>([]);
  const [budgetItems, setBudgetItems] = useState<ICurBudgetAnalysis[]>([]);
  const [viewBudgetItems, setViewBudgetItems] = useState<ICurBudgetAnalysis[]>(
    []
  );
  const [isValidation, setIsvalidation] = useState<boolean>(false);
  const [filCountryDrop, setFilCountryDrop] = useState<string>("All");
  const [filTypeDrop, setFilTypeDrop] = useState<string>("All");
  const [filCtgryDrop, setFilCtgryDrop] = useState<string>("All");
  const [ctgryDropOptions, setCtgryDropOptions] =
    useState<IDropdowns>(propDropValue);
  const [filPeriodDrop, setFilPeriodDrop] = useState<string>(
    propDropValue.Period[propDropValue.Period.length - 1].text
  );

  const [edit, setEdit] = useState<IEdit>({
    authendication: false,
    id: null,
    data: null,
  });
  const [pagination, setPagination] = useState<IPagination>({
    perPage: 5,
    currentPage: 1,
  });

  // style cteations
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
        // height: items.length ? "58vh" : 20,
        overflowY: "auto",
        overflowX: "hidden",
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
      ".ms-Dropdown-title": {
        borderWidth: "2px",
        height: "30px",
      },
    },
    root: {},
  };

  const DropdownStyle: Partial<IDropdownStyles> = {
    root: {
      dropdown: {
        ":focus::after": {
          border: "5px solid red",
        },
      },
      ".ms-Dropdown-container": {
        width: "100%",
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

  // functions creations
  const _getErrorFunction = (errMsg: any): void => {
    alertify.error(errMsg);
    setIsLoader(false);
  };

  const _getDefaultFunction = (): void => {
    getAllData(currentYear);
  };

  const getAllData = (year: string): void => {
    SPServices.SPReadItems({
      Listname: Config.ListNames.CategoryList,
      Select: "*, Year/ID, Year/Title, Country/ID, Country/Title",
      Expand: " Year, Country",
      Topcount: 5000,
      Filter: [
        {
          FilterKey: "isDeleted",
          FilterValue: "1",
          Operator: "ne",
        },
        {
          FilterKey: "Year/Title",
          FilterValue: year,
          Operator: "eq",
        },
        {
          FilterKey: "OverAllBudgetCost",
          FilterValue: "0",
          Operator: "ne",
        },
        {
          FilterKey: "OverAllBudgetCost",
          FilterValue: null,
          Operator: "ne",
        },
      ],
      Orderbydecorasc: false,
    })
      .then((data: any) => {
        let items: ICurBudgetAnalysis[] = [];

        if (data.length) {
          data.forEach((value: any) => {
            items.push({
              Category: value.Title ? value.Title : "",
              Country: value.Country.Title ? value.Country.Title : "",
              Year: value.Year.Title ? value.Year.Title : "",
              Type: value.CategoryType ? value.CategoryType : "",
              ID: value.ID ? value.ID : null,
              Total: value.OverAllBudgetCost ? value.OverAllBudgetCost : null,
              isEdit: false,
              Area: "",
            });
          });          
          setMasterData(items);
          setBudgetItems(items);
          getDropdownValues(items);
        } else {
          getDropdownValues(items);
          setMasterData(items);
          setBudgetItems(items);
        }
      })
      .catch((error: any) => _getErrorFunction("get budgjet data"));
  };

  const getDropdownValues = (items: ICurBudgetAnalysis[]) => {
    let allCategory: string[] = [...items].map((value) => value.Category);
    let categories: string[] = [...allCategory].filter(
      (value, index) => index === allCategory.indexOf(value)
    );
    let ctgryOptions: IDrop[] = [{ key: 0, text: "All" }];

    categories.length &&
      categories.forEach((value, index) => {
        ctgryOptions.push({ key: index + 1, text: value });
      });

    ctgryDropOptions.ctgryDropOptions = [...ctgryOptions];

    setPaginationData(items);
    setCtgryDropOptions({ ...ctgryDropOptions });
  };

  const setPaginationData = async (items: ICurBudgetAnalysis[]) => {
    let startIndex = (pagination.currentPage - 1) * pagination.perPage;
    let endIndex = startIndex + pagination.perPage;
    let bdgItems = [...items].slice(startIndex, endIndex);

    setViewBudgetItems([...bdgItems]);
    setIsLoader(false);
  };

  const handelEdit = (
    index: number,
    type: string,
    item: ICurBudgetAnalysis
  ) => {
    let value: boolean = type === "Edit" ? true : false;
    let items: ICurBudgetAnalysis[] = [...viewBudgetItems];

    items[index].isEdit = value;

    if (type === "Edit") {
      setEdit({
        authendication: true,
        data: item.Total,
        id: item.ID,
      });
    } else {
      setEdit({ ...edit, authendication: false });
    }

    setViewBudgetItems(items);
  };

  const handleEditUpdate = (item: ICurBudgetAnalysis, index: number) => {
    if (edit.data) {
      let items: ICurBudgetAnalysis[] = [...viewBudgetItems];
      items[index].isEdit = false;
      items[index].Total = Number(edit.data);

      setViewBudgetItems(items);
      let json = { OverAllBudgetCost: edit.data };

      SPServices.SPUpdateItem({
        Listname: Config.ListNames.CategoryList,
        ID: edit.id,
        RequestJSON: json,
      })
        .then((data) => console.log("data added succesfully"))
        .catch((error) => console.log("err"));
    }
  };

  const handleFilter = (type: string, country: string, category: string) => {
    let filteredItems: ICurBudgetAnalysis[] = [...madterData].filter(
      (value) => {
        if (type !== "All" && country !== "All" && category !== "All") {
          return (
            value.Type === type &&
            value.Country === country &&
            value.Category === category
          );
        } else if (type !== "All" && country !== "All") {
          return value.Type === type && value.Country === country;
        } else if (country !== "All" && category !== "All") {
          return value.Country === country && value.Category === category;
        } else if (type !== "All" && category !== "All") {
          return value.Type === type && value.Category === category;
        } else if (type !== "All") {
          return value.Type === type;
        } else if (country !== "All") {
          return value.Country === country;
        } else if (category !== "All") {
          return value.Category === category;
        } else {
          return true;
        }
      }
    );

    setBudgetItems(filteredItems);
    setPaginationData(filteredItems);
  };

  const generateExcel = (items: ICurBudgetAnalysis[]) => {
    let _arrExport: ICurBudgetAnalysis[] = [...items];
    const workbook: any = new Excel.Workbook();
    const worksheet: any = workbook.addWorksheet("My Sheet");

    worksheet.columns = [
      { header: "ID", key: "ID", width: 15 },
      { header: "Year", key: "Year", width: 25 },
      { header: "Category", key: "Category", width: 25 },
      { header: "Country", key: "Country", width: 25 },
      { header: "Type", key: "Type", width: 25 },
      { header: "Total", key: "Total", width: 25 },
    ];

    _arrExport.forEach((item: ICurBudgetAnalysis) => {
      worksheet.addRow({
        ID: item.ID,
        Year: item.Year,
        Category: item.Category,
        Country: item.Country,
        Type: item.Type,
        Total: item.Total,
      });
    });

    worksheet.autoFilter = {
      from: "A1",
      to: "F1",
    };

    const headerRows: string[] = ["A1", "B1", "C1", "D1", "E1", "F1"];
    headerRows.map((key: any) => {
      worksheet.getCell(key).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "4194c5" },
        bold: true,
      };
    });

    headerRows.map((key: any) => {
      worksheet.getCell(key).font = {
        bold: true,
        color: { argb: "FFFFFF" },
      };
    });

    headerRows.map((key: any) => {
      worksheet.getCell(key).alignment = {
        vertical: "middle	",
        horizontal: "center",
      };
    });

    workbook.xlsx
      .writeBuffer()
      .then((buffer: any) =>
        FileSaver.saveAs(
          new Blob([buffer]),
          `Category-${moment().format("MM_DD_YYYY")}.xlsx`
        )
      )
      .catch((err: any) => {
        console.log("Error writing excel export", err);
        _getErrorFunction("Error writing excel export");
      });
  };

  const getFileImport = async (e: any) => {
    let file: any = e;
    let fileType: string = file.name.split(".");
    if (fileType[1].toLowerCase() == "xlsx") {
      const workbook: any = new Excel.Workbook();
      await workbook.xlsx.load(file);
      const worksheet: any = workbook.worksheets[0];
      const rows: any = worksheet.getSheetValues();
      let _removeEmptyDatas: any[] = rows.slice(1);
      const filteredData = _removeEmptyDatas.filter((row) => {
        return row.some((cell) => cell !== null && cell !== "");
      });
      listItems = [];
      listItems = filteredData.map((row: any) => ({
        ID: row[1] ? row[1] : null,
        OverAllBudgetCost: row[6] ? row[6] : null,
      }));
      //Reset the file
      document.getElementById("fileUpload")["value"] = "";
      if (
        worksheet.name.toLowerCase() == "my sheet" &&
        listItems[0].ID.toLowerCase() == "id" &&
        listItems[0].OverAllBudgetCost.toLowerCase() == "total"
      ) {
        setIsLoader(true);
        listItems.shift();
        console.log("listItems", listItems);

        getUpdateImportDatas(listItems);
      } else {
        alertify.error("Please import correct excel format");
      }
    } else {
      alertify.error("Please import only xlsx file");
    }
  };

  const getUpdateImportDatas = (datas: any[]): void => {
    SPServices.batchUpdate({
      ListName: Config.ListNames.CategoryList,
      responseData: [...datas],
    })
      .then((res: any) => {
        getAllData(filPeriodDrop);
      })
      .catch((err: any) => {
        _getErrorFunction("Error message");
      });
  };

  // useEffect
  useEffect(() => {
    _getDefaultFunction();
  }, []);

  useEffect(() => {
    setPaginationData(budgetItems);
  }, [pagination]);

  // html binding
  return (
    <>
      {isLoader ? (
        <Loader />
      ) : ctgryDropOptions.ctgryDropOptions.length ? (
        <div>
          {/* Heading section */}
          <Label className={styles.HeaderLable}>Budget Analysis</Label>

          <div className={styles.Header}>
            <div className={styles.HeaderFilters}>
              <div className={styles.dropdowns}>
                <Dropdown
                  styles={DropdownStyle}
                  label="Period"
                  options={[...propDropValue.Period]}
                  selectedKey={_getFilterDropValues(
                    "Period",
                    { ...propDropValue },
                    filPeriodDrop
                  )}
                  onChange={(e: any, text: IDrop) => {
                    _isCurYear = text.text == currentYear ? true : false;
                    setFilPeriodDrop(text.text as string);
                    getAllData(text.text);
                    setIsLoader(true);
                    setFilCountryDrop("All");
                    setFilCtgryDrop("All");
                    setFilTypeDrop("All");
                  }}
                />
              </div>
              <div className={styles.dropdowns}>
                <Dropdown
                  styles={DropdownStyle}
                  label="Country"
                  options={[...propDropValue.Country]}
                  selectedKey={_getFilterDropValues(
                    "Country",
                    { ...propDropValue },
                    filCountryDrop
                  )}
                  onChange={(e: any, text: IDrop) => {
                    _isCurYear = filPeriodDrop == currentYear ? true : false;
                    setFilCountryDrop(text.text as string);
                    handleFilter(filTypeDrop, text.text, filCtgryDrop);
                  }}
                />
              </div>
              <div className={styles.dropdowns}>
                <Dropdown
                  styles={DropdownStyle}
                  label="Category"
                  options={ctgryDropOptions.ctgryDropOptions}
                  selectedKey={_getFilterDropValues(
                    "Category",
                    { ...ctgryDropOptions },
                    filCtgryDrop
                  )}
                  onChange={(e: any, text: IDrop) => {
                    _isCurYear = filPeriodDrop == currentYear ? true : false;
                    setFilCtgryDrop(text.text as string);
                    handleFilter(filTypeDrop, filCountryDrop, text.text);
                  }}
                />
              </div>
              <div className={styles.dropdowns}>
                <Dropdown
                  styles={DropdownStyle}
                  label="Type"
                  options={[...propDropValue.Type]}
                  selectedKey={_getFilterDropValues(
                    "Type",
                    { ...propDropValue },
                    filTypeDrop
                  )}
                  onChange={(e: any, text: IDrop) => {
                    _isCurYear = filPeriodDrop == currentYear ? true : false;
                    setFilTypeDrop(text.text as string);
                    handleFilter(text.text, filCountryDrop, filCtgryDrop);
                  }}
                />
              </div>
              <div className={styles.icon}>
                <Icon
                  iconName="Refresh"
                  className={styles.refresh}
                  onClick={() => {
                    _isCurYear = true;
                    getAllData(currentYear);
                    setIsLoader(true);
                    setFilPeriodDrop(currentYear);
                    setFilCountryDrop("All");
                    setFilCtgryDrop("All");
                    setFilTypeDrop("All");
                  }}
                />
              </div>
            </div>

            {/* import btn section */}
            <div className={styles.importExport}>
              {_isCurYear && (
                <div className={styles.import}>
                  <input
                    id="fileUpload"
                    type="file"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      getFileImport(e.target.files[0]);
                    }}
                  />
                  <label htmlFor="fileUpload" className={styles.uploadBtn}>
                    Import
                  </label>
                </div>
              )}

              <DefaultButton
                styles={buttonStyles}
                className={styles.export}
                text="Export"
                onClick={() => generateExcel(budgetItems)}
              />
            </div>
          </div>

          {/* Details List section */}
          <DetailsList
            columns={_isCurYear ? budjetColums : cols}
            items={viewBudgetItems}
            styles={_DetailsListStyle}
            setKey="set"
            layoutMode={DetailsListLayoutMode.justified}
            selectionMode={SelectionMode.none}
          />
          {viewBudgetItems.length ? (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={Math.ceil(budgetItems.length / pagination.perPage)}
              onChange={(page: number) =>
                setPagination({ ...pagination, currentPage: page })
              }
            />
          ) : (
            <div className={""}>
              <label>No data found !!!</label>
            </div>
          )}
        </div>
      ) : null}
    </>
  );
};

export default BudgetAnalysis;
