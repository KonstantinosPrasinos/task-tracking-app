import styles from "./TextBoxInput.module.scss";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const TextBoxInput = ({ placeholder = "placeholder", type = "text", icon, isDisabled = false, value, setValue }) => {

    const handleChange = (event) => {
        if (type === 'number') {
            if (isNaN(event.target.value)) {
                return;
            }
            if (event.target.value === '') {
                setValue(0);
                return;
            }
        }
        setValue(event.target.value)
    }

    const checkIfNull = () => {
        if (value === null) {
            setValue(0);
        }
    }

    const increment = () => {
        checkIfNull();
        setValue(current => current + 1);
    }

    const decrement = () => {
        checkIfNull();
        setValue(current => current - 1);
    }

  return (
    <div
      className={`${styles.container} Horizontal-Flex-Container Rounded-Container`}
    >
      {icon !== null && <>{icon}</>}
      <span className={styles.inputWrapper}>
          <input disabled={isDisabled} type={type === 'password' ? 'password' : 'text'} className={styles.input} placeholder={placeholder} value={value} onChange={handleChange} />
      </span>
      {type === "number" && (
        <div className={styles.buttonsContainer}>
          <button disabled={isDisabled} className={`${styles.button}`} onClick={increment}><ArrowDropUpIcon sx={{position: "absolute", top: "-0.25em", left: "-0.25em"}} /></button>
          <button disabled={isDisabled} className={`${styles.button}`} onClick={decrement}><ArrowDropDownIcon sx={{position: "absolute", top: "-0.25em", left: "-0.25em"}} /></button>
        </div>
      )}
    </div>
  );
};

export default TextBoxInput;
