interface FormInputProps {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const FormInput = ({
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
  required = false,
}: FormInputProps) => {
  return (
    <div className="w-full py-8">
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        className="border-2 rounded-lg p-4 w-full"
      />
    </div>
  );
};

export default FormInput;
