import React, { useEffect } from 'react';
import './MessageDialog.css'; // Import custom CSS for styling

export function MessageDialog(props) {
  useEffect(() => {
    if (props.message) {
      const timer = setTimeout(() => {
        props.onHide(); // Call onHide after 3 seconds
      }, 3000);

      return () => clearTimeout(timer); // Cleanup the timer if the component unmounts or message changes
    }
  }, [props.message, props.onHide]);

  return (
    props.message && (
      <div className="message-dialog">
        {props.message}
      </div>
    )
  );
}
