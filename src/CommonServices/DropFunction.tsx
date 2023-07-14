import { IDrop, IDropdowns } from "../globalInterFace/BudgetInterFaces";

const _getFilterDropValues = (
  type: string,
  value: IDropdowns,
  filValue: string
): any => {
  let key: number = 0;
  if (type == "Period" && value.Period.length) {
    key = value.Period.filter((e: IDrop) => e.text == filValue)[0].key;
  }
  if (type == "Country" && value.Country.length) {
    key = value.Country.filter((e: IDrop) => e.text == filValue)[0].key;
  }
  if (type == "Type" && value.Type.length) {
    key = value.Type.filter((e: IDrop) => e.text == filValue)[0].key;
  }
  return key;
};

export { _getFilterDropValues };