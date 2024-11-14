import { useContext, useEffect, useState } from "react";

import styles from "./NavBar.module.scss";
import IconButton from "../../buttons/IconButton/IconButton";
import Button from "../../buttons/Button/Button";
import { TbHome, TbPlus, TbSearch, TbSettings } from "react-icons/tb";
import { useLocation, useNavigate } from "react-router-dom";
import { MiniPagesContext } from "../../../context/MiniPagesContext";
import { motion } from "framer-motion";
import { useScreenSize } from "@/hooks/useScreenSize";
import ConnectionBadges from "@/components/utilities/ConnectionBadges/ConnectionBadges";
import { ComponentCommunicationContext } from "@/context/ComponentCommunicationContext.jsx";

const NavBar = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const [selected, setSelected] = useState(null);

  const miniPagesContext = useContext(MiniPagesContext);
  const componentCommunicationContext = useContext(
    ComponentCommunicationContext,
  );

  useEffect(() => {
    switch (location.pathname) {
      case "/":
      case "/home":
        setSelected("home");
        break;
      case "/list":
        setSelected("list");
        break;
      case "/settings":
        setSelected("settings");
        break;
      default:
        break;
    }
  }, [location]);

  const { screenSize } = useScreenSize();

  const variants = {
    initial: screenSize === "small" ? { y: "3em" } : { x: "-3em" },
    animate: screenSize === "small" ? { y: 0 } : { x: 0 },
  };

  return (
    <motion.div
      className={styles.container}
      initial={"initial"}
      animate={"animate"}
      variants={variants}
    >
      <div className={`${styles.navBar}`}>
        <div className={styles.item}>
          <IconButton
            onClick={() => navigate("/", { replace: true })}
            selected={selected === "home"}
            // setSelected={() => setSelected('home')}
          >
            <TbHome />
          </IconButton>
          {selected === "home" && (
            <motion.div className={styles.selectedBar} layoutId={"underline"} />
          )}
        </div>
        {screenSize === "small" && (
          <div className={styles.item}>
            <IconButton
              onClick={() =>
                componentCommunicationContext.dispatch({
                  type: "SET_SEARCH_SCREEN_VISIBLE",
                  payload: true,
                })
              }
              selected={selected === "search"}
            >
              <TbSearch />
            </IconButton>
            {componentCommunicationContext.state.filters.length > 0 && (
              <div
                className={styles.filterCounter}
                style={{
                  right:
                    -(
                      componentCommunicationContext.state.filters.length.toString()
                        .length - 1
                    ) * 2,
                }}
              >
                {componentCommunicationContext.state.filters.length}
              </div>
            )}
          </div>
        )}
        <div className={styles.item}>
          <IconButton
            onClick={() => navigate("/settings", { replace: true })}
            selected={selected === "settings"}
          >
            <TbSettings />
          </IconButton>
          {selected === "settings" && (
            <motion.div className={styles.selectedBar} layoutId={"underline"} />
          )}
        </div>
        <Button
          type="square"
          symmetrical={true}
          onClick={() =>
            miniPagesContext.dispatch({
              type: "ADD_PAGE",
              payload: { type: "new-task" },
            })
          }
        >
          <TbPlus />
        </Button>
        <ConnectionBadges />
      </div>
    </motion.div>
  );
};

export default NavBar;
