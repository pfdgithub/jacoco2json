import { FilterOptions } from "./types";

export type Nullable<T> = T | null | undefined;

export const truthy = <T>(
  value: T,
): value is Exclude<T, false | "" | 0 | null | undefined> => {
  return Boolean(value);
};

export const testText = (text?: string, options?: FilterOptions) => {
  const { include, exclude } = options || {};

  if (text && include) {
    const list = Array.isArray(include) ? include : [include];
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      const reg = item instanceof RegExp ? item : new RegExp(item);
      if (reg.test(text)) {
        return true;
      }
    }
  }

  if (text && exclude) {
    const list = Array.isArray(exclude) ? exclude : [exclude];
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      const reg = item instanceof RegExp ? item : new RegExp(item);
      if (reg.test(text)) {
        return false;
      }
    }
  }

  return true;
};

// #region name

const getShortTypeName = (type: string) => {
  const idx = type.lastIndexOf(".");
  const name = idx === -1 ? type : type.substring(idx + 1);

  return name.replaceAll("$", ".");
};

const isJavaIdentifierStart = (char: string) => {
  // https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Character.html#isJavaIdentifierStart(char)
  return /^[a-zA-Z$_\u0080-\uFFFF]/.test(char);
};

const isAnonymous = (vmname: string) => {
  const idx = vmname.lastIndexOf("$");

  if (idx === -1) {
    return false;
  }

  if (idx + 1 === vmname.length) {
    // shouldn't happen for classes compiled from Java source
    return false;
  }

  // assume non-identifier start character for anonymous classes
  const part = vmname.substring(idx + 1);
  return !isJavaIdentifierStart(part);
};

const field2Type = (field: string) => {
  // https://docs.oracle.com/javase/specs/jvms/se21/html/jvms-4.html#jvms-4.3
  if (field === "B") {
    return "byte";
  }
  if (field === "C") {
    return "char";
  }
  if (field === "D") {
    return "double";
  }
  if (field === "F") {
    return "float";
  }
  if (field === "I") {
    return "int";
  }
  if (field === "J") {
    return "long";
  }
  if (field === "S") {
    return "short";
  }
  if (field === "Z") {
    return "boolean";
  }
  if (field === "V") {
    return "void";
  }

  // Ljava/lang/String;
  const matched = field.match(/^L(.*);$/);
  if (matched) {
    // java/lang/String
    const classStr = matched[1];
    return classStr.replaceAll("/", ".");
  }

  return "";
};

const array2Type = (field: string) => {
  // [Ljava/lang/String;
  const matched = field.match(/^(\[*)(.*)$/);
  if (matched) {
    // [
    const dimeStr = matched[1];
    // Ljava/lang/String;
    const fieldStr = matched[2];

    return field2Type(fieldStr) + "[]".repeat(dimeStr.length);
  }

  return field2Type(field);
};

const descriptor2Type = (desc: string) => {
  // (BCDFIJSZLjava/lang/String;[B[[C)[Ljava/lang/String;
  const descMatched = desc.match(/^\((.*)\)(.*)$/);
  if (descMatched) {
    // BCDFIJSZLjava/lang/String;[B[[C
    const argStr = descMatched[1];
    // [Ljava/lang/String;
    const resStr = descMatched[2];

    let curr = "";
    const types: string[] = [];
    for (let i = 0; i < argStr.length; i++) {
      const char = argStr[i];
      curr += char;

      if (char === "[") {
        continue;
      }

      if (char === "L") {
        do {
          i++;
          curr += argStr[i];
        } while (argStr[i] !== ";");
      }

      const type = array2Type(curr);
      if (type) {
        types.push(type);
      }

      curr = "";
    }

    return {
      arguments: types,
      result: array2Type(resStr),
    };
  }
};

const getInnerClassName = (vmname: string) => {
  const idx = vmname.lastIndexOf("/");
  const name = idx === -1 ? vmname : vmname.substring(idx + 1);

  return name.replaceAll("$", ".");
};

const getInnerMethodName = (
  vmclassname: string,
  vmmethodname: string,
  vmdesc: string,
  qualifiedParams: boolean,
) => {
  // https://docs.oracle.com/javase/specs/jvms/se21/html/jvms-2.html#jvms-2.9
  if (vmmethodname === "<clinit>") {
    return "static {...}";
  }

  let result = "";
  if (vmmethodname === "<init>") {
    if (isAnonymous(vmclassname)) {
      return "{...}";
    } else {
      result += getClassName(vmclassname);
    }
  } else {
    result += vmmethodname;
  }

  result += "(";

  const types = descriptor2Type(vmdesc);
  if (types) {
    result += types.arguments
      .map((type) => {
        if (qualifiedParams) {
          return getQualifiedClassName(type);
        } else {
          return getShortTypeName(type);
        }
      })
      .join(", ");
  }

  result += ")";

  return result;
};

export const getPackageName = (vmname: string) => {
  if (vmname.length === 0) {
    return "default";
  }

  return vmname.replaceAll("/", ".");
};

export const getClassName = (
  vmname: string,
  vmsignature?: string,
  vmsuperclass?: string,
  vminterfaces?: string[],
) => {
  if (isAnonymous(vmname)) {
    let vmsupertype = "";

    if (vminterfaces?.length) {
      vmsupertype = vminterfaces[0];
    } else if (vmsuperclass) {
      vmsupertype = vmsuperclass;
    }

    // append Eclipse style label, e.g. "Foo.new Bar() {...}"
    if (vmsupertype) {
      const idx = vmname.lastIndexOf("$");
      const vmenclosing = vmname.substring(0, idx);
      const _vmenclosing = getInnerClassName(vmenclosing);
      const _vmsupertype = getInnerClassName(vmsupertype);
      return `${_vmenclosing}.new ${_vmsupertype}() {...}`;
    }
  }

  return getInnerClassName(vmname);
};

export const getQualifiedClassName = (vmname: string) => {
  return vmname.replaceAll("/", ".").replaceAll("$", ".");
};

export const getMethodName = (
  vmclassname: string,
  vmmethodname: string,
  vmdesc: string,
  // vmsignature?: string,
) => {
  return getInnerMethodName(vmclassname, vmmethodname, vmdesc, false);
};

export const getQualifiedMethodName = (
  vmclassname: string,
  vmmethodname: string,
  vmdesc: string,
  // vmsignature?: string,
) => {
  return (
    getQualifiedClassName(vmclassname) +
    "." +
    getInnerMethodName(vmclassname, vmmethodname, vmdesc, true)
  );
};

// #endregion
