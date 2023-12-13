import { analyseJSON } from "./analyser";
import { parseXML } from "./parser";
import { JaCoCoOptions } from "./types";

export * from "./types";
export * from "./parser";
export * from "./analyser";
export * from "./utils";

export const jacoco2JSON = (xml: string, options?: JaCoCoOptions) => {
  const json = parseXML(xml, options);
  if (json) {
    return analyseJSON(json, options);
  }
};
