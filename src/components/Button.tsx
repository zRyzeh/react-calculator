import "../css/Button.css";

interface ButtonProps {
  className: string;
  text: string;
  setProcedure: () => void;
}

export const Button = ({ className, text, setProcedure } : ButtonProps) => {
	return(
		<button 
		  type="button" 
		  className={`btn ${className}`} 
		  onClick={setProcedure}
    >
		  {text}
		</button>
	);
}