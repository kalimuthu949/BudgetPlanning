import * as React from "react";
import { useState, useEffect } from "react";
import { Label, Icon } from "@fluentui/react";
import {
  IComScreen,
  IDropdowns,
  IGroupUsers,
} from "../../../globalInterFace/BudgetInterFaces";
import { Config } from "../../../globals/Config";
import Country from "./Country";
import BudgetCategory from "./BudgetCategory";
import CategoryConfig from "./CategoryConfig";
import Loader from "./Loader";
import styles from "./CommonScreen.module.scss";

let dropValue: IDropdowns;
let groupUsers: IGroupUsers;

const CommonScreen = (props: any): JSX.Element => {
  /* Variable creation */
  dropValue = { ...props.dropValue };
  groupUsers = { ...props.groupUsers };

  const _Blocks: any[] = [
    { name: "Country", iconName: "MyNetwork" },
    { name: "Budget Category", iconName: "DocumentManagement" },
    { name: "Category Configuration", iconName: "ContactLink" },
  ];

  /* State creation */
  const [isLoader, setIsLoader] = useState<boolean>(true);
  const [isNave, setIsNave] = useState<IComScreen>({ ...Config.ComScreen });

  /* function creation */
  const _getNaveFun = (type: string): void => {
    if (type === "Country") {
      setIsNave({ ...isNave, isCountry: true });
    }
    if (type === "Budget Category") {
      setIsNave({ ...isNave, isBudgetCategory: true });
    }
    if (type === "Category Configuration") {
      setIsNave({ ...isNave, isCategoryConfig: true });
    }
    if (type === "") {
      setIsNave({ ...Config.ComScreen });
    }
    setIsLoader(false);
  };

  /* Life cycle of onload */
  useEffect(() => {
    setIsLoader(true);
    _getNaveFun("");
  }, []);

  return isLoader ? (
    <Loader />
  ) : (
    <div className={styles.container}>
      {isNave.isCountry ? (
        <Country
          dropValue={dropValue}
          groupUsers={groupUsers}
          setIsNave={setIsNave}
        />
      ) : isNave.isBudgetCategory ? (
        <BudgetCategory
          dropValue={dropValue}
          groupUsers={groupUsers}
          setIsNave={setIsNave}
        />
      ) : isNave.isCategoryConfig ? (
        <CategoryConfig
          dropValue={dropValue}
          groupUsers={groupUsers}
          setIsNave={setIsNave}
        />
      ) : (
        <div className={styles.masBox}>
          {_Blocks.length &&
            _Blocks.map((e: any) => {
              return (
                <div
                  className={styles.block}
                  onClick={() => _getNaveFun(e.name)}
                >
                  <div
                    style={{
                      width: "100%",
                    }}
                  >
                    <Icon
                      iconName={e.iconName}
                      style={{
                        fontSize: 46,
                      }}
                    />
                    <Label
                      style={{
                        fontSize: 26,
                        cursor: "pointer",
                      }}
                    >
                      {e.name}
                    </Label>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default CommonScreen;
