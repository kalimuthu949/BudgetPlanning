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

const Vendor = () => {
  let admin = true;

  const column: IColumn[] = [
    {
      key: "1",
      name: "Vendor",
      fieldName: "Vendor",
      minWidth: 100,
      maxWidth: 200,
      onRender: (item) => {
        return admin ? <TextField onChange={() => {}} /> : <label></label>;
      },
    },
    {
      key: "2",
      name: "Description",
      fieldName: "Description",
      minWidth: 100,
      maxWidth: 200,
      onRender: (item) => {
        return admin ? <TextField onChange={() => {}} /> : <label></label>;
      },
    },
    {
      key: "3",
      name: "Pricing",
      fieldName: "Pricing",
      minWidth: 100,
      maxWidth: 200,
      onRender: (item) => {
        return admin ? <TextField onChange={() => {}} /> : <label></label>;
      },
    },
    {
      key: "4",
      name: "PaymentTerms",
      fieldName: "PaymentTerms",
      minWidth: 100,
      maxWidth: 200,
      onRender: (item) => {
        return admin ? <TextField onChange={() => {}} /> : <label></label>;
      },
    },
    {
      key: "5",
      name: "LastYearCost",
      fieldName: "LastYearCost",
      minWidth: 100,
      maxWidth: 200,
      onRender: (item) => {
        return admin ? <TextField onChange={() => {}} /> : <label></label>;
      },
    },
    {
      key: "6",
      name: "StartingDate",
      fieldName: "StartingDate",
      minWidth: 100,
      maxWidth: 200,
      onRender: (item) => {
        return admin ? <TextField onChange={() => {}} /> : <label></label>;
      },
    },
    {
      key: "7",
      name: "PO",
      fieldName: "PO",
      minWidth: 100,
      maxWidth: 200,
      onRender: (item) => {
        return admin ? <TextField onChange={() => {}} /> : <label></label>;
      },
    },
    {
      key: "8",
      name: "Supplier",
      fieldName: "Supplier",
      minWidth: 100,
      maxWidth: 200,
      onRender: (item) => {
        return admin ? <TextField onChange={() => {}} /> : <label></label>;
      },
    },
    {
      key: "9",
      name: "RequestedAmount",
      fieldName: "RequestedAmount",
      minWidth: 100,
      maxWidth: 200,
      onRender: (item) => {
        return admin ? <TextField onChange={() => {}} /> : <label></label>;
      },
    },
    {
      key: "10",
      name: "EntryDate",
      fieldName: "EntryDate",
      minWidth: 100,
      maxWidth: 200,
      onRender: (item) => {
        return admin ? <TextField onChange={() => {}} /> : <label></label>;
      },
    },
    {
      key: "11",
      name: "ToDate",
      fieldName: "ToDate",
      minWidth: 100,
      maxWidth: 200,
      onRender: (item) => {
        return admin ? <TextField onChange={() => {}} /> : <label></label>;
      },
    },
    {
      key: "12",
      name: "Cost",
      fieldName: "Cost",
      minWidth: 100,
      maxWidth: 200,
      onRender: (item) => {
        return admin ? <TextField onChange={() => {}} /> : <label></label>;
      },
    },
    {
      key: "13",
      name: "PoCurrency",
      fieldName: "PoCurrency",
      minWidth: 100,
      maxWidth: 200,
      onRender: (item) => {
        return admin ? <TextField onChange={() => {}} /> : <label></label>;
      },
    },
    {
      key: "14",
      name: "InvoiceNo",
      fieldName: "InvoiceNo",
      minWidth: 100,
      maxWidth: 200,
      onRender: (item) => {
        return admin ? <TextField onChange={() => {}} /> : <label></label>;
      },
    },
  ];

  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [MData, setMData] = useState<IVendorListColumn[]>([
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
    },
  ]);

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
        if (resVendor.length) {
          setIsLoader(false);
        } else {
          setIsLoader(false);
        }
      })
      .catch((error) => getErrorFunction(error));
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
