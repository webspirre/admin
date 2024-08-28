import React from "react";

interface TErrorMessage {
  message: string;
}

const ErrorMessage: React.FC<TErrorMessage> = ({ message }) => {
  let content = message && (
    <div className="mt-2 text-sm text-red-600 bg-red-100 py-2 px-4 rounded-lg">
      <p className="font-medium">{message}</p>
    </div>
  );
  return content;
};

export default ErrorMessage;
