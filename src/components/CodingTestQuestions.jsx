import React, { useState } from 'react';

const CodingTestQuestions = ({ questions, handleChange, handleSubmit, isLoading }) => {
  return (
    <div>
      {questions.map((question, index) => (
        <div key={`question${index}`} className="question">
          <div className="mb-3">
            <label htmlFor={`question${index + 1}`} className="form-label">{`Question ${index + 1}: ${question.questionText}`}</label>
            <code>
              <br />
              {question.codeSnippet}
            </code>
            {question.options.map((option, optionIndex) => (
              <div key={`q${index + 1}-option${optionIndex}`} className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  name={`q${index + 1}`}
                  id={`q${index + 1}-option${optionIndex + 1}`}
                  onChange={handleChange}
                  value={`option${optionIndex + 1}`}
                />
                <label className="form-check-label" htmlFor={`q${index + 1}-option${optionIndex + 1}`}>
                  {`Option ${optionIndex + 1}: ${option}`}
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className='text-center'>
        <button type="button" onClick={handleSubmit} className="btn btn-primary">
          {isLoading ? 'Loading...' : 'Submit'}
        </button>
        {isLoading && (
          <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
        )}
      </div>
    </div>
  );
};

export default CodingTestQuestions;
