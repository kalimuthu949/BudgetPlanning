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
  IVendorListColumn,
} from "../../../globalInterFace/BudgetInterFaces";
import { _getFilterDropValues } from "../../../CommonServices/DropFunction";
import SPServices from "../../../CommonServices/SPServices";
import Loader from "./Loader";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import styles from "./Vendor.module.scss";
import { config } from "exceljs";

let TypeFlag = "";
let ConfimMsg = false;

const Vendor = () => {
  let admin = true;
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
  const textFieldStyle: Partial<ITextFieldStyles> = {
    fieldGroup: {
      "::after": {
        border: "1px solid rgb(96, 94, 92)",
      },
    },
  };
  const column: IColumn[] = [
    {
      key: "1",
      name: "Supplier",
      fieldName: "Vendor",
      minWidth: 100,
      maxWidth: 200,
      onRender: (item) => {
        return admin && item.isEdit ? (
          <TextField
            value={addNewVendor.Vendor}
            styles={Validate.Vendor ? errtxtFieldStyle : textFieldStyle}
            onChange={(e, text) => {
              setAddNewVendor({ ...addNewVendor, Vendor: text });
            }}
          />
        ) : (
          <label>{item.Vendor}</label>
        );
      },
    },
    {
      key: "2",
      name: "Description",
      fieldName: "Description",
      minWidth: 100,
      maxWidth: 200,
      onRender: (item) => {
        return admin && item.isEdit ? (
          <TextField
            value={addNewVendor.Description}
            onChange={(e, text) => {
              setAddNewVendor({ ...addNewVendor, Description: text });
            }}
          />
        ) : (
          <label>{item.Description}</label>
        );
      },
    },
    {
      key: "3",
      name: "Pricing",
      fieldName: "Pricing",
      minWidth: 100,
      maxWidth: 200,
      onRender: (item) => {
        return admin && item.isEdit ? (
          <TextField
            value={addNewVendor.Pricing}
            onChange={(e, text) => {
              setAddNewVendor({ ...addNewVendor, Pricing: text });
            }}
          />
        ) : (
          <label>{item.Pricing}</label>
        );
      },
    },
    {
      key: "4",
      name: "PaymentTerms",
      fieldName: "PaymentTerms",
      minWidth: 100,
      maxWidth: 200,
      onRender: (item) => {
        return admin && item.isEdit ? (
          <TextField
            value={addNewVendor.PaymentTerms}
            onChange={(e, text) => {
              setAddNewVendor({ ...addNewVendor, PaymentTerms: text });
            }}
          />
        ) : (
          <label>{item.PaymentTerms}</label>
        );
      },
    },
    {
      key: "5",
      name: "LastYearCost",
      fieldName: "LastYearCost",
      minWidth: 100,
      maxWidth: 200,
      onRender: (item) => {
        return admin && item.isEdit ? (
          <TextField
            value={addNewVendor.LastYearCost}
            onChange={(e, text) => {
              setAddNewVendor({ ...addNewVendor, LastYearCost: text });
            }}
          />
        ) : (
          <label>{item.LastYearCost}</label>
        );
      },
    },
    // {
    //   key: "6",
    //   name: "StartingDate",
    //   fieldName: "StartingDate",
    //   minWidth: 100,
    //   maxWidth: 200,
    //   onRender: (item, index) => {
    //     return admin && item.isEdit ? (
    //       <TextField
    //         value={addNewVendor.StartingDate}
    //         onChange={(e, text) => {
    //           setAddNewVendor({ ...addNewVendor, StartingDate: text });
    //         }}
    //       />
    //     ) : (
    //       <label>{item.StartingDate}</label>
    //     );
    //   },
    // },
    {
      key: "7",
      name: "PO",
      fieldName: "PO",
      minWidth: 100,
      maxWidth: 200,
      onRender: (item, index) => {
        return admin && item.isDummy ? (
          <div
            onClick={() => {
              console.log("msg", ConfimMsg);

              if (!ConfimMsg) {
                ConfimMsg = !ConfimMsg;
                newVendorAdd(item, index);
                TypeFlag = "Add";
              } else {
                ConfirmPageChange(item, index, "Add");
              }
            }}
          >
            New Vendor Add
          </div>
        ) : admin && item.isEdit ? (
          <TextField
            value={addNewVendor.PO}
            onChange={(e, text) => {
              setAddNewVendor({ ...addNewVendor, PO: text });
            }}
          />
        ) : (
          <label>{item.PO}</label>
        );
      },
    },
    {
      key: "8",
      name: "Supplier",
      fieldName: "Supplier",
      minWidth: 100,
      maxWidth: 200,
      onRender: (item) => {
        return admin && item.isEdit ? (
          <TextField
            value={addNewVendor.Supplier}
            onChange={(e, text) => {
              setAddNewVendor({ ...addNewVendor, Supplier: text });
            }}
          />
        ) : (
          <label>{item.Supplier}</label>
        );
      },
    },
    {
      key: "9",
      name: "RequestedAmount",
      fieldName: "RequestedAmount",
      minWidth: 100,
      maxWidth: 200,
      onRender: (item) => {
        return admin && item.isEdit ? (
          <TextField
            value={addNewVendor.RequestedAmount}
            onChange={(e, text) => {
              setAddNewVendor({ ...addNewVendor, RequestedAmount: text });
            }}
          />
        ) : (
          <label>{item.RequestedAmount}</label>
        );
      },
    },
    // {
    //   key: "10",
    //   name: "EntryDate",
    //   fieldName: "EntryDate",
    //   minWidth: 100,
    //   maxWidth: 200,
    //   onRender: (item) => {
    //     return admin && item.isEdit ? (
    //       <TextField
    //         value={addNewVendor.EntryDate}
    //         onChange={(e, text) => {
    //           setAddNewVendor({ ...addNewVendor, EntryDate: text });
    //         }}
    //       />
    //     ) : (
    //       <label>{item.EntryDate}</label>
    //     );
    //   },
    // },
    // {
    //   key: "11",
    //   name: "ToDate",
    //   fieldName: "ToDate",
    //   minWidth: 100,
    //   maxWidth: 200,
    //   onRender: (item) => {
    //     return admin && item.isEdit ? (
    //       <TextField
    //         value={addNewVendor.ToDate}
    //         onChange={(e, text) => {
    //           setAddNewVendor({ ...addNewVendor, ToDate: text });
    //         }}
    //       />
    //     ) : (
    //       <label>{item.ToDate}</label>
    //     );
    //   },
    // },
    {
      key: "12",
      name: "Cost",
      fieldName: "Cost",
      minWidth: 100,
      maxWidth: 200,
      onRender: (item) => {
        return admin && item.isEdit ? (
          <TextField
            value={addNewVendor.Cost}
            onChange={(e, text) => {
              setAddNewVendor({ ...addNewVendor, Cost: text });
            }}
          />
        ) : (
          <label>{item.Cost}</label>
        );
      },
    },
    {
      key: "13",
      name: "PoCurrency",
      fieldName: "PoCurrency",
      minWidth: 100,
      maxWidth: 200,
      onRender: (item) => {
        return admin && item.isEdit ? (
          <TextField
            value={addNewVendor.PoCurrency}
            onChange={(e, text) => {
              setAddNewVendor({ ...addNewVendor, PoCurrency: text });
            }}
          />
        ) : (
          <label>{item.PoCurrency}</label>
        );
      },
    },
    {
      key: "14",
      name: "InvoiceNo",
      fieldName: "InvoiceNo",
      minWidth: 100,
      maxWidth: 200,
      onRender: (item) => {
        return admin && item.isEdit ? (
          <TextField
            value={addNewVendor.InvoiceNo}
            onChange={(e, text) => {
              setAddNewVendor({ ...addNewVendor, InvoiceNo: text });
            }}
          />
        ) : (
          <label>{item.InvoiceNo}</label>
        );
      },
    },
    {
      key: "15",
      name: "Action",
      fieldName: "Action",
      minWidth: 100,
      maxWidth: 200,
      onRender: (item, index) => {
        return admin ? (
          item.isEdit ? (
            <div>
              <Icon
                iconName="CheckMark"
                style={{
                  color: "green",
                  fontSize: "20px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (TypeFlag == "Add") {
                    // ConfimMsg = !ConfimMsg;
                    addVendor(item);
                  } else {
                    // ConfimMsg = !ConfimMsg;
                    vendorUpdate(item, index);
                  }
                }}
              />
              <Icon
                iconName="Cancel"
                style={{
                  color: "red",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (TypeFlag == "Add") {
                    ConfimMsg = !ConfimMsg;
                    addVendorCancel(item, index);
                  } else {
                    ConfimMsg = !ConfimMsg;
                    editVendorCancel(item, index);
                  }
                }}
              />
            </div>
          ) : (
            !item.isDummy && (
              <div>
                <Icon
                  iconName="Edit"
                  style={{
                    color: "blue",
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (!ConfimMsg) {
                      ConfimMsg = !ConfimMsg;
                      TypeFlag = "Edit";
                      editVendorItem(item, index);
                    } else {
                      ConfirmPageChange(item, index, "Edit");
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
                  onClick={() => {}}
                />
              </div>
            )
          )
        ) : (
          <div></div>
        );
      },
    },
  ];

  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [MData, setMData] = useState<IVendorListColumn[]>([]);
  const [addNewVendor, setAddNewVendor] = useState<IVendorListColumn>(null);
  const [Validate, setValidate] = useState({
    Vendor: false,
    Description: false,
    Pricing: false,
    PaymentTerms: false,
    LastYearCost: false,
    StartingDate: false,
    PO: false,
    Supplier: false,
    RequestedAmount: false,
    EntryDate: false,
    ToDate: false,
    Cost: false,
    PoCurrency: false,
    InvoiceNo: false,
  });
  console.log("val", Validate);

  const getErrorFunction = (error) => {
    alertify.error("Error Message");
    setIsLoader(false);
  };

  const getDefaultFunction = () => {
    setIsLoader(true);
    getVendorData();
  };

  const getVendorData = async () => {
    await SPServices.SPReadItems({
      Listname: Config.ListNames.DistributionList,
    })
      .then((resVendor) => {
        console.log("res", resVendor);
        let getVendorData: IVendorListColumn[] = [];
        if (resVendor.length) {
          resVendor.forEach((item) => {
            getVendorData.push({
              Vendor: item["Vendor"] ? item["Vendor"] : "",
              Description: item["Description"] ? item["Description"] : "",
              Pricing: item["Pricing"] ? item["Pricing"] : "",
              PaymentTerms: item["PaymentTerms"] ? item["PaymentTerms"] : "",
              LastYearCost: item["LastYearCost"] ? item["LastYearCost"] : "",
              StartingDate: item["StartingDate"] ? item["StartingDate"] : "",
              PO: item["PO"] ? item["PO"] : "",
              Supplier: item["Supplier"] ? item["Supplier"] : "",
              RequestedAmount: item["RequestedAmount"]
                ? item["RequestedAmount"]
                : "",
              EntryDate: item["EntryDate"] ? item["EntryDate"] : "",
              ToDate: item["ToDate"] ? item["ToDate"] : "",
              Cost: item["Cost"] ? item["Cost"] : "",
              PoCurrency: item["PoCurrency"] ? item["PoCurrency"] : "",
              InvoiceNo: item["InvoiceNo"] ? item["InvoiceNo"] : "",
              isDummy: false,
              isEdit: false,
            });
          });
          getVendorData.push({
            Vendor: "",
            Description: "",
            Pricing: "",
            PaymentTerms: "",
            LastYearCost: "",
            StartingDate: "",
            PO: "",
            Supplier: "",
            RequestedAmount: "",
            EntryDate: "",
            ToDate: "",
            Cost: "",
            PoCurrency: "",
            InvoiceNo: "",
            isDummy: true,
            isEdit: false,
          });
          setMData([...getVendorData]);
          setIsLoader(false);
        } else {
          setMData([
            ...MData,
            {
              Vendor: "",
              Description: "",
              Pricing: "",
              PaymentTerms: "",
              LastYearCost: "",
              StartingDate: "",
              PO: "",
              Supplier: "",
              RequestedAmount: "",
              EntryDate: "",
              ToDate: "",
              Cost: "",
              PoCurrency: "",
              InvoiceNo: "",
              isDummy: true,
              isEdit: false,
            },
          ]);
          setIsLoader(false);
        }
      })
      .catch((error) => getErrorFunction(error));
  };

  const newVendorAdd = (item, index) => {
    let items = [...MData];
    items[index].isDummy = false;
    items[index].isEdit = true;
    setMData([...items]);
    setAddNewVendor(item);
  };

  const addVendorCancel = (item, index) => {
    let AVendorCancel = [...MData];
    AVendorCancel[index].isDummy = true;
    AVendorCancel[index].isEdit = false;
    setMData([...AVendorCancel]);
    setAddNewVendor({
      Vendor: "",
      Description: "",
      Pricing: "",
      PaymentTerms: "",
      LastYearCost: "",
      StartingDate: "",
      PO: "",
      Supplier: "",
      RequestedAmount: "",
      EntryDate: "",
      ToDate: "",
      Cost: "",
      PoCurrency: "",
      InvoiceNo: "",
      isDummy: true,
      isEdit: false,
    });
  };

  const addVendor = (item) => {
    let NewJson = {
      Vendor: addNewVendor.Vendor,
      Description: addNewVendor.Description,
      Pricing: 100,
      PaymentTerms: addNewVendor.PaymentTerms,
      LastYearCost: addNewVendor.LastYearCost,
      StartingDate: new Date(),
      PO: addNewVendor.PO,
      Supplier: addNewVendor.Supplier,
      RequestedAmount: addNewVendor.RequestedAmount,
      EntryDate: new Date(),
      ToDate: new Date(),
      Cost: addNewVendor.Cost,
      PoCurrency: addNewVendor.PoCurrency,
      InvoiceNo: addNewVendor.InvoiceNo,
    };
    Validation();
    // SPServices.SPAddItem({
    //   Listname: Config.ListNames.DistributionList,
    //   RequestJSON: NewJson,
    // })
    //   .then((resAddItem) => {
    //     console.log("result", resAddItem);
    //   })
    //   .catch((error) => {
    //     getErrorFunction(error);
    // });
  };

  const editVendorItem = (items, index) => {
    let editItem = [...MData];
    editItem[index].isEdit = true;
    setAddNewVendor(items);
    setMData([...editItem]);
  };

  const editVendorCancel = (item, index) => {
    let EVendorCancel = [...MData];
    EVendorCancel[index].isEdit = false;
    setMData([...EVendorCancel]);
  };

  const vendorUpdate = (item, index) => {
    console.log("update");
  };

  const ConfirmPageChange = (item, index, type) => {
    if (confirm("page change")) {
      if (type == "Add") {
        TypeFlag = "Add";
        let EditChange = [];
        MData.forEach((EChange) => {
          EChange.isEdit = false;
          EditChange.push(EChange);
        });
        setMData([...EditChange]);
        newVendorAdd(item, index);
      } else {
        setAddNewVendor({
          Vendor: "",
          Description: "",
          Pricing: "",
          PaymentTerms: "",
          LastYearCost: "",
          StartingDate: "",
          PO: "",
          Supplier: "",
          RequestedAmount: "",
          EntryDate: "",
          ToDate: "",
          Cost: "",
          PoCurrency: "",
          InvoiceNo: "",
          isDummy: true,
          isEdit: false,
        });
        let AddChange = [...MData];
        AddChange[AddChange.length - 1].isDummy = true;
        AddChange[AddChange.length - 1].isEdit = false;
        AddChange.forEach((EChange) => {
          EChange.isEdit = false;
        });
        TypeFlag = "Edit";
        setMData([...AddChange]);
        editVendorItem(item, index);
      }
    }
  };

  const Validation = () => {
    console.log("adscs", addNewVendor.Vendor);
    let valueCheck = { ...Validate };
    if (addNewVendor.Vendor.trim() == "") {
      setValidate({ ...Validate, Vendor: true });
    } else if (addNewVendor.Description.trim() == "") {
      setValidate({ ...Validate, Vendor: false, Description: true });
    }
  };
  useEffect(() => {
    getDefaultFunction();
  }, []);

  return isLoader ? (
    <Loader />
  ) : (
    <div>
      <DetailsList
        columns={column}
        items={MData}
        selectionMode={SelectionMode.none}
      />
    </div>
  );
};

export default Vendor;
