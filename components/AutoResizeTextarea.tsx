import React, { useRef, useLayoutEffect } from 'react';

interface AutoResizeTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
}

const AutoResizeTextarea: React.FC<AutoResizeTextareaProps> = ({ value, ...props }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to allow shrinking
      textarea.style.height = 'auto';
      // Set height to scroll height
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [value]);

  return <textarea ref={textareaRef} {...props} />;
};

export default AutoResizeTextarea;
