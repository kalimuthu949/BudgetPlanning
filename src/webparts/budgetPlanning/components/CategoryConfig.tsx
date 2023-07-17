import * as React from "react";
import { useState, useEffect } from "react";
import Loader from "./Loader";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import {
  Label,
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  IDetailsListStyles,
  Dropdown,
  IDropdownStyles,
  IColumn,
} from "@fluentui/react";
import styles from "./CategoryConfig.module.scss";
import { _getFilterDropValues } from "../../../CommonServices/DropFunction";
import { IDrop, IDropdowns } from "../../../globalInterFace/BudgetInterFaces";
import { Config } from "../../../globals/Config";

let propDropValue: IDropdowns;
let _isBack: boolean = false;

const CategoryConfig = (props: any): JSX.Element => {
  /* Variable creation */
  propDropValue = { ...props.dropValue };

  const _categoryListColumns: IColumn[] = [
    {
      key: "column1",
      name: "Category",
      fieldName: Config.masCategoryListColumns.Title,
      minWidth: 200,
      maxWidth: 600,
    },
    {
      key: "column2",
      name: "Country",
      fieldName: Config.masCategoryListColumns.Title,
      minWidth: 200,
      maxWidth: 500,
    },
    {
      key: "column3",
      name: "Category Type",
      fieldName: Config.masCategoryListColumns.Title,
      minWidth: 200,
      maxWidth: 400,
    },
    {
      key: "column4",
      name: "Action",
      fieldName: Config.masCategoryListColumns.Title,
      minWidth: 100,
      maxWidth: 150,
    },
  ];

  /* State creation */
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [filCountryDrop, setFilCountryDrop] = useState<string>("All");
  const [filTypeDrop, setFilTypeDrop] = useState<string>("All");

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
        justifyContent: "start",
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

  const _getDefaultFunction = (): void => {
    _isBack = false;
    setIsLoader(false);
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
      <Label className={styles.HeaderLable}>Category Config</Label>

      {/* Dropdown section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* Dropdown section */}
        <div
          style={{
            display: "flex",
            gap: "2%",
            width: "95%",
          }}
        >
          {/* Country dropdown section */}
          <div style={{ width: "15%" }}>
            <Label>Country</Label>
            <Dropdown
              styles={DropdownStyle}
              options={[...propDropValue.Country]}
              selectedKey={_getFilterDropValues(
                "Country",
                {
                  ...propDropValue,
                },
                filCountryDrop
              )}
              onChange={(e: any, text: IDrop) => {
                setFilCountryDrop(text.text as string);
              }}
            />
          </div>

          {/* Category type dropdown section */}
          <div style={{ width: "15%" }}>
            <Label>Category Type</Label>
            <Dropdown
              styles={DropdownStyle}
              options={[...propDropValue.Type]}
              selectedKey={_getFilterDropValues(
                "Type",
                {
                  ...propDropValue,
                },
                filTypeDrop
              )}
              onChange={(e: any, text: IDrop) => {
                setFilTypeDrop(text.text as string);
              }}
            />
          </div>

          {/* Year dropdown section */}
          <div style={{ width: "8%" }}>
            <Label>Year</Label>
            <Dropdown
              styles={DropdownStyle}
              disabled={true}
              options={[...propDropValue.Country]}
              selectedKey={_getFilterDropValues(
                "Country",
                {
                  ...propDropValue,
                },
                filCountryDrop
              )}
              onChange={(e: any, text: IDrop) => {
                setFilCountryDrop(text.text as string);
              }}
            />
          </div>

          {/* Category dropdown section */}
          <div style={{ width: "15%" }}>
            <Label>Category</Label>
            <Dropdown
              styles={DropdownStyle}
              options={[...propDropValue.Country]}
              selectedKey={_getFilterDropValues(
                "Country",
                {
                  ...propDropValue,
                },
                filCountryDrop
              )}
              onChange={(e: any, text: IDrop) => {
                setFilCountryDrop(text.text as string);
              }}
            />
          </div>
        </div>

        {/* btn section */}
        <div style={{ display: "flex", alignItems: "end", width: "5%" }}>
          <button disabled={true} className={styles.btns}>
            Save
          </button>
        </div>
      </div>

      {/* Details list section */}
      <DetailsList
        items={[]}
        columns={[..._categoryListColumns]}
        styles={_DetailsListStyle}
        setKey="set"
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.none}
      />
      {false && <div className={styles.noRecords}>No data found !!!</div>}
    </div>
  );
};

export default CategoryConfig;
