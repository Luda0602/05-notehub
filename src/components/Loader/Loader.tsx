import css from "./Loader.module.css";
import { CircleLoader } from "react-spinners";

export default function Loader() {
  return (
    <div className={css.loader}>
      <CircleLoader color="blue" />
    </div>
  );
}