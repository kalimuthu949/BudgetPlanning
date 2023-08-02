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
  Checkbox,
  IconButton,
  IButtonStyles,
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
  IVendorItems,
  IVendorValidation,
  IVendorDetail,
} from "../../../globalInterFace/BudgetInterFaces";
import { _getFilterDropValues } from "../../../CommonServices/DropFunction";
import SPServices from "../../../CommonServices/SPServices";
import Loader from "./Loader";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import styles from "./Vendor.module.scss";
import { config } from "exceljs";
import { sp } from "@pnp/sp/presets/all";
import { truncate } from "@microsoft/sp-lodash-subset";
import { DefaultButton } from "office-ui-fabric-react";

let TypeFlag = "";
let ConfimMsg = false;

const Vendor = (props: any) => {
  let admin = true;
  console.log('props',props);

  let dropdownValue = props.props.dropValue.Vendor;
  // console.log('dropdownValue',dropdownValue);

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
      ".ms-DetailsRow": {
        ":hover": {
          backgroundColor: "white",
          color: "balck",
        },
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

  const textFieldStyle: Partial<ITextFieldStyles> = {
    fieldGroup: {
      "::after": {
        border: "1px solid rgb(96, 94, 92)",
      },
    },
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

  const IconStyle: Partial<IButtonStyles> = {
    root: {
      marginRight: 10,
      color: "#000 !important",
      background: "transparent !important",
    },
    icon: {
      fontSize: 20,
      background: "transparent !important",
    },
  };

  const column: IColumn[] = [
    {
      key: "1",
      name: "Vendor",
      fieldName: "Vendor",
      minWidth: 100,
      maxWidth: 500,
      onRender: (item, index) => {
        return item.isEdit ? (
          <Dropdown
            styles={DropdownStyle}
            options={dropdownValue}
            // selectedKey={dropdownValue[0].key}
            selectedKey={_getFilterDropValues(
              "Vendor",
              { ...props.props.dropValue },
              vendorData.Vendor ? vendorData.Vendor : "All"
            )}
            onChange={(e: any, text: IDrop) => {
              handleDropdown(text, index);
            }}
          />
        ) : (
          <label>{!item.isDummy ? item.Vendor : ""}</label>
        );
      },
    },
    {
      key: "2",
      name: "Description",
      fieldName: "Description",
      minWidth: 100,
      maxWidth: 500,
      onRender: (item) => {
        return item.isEdit ? (
          <TextField
            value={vendorData.Description}
            //placeholder="Enter The Description"
            onChange={(e, text) => {
              setVendorData({ ...vendorData, Description: text.trimStart() });
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
      maxWidth: 500,
      onRender: (item) => {
        return item.isEdit ? (
          <TextField
            value={vendorData.Pricing.toString()}
            //placeholder="Enter The Pricing"
            onChange={(e, text) => {
              if (/^[0-9]+$|^$/.test(text)) {
                setVendorData({
                  ...vendorData,
                  Pricing: Number(text.trimStart()),
                });
              }
            }}
          />
        ) : (
          <label>{!item.isDummy && item.Pricing}</label>
        );
      },
    },
    {
      key: "4",
      name: "PaymentTerms",
      fieldName: "PaymentTerms",
      minWidth: 100,
      maxWidth: 500,
      onRender: (item) => {
        return item.isEdit ? (
          <TextField
            value={vendorData.PaymentTerms}
            //placeholder="Enter The PaymentTerms"
            onChange={(e, text) => {
              setVendorData({ ...vendorData, PaymentTerms: text.trimStart() });
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
      maxWidth: 500,
      onRender: (item) => {
        return item.isEdit ? (
          <TextField
            value={vendorData.LastYearCost}
            //placeholder="Enter The LastYearCost"
            onChange={(e, text) => {
              setVendorData({ ...vendorData, LastYearCost: text.trimStart() });
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
      maxWidth: 500,
      onRender: (item, index) => {
        return item.isDummy ? (
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
            style={{
              cursor: "pointer",
              fontWeight: "600",
              padding: "5px 10px",
              fontSize: "14px",
              background: "rgb(77, 84, 106)",
              display: "inline",
              color: "rgb(255, 255, 255)",
              borderRadius: "4px",
            }}
          >
            New Vendor Add
          </div>
        ) : item.isEdit ? (
          <TextField
            value={vendorData.PO}
            //placeholder="Enter The PO"
            onChange={(e, text) => {
              setVendorData({ ...vendorData, PO: text.trimStart() });
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
      maxWidth: 500,
      onRender: (item) => {
        return item.isEdit ? (
          <TextField
            value={vendorData.Supplier}
            //placeholder="Enter The Supplier"
            onChange={(e, text) => {
              setVendorData({ ...vendorData, Supplier: text.trimStart() });
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
      maxWidth: 500,
      onRender: (item) => {
        return item.isEdit ? (
          <div>
            <input
              id="AttachmentFile"
              type="file"
              style={{ display: "none" }}
              multiple
              onChange={(e) => handleInputValue(e.target.files, "Attachment")}
            />
            <label htmlFor="AttachmentFile">
              {vendorData.AttachmentURL.length
                ? vendorData.AttachmentURL[0].split("/").pop()
                : "AttachmentFile"}
            </label>
          </div>
        ) : !item.isDummy && item.AttachmentURL.length ? (
          <a href={item.AttachmentURL[0]}>
            <Icon
              iconName="OpenFile"
              style={{
                color: "green",
                fontSize: "20px",
                cursor: "pointer",
              }}
            />
          </a>
        ) : null;
      },
    },
    {
      key: "9",
      name: "Procurement",
      fieldName: "Procurement",
      minWidth: 100,
      maxWidth: 500,
      onRender: (item) => {
        return item.isEdit ? (
          <div>
            <input
              id="ProcurementFile"
              type="file"
              style={{ display: "none" }}
              multiple
              maxLength={1}
              onChange={(e) => {
                handleInputValue(e.target.files, "Procurment");
              }}
            />
            <label htmlFor="ProcurementFile">
              {vendorData.ProcurementURL.length
                ? vendorData.ProcurementURL[0].split("/").pop()
                : "ProcurementFile"}
            </label>
          </div>
        ) : !item.isDummy && item.ProcurementURL.length ? (
          <a href={item.ProcurementURL[0]}>
            <Icon
              iconName="OpenFile"
              style={{
                color: "green",
                fontSize: "20px",
                cursor: "pointer",
              }}
            />
          </a>
        ) : null;
      },
    },
    {
      key: "10",
      name: "RequestedAmount",
      fieldName: "RequestedAmount",
      minWidth: 100,
      maxWidth: 500,
      onRender: (item) => {
        return item.isEdit ? (
          <TextField
            value={vendorData.RequestedAmount}
            //placeholder="Enter The RequestedAmount"
            onChange={(e, text) => {
              setVendorData({
                ...vendorData,
                RequestedAmount: text.trimStart(),
              });
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
      maxWidth: 500,
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

  const [isTrigger, setIsTrigger] = useState<boolean>(false);
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [MData, setMData] = useState<IVendorItems[]>([]);
  const [isRenual,setIsRenual] = useState(true)
  const [vendorData, setVendorData] = useState<IVendorItems>({
    ...Config.Vendor,
  });
  const [Validate, setValidate] = useState<IVendorValidation>({
    ...Config.vendorValidation,
  });
  
  const getErrorFunction = (error: any) => {
    alertify.error(error);
    setIsLoader(false);
  };

  const getDefaultFunction = () => {
    setIsLoader(true);
    _getVendorsArr();
  };

  const _getVendorsArr = (): void => {
    SPServices.SPReadItems({
      Listname: Config.ListNames.DistributionList,
      Select: "*, Year/ID, Year/Title, Vendor/ID, Vendor/Title",
      Expand: "Year, Vendor",
      Filter: [
        {
          FilterKey: "isDeleted",
          Operator: "ne",
          FilterValue: "1",
        },
        {
          FilterKey: "Year/Title",
          Operator: "eq",
          FilterValue: "2023",
          // FilterValue: _preYear,
        },
      ],
      Topcount: 5000,
      Orderby: "Modified",
      Orderbydecorasc: false,
    })
      .then((res: any) => {
        let matches: any[] = [];
        let idVendors: number[] = [];
        let distinctMap = {};
        let _uniqueVendorName: string[] = [];
        let filLastVendor: any;
        let _uniqueVendor: IVendorDetail[] = [];

        res.length &&
          res.reduce((item: any, e1: any) => {
            matches = item.filter((e2: any) => {
              return e1.VendorId === e2.VendorId;
            });
            if (matches.length == 0) {
              idVendors.push(e1.VendorId);
            }
            return idVendors;
          }, []);

        for (let i: number = 0; i < idVendors.length; i++) {
          let value = idVendors[i].toString();
          distinctMap[value] = null;
        }
        _uniqueVendorName = Object.keys(distinctMap);

        if (_uniqueVendorName.length) {
          for (let i: number = 0; _uniqueVendorName.length > i; i++) {
            filLastVendor = res.filter((e: any) => {
              return e.VendorId === Number(_uniqueVendorName[i]);
            })[0];
            let data: any = {};
            const column: IVendorDetail = Config.VendorDetail;
            data[column.ID] = filLastVendor.ID;
            data[column.VendorId] = filLastVendor.VendorId;
            data[column.Vendor] = filLastVendor.Vendor.Title;
            data[column.LastYearCost] = filLastVendor.LastYearCost;
            data[column.PO] = filLastVendor.PO;
            data[column.Supplier] = filLastVendor.Supplier;
            _uniqueVendor.push({ ...data });
            if (_uniqueVendorName.length === i + 1) {
              // setVendorDetail([..._uniqueVendor]);
              getVendorData();
            }
          }
        } else {
          getVendorData();
        }
      })
      .catch((err: any) => {
        getErrorFunction(err);
      });
  };

  const getVendorData = (): void => {
    SPServices.SPReadItems({
      Listname: Config.ListNames.DistributionList,
      Select: "*, Vendor/ID, Vendor/Title",
      Expand: "Vendor",
    })
      .then((resVendor: any) => {
        let getVendorData: IVendorItems[] = [];
        if (resVendor.length) {
          resVendor.forEach((item: any) => {
            getVendorData.push({
              ID: item.ID,
              VendorId: item.VendorId,
              Vendor: item.VendorId ? item.Vendor.Title : "",
              Description: item.Description ? item.Description : "",
              Pricing: item.Pricing ? item.Pricing : "",
              PaymentTerms: item.PaymentTerms ? item.PaymentTerms : "",
              LastYearCost: item.LastYearCost ? item.LastYearCost : "",
              PO: item.PO ? item.PO : "",
              Supplier: item.Supplier ? item.Supplier : "",
              AttachmentURL: item.AttachmentURL
                ? JSON.parse(item.AttachmentURL)
                : [],
              ProcurementURL: item.ProcurementTeamQuotationURL
                ? JSON.parse(item.ProcurementTeamQuotationURL)
                : [],
              RequestedAmount: item.RequestedAmount ? item.RequestedAmount : "",
              BudgetId: item.BudgetId ? item.BudgetId : null,
              isDummy: false,
              isEdit: false,
              Attachment: [],
              Procurement: [],
            });
          });
          if (admin) {
            getVendorData.push({ ...Config.Vendor });
          }
          setMData([...getVendorData]);
          setIsLoader(false);
        } else {
          setMData([...MData, { ...Config.Vendor }]);
          setIsLoader(false);
        }
      })
      .catch((error: any) => getErrorFunction(error));
  };

  const handleDropdown = (value: IDrop, index: number): void => {
    let data = { ...vendorData };

    data.Vendor = value.text;
    data.VendorId = value.key;

    setVendorData(data);
  };

  const newVendorAdd = (item: IVendorItems, index: number): void => {
    let items: IVendorItems[] = [...MData];
    items[index].isDummy = false;
    items[index].isEdit = true;
    setMData([...items]);
    setVendorData(item);
  };

  const addVendorCancel = (item: IVendorItems, index: number): void => {
    let AVendorCancel: IVendorItems[] = [...MData];
    AVendorCancel[index].isDummy = true;
    AVendorCancel[index].isEdit = false;
    setMData([...AVendorCancel]);
    setVendorData(item);
  };

  const addVendor = (item: IVendorItems): void => {
    let NewJson = {
      VendorId: vendorData.VendorId,
      Description: vendorData.Description,
      Pricing: vendorData.Pricing,
      PaymentTerms: vendorData.PaymentTerms,
      LastYearCost: vendorData.LastYearCost,
      PO: vendorData.PO,
      Supplier: vendorData.Supplier,
      RequestedAmount: vendorData.RequestedAmount,
    };

    let authendication: boolean = Validation();

    if (authendication) {
      setIsLoader(true);

      SPServices.SPAddItem({
        Listname: Config.ListNames.DistributionList,
        RequestJSON: NewJson,
      })
        .then((resAddItem: any) => {
          createMasterFolder(resAddItem.data.Id);
        })
        .catch((error: any) => {
          getErrorFunction("add categorty list");
        });
    }
  };

  const createMasterFolder = async (itemId: number) => {
    await sp.web.rootFolder.folders
      .getByName(Config.ListNames.DistributionLibrary)
      .folders.addUsingPath(itemId.toString(), true)
      .then(async (folder: any) => {
        await sp.web.lists
          .getByTitle(Config.ListNames.DistributionLibrary)
          .rootFolder.folders.getByName(folder.data.Name)
          .expand("ListItemAllFields")
          .get()
          .then(async (_folder: any) => {
            await sp.web.lists
              .getByTitle(Config.ListNames.DistributionLibrary)
              .items.getById(_folder["ListItemAllFields"]["ID"])
              .update({ DistributionId: itemId })
              .then((item1: any) => {})
              .catch((error: any) => getErrorFunction("id update error"));
          });

        createSubFolder(folder, itemId);
      })
      .catch((err) => {
        getErrorFunction("create folder");
      });
  };

  const createSubFolder = async (folder: any, itemId: number) => {
    let Attachment: string[] = [];
    let Procurement: string[] = [];
    await sp.web
      .getFolderByServerRelativePath(folder.data.ServerRelativeUrl)
      .folders.addUsingPath("Attachment", true)
      .then(async (data) => {
        for (let i = 0; i < vendorData.Attachment.length; i++) {
          await sp.web
            .getFolderByServerRelativePath(data.data.ServerRelativeUrl)
            .files.addUsingPath(
              vendorData.Attachment[i].name,
              vendorData.Attachment[i],
              { Overwrite: true }
            )
            .then((result) => {
              Attachment.push(result.data.ServerRelativeUrl);
            })
            .catch((error) => console.log("error", error));
        }
      })
      .catch((error) => console.log("first sub folder", error));
    await sp.web
      .getFolderByServerRelativePath(folder.data.ServerRelativeUrl)
      .folders.addUsingPath("Procurement", true)
      .then(async (data) => {
        for (let i = 0; i < vendorData.Procurement.length; i++) {
          await sp.web
            .getFolderByServerRelativePath(data.data.ServerRelativeUrl)
            .files.addUsingPath(
              vendorData.Procurement[i].name,
              vendorData.Procurement[i],
              { Overwrite: true }
            )
            .then((result) => {
              Procurement.push(result.data.ServerRelativeUrl);
            })
            .catch((error) => console.log("error", error));
        }
      })
      .catch((error) => console.log("second sub folder", error));

    updateJson(Attachment, Procurement, itemId, "Add");
  };

  const updateJson = (
    Attachment: string[],
    Procurement: string[],
    itemId: number,
    type: string
  ) => {
    let json = {
      AttachmentURL: JSON.stringify(Attachment),
      ProcurementTeamQuotationURL: JSON.stringify(Procurement),
    };

    setattachmentJson(json, itemId, type);
  };

  const setattachmentJson = (json: any, Id: number, type: string) => {
    SPServices.SPUpdateItem({
      Listname: Config.ListNames.DistributionList,
      ID: Id,
      RequestJSON: json,
    })
      .then((data) => {
        let newData = {
          ...vendorData,
          ID: Id,
          AttachmentURL: JSON.parse(json.AttachmentURL),
          ProcurementURL: JSON.parse(json.ProcurementTeamQuotationURL),
          isEdit: false,
        };
        console.log("newData", newData);

        let masterData = [...MData];

        if (type === "Add") {
          masterData.pop();
          masterData.push(newData, Config.Vendor);
        } else {
          let index = [...MData].findIndex((value) => value.ID === Id);
          masterData.splice(index, 1, { ...newData });
        }

        console.log("masterData", [...masterData]);

        TypeFlag = "";
        ConfimMsg = false;
        setIsLoader(false);
        setMData([...masterData]);
      })
      .catch((error) => console.log("error", error));
  };

  const handleInputValue = (files: any, type: string) => {
    console.log("files", files);

    let allFiles = [];
    let allURL = []
    for (let i = 0; i < files.length; i++) {
      allFiles.push(files[i]);
      let authendication = [...allURL].some(value=>value === files[i].name);
      if(authendication){
        allURL = [...allURL].filter((value,index) => index !== allURL.indexOf(value));
        allURL.unshift(files[i].name)
      }
      else{
        allURL.unshift(files[i].name)
      }
    }
   
    
    if (type === "Attachment") {
      setVendorData({
        ...vendorData,
        Attachment: allFiles,
        AttachmentURL: allURL,
      });
    } else {
      setVendorData({
        ...vendorData,
        Procurement: allFiles,
        ProcurementURL: allURL,
      });
    }
  };

  const editVendorItem = (items: IVendorItems, index: number) => {
    let editItem = [...MData];
    editItem[index].isEdit = true;
    setVendorData(items);
    setMData([...editItem]);
  };

  const editVendorCancel = (item: IVendorItems, index: number) => {
    let EVendorCancel = [...MData];
    EVendorCancel[index].isEdit = false;
    setMData([...EVendorCancel]);
  };

  const vendorUpdate = (item: IVendorItems, index: number) => {
    let UpdateJson = {
      VendorId: vendorData.VendorId,
      Description: vendorData.Description,
      Pricing: vendorData.Pricing,
      PaymentTerms: vendorData.PaymentTerms,
      LastYearCost: vendorData.LastYearCost,
      PO: vendorData.PO,
      Supplier: vendorData.Supplier,
      RequestedAmount: vendorData.RequestedAmount,
    };

    let authendication = Validation();

    if (authendication) {
      setIsLoader(true);
      SPServices.SPUpdateItem({
        Listname: Config.ListNames.DistributionList,
        RequestJSON: UpdateJson,
        ID: item.ID,
      })
        .then((resUpdateItem) => {
          getMasterFolder(item.ID);
        })
        .catch((error) => {
          getErrorFunction("update distribution error");
        });
    }
  };

  const getMasterFolder = (itemId: number) => {
    console.log(itemId.toString());

    sp.web.lists
      .getByTitle(Config.ListNames.DistributionLibrary)
      .rootFolder.folders.getByName(itemId.toString())
      .expand("ListItemAllFields")
      .get()
      .then((folder) => {
        console.log("folder", folder);
        getSubfolders(folder, itemId);
      })
      .catch((error) => getErrorFunction("update get master folder"));
  };

  const getSubfolders = async (folder: any, itemId) => {
    let Attachment: string[] = [...vendorData.AttachmentURL];
    let Procurement: string[] = [...vendorData.ProcurementURL];

    for (let i = 0; i < vendorData.Attachment.length; i++) {
      await sp.web
        .getFolderByServerRelativePath(folder.ServerRelativeUrl + "/Attachment")
        .files.addUsingPath(
          vendorData.Attachment[i].name,
          vendorData.Attachment[i],
          { Overwrite: true }
        )
        .then((data) => {
          Attachment.unshift(data.data.ServerRelativeUrl);
        })
        .catch((err) => console.log("err", err));
    }
    for (let i = 0; i < vendorData.Procurement.length; i++) {
      await sp.web
        .getFolderByServerRelativePath(
          folder.ServerRelativeUrl + "/Procurement"
        )
        .files.addUsingPath(
          vendorData.Procurement[i].name,
          vendorData.Procurement[i],
          { Overwrite: true }
        )
        .then((data) => {
          Procurement.unshift(data.data.ServerRelativeUrl);
        })
        .catch((err) => console.log("err", err));
    }
    updateJson(Attachment, Procurement, itemId, "Update");
  };

  const ConfirmPageChange = (
    item: IVendorItems,
    index: number,
    type: string
  ) => {
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
        setVendorData({ ...Config.Vendor });
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

  const Validation = (): boolean => {
    let isValidation: boolean = true;
    let validationData: IVendorValidation = { ...Config.vendorValidation };

    if (vendorData.Vendor === "All") {
      validationData.Description = true;
      isValidation = false;
    }

    if (!vendorData.Description) {
      validationData.Description = true;
      isValidation = false;
    }

    if (!vendorData.Pricing) {
      validationData.Pricing = true;
      isValidation = false;
    }

    setValidate(validationData);
    return isValidation;
  };

  useEffect(() => {
    getDefaultFunction();
  }, [isTrigger]);

  return isLoader ? (
    <Loader />
  ) : (
    <div>
      <div>
      <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "10px 0px 20px 0px",
            }}
          >
            <IconButton
              styles={IconStyle}
              iconProps={{ iconName: "Back" }}
              onClick={() => {
                props.setVendorDetails({...props.vendorDetails,isVendor:true})
              }}
            />
            <h2 style={{ margin: 0, fontSize: 20, color: '#202945' }}>
              Budget Distribution
            </h2>
          </div>
      </div>
      <div style={{
        display:'flex',
        width:'100%',
        justifyContent:'space-between'
      }}>
        <div style={{
          display:'flex',
          width:'60%',
          gap:'2%'
        }}>
          <div style={{width:'15%'}}>
            <TextField label="Period" value="one" disabled={true}/>
          </div>
          <div style={{width:'15%'}}>
            <TextField label="Country" value="one" disabled={true}/>
          </div>
          <div style={{width:'15%'}}>
            <TextField label="Type" value="one" disabled={true}/>
          </div>
          <div style={{width:'15%'}}>
            <TextField label="Area" value="one" disabled={true}/>
          </div>
          <div style={{width:'40%'}}>
            <label>Renewal Type</label>
            <div style={{
              display:'flex',
              gap:'2%'
            }}>
              <Checkbox label="New" checked={isRenual} onChange={(event,checked)=>{setIsRenual(true)}}/>
              <Checkbox label="Existing" checked={!isRenual} onChange={(event,checked)=>{setIsRenual(false)}}/>
            </div>
          </div>
        </div>
       
        <div style={{
          display:'flex',
          gap:'2%'
        }}>
          {
            admin ? 
            <DefaultButton text="Submit"/>
            :
            <>
              <DefaultButton text="Review"/>
              <DefaultButton text="Approve"/>
            </>
          }
        </div>
      </div>
      <DetailsList
        columns={column}
        items={MData}
        styles={_DetailsListStyle}
        selectionMode={SelectionMode.none}
      />
      {/* <button >click</button> */}
    </div>
  );
};

export default Vendor;
