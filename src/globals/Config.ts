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
  IMasCategoryItems,
  IGroupUsers,
  IGroupNames,
  IAreaName,
  IVendorDetail,
  IVendorProp,
  IVendorItems,
  IApprovalStatus,
  ITrackSelectedItem,
} from "../globalInterFace/BudgetInterFaces";

export namespace Config {
  /* Global List Names */
  export const ListNames: IList = {
    AdminList: "Admin List",
    VendorList: "Vendor List",
    YearList: "Year List",
    MasterCategoryList: "Master Category List",
    CategoryList: "Category List",
    CountryList: "Country List",
    BudgetList: "Budget List",
    DistributionList: "Distribution List",
    DistributionLibrary: "DistributionLibrary",
    MasterCategoryBackupList: "Master Category Backup List",
  };

  /* Global Year List Column Names */
  export const YearListColumns: IYearListColumn = {
    Title: "Title",
  };

  /* Global Year List Column Names */
  export const masCategoryListColumns: IMasCategoryItems = {
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
    VendorCreate: "vendor",
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
    Vendor: [],
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
    isAdmin: false,
    isManager: false,
    isApproved: false,
  };

  /* Global of Budget valiation items names */
  export const budgetValidation: IBudgetValidation = {
    isDescription: false,
    isBudgetRequired: false,
  };

  export const GroupUsers: IGroupUsers = {
    isSuperAdmin: false,
    isInfraAdmin: false,
    isInfraManager: false,
    isEnterpricesAdmin: false,
    isEnterpricesManager: false,
    isSpecialAdmin: false,
    isSpecialManager: false,
    isSuperAdminView:false,
  };

  export const GroupNames: IGroupNames = {
    SuperAdmin: "Super Admin",
    InfraAdmin: "Infra Admin",
    InfraManger: "Infra Manger",
    EnterpricesAdmin: "Enterprices Admin",
    EnterpricesManager: "Enterprices Manager",
    SpecialAdmin: "Special Admin",
    SpecialManager: "Special Manager",
    SuperAdminView: "Super Admin View",
    Director: "Director"
  };

  export const AreaName: IAreaName = {
    InfraStructure: "Infra Structure",
    EnterpriseApplication: "Enterprise Application",
    SpecialProject: "Special Project",
  };

  export const VendorDetail: IVendorDetail = {
    ID: "ID",
    VendorId: "VendorId",
    Vendor: "Vendor",
    LastYearCost: "LastYearCost",
    PO: "PO",
    Supplier: "Supplier",
  };

  export const VendorProp: IVendorProp = {
    isVendor: true,
    isAdmin: false,
    Item: curBudgetItem,
  };

  export const Vendor: IVendorItems = {
    ID: null,
    Vendor: "",
    Description: "",
    Pricing: 0,
    PaymentTerms: "",
    LastYearCost: "",
    PO: "",
    Supplier: "",
    Attachment: [],
    Procurement: [],
    RequestedAmount: "",
    BudgetId: null,
    isDummy: true,
    isEdit: false,
    AttachmentURL: [],
    ProcurementURL: [],
    Status: "",
    isClick: false,
  };
  export const vendorValidation = {
    Vendor: false,
    Description: false,
    Pricing: false,
  };

  export const ApprovalStatus: IApprovalStatus = {
    NotStarted: "Not Started",
    Pending: "Pending",
    Rejected: "Rejected",
    Approved: "Approved",
  };

  export const TrackSelectedItem: ITrackSelectedItem = {
    ID: null,
    StartDate: null,
    ToDate: null,
    Po: "",
    PoCurrency: "",
    InvoiceNo: "",
  };
}
