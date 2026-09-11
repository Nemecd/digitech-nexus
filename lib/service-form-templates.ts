export type FormField = {
  name: string;
  label: string;
  type: "text" | "date" | "select" | "tel" | "email";
  options?: string[];
};

export type RepeatableGroupField = {
  name: string;
  label: string;
  type: "group";
  itemLabel: string;      // e.g. "Trustee" — used for "Add another Trustee"
  minItems: number;
  fields: FormField[];    // the sub-fields per item
};

export type AnyField = FormField | RepeatableGroupField;


export const FORM_TEMPLATES: Record<string, { label: string; fields: AnyField[]; fileHint: string }> = {
  nin_retrieval: {
    label: "NIN Retrieval",
    fields: [
      { name: "phone_registered", label: "Phone Number Used to Register the NIN", type: "tel" },
      { name: "full_name", label: "Full Name", type: "text" },
      { name: "dob", label: "Date of Birth", type: "date" },
      { name: "gender", label: "Gender", type: "select", options: ["Male", "Female"] },
    ],
    fileHint: "No documents required for this service.",
  },
  nin_slip_reprint: {
    label: "NIN Slip Reprint",
    fields: [
      { name: "nin_number", label: "NIN Number (or leave blank if unknown)", type: "text" },
      { name: "phone_registered", label: "Phone Number Used to Register the NIN", type: "tel" },
      { name: "full_name", label: "Full Name", type: "text" },
      { name: "dob", label: "Date of Birth", type: "date" },
      { name: "gender", label: "Gender", type: "select", options: ["Male", "Female"] },
    ],
    fileHint: "No documents required for this service.",
  },
  nin_validation: {
    label: "NIN Validation",
    fields: [{ name: "nin_number", label: "NIN Number", type: "text" }],
    fileHint: "No documents required for this service.",
  },
  nin_correction_name: {
    label: "Correction of Name",
    fields: [
      { name: "nin_number", label: "NIN Number", type: "text" },
      { name: "full_name", label: "Full Name (corrected)", type: "text" },
      { name: "home_address", label: "Home Address", type: "text" },
      { name: "gender", label: "Gender", type: "select", options: ["Male", "Female"] },
      { name: "phone", label: "Phone Number", type: "tel" },
      { name: "email", label: "Email Address", type: "email" },
    ],
    fileHint: "Please upload a bright passport photograph.",
  },
  nin_correction_phone: {
    label: "Correction of Phone Number",
    fields: [
      { name: "nin_number", label: "NIN Number", type: "text" },
      { name: "full_name", label: "Full Name", type: "text" },
      { name: "old_phone", label: "Old Phone Number", type: "tel" },
      { name: "new_phone", label: "New Phone Number", type: "tel" },
      { name: "home_address", label: "Home Address", type: "text" },
      { name: "gender", label: "Gender", type: "select", options: ["Male", "Female"] },
      { name: "email", label: "Email Address", type: "email" },
    ],
    fileHint: "Please upload a bright passport photograph.",
  },
  nin_correction_dob: {
    label: "Correction of Date of Birth",
    fields: [
      { name: "nin_number", label: "NIN Number", type: "text" },
      { name: "wrong_dob", label: "Wrong Date of Birth", type: "date" },
      { name: "correct_dob", label: "Correct Date of Birth", type: "date" },
      { name: "full_name", label: "Full Name", type: "text" },
      { name: "residential_address", label: "Residential Address", type: "text" },
      { name: "home_address", label: "Home Address", type: "text" },
      { name: "occupation", label: "Occupation", type: "text" },
      { name: "qualification", label: "Highest Level of Qualification", type: "text" },
      { name: "work_address", label: "Address of Place of Work", type: "text" },
      { name: "father_name", label: "Father's Name", type: "text" },
      { name: "mother_name", label: "Mother's Name", type: "text" },
      { name: "state_of_origin", label: "State of Origin", type: "text" },
      { name: "place_of_birth", label: "Place of Birth", type: "text" },
    ],
    fileHint: "No documents required for this service.",
  },
  cac_business_name: {
    label: "Business Name Registration",
    fields: [
      { name: "proposed_name", label: "Proposed Business Name", type: "text" },
      { name: "nature_of_business", label: "Nature of Business", type: "text" },
      { name: "nin_number", label: "NIN Number", type: "text" },
      { name: "proprietor_name", label: "Full Name of the Proprietor", type: "text" },
      { name: "dob", label: "Date of Birth", type: "date" },
      { name: "occupation", label: "Occupation", type: "text" },
      { name: "gender", label: "Gender", type: "select", options: ["Male", "Female"] },
      { name: "residential_address", label: "Residential Address", type: "text" },
      { name: "business_address", label: "Business Address", type: "text" },
      { name: "phone", label: "Phone Number", type: "tel" },
      { name: "email", label: "Email Address", type: "email" },
    ],
    fileHint: "Please upload a passport photo and a signature.",
  },
  cac_llc: {
    label: "Limited Liability Company Registration",
    fields: [
      { name: "proposed_name", label: "Proposed Company Name", type: "text" },
      { name: "company_address", label: "Company's Address", type: "text" },
      { name: "objectives", label: "Objectives of the Company", type: "text" },
      { name: "directors_names", label: "Directors' Full Names (comma-separated)", type: "text" },
      { name: "directors_nin", label: "NIN Number of Each Director (comma-separated)", type: "text" },
      { name: "dob", label: "Date of Birth", type: "date" },
      { name: "occupation", label: "Occupation", type: "text" },
      { name: "gender", label: "Gender", type: "select", options: ["Male", "Female"] },
      { name: "residential_address", label: "Residential Address", type: "text" },
      { name: "business_address", label: "Business Address", type: "text" },
      { name: "phone", label: "Phone Number", type: "tel" },
      { name: "email", label: "Email Address", type: "email" },
    ],
    fileHint: "Please upload passport photos and signatures for each director.",
  },
   cac_incorporated_trustees: {
    label: "Incorporated Trustees Registration",
    fields: [
      { name: "proposed_name", label: "Proposed Name of the Organisation", type: "text" },
      { name: "objectives", label: "Objectives of the Organisation", type: "text" },
      {
        name: "trustees",
        label: "Trustees",
        type: "group",
        itemLabel: "Trustee",
        minItems: 1,
        fields: [
          { name: "full_name", label: "Full Name", type: "text" },
          { name: "dob", label: "Date of Birth", type: "date" },
          { name: "address", label: "Address", type: "text" },
          { name: "phone", label: "Phone Number", type: "tel" },
          { name: "occupation", label: "Occupation", type: "text" },
          { name: "gender", label: "Gender", type: "select", options: ["Male", "Female"] },
          { name: "nin_number", label: "NIN Number", type: "text" },
        ],
      },
    ],
    fileHint: "Please upload a passport photograph and signature for each trustee.",
  },
};