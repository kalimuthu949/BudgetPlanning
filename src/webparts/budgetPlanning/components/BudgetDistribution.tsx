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
import {
  IDrop,
  IDropdowns,
  ICurBudgetItem,
  ICurCategoryItem,
  IOverAllItem,
  IBudgetListColumn,
  IBudgetValidation,
} from "../../../globalInterFace/BudgetInterFaces";
import {
  PeoplePicker,
  PrincipalType,
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { Config } from "../../../globals/Config";
import { _getFilterDropValues } from "../../../CommonServices/DropFunction";
import SPServices from "../../../CommonServices/SPServices";
import Loader from "./Loader";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import styles from "./BudgetDistribution.module.scss";
import Vendor from "./Vendor";

let propDropValue: IDropdowns;
let _isCurYear: boolean = true;

const BudgetDistribution = (props: any): JSX.Element => {
  /* Variable creation */
  propDropValue = { ...props.dropValue };
  let _curYear: string =
    propDropValue.Period[propDropValue.Period.length - 1].text;

  const _budgetPlanColumns: IColumn[] = [];

  /* State creation */
  const [isLoader, setIsLoader] = useState<boolean>(true);
  const [filPeriodDrop, setFilPeriodDrop] = useState<string>(
    propDropValue.Period[propDropValue.Period.length - 1].text
  );
  const [filCountryDrop, setFilCountryDrop] = useState<string>("All");
  const [filTypeDrop, setFilTypeDrop] = useState<string>("All");
  const [filAreaDrop, setFilAreaDrop] = useState<string>("All");
  const [items, setItems] = useState<ICurBudgetItem[]>([]);
  const [group, setGroup] = useState<any[]>([]);
  const [detailColumn, setDetailColumn] = useState<IColumn[]>([]);

  /* Style Section */
  const DropdownStyle: Partial<IDropdownStyles> = {
    dropdown: {
      ":focus::after": {
        border: "1px solid rgb(96, 94, 92)",
      },
    },
  };

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
        height: items.length ? "58vh" : 20,
        overflowY: "auto",
        overflowX: "hidden",
      },
    },
  };

  /* function creation */
  const _getErrorFunction = (errMsg: any): void => {
    setIsLoader(false);
    alertify.error("Error Message");
  };

  const _getDefaultFunction = (): void => {
    setIsLoader(false);
  };

  /* Life cycle of onload */
  useEffect(() => {
    _getDefaultFunction();
  }, []);

  return isLoader ? (
    <Loader />
  ) : true ? (
    <div style={{ width: "100%" }}>
      {/* Heading section */}
      <Label className={styles.HeaderLable}>Budget Distribution</Label>

      {/* Dropdown and btn section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* Left side section */}
        <div
          style={{
            display: "flex",
            gap: "2%",
            width: "95%",
          }}
        >
          {/* Area section */}
          <div style={{ width: "16%" }}>
            <Label>Area</Label>
            <Dropdown
              styles={DropdownStyle}
              options={[...propDropValue.Area]}
              selectedKey={_getFilterDropValues(
                "Area",
                { ...propDropValue },
                filAreaDrop
              )}
              onChange={(e: any, text: IDrop) => {
                _isCurYear = filPeriodDrop == _curYear ? true : false;
                setFilAreaDrop(text.text as string);
              }}
            />
          </div>

          {/* Country section */}
          <div style={{ width: "16%" }}>
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
                _isCurYear = filPeriodDrop == _curYear ? true : false;
                setFilCountryDrop(text.text as string);
              }}
            />
          </div>

          {/* Period section */}
          <div style={{ width: "8%" }}>
            <Label>Period</Label>
            <Dropdown
              styles={DropdownStyle}
              options={[...propDropValue.Period]}
              selectedKey={_getFilterDropValues(
                "Period",
                { ...propDropValue },
                filPeriodDrop
              )}
              onChange={(e: any, text: IDrop) => {
                _isCurYear = (text.text as string) == _curYear ? true : false;
                setFilPeriodDrop(text.text as string);
              }}
            />
          </div>

          {/* Type section */}
          <div style={{ width: "8%" }}>
            <Label>Type</Label>
            <Dropdown
              styles={DropdownStyle}
              options={[...propDropValue.Type]}
              selectedKey={_getFilterDropValues(
                "Type",
                { ...propDropValue },
                filTypeDrop
              )}
              onChange={(e: any, text: IDrop) => {
                _isCurYear = filPeriodDrop == _curYear ? true : false;
                setFilTypeDrop(text.text as string);
              }}
            />
          </div>

          {/* Over all refresh section */}
          <div
            className={styles.refIcon}
            onClick={() => {
              _isCurYear = true;
              setFilPeriodDrop(
                propDropValue.Period[propDropValue.Period.length - 1].text
              );
              setFilCountryDrop("All");
              setFilTypeDrop("All");
              setFilAreaDrop("All");
            }}
          >
            <Icon iconName="Refresh" style={{ color: "#ffff" }} />
          </div>
        </div>

        {/* btn and people picker section */}
        <div style={{ display: "flex", alignItems: "end", width: "5%" }}>
          <button className={styles.btns} onClick={() => {}}>
            Send
          </button>
        </div>
      </div>

      {/* Dashboard Detail list section */}
      <DetailsList
        items={[...items]}
        groups={[...group]}
        columns={[...detailColumn]}
        styles={_DetailsListStyle}
        setKey="set"
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.none}
      />
      {items.length == 0 && (
        <div className={styles.noRecords}>No data found !!!</div>
      )}
    </div>
  ) : (
    <Vendor />
  );
};

export default BudgetDistribution;
