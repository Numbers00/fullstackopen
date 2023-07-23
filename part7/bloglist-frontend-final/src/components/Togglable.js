import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

import { useState, useImperativeHandle, forwardRef } from 'react';

const Togglable = forwardRef((props, refs) => {
  const [isVisible, setIsVisible] = useState(false);

  const showWhenVisible = { display: isVisible ? '' : 'none' };
  const hideWhenVisible = { display: isVisible ? 'none' : '' };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility
    };
  });

  return (
    <>
      <div style={hideWhenVisible}>
        <Button
          type='button'
          variant='primary'
          onClick={() => setIsVisible(true)}
        >
          {props.buttonLabel}
        </Button>
      </div>
      <div style={showWhenVisible}>
        <Button
          type='button'
          variant='primary'
          onClick={() => setIsVisible(false)}
        >
          Hide <b>{props.buttonLabel}</b>
        </Button>
        {props.children}
      </div>
    </>
  );
});

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
};
Togglable.displayName = 'Togglable';

export default Togglable;