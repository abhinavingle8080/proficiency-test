import React, { useEffect, useState } from "react";
import logo from "../img/banner.jpeg";
import axios from "axios";
import * as emailjs from "@emailjs/browser";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

//------------------------------------------------------------------------
//constants
import * as Yup from "yup";
import { useFormik } from "formik";

// Bootstrap
import Spinner from "react-bootstrap/Spinner";
import { flushSync } from "react-dom";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  contact: Yup.string()
    .min(6, "contact must be at least 10 digits")
    .required("Contact is required"),
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
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
    q6: "",
    q7: "",
    q8: "",
    q9: "",
    q10: "",
    time: 0,
    result: 0,
  });

  const correctAnswers = {
    q1: "option2",
    q2: "option2",
    q3: "option3",
    q4: "option1",
    q5: "option1",
    q6: "option2",
    q7: "option1",
    q8: "option3",
    q9: "option2",
    q10: "option2",
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      contact: "",
    },
    validationSchema,
    onSubmit: (values) => {
      // Handle form submission here
      console.log(values);
    },
  });

  const handleNameChange = (e) => {
    const { name, value } = e.target;

    // Create a copy of the errors object to avoid mutating it directly
    const updatedErrors = { ...errors };

    if (value.trim() === "") {
      updatedErrors[name] = "Name is required";
      setIsNameValid(false);
    } else if (!/^[A-Za-z\s]+$/.test(value)) {
      updatedErrors[name] = "Name should only contain letters and spaces";
      setIsNameValid(false);
    } else {
      delete updatedErrors[name];
      setIsNameValid(true);
    }

    // Update the errors state with the updatedErrors object
    setErrors(updatedErrors);
    setFormData({ ...formData, [name]: value });
  };

  const handleEmailChange = (e) => {
    const { name, value } = e.target;

    // Create a copy of the errors object to avoid mutating it directly
    const updatedErrors = { ...errors };

    if (value.trim() === "") {
      updatedErrors[name] = "Email is required";
      setIsEmailValid(false);
    } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value)) {
      updatedErrors[name] = "Invalid email format";
      setIsEmailValid(false);
    } else {
      delete updatedErrors[name];
      setIsEmailValid(true);
    }

    // Update the errors state with the updatedErrors object
    setErrors(updatedErrors);
    setFormData({ ...formData, [name]: value });
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;

    // Create a copy of the errors object to avoid mutating it directly
    const updatedErrors = { ...errors };

    if (value.trim() === "") {
      updatedErrors[name] = "Contact number is required";
      setIsContactValid(false);
    } else if (!/^\d{10}$/.test(value)) {
      // Use ^\d{10}$ to match exactly 10 digits
      updatedErrors[name] = "Contact number must be 10 digits";
      setIsContactValid(false);
    } else {
      delete updatedErrors[name]; // Remove the error if the input is valid
      setIsContactValid(true);
    }

    // Update the errors state with the updatedErrors object
    setErrors(updatedErrors);
    setFormData({ ...formData, [name]: value });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsTestSeen(false);
    setIsTimerStarted(false);
    Object.keys(correctAnswers).forEach((question) => {
      if (formData[question] === correctAnswers[question]) {
        formData.result = Number(formData.result + 1);
        console.log(formData.result);
      }
    });

    formData.time = 600 - timeRemaining;
    // setFormData({...formData,time: (timeRemaining)})
    alert("Form submitted. Time remaining: " + timeRemaining);
    console.log("Form submitted. Time remaining: " + timeRemaining);
    try {
      const response = await axios.post(
        "https://sheetdb.io/api/v1/ivyccp59wbjb2",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        console.log("Submission successful");
        setIsSubmitted(true);
        setPageVisible(false);
        // sendEmail();
      } else {
        console.error("Submission failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setIsLoading(false);
  };

  const isValidUser = async () => {
    try {
      const response = await axios.get(
        "https://sheetdb.io/api/v1/ivyccp59wbjb2",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const users = response.data;

        for (const user of users) {
          if (user.email === formData.email) {
            alert("Response already submitted as " + formData.email);
            setIsSubmitted(true);
            setIsLoggedIn(true);
            return false;
          }
        }
        return true;
      } else {
        console.error("fetching Users Failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const startTimer = async () => {
    setIsLoading(true);

    const userCheck = await isValidUser();
    // const userCheck = true;
    if (userCheck) {
      setIsLoggedIn(true);
      const validationErrors = validateField();

      if (Object.keys(validationErrors).length === 0) {
        alert("Test Started");
        setIsTestSeen(true);
        setIsTimerStarted(true);
      } else {
        setErrors(validationErrors);
      }
    }
    setIsLoading(false);
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
    const emailService = "service_ih7q3va";
    const emailTemplate = "template_te5sfsh";
    const publicKey = "j5620AwIS6ggaQvCTSwSI";

    const templateParams = {
      from_name: "Non Criterion Technology",
      to_email: formData.email,
      to_name: formData.name,
    };

    emailjs
      .send(emailService, emailTemplate, templateParams, publicKey)
      .then((response) => {
        console.log("Email sent successfully:", response);
      })
      .catch((error) => {
        console.error("Email sending failed:", error);
      });
  };

  const validateField = () => {
    const errors = {};

    return errors;
  };

  return (
    <div className="container mt-5">
      <img src={logo} className="img-fluid mx-auto d-block" alt="..." />

      {isTimerStarted && (
        <div
          className="timer"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            color: "black",
            paddingTop: "20px",
          }}
        >
          <CountdownCircleTimer
            duration={timeRemaining}
            colors={[["#FF0000", 0.33]]}
            onComplete={handleSubmit}
            size={100}
            strokeWidth={10}
            isLinearGradient={false}
            trailColor="#f0f0f0"
            trailStrokeWidth={10}
            strokeLinecap="butt"
            onTick={onTick}
          >
            {({ remainingTime }) => (
              <div className="timer-txt">
                <a>
                  {Math.floor(remainingTime / 60)}:{remainingTime % 60}
                </a>
              </div>
            )}
          </CountdownCircleTimer>
        </div>
      )}
      {/*<div className="timer" id='timer'></div>*/}
      {/*<Timer/>*/}
      <form>
        <>
          {pageVisible && !isLoggedIn && (
            <>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name:
                </label>
                <input
                  type="text"
                  placeholder="Enter your Name here"
                  className={`form-control ${
                    isNameValid
                      ? "is-valid"
                      : isNameValid === false
                      ? "is-invalid"
                      : ""
                  }`}
                  id="name"
                  name="name"
                  onChange={handleNameChange}
                  value={formData.name}
                  required
                />

                <div className="invalid-feedback">
                  Please provide valid input.
                </div>
                <div className="valid-feedback">Looks good!</div>
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email:
                </label>
                <input
                  type="email"
                  placeholder="Enter your Email here"
                  className={`form-control ${
                    isEmailValid
                      ? "is-valid"
                      : isEmailValid === false
                      ? "is-invalid"
                      : ""
                  }`}
                  id="email"
                  name="email"
                  onChange={handleEmailChange}
                  value={formData.email}
                  required
                />

                <div className="invalid-feedback">
                  Please provide valid input.
                </div>
                <div className="valid-feedback">Looks good!</div>
              </div>
              <div className="mb-3">
                <label htmlFor="contact" className="form-label">
                  Contact No.:
                </label>
                <input
                  type="text"
                  placeholder="Enter your contact here"
                  className={`form-control ${
                    isContactValid
                      ? "is-valid"
                      : isContactValid === false
                      ? "is-invalid"
                      : ""
                  }`}
                  id="contact"
                  name="contact"
                  onChange={handleContactChange}
                  value={formData.contact}
                  required
                />

                <div className="invalid-feedback">
                  Please provide valid input.
                </div>
                <div className="valid-feedback">Looks good!</div>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={startTimer}
                  disabled={!(isNameValid && isEmailValid && isContactValid)}
                >
                  {isLoading ? "Loading..." : "Start Test"}
                  {isLoading && (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  )}
                </button>
              </div>
            </>
          )}

          {isTestSeen && (
            <>
              <div className="question">
                <div className="mb-3">
                  <label htmlFor="question1" className="form-label">
                    Question 1: If a laptop is originally priced at $1200 and is
                    on sale for 20% off, what is the sale price of the laptop?
                  </label>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="q1"
                      id="q1-option1"
                      onChange={handleChange}
                      value="option1"
                    />
                    <label className="form-check-label" htmlFor="q1-option1">
                      a) $960
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="q1"
                      id="q1-option2"
                      onChange={handleChange}
                      value="option2"
                    />
                    <label className="form-check-label" htmlFor="q1-option2">
                      b) $1080
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="q1"
                      id="q1-option3"
                      onChange={handleChange}
                      value="option3"
                    />
                    <label className="form-check-label" htmlFor="q1-option3">
                      c) $1000
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="q1"
                      id="q1-option4"
                      onChange={handleChange}
                      value="option4"
                    />
                    <label className="form-check-label" htmlFor="q1-option4">
                      d) $960
                    </label>
                  </div>
                </div>
              </div>

              <div className="question">
                <div className="mb-3">
                  <label htmlFor="question2" className="form-label">
                    Question 2: A smartphone is initially priced at $800, and it
                    is on sale for 25% off. If a customer has a 15% off coupon,
                    what is the final price of the smartphone?
                  </label>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="q2"
                      id="q2-option1"
                      onChange={handleChange}
                      value="option1"
                    />
                    <label className="form-check-label" htmlFor="q2-option1">
                      a) $510
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="q2"
                      id="q2-option2"
                      onChange={handleChange}
                      value="option2"
                    />
                    <label className="form-check-label" htmlFor="q2-option2">
                      b) $540
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="q2"
                      id="q2-option3"
                      onChange={handleChange}
                      value="option3"
                    />
                    <label className="form-check-label" htmlFor="q2-option3">
                      c) $560
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="q2"
                      id="q2-option4"
                      onChange={handleChange}
                      value="option4"
                    />
                    <label className="form-check-label" htmlFor="q2-option4">
                      d) $580
                    </label>
                  </div>
                </div>
              </div>

              <div className="question">
                <div className="mb-3">
                  <label htmlFor="question3" className="form-label">
                    Question 3: If a project is scheduled to be completed in 10
                    weeks and 40% of the work has been finished, how many weeks
                    are left to complete the project?
                  </label>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="q3"
                      id="q3-option1"
                      onChange={handleChange}
                      value="option1"
                    />
                    <label className="form-check-label" htmlFor="q3-option1">
                      a) 4.0 weeks
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="q3"
                      id="q3-option2"
                      onChange={handleChange}
                      value="option2"
                    />
                    <label className="form-check-label" htmlFor="q3-option2">
                      b) 5.0 weeks
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="q3"
                      id="q3-option3"
                      onChange={handleChange}
                      value="option3"
                    />
                    <label className="form-check-label" htmlFor="q3-option3">
                      c) 6.0 weeks
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="q3"
                      id="q3-option4"
                      onChange={handleChange}
                      value="option4"
                    />
                    <label className="form-check-label" htmlFor="q3-option4">
                      d) 7.0 weeks
                    </label>
                  </div>
                </div>
              </div>

              <div className="question">
                <div className="mb-3">
                  <label htmlFor="question4" className="form-label">
                    Question 4: If a product's price is increased by 10%, and
                    its new price is $110, what was the original price?
                  </label>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="q4"
                      id="q4-option1"
                      onChange={handleChange}
                      value="option1"
                    />
                    <label className="form-check-label" htmlFor="q4-option1">
                      a) $99
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="q4"
                      id="q4-option2"
                      onChange={handleChange}
                      value="option2"
                    />
                    <label className="form-check-label" htmlFor="q4-option2">
                      b) $100
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="q4"
                      id="q4-option3"
                      onChange={handleChange}
                      value="option3"
                    />
                    <label className="form-check-label" htmlFor="q4-option3">
                      c) $100.10
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="q4"
                      id="q4-option4"
                      onChange={handleChange}
                      value="option4"
                    />
                    <label className="form-check-label" htmlFor="q4-option4">
                      d) $100.50
                    </label>
                  </div>
                </div>
              </div>

              <div className="question">
                <div className="mb-3">
                  <label htmlFor="question5" className="form-label">
                    Question 5: A class of 50 students took a test, and 80% of
                    the students passed. How many students failed the test?
                  </label>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="q5"
                      id="q5-option1"
                      onChange={handleChange}
                      value="option1"
                    />
                    <label className="form-check-label" htmlFor="q5-option1">
                      a) 5
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="q5"
                      id="q5-option2"
                      onChange={handleChange}
                      value="option2"
                    />
                    <label className="form-check-label" htmlFor="q5-option2">
                      b) 8
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="q5"
                      id="q5-option3"
                      onChange={handleChange}
                      value="option3"
                    />
                    <label className="form-check-label" htmlFor="q5-option3">
                      c) 10
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="q5"
                      id="q5-option4"
                      onChange={handleChange}
                      value="option4"
                    />
                    <label className="form-check-label" htmlFor="q5-option4">
                      d) 12
                    </label>
                  </div>
                </div>
              </div>

              <div className="question">
                <div className="mb-3">
                  <label htmlFor="question6" className="form-label">
                    Question 6: If a company's revenue increased from $600,000
                    in one year to $750,000 in the following year, what is the
                    percentage increase in revenue?
                  </label>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="q6"
                      id="q6-option1"
                      onChange={handleChange}
                      value="option1"
                    />
                    <label className="form-check-label" htmlFor="q6-option1">
                      a) 20%
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="q6"
                      id="q6-option2"
                      onChange={handleChange}
                      value="option2"
                    />
                    <label className="form-check-label" htmlFor="q6-option2">
                      b) 25%
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="q6"
                      id="q6-option3"
                      onChange={handleChange}
                      value="option3"
                    />
                    <label className="form-check-label" htmlFor="q6-option3">
                      c) 30%
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="q6"
                      id="q6-option4"
                      onChange={handleChange}
                      value="option4"
                    />
                    <label className="form-check-label" htmlFor="q6-option4">
                      d) 35%
                    </label>
                  </div>
                </div>
              </div>

              <div className="question">
                <div className="mb-3">
                  <label htmlFor="question7" className="form-label">
                    Question 7: If you are facing North and you turn 90 degrees
                    clockwise, which direction are you facing now?
                  </label>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="q7"
                      id="q7-option1"
                      onChange={handleChange}
                      value="option1"
                    />
                    <label className="form-check-label" htmlFor="q7-option1">
                      a) North
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="q7"
                      id="q7-option2"
                      onChange={handleChange}
                      value="option2"
                    />
                    <label className="form-check-label" htmlFor="q7-option2">
                      b) East
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="q7"
                      id="q7-option3"
                      onChange={handleChange}
                      value="option3"
                    />
                    <label className="form-check-label" htmlFor="q7-option3">
                      c) West
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="q7"
                      id="q7-option4"
                      onChange={handleChange}
                      value="option4"
                    />
                    <label className="form-check-label" htmlFor="q7-option4">
                      d) South
                    </label>
                  </div>
                </div>
              </div>

              <div className="question">
                <div className="mb-3">
                  <label htmlFor="question8" className="form-label">
                    Question 8: What is the time complexity of searching for an
                    element in an unsorted array of 'n' elements?
                  </label>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="q8"
                      id="q8-option1"
                      onChange={handleChange}
                      value="option1"
                    />
                    <label className="form-check-label" htmlFor="q8-option1">
                      a) O(1)
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="q8"
                      id="q8-option2"
                      onChange={handleChange}
                      value="option2"
                    />
                    <label className="form-check-label" htmlFor="q8-option2">
                      b) O(log n)
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="q8"
                      id="q8-option3"
                      onChange={handleChange}
                      value="option3"
                    />
                    <label className="form-check-label" htmlFor="q8-option3">
                      c) O(n)
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="q8"
                      id="q8-option4"
                      onChange={handleChange}
                      value="option4"
                    />
                    <label className="form-check-label" htmlFor="q8-option4">
                      d) O(n^2)
                    </label>
                  </div>
                </div>
              </div>

              <div className="question">
                <div className="mb-3">
                  <label htmlFor="question9" className="form-label">
                    Question 9: Which programming language is commonly used for
                    client-side web development?
                  </label>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="q9"
                      id="q9-option1"
                      onChange={handleChange}
                      value="option1"
                    />
                    <label className="form-check-label" htmlFor="q9-option1">
                      a) Python
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="q9"
                      id="q9-option2"
                      onChange={handleChange}
                      value="option2"
                    />
                    <label className="form-check-label" htmlFor="q9-option2">
                      b) Ruby
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="q9"
                      id="q9-option3"
                      onChange={handleChange}
                      value="option3"
                    />
                    <label className="form-check-label" htmlFor="q9-option3">
                      c) JavaScript
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="q9"
                      id="q9-option4"
                      onChange={handleChange}
                      value="option4"
                    />
                    <label className="form-check-label" htmlFor="q9-option4">
                      d) Java
                    </label>
                  </div>
                </div>
              </div>

              <div className="question">
                <div className="mb-3">
                  <label htmlFor="question10" className="form-label">
                    Question 10: What is the output of the following code
                    snippet in any programming language? a = 5 b = 3 print(a %
                    b)
                  </label>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="q10"
                      id="q10-option1"
                      onChange={handleChange}
                      value="option1"
                    />
                    <label className="form-check-label" htmlFor="q10-option1">
                      a) 2
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="q10"
                      id="q10-option2"
                      onChange={handleChange}
                      value="option2"
                    />
                    <label className="form-check-label" htmlFor="q10-option2">
                      b) 1
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="q10"
                      id="q10-option3"
                      onChange={handleChange}
                      value="option3"
                    />
                    <label className="form-check-label" htmlFor="q10-option3">
                      c) 0
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="q10"
                      id="q10-option4"
                      onChange={handleChange}
                      value="option4"
                    />
                    <label className="form-check-label" htmlFor="q10-option4">
                      d) 3
                    </label>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="btn btn-primary"
                >
                  {isLoading ? "Loading..." : "Submit"}
                  {isLoading && (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  )}
                </button>
                <br/>
                <br/>
              </div>
            </>
          )}
          {isSubmitted && (
            <>
              <div className="alert alert-success text-center">
                <h1 className="display-4">Thank You!</h1>
                <p>Your submission has been received.</p>
                <a
                  href="https://www.ilomatechnology.com"
                  className="btn btn-primary"
                  role="button"
                >
                 Visit Our Website
                </a>
              </div>
            </>
          )}
        </>
      </form>
    </div>
  );
}
