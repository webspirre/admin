import { useState } from "react";
interface DeleteModalProps {
  isOpen: boolean;
  designName: string;
  onClose: () => void;
  onConfirm: () => void;
}
const DeleteSingleModal: React.FC<DeleteModalProps> = ({
  isOpen,
  designName,
  onClose,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(); // assuming onConfirm is an async operation
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
        <p>
          Are you sure you want to delete the design with Name{" "}
          <strong>{designName}</strong>?
        </p>
        <div className="mt-6 flex justify-end">
          <button
            className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md mr-2"
            onClick={onClose}
            disabled={isDeleting} // disable cancel button when deleting
          >
            Cancel
          </button>
          <button
            className={`bg-red-500 text-white py-2 px-4 rounded-md flex items-center justify-center ${
              isDeleting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleDelete}
            disabled={isDeleting} // disable the button during delete
          >
            {isDeleting ? (
              <svg
                className="animate-spin h-5 w-5 text-white mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.963 7.963 0 014 12H0c0 2.137.835 4.087 2.209 5.541l1.791-1.25z"
                />
              </svg>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteSingleModal;
