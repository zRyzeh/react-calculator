import './App.css';
import { Button } from "./components/Button.tsx";
import { useState } from 'react';
import { evaluate } from "mathjs";

function App() {
  enum Parentheses {
    Open,
    Closed
  }
  const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
  const operators = ["+", "-", "×", "÷"]
  const operatorsCheck = /[+\-×÷]/g;
  const [procedure, setProcedure] = useState("");

  const parenthesesCount = (op: Parentheses, text: string) => {
    const characters = text.split("");
    return op === Parentheses.Open
      ? characters.filter(character => character === "(").length 
      : characters.filter(character => character === ")").length;
  };

  const verifyBtn = (btn: string) => {
    if (((procedure === "" || procedure === undefined) && btn === "=") || procedure === "Error") return "";

    if (["C", "⌦", "="].includes(btn)) {
      switch(btn) {
        case "C":
          return "";
        case "⌦":
          return procedure.slice(0, -1);
        case "=":
          let adjustedProcedure: string = procedure.replace(/[\(-]+$/, '')
          adjustedProcedure += ")".repeat(
            parenthesesCount(Parentheses.Open, adjustedProcedure) - 
            parenthesesCount(Parentheses.Closed, adjustedProcedure)
          );
          const calculation = evaluate(adjustedProcedure.replace(/×/g, "*").replace(/÷/g, "/"));
          
          return Number.isFinite(calculation)
            ? calculation.toString() 
            : "Error";
        default:
          return procedure
      }
    } else {
      const lastCharacter = procedure[procedure.length - 1]
      const separatedNumbers = procedure.split(operatorsCheck);
      const parenthesesOpen = parenthesesCount(Parentheses.Open, procedure);
      const parenthesesClosed = parenthesesCount(Parentheses.Closed, procedure);

      if (
        (operators.includes(lastCharacter) && btn === "(" || numbers.includes(lastCharacter) && btn == "(" || lastCharacter == "(" && btn == "(" || lastCharacter == undefined && btn == "(" || lastCharacter == ")" && btn == "(") || 
        ((!operators.includes(lastCharacter) && btn === ")") && (parenthesesOpen !== parenthesesClosed && lastCharacter !== "("))
      ) {
        return procedure + btn
      } else if (
        (lastCharacter === "(" && btn === "-") || 
        (lastCharacter === undefined && btn === "-") || 
        (lastCharacter === ")" && operators.includes(btn))
      ) {
        return procedure + btn
      } else if (
        (numbers.includes(lastCharacter) && btn === "(") || 
        (lastCharacter === "(" && operators.includes(btn)) || 
        (lastCharacter === ")" && numbers.includes(btn))
      ) {
        return procedure
      } else if (
        (!numbers.includes(lastCharacter) && !numbers.includes(btn)) || 
        (numbers.includes(lastCharacter) && (btn === "(" || btn === ")") && parenthesesOpen === parenthesesClosed)
      ) {
        return procedure
      } else if (separatedNumbers[separatedNumbers.length-1].includes(".") && btn === "."){
        return procedure
      }

      return procedure + btn
    }
  };

  const buttons = [
    { class: 'btn--dark', text: '(' },
    { class: 'btn--dark', text: ')' },
    { class: 'btn--dark btn--rotate', text: '⌦' },
    { class: 'btn--dark', text: '÷' },
    { class: 'btn--light', text: '7' },
    { class: 'btn--light', text: '8' },
    { class: 'btn--light', text: '9' },
    { class: 'btn--dark', text: '×' },
    { class: 'btn--light', text: '4' },
    { class: 'btn--light', text: '5' },
    { class: 'btn--light', text: '6' },
    { class: 'btn--dark', text: '-' },
    { class: 'btn--light', text: '1' },
    { class: 'btn--light', text: '2' },
    { class: 'btn--light', text: '3' },
    { class: 'btn--dark', text: '+' }, 
    { class: 'btn--light', text: '.' },
    { class: 'btn--light', text: '0' },
    { class: 'btn--light btn__text--red', text: 'C' },
    { class: 'btn--blue', text: '=' }
  ];

  return (
    <div className="main-container">
      <div className='calculator'>
        <div className='calculator__display'>
          <h1 className='calculator__procedure'>{procedure}</h1>
        </div>
        <div className='calculator__buttons'>
          {
            buttons.map((btn, indice) => {
              return(
                <Button 
                  key={`btn${indice + 1}`}
                  className={btn.class}
                  text={btn.text}
                  setProcedure={() => setProcedure(verifyBtn(btn.text))}
                />
              );
            })
          }
        </div>
      </div>
    </div>
  );
}

export default App;