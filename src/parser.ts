import {
  ClassNode,
  CounterNode,
  CounterType,
  GroupNode,
  LineNode,
  MethodNode,
  PackageNode,
  ParseOptions,
  ReportNode,
  SessioninfoNode,
  SourcefileNode,
} from "./types";
import { testText } from "./utils";

const parserCounter = (parentEle: Element, options?: ParseOptions) => {
  const { filterCounter } = options || {};
  if (filterCounter === true) {
    return;
  }

  const eleList = parentEle.querySelectorAll(":scope > counter");
  if (!eleList.length) {
    return;
  }

  const nodeList: CounterNode[] = [];
  eleList.forEach((ele) => {
    const attr = ele.attributes;
    const type = attr.getNamedItem("type")?.value;
    const missed = attr.getNamedItem("missed")?.value;
    const covered = attr.getNamedItem("covered")?.value;

    if (!testText(type, filterCounter)) {
      return;
    }

    nodeList.push({
      nodeName: "counter",
      attributes: {
        type: type as CounterType,
        missed: missed ? parseInt(missed) : undefined,
        covered: covered ? parseInt(covered) : undefined,
      },
    });
  });

  return nodeList;
};

const parserLine = (parentEle: Element, options?: ParseOptions) => {
  const { filterLine } = options || {};
  if (filterLine === true) {
    return;
  }

  const eleList = parentEle.querySelectorAll(":scope > line");
  if (!eleList.length) {
    return;
  }

  const nodeList: LineNode[] = [];
  eleList.forEach((ele) => {
    const attr = ele.attributes;
    const nr = attr.getNamedItem("nr")?.value;
    const mi = attr.getNamedItem("mi")?.value;
    const ci = attr.getNamedItem("ci")?.value;
    const mb = attr.getNamedItem("mb")?.value;
    const cb = attr.getNamedItem("cb")?.value;

    if (!testText(nr, filterLine)) {
      return;
    }

    nodeList.push({
      nodeName: "line",
      attributes: {
        nr: nr ? parseInt(nr) : undefined,
        mi: mi ? parseInt(mi) : undefined,
        ci: ci ? parseInt(ci) : undefined,
        mb: mb ? parseInt(mb) : undefined,
        cb: cb ? parseInt(cb) : undefined,
      },
    });
  });

  return nodeList;
};

const parserSourcefile = (parentEle: Element, options?: ParseOptions) => {
  const { filterChildless, filterSourcefile } = options || {};
  if (filterSourcefile === true) {
    return;
  }

  const eleList = parentEle.querySelectorAll(":scope > sourcefile");
  if (!eleList.length) {
    return;
  }

  const nodeList: SourcefileNode[] = [];
  eleList.forEach((ele) => {
    const attr = ele.attributes;
    const name = attr.getNamedItem("name")?.value;

    if (!testText(name, filterSourcefile)) {
      return;
    }

    const counterNodes = parserCounter(ele, options);
    const lineNodes = parserLine(ele, options);
    const childNodes = [...(counterNodes || []), ...(lineNodes || [])];

    if (filterChildless && !childNodes.length) {
      return;
    }

    nodeList.push({
      nodeName: "sourcefile",
      attributes: {
        name,
      },
      childNodes,
    });
  });

  return nodeList;
};

const parserMethod = (parentEle: Element, options?: ParseOptions) => {
  const { filterChildless, filterMethod } = options || {};
  if (filterMethod === true) {
    return;
  }

  const eleList = parentEle.querySelectorAll(":scope > method");
  if (!eleList.length) {
    return;
  }

  const nodeList: MethodNode[] = [];
  eleList.forEach((ele) => {
    const attr = ele.attributes;
    const name = attr.getNamedItem("name")?.value;
    const desc = attr.getNamedItem("desc")?.value;
    const line = attr.getNamedItem("line")?.value;

    if (!testText(name, filterMethod)) {
      return;
    }

    const counterNodes = parserCounter(ele, options);
    const childNodes = [...(counterNodes || [])];

    if (filterChildless && !childNodes.length) {
      return;
    }

    nodeList.push({
      nodeName: "method",
      attributes: {
        name,
        desc,
        line: line ? parseInt(line) : undefined,
      },
      childNodes,
    });
  });

  return nodeList;
};

