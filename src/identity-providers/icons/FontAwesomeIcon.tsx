import React from "react";

type FontAwesomeIconProps = {
  icon: "bitbucket" | "microsoft" | "instagram" | "paypal";
};

export const FontAwesomeIcon = ({ icon }: FontAwesomeIconProps) => {
  const styles = { style: { height: "2em", width: "2em" } };
  switch (icon) {
    case "bitbucket":
      return (
        <img src="./bitbucket-brands.svg" {...styles} aria-label="bitbucket icon" />
      );
    case "microsoft":
      return (
        <img src="./microsoft-brands.svg" {...styles} aria-label="microsoft icon" />
      );
    case "instagram":
      return (
        <img src="./instagram-brands.svg" {...styles} aria-label="instagram icon" />
      );
    case "paypal":
      return <img src="./paypal-brands.svg" {...styles} aria-label="paypal icon" />;
    default:
      return <></>;
  }
};
