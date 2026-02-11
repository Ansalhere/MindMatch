import React, { Children } from "react";

interface Props {
  children: String;
  onClose: () => void;
}

const Alert = ({ children, onClose }: Props) => {
  return (
    <div className="alert alert-primary alert-dismissible ">
      {children}
      <button
        type="button"
        className="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
        onClick={onClose}
        style={{ float: "right" }}
      ></button>
    </div>
  );
};

export default Alert;
