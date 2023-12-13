import {
  AnalyseOptions,
  BaseNode,
  ClassAnalysis,
  ClassNode,
  CounterItem,
  CounterNode,
  GroupAnalysis,
  GroupNode,
  LineAnalysis,
  LineNode,
  MethodAnalysis,
  MethodNode,
  PackageAnalysis,
  PackageNode,
  ReportAnalysis,
  ReportNode,
  SessioninfoAnalysis,
  SessioninfoNode,
  SourcefileAnalysis,
  SourcefileNode,
} from "./types";
import {
  getClassName,
  getMethodName,
  getPackageName,
  Nullable,
  testText,
  truthy,
} from "./utils";

const calcCoverStatus = (missed = 0, covered = 0) => {
  if (missed > 0 && covered > 0) {
    return "PARTLY" as const;
  } else if (covered > 0) {
    return "FULLY" as const;
  } else if (missed > 0) {
    return "NOT" as const;
  }
};

const calcCounterValue = (missed = 0, covered = 0) => {
  const total = missed + covered;

  return {
    totalCount: total,
    missedCount: missed,
    coveredCount: covered,
    missedRatio: total > 0 ? missed / total : undefined,
    coveredRatio: total > 0 ? covered / total : undefined,
  };
};

const calcCounterItem = (nodes: CounterNode[], options?: AnalyseOptions) => {
  const { filterCounter } = options || {};
  if (filterCounter === true) {
    return;
  }

  const map = {
    INSTRUCTION: "instruction",
    BRANCH: "branch",
    COMPLEXITY: "complexity",
    LINE: "line",
    METHOD: "method",
    CLASS: "class",
  } as const;

  return nodes.reduce((prev, item) => {
    const { type, missed, covered } = item.attributes || {};

    if (!testText(type, filterCounter)) {
      return prev;
    }

    const prop = type && map[type];
    if (prop) {
      prev[prop] = calcCounterValue(missed, covered);
    }

    return prev;
  }, {} as CounterItem);
};

const filterAndCalcCounterItem = (
  nodes?: BaseNode[],
  options?: AnalyseOptions,
) => {
  const list = nodes?.filter(
    ({ nodeName }) => nodeName === "counter",
  ) as Nullable<CounterNode[]>;

  if (!list?.length) {
    return;
  }

  return calcCounterItem(list, options);
};

const analyseLine = (parentNode: SourcefileNode, options?: AnalyseOptions) => {
  const { filterLine } = options || {};
  if (filterLine === true) {
    return;
  }

  const { name: parentName } = parentNode.attributes || {};
  const list = parentNode.childNodes?.filter(
    ({ nodeName }) => nodeName === "line",
  ) as Nullable<LineNode[]>;

  if (!list?.length) {
    return;
  }

  const items = list
    .map((item) => {
      const { nr, mi, ci, mb, cb } = item.attributes || {};

      if (!testText(nr?.toString(), filterLine)) {
        return;
      }

      return {
        nr,
        mi,
        ci,
        mb,
        cb,
        instructionStatus: calcCoverStatus(mi, ci),
        branchStatus: calcCoverStatus(mb, cb),
      };
    })
    .filter(truthy);

  const analysis: LineAnalysis = {
    type: "line",
    parent: parentName,
    items,
  };

  return analysis;
};

const analyseSourcefile = (
  parentNode: PackageNode,
  options?: AnalyseOptions,
) => {
  const { filterChildless, filterSourcefile } = options || {};
  if (filterSourcefile === true) {
    return;
  }

  const { name: parentName } = parentNode.attributes || {};
  const list = parentNode.childNodes?.filter(
    ({ nodeName }) => nodeName === "sourcefile",
  ) as Nullable<SourcefileNode[]>;

  if (!list?.length) {
    return;
  }

  const items = list
    .map((item) => {
      const { name } = item.attributes || {};

      if (!testText(name, filterSourcefile)) {
        return;
      }

      const children = [];
      const lineChild = analyseLine(item);
      if (lineChild) {
        children.push(lineChild);
      }

      if (filterChildless && !children.length) {
        return;
      }

      return {
        name,
        counter: filterAndCalcCounterItem(item.childNodes),
        children: children.length ? children : undefined,
      };
    })
    .filter(truthy);

  let parentPackageName = parentName;
  if (parentName) {
    parentPackageName = getPackageName(parentName);
  }

  const analysis: SourcefileAnalysis = {
    type: "sourcefile",
    parent: parentPackageName,
    total: filterAndCalcCounterItem(parentNode.childNodes),
    items,
  };

  return analysis;
};

const analyseMethod = (parentNode: ClassNode, options?: AnalyseOptions) => {
  const { filterMethod } = options || {};
  if (filterMethod === true) {
    return;
  }

  const { name: parentName, sourcefilename: parentSourcefilename } =
    parentNode.attributes || {};
  const list = parentNode.childNodes?.filter(
    ({ nodeName }) => nodeName === "method",
  ) as Nullable<MethodNode[]>;

  if (!list?.length) {
    return;
  }

  const items = list
    .map((item) => {
      const { name, desc, line } = item.attributes || {};

      if (!testText(name, filterMethod)) {
        return;
      }

      let methodName = name;
      if (parentName && name && desc) {
        methodName = getMethodName(parentName, name, desc);
      }

      return {
        name: methodName,
        counter: filterAndCalcCounterItem(item.childNodes),
        line,
        filename: parentSourcefilename,
      };
    })
    .filter(truthy);

  let parentClassName = parentName;
  if (parentName) {
    parentClassName = getClassName(parentName);
  }

  const analysis: MethodAnalysis = {
    type: "method",
    parent: parentClassName,
    total: filterAndCalcCounterItem(parentNode.childNodes),
    items,
  };

  return analysis;
};

