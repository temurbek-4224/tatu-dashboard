/**
 * InteractiveArea — server component that routes to the correct client-side
 * interactive program based on programType.
 *
 * To add a new program:
 * 1. Create a "use client" component in ./programs/
 * 2. Import it here and add it to the `programs` map
 * 3. Add the new type to ProgramType in src/types/index.ts
 */

import { ProgramType } from "@/types";
import Calculator from "./programs/Calculator";
import Counter from "./programs/Counter";
import TextFormatter from "./programs/TextFormatter";
import InputOutput from "./programs/InputOutput";
import Placeholder from "./programs/Placeholder";

// Maps ProgramType → React component.
// Add new entries here as new interactive programs are developed.
const programs: Record<ProgramType, React.ComponentType> = {
  calculator: Calculator,
  counter: Counter,
  textFormatter: TextFormatter,
  inputOutput: InputOutput,
  placeholder: Placeholder,
};

interface InteractiveAreaProps {
  programType: ProgramType;
}

export default function InteractiveArea({ programType }: InteractiveAreaProps) {
  const Program = programs[programType];
  return <Program />;
}
