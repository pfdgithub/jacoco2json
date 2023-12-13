import { useState } from "react";
// import xmlText from "../assets/jacoco.xml?raw";
import xmlText from "../assets/sample.xml?raw";
import { jacoco2JSON, parseXML } from "../index";
import stl from "./index.module.css";

const Demo = () => {
  const [xml, setXML] = useState(xmlText);
  const [json, setJSON] = useState("");

  const handleParse = () => {
    const obj = parseXML(xml);
    setJSON(JSON.stringify(obj, null, 2));
  };

  const handleAnalyse = () => {
    const obj = jacoco2JSON(xml);
    setJSON(JSON.stringify(obj, null, 2));
  };

  return (
    <div className={stl.demo}>
      <h1>XML</h1>
      <textarea
        value={xml}
        onChange={(e) => {
          setXML(e.target.value);
        }}
      />
      <h1>
        JSON
        <button onClick={handleParse}>parse</button>
        <button onClick={handleAnalyse}>analyse</button>
      </h1>
      <textarea
        value={json}
        onChange={(e) => {
          setJSON(e.target.value);
        }}
      />
    </div>
  );
};

export default Demo;
