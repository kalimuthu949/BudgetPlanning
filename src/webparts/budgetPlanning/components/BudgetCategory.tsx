import * as React from "react";
import { useState, useEffect } from "react";
import styles from "./BudgetCategory.module.scss";
import {
  Label,
  DetailsList,
  SelectionMode,
  IColumn,
  DetailsListLayoutMode,
  Modal,
  TextField,
  IDetailsListStyles,
  ITextFieldStyles,
  SearchBox,
  DefaultButton,
  IIconProps,
  IconButton,
  ISearchBoxStyles,
  IButtonStyles,
  IModalStyles,
} from "@fluentui/react";
import { Config } from "../../../globals/Config";
import Loader from "./Loader";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import SPServices from "../../../CommonServices/SPServices";
import {
  IDropdowns,
  IMasCategoryListColumn,
} from "../../../globalInterFace/BudgetInterFaces";
import * as Excel from "exceljs/dist/exceljs.min.js";
import * as FileSaver from "file-saver";
import * as moment from "moment";
import { _getFilterDropValues } from "../../../CommonServices/DropFunction";
import commonServices from "../../../CommonServices/CommonServices";
import Pagination from "office-ui-fabric-react-pagination";

interface IimportExcelDataView {
  removeExcelData: IMasCategoryListColumn[];
  addExcelData: IMasCategoryListColumn[];
}

interface IPagination {
  totalPageItems: number;
  pagenumber: number;
}