const parserClass = (parentEle: Element, options?: ParseOptions) => {
  const { filterChildless, filterClass } = options || {};
  if (filterClass === true) {
    return;
  }

  const eleList = parentEle.querySelectorAll(":scope > class");
  if (!eleList.length) {
    return;
  }

  const nodeList: ClassNode[] = [];
  eleList.forEach((ele) => {
    const attr = ele.attributes;
    const name = attr.getNamedItem("name")?.value;
    const sourcefilename = attr.getNamedItem("sourcefilename")?.value;

    if (!testText(name, filterClass)) {
      return;
    }

    const counterNodes = parserCounter(ele, options);
    const methodNodes = parserMethod(ele, options);
    const childNodes = [...(counterNodes || []), ...(methodNodes || [])];

    if (filterChildless && !childNodes.length) {
      return;
    }

    nodeList.push({
      nodeName: "class",
      attributes: {
        name,
        sourcefilename,
      },
      childNodes,
    });
  });

  return nodeList;
};

const parserPackage = (parentEle: Element, options?: ParseOptions) => {
  const { filterChildless, filterPackage } = options || {};
  if (filterPackage === true) {
    return;
  }

  const eleList = parentEle.querySelectorAll(":scope > package");
  if (!eleList.length) {
    return;
  }

  const nodeList: PackageNode[] = [];
  eleList.forEach((ele) => {
    const attr = ele.attributes;
    const name = attr.getNamedItem("name")?.value;

    if (!testText(name, filterPackage)) {
      return;
    }

    const counterNodes = parserCounter(ele, options);
    const classNodes = parserClass(ele, options);
    const sourcefileNodes = parserSourcefile(ele, options);
    const childNodes = [
      ...(counterNodes || []),
      ...(classNodes || []),
      ...(sourcefileNodes || []),
    ];

    if (filterChildless && !childNodes.length) {
      return;
    }

    nodeList.push({
      nodeName: "package",
      attributes: {
        name,
      },
      childNodes,
    });
  });

  return nodeList;
};

const parserGroup = (parentEle: Element, options?: ParseOptions) => {
  const { filterChildless, filterGroup } = options || {};
  if (filterGroup === true) {
    return;
  }

  const eleList = parentEle.querySelectorAll(":scope > group");
  if (!eleList.length) {
    return;
  }

  const nodeList: GroupNode[] = [];
  eleList.forEach((ele) => {
    const attr = ele.attributes;
    const name = attr.getNamedItem("name")?.value;

    if (!testText(name, filterGroup)) {
      return;
    }

    const counterNodes = parserCounter(ele, options);
    const groupNodes = parserGroup(ele, options);
    const packageNodes = parserPackage(ele, options);
    const childNodes = [
      ...(counterNodes || []),
      ...(groupNodes || []),
      ...(packageNodes || []),
    ];

    if (filterChildless && !childNodes.length) {
      return;
    }

    nodeList.push({
      nodeName: "group",
      attributes: {
        name,
      },
      childNodes,
    });
  });

  return nodeList;
};

const parserSessioninfo = (parentEle: Element, options?: ParseOptions) => {
  const { filterSessioninfo } = options || {};
  if (filterSessioninfo === true) {
    return;
  }

  const eleList = parentEle.querySelectorAll(":scope > sessioninfo");
  if (!eleList.length) {
    return;
  }

  const nodeList: SessioninfoNode[] = [];
  eleList.forEach((ele) => {
    const attr = ele.attributes;
    const id = attr.getNamedItem("id")?.value;
    const start = attr.getNamedItem("start")?.value;
    const dump = attr.getNamedItem("dump")?.value;

    if (!testText(id, filterSessioninfo)) {
      return;
    }

    nodeList.push({
      nodeName: "sessioninfo",
      attributes: {
        id,
        start: start ? parseInt(start) : undefined,
        dump: dump ? parseInt(dump) : undefined,
      },
    });
  });

  return nodeList;
};

const parserReport = (doc: Document, options?: ParseOptions) => {
  const ele = doc.querySelector("report");
  if (!ele) {
    return;
  }

  const attr = ele.attributes;
  const name = attr.getNamedItem("name")?.value;

  const sessioninfoNodes = parserSessioninfo(ele, options);
  const counterNodes = parserCounter(ele, options);
  const groupNodes = parserGroup(ele, options);
  const packageNodes = parserPackage(ele, options);
  const childNodes = [
    ...(sessioninfoNodes || []),
    ...(counterNodes || []),
    ...(groupNodes || []),
    ...(packageNodes || []),
  ];

  if (!sessioninfoNodes && !childNodes.length) {
    return;
  }

  const node: ReportNode = {
    nodeName: "report",
    attributes: {
      name,
    },
    childNodes,
  };

  return node;
};

export const parseXML = (xml: string, options?: ParseOptions) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "application/xml");

  const errorElement = doc.querySelector("parsererror");
  if (errorElement) {
    throw new Error(errorElement.textContent || errorElement.nodeName, {
      cause: errorElement,
    });
  }

  return parserReport(doc, options);
};
