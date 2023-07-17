import * as React from "react";
import { useState, useEffect } from "react";
import styles from "./BudgetCategory.module.scss";
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
  IDropdownStyles,
  IDetailsListStyles,
  ITextFieldStyles,
} from "@fluentui/react";
import { Config } from "../../../globals/Config";
import Loader from "./Loader";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import SPServices from "../../../CommonServices/SPServices";
import {
  IDrop,
  IDropdowns,
  IMasCategoryListColumn,
} from "../../../globalInterFace/BudgetInterFaces";
import * as Excel from "exceljs/dist/exceljs.min.js";
import * as FileSaver from "file-saver";
import * as moment from "moment";
import { _getFilterDropValues } from "../../../CommonServices/DropFunction";

let propDropValue: IDropdowns;
let _isBack: boolean = false;
let listItems: IMasCategoryListColumn[] = [];

const BudgetCategory = (props: any): JSX.Element => {
  /* Variable creation */
  propDropValue = { ...props.dropValue };

  const _budgetPlanColumns: IColumn[] = [
    {
      key: "column1",
      name: "Category",
      fieldName: Config.masCategoryListColumns.Title,
      minWidth: 200,
      maxWidth: 500,
    },
  ];

  /* State creation */
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [items, setItems] = useState<IMasCategoryListColumn[]>([]);

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
        justifyContent: "center",
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

  const _getGenerateExcel = (): void => {
    let _arrExport: IMasCategoryListColumn[] = [...items];
    const workbook: any = new Excel.Workbook();
    const worksheet: any = workbook.addWorksheet("My Sheet");

    worksheet.columns = [{ header: "Categorys", key: "Category", width: 100 }];

    _arrExport.forEach((item: IMasCategoryListColumn) => {
      worksheet.addRow({
        Category: item.Title,
      });
    });

    worksheet.autoFilter = {
      from: "A1",
      to: "A1",
    };

    const headerRows: string[] = ["A1"];

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

  const _getFileImport = async (e: any) => {
    let file: any = e.target.files[0];
    let fileType: string = file.name.split(".");
    if (fileType[1].toLowerCase() == "xlsx") {
      // setIsLoader(true);
      const workbook: any = new Excel.Workbook();
      await workbook.xlsx.load(file);
      const worksheet: any = workbook.worksheets[0];
      const rows: any = worksheet.getSheetValues();
      let _removeEmptyDatas: any[] = rows.slice(1);
      listItems = [];
      listItems = _removeEmptyDatas.map((row: any) => ({
        Title: row[1],
      }));
      console.log([...listItems]);
    } else {
      alertify.error("Please import only xlsx file");
    }
  };

  const _getDefaultFunction = (): void => {
    _isBack = false;
    setIsLoader(true);
    _getMasterCategoryData();
  };

  const _getMasterCategoryData = (): void => {
    SPServices.SPReadItems({
      Listname: Config.ListNames.MasterCategoryList,
      Topcount: 5000,
    })
      .then((_resMasCate: any) => {
        let _masCategory: IMasCategoryListColumn[] = [];
        if (_resMasCate.length) {
          _resMasCate.forEach((data: any) => {
            _masCategory.push({
              Title: data.Title ? data.Title : "",
            });
          });
          setItems([..._resMasCate]);
          setIsLoader(false);
        } else {
          setItems([..._resMasCate]);
          setIsLoader(false);
        }
      })
      .catch((err: any) => {
        _getErrorFunction(err);
      });
  };

  /* Life cycle of onload */
  useEffect(() => {
    _getDefaultFunction();
  }, []);

  return isLoader ? (
    <Loader />
  ) : (
    <div style={{ width: "100%" }}>
      {/* Heading section */}
      <Label className={styles.HeaderLable}>Budget Category</Label>

      {/* btn section */}
      <div
        style={{
          gap: "2%",
          display: "flex",
          justifyContent: "end",
        }}
      >
        <input id="fileUpload" type="file" onChange={_getFileImport} />
        <button className={styles.btns} onClick={() => _getGenerateExcel()}>
          Export
        </button>
      </div>

      {/* Details list section */}
      <DetailsList
        items={[...items]}
        columns={[..._budgetPlanColumns]}
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

export default BudgetCategory;
