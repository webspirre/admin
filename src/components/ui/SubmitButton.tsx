interface SubmitButtonProps {
  isSubmitting: boolean;
  formData: any;
  submitContent?: string[];
}

const SubmitButton = ({
  isSubmitting,
  formData,
  submitContent = ["Submit", "Submitting Design..."],
}: SubmitButtonProps) => {
  const {
    name,
    webURL,
    pageType,
    shortDescription,
    longDescription,
    logoImageURL,
    desktopFpURL,
    mobileFpURL,
    categories,
    date,
  } = formData;
  const requiredFields = [
    name,
    webURL,
    categories,
    pageType,
    shortDescription,
    longDescription,
    logoImageURL,
    desktopFpURL,
    mobileFpURL,
    date,
  ];
  const isFormValid = () => requiredFields.every((x) => x !== "");
  return (
    <button
      type="submit"
      className="bg-black text-white px-[50px] py-2 rounded-lg disabled:bg-opacity-35 disabled:cursor-not-allowed"
      disabled={!isFormValid()}
    >
      {isSubmitting ? (
        <div className="flex items-center">
          <div className="loader"></div>
          <span className="ml-2">{submitContent[1]}</span>
        </div>
      ) : (
        submitContent[0]
      )}
    </button>
  );
};

export default SubmitButton;
// [name, book, shelf].every(x => x !== '')
// [!(name), !(book), !(shelf)].every(Boolean)
