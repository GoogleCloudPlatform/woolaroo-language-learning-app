import React from "react";

class ColorComponent extends React.Component {
  render() {
    return (
      <div
        style={{
          backgroundColor: this.props.color,
          minWidth: "120px",
          minHeight: "65px",
          borderRadius: "8px"
        }}
      ></div>
    );
  }
}

export default ColorComponent;
