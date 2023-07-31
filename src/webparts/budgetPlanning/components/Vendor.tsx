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

let TypeFlag = "";
let ConfimMsg = false;

const Vendor = (props: any) => {
  let admin = true;

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

  const column: IColumn[] = [
    {
      key: "1",
      name: "Vendor",
      fieldName: "Vendor",
      minWidth: 100,
      maxWidth: 500,
      onRender: (item, index) => {
        console.log("check", item.Vendor);

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
          <label>{item.Vendor}</label>
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
              setVendorData({ ...vendorData, Description: text });
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
            value={vendorData.Pricing}
            //placeholder="Enter The Pricing"
            onChange={(e, text) => {
              setVendorData({ ...vendorData, Pricing: text });
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
      maxWidth: 500,
      onRender: (item) => {
        return item.isEdit ? (
          <TextField
            value={vendorData.PaymentTerms}
            //placeholder="Enter The PaymentTerms"
            onChange={(e, text) => {
              setVendorData({ ...vendorData, PaymentTerms: text });
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
              setVendorData({ ...vendorData, LastYearCost: text });
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
              setVendorData({ ...vendorData, PO: text });
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
              setVendorData({ ...vendorData, Supplier: text });
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
              onChange={
                (e) => handleInputValue(e.target.files, "Attachment")
                // setVendorData({
                //   ...vendorData,
                //   Attachment: e.target.files[0],
                // })
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
      maxWidth: 500,
      onRender: (item) => {
        return item.isEdit ? (
          <TextField
            value={vendorData.RequestedAmount}
            //placeholder="Enter The RequestedAmount"
            onChange={(e, text) => {
              setVendorData({ ...vendorData, RequestedAmount: text });
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
  const [vendorData, setVendorData] = useState<IVendorItems>({
    ...Config.Vendor,
  });
  const [Validate, setValidate] = useState<IVendorValidation>({...Config.vendorValidation});

  const getErrorFunction = (error) => {
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

  const getVendorData = async () => {
    await SPServices.SPReadItems({
      Listname: Config.ListNames.DistributionList,
      Select: "*, Vendor/ID, Vendor/Title",
      Expand: "Vendor",
    })
      .then((resVendor) => {
        console.log("resVendor", resVendor);
        let getVendorData: IVendorItems[] = [];
        if (resVendor.length) {
          resVendor.forEach((item: any) => {
            console.log("check data", item);

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
              Attachment: item.AttachmentURL
                ? JSON.parse(item.AttachmentURL)
                : [],
              Procurement: item.ProcurementTeamQuotationURL
                ? JSON.parse(item.ProcurementTeamQuotationURL)
                : [],
              RequestedAmount: item.RequestedAmount ? item.RequestedAmount : "",
              BudgetId: item.BudgetId ? item.BudgetId : null,
              isDummy: false,
              isEdit: false,
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
      .catch((error) => getErrorFunction(error));
  };

  const handleDropdown = (value: IDrop, index: number) => {
    let data = { ...vendorData };
    console.log("data", data);

    data.Vendor = value.text;
    data.VendorId = value.key;
    console.log("data", data);

    setVendorData(data);
  };

  const newVendorAdd = (item: IVendorItems, index: number) => {
    let items = [...MData];
    items[index].isDummy = false;
    items[index].isEdit = true;
    setMData([...items]);
    setVendorData(item);
  };

  const addVendorCancel = (item: IVendorItems, index: number) => {
    let AVendorCancel = [...MData];
    AVendorCancel[index].isDummy = true;
    AVendorCancel[index].isEdit = false;
    setMData([...AVendorCancel]);
    setVendorData(item);
  };

  const addVendor = (item) => {
    let NewJson = {
      VendorId: vendorData.VendorId,
      Description: vendorData.Description,
      Pricing: 100,
      PaymentTerms: vendorData.PaymentTerms,
      LastYearCost: vendorData.LastYearCost,
      PO: vendorData.PO,
      Supplier: vendorData.Supplier,
      RequestedAmount: vendorData.RequestedAmount,
    };

    let authendication = Validation();
    if(authendication){
      SPServices.SPAddItem({
        Listname: Config.ListNames.DistributionList,
        RequestJSON: NewJson,
      })
        .then((resAddItem) => {
          createFolder(resAddItem.data.Id);
          setIsLoader(true);
        })
        .catch((error) => {
          getErrorFunction("add categorty list");
        });
    }
  };

  const createFolder = async (itemId) => {
    let Attachment = [];
    let Procurement = [];

    await sp.web.rootFolder.folders
      .getByName("DistributionLibrary")
      .folders.addUsingPath("Master" + itemId, true)
      .then(async (folder) => {
        await sp.web.lists
          .getByTitle("DistributionLibrary")
          .rootFolder.folders.getByName(folder.data.Name)
          .expand("ListItemAllFields")
          .get()
          .then(async (_folder) => {
            await sp.web.lists
              .getByTitle("DistributionLibrary")
              .items.getById(_folder["ListItemAllFields"]["ID"])
              .update({ DistributionId: itemId })
              .then((item1) => {
                console.log(item1);
              })
              .catch((error) => console.log("id update error", error));

            await sp.web
              .getFolderByServerRelativePath(folder.data.ServerRelativeUrl)
              .folders.addUsingPath("Attachment", true)
              .then(async (data) => {
                for (let i = 0; i < vendorData.Attachment.length; i++) {
                  await sp.web
                    .getFolderByServerRelativePath(data.data.ServerRelativeUrl)
                    .files.addUsingPath(
                      vendorData.Attachment[i].name,
                      vendorData.Attachment[i]
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
                for (let i = 0; i < vendorData.Attachment.length; i++) {
                  await sp.web
                    .getFolderByServerRelativePath(data.data.ServerRelativeUrl)
                    .files.addUsingPath(
                      vendorData.Procurement[i].name,
                      vendorData.Attachment[i]
                    )
                    .then((result) => {
                      Procurement.push(result.data.ServerRelativeUrl);
                    })
                    .catch((error) => console.log("error", error));
                }
              })
              .catch((error) => console.log("second sub folder", error));
          });

        let json = {
          AttachmentURL: JSON.stringify(Attachment),
          ProcurementTeamQuotationURL: JSON.stringify(Procurement),
        };
        setattachmentJson(json, itemId);
      })
      .catch((err) => {
        getErrorFunction("create folder");
      });
  };

  // const addFiles = async (folderName,URLS,) =>{

  // }

  const setattachmentJson = (json, Id) => {
    console.log("json", json);
    SPServices.SPUpdateItem({
      Listname: Config.ListNames.DistributionList,
      ID: Id,
      RequestJSON: json,
    })
      .then((data) => {
        console.log("data added succefully");
        setIsLoader(false);
        TypeFlag = "";
        ConfimMsg = false;
        setIsTrigger(!isTrigger);
      })
      .catch((error) => console.log("error", error));
  };

  const handleInputValue = (files, type) => {
    let allFiles = [];
    for (let i = 0; i < files.length; i++) {
      allFiles.push(files[i]);
    }
    console.log("allFiles", allFiles);

    if (type === "Attachment") {
      setVendorData({
        ...vendorData,
        Attachment: allFiles,
      });
    } else {
      setVendorData({
        ...vendorData,
        Procurement: allFiles,
      });
    }
  };

  const editVendorItem = (items, index) => {
    let editItem = [...MData];
    editItem[index].isEdit = true;
    setVendorData(items);
    setMData([...editItem]);
  };

  const editVendorCancel = (item, index) => {
    let EVendorCancel = [...MData];
    EVendorCancel[index].isEdit = false;
    setMData([...EVendorCancel]);
  };

  const vendorUpdate = (item, index) => {
    let UpdateJson = {
      Vendor: vendorData.Vendor,
      Description: vendorData.Description,
      Pricing: 100,
      PaymentTerms: vendorData.PaymentTerms,
      LastYearCost: vendorData.LastYearCost,
      PO: vendorData.PO,
      Supplier: vendorData.Supplier,
      RequestedAmount: vendorData.RequestedAmount,
    };
    let authendication = Validation()
    if(authendication){
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
    }
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

  const Validation = () => {
    let isValidation = true;
    let validationData = {...Config.vendorValidation}

    if(vendorData.Vendor === 'All'){
      validationData.Description = true
      isValidation = false;
    }

    if(!vendorData.Description){
      validationData.Description = true
      isValidation = false;
    }

    if(!vendorData.Pricing){
      validationData.Pricing = true;
      isValidation = false;
    }

    setValidate(validationData);
    return isValidation
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
        styles={_DetailsListStyle}
        selectionMode={SelectionMode.none}
      />
    </div>
  );
};

export default Vendor;
