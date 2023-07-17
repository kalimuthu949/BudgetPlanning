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
} from "@fluentui/react";
import styles from "./CategoryConfig.module.scss";
import { _getFilterDropValues } from "../../../CommonServices/DropFunction";
import { IDrop, IDropdowns } from "../../../globalInterFace/BudgetInterFaces";

let propDropValue: IDropdowns;
let _isBack: boolean = false;

const CategoryConfig = (props: any): JSX.Element => {
  /* Variable creation */
  propDropValue = { ...props.dropValue };

  /* State creation */
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [filCountryDrop, setFilCountryDrop] = useState<string>("All");

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
      <div>
        {/* Dropdown section */}
        <div>
          {/* Country dropdown section */}
          <div>
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
          <div></div>

          {/* Year dropdown section */}
          <div></div>

          {/* Category dropdown section */}
          <div></div>
        </div>

        {/* btn section */}
        <button disabled={true}>Save</button>
      </div>

      {/* Details list section */}
      <DetailsList
        items={[]}
        columns={[]}
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
