import { modules } from "@/data/modules";
import { ModuleIcon } from "./ModuleIcon";

export function HomeScreen() {
  return (
    <div className="min-h-screen bg-neutral-50 px-4">
      <div className="mx-auto max-w-6xl py-12">
        <header className="mb-12 text-center">
          <img
            src="https://cdn.worldvectorlogo.com/logos/nkumba-uninersity.svg"
            alt="Nkumba University Library"
            className="mb-2 h-16 mx-auto"
          />
          <p className="text-lg text-neutral-600">
            Access all library services from one place
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {modules.map((module) => (
            <ModuleIcon key={module.id} module={module} />
          ))}
        </div>
      </div>
    </div>
  );
}
