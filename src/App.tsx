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

  const parenthesesCount = (op: Parentheses) => {
    const characters = procedure.split("");
    return op === Parentheses.Open
      ? characters.filter(character => character === "(").length 
      : characters.filter(character => character === ")").length;
  };

  const verifyBtn = (btn: string) => {
    if (((procedure === "" || procedure === undefined) && btn === "=") || procedure === "Error") return "";

    const lastCharacter = procedure[procedure.length - 1]
    const separatedNumbers = procedure.split(operatorsCheck);
    
    if (["C", "⌦", "="].includes(btn)) {
      switch(btn) {
        case "C":
          return "";
        case "⌦":
          return procedure.slice(0, -1);
        case "=":
          const calculation = evaluate(procedure.replace(/×/g, "*").replace(/÷/g, "/"));
          return calculation === Infinity || isNaN(calculation)
            ? "Error"
            : calculation.toString();
        default:
          return procedure
      }
    } else {
      if (
        (operators.includes(lastCharacter) && btn === "(") || 
        ((!operators.includes(lastCharacter) && btn === ")") && (parenthesesCount(Parentheses.Open) !== parenthesesCount(Parentheses.Closed) && lastCharacter !== "("))
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
        (numbers.includes(lastCharacter) && (btn === "(" || btn === ")") && parenthesesCount(Parentheses.Open) === parenthesesCount(Parentheses.Closed))
      ) {
        return procedure
      } else if (separatedNumbers[separatedNumbers.length-1].includes(".") && btn === "."){
        return procedure
      }

      return procedure + btn
    }
  };

  const buttons = [
      { class: 'btn--light_grey', text: '(' },
      { class: 'btn--light_grey', text: ')' },
      { class: 'btn--light_grey btn__text--red', text: 'C' },
      { class: 'btn--light_grey btn--rotate', text: '⌦' },
      { class: 'btn--dark_grey', text: '7' },
      { class: 'btn--dark_grey', text: '8' },
      { class: 'btn--dark_grey', text: '9' },
      { class: 'btn--light_grey', text: '÷' },
      { class: 'btn--dark_grey', text: '4' },
      { class: 'btn--dark_grey', text: '5' },
      { class: 'btn--dark_grey', text: '6' },
      { class: 'btn--light_grey', text: '×' },
      { class: 'btn--dark_grey', text: '1' },
      { class: 'btn--dark_grey', text: '2' },
      { class: 'btn--dark_grey', text: '3' },
      { class: 'btn--light_grey', text: '-' },
      { class: 'btn--dark_grey', text: '0' },
      { class: 'btn--dark_grey', text: '.' },
      { class: 'btn--blue', text: '=' },
      { class: 'btn--light_grey', text: '+' } 
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