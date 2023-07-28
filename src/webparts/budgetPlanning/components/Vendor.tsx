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
import { sp } from "@pnp/sp/presets/all";

let TypeFlag = "";
let ConfimMsg = true;

const Vendor = (props: any) => {
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
            placeholder="Enter The Vendor"
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
            placeholder="Enter The Description"
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
            placeholder="Enter The Pricing"
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
            placeholder="Enter The PaymentTerms"
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
            placeholder="Enter The LastYearCost"
            onChange={(e, text) => {
              setAddNewVendor({ ...addNewVendor, LastYearCost: text });
            }}
          />
        ) : (
          <label>{item.LastYearCost}</label>
        );
      },
    },
    {
      key: "6",
      name: "PO",
      fieldName: "PO",
      minWidth: 100,
      maxWidth: 200,
      onRender: (item, index) => {
        return admin && item.isDummy ? (
          <div
            onClick={() => {
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
            placeholder="Enter The PO"
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
      key: "7",
      name: "Supplier",
      fieldName: "Supplier",
      minWidth: 100,
      maxWidth: 200,
      onRender: (item) => {
        return admin && item.isEdit ? (
          <TextField
            value={addNewVendor.Supplier}
            placeholder="Enter The Supplier"
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
      key: "8",
      name: "Attachment",
      fieldName: "Attachment",
      minWidth: 100,
      maxWidth: 200,
      onRender: (item) => {
        return admin && item.isEdit ? (
          <div>
            <input
              id="AttachmentFile"
              type="file"
              style={{ display: "none" }}
              onChange={(e) =>
                setAddNewVendor({
                  ...addNewVendor,
                  Attachment: e.target.files[0],
                })
              }
            />
            <label htmlFor="AttachmentFile">AttachmentFile</label>
          </div>
        ) : (
          <label></label>
        );
      },
    },
    {
      key: "9",
      name: "Procurement",
      fieldName: "Procurement",
      minWidth: 100,
      maxWidth: 200,
      onRender: (item) => {
        return admin && item.isEdit ? (
          <div>
            <input
              id="ProcurementFile"
              type="file"
              style={{ display: "none" }}
              onChange={(e) =>
                setAddNewVendor({
                  ...addNewVendor,
                  Procurement: e.target.files[0],
                })
              }
            />
            <label htmlFor="ProcurementFile">ProcurementFile</label>
          </div>
        ) : (
          <label></label>
        );
      },
    },
    {
      key: "10",
      name: "RequestedAmount",
      fieldName: "RequestedAmount",
      minWidth: 100,
      maxWidth: 200,
      onRender: (item) => {
        return admin && item.isEdit ? (
          <TextField
            value={addNewVendor.RequestedAmount}
            placeholder="Enter The RequestedAmount"
            onChange={(e, text) => {
              setAddNewVendor({ ...addNewVendor, RequestedAmount: text });
            }}
          />
        ) : (
          <label>{item.RequestedAmount}</label>
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
                    addVendor(item);
                  } else {
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
  const [isTrigger, setIsTrigger] = useState(false);
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
        let getVendorData: IVendorListColumn[] = [];
        if (resVendor.length) {
          resVendor.forEach((item) => {
            getVendorData.push({
              VendorId: item["Id"] ? item["Id"] : null,
              Vendor: item["Vendor"] ? item["Vendor"] : "",
              Description: item["Description"] ? item["Description"] : "",
              Pricing: item["Pricing"] ? item["Pricing"] : "",
              PaymentTerms: item["PaymentTerms"] ? item["PaymentTerms"] : "",
              LastYearCost: item["LastYearCost"] ? item["LastYearCost"] : "",
              PO: item["PO"] ? item["PO"] : "",
              Supplier: item["Supplier"] ? item["Supplier"] : "",
              Attachment: "",
              Procurement: "",
              RequestedAmount: item["RequestedAmount"]
                ? item["RequestedAmount"]
                : "",
              BudgetId: item["BudgetId"] ? item["BudgetId"] : null,
              isDummy: false,
              isEdit: false,
            });
          });
          if (admin) {
            getVendorData.push({
              VendorId: null,
              Vendor: "",
              Description: "",
              Pricing: "",
              PaymentTerms: "",
              LastYearCost: "",
              PO: "",
              Supplier: "",
              Attachment: "",
              Procurement: "",
              RequestedAmount: "",
              BudgetId: null,
              isDummy: true,
              isEdit: false,
            });
          }
          setMData([...getVendorData]);
          setIsLoader(false);
        } else {
          setMData([
            ...MData,
            {
              VendorId: null,
              Vendor: "",
              Description: "",
              Pricing: "",
              PaymentTerms: "",
              LastYearCost: "",
              PO: "",
              Supplier: "",
              Attachment: "",
              Procurement: "",
              RequestedAmount: "",
              BudgetId: null,
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
      VendorId: null,
      Vendor: "",
      Description: "",
      Pricing: "",
      PaymentTerms: "",
      LastYearCost: "",
      PO: "",
      Supplier: "",
      Attachment: "",
      Procurement: "",
      RequestedAmount: "",
      BudgetId: null,
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
      PO: addNewVendor.PO,
      Supplier: addNewVendor.Supplier,
      RequestedAmount: addNewVendor.RequestedAmount,
    };
    Validation();
    SPServices.SPAddItem({
      Listname: Config.ListNames.DistributionList,
      RequestJSON: NewJson,
    })
      .then((resAddItem) => {
        createFolder(resAddItem.data.Id);
      })
      .catch((error) => {
        getErrorFunction(error);
      });
  };

  const createFolder = (itemId) => {
    sp.web.rootFolder.folders
      .getByName("DistributionLibrary")
      .folders.addUsingPath(itemId.toString(), true)
      .then((folder) => {
        TypeFlag = "";
        ConfimMsg = false;
        setIsTrigger(!isTrigger);
      })
      .catch((err) => {
        getErrorFunction(err);
      });
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
    let UpdateJson = {
      Vendor: addNewVendor.Vendor,
      Description: addNewVendor.Description,
      Pricing: 100,
      PaymentTerms: addNewVendor.PaymentTerms,
      LastYearCost: addNewVendor.LastYearCost,
      PO: addNewVendor.PO,
      Supplier: addNewVendor.Supplier,
      RequestedAmount: addNewVendor.RequestedAmount,
    };
    Validation();
    SPServices.SPUpdateItem({
      Listname: Config.ListNames.DistributionList,
      RequestJSON: UpdateJson,
      ID: item.VendorId,
    })
      .then((resUpdateItem) => {
        TypeFlag = "";
        ConfimMsg = false;
        setIsTrigger(!isTrigger);
      })
      .catch((error) => {
        getErrorFunction(error);
      });
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
          VendorId: null,
          Vendor: "",
          Description: "",
          Pricing: "",
          PaymentTerms: "",
          LastYearCost: "",
          PO: "",
          Supplier: "",
          Attachment: "",
          Procurement: "",
          RequestedAmount: "",
          BudgetId: null,
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
    let valueCheck = { ...Validate };
    if (addNewVendor.Vendor.trim() == "") {
      setValidate({ ...Validate, Vendor: true });
    } else if (addNewVendor.Description.trim() == "") {
      setValidate({ ...Validate, Vendor: false, Description: true });
    }
  };

  useEffect(() => {
    getDefaultFunction();
  }, [isTrigger]);

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
