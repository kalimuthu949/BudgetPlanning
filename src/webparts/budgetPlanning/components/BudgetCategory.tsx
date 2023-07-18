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
  SearchBox,
  DefaultButton,
  IIconProps,
  IContextualMenuProps,
  IconButton,
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
  IPaginationObj,
} from "../../../globalInterFace/BudgetInterFaces";
import * as Excel from "exceljs/dist/exceljs.min.js";
import * as FileSaver from "file-saver";
import * as moment from "moment";
import { _getFilterDropValues } from "../../../CommonServices/DropFunction";
import commonServices from "../../../CommonServices/CommonServices";
import Pagination from "office-ui-fabric-react-pagination";
import { Flag20Filled } from "@fluentui/react-icons";

let propDropValue: IDropdowns;
let _isBack: boolean = false;
let listItems: IMasCategoryListColumn[] = [];
const addIcon: IIconProps = { iconName: "Add" };
let gblImportExcel = {};
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
  const [error, setError] = useState("");
  const [MData, setMData] = useState<IMasCategoryListColumn[]>([]);
  const [master, setMaster] = useState<IMasCategoryListColumn[]>([]);
  const [items, setItems] = useState<IMasCategoryListColumn[]>([]);
  const [categoryPopup, setcategoryPopup] = useState<boolean>(false);
  const [importFilePopup, setImportFilePopup] = useState<boolean>(false);
  const [importExcelDataView, setImportExcelDataView] = useState({
    removeExcelData: [],
    addExcelData: [],
  });
  const [pagination, setPagination] = useState({
    totalPageItems: 10,
    pagenumber: 1,
  });
  const [newCategoryData, setNewCategoryData] = useState([
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
    // let file: any = e.target.files[0];
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
      // addMasterCategoryData([...listItems]);
      // console.log([...listItems]);
      validationImportCategoryData([...listItems]);
    } else {
      alertify.error("Please import only xlsx file");
    }
  };
  const _getDefaultFunction = (): void => {
    _isBack = false;
    setIsLoader(true);
    _getMasterCategoryData();
  };
  const validationImportCategoryData = (listItems) => {
    let newaddData = [];
    let dummyData = [];

    for (let i = 0; i < listItems.length; i++) {
      let flag = false;
      for (let j = 0; j < MData.length; j++) {
        if (listItems[i].Title == MData[j].Title) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        newaddData.push(listItems[i]);
      }
    }
    if (newaddData.length > 0) {
      for (let k = 0; k < listItems.length; k++) {
        let flags = false;
        for (let z = 0; z < newaddData.length; z++) {
          if (listItems[k].Title == newaddData[z].Title) {
            flags = true;
            break;
          }
        }
        if (!flags) {
          dummyData.push(listItems[k]);
        }
      }
    } else {
      dummyData = [...listItems];
    }
    setImportExcelDataView({
      ...importExcelDataView,
      removeExcelData: [...dummyData],
      addExcelData: [...newaddData],
    });
  };
  const validationCategoryData = (listItems) => {
    let newaddData = [];

    for (let i = 0; i < listItems.length; i++) {
      let flag = false;
      for (let j = 0; j < MData.length; j++) {
        if (listItems[i].Title == MData[j].Title) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        newaddData.push(listItems[i]);
      }
    }

    return newaddData;
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
  const addMasterCategoryData = (listItems, type) => {
    let mascatgryData;
    if (type == "ImportFiles") {
      mascatgryData = validationCategoryData(listItems);
    } else {
      mascatgryData = [...listItems];
    }
    if (!mascatgryData.some((val) => val.Title == "")) {
      if (mascatgryData.length > 0) {
        setMaster([...master, ...mascatgryData]);
        setIsLoader(true);
        for (let i = 0; i < mascatgryData.length; i++) {
          SPServices.SPAddItem({
            Listname: Config.ListNames.MasterCategoryList,
            RequestJSON: mascatgryData[i],
          })
            .then((result) => {})
            .catch((err) => _getErrorFunction(err));
        }
        setIsLoader(false);
        setcategoryPopup(false);
        setImportFilePopup(false);
      } else {
        setcategoryPopup(false);
        setImportFilePopup(false);
      }
    } else {
      setError("Please fill the box");
    }
  };
  const deleteCategory = (index) => {
    let delcatgry = [...newCategoryData];
    delcatgry.splice(index, 1);
    setNewCategoryData(delcatgry);
  };
  const addCategory = (index) => {
    if (!newCategoryData.some((val) => val.Title == "")) {
      setNewCategoryData([...newCategoryData, { Title: "" }]);
    } else {
      setError("please fill the Box");
    }
  };
  const addCategoryData = (index, data) => {
    let addData = [...newCategoryData];
    addData[index].Title = data;
    setNewCategoryData([...addData]);
  };
  const deleteImportExcelData = (index) => {
    let delImpExcelData = [...importExcelDataView.addExcelData];
    delImpExcelData.splice(index, 1);
    setImportExcelDataView({
      ...importExcelDataView,
      addExcelData: delImpExcelData,
    });
  };
  const addImportExcelData = (index) => {
    if (!importExcelDataView.addExcelData.some((val) => val.Title == "")) {
      let tempAddExcelData = importExcelDataView.addExcelData;
      tempAddExcelData.push({
        Title: "",
      });
      setImportExcelDataView({
        addExcelData: [...tempAddExcelData],
        removeExcelData: importExcelDataView.removeExcelData,
      });
    } else {
      setError("please fill the Box");
    }
  };
  const searchData = (data) => {
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
  }, []);

  return isLoader ? (
    <Loader />
  ) : (
    <div style={{ width: "100%" }}>
      {/* Heading section */}
      <Label className={styles.HeaderLable}>Budget Category</Label>

      {/* btn section */}
      <SearchBox
        placeholder="Search"
        onChange={(val, text) => searchData(text)}
      />
      <div
        style={{
          gap: "2%",
          display: "flex",
          justifyContent: "end",
        }}
      >
        <DefaultButton
          text="New item"
          iconProps={addIcon}
          onClick={() => setcategoryPopup(true)}
        />
        <Modal isOpen={categoryPopup}>
          <div>
            <h3>Categories</h3>
            <IconButton
              iconProps={{
                iconName: "Cancel",
              }}
              title="Cancel"
              ariaLabel="Cancel"
              onClick={() => setcategoryPopup(false)}
            />
          </div>
          <div>
            {newCategoryData.map((val, index) => {
              return (
                <div key={index}>
                  <TextField
                    type="text"
                    value={val.Title}
                    onChange={(e, text) => addCategoryData(index, text)}
                  ></TextField>
                  {newCategoryData.length > 1 &&
                  newCategoryData.length != index + 1 ? (
                    <IconButton
                      iconProps={{
                        iconName: "Delete",
                      }}
                      title="Delete"
                      ariaLabel="Delete"
                      onClick={() => deleteCategory(index)}
                    />
                  ) : (
                    <div>
                      {newCategoryData.length > 1 && (
                        <IconButton
                          iconProps={{
                            iconName: "Delete",
                          }}
                          title="Delete"
                          ariaLabel="Delete"
                          onClick={() => deleteCategory(index)}
                        />
                      )}
                      <IconButton
                        iconProps={{
                          iconName: "Add",
                        }}
                        title="Add"
                        ariaLabel="Add"
                        onClick={() => addCategory(index)}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {error}
          <DefaultButton
            text={"Save"}
            onClick={() =>
              addMasterCategoryData(newCategoryData, "ImportFiles")
            }
          />
        </Modal>
        <input
          id="fileUpload"
          type="file"
          onChange={(e) => {
            gblImportExcel = e.target.files[0];
          }}
        />
        <button
          className={styles.btns}
          onClick={() => {
            _getFileImport(gblImportExcel);
            setImportFilePopup(true);
            // setcategoryPopup(true);
          }}
        >
          Import
        </button>
        <Modal isOpen={importFilePopup}>
          <IconButton
            iconProps={{
              iconName: "Cancel",
            }}
            title="Cancel"
            ariaLabel="Cancel"
            onClick={() => setImportFilePopup(false)}
          />
          <div>
            <div>
              <div>
                <h4>New Datas</h4>
                {importExcelDataView.addExcelData.map((value, index) => {
                  return (
                    <div>
                      <div key={index}>
                        <TextField type="text" value={value.Title} />
                        {importExcelDataView.addExcelData.length > 1 &&
                        importExcelDataView.addExcelData.length != index + 1 ? (
                          <IconButton
                            iconProps={{
                              iconName: "Delete",
                            }}
                            title="Delete"
                            ariaLabel="Delete"
                            onClick={() => deleteImportExcelData(index)}
                          />
                        ) : (
                          <div>
                            <IconButton
                              iconProps={{
                                iconName: "Add",
                              }}
                              title="Add"
                              ariaLabel="Add"
                              onClick={(index) => addImportExcelData(index)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <div>
                <h4>Duplicate Datas</h4>
                {importExcelDataView.removeExcelData.map((value, index) => {
                  return (
                    <div>
                      <div key={index}>
                        <p>{value.Title}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {error}
          <div>
            <DefaultButton
              text="Save"
              onClick={() => {
                addMasterCategoryData(importExcelDataView.addExcelData, "");
              }}
            />
          </div>
        </Modal>
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
      {master.length > 0 && (
        <Pagination
          currentPage={pagination.pagenumber}
          totalPages={Math.ceil(master.length / pagination.totalPageItems)}
          onChange={(page) =>
            setPagination({ ...pagination, pagenumber: page })
          }
        />
      )}
    </div>
  );
};

export default BudgetCategory;
