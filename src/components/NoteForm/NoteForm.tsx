import { useId } from "react";
import css from "./NoteForm.module.css";
import { Formik, Form, Field, type FormikHelpers, ErrorMessage } from "formik";
import * as Yup from "yup";
import type { NewNoteData } from "../../types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../services/noteService";

interface NoteFormProps {
  onClose: () => void;
}

const initialFormValues: NewNoteData = {
  title: "",
  content: "",
  tag: "Todo",
};

export default function NoteForm({ onClose }: NoteFormProps) {
  const fieldId = useId();
  const queryClient = useQueryClient();

  //SENDING FORM ON SUBMIT

  const handleSubmit = (
    values: NewNoteData,
    actions: FormikHelpers<NewNoteData>
  ) => {
    mutate(values);
    actions.resetForm();
  };

  //SENDING

  const { mutate } = useMutation({
    mutationFn: (values: NewNoteData) => createNote(values),
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  //VALIDATION WITH YUP

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required("Title can't be empty")
      .min(3, "Title must be at least 3 characters")
      .max(50, "Title is too long"),

    content: Yup.string().max(500, "Note is too long"),

    tag: Yup.string()
      .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"], "Invalid tag")
      .required("Tag is required"),
  });

  return (
    <Formik
      initialValues={initialFormValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className={css.form}>
        {/* -----Title input field----- */}

        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-title`}>Title</label>
          <Field
            id={`${fieldId}-title`}
            type="text"
            name="title"
            className={css.input}
          />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        {/* -----Content textarea field----- */}

        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-content`}>Content</label>
          <Field
            as="textarea"
            id={`${fieldId}-content`}
            name="content"
            rows="8"
            className={css.textarea}
          />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        {/* -----Select tag field----- */}

        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-tag`}>Tag</label>
          <Field
            as="select"
            id={`${fieldId}-tag`}
            name="tag"
            className={css.select}
          >
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        {/* -----Action buttons----- */}

        <div>
          <button onClick={onClose} type="button" className={css.cancelButton}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={false}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}