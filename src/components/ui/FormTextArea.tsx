interface FormTextareaProps {
  label: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
}

const FormTextarea = ({
  label,
  name,
  placeholder,
  value,
  onChange,
  required = false,
}: FormTextareaProps) => {
  return (
    <div className="w-full py-8">
      <label htmlFor={name}>{label}</label>
      <textarea
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        required={required}
        className="border-2 rounded-lg p-4 w-full"
      />
    </div>
  );
};

export default FormTextarea;
