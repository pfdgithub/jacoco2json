import { useState } from "react";
// import xmlText from "../assets/jacoco.xml?raw";
import xmlText from "../assets/sample.xml?raw";
import { analyseJSON, parseXML } from "../index";
import stl from "./index.module.css";

const Demo = () => {
  const [jacocoXML, setJaCoCoXML] = useState(xmlText);
  const [parsedJSON, setParsedJSON] = useState("");
  const [analysedJSON, setAnalysedJSON] = useState("");

  const handleParse = () => {
    const obj = parseXML(jacocoXML);
    setParsedJSON(JSON.stringify(obj, null, 2));
  };

  const handleAnalyse = () => {
    const obj = analyseJSON(JSON.parse(parsedJSON));
    setAnalysedJSON(JSON.stringify(obj, null, 2));
  };

  return (
    <div className={stl.demo}>
      <div className={stl.item}>
        <h1>JaCoCo XML</h1>
        <textarea
          value={jacocoXML}
          onChange={(e) => {
            setJaCoCoXML(e.target.value);
          }}
        />
      </div>
      <div className={stl.item}>
        <h1>
          Parsed JSON
          <button onClick={handleParse}>parse</button>
        </h1>
        <textarea
          value={parsedJSON}
          onChange={(e) => {
            setParsedJSON(e.target.value);
          }}
        />
      </div>
      <div className={stl.item}>
        <h1>
          Analysed JSON
          <button onClick={handleAnalyse}>analyse</button>
        </h1>
        <textarea
          value={analysedJSON}
          onChange={(e) => {
            setAnalysedJSON(e.target.value);
          }}
        />
      </div>
    </div>
  );
};

export default Demo;
