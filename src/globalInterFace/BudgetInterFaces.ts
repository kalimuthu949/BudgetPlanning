/* Interface of List Names */
export interface IList {
  YearList: string;
  MasterCategoryList: string;
  CategoryList: string;
  CountryList: string;
  BudgetList: string;
  DistributionList: string;
  DistributionLibrary: string;
}

/* Interface of Year List Column */
export interface IYearListColumn {
  Title: string;
}

/* Interface of master category List Column */
export interface IMasCategoryListColumn {
  Title: string;
}

/* Interface of Category List Column */
export interface ICategoryListColumn {
  Title: string;
  Year: string;
  Country: string;
  CategoryType: string;
  OverAllBudgetCost: string;
  OverAllPOIssuedCost: string;
  OverAllRemainingCost: string;
}

/* Interface of Country List Column */
export interface ICountryListColumn {
  Title: string;
  Admin: string;
}

/* Interface of Budget List Column */
export interface IBudgetListColumn {
  CategoryId: string | number;
  YearId: string | number;
  CountryId: string | number;
  CategoryType: string;
  BudgetAllocated: string;
  BudgetProposed: string;
  Used: string;
  ApproveStatus: string;
  Description: string;
  RemainingCost: string;
  isDeleted: string;
}

/* Interface of Distribution List Column */
export interface IDistributionListColumn {
  Vendor: string;
  Description: string;
  Pricing: string;
  PaymentTerms: string;
  LastYearCost: string;
  PO: string;
  Supplier: string;
  RequestedAmount: string;
  Status: string;
  isDeleted: string;
  EntryDate: string;
  StartingDate: string;
  ToDate: string;
  Cost: string;
  PoCurrency: string;
  InvoiceNo: string;
}

/* Interface of Distribution Library Column */
export interface IDistributionLibraryColumn {
  Title: string;
  Distribution: string;
}

/* Interface of Navigation Names */
export interface INave {
  Dashboard: string;
  BudgetCategory: string;
  CategoryConfig: string;
  BudgetPlanning: string;
  BudgetAnalysis: string;
  BudgetDistribution: string;
  BudgetTrackingList: string;
}

/* Interface of Dropdown */
export interface IDrop {
  key: number;
  text: string;
}

/* Interface of Dropdown */
export interface IDropdowns {
  Period: IDrop[];
  Country: IDrop[];
  Type: IDrop[];
}

/* Interface of lookup obj */
export interface ILookup {
  ID: number;
  Text: string;
}

/* Interface of current category items */
export interface ICurCategoryItem {
  CategoryAcc: ILookup;
  YearAcc: ILookup;
  CountryAcc: ILookup;
  Type: string;
  ID: number;
}

/* Interface of current budget items */
export interface ICurBudgetItem {
  Category: string;
  Country: string;
  Year: string;
  Type: string;
  ApproveStatus: string;
  Description: string;
  ID: number;
  CateId: number;
  CounId: number;
  YearId: number;
  BudgetAllocated: number;
  BudgetProposed: number;
  Used: number;
  RemainingCost: number;
  isDeleted: Boolean;
  isEdit: Boolean;
  isDummy: Boolean;
}

/* Interface of over all items */
export interface IOverAllItem {
  CategoryAcc: string;
  YearAcc: string;
  CountryAcc: string;
  Type: string;
  ID: number;
  yearID: number;
  countryID: number;
  subCategory: ICurBudgetItem[];
}

/* Interface of Budget planning validation items */
export interface IBudgetValidation {
  isDescription: boolean;
  isBudgetAllocated: boolean;
}

/* Interface of Pagination items */
export interface IPaginationObj {
  displayitems: any[];
  currentPage: number;
}
