import * as React from "react";
import { useState, useEffect } from "react";
import { Label, Icon } from "@fluentui/react";
import Loader from "./Loader";
import styles from "./CommonScreen.module.scss";

const CommonScreen = (props: any): JSX.Element => {
  /* Variable creation */
  const _Blocks: any[] = [
    { name: "Country", iconName: "MyNetwork" },
    { name: "Budget Category", iconName: "DocumentManagement" },
    { name: "Category Configuration", iconName: "ContactLink" },
  ];

  /* State creation */
  const [isLoader, setIsLoader] = useState<boolean>(false);

  /* Style Section */

  /* function creation */

  /* Life cycle of onload */
  useEffect(() => {}, []);

  return isLoader ? (
    <Loader />
  ) : (
    <div className={styles.container}>
      {/* Blocks section */}
      <div className={styles.masBox}>
        {_Blocks.length &&
          _Blocks.map((e: any) => {
            return (
              <div className={styles.block}>
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
    </div>
  );
};

export default CommonScreen;
