import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle } from "lucide-react";

type ParsingUsage = "atributivo" | "predicado" | "sustantivado";
type ParsingPerson = "1" | "2" | "3";
type ParsingGender = "m" | "f" | "c";
type ParsingNumber = "s" | "p" | "d";

interface NounParsingValue {
  person?: ParsingPerson;
  gender?: ParsingGender;
  number?: ParsingNumber;
  meaning?: string;
  usage?: ParsingUsage;
}

interface NounParsingExerciseProps {
  value: NounParsingValue;
  onChange: (value: NounParsingValue) => void;
  meanings: string[];
  persons?: ParsingPerson[];
  genders?: ParsingGender[];
  numbers?: ParsingNumber[];
  usages?: ParsingUsage[];
  allowDual?: boolean;
  isFinished: boolean;
  correctValue?: NounParsingValue;
  compact?: boolean;
}

export function NounParsingExercise({
  value,
  onChange,
  meanings,
  persons,
  genders,
  numbers,
  usages,
  allowDual = true,
  isFinished,
  correctValue,
  compact = false,
}: NounParsingExerciseProps) {
  const isCompact = compact;
  const personOptions = persons ?? [];
  const genderOptions: ParsingGender[] = genders ?? ["m", "f"];
  const numberOptions: ParsingNumber[] = numbers ?? (allowDual ? ["s", "p", "d"] : ["s", "p"]);
  const compactChipGridClass = isCompact
    ? "grid-cols-[repeat(auto-fit,minmax(80px,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(92px,1fr))]"
    : "grid-cols-[repeat(auto-fit,minmax(85px,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(120px,1fr))]";
  const meaningChipGridClass = "grid-cols-2 sm:grid-cols-4";

  const getDynamicGridClass = (optsCount: number) => {
    if (optsCount === 2) {
      return "grid-cols-2 sm:grid-cols-[repeat(auto-fit,minmax(120px,1fr))]";
    }
    if (optsCount === 3) {
      return "grid-cols-3 sm:grid-cols-[repeat(auto-fit,minmax(120px,1fr))]";
    }
    return compactChipGridClass;
  };

  const updateValue = (update: Partial<NounParsingValue>) => {
    if (isFinished) return;
    onChange({ ...value, ...update });
  };

  const isMatched = (field: keyof NounParsingValue, option: string) => value[field] === option;
  const isCorrect = (field: keyof NounParsingValue, option: string) =>
    isFinished && correctValue?.[field] === option;
  const isWrong = (field: keyof NounParsingValue, option: string) =>
    isFinished && value[field] === option && correctValue?.[field] !== option;

  const usageLabelMap: Record<ParsingUsage, string> = {
    atributivo: "Atributivo",
    predicado: "Predicado",
    sustantivado: "Sustantivado",
  };

  const personLabelMap: Record<ParsingPerson, string> = {
    "1": "1ª",
    "2": "2ª",
    "3": "3ª",
  };

  const genderLabelMap: Record<ParsingGender, string> = {
    m: "Masculino",
    f: "Femenino",
    c: "Común",
  };

  const numberLabelMap: Record<ParsingNumber, string> = {
    s: "Singular",
    p: "Plural",
    d: "Dual",
  };

  const renderChip = (
    field: keyof NounParsingValue,
    option: string,
    label: string,
    chipKey?: string,
    multiline = false,
  ) => {
    const selected = isMatched(field, option);
    const correct = isCorrect(field, option);
    const wrong = isWrong(field, option);

    return (
      <button
        key={chipKey ?? `${field}-${option}`}
        type="button"
        disabled={isFinished}
        onClick={() => updateValue({ [field]: option })}
        className={cn(
          "relative flex items-center rounded-xl border-2 font-bold transition-all",
          multiline
            ? "justify-start text-left whitespace-normal leading-snug"
            : "justify-center whitespace-nowrap text-center",
          isCompact
            ? "px-1.5 min-[375px]:px-2.5 sm:px-3 lg:px-4 py-1.5 min-[375px]:py-2 sm:py-2.5 lg:py-3 text-[10px] min-[375px]:text-xs sm:text-sm lg:text-[15px] lg:border-b-[3px]"
            : "px-1.5 min-[375px]:px-2.5 sm:px-4 lg:px-6 py-1.5 min-[375px]:py-2 sm:py-3 lg:py-4 text-[10px] min-[375px]:text-xs sm:text-[15px] lg:text-base lg:border-b-4",
          multiline && "min-h-[52px] sm:min-h-[64px]",
          isFinished
            ? correct
              ? "bg-[#D7FFB7] border-[#58CC02] text-[#58A700] z-10"
              : wrong
                ? "bg-[#FFDADC] border-[#FF4B4B] text-[#EA2B2B] opacity-80"
                : "bg-[#F7F7F7] border-[#E5E5E5] text-[#AFAFAF] opacity-50 border-b-2 lg:border-b-2"
            : selected
              ? "bg-[#DDF4FF] border-[#84D8FF] text-[#1899D6] border-b-2 lg:border-b-2 translate-y-[2px]"
              : "bg-white border-[#E5E5E5] text-[#4B4B4B] hover:bg-[#F7F7F7] active:border-b-2 active:translate-y-[2px]",
        )}
      >
        {label}
        {isFinished && correct && (
          <CheckCircle2 className="absolute -top-2 -right-2 w-5 h-5 text-[#58CC02] bg-white rounded-full" />
        )}
        {isFinished && wrong && (
          <XCircle className="absolute -top-2 -right-2 w-5 h-5 text-[#FF4B4B] bg-white rounded-full" />
        )}
      </button>
    );
  };

  return (
    <div
      className={cn(
        "w-full max-w-none mx-auto flex flex-col bg-white rounded-3xl border-2 border-[#E5E5E5] shadow-sm",
        isCompact
          ? "gap-2 sm:gap-2.5 lg:gap-3 p-2 sm:p-3 lg:p-4"
          : "gap-3 sm:gap-4 lg:gap-5 p-3 sm:p-4 lg:p-5",
      )}
    >
      {/* Persona */}
      {personOptions.length > 0 && (
        <>
          <div className={cn("flex flex-col", isCompact ? "gap-1" : "gap-1.5 sm:gap-2.5 lg:gap-3")}>
            <h3 className="text-[#AFAFAF] font-black uppercase tracking-widest text-[10px] sm:text-xs lg:text-sm">
              Persona
            </h3>
            <div
              className={cn(
                "grid",
                getDynamicGridClass(personOptions.length),
                isCompact ? "gap-2 lg:gap-3" : "gap-2 sm:gap-3 lg:gap-4",
              )}
            >
              {personOptions.map((person) =>
                renderChip("person", person, personLabelMap[person], `person-${person}`),
              )}
            </div>
          </div>

          <div className="w-full h-px bg-[#E5E5E5]" />
        </>
      )}

      {/* Género */}
      <div className={cn("flex flex-col", isCompact ? "gap-1" : "gap-1.5 sm:gap-2.5 lg:gap-3")}>
        <h3 className="text-[#AFAFAF] font-black uppercase tracking-widest text-[10px] sm:text-xs lg:text-sm">
          Género
        </h3>
        <div
          className={cn(
            "grid",
            getDynamicGridClass(genderOptions.length),
            isCompact ? "gap-2 lg:gap-3" : "gap-2 sm:gap-3 lg:gap-4",
          )}
        >
          {genderOptions.map((gender) =>
            renderChip("gender", gender, genderLabelMap[gender], `gender-${gender}`),
          )}
        </div>
      </div>

      <div className="w-full h-px bg-[#E5E5E5]" />

      {/* Número */}
      <div className={cn("flex flex-col", isCompact ? "gap-1" : "gap-1.5 sm:gap-2.5 lg:gap-3")}>
        <h3 className="text-[#AFAFAF] font-black uppercase tracking-widest text-[10px] sm:text-xs lg:text-sm">
          Número
        </h3>
        <div
          className={cn(
            "grid",
            getDynamicGridClass(numberOptions.length),
            isCompact ? "gap-2 lg:gap-3" : "gap-2 sm:gap-3 lg:gap-4",
          )}
        >
          {numberOptions.map((number) =>
            renderChip("number", number, numberLabelMap[number], `number-${number}`),
          )}
        </div>
      </div>

      <div className="w-full h-px bg-[#E5E5E5]" />

      {/* Significado */}
      <div className={cn("flex flex-col", isCompact ? "gap-1" : "gap-1.5 sm:gap-2.5 lg:gap-3")}>
        <h3 className="text-[#AFAFAF] font-black uppercase tracking-widest text-[10px] sm:text-xs lg:text-sm">
          Definición
        </h3>
        <div
          className={cn(
            "grid",
            meaningChipGridClass,
            isCompact ? "gap-2 lg:gap-3" : "gap-2 sm:gap-3 lg:gap-4",
          )}
        >
          {meanings.map((meaning, index) =>
            renderChip("meaning", meaning, meaning, `meaning-${meaning}-${index}`, true),
          )}
        </div>
      </div>

      {usages && usages.length > 0 && (
        <>
          <div className="w-full h-px bg-[#E5E5E5]" />

          <div className={cn("flex flex-col", isCompact ? "gap-1" : "gap-1.5 sm:gap-2.5 lg:gap-3")}>
            <h3 className="text-[#AFAFAF] font-black uppercase tracking-widest text-[10px] sm:text-xs lg:text-sm">
              Uso Adjetival
            </h3>
            <div
              className={cn(
                "grid grid-cols-3 sm:grid-cols-3",
                isCompact ? "gap-2 lg:gap-3" : "gap-2 sm:gap-3 lg:gap-4",
              )}
            >
              {usages.map((usage) =>
                renderChip("usage", usage, usageLabelMap[usage], `usage-${usage}`),
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
