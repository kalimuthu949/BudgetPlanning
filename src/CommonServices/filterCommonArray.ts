import * as React from "react";
import { IDrop, IGroupUsers } from "../globalInterFace/BudgetInterFaces";
import { Config } from "../globals/Config";

const _filterArray = (
  isUser: IGroupUsers,
  _array: any[],
  CommentName: string
): any[] => {
  let _arrValue: any[] = [];
  if (isUser.isSuperAdmin) {
    _arrValue = [..._array];
  } else {
    for (let i: number = 0; _array.length > i; i++) {
      if (
        CommentName == Config.Navigation.BudgetCategory ||
        CommentName == Config.Navigation.CategoryConfig ||
        CommentName == Config.Navigation.BudgetPlanning ||
        CommentName == Config.Navigation.BudgetAnalysis ||
        CommentName == Config.Navigation.BudgetTrackingList
      ) {
        if (
          isUser.isInfraManager &&
          _array[i].Area == Config.AreaName.InfraStructure
        ) {
          _arrValue.push(_array[i]);
        }
        if (
          isUser.isEnterpricesManager &&
          _array[i].Area == Config.AreaName.EnterpriseApplication
        ) {
          _arrValue.push(_array[i]);
        }
        if (
          isUser.isSpecialManager &&
          _array[i].Area == Config.AreaName.SpecialProject
        ) {
          _arrValue.push(_array[i]);
        }
      } else {
        if (
          isUser.isInfraAdmin &&
          _array[i].Area == Config.AreaName.InfraStructure
        ) {
          _arrValue.push(_array[i]);
        }
        if (
          isUser.isEnterpricesAdmin &&
          _array[i].Area == Config.AreaName.EnterpriseApplication
        ) {
          _arrValue.push(_array[i]);
        }
        if (
          isUser.isSpecialAdmin &&
          _array[i].Area == Config.AreaName.SpecialProject
        ) {
          _arrValue.push(_array[i]);
        }
      }
    }
  }
  return _arrValue;
};

const _filAreaDrop = (user: IGroupUsers): IDrop[] => {
  let _arrArea: IDrop[] = [{ key: 0, text: "All" }];
  if (user.isSuperAdmin) {
    _arrArea.push(
      { key: 1, text: Config.AreaName.InfraStructure },
      { key: 2, text: Config.AreaName.EnterpriseApplication },
      { key: 3, text: Config.AreaName.SpecialProject }
    );
  } else {
    if (
      user.isInfraManager ||
      user.isEnterpricesManager ||
      user.isSpecialManager
    ) {
      if (user.isInfraManager) {
        _arrArea.push({ key: 1, text: Config.AreaName.InfraStructure });
      }
      if (user.isEnterpricesManager) {
        _arrArea.push({ key: 2, text: Config.AreaName.EnterpriseApplication });
      }
      if (user.isSpecialManager) {
        _arrArea.push({ key: 3, text: Config.AreaName.SpecialProject });
      }
    } else {
      if (user.isInfraAdmin) {
        _arrArea.push({ key: 1, text: Config.AreaName.InfraStructure });
      }
      if (user.isEnterpricesAdmin) {
        _arrArea.push({ key: 2, text: Config.AreaName.EnterpriseApplication });
      }
      if (user.isSpecialAdmin) {
        _arrArea.push({ key: 3, text: Config.AreaName.SpecialProject });
      }
    }
  }
  return _arrArea;
};

export { _filterArray, _filAreaDrop };
