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
  IGroupUsers,
  IGroupNames,
  IAreaName,
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
    Area: "Area",
  };

  /* Global Category List Column Names */
  export const CategoryListColumns: ICategoryListColumn = {
    ID: "ID",
    Title: "Title",
    Year: "YearId",
    Country: "CountryId",
    CategoryType: "CategoryType",
    OverAllBudgetCost: "OverAllBudgetCost",
    OverAllPOIssuedCost: "OverAllPOIssuedCost",
    OverAllRemainingCost: "OverAllRemainingCost",
    isDeleted: "isDeleted",
    MasterCategory: "MasterCategoryId",
    Area: "Area",
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
    Comments: "Comments",
    Area: "Area",
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
    Dashboard: "dashboard",
    Country: "country",
    BudgetCategory: "budgetcategory",
    CategoryConfig: "categoryconfig",
    BudgetPlanning: "budgetplanning",
    BudgetAnalysis: "budgetanalysis",
    BudgetDistribution: "budgetdistribution",
    BudgetTrackingList: "budgettrackinglist",
  };

  /* Global Dropdowns Names */
  export const dropdownValues: IDropdowns = {
    Period: [],
    Country: [],
    Type: [],
    masterCate: [],
    ctgryDropOptions: [],
    Area: [],
  };

  /* Global of current budget items names */
  export const curBudgetItem: ICurBudgetItem = {
    Category: "",
    Year: "",
    Type: "",
    Country: "",
    ApproveStatus: "",
    Description: "",
    Comments: "",
    Area: "",
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

  export const GroupUsers: IGroupUsers = {
    isSuperAdmin: false,
    isInfraAdmin: false,
    isInfraManager: false,
    isEnterpricesAdmin: false,
    isEnterpricesManager: false,
    isSpecialAdmin: false,
    isSpecialManager: false,
  };

  export const GroupNames: IGroupNames = {
    SuperAdmin: "Super Admin",
    InfraAdmin: "Infra Admin",
    InfraManger: "Infra Manger",
    EnterpricesAdmin: "Enterprices Admin",
    EnterpricesManager: "Enterprices Manager",
    SpecialAdmin: "Special Admin",
    SpecialManager: "Special Manager",
  };

  export const AreaName: IAreaName = {
    InfraStructure: "Infra Structure",
    EnterpriseApplication: "Enterprise Application",
    SpecialProject: "Special Project",
  };
}