let propDropValue: IDropdowns;
let _isBack: boolean = false;
let listItems: IMasCategoryListColumn[] = [];
const addIcon: IIconProps = { iconName: "Add" };

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
  const [error, setError] = useState({
    importcatgryerror: "",
    newcatgryError: "",
  });
  const [MData, setMData] = useState<IMasCategoryListColumn[]>([]);
  const [master, setMaster] = useState<IMasCategoryListColumn[]>([]);
  const [items, setItems] = useState<IMasCategoryListColumn[]>([]);
  const [categoryPopup, setcategoryPopup] = useState<boolean>(false);
  const [importFilePopup, setImportFilePopup] = useState<boolean>(false);
  const [istrigger, setIstrigger] = useState(false);
  const [importExcelDataView, setImportExcelDataView] =
    useState<IimportExcelDataView>({
      removeExcelData: [],
      addExcelData: [],
    });
  const [pagination, setPagination] = useState<IPagination>({
    totalPageItems: 10,
    pagenumber: 1,
  });
  const [newCategoryData, setNewCategoryData] = useState<
    IMasCategoryListColumn[]
  >([
    {
      Title: "",
    },
  ]);

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

  const searchStyle: Partial<ISearchBoxStyles> = {
    root: {
      width: 240,
      "::after": {
        border: "1px solid rgb(96, 94, 92) !important",
      },
    },
  };

  const btnStyle: Partial<IButtonStyles> = {
    root: {
      border: "none",
      background: "#f6db55 !important",
      height: 28,
      borderRadius: 5,
    },
    label: {
      fontWeight: 500,
      color: "#000",
      cursor: "pointer",
    },
    icon: {
      fontSize: 14,
      color: "#000",
    },
  };

  const NewmodalStyle: Partial<IModalStyles> = {
    main: {
      padding: "10px 20px",
      borderRadius: 4,
      width: "23%",
      height: "auto !important",
      minHeight: "none",
    },
  };

  const inputStyle: Partial<ITextFieldStyles> = {
    root: {
      width: "75%",
      marginRight: 6,
    },
    fieldGroup: {
      "::after": {
        border: "1px solid rgb(96, 94, 92) !important",
      },
    },
  };

  const iconStyle: Partial<IButtonStyles> = {
    rootHovered: {
      background: "transparent !important",
    },
  };

  const saveBtnStyle: Partial<IButtonStyles> = {
    root: {
      border: "none",
      background: "#f6db55 !important",
      borderRadius: 5,
      marginRight: 10,
      width: "30%",
    },
    // rootHovered:{
    //   background:""
    // }
  };

  const cancelBtnStyle: Partial<IButtonStyles> = {
    root: {
      border: "1px solid",
      background: "transparent !important",
      borderRadius: 5,
      marginRight: 10,
      width: "30%",
    },
    // rootHovered:{
    //   background:""
    // }
  };

  const importModalStyle: Partial<IModalStyles> = {
    main: {
      padding: "15px 25px",
      borderRadius: 4,
      width: "22%",
      height: "auto !important",
      minHeight: "none",
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
    let file: any = e;
    let fileType: string = file.name.split(".");
    if (fileType[1].toLowerCase() == "xlsx") {
      const workbook: any = new Excel.Workbook();
      await workbook.xlsx.load(file);
      const worksheet: any = workbook.worksheets[0];
      const rows: any = worksheet.getSheetValues();
      let _removeEmptyDatas: any[] = rows.slice(1);
      const filteredData = _removeEmptyDatas.filter((row) =>
        row.some((cell) => cell !== null && cell !== "")
      );
      listItems = [];
      listItems = filteredData.map((row: any) => ({
        Title: row[1] ? row[1] : "",
      }));
      if (
        worksheet.name.toLowerCase() == "my sheet" &&
        listItems[0].Title.toLowerCase() == "categorys"
      ) {
        listItems.shift();
        setImportFilePopup(true);
        setIsLoader(true);
        validationImportCategoryData([...listItems]);
      } else {
        alertify.error("Please import correct excel format");
      }
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
      Orderbydecorasc: false,
    })
      .then((_resMasCate: any) => {
        let _masCategory: IMasCategoryListColumn[] = [];
        if (_resMasCate.length) {
          _resMasCate.forEach((data: any) => {
            _masCategory.push({
              Title: data.Title ? data.Title : "",
            });
          });
          setMData([..._resMasCate]);
          setMaster([..._resMasCate]);
          setIsLoader(false);
        } else {
          setMData([..._resMasCate]);
          setMaster([..._resMasCate]);
          setIsLoader(false);
        }
      })
      .catch((err: any) => {
        _getErrorFunction(err);
      });
  };

  const validationImportCategoryData = (
    listItems: IMasCategoryListColumn[]
  ) => {
    let newaddData = [];
    let DuplicateData = [];
    let dummyData = [];
    for (let i = 0; i < listItems.length; i++) {
      let flag = false;
      for (let j = i + 1; j < listItems.length; j++) {
        if (listItems[i].Title.trim() == listItems[j].Title.trim()) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        dummyData.push(listItems[i]);
      }
    }
    console.log("dummy", dummyData);

    for (let i = 0; i < dummyData.length; i++) {
      let flag = false;
      for (let j = 0; j < MData.length; j++) {
        if (dummyData[i].Title.trim() == MData[j].Title.trim()) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        newaddData.push(dummyData[i]);
      }
    }
    console.log("new add", newaddData);

    if (newaddData.length > 0) {
      for (let k = 0; k < dummyData.length; k++) {
        let flags = false;
        for (let z = 0; z < newaddData.length; z++) {
          if (dummyData[k].Title.trim() == newaddData[z].Title.trim()) {
            flags = true;
            break;
          }
        }
        if (!flags) {
          DuplicateData.push(dummyData[k]);
        }
      }
    } else {
      DuplicateData = [...dummyData];
    }
    setImportExcelDataView({
      ...importExcelDataView,
      removeExcelData: [...DuplicateData],
      addExcelData: [...newaddData],
    });
    setIsLoader(false);
  };

  const validationNewCategoryData = (
    listItems: IMasCategoryListColumn[]
  ): IMasCategoryListColumn[] => {
    let newaddData = [];
    let duplicateData = [];
    for (let i = 0; i < listItems.length; i++) {
      let flag = false;
      for (let j = i + 1; j < listItems.length; j++) {
        if (listItems[i].Title.trim() == listItems[j].Title.trim()) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        duplicateData.push(listItems[i]);
      }
    }
    for (let i = 0; i < duplicateData.length; i++) {
      let flag = false;
      for (let j = 0; j < MData.length; j++) {
        if (duplicateData[i].Title.trim() == MData[j].Title.trim()) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        newaddData.push(duplicateData[i]);
      }
    }

    return newaddData;
  };

  const addMasterCategoryData = (
    listItems: IMasCategoryListColumn[],
    type: string
  ) => {
    let mascatgryData = [];
    let authentication = false;
    if (type == "ImportFiles") {
      mascatgryData = [...listItems];
      authentication = validation([...listItems], "ImportFiles");
    } else {
      mascatgryData = validationNewCategoryData(listItems);
      authentication = validation([...mascatgryData], "");
    }
    if (authentication) {
      if (mascatgryData.length > 0) {
        setIsLoader(true);
        SPServices.batchInsert({
          ListName: Config.ListNames.MasterCategoryList,
          responseData: mascatgryData,
        })
          .then((result) => {
            setImportExcelDataView({
              removeExcelData: [],
              addExcelData: [],
            });
            setNewCategoryData([{ Title: "" }]);
            setError({ ...error, importcatgryerror: "", newcatgryError: "" });
            setIstrigger(!istrigger);
          })
          .catch((err) => _getErrorFunction(err));
        // for (let i = 0; i < mascatgryData.length; i++) {
        //   SPServices.SPAddItem({
        //     Listname: Config.ListNames.MasterCategoryList,
        //     RequestJSON: mascatgryData[i],
        //   })
        //     .then((result) => {
        //       setImportExcelDataView({
        //         removeExcelData: [],
        //         addExcelData: [],
        //       });
        //       setNewCategoryData([{ Title: "" }]);
        //       setError({ ...error, importcatgryerror: "", newcatgryError: "" });
        //       setIstrigger(true);
        //     })
        //     .catch((err) => _getErrorFunction(err));
        // }
        setIsLoader(false);
        setcategoryPopup(false);
        setImportFilePopup(false);
      } else {
        setcategoryPopup(false);
        setNewCategoryData([{ Title: "" }]);
      }
    }
  };

  const deleteCategory = (index: number) => {
    let delcatgry = [...newCategoryData];
    delcatgry.splice(index, 1);
    setNewCategoryData(delcatgry);
    validation(delcatgry, "");
  };

  const addCategory = (index: number) => {
    let validate = validation(newCategoryData, "");
    if (validate) {
      setNewCategoryData([...newCategoryData, { Title: "" }]);
    }
  };

  const addCategoryData = (index: number, data: string) => {
    let addData = [...newCategoryData];
    addData[index].Title = data;
    setNewCategoryData([...addData]);
  };

  const validation = (arr: IMasCategoryListColumn[], type: string): boolean => {
    if (!arr.some((val) => val.Title.trim() == "")) {
      if (type == "ImportFiles") {
        setError({ ...error, importcatgryerror: "" });
      } else {
        setError({ ...error, newcatgryError: "" });
      }
      return true;
    } else {
      if (type == "ImportFiles") {
        setError({ ...error, importcatgryerror: "Please Fill the Box" });
      } else {
        setError({ ...error, newcatgryError: "Please Fill the Box" });
      }
      return false;
    }
  };

  const searchData = (data: string) => {
    let searchdata = [...MData].filter((value) => {
      return value.Title.toLowerCase().includes(data.trim());
    });
    setMaster([...searchdata]);
  };

  /* Life cycle of onload */
  useEffect(() => {
    let masterData = commonServices.paginateFunction(
      pagination.totalPageItems,
      pagination.pagenumber,
      master
    );
    setItems(masterData.displayitems);
  }, [pagination, master]);

  useEffect(() => {
    _getDefaultFunction();
  }, [istrigger]);

  return isLoader ? (
    <Loader />
  ) : (
    <div style={{ width: "100%" }}>
      {/* Heading section */}
      <Label className={styles.HeaderLable}>Budget Category</Label>

      {/* filter and btn section */}
      <div className={styles.btnContainer}>
        {/* search section */}
        <SearchBox
          styles={searchStyle}
          placeholder="Search"
          onChange={(val, text) => searchData(text)}
        />

        {/* btn sections */}
        <div className={styles.rightBtns}>
          {/* New btn section */}
          <DefaultButton
            text="New item"
            styles={btnStyle}
            iconProps={addIcon}
            onClick={() => setcategoryPopup(true)}
          />

          {/* import btn section */}
          <input
            id="fileUpload"
            type="file"
            style={{ display: "none" }}
            onChange={(e) => {
              _getFileImport(e.target.files[0]);
            }}
          />
          <label htmlFor="fileUpload" className={styles.uploadBtn}>
            Import
          </label>

          {/* export btn section */}
          <button className={styles.btns} onClick={() => _getGenerateExcel()}>
            Export
          </button>
        </div>
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
      {master.length > 0 && (
        <Pagination
          currentPage={pagination.pagenumber}
          totalPages={Math.ceil(master.length / pagination.totalPageItems)}
          onChange={(page) =>
            setPagination({ ...pagination, pagenumber: page })
          }
        />
      )}

      {/* new modal */}
      <Modal isOpen={categoryPopup} styles={NewmodalStyle}>
        <div className={styles.modalHeader}>
          <h3>New Categories</h3>
        </div>

        <div>
          {newCategoryData.map((val, index) => {
            return (
              <>
                <div key={index} className={styles.modalTextAndIconFlex}>
                  <TextField
                    styles={inputStyle}
                    type="text"
                    value={val.Title}
                    placeholder="Enter The Category"
                    onChange={(e, text) => addCategoryData(index, text)}
                  />

                  <div>
                    {newCategoryData.length > 1 &&
                    newCategoryData.length != index + 1 ? (
                      <IconButton
                        styles={iconStyle}
                        iconProps={{
                          iconName: "Delete",
                        }}
                        style={{ color: "red" }}
                        title="Delete"
                        ariaLabel="Delete"
                        onClick={() => deleteCategory(index)}
                      />
                    ) : (
                      <div>
                        {newCategoryData.length > 1 && (
                          <IconButton
                            styles={iconStyle}
                            iconProps={{
                              iconName: "Delete",
                            }}
                            style={{ color: "red" }}
                            title="Delete"
                            ariaLabel="Delete"
                            onClick={() => deleteCategory(index)}
                          />
                        )}
                        <IconButton
                          styles={iconStyle}
                          iconProps={{
                            iconName: "Add",
                          }}
                          style={{ color: "#000" }}
                          title="Add"
                          ariaLabel="Add"
                          onClick={() => addCategory(index)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </>
            );
          })}
        </div>
        <div className={styles.errMsg}>{error.newcatgryError}</div>
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <DefaultButton
            styles={saveBtnStyle}
            text={"Save"}
            onClick={() => addMasterCategoryData(newCategoryData, "")}
          />
          <DefaultButton
            styles={cancelBtnStyle}
            text={"Cancel"}
            onClick={() => {
              setcategoryPopup(false);
              setNewCategoryData([{ Title: "" }]);
              setError({ ...error, newcatgryError: "" });
            }}
          />
        </div>
      </Modal>

      {/* import modal */}
      <Modal isOpen={importFilePopup} styles={importModalStyle}>
        <div className={styles.importBoxView}>
          <div>
            <h4>New Category Datas</h4>
            <div className={styles.importDataView}>
              {importExcelDataView.addExcelData.map((value, index) => {
                return (
                  <div>
                    <div key={index}>
                      <label className={styles.boxViewLabel}>
                        {value.Title}
                      </label>
                    </div>
                  </div>
                );
              })}
              {importExcelDataView.addExcelData.length == 0 && (
                <div className={styles.nodatas}>
                  <label>No Records</label>
                </div>
              )}
            </div>
          </div>
          <div>
            <h4>Duplicate Category Datas</h4>
            <div className={styles.importDataView}>
              {importExcelDataView.removeExcelData.map((value, index) => {
                return (
                  <div>
                    <div key={index}>
                      <label className={styles.boxViewLabel}>
                        {value.Title}
                      </label>
                    </div>
                  </div>
                );
              })}
              {importExcelDataView.removeExcelData.length === 0 && (
                <div className={styles.nodatas}>
                  <label>No Records</label>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.errMsg}>{error.importcatgryerror}</div>
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <DefaultButton
            styles={saveBtnStyle}
            text="Save"
            style={{
              cursor: importExcelDataView.addExcelData.length
                ? "pointer"
                : "not-allowed",
            }}
            onClick={() => {
              if (importExcelDataView.addExcelData.length) {
                addMasterCategoryData(
                  importExcelDataView.addExcelData,
                  "ImportFiles"
                );
              }
            }}
          />
          <DefaultButton
            styles={cancelBtnStyle}
            text="Cancel"
            onClick={() => {
              setImportFilePopup(false);
              // gblImportExcel = {};
              setImportExcelDataView({
                removeExcelData: [],
                addExcelData: [],
              });
              setError({ ...error, importcatgryerror: "" });
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default BudgetCategory;
