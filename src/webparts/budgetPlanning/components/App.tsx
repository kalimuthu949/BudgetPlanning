import * as React from "react";
import { useState, useEffect } from "react";
import { Config } from "../../../globals/Config";
import { IDrop, IDropdowns } from "../../../globalInterFace/BudgetInterFaces";
import BudgetPlan from "./BudgetPlan";
import Dashboard from "./Dashboard";
import BudgetAnalysis from "./BudgetAnalysis";
import BudgetDistribution from "./BudgetDistribution";
import BudgetTrackingList from "./BudgetTrackingList";
import SPServices from "../../../CommonServices/SPServices";
import * as moment from "moment";

const App = (props: any): JSX.Element => {
  /* State creation */
  const [pageNave, setPageNave] = useState<string>(
    Config.Navigation.BudgetPlanning
  );
  const [dropValue, setDropValue] = useState<IDropdowns>(Config.dropdownValues);

  /* Function creation */
  const _getErrorFunction = (errMsg: any): void => {
    console.log(errMsg);
  };

  const _getDropDownValues = (): void => {
    // get years choice function
    SPServices.SPReadItems({
      Listname: Config.ListNames.YearList,
      Orderby: Config.YearListColumns.Title,
      Orderbydecorasc: true,
    })
      .then((resType: any[]) => {
        let _yearDrop: IDrop[] = [];
        if (resType.length) {
          resType.forEach((e: any, i: number) => {
            _yearDrop.push({
              key: i,
              text: e.Title,
            });
          });
        } else {
          _yearDrop = [{ key: 1, text: moment().format("YYYY") }];
        }
        dropValue.Period = _yearDrop;

        // get country choice function
        SPServices.SPReadItems({
          Listname: Config.ListNames.CountryList,
          Orderby: Config.CountryListColumns.Title,
          Orderbydecorasc: true,
        })
          .then((resType: any[]) => {
            let _countryDrop: IDrop[] = [{ key: 0, text: "All" }];
            if (resType.length) {
              resType.forEach((e: any, i: number) => {
                _countryDrop.push({
                  key: i + 1,
                  text: e.Title,
                });
              });
            }
            dropValue.Country = _countryDrop;

            // get type choice function
            SPServices.SPGetChoices({
              Listname: Config.ListNames.CategoryList,
              FieldName: Config.CategoryListColumns.CategoryType,
            })
              .then((resType: any) => {
                let _typeDrop: IDrop[] = [{ key: 0, text: "All" }];
                if (resType.Choices.length) {
                  resType.Choices.sort();
                  resType.Choices.forEach((e: string, i: number) => {
                    _typeDrop.push({
                      key: i + 1,
                      text: e,
                    });
                  });
                }
                dropValue.Type = _typeDrop;
                setDropValue({ ...dropValue });
              })
              .catch((err: any) => {
                _getErrorFunction(err);
              });
          })
          .catch((err: any) => {
            _getErrorFunction(err);
          });
      })
      .catch((err: any) => {
        _getErrorFunction(err);
      });
  };

  /* Life cycle of onload */
  useEffect(() => {
    _getDropDownValues();
  }, []);

  return pageNave == Config.Navigation.Dashboard ? (
    <Dashboard />
  ) : pageNave == Config.Navigation.BudgetPlanning ? (
    <BudgetPlan dropValue={dropValue} />
  ) : pageNave == Config.Navigation.BudgetAnalysis ? (
    <BudgetAnalysis />
  ) : pageNave == Config.Navigation.BudgetDistribution ? (
    <BudgetDistribution />
  ) : (
    <BudgetTrackingList />
  );
};

export default App;
