import {
  IList,
  IYearListColumn,
  ICategoryListColumn,
  ICountryListColumn,
  IBudgetListColumn,
  IDistributionListColumn,
  IDistributionLibraryColumn,
  INave,
  IDropdowns,
  ICurBudgetItem,
  IBudgetValidation,
  IMasCategoryListColumn,
} from "../globalInterFace/BudgetInterFaces";

export namespace Config {
  /* Global List Names */
  export const ListNames: IList = {
    YearList: "Year List",
    MasterCategoryList: "Master Category List",
    CategoryList: "Category List",
    CountryList: "Country List",
    BudgetList: "Budget List",
    DistributionList: "Distribution List",
    DistributionLibrary: "DistributionLibrary",
  };

  /* Global Year List Column Names */
  export const YearListColumns: IYearListColumn = {
    Title: "Title",
  };

  /* Global Year List Column Names */
  export const masCategoryListColumns: IMasCategoryListColumn = {
    Title: "Title",
  };

  /* Global Category List Column Names */
  export const CategoryListColumns: ICategoryListColumn = {
    Title: "Title",
    Year: "Year",
    Country: "Country",
    CategoryType: "CategoryType",
    OverAllBudgetCost: "OverAllBudgetCost",
    OverAllPOIssuedCost: "OverAllPOIssuedCost",
    OverAllRemainingCost: "OverAllRemainingCost",
  };

  /* Global Country List Column Names */
  export const CountryListColumns: ICountryListColumn = {
    Title: "Title",
    Admin: "Admin",
  };

  /* Global Budget List Column Names */
  export const BudgetListColumns: IBudgetListColumn = {
    CategoryId: "CategoryId",
    YearId: "YearId",
    CountryId: "CountryId",
    CategoryType: "CategoryType",
    BudgetAllocated: "BudgetAllocated",
    BudgetProposed: "BudgetProposed",
    Used: "Used",
    ApproveStatus: "ApproveStatus",
    Description: "Description",
    RemainingCost: "RemainingCost",
    isDeleted: "isDeleted",
  };

  /* Global Category List Column Names */
  export const DistributionListColumns: IDistributionListColumn = {
    Vendor: "Vendor",
    Description: "Description",
    Pricing: "Pricing",
    PaymentTerms: "PaymentTerms",
    LastYearCost: "LastYearCost",
    PO: "PO",
    Supplier: "Supplier",
    RequestedAmount: "RequestedAmount",
    Status: "Status",
    isDeleted: "isDeleted",
    EntryDate: "EntryDate",
    StartingDate: "StartingDate",
    ToDate: "ToDate",
    Cost: "Cost",
    PoCurrency: "PoCurrency",
    InvoiceNo: "InvoiceNo",
  };

  /* Global Category List Column Names */
  export const DistributionLibraryColumns: IDistributionLibraryColumn = {
    Title: "Title",
    Distribution: "Distribution",
  };

  /* Global Navigation Names */
  export const Navigation: INave = {
    Dashboard: "Dashboard",
    BudgetCategory: "BudgetCategory",
    CategoryConfig: "CategoryConfig",
    BudgetPlanning: "Budget Planning",
    BudgetAnalysis: "Budget Analysis",
    BudgetDistribution: "Budget Distribution",
    BudgetTrackingList: "Budget Tracking List",
  };

  /* Global Dropdowns Names */
  export const dropdownValues: IDropdowns = {
    Period: [],
    Country: [],
    Type: [],
  };

  /* Global of current budget items names */
  export const curBudgetItem: ICurBudgetItem = {
    Category: "",
    Year: "",
    Type: "",
    Country: "",
    ApproveStatus: "",
    Description: "",
    ID: null,
    CateId: null,
    CounId: null,
    YearId: null,
    BudgetAllocated: null,
    BudgetProposed: null,
    Used: null,
    RemainingCost: null,
    isDeleted: false,
    isEdit: false,
    isDummy: false,
  };

  /* Global of Budget valiation items names */
  export const budgetValidation: IBudgetValidation = {
    isDescription: false,
    isBudgetAllocated: false,
  };
}
