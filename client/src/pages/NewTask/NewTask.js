import {useContext, useEffect, useState} from "react";
import TextBoxInput from "../../components/inputs/TextBoxInput/TextBoxInput";
import PriorityIndicator from "../../components/indicators/PriorityIndicator/PriorityIndicator";
import InputWrapper from "../../components/utilities/InputWrapper/InputWrapper";
import ToggleButton from "../../components/buttons/ToggleButton/ToggleButton";
import Chip from "../../components/buttons/Chip/Chip";
import DropDownInput from "../../components/inputs/DropDownInput/DropDownInput";
import {useDispatch, useSelector} from "react-redux";
import {setTask} from "../../state/tasksSlice";
import MiniPageContainer from "../../components/utilities/MiniPagesContainer/MiniPageContainer";
import {AlertsContext} from "../../context/AlertsContext";
import {MiniPagesContext} from "../../context/MiniPagesContext";
import AddIcon from "@mui/icons-material/Add";
import CollapsibleContainer from "../../components/utilities/CollapsibleContainer/CollapsibleContainer";
import {setHighestPriority, setLowestPriority} from "../../state/settingsSlice";
import SwitchContainer from "../../components/utilities/SwitchContainer/SwitchContainer";
import TimePeriodInput from "../../components/inputs/TimeUnitInput/TimePeriodInput/TimePeriodInput";
import Divider from "../../components/utilities/Divider/Divider";
import {useTask} from "../../hooks/useTask";