const analyseClass = (parentNode: PackageNode, options?: AnalyseOptions) => {
  const { filterChildless, filterClass } = options || {};
  if (filterClass === true) {
    return;
  }

  const { name: parentName } = parentNode.attributes || {};
  const list = parentNode.childNodes?.filter(
    ({ nodeName }) => nodeName === "class",
  ) as Nullable<ClassNode[]>;

  if (!list?.length) {
    return;
  }

  const items = list
    .map((item) => {
      const { name, sourcefilename } = item.attributes || {};

      if (!testText(name, filterClass)) {
        return;
      }

      const children = [];
      const methodChild = analyseMethod(item);
      if (methodChild) {
        children.push(methodChild);
      }

      if (filterChildless && !children.length) {
        return;
      }

      let className = name;
      if (name) {
        className = getClassName(name);
      }

      return {
        name: className,
        counter: filterAndCalcCounterItem(item.childNodes),
        filename: sourcefilename,
        children: children.length ? children : undefined,
      };
    })
    .filter(truthy);

  let parentPackageName = parentName;
  if (parentName) {
    parentPackageName = getPackageName(parentName);
  }

  const analysis: ClassAnalysis = {
    type: "class",
    parent: parentPackageName,
    total: filterAndCalcCounterItem(parentNode.childNodes),
    items,
  };

  return analysis;
};

const analysePackage = (
  parentNode: ReportNode | GroupNode,
  options?: AnalyseOptions,
) => {
  const { filterChildless, filterPackage } = options || {};
  if (filterPackage === true) {
    return;
  }

  const { name: parentName } = parentNode.attributes || {};
  const list = parentNode.childNodes?.filter(
    ({ nodeName }) => nodeName === "package",
  ) as Nullable<PackageNode[]>;

  if (!list?.length) {
    return;
  }

  const items = list
    .map((item) => {
      const { name } = item.attributes || {};

      if (!testText(name, filterPackage)) {
        return;
      }

      const children = [];
      const classChild = analyseClass(item);
      const sourcefileChild = analyseSourcefile(item);
      if (classChild) {
        children.push(classChild);
      }
      if (sourcefileChild) {
        children.push(sourcefileChild);
      }

      if (filterChildless && !children.length) {
        return;
      }

      let packageName = name;
      if (name) {
        packageName = getPackageName(name);
      }

      return {
        name: packageName,
        counter: filterAndCalcCounterItem(item.childNodes),
        children: children.length ? children : undefined,
      };
    })
    .filter(truthy);

  const analysis: PackageAnalysis = {
    type: "package",
    parent: parentName,
    total: filterAndCalcCounterItem(parentNode.childNodes),
    items,
  };

  return analysis;
};

const analyseGroup = (
  parentNode: ReportNode | GroupNode,
  options?: AnalyseOptions,
) => {
  const { filterChildless, filterGroup } = options || {};
  if (filterGroup === true) {
    return;
  }

  const { name: parentName } = parentNode.attributes || {};
  const list = parentNode.childNodes?.filter(
    ({ nodeName }) => nodeName === "group",
  ) as Nullable<GroupNode[]>;

  if (!list?.length) {
    return;
  }

  const items = list
    .map((item) => {
      const { name } = item.attributes || {};

      if (!testText(name, filterGroup)) {
        return;
      }

      const children = [];
      const groupChild = analyseGroup(item);
      const packageChild = analysePackage(item);
      if (groupChild) {
        children.push(groupChild);
      }
      if (packageChild) {
        children.push(packageChild);
      }

      if (filterChildless && !children.length) {
        return;
      }

      return {
        name,
        counter: filterAndCalcCounterItem(item.childNodes),
        children: children.length ? children : undefined,
      };
    })
    .filter(truthy);

  const analysis: GroupAnalysis = {
    type: "group",
    parent: parentName,
    total: filterAndCalcCounterItem(parentNode.childNodes),
    items,
  };

  return analysis;
};

const analyseSessioninfo = (
  parentNode: ReportNode,
  options?: AnalyseOptions,
) => {
  const { filterSessioninfo } = options || {};
  if (filterSessioninfo === true) {
    return;
  }

  const { name: parentName } = parentNode.attributes || {};
  const list = parentNode.childNodes?.filter(
    ({ nodeName }) => nodeName === "sessioninfo",
  ) as Nullable<SessioninfoNode[]>;

  if (!list?.length) {
    return;
  }

  const items = list
    .map((item) => {
      const { id, start, dump } = item.attributes || {};

      if (!testText(id, filterSessioninfo)) {
        return;
      }

      return {
        id,
        start,
        dump,
      };
    })
    .filter(truthy);

  const analysis: SessioninfoAnalysis = {
    type: "sessioninfo",
    parent: parentName,
    items,
  };

  return analysis;
};

export const analyseJSON = (json: ReportNode, options?: AnalyseOptions) => {
  const sessioninfoChild = analyseSessioninfo(json, options);
  const groupChild = analyseGroup(json, options);
  const packageChild = analysePackage(json, options);

  const analysis: ReportAnalysis = {
    type: "report",
    sessioninfo: sessioninfoChild,
    group: groupChild,
    package: packageChild,
  };

  return analysis;
};
