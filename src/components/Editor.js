import React, { useEffect } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/lib/codemirror.js";
import "codemirror/theme/dracula.css";
import "codemirror/mode/clike/clike.js";
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
const Editor = () => {
  useEffect(() => {
    async function init() {
     Codemirror.fromTextArea(document.getElementById("realTimeEditor"), {
       mode: "text/x-c++src",
       theme: "dracula",
       autoCloseTags: true,
       autoCloseBrackets: true,
       lineNumbers: true,
     });
    }
    init();
  }, [])
  return (
    <>
      <div className="editor-header">
        <select id="languages" defaultValue="Choose">
          <option value="c++">C++</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
        </select>
      </div>
      <textarea id="realTimeEditor" className="editor"></textarea>
      <div className="editor-footer">
       
      </div>
    </>
  );
};

export default Editor;
