import React from 'react';
import styles from './SurfaceContainer.module.scss';
import {AnimatePresence, motion} from "framer-motion";
import LoadingIndicator from "../../indicators/LoadingIndicator/LoadingIndicator";

const SurfaceContainer = ({children, isLoading}) => {
    return (
        <div className={styles.container}>
            <motion.div className={styles.surface} layout>
                <AnimatePresence>
                    {isLoading && <motion.div
                        className={styles.loadingContainer}
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={{duration: 0.2}}
                    >
                        <LoadingIndicator size={'full'} />
                    </motion.div>}
                </AnimatePresence>
                {children}
            </motion.div>
        </div>
    );
};

export default SurfaceContainer;
