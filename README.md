# jacoco2json

JaCoCo JSON Parser

- Sessioninfo
- Group(nest)
- Package
- Class
- Method
- Sourcefile
- Line
- Counter

# API

## jacoco2JSON(xml: string, options?: JaCoCoOptions): ReportAnalysis

Call the `parseXML` and `analyseJSON` methods in sequence.

## parseXML(xml: string, options?: ParseOptions): ReportNode

Refer to the [XML Coverage Report](https://www.jacoco.org/jacoco/trunk/coverage/jacoco.xml) file, keep the original structure, and parse XML into JSON.

## analyseJSON(json: ReportNode, options?: AnalyseOptions): ReportAnalysis

Refer to the [HTML Coverage Report](https://www.jacoco.org/jacoco/trunk/coverage/index.html) file to analyse the parsed JSON.

# [Demo](./src/Demo/)

```javascript
import { analyseJSON, jacoco2JSON, parseXML } from "jacoco2json";

const analysedJSON = jacoco2JSON(xml);

// or

const parsedJSON = parseXML(xml);
if (parsedJSON) {
  const analysedJSON = analyseJSON(parsedJSON);
}
```

# Links

https://github.com/jacoco/jacoco/wiki/UsageTipsAndTricks#group-your-reports  
https://github.com/jacoco/jacoco/blob/master/org.jacoco.report/src/org/jacoco/report/JavaNames.java  
https://github.com/jacoco/jacoco/blob/master/org.jacoco.report.test/src/org/jacoco/report/JavaNamesTest.java  
https://github.com/jacoco/jacoco/blob/master/org.jacoco.report.test/src/org/jacoco/report/xml/XMLFormatterTest.java  
https://docs.oracle.com/javase/specs/jvms/se21/html/jvms-2.html#jvms-2.9  
https://docs.oracle.com/javase/specs/jvms/se21/html/jvms-4.html#jvms-4.3

# Sample

<details>
<summary>JaCoCo XML</summary>

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<!DOCTYPE report PUBLIC "-//JACOCO//DTD Report 1.1//EN" "report.dtd">
<report name="JaCoCo">
  <sessioninfo id="org.jacoco.core.test" start="1699565277294" dump="1699565280093" />
  <group name="org.jacoco.core">
    <package name="org/jacoco/core/tools">
      <class name="org/jacoco/core/tools/ExecFileLoader" sourcefilename="ExecFileLoader.java">
        <method name="&lt;init&gt;" desc="()V" line="42">
          <counter type="INSTRUCTION" missed="0" covered="13" />
          <counter type="LINE" missed="0" covered="4" />
          <counter type="COMPLEXITY" missed="0" covered="1" />
          <counter type="METHOD" missed="0" covered="1" />
        </method>
        <counter type="INSTRUCTION" missed="0" covered="93" />
        <counter type="BRANCH" missed="1" covered="1" />
        <counter type="LINE" missed="0" covered="28" />
        <counter type="COMPLEXITY" missed="1" covered="7" />
        <counter type="METHOD" missed="0" covered="7" />
        <counter type="CLASS" missed="0" covered="1" />
      </class>
      <sourcefile name="ExecDumpClient.java">
        <line nr="38" mi="0" ci="2" mb="0" cb="0" />
        <counter type="INSTRUCTION" missed="7" covered="115" />
        <counter type="BRANCH" missed="0" covered="4" />
        <counter type="LINE" missed="4" covered="38" />
        <counter type="COMPLEXITY" missed="2" covered="11" />
        <counter type="METHOD" missed="2" covered="9" />
        <counter type="CLASS" missed="0" covered="1" />
      </sourcefile>
      <counter type="INSTRUCTION" missed="7" covered="208" />
      <counter type="BRANCH" missed="1" covered="5" />
      <counter type="LINE" missed="4" covered="66" />
      <counter type="COMPLEXITY" missed="3" covered="18" />
      <counter type="METHOD" missed="2" covered="16" />
      <counter type="CLASS" missed="0" covered="2" />
    </package>
    <counter type="INSTRUCTION" missed="411" covered="14111" />
    <counter type="BRANCH" missed="101" covered="1304" />
    <counter type="LINE" missed="122" covered="3337" />
    <counter type="COMPLEXITY" missed="121" covered="1326" />
    <counter type="METHOD" missed="20" covered="703" />
    <counter type="CLASS" missed="2" covered="140" />
  </group>
  <counter type="INSTRUCTION" missed="1431" covered="26657" />
  <counter type="BRANCH" missed="160" covered="2092" />
  <counter type="LINE" missed="366" covered="6172" />
  <counter type="COMPLEXITY" missed="226" covered="2452" />
  <counter type="METHOD" missed="76" covered="1444" />
  <counter type="CLASS" missed="15" covered="288" />
</report>
```

</details>

<details>
<summary>Parsed JSON</summary>

```json
{
  "nodeName": "report",
  "attributes": {
    "name": "JaCoCo"
  },
  "childNodes": [
    {
      "nodeName": "sessioninfo",
      "attributes": {
        "id": "org.jacoco.core.test",
        "start": 1699565277294,
        "dump": 1699565280093
      }
    },
    {
      "nodeName": "counter",
      "attributes": {
        "type": "INSTRUCTION",
        "missed": 1431,
        "covered": 26657
      }
    },
    {
      "nodeName": "counter",
      "attributes": {
        "type": "BRANCH",
        "missed": 160,
        "covered": 2092
      }
    },
    {
      "nodeName": "counter",
      "attributes": {
        "type": "LINE",
        "missed": 366,
        "covered": 6172
      }
    },
    {
      "nodeName": "counter",
      "attributes": {
        "type": "COMPLEXITY",
        "missed": 226,
        "covered": 2452
      }
    },
    {
      "nodeName": "counter",
      "attributes": {
        "type": "METHOD",
        "missed": 76,
        "covered": 1444
      }
    },
    {
      "nodeName": "counter",
      "attributes": {
        "type": "CLASS",
        "missed": 15,
        "covered": 288
      }
    },
    {
      "nodeName": "group",
      "attributes": {
        "name": "org.jacoco.core"
      },
      "childNodes": [
        {
          "nodeName": "counter",
          "attributes": {
            "type": "INSTRUCTION",
            "missed": 411,
            "covered": 14111
          }
        },
        {
          "nodeName": "counter",
          "attributes": {
            "type": "BRANCH",
            "missed": 101,
            "covered": 1304
          }
        },
        {
          "nodeName": "counter",
          "attributes": {
            "type": "LINE",
            "missed": 122,
            "covered": 3337
          }
        },
        {
          "nodeName": "counter",
          "attributes": {
            "type": "COMPLEXITY",
            "missed": 121,
            "covered": 1326
          }
        },
        {
          "nodeName": "counter",
          "attributes": {
            "type": "METHOD",
            "missed": 20,
            "covered": 703
          }
        },
        {
          "nodeName": "counter",
          "attributes": {
            "type": "CLASS",
            "missed": 2,
            "covered": 140
          }
        },
        {
          "nodeName": "package",
          "attributes": {
            "name": "org/jacoco/core/tools"
          },
          "childNodes": [
            {
              "nodeName": "counter",
              "attributes": {
                "type": "INSTRUCTION",
                "missed": 7,
                "covered": 208
              }
            },
            {
              "nodeName": "counter",
              "attributes": {
                "type": "BRANCH",
                "missed": 1,
                "covered": 5
              }
            },
            {
              "nodeName": "counter",
              "attributes": {
                "type": "LINE",
                "missed": 4,
                "covered": 66
              }
            },
            {
              "nodeName": "counter",
              "attributes": {
                "type": "COMPLEXITY",
                "missed": 3,
                "covered": 18
              }
            },
            {
              "nodeName": "counter",
              "attributes": {
                "type": "METHOD",
                "missed": 2,
                "covered": 16
              }
            },
            {
              "nodeName": "counter",
              "attributes": {
                "type": "CLASS",
                "missed": 0,
                "covered": 2
              }
            },
            {
              "nodeName": "class",
              "attributes": {
                "name": "org/jacoco/core/tools/ExecFileLoader",
                "sourcefilename": "ExecFileLoader.java"
              },
              "childNodes": [
                {
                  "nodeName": "counter",
                  "attributes": {
                    "type": "INSTRUCTION",
                    "missed": 0,
                    "covered": 93
                  }
                },
                {
                  "nodeName": "counter",
                  "attributes": {
                    "type": "BRANCH",
                    "missed": 1,
                    "covered": 1
                  }
                },
                {
                  "nodeName": "counter",
                  "attributes": {
                    "type": "LINE",
                    "missed": 0,
                    "covered": 28
                  }
                },
                {
                  "nodeName": "counter",
                  "attributes": {
                    "type": "COMPLEXITY",
                    "missed": 1,
                    "covered": 7
                  }
                },
                {
                  "nodeName": "counter",
                  "attributes": {
                    "type": "METHOD",
                    "missed": 0,
                    "covered": 7
                  }
                },
                {
                  "nodeName": "counter",
                  "attributes": {
                    "type": "CLASS",
                    "missed": 0,
                    "covered": 1
                  }
                },
                {
                  "nodeName": "method",
                  "attributes": {
                    "name": "<init>",
                    "desc": "()V",
                    "line": 42
                  },
                  "childNodes": [
                    {
                      "nodeName": "counter",
                      "attributes": {
                        "type": "INSTRUCTION",
                        "missed": 0,
                        "covered": 13
                      }
                    },
                    {
                      "nodeName": "counter",
                      "attributes": {
                        "type": "LINE",
                        "missed": 0,
                        "covered": 4
                      }
                    },
                    {
                      "nodeName": "counter",
                      "attributes": {
                        "type": "COMPLEXITY",
                        "missed": 0,
                        "covered": 1
                      }
                    },
                    {
                      "nodeName": "counter",
                      "attributes": {
                        "type": "METHOD",
                        "missed": 0,
                        "covered": 1
                      }
                    }
                  ]
                }
              ]
            },
            {
              "nodeName": "sourcefile",
              "attributes": {
                "name": "ExecDumpClient.java"
              },
              "childNodes": [
                {
                  "nodeName": "counter",
                  "attributes": {
                    "type": "INSTRUCTION",
                    "missed": 7,
                    "covered": 115
                  }
                },
                {
                  "nodeName": "counter",
                  "attributes": {
                    "type": "BRANCH",
                    "missed": 0,
                    "covered": 4
                  }
                },
                {
                  "nodeName": "counter",
                  "attributes": {
                    "type": "LINE",
                    "missed": 4,
                    "covered": 38
                  }
                },
                {
                  "nodeName": "counter",
                  "attributes": {
                    "type": "COMPLEXITY",
                    "missed": 2,
                    "covered": 11
                  }
                },
                {
                  "nodeName": "counter",
                  "attributes": {
                    "type": "METHOD",
                    "missed": 2,
                    "covered": 9
                  }
                },
                {
                  "nodeName": "counter",
                  "attributes": {
                    "type": "CLASS",
                    "missed": 0,
                    "covered": 1
                  }
                },
                {
                  "nodeName": "line",
                  "attributes": {
                    "nr": 38,
                    "mi": 0,
                    "ci": 2,
                    "mb": 0,
                    "cb": 0
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

</details>

<details>
<summary>Analysed JSON</summary>

```json
{
  "type": "report",
  "sessioninfo": {
    "type": "sessioninfo",
    "parent": "JaCoCo",
    "items": [
      {
        "id": "org.jacoco.core.test",
        "start": 1699565277294,
        "dump": 1699565280093
      }
    ]
  },
  "group": {
    "type": "group",
    "parent": "JaCoCo",
    "total": {
      "instruction": {
        "totalCount": 28088,
        "missedCount": 1431,
        "coveredCount": 26657,
        "missedRatio": 0.050947023639988605,
        "coveredRatio": 0.9490529763600114
      },
      "branch": {
        "totalCount": 2252,
        "missedCount": 160,
        "coveredCount": 2092,
        "missedRatio": 0.07104795737122557,
        "coveredRatio": 0.9289520426287744
      },
      "line": {
        "totalCount": 6538,
        "missedCount": 366,
        "coveredCount": 6172,
        "missedRatio": 0.0559804221474457,
        "coveredRatio": 0.9440195778525543
      },
      "complexity": {
        "totalCount": 2678,
        "missedCount": 226,
        "coveredCount": 2452,
        "missedRatio": 0.08439133681852129,
        "coveredRatio": 0.9156086631814787
      },
      "method": {
        "totalCount": 1520,
        "missedCount": 76,
        "coveredCount": 1444,
        "missedRatio": 0.05,
        "coveredRatio": 0.95
      },
      "class": {
        "totalCount": 303,
        "missedCount": 15,
        "coveredCount": 288,
        "missedRatio": 0.04950495049504951,
        "coveredRatio": 0.9504950495049505
      }
    },
    "items": [
      {
        "name": "org.jacoco.core",
        "counter": {
          "instruction": {
            "totalCount": 14522,
            "missedCount": 411,
            "coveredCount": 14111,
            "missedRatio": 0.02830188679245283,
            "coveredRatio": 0.9716981132075472
          },
          "branch": {
            "totalCount": 1405,
            "missedCount": 101,
            "coveredCount": 1304,
            "missedRatio": 0.07188612099644127,
            "coveredRatio": 0.9281138790035587
          },
          "line": {
            "totalCount": 3459,
            "missedCount": 122,
            "coveredCount": 3337,
            "missedRatio": 0.035270309337958945,
            "coveredRatio": 0.9647296906620411
          },
          "complexity": {
            "totalCount": 1447,
            "missedCount": 121,
            "coveredCount": 1326,
            "missedRatio": 0.08362128541810643,
            "coveredRatio": 0.9163787145818936
          },
          "method": {
            "totalCount": 723,
            "missedCount": 20,
            "coveredCount": 703,
            "missedRatio": 0.027662517289073305,
            "coveredRatio": 0.9723374827109267
          },
          "class": {
            "totalCount": 142,
            "missedCount": 2,
            "coveredCount": 140,
            "missedRatio": 0.014084507042253521,
            "coveredRatio": 0.9859154929577465
          }
        },
        "children": [
          {
            "type": "package",
            "parent": "org.jacoco.core",
            "total": {
              "instruction": {
                "totalCount": 14522,
                "missedCount": 411,
                "coveredCount": 14111,
                "missedRatio": 0.02830188679245283,
                "coveredRatio": 0.9716981132075472
              },
              "branch": {
                "totalCount": 1405,
                "missedCount": 101,
                "coveredCount": 1304,
                "missedRatio": 0.07188612099644127,
                "coveredRatio": 0.9281138790035587
              },
              "line": {
                "totalCount": 3459,
                "missedCount": 122,
                "coveredCount": 3337,
                "missedRatio": 0.035270309337958945,
                "coveredRatio": 0.9647296906620411
              },
              "complexity": {
                "totalCount": 1447,
                "missedCount": 121,
                "coveredCount": 1326,
                "missedRatio": 0.08362128541810643,
                "coveredRatio": 0.9163787145818936
              },
              "method": {
                "totalCount": 723,
                "missedCount": 20,
                "coveredCount": 703,
                "missedRatio": 0.027662517289073305,
                "coveredRatio": 0.9723374827109267
              },
              "class": {
                "totalCount": 142,
                "missedCount": 2,
                "coveredCount": 140,
                "missedRatio": 0.014084507042253521,
                "coveredRatio": 0.9859154929577465
              }
            },
            "items": [
              {
                "name": "org.jacoco.core.tools",
                "counter": {
                  "instruction": {
                    "totalCount": 215,
                    "missedCount": 7,
                    "coveredCount": 208,
                    "missedRatio": 0.03255813953488372,
                    "coveredRatio": 0.9674418604651163
                  },
                  "branch": {
                    "totalCount": 6,
                    "missedCount": 1,
                    "coveredCount": 5,
                    "missedRatio": 0.16666666666666666,
                    "coveredRatio": 0.8333333333333334
                  },
                  "line": {
                    "totalCount": 70,
                    "missedCount": 4,
                    "coveredCount": 66,
                    "missedRatio": 0.05714285714285714,
                    "coveredRatio": 0.9428571428571428
                  },
                  "complexity": {
                    "totalCount": 21,
                    "missedCount": 3,
                    "coveredCount": 18,
                    "missedRatio": 0.14285714285714285,
                    "coveredRatio": 0.8571428571428571
                  },
                  "method": {
                    "totalCount": 18,
                    "missedCount": 2,
                    "coveredCount": 16,
                    "missedRatio": 0.1111111111111111,
                    "coveredRatio": 0.8888888888888888
                  },
                  "class": {
                    "totalCount": 2,
                    "missedCount": 0,
                    "coveredCount": 2,
                    "missedRatio": 0,
                    "coveredRatio": 1
                  }
                },
                "children": [
                  {
                    "type": "class",
                    "parent": "org.jacoco.core.tools",
                    "total": {
                      "instruction": {
                        "totalCount": 215,
                        "missedCount": 7,
                        "coveredCount": 208,
                        "missedRatio": 0.03255813953488372,
                        "coveredRatio": 0.9674418604651163
                      },
                      "branch": {
                        "totalCount": 6,
                        "missedCount": 1,
                        "coveredCount": 5,
                        "missedRatio": 0.16666666666666666,
                        "coveredRatio": 0.8333333333333334
                      },
                      "line": {
                        "totalCount": 70,
                        "missedCount": 4,
                        "coveredCount": 66,
                        "missedRatio": 0.05714285714285714,
                        "coveredRatio": 0.9428571428571428
                      },
                      "complexity": {
                        "totalCount": 21,
                        "missedCount": 3,
                        "coveredCount": 18,
                        "missedRatio": 0.14285714285714285,
                        "coveredRatio": 0.8571428571428571
                      },
                      "method": {
                        "totalCount": 18,
                        "missedCount": 2,
                        "coveredCount": 16,
                        "missedRatio": 0.1111111111111111,
                        "coveredRatio": 0.8888888888888888
                      },
                      "class": {
                        "totalCount": 2,
                        "missedCount": 0,
                        "coveredCount": 2,
                        "missedRatio": 0,
                        "coveredRatio": 1
                      }
                    },
                    "items": [
                      {
                        "name": "ExecFileLoader",
                        "counter": {
                          "instruction": {
                            "totalCount": 93,
                            "missedCount": 0,
                            "coveredCount": 93,
                            "missedRatio": 0,
                            "coveredRatio": 1
                          },
                          "branch": {
                            "totalCount": 2,
                            "missedCount": 1,
                            "coveredCount": 1,
                            "missedRatio": 0.5,
                            "coveredRatio": 0.5
                          },
                          "line": {
                            "totalCount": 28,
                            "missedCount": 0,
                            "coveredCount": 28,
                            "missedRatio": 0,
                            "coveredRatio": 1
                          },
                          "complexity": {
                            "totalCount": 8,
                            "missedCount": 1,
                            "coveredCount": 7,
                            "missedRatio": 0.125,
                            "coveredRatio": 0.875
                          },
                          "method": {
                            "totalCount": 7,
                            "missedCount": 0,
                            "coveredCount": 7,
                            "missedRatio": 0,
                            "coveredRatio": 1
                          },
                          "class": {
                            "totalCount": 1,
                            "missedCount": 0,
                            "coveredCount": 1,
                            "missedRatio": 0,
                            "coveredRatio": 1
                          }
                        },
                        "filename": "ExecFileLoader.java",
                        "children": [
                          {
                            "type": "method",
                            "parent": "ExecFileLoader",
                            "total": {
                              "instruction": {
                                "totalCount": 93,
                                "missedCount": 0,
                                "coveredCount": 93,
                                "missedRatio": 0,
                                "coveredRatio": 1
                              },
                              "branch": {
                                "totalCount": 2,
                                "missedCount": 1,
                                "coveredCount": 1,
                                "missedRatio": 0.5,
                                "coveredRatio": 0.5
                              },
                              "line": {
                                "totalCount": 28,
                                "missedCount": 0,
                                "coveredCount": 28,
                                "missedRatio": 0,
                                "coveredRatio": 1
                              },
                              "complexity": {
                                "totalCount": 8,
                                "missedCount": 1,
                                "coveredCount": 7,
                                "missedRatio": 0.125,
                                "coveredRatio": 0.875
                              },
                              "method": {
                                "totalCount": 7,
                                "missedCount": 0,
                                "coveredCount": 7,
                                "missedRatio": 0,
                                "coveredRatio": 1
                              },
                              "class": {
                                "totalCount": 1,
                                "missedCount": 0,
                                "coveredCount": 1,
                                "missedRatio": 0,
                                "coveredRatio": 1
                              }
                            },
                            "items": [
                              {
                                "name": "ExecFileLoader()",
                                "counter": {
                                  "instruction": {
                                    "totalCount": 13,
                                    "missedCount": 0,
                                    "coveredCount": 13,
                                    "missedRatio": 0,
                                    "coveredRatio": 1
                                  },
                                  "line": {
                                    "totalCount": 4,
                                    "missedCount": 0,
                                    "coveredCount": 4,
                                    "missedRatio": 0,
                                    "coveredRatio": 1
                                  },
                                  "complexity": {
                                    "totalCount": 1,
                                    "missedCount": 0,
                                    "coveredCount": 1,
                                    "missedRatio": 0,
                                    "coveredRatio": 1
                                  },
                                  "method": {
                                    "totalCount": 1,
                                    "missedCount": 0,
                                    "coveredCount": 1,
                                    "missedRatio": 0,
                                    "coveredRatio": 1
                                  }
                                },
                                "line": 42,
                                "filename": "ExecFileLoader.java"
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "type": "sourcefile",
                    "parent": "org.jacoco.core.tools",
                    "total": {
                      "instruction": {
                        "totalCount": 215,
                        "missedCount": 7,
                        "coveredCount": 208,
                        "missedRatio": 0.03255813953488372,
                        "coveredRatio": 0.9674418604651163
                      },
                      "branch": {
                        "totalCount": 6,
                        "missedCount": 1,
                        "coveredCount": 5,
                        "missedRatio": 0.16666666666666666,
                        "coveredRatio": 0.8333333333333334
                      },
                      "line": {
                        "totalCount": 70,
                        "missedCount": 4,
                        "coveredCount": 66,
                        "missedRatio": 0.05714285714285714,
                        "coveredRatio": 0.9428571428571428
                      },
                      "complexity": {
                        "totalCount": 21,
                        "missedCount": 3,
                        "coveredCount": 18,
                        "missedRatio": 0.14285714285714285,
                        "coveredRatio": 0.8571428571428571
                      },
                      "method": {
                        "totalCount": 18,
                        "missedCount": 2,
                        "coveredCount": 16,
                        "missedRatio": 0.1111111111111111,
                        "coveredRatio": 0.8888888888888888
                      },
                      "class": {
                        "totalCount": 2,
                        "missedCount": 0,
                        "coveredCount": 2,
                        "missedRatio": 0,
                        "coveredRatio": 1
                      }
                    },
                    "items": [
                      {
                        "name": "ExecDumpClient.java",
                        "counter": {
                          "instruction": {
                            "totalCount": 122,
                            "missedCount": 7,
                            "coveredCount": 115,
                            "missedRatio": 0.05737704918032787,
                            "coveredRatio": 0.9426229508196722
                          },
                          "branch": {
                            "totalCount": 4,
                            "missedCount": 0,
                            "coveredCount": 4,
                            "missedRatio": 0,
                            "coveredRatio": 1
                          },
                          "line": {
                            "totalCount": 42,
                            "missedCount": 4,
                            "coveredCount": 38,
                            "missedRatio": 0.09523809523809523,
                            "coveredRatio": 0.9047619047619048
                          },
                          "complexity": {
                            "totalCount": 13,
                            "missedCount": 2,
                            "coveredCount": 11,
                            "missedRatio": 0.15384615384615385,
                            "coveredRatio": 0.8461538461538461
                          },
                          "method": {
                            "totalCount": 11,
                            "missedCount": 2,
                            "coveredCount": 9,
                            "missedRatio": 0.18181818181818182,
                            "coveredRatio": 0.8181818181818182
                          },
                          "class": {
                            "totalCount": 1,
                            "missedCount": 0,
                            "coveredCount": 1,
                            "missedRatio": 0,
                            "coveredRatio": 1
                          }
                        },
                        "children": [
                          {
                            "type": "line",
                            "parent": "ExecDumpClient.java",
                            "items": [
                              {
                                "nr": 38,
                                "mi": 0,
                                "ci": 2,
                                "mb": 0,
                                "cb": 0,
                                "instructionStatus": "FULLY"
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}
```

</details>