const NewTask = ({index, length, id}) => {
    const categories = useSelector((state) => state?.categories.categories);
    const categoryNames = categories?.map(category => category.title);
    const settings = useSelector((state) => state?.settings);

    const [title, setTitle] = useState('');
    const [type, setType] = useState('Checkbox');
    const [step, setStep] = useState(settings.defaults.step);
    const [goalType, setGoalType] = useState('At least');
    const [goalNumber, setGoalNumber] = useState(settings.defaults.goal);
    const [category, setCategory] = useState('');
    const [priority, setPriority] = useState(settings.defaults.priority);
    const [repeats, setRepeats] = useState(false);
    const [longGoalType, setLongGoalType] = useState('None');
    const [longGoalNumber, setLongGoalNumber] = useState(settings.defaults.goal);
    const [expiresAt, setExpiresAt] = useState('Never');
    const [timeGroup, setTimeGroup] = useState('');
    const [repeatEverySub, setRepeatEverySub] = useState('');
    const [repeatEvery, setRepeatEvery] = useState('');

    const [repeatNumber, setRepeatNumber] = useState(settings.defaults.priority);
    const [timePeriod, setTimePeriod] = useState('Weeks');
    const [timePeriod2, setTimePeriod2] = useState([]);

    const [repeatType, setRepeatType] = useState('Custom Rules')

    const groups = useSelector((state) => state?.groups.groups);

    const tasks = useSelector((state) => state?.tasks.tasks);

    const dispatch = useDispatch();

    const alertsContext = useContext(AlertsContext);
    const miniPagesContext = useContext(MiniPagesContext);

    const {addTaskToServer} = useTask();

    const causesOfExpiration = ['End of goal', 'Date', 'Never'];
    const taskType = ['Checkbox', 'Number'];
    const goalTypes = ['None', 'At most', 'Exactly', 'At least'];
    const timePeriods = ['Days', 'Weeks', 'Months', 'Years'];
    const repeatTypes = ['Custom Rules', 'Time Group'];

    const handleKeyDown = (e) => {
        if (e.code === 'Enter') {
            handleSave();
        }
    }



    const findMatchingGroups = () => {
        const categoryId = categories.find(localCategory => localCategory.title === category)?.id

        return groups.filter(group => group.parent === categoryId).map(group => group.title)
    }

    const groupTitles = ['None', ...findMatchingGroups()];

    useEffect(() => {
        if (id) {
            const task = tasks.find(task => task._id === id);

            setTitle(task.title);
            setType(task.type);

            if (task.type === 'Number') {
                setStep(task.step);
                setGoalType(task.goal.type);
                setGoalNumber(task.goal.number);
            }

            setCategory(task.category);
            setPriority(task.priority);
            setRepeats(task.repeats);

            if (task.repeats) {
                setLongGoalType(task.longGoal.type);
                setLongGoalNumber(task.longGoal.number);
                setExpiresAt(task.expiresAt);

                if (task.timeGroup) {
                    setRepeatType('Time Group');
                    setTimeGroup(groups.find(group => group.id === timeGroup).title)
                } else {
                    setRepeatType(task.repeatRate.number);
                    setTimePeriod(task.repeatRate.bigTimePeriod);
                    setTimePeriod2(task.repeatRate.smallTimePeriod);
                }
            }
        }
    }, [])

    useEffect(() => {
        if (timeGroup) {
            setRepeatEvery('');
            setRepeatEverySub('');
        }
    }, [timeGroup])

    useEffect(() => {
        if (repeatEvery || repeatEverySub) {
            setTimeGroup('');
        }
    }, [repeatEvery, repeatEverySub])

    useEffect(() => {
        setTimePeriod2([]);
    }, [timePeriod])

    const handleSave = async () => {
        const checkAllInputs = () => {
            if (title) {
                return true
            }
            alertsContext.dispatch({type: "ADD_ALERT", payload: {type: "error", message: "You must input a title for the task"}})
            return false;
        }

        if (checkAllInputs()) {
            if (priority < settings.priorityBounds.low) {
                dispatch(setLowestPriority(priority));
            }
            if (priority > settings.priorityBounds.high) {
                dispatch(setHighestPriority(priority));
            }

            let startingDates = [];
            timePeriod2.forEach(smallTimePeriod => {
                let startingDate = new Date();

                switch (timePeriod) {
                    case 'Days':
                        break;
                    case 'Weeks':
                        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

                        const weekDaysDifference = days.findIndex(day => day === smallTimePeriod) + 1 - startingDate.getDay();
                        startingDate.setDate(startingDate.getDate() + weekDaysDifference);
                        break;
                    case 'Months':
                        startingDate.setDate(smallTimePeriod?.getDate());
                        break;
                    case 'Years':
                        startingDate.setTime(smallTimePeriod?.getTime());
                        break;
                }
                startingDate.setHours(0, 0, 0, 0);
                startingDates.push(startingDate.getTime());
            });

            const task = {
                title,
                type,
                step: type === 'Number' ? (step ? step : settings.defaults.step) : undefined,
                goal: type === 'Number' ? {
                    type: goalType,
                    number: goalType === 'None' ? undefined : (goalNumber ? goalNumber : settings.defaults.goal)
                } : undefined,
                category: category ? categories.find(localCategory => localCategory.title === category)?.id : undefined,
                priority: priority ? priority : settings.defaults.priority,
                repeats,
                longGoal: repeats ? {
                    type: longGoalType,
                    number: longGoalType === 'None' ? undefined : (longGoalNumber ? longGoalNumber : settings.defaults.goal)
                } : undefined,
                // expiresAt: repeats ? expiresAt : undefined, // need to fix
                timeGroup: repeats && timeGroup ? groups.find(group => group.title === timeGroup).id : undefined,
                repeatRate: repeats && !timeGroup ? {
                    number: repeatNumber,
                    bigTimePeriod: timePeriod,
                    smallTimePeriod: timePeriod2,
                    startingDate: startingDates
                } : undefined,
                lastEntryDate: undefined,
                previousEntry: 0,
                shortHistory: '000000'
            }

            if (id) {
                dispatch(setTask(task));
            } else {
                await addTaskToServer(task);
            }

            miniPagesContext.dispatch({type: 'REMOVE_PAGE', payload: ''})
        }
    }

    return (
        <MiniPageContainer
            onClickSave={handleSave}
            index={index}
            length={length}
        >
            <input
                type="text"
                className="Title Title-Input"
                placeholder="Add task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <InputWrapper label="Type">
                <div className={`Horizontal-Flex-Container`}>
                    {taskType.map((task, index) => (
                        <Chip
                            selected={type}
                            setSelected={setType}
                            value={task}
                            key={index}
                        >
                            {task}
                        </Chip>
                    ))
                    }
                </div>
            </InputWrapper>
            <CollapsibleContainer isVisible={type === 'Number'}>
                <InputWrapper label="Step">
                    <TextBoxInput type="number" placeholder="Step" value={step} setValue={setStep}/>
                </InputWrapper>
                <InputWrapper label={"Goal"}>
                    <DropDownInput
                        placeholder={'Type'}
                        options={goalTypes}
                        selected={goalType}
                        setSelected={setGoalType}
                    />
                    <TextBoxInput type="number" placeholder="Number" value={goalNumber} setValue={setGoalNumber}/>
                </InputWrapper>
            </CollapsibleContainer>
            <InputWrapper label={"Category"}>
                <DropDownInput
                    placeholder={'Category'}
                    options={[...categoryNames,
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            Add new
                            <AddIcon />
                        </div>]}
                    selected={category}
                    setSelected={setCategory}
                />
            </InputWrapper>
            <InputWrapper label="Priority">
                <TextBoxInput type="number" placeholder="Priority" value={priority} setValue={setPriority}/>
                <PriorityIndicator/>
            </InputWrapper>
            <InputWrapper label="Repeats">
                <ToggleButton isToggled={repeats} setIsToggled={setRepeats}></ToggleButton>
            </InputWrapper>
            <CollapsibleContainer isVisible={repeats}>
                <InputWrapper label={"Long term goal"}>
                    <DropDownInput
                        placeholder={'Type'}
                        options={goalTypes}
                        selected={longGoalType}
                        setSelected={setLongGoalType}
                    />
                    <TextBoxInput type="number" placeholder="Number" value={longGoalNumber}
                                  setValue={setLongGoalNumber}/>
                </InputWrapper>
                <InputWrapper label={"Expires at"}>
                    <DropDownInput
                        placeholder={'Never'}
                        options={causesOfExpiration}
                        selected={expiresAt}
                        setSelected={setExpiresAt}
                    />
                </InputWrapper>
                <Divider />
                <InputWrapper label="Repeat with">
                    <div className={`Horizontal-Flex-Container`}>
                        {repeatTypes.map((type, index) => (
                            <Chip
                                selected={repeatType}
                                setSelected={setRepeatType}
                                value={type}
                                key={index}
                            >
                                {type}
                            </Chip>
                        ))
                        }
                    </div>
                </InputWrapper>
                <SwitchContainer selectedTab={repeatType === 'Custom Rules' ? 0 : 1}>
                    <>
                        <InputWrapper label={'Repeat every'}>
                            <TextBoxInput type="number" placeholder="Number" value={repeatNumber} setValue={setRepeatNumber}/>
                        </InputWrapper>
                        <InputWrapper label={'Time period'}>
                            <DropDownInput placeholder={'Weeks'} options={timePeriods} selected={timePeriod} setSelected={setTimePeriod}></DropDownInput>
                        </InputWrapper>
                        {timePeriod !== 'Days' && <InputWrapper label={'On'}>
                            <TimePeriodInput timePeriod={timePeriod} timePeriod2={timePeriod2} setTimePeriod2={setTimePeriod2} />
                        </InputWrapper>}
                    </>
                    <InputWrapper label={"Select a category time group"}>
                        {groupTitles.map((group, index) => (
                            <Chip
                                key={index}
                                value={group}
                                selected={timeGroup}
                                setSelected={setTimeGroup}
                            >
                                {group}
                            </Chip>
                        ))}
                    </InputWrapper>
                </SwitchContainer>
            </CollapsibleContainer>
        </MiniPageContainer>
    );
};

export default NewTask;
