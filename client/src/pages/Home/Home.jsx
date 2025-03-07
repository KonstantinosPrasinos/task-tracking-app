import styles from "./Home.module.scss";
import { useRenderTasks } from "../../hooks/render-tasks-hook/useRenderTasks";
import { motion } from "framer-motion";
import LoadingIndicator from "../../components/indicators/LoadingIndicator/LoadingIndicator";
import { useScreenSize } from "../../hooks/useScreenSize";
import TaskList from "@/components/utilities/TaskList/TaskList.jsx";

const Home = () => {
  const { isLoading, data, showNonCurrentTasks, setShowNonCurrentTasks } =
    useRenderTasks();

  const { screenSize } = useScreenSize();

  if (isLoading) {
    return <LoadingIndicator type={"dots"} />;
  }

  return (
    <motion.div className={`${styles.container}`}>
      <TaskList
        tasks={data}
        usesTime={true}
        showNonCurrentTasks={showNonCurrentTasks}
        setShowNonCurrentTasks={setShowNonCurrentTasks}
      />
      {screenSize === "big" && (
        <div className={`Stack-Container ${styles.rightSide}`}></div>
      )}
    </motion.div>
  );
};

export default Home;
