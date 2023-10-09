import React, {useEffect, useState} from 'react'
import logo from '../img/Full-Logo.png';
import axios from "axios";
import * as emailjs from "@emailjs/browser";
import {CountdownCircleTimer} from 'react-countdown-circle-timer';

//------------------------------------------------------------------------
//constants
import * as Yup from "yup";
import {useFormik} from "formik";

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    contact: Yup.string().min(6, 'contact must be at least 10 digits').required('Contact is required'),
});
export default function Test() {

    const [timeRemaining, setTimeRemaining] = useState(600);
    const [isNameValid, setIsNameValid] = useState();
    const [isEmailValid, setIsEmailValid] = useState();
    const [isContactValid, setIsContactValid] = useState();
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState({});
    const [isTimerStarted, setIsTimerStarted] = useState(false);
    const [isTimerOver, setIsTimerOver] = useState(false);
    const [isTestSeen, setIsTestSeen] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [pageVisible, setPageVisible] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contact: '',
        q1: '',
        q2: '',
        q3: '',
        q4: '',
        q5: '',
        q6: '',
        q7: '',
        q8: '',
        q9: '',
        q10: '',
        time: 0,
        result: 0
    });

    const correctAnswers = {
        q1: 'option2',
        q2: 'option2',
        q3: 'option3',
        q4: 'option1',
        q5: 'option1',
        q6: 'option2',
        q7: 'option1',
        q8: 'option3',
        q9: 'option2',
        q10: 'option2',
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            contact: '',
        },
        validationSchema,
        onSubmit: (values) => {
            // Handle form submission here
            console.log(values);
        },
    });

    const handleNameChange = (e) => {
        const {name, value} = e.target;

        // Create a copy of the errors object to avoid mutating it directly
        const updatedErrors = {...errors};

        if (value.trim() === '') {
            updatedErrors[name] = 'Name is required';
            setIsNameValid(false);
        } else if (!/^[A-Za-z\s]+$/.test(value)) {
            updatedErrors[name] = 'Name should only contain letters and spaces';
            setIsNameValid(false);
        } else {
            delete updatedErrors[name];
            setIsNameValid(true);
        }

        // Update the errors state with the updatedErrors object
        setErrors(updatedErrors);
        setFormData({...formData, [name]: value});
    }

    const handleEmailChange = (e) => {
        const {name, value} = e.target;

        // Create a copy of the errors object to avoid mutating it directly
        const updatedErrors = {...errors};

        if (value.trim() === '') {
            updatedErrors[name] = 'Email is required';
            setIsEmailValid(false);
        } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value)) {
            updatedErrors[name] = 'Invalid email format';
            setIsEmailValid(false);
        } else {
            delete updatedErrors[name];
            setIsEmailValid(true);
        }

        // Update the errors state with the updatedErrors object
        setErrors(updatedErrors);
        setFormData({...formData, [name]: value});
    }


    const handleContactChange = (e) => {
        const {name, value} = e.target;

        // Create a copy of the errors object to avoid mutating it directly
        const updatedErrors = {...errors};

        if (value.trim() === '') {
            updatedErrors[name] = 'Contact number is required';
            setIsContactValid(false);
        } else if (!/^\d{10}$/.test(value)) { // Use ^\d{10}$ to match exactly 10 digits
            updatedErrors[name] = 'Contact number must be 10 digits';
            setIsContactValid(false);
        } else {
            delete updatedErrors[name]; // Remove the error if the input is valid
            setIsContactValid(true);
        }

        // Update the errors state with the updatedErrors object
        setErrors(updatedErrors);
        setFormData({...formData, [name]: value});
    }

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsTestSeen(false);
        setIsTimerStarted(false);
        Object.keys(correctAnswers).forEach((question) => {
            if (formData[question] === correctAnswers[question]) {
                formData.result = (Number)(formData.result + 1);
                console.log(formData.result);
            }
        });


        formData.time = (600 - timeRemaining);
        // setFormData({...formData,time: (timeRemaining)})
        alert('Form submitted. Time remaining: ' + timeRemaining);
        console.log('Form submitted. Time remaining: ' + timeRemaining);
        try {
            const response = await axios.post('https://sheetdb.io/api/v1/4h45jinzc2j7w', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (response.status === 201 || response.status === 200) {
                console.log('Submission successful');
                setIsSubmitted(true);
                setPageVisible(false);
                // sendEmail();
            } else {
                console.error('Submission failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    const isValidUser = async () => {
        try {
            const response = await axios.get('https://sheetdb.io/api/v1/4h45jinzc2j7w', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                const users = response.data;


                for (const user of users) {
                    if (user.email === formData.email) {

                        alert('Response already submitted as ' + formData.email);
                        setIsSubmitted(true);
                        setIsLoggedIn(true);
                        return false;
                    }
                }
                return true;
            } else {
                console.error('fetching Users Failed');
            }
        } catch (error) {
            console.error('Error:', error);

        }
    }

    const startTimer = async () => {
        const userCheck = await isValidUser();
        // const userCheck = true;
        if (userCheck) {
            setIsLoggedIn(true);
            const validationErrors = validateField();

            if (Object.keys(validationErrors).length === 0) {

                alert('Test Started');
                setIsTestSeen(true);
                setIsTimerStarted(true);
            } else {
                setErrors(validationErrors);
            }
        }
    };


    const onTick = () => {

        if (timeRemaining > 0) {
            setTimeRemaining(timeRemaining - 1);
        } else {
            setIsTimerOver(true);
        }
    };
    useEffect(() => {
        if (isTimerOver) {
            handleSubmit();
        }
    }, [isTimerOver]);


    useEffect(() => {
        let timer;
        if (isTimerStarted && timeRemaining > 0) {
            timer = setTimeout(onTick, 1000);
        }

        return () => {
            clearTimeout(timer);
        };
    }, [isTimerStarted, timeRemaining]);

    const sendEmail = () => {
        const emailService = 'service_t33fhl5';
        const emailTemplate = 'template_7eak69o';
        const publicKey = 'FOAVB-jIi70KcBSWP';

        const templateParams = {
            from_name: 'Non Criterion Technology',
            to_email: formData.email,
            to_name: formData.name,
        }

        emailjs
            .send(emailService, emailTemplate, templateParams, publicKey)
            .then((response) => {
                console.log('Email sent successfully:', response);
            })
            .catch((error) => {
                console.error('Email sending failed:', error);
            });
    };

    const validateField = () => {
        const errors = {};


        return errors;
    };


    return (
        <div className="container mt-5">
            <img src={logo} className="img-fluid mx-auto d-block" alt="..."/>
            {/*<div className="timer" id='timer'></div>*/}
            {/*<Timer/>*/}
            <form>
                <>
                    {pageVisible && !isLoggedIn && (
                        <>
                            {isTimerStarted && (<div className="timer">
                                <CountdownCircleTimer
                                    duration={timeRemaining}
                                    colors={[['#007bff', 0.33]]}
                                    onComplete={handleSubmit}
                                    size={200} // Adjust the size of the timer circle
                                    strokeWidth={10} // Adjust the thickness of the timer circle
                                    isLinearGradient={false} // Disable gradient
                                    trailColor="#f0f0f0" // Color of the remaining trail
                                    trailStrokeWidth={10} // Thickness of the remaining trail
                                    strokeLinecap="butt"
                                    onTick={onTick}// Adjust line ending style
                                    // Update time left
                                >
                                    {({remainingTime}) => (
                                        <div className="timer-txt">
                                            <a>{Math.floor(remainingTime / 60)}:{remainingTime % 60}</a>
                                        </div>
                                    )}
                                </CountdownCircleTimer>
                            </div>)}
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Name:</label>
                                <input type="text" placeholder="Enter your Name here"
                                       className={`form-control ${isNameValid ? 'is-valid' : isNameValid === false ? 'is-invalid' : ''}`}
                                       id="name"
                                       name="name" onChange={handleNameChange} value={formData.name}
                                       required/>

                                <div className="invalid-feedback">
                                    Please provide valid input.
                                </div>
                                <div className="valid-feedback">
                                    Looks good!
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email:</label>
                                <input type="email" placeholder="Enter your Email here"
                                       className={`form-control ${isEmailValid ? 'is-valid' : isEmailValid === false ? 'is-invalid' : ''}`}
                                       id="email" name="email" onChange={handleEmailChange}
                                       value={formData.email} required/>

                                <div className="invalid-feedback">
                                    Please provide valid input.
                                </div>
                                <div className="valid-feedback">
                                    Looks good!
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="contact" className="form-label">Contact No.:</label>
                                <input type="text" placeholder="Enter your contact here"
                                       className={`form-control ${isContactValid ? 'is-valid' : isContactValid === false ? 'is-invalid' : ''}`}
                                       id="contact" name="contact" onChange={handleContactChange}
                                       value={formData.contact} required/>

                                <div className="invalid-feedback">
                                    Please provide valid input.
                                </div>
                                <div className="valid-feedback">
                                    Looks good!
                                </div>
                            </div>

                            <div className="text-center">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={startTimer}
                                    disabled={!(isNameValid && isEmailValid && isContactValid)}
                                >Start Test
                                </button>
                            </div>

                        </>)}

                    {isTestSeen && (
                        <>
                            <div className="question">
                                <div className="mb-3">
                                    <label htmlFor="question1" className="form-label">Question 1: What will be the value of x after executing the following C code?</label>
                                    <code>
                                             <br/>
                                    int x = 10;<br/>
                                    int y = 5;<br/>
                                    x = x + y++;
                                    </code>
                                    <div className="form-check">
                                        <input type="radio" className="form-check-input" name="q1"
                                               id="q1-option1"
                                               onChange={handleChange} value="option1"/>
                                        <label className="form-check-label" htmlFor="q1-option1">Option 1: 16</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="radio" className="form-check-input" name="q1"
                                               id="q1-option2"
                                               onChange={handleChange} value="option2"/>
                                        <label className="form-check-label" htmlFor="q1-option2">Option 2: 15</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="radio" className="form-check-input" name="q1"
                                               id="q1-option3"
                                               onChange={handleChange} value="option3"/>
                                        <label className="form-check-label" htmlFor="q1-option3">Option 3: 17</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="radio" className="form-check-input" name="q1"
                                               id="q1-option4"
                                               onChange={handleChange} value="option4"/>
                                        <label className="form-check-label" htmlFor="q1-option4">Option 4: 10</label>
                                    </div>
                                </div>
                            </div>


                            <div className="question">
                                <div className="mb-3">
                                    <label htmlFor="question2" className="form-label">Question 2: What is the result of the following JavaScript code snippet? </label>
                                    <code>
                                             <br/>
                                    console.log(5 + "5");
                                    </code>
                                    <div className="form-check">
                                        <input type="radio" className="form-check-input" name="q2"
                                               id="q2-option1"
                                               onChange={handleChange} value="option1"/>
                                        <label className="form-check-label" htmlFor="q2-option1">Option 1: 10</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="radio" className="form-check-input" name="q2"
                                               id="q2-option2"
                                               onChange={handleChange} value="option2"/>
                                        <label className="form-check-label" htmlFor="q2-option2">Option 2:  "55"</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="radio" className="form-check-input" name="q2"
                                               id="q2-option3"
                                               onChange={handleChange} value="option3"/>
                                        <label className="form-check-label" htmlFor="q2-option3">Option 3: 55</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="radio" className="form-check-input" name="q2"
                                               id="q2-option4"
                                               onChange={handleChange} value="option4"/>
                                        <label className="form-check-label" htmlFor="q2-option4">Option 4:
                                        Error</label>
                                    </div>
                                </div>
                            </div>


                            <div className="question">
                                <div className="mb-3">
                                    <label htmlFor="question3" className="form-label">Question 3: What is the correct
                                        syntax for declaring a variable in Java?</label>
                                    <div className="form-check">
                                        <input type="radio" className="form-check-input" name="q3"
                                               id="q3-option1"
                                               onChange={handleChange} value="option1"/>
                                        <label className="form-check-label" htmlFor="q3-option1">Option 1: variable name
                                            = value;</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="radio" className="form-check-input" name="q3"
                                               id="q3-option2"
                                               onChange={handleChange} value="option2"/>
                                        <label className="form-check-label" htmlFor="q3-option2">Option 2: int =
                                            variableName;</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="radio" className="form-check-input" name="q3"
                                               id="q3-option3"
                                               onChange={handleChange} value="option3"/>
                                        <label className="form-check-label" htmlFor="q3-option3">Option 3: dataType
                                            variableName = value;</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="radio" className="form-check-input" name="q3"
                                               id="q3-option4"
                                               onChange={handleChange} value="option4"/>
                                        <label className="form-check-label" htmlFor="q3-option4">Option 4: value =
                                            variableName;</label>
                                    </div>
                                </div>


                                <div className="question">
                                    <div className="mb-3">
                                        <label htmlFor="question4" className="form-label">Question 4: In Java, which
                                            keyword is used to create a new instance of a class?</label>
                                        <div className="form-check">
                                            <input type="radio" className="form-check-input" name="q4"
                                                   id="q4-option1"
                                                   onChange={handleChange} value="option1"/>
                                            <label className="form-check-label" htmlFor="q4-option1">Option 1:
                                                new</label>
                                        </div>
                                        <div className="form-check">
                                            <input type="radio" className="form-check-input" name="q4"
                                                   id="q4-option2"
                                                   onChange={handleChange} value="option2"/>
                                            <label className="form-check-label" htmlFor="q4-option2">Option 2:
                                                create</label>
                                        </div>
                                        <div className="form-check">
                                            <input type="radio" className="form-check-input" name="q4"
                                                   id="q4-option3"
                                                   onChange={handleChange} value="option3"/>
                                            <label className="form-check-label" htmlFor="q4-option3">Option 3:
                                                instance</label>
                                        </div>
                                        <div className="form-check">
                                            <input type="radio" className="form-check-input" name="q4"
                                                   id="q4-option4"
                                                   onChange={handleChange} value="option4"/>
                                            <label className="form-check-label" htmlFor="q4-option4">Option 4:
                                                instantiate</label>
                                        </div>
                                    </div>
                                </div>


                                <div className="question">
                                    <div className="mb-3">
                                        <label htmlFor="question5" className="form-label">Question 5: What is the output
                                            of the following Java code snippet?</label>
                                        <code>
                                             <br/>
                                             int x = 5; <br/>
                                             int y = 3;<br/>
                                             System.out.println(x % y);
                                        </code>
                                        <div className="form-check">
                                            <input type="radio" className="form-check-input" name="q5"
                                                   id="q5-option1"
                                                   onChange={handleChange} value="option1"/>
                                            <label className="form-check-label" htmlFor="q5-option1">Option 1: 2</label>
                                        </div>
                                        <div className="form-check">
                                            <input type="radio" className="form-check-input" name="q5"
                                                   id="q5-option2"
                                                   onChange={handleChange} value="option2"/>
                                            <label className="form-check-label" htmlFor="q5-option2">Option 2: 1</label>
                                        </div>
                                        <div className="form-check">
                                            <input type="radio" className="form-check-input" name="q5"
                                                   id="q5-option3"
                                                   onChange={handleChange} value="option3"/>
                                            <label className="form-check-label" htmlFor="q5-option3">Option 3: 0</label>
                                        </div>
                                        <div className="form-check">
                                            <input type="radio" className="form-check-input" name="q5"
                                                   id="q5-option4"
                                                   onChange={handleChange} value="option4"/>
                                            <label className="form-check-label" htmlFor="q5-option4">Option 4:
                                                1.6667</label>
                                        </div>
                                    </div>
                                </div>


                                <div className="question">
                                    <div className="mb-3">
                                        <label htmlFor="question6" className="form-label">Question 6: What is a primary
                                            key in a relational database?</label>
                                        <div className="form-check">
                                            <input type="radio" className="form-check-input" name="q6"
                                                   id="q6-option1"
                                                   onChange={handleChange} value="option1"/>
                                            <label className="form-check-label" htmlFor="q6-option1">Option 1: A key
                                                used to unlock
                                                database access.</label>
                                        </div>
                                        <div className="form-check">
                                            <input type="radio" className="form-check-input" name="q6"
                                                   id="q6-option2"
                                                   onChange={handleChange} value="option2"/>
                                            <label className="form-check-label" htmlFor="q6-option2">Option 2: A unique
                                                identifier
                                                for a table record.</label>
                                        </div>
                                        <div className="form-check">
                                            <input type="radio" className="form-check-input" name="q6"
                                                   id="q6-option3"
                                                   onChange={handleChange} value="option3"/>
                                            <label className="form-check-label" htmlFor="q6-option3">Option 3: table
                                                that
                                                stores only primary data.</label>
                                        </div>
                                        <div className="form-check">
                                            <input type="radio" className="form-check-input" name="q6"
                                                   id="q6-option4"
                                                   onChange={handleChange} value="option4"/>
                                            <label className="form-check-label" htmlFor="q6-option4">Option 4: A key
                                                used
                                                for sorting database records.</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="question">
                                    <div className="mb-3">
                                        <label htmlFor="question7" className="form-label">Question 7: Which keyword is used to define a constant variable in Java?</label>
                                        <div className="form-check">
                                            <input type="radio" className="form-check-input" name="q7"
                                                   id="q7-option1"
                                                   onChange={handleChange} value="option1"/>
                                            <label className="form-check-label" htmlFor="q7-option1">Option 1:
                                            final</label>
                                        </div>
                                        <div className="form-check">
                                            <input type="radio" className="form-check-input" name="q7"
                                                   id="q7-option2"
                                                   onChange={handleChange} value="option2"/>
                                            <label className="form-check-label" htmlFor="q7-option2">Option 2: var</label>
                                        </div>
                                        <div className="form-check">
                                            <input type="radio" className="form-check-input" name="q7"
                                                   id="q7-option3"
                                                   onChange={handleChange} value="option3"/>
                                            <label className="form-check-label" htmlFor="q7-option3">Option 3: static</label>
                                        </div>
                                        <div className="form-check">
                                            <input type="radio" className="form-check-input" name="q7"
                                                   id="q7-option4"
                                                   onChange={handleChange} value="option4"/>
                                            <label className="form-check-label" htmlFor="q7-option4">Option 4:
                                            finalvar</label>
                                        </div>
                                    </div>
                                </div>


                                <div className="question">
                                    <div className="mb-3">
                                        <label htmlFor="question8" className="form-label">Question 8: f the price of a
                                            book is first increased by 20% and then decreased by 20 %. What is the net
                                            change in the price of the book?</label>
                                        <div className="form-check">
                                            <input type="radio" className="form-check-input" name="q8"
                                                   id="q8-option1"
                                                   onChange={handleChange} value="option1"/>
                                            <label className="form-check-label" htmlFor="q8-option1">Option 1: No
                                                change</label>
                                        </div>
                                        <div className="form-check">
                                            <input type="radio" className="form-check-input" name="q8"
                                                   id="q8-option2"
                                                   onChange={handleChange} value="option2"/>
                                            <label className="form-check-label" htmlFor="q8-option2">Option 2: 4%
                                                Increase</label>
                                        </div>
                                        <div className="form-check">
                                            <input type="radio" className="form-check-input" name="q8"
                                                   id="q8-option3"
                                                   onChange={handleChange} value="option3"/>
                                            <label className="form-check-label" htmlFor="q8-option3">Option 3: 4%
                                                decrease</label>
                                        </div>
                                        <div className="form-check">
                                            <input type="radio" className="form-check-input" name="q8"
                                                   id="q8-option4"
                                                   onChange={handleChange} value="option4"/>
                                            <label className="form-check-label" htmlFor="q8-option4">Option 4: 10%
                                                decrease</label>
                                        </div>
                                    </div>
                                </div>


                                <div className="question">
                                    <div className="mb-3">
                                        <label htmlFor="question9" className="form-label">Question 9: If 3 workers can
                                            complete a task in 8 hours, how many workers are needed to complete the same
                                            task in 4 hours?</label>
                                        <div className="form-check">
                                            <input type="radio" className="form-check-input" name="q9"
                                                   id="q9-option1"
                                                   onChange={handleChange} value="option1"/>
                                            <label className="form-check-label" htmlFor="q9-option1">Option 1: 6
                                                workers</label>
                                        </div>
                                        <div className="form-check">
                                            <input type="radio" className="form-check-input" name="q9"
                                                   id="q9-option2"
                                                   onChange={handleChange} value="option2"/>
                                            <label className="form-check-label" htmlFor="q9-option2">Option 2: 12
                                                workers</label>
                                        </div>
                                        <div className="form-check">
                                            <input type="radio" className="form-check-input" name="q9"
                                                   id="q9-option3"
                                                   onChange={handleChange} value="option3"/>
                                            <label className="form-check-label" htmlFor="q9-option3">Option 3: 2
                                                workers</label>
                                        </div>
                                        <div className="form-check">
                                            <input type="radio" className="form-check-input" name="q9"
                                                   id="q9-option4"
                                                   onChange={handleChange} value="option4"/>
                                            <label className="form-check-label" htmlFor="q9-option4">Option 4: 8
                                                workers</label>
                                        </div>
                                    </div>
                                </div>


                                <div className="question">
                                    <div className="mb-3">
                                        <label htmlFor="question10" className="form-label">Question 10: If a train
                                            travels
                                            at a
                                            speed of 60 km/h, how many hours will it take to cover a distance of
                                            240
                                            km?</label>
                                        <div className="form-check">
                                            <input type="radio" className="form-check-input" name="q10"
                                                   id="q10-option1"
                                                   onChange={handleChange} value="option1"/>
                                            <label className="form-check-label" htmlFor="q10-option1">Option 1: 2
                                                hours</label>
                                        </div>
                                        <div className="form-check">
                                            <input type="radio" className="form-check-input" name="q10"
                                                   id="q10-option2"
                                                   onChange={handleChange} value="option2"/>
                                            <label className="form-check-label" htmlFor="q10-option2">Option 2: 4
                                                hours.</label>
                                        </div>
                                        <div className="form-check">
                                            <input type="radio" className="form-check-input" name="q10"
                                                   id="q10-option3"
                                                   onChange={handleChange} value="option3"/>
                                            <label className="form-check-label" htmlFor="q10-option3">Option 3: 3
                                                hours</label>
                                        </div>
                                        <div className="form-check">
                                            <input type="radio" className="form-check-input" name="q10"
                                                   id="q10-option4"
                                                   onChange={handleChange} value="option4"/>
                                            <label className="form-check-label" htmlFor="q10-option4">Option 4: 6
                                                hours</label>
                                        </div>
                                    </div>
                                </div>
                                <button type="button" onClick={handleSubmit} className="btn btn-primary">Submit</button>
                            </div>
                        </>
                    )}
                    {isSubmitted && (
                        <>
                            <div className="alert alert-success text-center">
                                <h1 className="display-4">Thank You!</h1>
                                <p>Your submission has been received.</p>
                                <a
                                    href="https://www.noncriteriontechnology.com/?i=1"
                                    className="btn btn-primary"
                                    role="button"
                                >
                                    Visit Website
                                </a>
                            </div>
                        </>
                    )}
                </>
            </form>
        </div>
    )
}
