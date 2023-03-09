import React from "react";
import "./footer.scss";

const Footer = () => {
  return (
    <div className="app__footer">
      <div className="copyright">
        <span className="copyright__text">@2023 Idealidad</span>
        <span className="copyright__text">All Rights Reserved</span>
      </div>
      <span className="creator__link">
        Passionately created by{" "}
        <span className="more__info">Swastik Technologies</span>
      </span>
    </div>
  );
};

export default Footer;
