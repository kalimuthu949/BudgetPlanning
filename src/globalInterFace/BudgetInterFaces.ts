/* Interface of List Names */
export interface IList {
  AdminList: string;
  VendorList: string;
  YearList: string;
  MasterCategoryList: string;
  CategoryList: string;
  CountryList: string;
  BudgetList: string;
  DistributionList: string;
  DistributionLibrary: string;
  MasterCategoryBackupList: string;
}

/* Interface of Year List Column */
export interface IYearListColumn {
  Title: string;
}

/* Interface of master category List Column */
export interface IMasCategoryItems {
  Title: string;
  Area: string;
}

/* Interface of Category List Column */
export interface ICategoryListColumn {
  ID: string;
  Title: string;
  Year: string;
  Country: string;
  CategoryType: string;
  OverAllBudgetCost: string;
  OverAllPOIssuedCost: string;
  OverAllRemainingCost: string;
  isDeleted: string;
  MasterCategory: string;
  Area: string;
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
  Comments: string;
  Area: string;
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
  Country: string;
  VendorCreate: string;
  BudgetCategory: string;
  CategoryConfig: string;
  BudgetPlanning: string;
  BudgetAnalysis: string;
  BudgetDistribution: string;
  BudgetTrackingList: string;
}

/* Interface of Dropdown */
export interface IDrop {
  ID?: number;
  key: number;
  text: string;
  Area?: string;
}

/* Interface of Dropdown */
export interface IDropdowns {
  Period: IDrop[];
  Country: IDrop[];
  Type: IDrop[];
  masterCate: IDrop[];
  ctgryDropOptions: IDrop[];
  Area: IDrop[];
  Vendor: IDrop[];
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
  Area: string;
  ID: number;
  OverAllBudgetCost: number;
  TotalProposed: number;
  Status?: string;
  CategoryType?: string;
  OverAllPOIssuedCost?: number;
  OverAllRemainingCost?: number;
  isAdmin?: boolean;
  isManager?: boolean;
}

/* Interface of current budget items */
export interface ICurBudgetItem {
  Category: string;
  Country: string;
  Year: string;
  Type: string;
  ApproveStatus: string;
  Description: string;
  Comments: string;
  Area: string;
  ID: number;
  CateId: number;
  CounId: number;
  YearId: number;
  BudgetAllocated: number | string;
  BudgetProposed: number | string;
  Used: number;
  RemainingCost: number;
  isDeleted: Boolean;
  isEdit: Boolean;
  isDummy: Boolean;
  CategoryType?: string;
  isAdmin?: boolean;
  isManager?: boolean;
  isApproved?: boolean;
  OverAllBudgetCost?: number;
  OverAllPOIssuedCost?: number;
  OverAllRemainingCost?: number;
}

/* Interface of over all items */
export interface IOverAllItem {
  CategoryAcc: string;
  YearAcc: string;
  CountryAcc: string;
  Type: string;
  Area: string;
  ID: number;
  yearID: number;
  countryID: number;
  OverAllBudgetCost: number;
  OverAllPOIssuedCost: number;
  OverAllRemainingCost: number;
  TotalProposed: number;
  Status?: string;
  CategoryType?: string;
  isAdmin?: boolean;
  isManager?: boolean;
  subCategory: ICurBudgetItem[];
}

/* Interface of Budget planning validation items */
export interface IBudgetValidation {
  isDescription: boolean;
  isBudgetRequired: boolean;
  isBudgetAllocated: boolean;
}

/* Interface of Pagination items */
export interface IPaginationObj {
  displayitems: any[];
  currentPage: number;
}

/* Interface of Master category items */
export interface ICategory {
  Title: string;
  Year: string;
  Country: string;
  CategoryType: string;
  Area: string;
  MasCateTitle: string;
  ID: number;
  MasCateID: number;
}

/* Interface of category insert items */
export interface INewCate {
  Title: string;
  CategoryType: string;
  Area: string;
  ID?: number;
  MasterCategory: number;
  CountryId: number;
  YearId: number;
}

