import styles from './ChangeEmail.module.scss'
import TextBoxInput from "../../../components/inputs/TextBoxInput/TextBoxInput";
import Button from "../../../components/buttons/Button/Button";
import {useContext, useState} from "react";
import {useVerify} from "../../../hooks/useVerify";
import {AlertsContext} from "../../../context/AlertsContext";
import TextButton from "../../../components/buttons/TextButton/TextButton";
import SwitchContainer from "../../../components/containers/SwitchContainer/SwitchContainer";
import SurfaceContainer from "../../../components/containers/SurfaceContainer/SurfaceContainer";
import {UserContext} from "../../../context/UserContext";
import {useNavigate} from "react-router-dom";
import PasswordStrengthBar from "react-password-strength-bar";

const ChangeEmail = () => {
    const {verifyPassword, verifyVerificationCode} = useVerify();
    const currentEmail = useContext(UserContext).state.email;
    const alertsContext = useContext(AlertsContext);
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(0);

    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('')
    const [verificationCode, setVerificationCode] = useState('');
    const [reEnterEmail, setReEnterEmail] = useState('');

    const validateEmail = () => {
        return email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    const handleKeyDown = (e) => {
        if (e.code === 'Enter') {
            handleNextPage();
        }
    }

    const checkIfFilled = () => {
        if (currentPage === 1) {
            return validateEmail();
        }

        return true
    }

    const handleVerificationCode = (e) => {
        if (e.length <= 6) {
            setVerificationCode(e);
        }
    }

    const handleNextPage = () => {
        switch (currentPage) {
            case 0:
                // Verify password
                if (verifyPassword(password)) {
                    setCurrentPage(1);
                } else {
                    alertsContext.dispatch({type: "ADD_ALERT", payload: {type: "error", message: "Password is invalid"}});
                }
                break;
            case 1:
                if (validateEmail()) {
                    setCurrentPage(2)
                }
                break;
            case 2:
                // Verify Code
                if (verifyVerificationCode(verificationCode)) {
                    setCurrentPage(3);
                } else {
                    alertsContext.dispatch({type: "ADD_ALERT", payload: {type: "error", message: "Verification code is invalid"}});
                }

                break;
            case 3:
                navigate("/log-in");
        }
    }

    const handleCancel = () => {
        navigate(-1);
    }

    return (
        <SurfaceContainer>
            <SwitchContainer selectedTab={currentPage}>
                <div className={'Stack-Container'}>
                    <div className={'Display'}>We sent you a code</div>
                    <div className={'Label'}>
                        In order to verify it's you we sent you a verification code.
                        <br />
                        Enter the code below to verify your email.
                    </div>
                    <div>
                        <TextBoxInput
                            width={'max'}
                            size={'big'}
                            placeholder={'Verification code'}
                            value={verificationCode}
                            setValue={handleVerificationCode}
                            onKeydown={handleKeyDown}
                        />
                        <TextButton onClick={handleResendCode}>Didn't receive code?</TextButton>
                    </div>
                </div>
                <div className={'Stack-Container'}>
                    <div className={'Display'}>Enter new email</div>
                    <TextBoxInput}
                        type={'email'}
                        width={'max'}
                        size={'big'}
                        placeholder={'New email address'}
                        value={email}
                        setValue={setEmail}
                        onKeydown={handleKeyDown}
                        invalid={email.length ? !validateEmail() : null}
                    />
                    <PasswordStrengthBar password={newPassword} onChangeScore={handlePasswordScore} style={{padding: '0 10px', marginTop: 0}} />
                    <TextBoxInput
                        type={'password'}
                        width={'max'}
                        size={'big'}
                        placeholder={'Re-enter password'}
                        onKeydown={handleKeyDown}
                        value={reEnterEmail}
                        setValue={setReEnterEmail}
                    />
                </div>
                <div className={'Stack-Container'}>
                    <div className={'Display'}>Password set successfully</div>
                </div>
            </SwitchContainer>
            {/*<SwitchContainer selectedTab={currentPage}>*/}
            {/*    <div className={styles.topHalf}>*/}
            {/*        <div className={styles.infoContainer}>*/}
            {/*            <div className={'Display'}>Verify your password</div>*/}
            {/*            <div className={'Label'}>Please enter your password to verify your identity.</div>*/}
            {/*        </div>*/}
            {/*        <TextBoxInput type={'password'} width={'max'} size={'big'} placeholder={'Password'} value={password} setValue={setPassword} onKeydown={handleKeyDown}/>*/}
            {/*    </div>*/}
            {/*    <div className={styles.topHalf}>*/}
            {/*        <div className={styles.infoContainer}>*/}
            {/*            <div className={'Display'}>Change your email</div>*/}
            {/*            <div className={'Label'}>*/}
            {/*                Your current email is {currentEmail}. <br/>*/}
            {/*                Your email is not visible to anyone.*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        <TextBoxInput*/}
            {/*            type={'email'}*/}
            {/*            width={'max'}*/}
            {/*            size={'big'}*/}
            {/*            placeholder={'New email address'}*/}
            {/*            value={email}*/}
            {/*            setValue={setEmail}*/}
            {/*            onKeydown={handleKeyDown}*/}
            {/*            invalid={email.length ? !validateEmail() : null}*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*    <div className={styles.topHalf}>*/}
            {/*        <div className={styles.infoContainer}>*/}
            {/*            <div className={'Display'}>We sent you a code</div>*/}
            {/*            <div className={'Label'}>*/}
            {/*                If the email you entered exists, is should receive a verification code.*/}
            {/*                Enter the code below to verify your email.*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        <div>*/}
            {/*            <TextBoxInput*/}
            {/*                width={'max'}*/}
            {/*                size={'big'}*/}
            {/*                placeholder={'Verification code'}*/}
            {/*                value={verificationCode}*/}
            {/*                setValue={handleVerificationCode}*/}
            {/*                onKeydown={handleKeyDown}*/}
            {/*                invalid={verificationCode.length ? !(verificationCode.length === 6) : null}*/}
            {/*            />*/}
            {/*            <TextButton>Didn't receive code?</TextButton>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <div className={styles.topHalf}>*/}
            {/*        <div className={styles.infoContainer}>*/}
            {/*            <div className={'Display'}>Email changed successfully</div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</SwitchContainer>*/}
            <div className={`Horizontal-Flex-Container ${currentPage !== 3 ? 'Space-Between' : 'Align-Center'}`} >
                {currentPage !== 3 ? <Button
                    size={'big'}
                    filled={false}
                    onClick={handleCancel}
                >
                    Cancel
                </Button> : null}
                <Button size={'big'} filled={checkIfFilled()} onClick={handleNextPage} layout={true}>{currentPage !== 3 ? 'Continue' : 'Finish'}</Button>
            </div>
        </SurfaceContainer>
    );
};

export default ChangeEmail;
