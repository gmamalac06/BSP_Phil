import { RegistrationForm } from "@/components/registration-form";

export default function Registration() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Scout Registration</h1>
        <p className="text-muted-foreground">
          Register a new scout with the Boy Scouts of the Philippines
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <RegistrationForm onSubmit={(data) => console.log("Registration submitted:", data)} />
      </div>
    </div>
  );
}
