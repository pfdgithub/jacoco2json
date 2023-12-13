// #region Node

export type CounterType =
  | "INSTRUCTION"
  | "BRANCH"
  | "COMPLEXITY"
  | "LINE"
  | "METHOD"
  | "CLASS";

export interface BaseNode {
  nodeName?: string;
  attributes?: Record<string, any>;
  childNodes?: BaseNode[];
}

export interface CounterNode<T = CounterType> extends BaseNode {
  nodeName: "counter";
  attributes?: {
    type?: T;
    missed?: number;
    covered?: number;
  };
}

export interface LineNode extends BaseNode {
  nodeName: "line";
  attributes?: {
    /** line number */
    nr?: number;
    /** missed instruction */
    mi?: number;
    /** covered instruction */
    ci?: number;
    /** missed branch */
    mb?: number;
    /** covered branch */
    cb?: number;
  };
}

export interface SourcefileNode extends BaseNode {
  nodeName: "sourcefile";
  attributes?: {
    name?: string;
  };
  childNodes?: (LineNode | CounterNode)[];
}

export interface MethodNode extends BaseNode {
  nodeName: "method";
  attributes?: {
    name?: string;
    desc?: string;
    line?: number;
  };
  childNodes?: CounterNode<Omit<CounterType, "CLASS">>[];
}

export interface ClassNode extends BaseNode {
  nodeName: "class";
  attributes?: {
    name?: string;
    sourcefilename?: string;
  };
  childNodes?: (MethodNode | CounterNode)[];
}

export interface PackageNode extends BaseNode {
  nodeName: "package";
  attributes?: {
    name?: string;
  };
  childNodes?: (ClassNode | SourcefileNode | CounterNode)[];
}

export interface GroupNode extends BaseNode {
  nodeName: "group";
  attributes?: {
    name?: string;
  };
  childNodes?: (GroupNode | PackageNode | CounterNode)[];
}

export interface SessioninfoNode extends BaseNode {
  nodeName: "sessioninfo";
  attributes?: {
    id?: string;
    start?: number;
    dump?: number;
  };
}

export interface ReportNode extends BaseNode {
  nodeName: "report";
  attributes?: {
    name?: string;
  };
  childNodes?: (SessioninfoNode | GroupNode | PackageNode | CounterNode)[];
}

// #endregion

// #region Analysis

export type CoverStatus = "NOT" | "FULLY" | "PARTLY";

export interface CounterValue {
  totalCount?: number;
  missedCount?: number;
  coveredCount?: number;
  missedRatio?: number;
  coveredRatio?: number;
}

export interface CounterItem {
  instruction?: CounterValue;
  branch?: CounterValue;
  complexity?: CounterValue;
  line?: CounterValue;
  method?: CounterValue;
  class?: CounterValue;
}

export interface AnalysisItem {
  name?: string;
  counter?: CounterItem;
}

export interface BaseAnalysis {
  type?: string;
  parent?: string;
  items?: Record<string, any>[];
}

export interface LineAnalysis extends BaseAnalysis {
  type: "line";
  items?: (LineNode["attributes"] & {
    instructionStatus?: CoverStatus;
    branchStatus?: CoverStatus;
  })[];
}

export interface SourcefileAnalysis extends BaseAnalysis {
  type: "sourcefile";
  total?: CounterItem;
  items?: (AnalysisItem & {
    children?: LineAnalysis[];
  })[];
}

export interface MethodAnalysis extends BaseAnalysis {
  type: "method";
  total?: CounterItem;
  items?: (AnalysisItem & {
    line?: number;
    filename?: string;
  })[];
}

export interface ClassAnalysis extends BaseAnalysis {
  type: "class";
  total?: CounterItem;
  items?: (AnalysisItem & {
    filename?: string;
    children?: MethodAnalysis[];
  })[];
}

export interface PackageAnalysis extends BaseAnalysis {
  type: "package";
  total?: CounterItem;
  items?: (AnalysisItem & {
    children?: (ClassAnalysis | SourcefileAnalysis)[];
  })[];
}

export interface GroupAnalysis extends BaseAnalysis {
  type: "group";
  total?: CounterItem;
  items?: (AnalysisItem & {
    children?: (GroupAnalysis | PackageAnalysis)[];
  })[];
}

export interface SessioninfoAnalysis extends BaseAnalysis {
  type: "sessioninfo";
  items?: (SessioninfoNode["attributes"] & {
    //
  })[];
}

export interface ReportAnalysis {
  type: "report";
  sessioninfo?: SessioninfoAnalysis;
  group?: GroupAnalysis;
  package?: PackageAnalysis;
}

// #endregion

// #region Options

export type FilterRule = (string | RegExp) | (string | RegExp)[];

export interface FilterOptions {
  /** allow List */
  include?: FilterRule;
  /** block list */
  exclude?: FilterRule;
}

export interface JaCoCoOptions {
  /**
   * true: ignore childless node / analysis
   */
  filterChildless?: true;
  /**
   * true: ignore counter node / analysis
   * {}: filter counter type
   */
  filterCounter?: true | FilterOptions;
  /**
   * true: ignore line node / analysis
   * {}: filter line number
   */
  filterLine?: true | FilterOptions;
  /**
   * true: ignore sourcefile node / analysis
   * {}: filter sourcefile name
   */
  filterSourcefile?: true | FilterOptions;
  /**
   * true: ignore method node / analysis
   * {}: filter method name
   */
  filterMethod?: true | FilterOptions;
  /**
   * true: ignore class node / analysis
   * {}: filter class name
   */
  filterClass?: true | FilterOptions;
  /**
   * true: ignore package node / analysis
   * {}: filter package name
   */
  filterPackage?: true | FilterOptions;
  /**
   * true: ignore group node / analysis
   * {}: filter group name
   */
  filterGroup?: true | FilterOptions;
  /**
   * true: ignore sessioninfo node / analysis
   * {}: filter sessioninfo id
   */
  filterSessioninfo?: true | FilterOptions;
}

export interface ParseOptions extends JaCoCoOptions {}

export interface AnalyseOptions extends JaCoCoOptions {}

// #endregion
