type FormInputProps = {
    label: string
    type: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
    required?: boolean
}

const inputClass =
    'w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none'

export function FormInput({ label, type, value, onChange, placeholder, required }: FormInputProps) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                className={inputClass}
                placeholder={placeholder}
                required={required}
            />
        </div>
    )
}
