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

  /* State creation */
  const [isLoader, setIsLoader] = useState<boolean>(true);
  const [filPeriodDrop, setFilPeriodDrop] = useState<string>(
    propDropValue.Period[propDropValue.Period.length - 1].text
  );
  const [filCountryDrop, setFilCountryDrop] = useState<string>("All");
  const [filTypeDrop, setFilTypeDrop] = useState<string>("All");

  /* Style Section */
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

  const _getDefaultFunction = (): void => {
    setIsLoader(false);
  };

  /* Life cycle of onload */
  useEffect(() => {
    _getDefaultFunction();
  }, []);

  return isLoader ? (
    <Loader />
  ) : (
    // <div style={{ width: "100%" }}>
    //   {/* Heading section */}
    //   <Label className={styles.HeaderLable}>Budget Distribution</Label>

    //   {/* Dropdown and btn section */}
    //   <div
    //     style={{
    //       display: "flex",
    //       justifyContent: "space-between",
    //     }}
    //   >
    //     {/* Left side section */}
    //     <div
    //       style={{
    //         display: "flex",
    //         gap: "2%",
    //         width: "95%",
    //       }}
    //     >
    //       {/* Period section */}
    //       <div style={{ width: "16%" }}>
    //         <Label>Period</Label>
    //         <Dropdown
    //           styles={DropdownStyle}
    //           options={[...propDropValue.Period]}
    //           selectedKey={_getFilterDropValues(
    //             "Period",
    //             { ...propDropValue },
    //             filPeriodDrop
    //           )}
    //           onChange={(e: any, text: IDrop) => {
    //             _isCurYear = (text.text as string) == _curYear ? true : false;
    //             setFilPeriodDrop(text.text as string);
    //           }}
    //         />
    //       </div>

    //       {/* Country section */}
    //       <div style={{ width: "16%" }}>
    //         <Label>Country</Label>
    //         <Dropdown
    //           styles={DropdownStyle}
    //           options={[...propDropValue.Country]}
    //           selectedKey={_getFilterDropValues(
    //             "Country",
    //             {
    //               ...propDropValue,
    //             },
    //             filCountryDrop
    //           )}
    //           onChange={(e: any, text: IDrop) => {
    //             _isCurYear = filPeriodDrop == _curYear ? true : false;
    //             setFilCountryDrop(text.text as string);
    //           }}
    //         />
    //       </div>

    //       {/* Type section */}
    //       <div style={{ width: "16%" }}>
    //         <Label>Type</Label>
    //         <Dropdown
    //           styles={DropdownStyle}
    //           options={[...propDropValue.Type]}
    //           selectedKey={_getFilterDropValues(
    //             "Type",
    //             { ...propDropValue },
    //             filTypeDrop
    //           )}
    //           onChange={(e: any, text: IDrop) => {
    //             _isCurYear = filPeriodDrop == _curYear ? true : false;
    //             setFilTypeDrop(text.text as string);
    //           }}
    //         />
    //       </div>

    //       {/* Over all refresh section */}
    //       <div
    //         className={styles.refIcon}
    //         onClick={() => {
    //           _isCurYear = true;
    //           setFilPeriodDrop(
    //             propDropValue.Period[propDropValue.Period.length - 1].text
    //           );
    //           setFilCountryDrop("All");
    //           setFilTypeDrop("All");
    //         }}
    //       >
    //         <Icon iconName="Refresh" style={{ color: "#ffff" }} />
    //       </div>
    //     </div>

    //     {/* btn and people picker section */}
    //     <div style={{ display: "flex", alignItems: "end", width: "5%" }}>
    //       <button className={styles.btns} onClick={() => {}}>
    //         Send
    //       </button>
    //     </div>
    //   </div>
    // </div>
    <div>
      <Vendor />
    </div>
  );
};

export default BudgetDistribution;
