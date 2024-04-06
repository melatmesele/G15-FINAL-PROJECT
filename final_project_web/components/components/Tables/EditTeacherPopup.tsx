import React, { useEffect } from "react";
import { Field, reduxForm, InjectedFormProps, reset } from "redux-form";
import { Teacher, updateTeacher } from "@/store/admin/get-all-teachers"; // Import the updateTeacher function
import {
  FaEnvelope,
  FaIdBadge,
  FaToggleOn,
  FaUser,
  FaUserTag,
  FaUsers,
} from "react-icons/fa";
import { useDispatch } from "react-redux";

import { showToast } from "@/components/popup";

interface OwnProps {
  teacher: Teacher;
  onClose: () => void;
  onSave: (teacher: Teacher) => void;
}

interface FormTeacher extends Omit<Teacher, "SectionsOfUser"> {
  SectionsOfUser: string; // Treat SectionsOfUser as a string for the form
}

// This interface now correctly extends InjectedFormProps, defining the form's value type and the component's own props.
interface FormProps
  extends InjectedFormProps<FormTeacher, OwnProps>,
    OwnProps {}
const validate = (
  values: FormTeacher
): Partial<Record<keyof FormTeacher, string>> => {
  const errors: Partial<Record<keyof FormTeacher, string>> = {};
  if (!values.fullName) {
    errors.fullName = "Please enter a username.";
  }
  if (!values.userId) {
    errors.userId = "Please enter a user ID.";
  }
  if (!values.email) {
    errors.email = "Please enter an email.";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!values.SectionsOfUser || values.SectionsOfUser.length === 0) {
    errors.SectionsOfUser = "Please enter at least one section.";
  }

  if (!values.role) {
    errors.role = "Please select a role.";
  }
  if (!values.status) {
    errors.status = "Please select a status.";
  }

  return errors;
};

const renderField = ({
  input,
  type,
  placeholder,
  meta: { touched, error },
  iconName,
}: any) => (
  <div className="flex flex-col mb-4">
    <div className="flex align-center border-b-2 border-gray-300 focus-within:border-blue-500">
      <div className="text-xl text-gray-700 p-2">
        {React.createElement(iconName)}
      </div>
      {type === "select" ? (
        <select
          {...input}
          placeholder={placeholder}
          className="flex-1 p-2 outline-none"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {/* Check the type to determine which options to render */}
          {input.name === "role" && (
            <>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </>
          )}
          {input.name === "status" && (
            <>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </>
          )}
        </select>
      ) : (
        <input
          {...input}
          type={type}
          className="flex-1 p-2 outline-none"
          placeholder={placeholder}
        />
      )}
    </div>
    {touched && error && <span className="text-red-500 text-xs">{error}</span>}
  </div>
);

export const EditTeacherPopup: React.FC<FormProps> = (props) => {
  const { handleSubmit, teacher, onClose, onSave, initialize } = props;
  const dispatch = useDispatch(); // Use useDispatch to get the dispatch function

  const handlePopupClose = () => {
    dispatch(reset("editteacher")); // Dispatch the reset action with your form name
    onClose(); // Then call the onClose prop to close the popup
  };
  const sectionsPlaceholder = teacher.SectionsOfUser?.map(sec => sec.section).join(", ") || "Enter sections";
 

  // Define onSubmit within the component to use closure variables
  const onSubmit = async (values: FormTeacher) => {
    console.log("Test submission with values:", values);
    const { id } = props.teacher; // Directly using the ID from props

    if (!id) {
      showToast("Error: Undefined teacher ID.", "error");
      console.error("Teacher ID is undefined.");
      return; // Exit if ID is undefined
    }

    const submissionValues: Partial<Teacher> = {
      ...values,
      SectionsOfUser: values.SectionsOfUser.split(", ").map((sectionStr) => ({
        section: sectionStr.trim(),
      })),
    };
    console.log("Sending updateData to server:", submissionValues);

    try {
      const updatedTeacher = await updateTeacher(id, submissionValues);
      console.log("Updated teacher from server:", updatedTeacher);

      showToast("Teacher updated successfully", "success");
      props.onSave({ ...props.teacher, ...submissionValues, id });
      props.onClose();
    } catch (error) {
      showToast("Update error: " + (error as Error).message, "error");
      console.error("Update error:", error);
    }
  };
  
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl mx-auto bg-white rounded-xl shadow-2xl p-6 md:p-8 lg:p-12 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            Edit User
          </h2>
          <div className="grid grid-cols-1 gap-6">
            <Field
              name="fullName"
              component={renderField}
              type="text"
              placeholder={teacher.fullName || "Full Name"}
              iconName={FaUser}
            />
            <Field
              name="userId"
              component={renderField}
              type="text"
              placeholder={teacher.userId || "User ID"}
              iconName={FaIdBadge}
            />
            <Field
              name="email"
              component={renderField}
              type="email"
              placeholder={teacher.email || "User ID"}
              iconName={FaEnvelope}
            />
            <Field
              name="SectionsOfUser"
              component={renderField}
              type="text"
              placeholder={
                sectionsPlaceholder 
              }
              iconName={FaUsers}
            />
            <Field
              name="role"
              component={renderField}
              type="select"
              iconName={FaUserTag}
              placeholder={teacher.role || "Role"}
            >
              <option value="" disabled>
              {teacher.role || "Role"}
              </option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </Field>
            <Field
              name="status"
              component={renderField}
              type="select"
              iconName={FaToggleOn}
              placeholder={teacher.status || "Status"}
            >
              <option value="" disabled>
              {teacher.status || "Status"}
              </option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Field>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="btn btn-outline btn-error border-2 border-[#7983FB] rounded-xl hover:bg-[#919AF3] text-black py-2 px-4"
              onClick={handlePopupClose}
            >
              Cancel
            </button>
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
  );
};

export default reduxForm<FormTeacher, OwnProps>({
  form: "editteacher",
  validate,
  enableReinitialize: true,
})(EditTeacherPopup);
 