/* Interface of current budget analysis */
export interface ICurBudgetAnalysis {
  Category: string;
  Country: string;
  Year: string;
  Type: string;
  Area: string;
  ID: number;
  Total: number;
  PropsedTotal: number;
  isEdit: boolean;
}

/* Interface of edit budget analysis */
export interface IEdit {
  authendication: boolean;
  id: number;
  data: number;
}

// Vendor page interface
export interface IVendorItems {
  ID: number;
  Vendor: string;
  Description: string;
  PaymentTerms: string;
  LastYearCost: string;
  PO: string;
  Supplier: string;
  RequestedAmount: string;
  Status: string;
  Attachment: any[];
  Procurement: any[];
  BudgetId: number;
  Pricing: number | string;
  isDummy: boolean;
  isEdit: boolean;
  isClick: boolean;
  AttachmentURL: string[];
  ProcurementURL: string[];
}

export interface IApprovalStatus {
  NotStarted: string;
  Pending: string;
  Rejected: string;
  Approved: string;
}

// Interface for gruop authendication
export interface IGroupUsers {
  isSuperAdmin: boolean;
  isInfraAdmin: boolean;
  isInfraManager: boolean;
  isEnterpricesAdmin: boolean;
  isEnterpricesManager: boolean;
  isSpecialAdmin: boolean;
  isSpecialManager: boolean;
  isSuperAdminView: boolean;
}

export interface IGroupNames {
  SuperAdmin: string;
  InfraAdmin: string;
  InfraManger: string;
  EnterpricesAdmin: string;
  EnterpricesManager: string;
  SpecialAdmin: string;
  SpecialManager: string;
  SuperAdminView: string;
  Director: string;
}

// Interface for area names
export interface IAreaName {
  InfraStructure: string;
  EnterpriseApplication: string;
  SpecialProject: string;
}

// Vendor validation
export interface IVendorValidation {
  Vendor: boolean;
  Description: boolean;
  Pricing: boolean;
}

// interface of vendor details
export interface IVendorDetail {
  ID: string;
  VendorId: string;
  Vendor: string;
  LastYearCost: string;
  PO: string;
  Supplier: string;
}

// admin group user details
export interface IUserDetail {
  ID: number;
  imageUrl: any;
  text: string;
  secondaryText: string;
}

// vendor details
export interface IVendorProp {
  isVendor: boolean;
  isAdmin: boolean;
  Item: ICurBudgetItem;
}

// Interface of butget track dis
export interface IBudTrackDistribution {
  ID: Number;
  Cost: number | string;
  BudgetId: Number;
  isClick: boolean;
  isEdit: boolean;
  Vendor: string;
  Po: string;
  PoCurrency: string;
  InvoiceNo: string;
  StartDate: Date;
  EntryDate: Date;
  ToDate: Date;
  Area: string;
  Item?: string;
  Type?: string;
  Category?: string;
  CateId?: number;
  OverAllBudgetCost?: number;
  OverAllPOIssuedCost?: number;
  OverAllRemainingCost?: number;
}

// Interface of over all butget track dis
export interface IOverAllTrackItem {
  CategoryAcc: string;
  YearAcc: string;
  CountryAcc: string;
  Type: string;
  Area: string;
  ID: number;
  yearID: number;
  countryID: number;
  OverAllBudgetCost: number;
  OverAllPOIssuedCost: number;
  OverAllRemainingCost: number;
  TotalProposed: number;
  isMasterClick?: boolean;
  VendorDetails: IBudTrackDistribution[];
}

// Interface of selected Items
export interface ITrackSelectedItem {
  ID: Number;
  StartDate: Date;
  ToDate: Date;
  Po: string;
  PoCurrency: string;
  InvoiceNo: string;
}

export interface ITrackUpdateItem {
  StartingDate: Date | string;
  ToDate: Date | string;
  PO: string;
  PoCurrency: string;
  InvoiceNo: string;
}
