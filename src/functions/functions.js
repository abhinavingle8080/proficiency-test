// const handleChange = (event) => {
//     const {name, value} = event.target;
//     setFormData({...formData, [name]: value});
//
//     validateField(name, value);
//     if (errors[name]) {
//         setErrors({...errors, [name]: ''});
//     }
// };
//
//
// const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsTestSeen(false);
//     setIsTimerStarted(false);
//     Object.keys(correctAnswers).forEach((question) => {
//         if (formData[question] === correctAnswers[question]) {
//             formData.result = (Number)(formData.result + 1);
//         }
//     });
//
//     formData.time = (600 - timeRemaining);
//     // setFormData({...formData,time: (timeRemaining)})
//     alert('Form submitted. Time remaining: ' + timeRemaining);
//     console.log('Form submitted. Time remaining: ' + timeRemaining);
//     try {
//         const response = await axios.post('https://sheetdb.io/api/v1/4h45jinzc2j7w', formData, {
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         })
//
//         if (response.status === 201 || response.status === 200) {
//             console.log('Submission successful');
//             setIsSubmitted(true);
//             setPageVisible(false);
//             sendEmail();
//         } else {
//             console.error('Submission failed');
//         }
//     } catch (error) {
//         console.error('Error:', error);
//     }
// };
//
//
// const isValidUser = async () => {
//     try {
//         const response = await axios.get('https://sheetdb.io/api/v1/4h45jinzc2j7w', formData, {
//             headers: {
//
//
//                 'Content-Type': 'application/json',
//             },
//         });
//
//         if (response.status === 200) {
//             const users = response.data;
//
//
//             for (const user of users) {
//                 if (user.email === formData.email) {
//
//                     alert('Response already submitted as ' + formData.email);
//                     setIsSubmitted(true);
//                     setIsLoggedIn(false);
//                     return false;
//                 }
//             }
//             return true;
//         } else {
//             console.error('fetching Users Failed');
//         }
//     } catch (error) {
//         console.error('Error:', error);
//
//     }
// }
//
// const startTimer = async () => {
//     const userCheck = await isValidUser();
//     console.log(userCheck);
//     if (userCheck) {
//         setIsLoggedIn(true);
//         const validationErrors = validateField();
//
//         if (Object.keys(validationErrors).length === 0) {
//
//             alert('Test Started');
//             setIsTestSeen(true);
//             setIsTimerStarted(true);
//         } else {
//             setErrors(validationErrors);
//         }
//     }
// };
//
//
// const onTick = () => {
//
//     if (timeRemaining > 0) {
//         setTimeRemaining(timeRemaining - 1);
//     } else {
//         setIsTimerOver(true);
//     }
// };
// useEffect(() => {
//     if (isTimerOver) {
//         handleSubmit();
//     }
// }, [isTimerOver]);
//
//
// useEffect(() => {
//     let timer;
//     if (isTimerStarted && timeRemaining > 0) {
//         timer = setTimeout(onTick, 1000);
//     }
//
//     return () => {
//         clearTimeout(timer);
//     };
// }, [isTimerStarted, timeRemaining]);
//
// const sendEmail = () => {
//     const emailService = 'service_t33fhl5';
//     const emailTemplate = 'template_7eak69o';
//     const publicKey = 'FOAVB-jIi70KcBSWP';
//
//     const templateParams = {
//         from_name: 'Non Criterion Technology',
//         to_email: formData.email,
//         to_name: formData.name,
//     }
//
//     emailjs
//         .send(emailService, emailTemplate, templateParams, publicKey)
//         .then((response) => {
//             console.log('Email sent successfully:', response);
//         })
//         .catch((error) => {
//             console.error('Email sending failed:', error);
//         });
// };
//
// const validateField = () => {
//     const errors = {};
//
//     if (formData.name.trim() === '') {
//         errors.name = 'Name is required';
//     } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
//         errors.name = 'Name should only contain letters and spaces';
//     }
//
//     if (formData.contact.trim() === '') {
//         errors.contact = 'contact number is required';
//     } else if (!/^\d{10}$/.test(formData.contact)) {
//         errors.contact = 'contact number must be 10 digits';
//     }
//
//     if (formData.email.trim() === '') {
//         errors.email = 'Email is required';
//     } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(formData.email)) {
//         errors.email = 'Invalid email format';
//     }
//
//     return errors;
// };