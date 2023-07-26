import * as React from "react";
import { useState, useEffect } from "react";
import { Config } from "../../../globals/Config";
import {
  IDrop,
  IDropdowns,
  IGroupUsers,
} from "../../../globalInterFace/BudgetInterFaces";
import BudgetCategory from "./BudgetCategory";
import BudgetPlan from "./BudgetPlan";
import Dashboard from "./Dashboard";
import BudgetAnalysis from "./BudgetAnalysis";
import BudgetDistribution from "./BudgetDistribution";
import BudgetTrackingList from "./BudgetTrackingList";
import CategoryConfig from "./CategoryConfig";
import SPServices from "../../../CommonServices/SPServices";
import * as moment from "moment";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import { sp } from "@pnp/sp/presets/all";
import { Icon, Label } from "@fluentui/react";
import { _filAreaDrop } from "../../../CommonServices/filterCommonArray";

const App = (props: any): JSX.Element => {
  // local variable
  const currentUser = props.context._pageContext._user.email;

  const _allUsers: any[] = [
    {
      user: "isSuperAdmin",
      groupName: Config.GroupNames.SuperAdmin,
    },
    {
      user: "isInfraAdmin",
      groupName: Config.GroupNames.InfraAdmin,
    },
    {
      user: "isSpecialAdmin",
      groupName: Config.GroupNames.SpecialAdmin,
    },
    {
      user: "isEnterpricesAdmin",
      groupName: Config.GroupNames.EnterpricesAdmin,
    },
    {
      user: "isInfraManager",
      groupName: Config.GroupNames.InfraManger,
    },
    {
      user: "isEnterpricesManager",
      groupName: Config.GroupNames.EnterpricesManager,
    },
    {
      user: "isSpecialManager",
      groupName: Config.GroupNames.SpecialManager,
    },
  ];

  /* State creation */
  const [pageNave, setPageNave] = useState<string>("");
  const [dropValue, setDropValue] = useState<IDropdowns>(Config.dropdownValues);
  const [groupUsers, setGroupUsers] = useState<IGroupUsers>({
    ...Config.GroupUsers,
  });
  const [isOtherUser, setIsOtherUser] = useState<boolean>(false);

  /* Function creation */
  const _getErrorFunction = (errMsg: any): void => {
    alertify.error("Error message");
  };

  const getUsers = async () => {
    let allUsers: any = { ...groupUsers };
    for (let i = 0; i < _allUsers.length; i++) {
      await sp.web.siteGroups
        .getByName(_allUsers[i].groupName)
        .users.get()
        .then((result) => {
          let authendication: boolean = [...result].some(
            (value) => value.Email === currentUser
          );

          if (authendication) {
            allUsers[_allUsers[i].user] = authendication;
          }

          _allUsers.length == i + 1 && getOtherUser(allUsers);
        })
        .catch((error) => {
          _getErrorFunction("get users erroe");
        });
    }
  };

  const getOtherUser = (allUsers: IGroupUsers): void => {
    let users: boolean[] = [];
    for (let keys in allUsers) {
      users.push(allUsers[keys]);
    }
    let _isOther: boolean = users.some((e: boolean) => e == true);
    if (_isOther) {
      setGroupUsers({ ...allUsers });
      setIsOtherUser(true);
      _getAreaDrop({ ...allUsers });
    } else {
      setIsOtherUser(false);
    }
  };

  const _getAreaDrop = (user: IGroupUsers): void => {
    let _filArrayArea: IDrop[] = _filAreaDrop(user);
    dropValue.Area = [..._filArrayArea];
    setDropValue({ ...dropValue });

    _getDropDownValues();
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
              ID: e.ID,
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
                  ID: e.ID,
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

                // get master category datas function
                SPServices.SPReadItems({
                  Listname: Config.ListNames.MasterCategoryList,
                  Topcount: 5000,
                })
                  .then((resMasCategory: any) => {
                    let _strMasCateArray: IDrop[] = [];
                    let _typeMasterCate: IDrop[] = [];

                    resMasCategory.length &&
                      resMasCategory.forEach((e: any, i: number) => {
                        _strMasCateArray.push({
                          key: i + 1,
                          text: e.Title,
                        });
                      });

                    if (resMasCategory.length == _strMasCateArray.length) {
                      _typeMasterCate = _strMasCateArray.sort((a, b) => {
                        let _firstText: string = a.text.toLowerCase();
                        let _secondText: string = b.text.toLowerCase();
                        if (_firstText < _secondText) return -1;
                        if (_firstText > _secondText) return 1;
                      });
                    }

                    dropValue.masterCate = [..._typeMasterCate];
                    setDropValue({ ...dropValue });
                    _getPageName();
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
      })
      .catch((err: any) => {
        _getErrorFunction(err);
      });
  };

  const _getPageName = (): void => {
    const urlParams = new URLSearchParams(window.location.search);
    const pageName: string = urlParams.get("Page");
    let _pageNaveName: string = pageName ? pageName.toLowerCase() : "";

    if (_pageNaveName == Config.Navigation.Dashboard.toLowerCase()) {
      setPageNave(_pageNaveName);
    } else if (
      _pageNaveName == Config.Navigation.BudgetAnalysis.toLowerCase()
    ) {
      setPageNave(_pageNaveName);
    } else if (
      _pageNaveName == Config.Navigation.BudgetCategory.toLowerCase()
    ) {
      setPageNave(_pageNaveName);
    } else if (
      _pageNaveName == Config.Navigation.BudgetDistribution.toLowerCase()
    ) {
      setPageNave(_pageNaveName);
    } else if (
      _pageNaveName == Config.Navigation.BudgetPlanning.toLowerCase()
    ) {
      setPageNave(_pageNaveName);
    } else if (
      _pageNaveName == Config.Navigation.BudgetTrackingList.toLowerCase()
    ) {
      setPageNave(_pageNaveName);
    } else if (
      _pageNaveName == Config.Navigation.CategoryConfig.toLowerCase()
    ) {
      setPageNave(_pageNaveName);
    } else {
      setPageNave(Config.Navigation.Dashboard);
    }
  };

  /* Life cycle of onload */
  useEffect(() => {
    getUsers();
  }, []);

  return (
    pageNave != "" && (
      <div
        style={{
          padding: "0px 30px",
        }}
      >
        {isOtherUser ? (
          <div>
            {pageNave == Config.Navigation.Dashboard ? (
              <Dashboard />
            ) : pageNave == Config.Navigation.BudgetCategory ? (
              <BudgetCategory dropValue={dropValue} groupUsers={groupUsers} />
            ) : pageNave == Config.Navigation.CategoryConfig ? (
              <CategoryConfig dropValue={dropValue} groupUsers={groupUsers} />
            ) : pageNave == Config.Navigation.BudgetPlanning ? (
              <BudgetPlan dropValue={dropValue} groupUsers={groupUsers} />
            ) : pageNave == Config.Navigation.BudgetAnalysis ? (
              <BudgetAnalysis dropValue={dropValue} groupUsers={groupUsers} />
            ) : pageNave == Config.Navigation.BudgetDistribution ? (
              <BudgetDistribution
                dropValue={dropValue}
                context={props.context}
                groupUsers={groupUsers}
              />
            ) : (
              <BudgetTrackingList groupUsers={groupUsers} />
            )}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "75vh",
            }}
          >
            <div>
              <Icon
                iconName="ReportHacked"
                style={{
                  fontSize: "56px",
                  color: "#ca001b",
                  display: "flex",
                  justifyContent: "center",
                }}
              />
              <Label
                style={{
                  fontSize: "26px",
                  color: "#202945",
                  marginTop: 20,
                }}
              >
                You don't have access to the IT Budgeting System Application.
              </Label>
            </div>
          </div>
        )}

        {/* version section */}
        <div
          style={{
            marginTop: 20,
            fontWeight: 600,
            fontSize: 16,
            color: "#202945",
          }}
        >
          V - 0.4
        </div>
      </div>
    )
  );
};

export default App;
