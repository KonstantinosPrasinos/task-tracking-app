import styles from './Pagination.module.scss';
import {motion, AnimatePresence} from 'framer-motion';

const Pagination = ({children, currentPage}) => {
    return (
        <div className={styles.container}>
            <AnimatePresence
                exitBeforeEnter={true}
                initial={false}
            >
                {children.map((child, index) => index === currentPage && (
                    <motion.div
                        key={index}
                        className={styles.container}

                        initial={{x: '100%'}}
                        animate={{x: '0'}}
                        exit={{x: '-100%'}}

                        transition={{duration: 0.1}}
                    >
                        {child}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default Pagination;
