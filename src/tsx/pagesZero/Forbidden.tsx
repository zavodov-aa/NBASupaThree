import React from "react";
import { Link } from "react-router-dom";

function Forbidden() {
  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>403</h1>
      <p>У вас нет доступа к этой странице</p>
      <Link to="/">На главную</Link>
    </div>
  );
}

export default Forbidden;
