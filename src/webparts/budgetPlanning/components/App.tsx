import * as React from "react";
import { useState, useEffect } from "react";
import { Config } from "../../../globals/Config";
import {
  IDrop,
  IDropdowns,
  IGroupUsers,
  IUserDetail,
} from "../../../globalInterFace/BudgetInterFaces";
import BudgetCategory from "./BudgetCategory";
import BudgetPlan from "./BudgetPlan";
import Dashboard from "./Dashboard";
import BudgetAnalysis from "./BudgetAnalysis";
import BudgetDistribution from "./BudgetDistribution";
import BudgetTrackingList from "./BudgetTrackingList";
import CategoryConfig from "./CategoryConfig";
import Country from "./Country";
import SPServices from "../../../CommonServices/SPServices";
import * as moment from "moment";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import { sp } from "@pnp/sp/presets/all";
import { Icon, Label } from "@fluentui/react";
import { _filAreaDrop } from "../../../CommonServices/filterCommonArray";
import VendorCreate from "./VendorCreate";

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
  const [adminUsers, setAdminUsers] = useState<IUserDetail[]>([]);

  /* Function creation */
  const _getErrorFunction = (errMsg: any): void => {
    alertify.error("Error message");
  };

  const getUsers = async () => {
    let allUsers: any = { ...groupUsers };
    let _userDetail: IUserDetail[] = [];

    for (let i = 0; i < _allUsers.length; i++) {
      await sp.web.siteGroups
        .getByName(_allUsers[i].groupName)
        .users.get()
        .then((result) => {
          if (result.length) {
            let authendication: boolean = [...result].some(
              (value) => value.Email === currentUser
            );

            if (authendication) {
              allUsers[_allUsers[i].user] = authendication;
            }

            if (
              _allUsers[i].user == "isSuperAdmin" ||
              _allUsers[i].user == "isInfraAdmin" ||
              _allUsers[i].user == "isEnterpricesAdmin" ||
              _allUsers[i].user == "isSpecialAdmin"
            ) {
              for (let i: number = 0; result.length > i; i++) {
                _userDetail.push({
                  ID: result[i]["Id"],
                  imageUrl: `/_layouts/15/userphoto.aspx?size=S&accountname=${result[i]["Email"]}`,
                  text: result[i]["Title"],
                  secondaryText: result[i]["Email"],
                });
              }
            }
          }

          if (_allUsers.length == i + 1) {
            setAdminUsers([..._userDetail]);
            getOtherUser(allUsers);
          }
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
      _getPageName();
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
                      resMasCategory.forEach((e: any) => {
                        _strMasCateArray.push({
                          key: e.ID,
                          text: e.Title,
                          Area: e.Area,
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

                    // get Vendor datas function
                    SPServices.SPReadItems({
                      Listname: Config.ListNames.VendorList,
                      Filter: [
                        {
                          FilterKey: "isDeleted",
                          Operator: "ne",
                          FilterValue: "1",
                        },
                      ],
                      Topcount: 5000,
                    })
                      .then((resVend: any) => {
                        let _strVendorArray: IDrop[] = [];
                        let _typeVendor: IDrop[] = [];

                        resVend.length &&
                          resVend.forEach((e: any) => {
                            _strVendorArray.push({
                              key: e.ID,
                              text: e.Title,
                            });
                          });

                        if (resVend.length == _strVendorArray.length) {
                          _typeVendor = _strVendorArray.sort((a, b) => {
                            let _firstText: string = a.text.toLowerCase();
                            let _secondText: string = b.text.toLowerCase();
                            if (_firstText < _secondText) return -1;
                            if (_firstText > _secondText) return 1;
                          });
                          _typeVendor.unshift({ key: 0, text: "All" });
                        }
                        dropValue.Vendor = [..._typeVendor];

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
    } else if (_pageNaveName == Config.Navigation.Country.toLowerCase()) {
      setPageNave(_pageNaveName);
    } else if (_pageNaveName == Config.Navigation.VendorCreate.toLowerCase()) {
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
            ) : pageNave == Config.Navigation.Country ? (
              <Country dropValue={dropValue} groupUsers={groupUsers} />
            ) : pageNave == Config.Navigation.VendorCreate ? (
              <VendorCreate dropValue={dropValue} groupUsers={groupUsers} />
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
                groupUsers={groupUsers}
                adminUsers={adminUsers}
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
          V - 0.7
        </div>
      </div>
    )
  );
};

export default App;
