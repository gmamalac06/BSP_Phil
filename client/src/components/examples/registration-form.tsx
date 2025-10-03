import { RegistrationForm } from "../registration-form";

export default function RegistrationFormExample() {
  return (
    <div className="p-8 bg-background">
      <div className="max-w-2xl mx-auto">
        <RegistrationForm onSubmit={(data) => console.log("Submitted:", data)} />
      </div>
    </div>
  );
}
