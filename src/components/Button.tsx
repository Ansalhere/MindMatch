import React from "react";

interface Props {
  buttonString: string;
  color: string;
  onClick: () => void;
}

const Button = ({ buttonString, color, onClick }: Props) => {
  return (
    <button className={"btn btn-" + color} onClick={onClick}>
      {buttonString}
    </button>
  );
};

export default Button;
