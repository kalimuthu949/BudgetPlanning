import * as React from "react";
import { useState, useEffect } from "react";
import SPServices from "../../../CommonServices/SPServices";
import { Config } from "../../../globals/Config";
import {
  ICurBudgetAnalysis,
  IDrop,
  IEdit,
} from "../../../globalInterFace/BudgetInterFaces";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import styles from "./BudgetAnalysis.module.scss";
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
  IconButton,
  TextField,
  ITextFieldStyles,
} from "@fluentui/react";
import { _getFilterDropValues } from "../../../CommonServices/DropFunction";

let _isCurYear: boolean = true;

const BudgetAnalysis = (props: any): JSX.Element => {
  let propDropValue = { ...props.dropValue };
  let currentYear: string =
    propDropValue.Period[propDropValue.Period.length - 1].text;

  const budjetColums: IColumn[] = [
    {
      key: "column1",
      name: "Category",
      fieldName: "Category",
      minWidth: 200,
      maxWidth: 300,
    },
    {
      key: "column2",
      name: "Country",
      fieldName: "Country",
      minWidth: 200,
      maxWidth: 300,
    },
    {
      key: "column3",
      name: "Total",
      fieldName: "BudgetAllocated",
      minWidth: 200,
      maxWidth: 300,
      onRender: (item: ICurBudgetAnalysis, index: number) => {
        if (item.isEdit) {
          return (
            <TextField
              value={edit.data ? edit.data.toString() : ""}
              placeholder="Enter Here"
              styles={isValidation ? errtxtFieldStyle : textFieldStyle}
              onChange={(e: any, value: any) => {
                if (/^[0-9]+$|^$/.test(value)) {
                  console.log("value", value);
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
          return item.BudgetAllocated;
        }
      },
    },
    {
      key: "column4",
      name: "Action",
      fieldName: "action",
      minWidth: 200,
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

  // state
  const [budgetItems, setBudgetItems] = useState<ICurBudgetAnalysis[]>([]);
  const [isValidation, setIsvalidation] = useState<boolean>(false);
  const [edit, setEdit] = useState<IEdit>({
    authendication: false,
    id: null,
    data: null,
  });
  const [filPeriodDrop, setFilPeriodDrop] = useState<string>(
    propDropValue.Period[propDropValue.Period.length - 1].text
  );
  const [filCountryDrop, setFilCountryDrop] = useState<string>("All");
  const [filTypeDrop, setFilTypeDrop] = useState<string>("All");
  console.log("edit", edit);

  // console.log("budgetItems", budgetItems);

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
    },
  };

  const DropdownStyle: Partial<IDropdownStyles> = {
    dropdown: {
      ":focus::after": {
        border: "1px solid rgb(96, 94, 92)",
      },
    },
  };

  // functions creations
  const _getErrorFunction = (errMsg: any): void => {
    alertify.error(errMsg);
    // setIsLoader(false);
  };

  const _getDefaultFunction = (): void => {
    getAllData();
  };

  const getAllData = (): void => {
    SPServices.SPReadItems({
      Listname: Config.ListNames.BudgetList,
      Select:
        "*, Category/ID, Category/Title, Year/ID, Year/Title, Country/ID, Country/Title",
      Expand: "Category, Year, Country",
      Topcount: 5000,
      Filter: [
        {
          FilterKey: "isDeleted",
          FilterValue: "1",
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
              Category: value.Category.Title ? value.Category.Title : "",
              Country: value.Country.Title ? value.Country.Title : "",
              Year: value.Year.Title ? value.Year.Title : "",
              Type: value.CategoryType ? value.CategoryType : "",
              ApproveStatus: value.ApproveStatus ? value.ApproveStatus : "",
              Description: value.Description ? value.Description : "",
              ID: value.ID ? value.ID : null,
              BudgetAllocated: value.BudgetAllocated
                ? value.BudgetAllocated
                : null,
              BudgetProposed: value.BudgetProposed
                ? value.BudgetProposed
                : null,
              isEdit: false,
            });
            items.length == data.length && getCurrentYearData([...items]);
          });
        }
      })
      .catch((error: any) => _getErrorFunction("get budgjet data"));
  };

  const getCurrentYearData = (items: ICurBudgetAnalysis[]) => {
    let budgItems = [...items].filter((value) => value.Year === currentYear);
    setBudgetItems([...budgItems]);
  };

  const handelEdit = (
    index: number,
    type: string,
    item: ICurBudgetAnalysis
  ) => {
    let value: boolean = type === "Edit" ? true : false;
    let items: ICurBudgetAnalysis[] = [...budgetItems];
    items[index].isEdit = value;

    if (type === "Edit") {
      setEdit({
        authendication: true,
        data: item.BudgetAllocated,
        id: item.ID,
      });
    } else {
      setEdit({ ...edit, authendication: false });
    }

    setBudgetItems(items);
  };

  const handleEditUpdate = (item: ICurBudgetAnalysis, index: number) => {
    let items: ICurBudgetAnalysis[] = [...budgetItems];
    if (edit.data) {
      items[index].isEdit = true;
    }
  };

  const handleFilter = () =>{
    let items = [...budgetItems].filter((value:ICurBudgetAnalysis)=>{
      return true
    })
  }

  useEffect(() => {
    _getDefaultFunction();
  }, []);

  useEffect(()=>{
    handleFilter()
  },[filTypeDrop])

  return (
    <div>
      {/* Heading section */}
      <Label className={styles.HeaderLable}>Budget Analysis</Label>
      <div style={{ display: "flex",gap:'2%'}}>
        <div style={{ width: "10%" }}>
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
              
            }}
          />
        </div>
        <div style={{ width: "10%" }}>
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
              
            }}
          />
        </div>
        {/* <div style={{ width: "10%" }}>
          <Dropdown
            styles={DropdownStyle}
            label="Master Category"
            options={[...propDropValue.Type]}
            selectedKey={_getFilterDropValues(
              "Master Category",
              { ...propDropValue },
              fil
            )}
            onChange={(e: any, text: IDrop) => {
              _isCurYear = filPeriodDrop == currentYear ? true : false;
              setFilCountryDrop(text.text as string);
              
            }}
          />
        </div> */}
        <div style={{ width: "10%" }}>
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
              _isCurYear = filPeriodDrop == currentYear ? true : false;
              setFilPeriodDrop(text.text as string);
              
            }}
          />
        </div>
      </div>

      {/* Details List section */}
      <DetailsList
        columns={budjetColums}
        items={budgetItems}
        styles={_DetailsListStyle}
        setKey="set"
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.none}
      />
    </div>
  );
};

export default BudgetAnalysis;
