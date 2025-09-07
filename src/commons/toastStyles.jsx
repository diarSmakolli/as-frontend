export const customToastContainerStyle = {
  // bg: "rgb(39, 39, 42)",
  bg: "rgb(255,255,255)",
  color: "rgba(52, 61, 68, 1)",
  fontWeight: "500",
  fontFamily: "Airbnb Cereal VF",
  borderRadius: "xl",
  border: "1px solid",
  // borderColor: "rgb(63, 63, 70)",
  borderColor: "rgba(145, 158, 171, 0.2)",
  "& *": {
    fontWeight: "500 !important",
  },
};

export const customErrorToastContainerStyle = {
  ...customToastContainerStyle,
  // boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.25)",
  mx: 4,
  mb: 4,
  py: 4,
};
