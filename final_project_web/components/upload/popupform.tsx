import React from 'react';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { FaUser, FaIdBadge, FaEnvelope, FaUsers, FaUserTag, FaToggleOn, FaPlus } from 'react-icons/fa';
import { UploadManually, UploadFormData } from '@/store/upload/ApiCallerManuallyupload';
import { showToast } from '../popup';
import { PlusIcon } from '@heroicons/react/24/solid';
import { AiOutlineClose } from 'react-icons/ai';

interface FormValues {
  fullName?: string;
  userId?: string;
  email?: string;
  section?: string[]; 
  role?: string;
  status?: string;
  }
  interface FormValidationErrors {
    fullName?: string;
    userId?: string;
    email?: string;
 
    role?: string;
    status?: string;
  }
  const validate = (values: FormValues): FormValidationErrors => {
    const errors: FormValidationErrors = {};
  
    if (!values.fullName) {
      errors.fullName = 'Please enter a username.';
    }
    if (!values.userId) {
      errors.userId = 'Please enter a user ID.';
    }
    if (!values.email) {
      errors.email = 'Please enter an email.';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Please enter a valid email address.';
    }
   
    if (!values.role) {
      errors.role = 'Please select a role.';
    }
    if (!values.status) {
      errors.status = 'Please select a status.';
    }
   
  
    return errors;
  };
  
  const renderField = ({ input, type, placeholder, meta: { touched, error }, iconName }: any) => (
    <div className="flex flex-col mb-4">
      <div className="flex align-center border-b-2 border-gray-300 focus-within:border-blue-500">
        <div className="text-xl text-gray-700 p-2">
          {React.createElement(iconName)}
        </div>
        {type === 'select' ? (
        <select {...input} placeholder={placeholder} className="flex-1 p-2 outline-none">
          <option value="" disabled>{placeholder}</option>
          {/* Check the type to determine which options to render */}
          {input.name === 'role' && (
            <>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </>
          )}
          {input.name === 'status' && (
            <>
              <option value="active">Active</option>
            </>
          )}
        </select>
 
) : (
  <input {...input} type={type} className="flex-1 p-2 outline-none" placeholder={placeholder} />
)}
      </div>
      {touched && error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );

  interface ExtraProps {
    onUploadSuccess: () => void;
  }
  
  const UploadPopup: React.FC<InjectedFormProps<FormValues, ExtraProps> & ExtraProps> = ({ handleSubmit, onUploadSuccess }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [sections, setSections] = React.useState(['']); 

  const handleSectionChange = (index: number, value: string) => {
    const updatedSections = [...sections];
    updatedSections[index] = value;
    setSections(updatedSections);
  };
  
  const onSubmit = async (values: FormValues, dispatch: Function, props: any) => {
    const formData = {
      ...values,
      section: sections.filter(section => section.trim() !== ''), // Filter out empty strings
    };
    try {
      const data = await UploadManually(formData);
    showToast('Uploaded successfully', 'success');
      setIsOpen(false); 
      onUploadSuccess();
    } catch (error) {
      console.error('Uploading error:', error);
      showToast('Uploading error: ' + (error as Error).message, 'error');
    }
  };

    


  return (
    <div className="flex  justify-center items-center">
       <div className="w-full "> 
       <div className='flex justify-end items-center'>
  <button
    className="text-white bg-gradient-to-r from-[rgb(145,154,243)] to-[#7983FB] hover:bg-gradient-to-br font-bold py-2 md:py-2 px-4 md:px-3 rounded-xl flex items-center shadow-xl transition-transform duration-200 ease-in-out transform hover:scale-105 mr-3 text-xs sm:text-sm md:text-base"
    onClick={() => setIsOpen(true)}
    aria-label="Add" // Accessible label for the button
  >
    <PlusIcon className="h-5 w-5" />
    <span>Add User</span>
  </button>
</div>

</div>

      {isOpen && (
        <div
        className="overflow-x-auto overflow-y-auto fixed inset-0 z-50 overflow bg-black bg-opacity-60 backdrop-blur-md flex justify-center items-center "
        onClick={() => setIsOpen(false)}
      >
        <div
          className="relative w-full max-w-2xl mx-auto bg-white rounded-xl shadow-2xl p-6 md:p-8 lg:p-12 transform transition-all"
          onClick={(e) => e.stopPropagation()}
         
        >
           <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute right-3 text-gray-500 hover:text-gray-800"
                aria-label="Close"
              >
                <AiOutlineClose size={24} />
          </button>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Add New User</h2>
            <div className="grid grid-cols-1 gap-2">
              <Field name="fullName" type="text" component={renderField} placeholder="Full Name" iconName={FaUser} />
            <Field name="userId" type="text" component={renderField} placeholder="User ID" iconName={FaIdBadge} />
            <Field name="email" type="email" component={renderField} placeholder="Email" iconName={FaEnvelope} />
            <p className="flex items-center"><FaUsers className="text-xl text-gray-700 mr-2"/>Section</p>
            {
              sections.map((section, index) => (
                <input
                  key={index}
                  type='number'
                  value={section}
                  onChange={e => handleSectionChange(index, e.target.value)}
                  className="flex-1 p-2 outline-none border rounded"
                  placeholder={`Section ${index + 1}`}
                  required
                />
              ))
            }

            
            <button className="flex w-35 items-center bg-[#7983FB] bg-opacity-30 text-[#7983FB] hover:bg-[#7983FB] hover:bg-opacity-60 font-bold py-2 px-2 rounded-xl   mb-4" onClick={() => setSections([...sections, ''])}><FaPlus className="mr-2" />  Add Section</button>
            <Field
              name="role"
              component={renderField}
              type="select"
              iconName={FaUserTag}
              placeholder="Select a role..."
            >
              <option value="" disabled>Select a role...</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </Field>
            <Field
              name="status"
              component={renderField}
              type="select"
              iconName={FaToggleOn}
              placeholder="Select a status..."
            >
              <option value="" disabled>Select a status...</option>
              <option value="active">Active</option>
             
            </Field>
          </div>
            <div className="flex justify-end space-x-4">
            
              <button
                type="submit"
                className="btn bg-[#7983FB] border-2 hover:bg-[#919AF3] text-white py-2 px-4 rounded-xl font-bold"
              >
                Submit
              </button>
            </div>    
            </form>

        </div>
      </div>
      
      )}
    </div>
  );
};
  
const ConnectedUploadPopup = reduxForm<FormValues, ExtraProps>({
  form: 'uploadpop',
  validate,
})(UploadPopup);

export default ConnectedUploadPopup;



