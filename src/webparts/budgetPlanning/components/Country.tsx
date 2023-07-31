import * as React from "react";
import { useState, useEffect } from "react";
import styles from "./BudgetCategory.module.scss";
import {
  Label,
  DetailsList,
  SelectionMode,
  IColumn,
  DetailsListLayoutMode,
  Modal,
  TextField,
  IDetailsListStyles,
  ITextFieldStyles,
  SearchBox,
  DefaultButton,
  IIconProps,
  IconButton,
  ISearchBoxStyles,
  IButtonStyles,
  IModalStyles,
  Dropdown,
} from "@fluentui/react";
import { Config } from "../../../globals/Config";
import Loader from "./Loader";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import SPServices from "../../../CommonServices/SPServices";
import { _getFilterDropValues } from "../../../CommonServices/DropFunction";
import commonServices from "../../../CommonServices/CommonServices";
import Pagination from "office-ui-fabric-react-pagination";

interface ICountryList {
  Country: string;
  Validate: boolean;
}
interface IPagination {
  totalPageItems: number;
  pagenumber: number;
}

const addIcon: IIconProps = { iconName: "Add" };

const Country = (props: any) => {
  const Columns: IColumn[] = [
    {
      key: "column1",
      name: "Country",
      fieldName: "Country",
      minWidth: 200,
      maxWidth: 500,
    },
  ];
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [istrigger, setIstrigger] = useState<boolean>(false);
  const [countryPopup, setCountryPopup] = useState<boolean>(false);
  const [MData, setMData] = useState<ICountryList[]>([]);
  const [master, setMaster] = useState<ICountryList[]>([]);
  const [items, setItems] = useState<ICountryList[]>([]);
  const [newCountry, setNewCountry] = useState<ICountryList[]>([
    {
      Country: "",
      Validate: false,
    },
  ]);
  const [pagination, setPagination] = useState<IPagination>({
    totalPageItems: 10,
    pagenumber: 1,
  });

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
      // ".ms-DetailsHeader-cellTitle": {
      //   display: "flex",
      //   justifyContent: "center",
      // },
    },
  };

  const countryPopupStyle = {
    main: {
      padding: "10px 20px",
      borderRadius: 4,
      width: "20%",
      height: "auto !important",
      minHeight: "none",
    },
  };

  const countryinputStyle = {
    root: {
      marginRight: 6,
    },
    fieldGroup: {
      "::after": {
        border: "1px solid rgb(96, 94, 92)",
      },
    },
  };

  const countryErrorStyle = {
    root: {
      marginRight: 6,
    },
    fieldGroup: {
      border: "1px solid red !important",
      "::after": {
        border: "1px solid red !important",
      },
    },
  };

  const iconStyle = {
    rootHovered: {
      background: "transparent !important",
    },
  };

  const saveBtnStyle = {
    root: {
      border: "none",
      height: 32,
      color: "#fff",
      background: "#2580e0 !important",
      borderRadius: 3,
      marginRight: 10,
      width: "26%",
    },
    rootHovered: {
      background: "#2580e0",
      color: "#fff",
    },
  };

  const cancelBtnStyle = {
    root: {
      backgroundColor: "#dc3120",
      color: "#FFF",
      height: 32,
      borderRadius: 3,
      border: "none",
      // marginRight: 10,
      width: "26%",
    },
    rootHovered: {
      background: "#dc3120",
      color: "#fff",
    },
  };

  const btnStyle = {
    root: {
      border: "none",
      background: "#2580e0 !important",
      color: "#fff",
      height: 33,
      borderRadius: 5,
    },
    rootHovered: {
      color: "#fff",
    },
    icon: {
      fontSize: 16,
      color: "#fff",
    },
  };

  const searchStyle: Partial<ISearchBoxStyles> = {
    root: {
      width: 240,
      height: 33,
      "::after": {
        border: "1px solid rgb(96, 94, 92) !important",
      },
    },
  };

  const _getErrorFunction = (errMsg: any): void => {
    alertify.error("Error Message");
    setIsLoader(false);
  };

  const getMasterCountryData = () => {
    SPServices.SPReadItems({
      Listname: Config.ListNames.CountryList,
      Topcount: 5000,
      Orderbydecorasc: false,
    })
      .then((resMasCountry) => {
        let countryListData = [];
        if (resMasCountry.length) {
          resMasCountry.forEach((countryData) => {
            countryListData.push({
              Country: countryData[Config.CountryListColumns.Title],
            });
          });
          setMData([...countryListData]);
          setMaster([...countryListData]);
        } else {
          setMData([...countryListData]);
          setMaster([...countryListData]);
        }
      })
      .catch((err) => _getErrorFunction(err));
  };

  const countryValidation = (arr: ICountryList[]): ICountryList[] => {
    let newAddData = [];
    let DuplicateData = [];

    arr.forEach((dData) => {
      if (
        dData.Country.trim() != "" &&
        MData.filter((mdata) => {
          return (
            mdata.Country.trim().toLowerCase() ==
            dData.Country.trim().toLowerCase()
          );
        }).length == 0
      ) {
        let OriginalFlagChange = {
          ...dData,
          Validate: false,
        };
        DuplicateData.push(OriginalFlagChange);
      } else {
        if (dData.Country.trim() != "") {
          let DuplicateFlagChange = {
            ...dData,
            Validate: true,
          };
          DuplicateData.push(DuplicateFlagChange);
          alertify.error("Already Country exists");
        } else {
          let EmptyData = {
            ...dData,
            Validate: true,
          };
          DuplicateData.push(EmptyData);
          alertify.error("Please Enter The Country");
        }
      }
    });

    DuplicateData.forEach((item) => {
      if (
        newAddData.findIndex((items) => {
          return (
            items.Country.trim().toLowerCase() ==
            item.Country.trim().toLowerCase()
          );
        }) == -1
      ) {
        newAddData.push(item);
      } else {
        let DuplicateDataFlagChange = {
          ...item,
          Validate: true,
        };
        newAddData.push(DuplicateDataFlagChange);
        alertify.error("Already Country exists");
      }
    });

    setNewCountry([...newAddData]);

    return newAddData;
  };

  const addMasterCountryData = (CountryItems: ICountryList[]) => {
    let mascountryData = [];
    let authentication = false;

    let validationData = countryValidation([...CountryItems]);
    authentication = validationData.every((val) => {
      return val.Validate == false;
    });

    authentication &&
      [...validationData].forEach((e: any) => {
        mascountryData.push({
          Title: e.Country,
        });
      });

    if (authentication) {
      if (mascountryData.length > 0) {
        SPServices.batchInsert({
          ListName: Config.ListNames.CountryList,
          responseData: mascountryData,
        })
          .then((result) => {
            setNewCountry([{ Country: "", Validate: false }]);
            setIstrigger(!istrigger);
            setCountryPopup(false);
            setIsLoader(false);
          })
          .catch((err) => _getErrorFunction(err));
      } else {
        setNewCountry([{ Country: "", Validate: false }]);
        setIsLoader(false);
      }
    } else {
      setIsLoader(false);
    }
  };

  const addCountryData = (index: number, data: string) => {
    let addData = [...newCountry];
    addData[index].Country = data;
    setNewCountry([...addData]);
  };

  const deleteCountry = (index: number) => {
    let delcountry = [...newCountry];
    delcountry.splice(index, 1);
    setNewCountry([...delcountry]);
  };

  const addCountry = (index: number) => {
    let validData = countryValidation([...newCountry]);
    if (
      [...validData].every((val) => {
        return val.Validate == false;
      })
    ) {
      let addcountrydata = [...validData];
      addcountrydata.push({
        Country: "",
        Validate: false,
      });
      setNewCountry([...addcountrydata]);
    }
  };

  const searchData = (data: string) => {
    setPagination({ ...pagination, pagenumber: 1 });
    let searchdata = [...MData].filter((value) => {
      return value.Country.toLowerCase().includes(data.trim().toLowerCase());
    });
    setMaster([...searchdata]);
  };

  useEffect(() => {
    let masterData = commonServices.paginateFunction(
      pagination.totalPageItems,
      pagination.pagenumber,
      master
    );
    setItems(masterData.displayitems);
  }, [pagination, master]);

  useEffect(() => {
    getMasterCountryData();
  }, [istrigger]);

  return isLoader ? (
    <Loader />
  ) : (
    <div>
      <Label className={styles.HeaderLable}>Budget Country</Label>
      <div className={styles.countryModalBtnSec}>
        <div className={styles.countryModalSearchBox}>
          {/* search section */}
          <SearchBox
            styles={searchStyle}
            placeholder="Search"
            onChange={(val, text) => searchData(text)}
          />
        </div>
        <div>
          {/*Counter Add Btn section*/}
          <DefaultButton
            text="New Country"
            styles={btnStyle}
            iconProps={addIcon}
            onClick={() => setCountryPopup(true)}
          />
        </div>
      </div>
      {/* Details list section */}
      <DetailsList
        items={[...items]}
        columns={Columns}
        styles={_DetailsListStyle}
        setKey="set"
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.none}
      />
      {items.length == 0 && (
        <div className={styles.noRecords}>No data found !!!</div>
      )}
      {master.length > 0 && (
        <Pagination
          currentPage={pagination.pagenumber}
          totalPages={Math.ceil(master.length / pagination.totalPageItems)}
          onChange={(page) =>
            setPagination({ ...pagination, pagenumber: page })
          }
        />
      )}
      {/*Country Modal */}
      <Modal isOpen={countryPopup} styles={countryPopupStyle}>
        <div className={styles.modalHeader}>
          <h3>Add New Country</h3>
        </div>
        <div>
          {newCountry.map((val, index) => {
            return (
              <>
                <div key={index} className={styles.countryModalBox}>
                  <div className={styles.contryTextField}>
                    <TextField
                      styles={
                        val.Validate ? countryErrorStyle : countryinputStyle
                      }
                      type="text"
                      value={val.Country}
                      placeholder="Enter The Country"
                      onChange={(e, text) => addCountryData(index, text)}
                    />
                  </div>
                  <div>
                    {newCountry.length > 1 && newCountry.length != index + 1 ? (
                      <IconButton
                        styles={iconStyle}
                        iconProps={{
                          iconName: "Delete",
                        }}
                        style={{ color: "red" }}
                        title="Delete"
                        ariaLabel="Delete"
                        onClick={() => deleteCountry(index)}
                      />
                    ) : (
                      <div>
                        {newCountry.length > 1 && (
                          <IconButton
                            styles={iconStyle}
                            iconProps={{
                              iconName: "Delete",
                            }}
                            style={{ color: "red" }}
                            title="Delete"
                            ariaLabel="Delete"
                            onClick={() => deleteCountry(index)}
                          />
                        )}
                        <IconButton
                          styles={iconStyle}
                          iconProps={{
                            iconName: "Add",
                          }}
                          style={{ color: "#000" }}
                          title="Add"
                          ariaLabel="Add"
                          onClick={() => addCountry(index)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </>
            );
          })}
        </div>
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <DefaultButton
            styles={saveBtnStyle}
            text={"Save"}
            onClick={() => {
              setIsLoader(true);
              addMasterCountryData([...newCountry]);
            }}
          />
          <DefaultButton
            styles={cancelBtnStyle}
            text={"Cancel"}
            onClick={() => {
              setNewCountry([{ Country: "", Validate: false }]);
              setCountryPopup(false);
            }}
          />
        </div>
      </Modal>
    </div>
  );
};
export default Country;
