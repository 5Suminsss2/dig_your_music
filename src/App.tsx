import React from "react";
import axios from "axios";
import { useAuthStore } from "./store/authStore";
import Main from "./page/main";
import RandomBomb from "./page/randomBomb";

const App: React.FC = () => {
  return (
    <div>
      {/* <Main /> */}
      <RandomBomb />
    </div>
  );
};

export default App;
