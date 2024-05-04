import AutoComplete from "./components/AutoComplete";
import { countries } from "./constants/mockData";

function App() {
  return (
    <div>
      <AutoComplete data={countries} />
    </div>
  );
}

export default App;
